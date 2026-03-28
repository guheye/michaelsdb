/** Code / internal identifier (not shown to readers). */
export const BRAND_SLUG = "michaelsdailybrief";

/** Short technical name (npm package, SQLite base filename, HTTP User-Agent). */
export const BRAND_SHORT = "michaelsdb";

/** User-facing publication name (UI copy, metadata, prompts). */
export const BRAND_DISPLAY = "Michael's Daily Brief";

/** Wordmark: serif half + sans half (reads as BRAND_DISPLAY). */
export const BRAND_WORDMARK_SERIF = "Michael\u2019s";
export const BRAND_WORDMARK_SANS = "Daily Brief";

/** Sans half on dark header/footer — cool gray (not white), thin strokes read correctly. */
export const BRAND_WORDMARK_SANS_ON_DARK = "#A0A0A0";

export function userAgent(suffix = ""): string {
  return `${BRAND_SHORT} News Aggregator/1.0${suffix}`;
}
