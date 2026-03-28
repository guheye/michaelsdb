import { db, schema } from "@/lib/db";
import { eq, sql } from "drizzle-orm";
import { SOURCE_BIAS_MAP, biasToScore, isLeftLeaning, isRightLeaning } from "@/lib/bias/ratings";
import type { BiasRating, BiasVerdict } from "@/types";

/**
 * Recompute bias counts, verdict, and blindspot flags for a single story.
 */
export function recomputeStoryMetrics(storyId: number): void {
  // Get all articles in this story with their source names
  const articles = db
    .select({
      sourceName: schema.articles.sourceName,
    })
    .from(schema.articles)
    .where(eq(schema.articles.storyId, storyId))
    .all();

  if (articles.length === 0) return;

  // Dedupe by source — count each source once per story
  const uniqueSources = [...new Set(articles.map((a) => a.sourceName))];

  let leftCount = 0;
  let centerCount = 0;
  let rightCount = 0;
  let totalScore = 0;
  let ratedCount = 0;

  for (const source of uniqueSources) {
    const rating = SOURCE_BIAS_MAP[source] as BiasRating | undefined;
    if (!rating) continue;

    ratedCount++;
    totalScore += biasToScore(rating);

    if (isLeftLeaning(rating)) {
      leftCount++;
    } else if (isRightLeaning(rating)) {
      rightCount++;
    } else {
      centerCount++;
    }
  }

  // Compute verdict
  let biasVerdict: BiasVerdict;
  if (uniqueSources.length === 1) {
    biasVerdict = "Single Source";
  } else if (ratedCount === 0) {
    biasVerdict = "Balanced Coverage";
  } else {
    const avg = totalScore / ratedCount;
    if (avg <= -2.0) {
      biasVerdict = "Heavily Left-Covered";
    } else if (avg <= -0.75) {
      biasVerdict = "Left-Leaning Coverage";
    } else if (avg <= 0.75) {
      biasVerdict = "Balanced Coverage";
    } else if (avg <= 2.0) {
      biasVerdict = "Right-Leaning Coverage";
    } else {
      biasVerdict = "Heavily Right-Covered";
    }
  }

  // Compute blindspot flags
  // Left Blindspot = right covers it (3+), left doesn't (0)
  const isBlindspotLeft = rightCount >= 3 && leftCount === 0 ? 1 : 0;
  // Right Blindspot = left covers it (3+), right doesn't (0)
  const isBlindspotRight = leftCount >= 3 && rightCount === 0 ? 1 : 0;

  db.update(schema.stories)
    .set({
      articleCount: uniqueSources.length,
      leftCount,
      centerCount,
      rightCount,
      biasVerdict,
      isBlindspotLeft,
      isBlindspotRight,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(schema.stories.id, storyId))
    .run();
}

/**
 * Recompute metrics for all stories that were recently updated/created.
 */
export function recomputeAllStoryMetrics(): { updated: number; errors: string[] } {
  const errors: string[] = [];

  // Get all stories that have articles assigned
  const stories = db
    .select({ id: schema.stories.id })
    .from(schema.stories)
    .all();

  let updated = 0;
  for (const story of stories) {
    try {
      recomputeStoryMetrics(story.id);
      updated++;
    } catch (err) {
      errors.push(
        `Failed to compute metrics for story ${story.id}: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  return { updated, errors };
}
