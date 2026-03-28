import { NextResponse } from "next/server";
import { fetchAllFeeds } from "@/lib/feeds/fetcher";
import { rewriteHeadlines } from "@/lib/ai/rewriter";
import { fetchMissingImages } from "@/lib/feeds/images";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    // Step 1: Fetch all RSS feeds
    const feedResult = await fetchAllFeeds();

    // Step 2: Rewrite headlines with AI (multiple batches if needed)
    let totalRewritten = 0;
    const aiErrors: string[] = [];
    let batch = 0;
    const maxBatches = 10;

    while (batch < maxBatches) {
      const result = await rewriteHeadlines(15);
      totalRewritten += result.processed;
      aiErrors.push(...result.errors);
      if (result.processed === 0) break;
      batch++;
    }

    // Step 3: Fetch OG images for articles missing images
    const imageResult = await fetchMissingImages(30);

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

// Also support GET for easy browser testing
export async function GET() {
  return POST();
}
