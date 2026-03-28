import type { BiasRating } from "@/types";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

/**
 * Static source-to-bias mapping based on AllSides ratings.
 * Covers all FEED_SOURCES and SHADOW_FEED_SOURCES.
 */
export const SOURCE_BIAS_MAP: Record<string, BiasRating> = {
  // === Main feeds ===
  // Tier 1
  "National Review": "Right",
  "Reason": "Lean Right",
  "WSJ Opinion": "Lean Right",
  "Marginal Revolution": "Lean Right",
  "The Dispatch": "Lean Right",
  // Tier 2 — News
  "The Hill": "Center",
  "Reuters": "Center",
  "AP News": "Center",
  "Lawfare": "Lean Left",
  "RealClearPolitics": "Center",
  // Tier 3 — Ideas
  "City Journal": "Right",
  "Commentary": "Right",
  "Quillette": "Center",
  "The New Atlantis": "Lean Right",
  "American Enterprise Institute": "Right",
  // Tier 4 — Cross-Spectrum
  "Brookings": "Lean Left",
  "Cato Institute": "Lean Right",
  "Discourse Magazine": "Lean Right",
  // Tech
  "Hacker News": "Center",
  "Ars Technica": "Lean Left",
  "Wired": "Lean Left",
  "MIT Technology Review AI": "Center",
  "The Verge AI": "Lean Left",
  // Markets
  "Bloomberg": "Lean Left",
  "Financial Times": "Center",
  "WSJ Markets": "Center",
  // Art & Luxury (neutral — not politically oriented)
  "Sotheby's": "Center",
  "Christie's": "Center",
  "Robb Report": "Center",
  "Architectural Digest": "Center",
  "Artnet News": "Center",
  "duPont Registry": "Center",
  // Firearms
  "American Rifleman": "Right",
  "Shooting Illustrated": "Right",
  // Sports
  "STL Cardinals": "Center",

  // === Shadow feeds ===
  "New York Times": "Lean Left",
  "Washington Post": "Lean Left",
  "NPR": "Lean Left",
  "The Atlantic": "Lean Left",
  "The Guardian US": "Lean Left",
  "PBS NewsHour": "Center",
  "USA Today": "Lean Left",
  "CNN": "Left",
  "MSNBC": "Left",
  "Vox": "Left",
  "Slate": "Left",
  "Mother Jones": "Left",
  "HuffPost": "Left",
  "BBC News": "Center",
  "Jacobin": "Far Left",
};

/** Numeric scale for computing bias verdicts. */
const BIAS_SCORE: Record<BiasRating, number> = {
  "Far Left": -3,
  "Left": -2,
  "Lean Left": -1,
  "Center": 0,
  "Lean Right": 1,
  "Right": 2,
  "Far Right": 3,
};

export function biasToScore(rating: BiasRating): number {
  return BIAS_SCORE[rating];
}

/** Returns true if a rating is on the left side of the spectrum. */
export function isLeftLeaning(rating: BiasRating): boolean {
  return BIAS_SCORE[rating] < 0;
}

/** Returns true if a rating is on the right side of the spectrum. */
export function isRightLeaning(rating: BiasRating): boolean {
  return BIAS_SCORE[rating] > 0;
}

/**
 * Seed the source_bias_ratings table from the static map.
 * Uses INSERT OR REPLACE to handle both initial seed and updates.
 */
export function seedBiasRatings(): void {
  const now = new Date().toISOString();
  for (const [sourceName, biasRating] of Object.entries(SOURCE_BIAS_MAP)) {
    const existing = db
      .select()
      .from(schema.sourceBiasRatings)
      .where(eq(schema.sourceBiasRatings.sourceName, sourceName))
      .get();

    if (!existing) {
      db.insert(schema.sourceBiasRatings)
        .values({ sourceName, biasRating, updatedAt: now })
        .run();
    } else if (existing.biasRating !== biasRating) {
      db.update(schema.sourceBiasRatings)
        .set({ biasRating, updatedAt: now })
        .where(eq(schema.sourceBiasRatings.sourceName, sourceName))
        .run();
    }
  }
}
