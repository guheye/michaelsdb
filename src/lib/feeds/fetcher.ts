import Parser from "rss-parser";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { FEED_SOURCES, SHADOW_FEED_SOURCES } from "./sources";
import { userAgent } from "@/lib/brand";
import { delay } from "@/lib/utils/delay";

/** Pause between RSS fetches to avoid hammering publishers (ms). */
const FEED_FETCH_GAP_MS = Number(process.env.FEED_FETCH_GAP_MS) || 750;

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": userAgent(),
  },
});

function stripHtml(html: string | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);
}

function extractImageUrl(item: Parser.Item): string | null {
  // Try media content (single object)
  const itemAny = item as Record<string, unknown>;
  const media = itemAny["media:content"] as
    | { $?: { url?: string } }
    | undefined;
  if (media?.$?.url) return media.$.url;

  // Try media:thumbnail
  const thumb = itemAny["media:thumbnail"] as
    | { $?: { url?: string } }
    | undefined;
  if (thumb?.$?.url) return thumb.$.url;

  // Try media:group > media:content (common in YouTube, some news RSS)
  const mediaGroup = itemAny["media:group"] as
    | { "media:content"?: { $?: { url?: string } } }
    | undefined;
  if (mediaGroup?.["media:content"]?.$?.url) return mediaGroup["media:content"].$.url;

  // Try enclosure (podcasts and some news feeds)
  if (item.enclosure?.url && item.enclosure.type?.startsWith("image/")) {
    return item.enclosure.url;
  }
  // Some feeds use enclosure for images without proper type
  if (item.enclosure?.url && /\.(jpg|jpeg|png|webp|gif)/i.test(item.enclosure.url)) {
    return item.enclosure.url;
  }

  // Try to find img tag in content:encoded or content
  const content = (itemAny["content:encoded"] as string) || item.content || "";
  const imgMatch = (content as string).match(/<img[^>]+src=["']([^"']+)["']/);
  if (imgMatch) return imgMatch[1];

  // Try to find og:image in description (some feeds embed it)
  const description = item.summary || (itemAny.description as string) || "";
  const descImgMatch = description.match(/<img[^>]+src=["']([^"']+)["']/);
  if (descImgMatch) return descImgMatch[1];

  return null;
}

export async function fetchAllFeeds(category?: string): Promise<{
  totalNew: number;
  errors: string[];
}> {
  let totalNew = 0;
  const errors: string[] = [];

  const allSources = [...FEED_SOURCES, ...SHADOW_FEED_SOURCES];
  const sources = category
    ? allSources.filter((s) => s.defaultCategory === category)
    : allSources;

  // Ensure feeds exist in DB — single SELECT then check in-memory (avoids N+1)
  const existingUrls = new Set(
    db.select({ url: schema.feeds.url }).from(schema.feeds).all().map((f) => f.url)
  );
  for (const source of sources) {
    if (!existingUrls.has(source.url)) {
      db.insert(schema.feeds)
        .values({
          name: source.name,
          url: source.url,
          tier: source.tier,
          defaultCategory: source.defaultCategory,
          isActive: 1,
          isShadow: source.isShadow ? 1 : 0,
        })
        .run();
    }
  }

  const activeFeeds = db
    .select()
    .from(schema.feeds)
    .where(eq(schema.feeds.isActive, 1))
    .all();

  for (let i = 0; i < activeFeeds.length; i++) {
    const feed = activeFeeds[i];
    if (i > 0) await delay(FEED_FETCH_GAP_MS);
    const startedAt = new Date().toISOString();
    try {
      const parsedFeed = await parser.parseURL(feed.url);
      const items = parsedFeed.items || [];
      let newCount = 0;

      for (const item of items) {
        const guid =
          item.guid || item.link || item.title || `${feed.id}-${Date.now()}`;
        const link = item.link;
        if (!link || !item.title) continue;

        // Check for duplicate
        const existing = db
          .select()
          .from(schema.articles)
          .where(eq(schema.articles.guid, guid))
          .get();

        if (existing) continue;

        const sourceConfig = allSources.find((s) => s.url === feed.url);
        const isShadow = sourceConfig?.isShadow ? 1 : 0;

        db.insert(schema.articles)
          .values({
            feedId: feed.id,
            guid,
            originalUrl: link,
            originalTitle: item.title,
            author: item.creator || item.author || null,
            sourceName: feed.name,
            excerpt: stripHtml(
              item.contentSnippet || item.content || item.summary
            ),
            imageUrl: extractImageUrl(item),
            publishedAt: item.isoDate || new Date().toISOString(),
            fetchedAt: new Date().toISOString(),
            category: sourceConfig?.defaultCategory || null,
            priority: 5,
            status: isShadow ? "shadow" : "new",
            isShadow,
          })
          .run();

        newCount++;
      }

      totalNew += newCount;

      // Update feed timestamp
      db.update(schema.feeds)
        .set({ lastFetchedAt: new Date().toISOString() })
        .where(eq(schema.feeds.id, feed.id))
        .run();

      // Log success
      db.insert(schema.aggregationLogs)
        .values({
          feedId: feed.id,
          startedAt,
          completedAt: new Date().toISOString(),
          articlesFound: items.length,
          articlesNew: newCount,
        })
        .run();
    } catch (err) {
      const errorMsg = `Failed to fetch ${feed.name}: ${err instanceof Error ? err.message : String(err)}`;
      errors.push(errorMsg);

      db.insert(schema.aggregationLogs)
        .values({
          feedId: feed.id,
          startedAt,
          completedAt: new Date().toISOString(),
          articlesFound: 0,
          articlesNew: 0,
          error: errorMsg,
        })
        .run();
    }
  }

  return { totalNew, errors };
}
