import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq, and, isNull } from "drizzle-orm";
import { fetchMissingImages } from "@/lib/feeds/images";

export const dynamic = "force-dynamic";

/**
 * Test endpoint: inserts a couple mock articles with null imageUrl into the DB,
 * then runs the image fetcher pipeline to fill them via Unsplash.
 */
export async function GET() {
  try {
    const testArticles = [
      {
        feedId: 1,
        guid: "test-img-1",
        originalUrl: "https://example.com/fed-rates",
        originalTitle: "Federal Reserve Holds Rates Steady as Inflation Data Complicates the Path Forward",
        rewrittenTitle: "Federal Reserve Holds Rates Steady as Inflation Data Complicates the Path Forward",
        author: "Editorial Board",
        sourceName: "WSJ Opinion",
        excerpt: "The central bank's decision reflects genuine uncertainty.",
        imageUrl: null,
        publishedAt: new Date().toISOString(),
        fetchedAt: new Date().toISOString(),
        category: "Political Economy",
        priority: 9,
        status: "ready" as const,
        aiProcessedAt: new Date().toISOString(),
      },
      {
        feedId: 1,
        guid: "test-img-2",
        originalUrl: "https://example.com/senate-trade",
        originalTitle: "Senate Trade Bill Would Rewrite Tariff Authority — With Bipartisan Support",
        rewrittenTitle: "Senate Trade Bill Would Rewrite Tariff Authority — With Bipartisan Support",
        author: "Sarah Mitchell",
        sourceName: "The Hill",
        excerpt: "A rare cross-party coalition aims to reclaim congressional trade powers.",
        imageUrl: null,
        publishedAt: new Date().toISOString(),
        fetchedAt: new Date().toISOString(),
        category: "Policy",
        priority: 8,
        status: "ready" as const,
        aiProcessedAt: new Date().toISOString(),
      },
    ];

    // Ensure a feed exists for the foreign key
    const existingFeed = db.select().from(schema.feeds).where(eq(schema.feeds.id, 1)).get();
    if (!existingFeed) {
      db.insert(schema.feeds).values({
        name: "Test Feed",
        url: "https://example.com/feed",
        tier: 1,
        defaultCategory: "News",
        isActive: 1,
      }).run();
    }

    // Insert test articles (upsert by guid)
    for (const article of testArticles) {
      const existing = db
        .select()
        .from(schema.articles)
        .where(eq(schema.articles.guid, article.guid))
        .get();

      if (existing) {
        // Reset imageUrl to null for re-testing
        db.update(schema.articles)
          .set({ imageUrl: null })
          .where(eq(schema.articles.guid, article.guid))
          .run();
      } else {
        db.insert(schema.articles).values(article).run();
      }
    }

    // Count articles missing images before
    const beforeCount = db
      .select()
      .from(schema.articles)
      .where(and(eq(schema.articles.status, "ready"), isNull(schema.articles.imageUrl)))
      .all().length;

    // Run the image fetcher
    const result = await fetchMissingImages(10);

    // Check what images were found
    const afterArticles = db
      .select({
        guid: schema.articles.guid,
        title: schema.articles.originalTitle,
        imageUrl: schema.articles.imageUrl,
      })
      .from(schema.articles)
      .where(eq(schema.articles.status, "ready"))
      .all();

    const testResults = afterArticles
      .filter((a) => a.guid.startsWith("test-img-"))
      .map((a) => ({
        title: a.title.substring(0, 50),
        imageUrl: a.imageUrl,
        hasImage: !!a.imageUrl,
      }));

    return NextResponse.json({
      success: true,
      missingBefore: beforeCount,
      fetchResult: result,
      testArticles: testResults,
      unsplashKeySet: !!process.env.UNSPLASH_ACCESS_KEY,
      anthropicKeySet: !!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY.includes("your-api-key"),
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      },
      { status: 500 }
    );
  }
}
