import fs from "fs";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";

/**
 * During `next build`, Next loads server modules in workers to collect page data.
 * We must not touch disk paths like Render's SQLITE_PATH=/var/data/... (no disk at build time).
 * Use an in-memory DB for the build only; runtime uses the real file.
 */
function isProductionBuild(): boolean {
  return (
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.npm_lifecycle_event === "build"
  );
}

function resolveDbFilePath(): string {
  if (isProductionBuild()) {
    return ":memory:";
  }

  const raw = process.env.SQLITE_PATH?.trim();
  if (raw) {
    const resolved = path.resolve(raw);
    const dir = path.dirname(resolved);
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      return resolved;
    } catch {
      console.warn(
        `[db] SQLITE_PATH "${raw}" is not usable (mkdir failed); falling back to cwd`
      );
    }
  }

  return path.join(process.cwd(), "michaelsdb.db");
}

const DB_PATH = resolveDbFilePath();

const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });

// Initialize tables if they don't exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS feeds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    tier INTEGER NOT NULL DEFAULT 2,
    default_category TEXT,
    last_fetched_at TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    is_shadow INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    feed_id INTEGER REFERENCES feeds(id),
    guid TEXT NOT NULL UNIQUE,
    original_url TEXT NOT NULL,
    original_title TEXT NOT NULL,
    rewritten_title TEXT,
    author TEXT,
    source_name TEXT NOT NULL,
    excerpt TEXT,
    image_url TEXT,
    published_at TEXT NOT NULL,
    fetched_at TEXT NOT NULL,
    category TEXT,
    priority INTEGER NOT NULL DEFAULT 5,
    status TEXT NOT NULL DEFAULT 'new',
    ai_processed_at TEXT,
    analysis TEXT,
    story_id INTEGER,
    is_shadow INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS aggregation_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    feed_id INTEGER REFERENCES feeds(id),
    started_at TEXT NOT NULL,
    completed_at TEXT,
    articles_found INTEGER,
    articles_new INTEGER,
    error TEXT
  );

  CREATE TABLE IF NOT EXISTS stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    summary TEXT,
    article_count INTEGER NOT NULL DEFAULT 0,
    left_count INTEGER NOT NULL DEFAULT 0,
    center_count INTEGER NOT NULL DEFAULT 0,
    right_count INTEGER NOT NULL DEFAULT 0,
    bias_verdict TEXT,
    is_blindspot_left INTEGER NOT NULL DEFAULT 0,
    is_blindspot_right INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS source_bias_ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_name TEXT NOT NULL UNIQUE,
    bias_rating TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
  CREATE INDEX IF NOT EXISTS idx_articles_category_priority ON articles(category, priority, published_at);
  CREATE INDEX IF NOT EXISTS idx_articles_original_url ON articles(original_url);
  CREATE INDEX IF NOT EXISTS idx_stories_updated ON stories(updated_at);
  CREATE INDEX IF NOT EXISTS idx_stories_blindspot ON stories(is_blindspot_left, is_blindspot_right);
`);

// Migrations: add columns to existing tables (safe to re-run — ignores "already exists")
const migrations = [
  `ALTER TABLE articles ADD COLUMN analysis TEXT`,
  `ALTER TABLE articles ADD COLUMN story_id INTEGER`,
  `ALTER TABLE articles ADD COLUMN is_shadow INTEGER NOT NULL DEFAULT 0`,
  `ALTER TABLE feeds ADD COLUMN is_shadow INTEGER NOT NULL DEFAULT 0`,
  `ALTER TABLE stories ADD COLUMN framing_verdict TEXT`,
  `ALTER TABLE stories ADD COLUMN framing_analysis TEXT`,
];
for (const m of migrations) {
  try { sqlite.exec(m); } catch { /* column already exists */ }
}

// Indexes on migrated columns (must run AFTER migrations add the columns)
try {
  sqlite.exec(`
    CREATE INDEX IF NOT EXISTS idx_articles_story_id ON articles(story_id);
    CREATE INDEX IF NOT EXISTS idx_articles_is_shadow ON articles(is_shadow);
  `);
} catch { /* indexes may already exist */ }

export { schema };

// Seed bias ratings on startup (lazy — runs once per process)
// Uses dynamic import to avoid circular dependency (ratings.ts imports db)
if (!isProductionBuild()) {
  import("@/lib/bias/ratings").then(({ seedBiasRatings }) => seedBiasRatings());
}
