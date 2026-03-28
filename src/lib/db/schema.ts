import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const feeds = sqliteTable("feeds", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
  tier: integer("tier").notNull().default(2),
  defaultCategory: text("default_category"),
  lastFetchedAt: text("last_fetched_at"),
  isActive: integer("is_active").notNull().default(1),
});

export const articles = sqliteTable("articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  feedId: integer("feed_id").references(() => feeds.id),
  guid: text("guid").notNull().unique(),
  originalUrl: text("original_url").notNull(),
  originalTitle: text("original_title").notNull(),
  rewrittenTitle: text("rewritten_title"),
  author: text("author"),
  sourceName: text("source_name").notNull(),
  excerpt: text("excerpt"),
  imageUrl: text("image_url"),
  publishedAt: text("published_at").notNull(),
  fetchedAt: text("fetched_at").notNull(),
  category: text("category"),
  priority: integer("priority").notNull().default(5),
  status: text("status").notNull().default("new"),
  aiProcessedAt: text("ai_processed_at"),
  analysis: text("analysis"),
});

export const aggregationLogs = sqliteTable("aggregation_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  feedId: integer("feed_id").references(() => feeds.id),
  startedAt: text("started_at").notNull(),
  completedAt: text("completed_at"),
  articlesFound: integer("articles_found"),
  articlesNew: integer("articles_new"),
  error: text("error"),
});
