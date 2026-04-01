import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { fetchAllFeeds } from "@/lib/feeds/fetcher";
import { rewriteHeadlines } from "@/lib/ai/rewriter";
import { clusterArticles } from "@/lib/ai/clusterer";
import { recomputeAllStoryMetrics } from "@/lib/ai/story-metrics";
import { fetchMissingImages } from "@/lib/feeds/images";
import { acquireAggregateSlot } from "@/lib/server/aggregate-rate-limit";

export const dynamic = "force-dynamic";

function checkSecret(request: NextRequest): boolean {
  const secret = process.env.AGGREGATE_SECRET;
  if (!secret) return true; // guard is opt-in; if env var not set, allow (dev convenience)
  const provided = request.headers.get("x-aggregate-secret") ?? "";
  const expected = Buffer.from(secret, "utf8");
  // Pad/truncate provided to the same byte length so timingSafeEqual never throws
  const probe = Buffer.alloc(expected.length, 0);
  Buffer.from(provided, "utf8").copy(probe, 0, 0, expected.length);
  // Both length check and value check must pass; order doesn't matter for timing safety
  return provided.length === secret.length && timingSafeEqual(expected, probe);
}

export async function POST(request: NextRequest) {
  if (!checkSecret(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const category = request.nextUrl.searchParams.get("category") || undefined;

  const slot = acquireAggregateSlot();
  if (!slot.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: "Aggregate cooldown active. Try again shortly.",
        retryAfterSeconds: slot.retryAfterSeconds,
      },
      {
        status: 429,
        headers: { "Retry-After": String(slot.retryAfterSeconds) },
      }
    );
  }

  try {
    // Step 1: Fetch RSS feeds (optionally filtered by category)
    const feedResult = await fetchAllFeeds(category);

    // Step 2: Rewrite headlines with AI (multiple batches if needed)
    let totalRewritten = 0;
    const aiErrors: string[] = [];
    let batch = 0;
    const maxBatches = 10;

    while (batch < maxBatches) {
      const result = await rewriteHeadlines(15, category);
      totalRewritten += result.processed;
      aiErrors.push(...result.errors);
      if (result.processed === 0) break;
      batch++;
    }

    // Step 3: Cluster articles into stories
    const clusterResult = await clusterArticles();

    // Step 4: Recompute bias metrics for all stories
    const metricsResult = recomputeAllStoryMetrics();

    // Step 5: Fetch OG images for articles missing images
    const imageResult = await fetchMissingImages(30, category);

    return NextResponse.json({
      success: true,
      feeds: {
        newArticles: feedResult.totalNew,
        errors: feedResult.errors,
      },
      ai: {
        rewritten: totalRewritten,
        batches: batch,
        errors: aiErrors,
      },
      clustering: {
        clustersCreated: clusterResult.clustersCreated,
        articlesAssigned: clusterResult.articlesAssigned,
        errors: clusterResult.errors,
      },
      metrics: {
        storiesUpdated: metricsResult.updated,
        errors: metricsResult.errors,
      },
      images: {
        updated: imageResult.updated,
        errors: imageResult.errors,
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
