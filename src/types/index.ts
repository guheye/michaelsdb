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
  status: "new" | "processing" | "ready" | "failed";
  aiProcessedAt: string | null;
  analysis: string | null;
}

export interface Feed {
  id: number;
  name: string;
  url: string;
  tier: number;
  defaultCategory: string | null;
  lastFetchedAt: string | null;
  isActive: number;
}

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
  "AI",
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
  AI: "ai",
  "Art & Luxury": "art-luxury",
  Firearms: "firearms",
  Markets: "markets",
  Sports: "sports",
};

export const SLUG_TO_CATEGORY: Record<string, Category> = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([k, v]) => [v, k as Category])
) as Record<string, Category>;
