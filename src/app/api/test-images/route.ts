import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq, and, isNull } from "drizzle-orm";
import { fetchMissingImages } from "@/lib/feeds/images";

export const dynamic = "force-dynamic";

/**
 * Test endpoint for the image pipeline.
 *
 * ?mode=pollinations  — directly test AI image generation (no LLM needed)
 * ?mode=full          — run the full pipeline (OG → LLM → Unsplash → AI fallback)
 * (default)           — pollinations
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode") || "pollinations";

  try {
    if (mode === "pollinations") {
      return await testPollinations();
    }
    return await testFullPipeline();
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

/**
 * Directly tests Pollinations.ai image generation without needing Anthropic credits.
 */
async function testPollinations() {
  const queries = [
    "Federal Reserve building Washington DC",
    "US Senate chamber Capitol Hill",
    "stock market trading floor Wall Street",
  ];

  const results = await Promise.all(
    queries.map(async (query) => {
      const prompt = `editorial news photograph, ${query}, photojournalism style, high quality, no text, no watermark`;
      const apiKey = process.env.POLLINATIONS_API_KEY;
      const params = new URLSearchParams({
        width: "800",
        height: "500",
        nologo: "true",
        seed: String(Math.floor(Math.random() * 100000)),
        model: "flux",
      });
      if (apiKey) params.set("key", apiKey);

      const imageUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?${params}`;

      try {
        // First try GET (Pollinations generates on first request; HEAD may not work)
        const response = await fetch(imageUrl, {
          signal: AbortSignal.timeout(60000),
        });
        const contentType = response.headers.get("content-type") || "";
        let errorBody: string | null = null;
        if (!response.ok || !contentType.startsWith("image/")) {
          errorBody = await response.text().catch(() => null);
        }
        return {
          query,
          imageUrl,
          status: response.status,
          ok: response.ok && contentType.startsWith("image/"),
          contentType,
          errorBody: errorBody?.substring(0, 500),
        };
      } catch (err) {
        return {
          query,
          imageUrl,
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        };
      }
    })
  );

  // Write one successful AI image into a test article so we can view it on the site
  const firstSuccess = results.find((r) => r.ok);
  if (firstSuccess) {
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

    const testGuid = "test-ai-img";
    const existing = db.select().from(schema.articles).where(eq(schema.articles.guid, testGuid)).get();
    if (existing) {
      db.update(schema.articles)
        .set({ imageUrl: firstSuccess.imageUrl })
        .where(eq(schema.articles.guid, testGuid))
        .run();
    } else {
      db.insert(schema.articles).values({
        feedId: 1,
        guid: testGuid,
        originalUrl: "https://example.com/ai-image-test",
        originalTitle: "AI Image Generation Test — Pollinations.ai Integration",
        rewrittenTitle: "AI Image Generation Test — Pollinations.ai Integration",
        author: "Test",
        sourceName: "Test",
        excerpt: "Testing AI-generated images and the ArticleImage badge display.",
        imageUrl: firstSuccess.imageUrl,
        publishedAt: new Date().toISOString(),
        fetchedAt: new Date().toISOString(),
        category: "Tech",
        priority: 10,
        status: "ready" as const,
        aiProcessedAt: new Date().toISOString(),
      }).run();
    }
  }

  return NextResponse.json({
    success: true,
    mode: "pollinations",
    pollinationsKeySet: !!process.env.POLLINATIONS_API_KEY,
    results,
    testArticleCreated: !!firstSuccess,
    hint: firstSuccess
      ? "A test article with an AI image was saved. Visit the homepage to see the AI badge."
      : "No images generated successfully.",
  });
}

/**
 * Full pipeline test (requires Anthropic credits).
 */
async function testFullPipeline() {
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

  for (const article of testArticles) {
    const existing = db
      .select()
      .from(schema.articles)
      .where(eq(schema.articles.guid, article.guid))
      .get();

    if (existing) {
      db.update(schema.articles)
        .set({ imageUrl: null })
        .where(eq(schema.articles.guid, article.guid))
        .run();
    } else {
      db.insert(schema.articles).values(article).run();
    }
  }

  const beforeCount = db
    .select()
    .from(schema.articles)
    .where(and(eq(schema.articles.status, "ready"), isNull(schema.articles.imageUrl)))
    .all().length;

  const result = await fetchMissingImages(10);

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
    mode: "full",
    missingBefore: beforeCount,
    fetchResult: result,
    testArticles: testResults,
    unsplashKeySet: !!process.env.UNSPLASH_ACCESS_KEY,
    anthropicKeySet: !!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY.includes("your-api-key"),
  });
}
