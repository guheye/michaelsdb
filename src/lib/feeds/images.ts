import { db, schema } from "@/lib/db";
import { eq, and, isNull } from "drizzle-orm";
import { getAnthropicClient, AI_MODEL } from "@/lib/ai/client";
import { getTitle } from "@/lib/utils/articles";
import { userAgent } from "@/lib/brand";
import { delay } from "@/lib/utils/delay";

/** Pause between OG page fetches (ms). */
const OG_SCRAPE_GAP_MS = Number(process.env.OG_SCRAPE_GAP_MS) || 400;
/** Pause between Unsplash API calls (ms); keeps within typical API limits. */
const UNSPLASH_GAP_MS = Number(process.env.UNSPLASH_GAP_MS) || 1200;

/**
 * Attempts to fetch Open Graph images for articles that have no imageUrl.
 * Falls back to LLM-assisted Unsplash search if OG scraping fails.
 */
export async function fetchMissingImages(limit = 20, category?: string): Promise<{
  updated: number;
  errors: number;
}> {
  const conditions = [
    eq(schema.articles.status, "ready"),
    isNull(schema.articles.imageUrl),
  ];
  if (category) {
    conditions.push(eq(schema.articles.category, category) as ReturnType<typeof eq>);
  }
  const articles = db
    .select()
    .from(schema.articles)
    .where(and(...conditions))
    .limit(limit)
    .all();

  let updated = 0;
  let errors = 0;

  // First pass: try OG scraping (fast, no API cost)
  const stillMissing: typeof articles = [];

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    if (i > 0) await delay(OG_SCRAPE_GAP_MS);
    try {
      const imageUrl = await scrapeOgImage(article.originalUrl);
      if (imageUrl) {
        db.update(schema.articles)
          .set({ imageUrl })
          .where(eq(schema.articles.id, article.id))
          .run();
        updated++;
      } else {
        stillMissing.push(article);
      }
    } catch {
      stillMissing.push(article);
    }
  }

  // Second pass: LLM-assisted Unsplash search (with AI image fallback) for remaining
  if (stillMissing.length > 0) {
    const result = await fetchImagesWithLLM(stillMissing);
    updated += result.updated;
    errors += result.errors;
  }

  return { updated, errors };
}

/**
 * Uses Claude to extract ideal search terms from article headlines,
 * then queries Unsplash for relevant editorial photos.
 */
async function fetchImagesWithLLM(
  articles: { id: number; originalTitle: string; rewrittenTitle: string | null; category: string | null }[]
): Promise<{ updated: number; errors: number }> {
  let updated = 0;
  let errors = 0;

  try {
    const client = getAnthropicClient();

    // Batch headlines for a single LLM call to save tokens
    const headlineList = articles.map((a, i) => {
      const title = getTitle(a);
      return `${i + 1}. [${a.category || "News"}] "${title}"`;
    }).join("\n");

    const response = await client.messages.create(
      {
        model: AI_MODEL,
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `For each news headline below, suggest 1-3 Unsplash search keywords that would find a relevant, editorial-quality photo. Focus on concrete visual subjects (people, places, objects) rather than abstract concepts. Return JSON array of objects with "index" (1-based) and "query" (the search string).

${headlineList}

Return ONLY valid JSON, no explanation.`,
          },
        ],
      },
      { signal: AbortSignal.timeout(30_000) }
    );

    const block = response.content?.[0];
    const text = block?.type === "text" ? block.text : "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return { updated: 0, errors: articles.length };

    const suggestions: { index: number; query: string }[] = JSON.parse(jsonMatch[0]);

    // Query Unsplash for each suggestion, fall back to AI image generation
    for (let j = 0; j < suggestions.length; j++) {
      const suggestion = suggestions[j];
      if (j > 0) await delay(UNSPLASH_GAP_MS);
      const article = articles[suggestion.index - 1];
      if (!article) continue;

      try {
        let imageUrl = await searchUnsplash(suggestion.query);

        // Fallback: generate an AI image if Unsplash failed (rate limited or no results)
        if (!imageUrl) {
          imageUrl = await generateAIImage(suggestion.query);
        }

        if (imageUrl) {
          db.update(schema.articles)
            .set({ imageUrl })
            .where(eq(schema.articles.id, article.id))
            .run();
          updated++;
        }
      } catch {
        errors++;
      }
    }
  } catch {
    errors += articles.length;
  }

  return { updated, errors };
}

/** Timestamp (ms) until which Unsplash calls are skipped due to rate limiting. Resets after 1 hour. */
let unsplashRateLimitedUntil = 0;

