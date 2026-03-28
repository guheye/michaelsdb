export interface Article {
  id: number;
  feedId: number;
  guid: string;
  originalUrl: string;
  originalTitle: string;
  rewrittenTitle: string | null;
  author: string | null;
  sourceName: string;
  excerpt: string | null;
  imageUrl: string | null;
  publishedAt: string;
  fetchedAt: string;
  category: string | null;
  priority: number;
  status: "new" | "processing" | "ready" | "failed" | "shadow";
  aiProcessedAt: string | null;
  analysis: string | null;
  storyId: number | null;
  isShadow: number;
}

export interface Feed {
  id: number;
  name: string;
  url: string;
  tier: number;
  defaultCategory: string | null;
  lastFetchedAt: string | null;
  isActive: number;
  isShadow: number;
}

export interface Story {
  id: number;
  slug: string;
  title: string;
  summary: string | null;
  articleCount: number;
  leftCount: number;
  centerCount: number;
  rightCount: number;
  biasVerdict: string | null;
  isBlindspotLeft: number;
  isBlindspotRight: number;
  framingVerdict: string | null;
  framingAnalysis: string | null;
  createdAt: string;
  updatedAt: string;
}

export type BiasRating =
  | "Far Left"
  | "Left"
  | "Lean Left"
  | "Center"
  | "Lean Right"
  | "Right"
  | "Far Right";

export type BiasVerdict =
  | "Heavily Left-Covered"
  | "Left-Leaning Coverage"
  | "Balanced Coverage"
  | "Right-Leaning Coverage"
  | "Heavily Right-Covered"
  | "Single Source";

export type FramingVerdict =
  | "Fairly Reported"
  | "Missing Context"
  | "Loaded Language"
  | "One-Sided"
  | "Mixed Framing";

export interface AggregationLog {
  id: number;
  feedId: number;
  startedAt: string;
  completedAt: string | null;
  articlesFound: number | null;
  articlesNew: number | null;
  error: string | null;
}

export const CATEGORIES = [
  "News",
  "Political Economy",
  "Policy",
  "Opinion",
  "Culture",
  "Foreign Affairs",
  "Science & Tech",
  "Books & Ideas",
  "Tech",
  "Artificial Intelligence",
  "Art & Luxury",
  "Firearms",
  "Markets",
  "Sports",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_SLUGS: Record<Category, string> = {
  News: "news",
  "Political Economy": "political-economy",
  Policy: "policy",
  Opinion: "opinion",
  Culture: "culture",
  "Foreign Affairs": "foreign-affairs",
  "Science & Tech": "science-tech",
  "Books & Ideas": "books-ideas",
  Tech: "tech",
  "Artificial Intelligence": "ai",
  "Art & Luxury": "art-luxury",
  Firearms: "firearms",
  Markets: "markets",
  Sports: "sports",
};

export const SLUG_TO_CATEGORY: Record<string, Category> = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([k, v]) => [v, k as Category])
) as Record<string, Category>;
