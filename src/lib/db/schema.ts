import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const feeds = sqliteTable("feeds", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
  tier: integer("tier").notNull().default(2),
  defaultCategory: text("default_category"),
  lastFetchedAt: text("last_fetched_at"),
  isActive: integer("is_active").notNull().default(1),
  isShadow: integer("is_shadow").notNull().default(0),
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
  storyId: integer("story_id"),
  isShadow: integer("is_shadow").notNull().default(0),
});

export const stories = sqliteTable("stories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary"),
  articleCount: integer("article_count").notNull().default(0),
  leftCount: integer("left_count").notNull().default(0),
  centerCount: integer("center_count").notNull().default(0),
  rightCount: integer("right_count").notNull().default(0),
  biasVerdict: text("bias_verdict"),
  isBlindspotLeft: integer("is_blindspot_left").notNull().default(0),
  isBlindspotRight: integer("is_blindspot_right").notNull().default(0),
  framingVerdict: text("framing_verdict"),
  framingAnalysis: text("framing_analysis"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const sourceBiasRatings = sqliteTable("source_bias_ratings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sourceName: text("source_name").notNull().unique(),
  biasRating: text("bias_rating").notNull(),
  updatedAt: text("updated_at").notNull(),
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