/**
 * Search Unsplash for a photo matching the query.
 * Returns a sized image URL or null. Sets rate-limit flag on 429/403.
 */
async function searchUnsplash(query: string): Promise<string | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey || Date.now() < unsplashRateLimitedUntil) return null;

  try {
    const params = new URLSearchParams({
      query,
      per_page: "1",
      orientation: "landscape",
      content_filter: "high",
    });

    const response = await fetch(
      `https://api.unsplash.com/search/photos?${params}`,
      {
        headers: { Authorization: `Client-ID ${accessKey}` },
        signal: AbortSignal.timeout(5000),
      }
    );

    if (response.status === 429 || response.status === 403) {
      console.warn("Unsplash rate limited — pausing for 1 hour, switching to AI image fallback");
      unsplashRateLimitedUntil = Date.now() + 60 * 60 * 1000;
      return null;
    }

    if (!response.ok) return null;

    const data = await response.json();
    const photo = data.results?.[0];
    if (!photo) return null;

    // Use the "small" size (400px wide) for thumbnails, or "regular" (1080px) for hero
    return photo.urls?.regular || photo.urls?.small || null;
  } catch {
    return null;
  }
}

/**
 * Generates a photo-realistic image via Pollinations.ai.
 * Uses API key auth when available for priority generation.
 * Returns the image URL or null.
 */
async function generateAIImage(query: string): Promise<string | null> {
  try {
    const apiKey = process.env.POLLINATIONS_API_KEY;
    const prompt = `editorial news photograph, ${query}, photojournalism style, high quality, no text, no watermark`;
    const params = new URLSearchParams({
      width: "800",
      height: "500",
      nologo: "true",
      seed: String(Math.floor(Math.random() * 100000)),
    });
    if (apiKey) params.set("key", apiKey);

    const url = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?${params}`;

    // Verify the URL actually returns an image (Pollinations generates on first request)
    const response = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(20000),
    });

    if (response.ok) return url;
    return null;
  } catch {
    return null;
  }
}

/**
 * Scrapes a URL for Open Graph image, Twitter card image, or first large image.
 */
async function scrapeOgImage(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": userAgent(" (image discovery)"),
        Accept: "text/html",
      },
      redirect: "follow",
    });

    clearTimeout(timeout);

    if (!response.ok) return null;

    // Only read the first ~50KB to find meta tags (they're in <head>)
    const reader = response.body?.getReader();
    if (!reader) return null;

    let html = "";
    const decoder = new TextDecoder();
    let bytesRead = 0;
    const maxBytes = 50000;

    while (bytesRead < maxBytes) {
      const { done, value } = await reader.read();
      if (done) break;
      html += decoder.decode(value, { stream: true });
      bytesRead += value.length;
      if (html.includes("</head>")) break;
    }

    reader.cancel();

    // Try og:image
    const ogMatch = html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
    ) || html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i
    );
    if (ogMatch?.[1]) return resolveUrl(ogMatch[1], url);

    // Try twitter:image
    const twitterMatch = html.match(
      /<meta[^>]+(?:name|property)=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i
    ) || html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']twitter:image(?::src)?["']/i
    );
    if (twitterMatch?.[1]) return resolveUrl(twitterMatch[1], url);

    return null;
  } catch {
    return null;
  }
}

function resolveUrl(imageUrl: string, pageUrl: string): string {
  if (imageUrl.startsWith("http")) return imageUrl;
  try {
    return new URL(imageUrl, pageUrl).href;
  } catch {
    return imageUrl;
  }
}

/**
 * Returns a deterministic placeholder image URL based on article properties.
 * Used as a fallback when no real image is available.
 */
export function getPlaceholderImage(articleId: number, category?: string | null): string {
  const categoryTerms: Record<string, string> = {
    "News": "newspaper,capitol",
    "Political Economy": "economy,finance,market",
    "Policy": "government,capitol,congress",
    "Opinion": "debate,discussion,editorial",
    "Culture": "art,museum,culture",
    "Foreign Affairs": "globe,diplomacy,world",
    "Science & Tech": "technology,science,computer",
    "Books & Ideas": "books,library,reading",
    "Tech": "technology,computers,code",
    "Artificial Intelligence": "artificial-intelligence,robot,neural",
    "Art & Luxury": "art,luxury,gallery",
    "Firearms": "firearms,shooting,outdoors",
    "Markets": "finance,stocks,wallstreet",
    "Sports": "baseball,sports,stadium",
  };

  const term = category && categoryTerms[category]
    ? categoryTerms[category].split(",")[articleId % categoryTerms[category].split(",").length]
    : "news";

  return `https://picsum.photos/seed/${term}${articleId}/800/500`;
}
