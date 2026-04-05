import { getAnthropicClient, AI_MODEL } from "./client";
import { getTitle } from "@/lib/utils/articles";
import { db, schema } from "@/lib/db";
import { eq, and, isNull, inArray, gte, sql } from "drizzle-orm";

/** Categories unlikely to have cross-spectrum coverage — skip clustering. */
const SKIP_CATEGORIES = [
  "Art & Luxury",
  "Firearms",
  "Sports",
  "Markets",
];

const CLUSTERING_SYSTEM_PROMPT = `You are a news story clustering engine. Given a list of articles (with IDs, titles, sources, and excerpts), group articles that cover the SAME underlying news event or story.

Rules:
- Two articles are in the same cluster ONLY if they cover the same specific event, policy action, ruling, or development.
- Do NOT cluster articles that merely share a broad topic (e.g., two different AI stories that cover different developments).
- An article can belong to at most one cluster.
- Only include clusters with 2 or more articles. Singletons should be omitted from output.
- For each cluster, provide a neutral, factual canonical title (8-12 words).
- Generate a URL-safe slug from the title (lowercase, hyphens, no special chars).

Return ONLY valid JSON — no markdown, no explanation:
[
  {
    "cluster_title": "Senate Passes Bipartisan Trade Reform Bill",
    "slug": "senate-passes-bipartisan-trade-reform-bill",
    "article_ids": [12, 45, 78, 102]
  }
]

If no clusters are found, return an empty array: []`;

interface ClusterResult {
  cluster_title: string;
  slug: string;
  article_ids: number[];
}

export async function clusterArticles(): Promise<{
  clustersCreated: number;
  articlesAssigned: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let clustersCreated = 0;
  let articlesAssigned = 0;

  // Get unclustered articles from last 48 hours
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  const unclustered = db
    .select({
      id: schema.articles.id,
      originalTitle: schema.articles.originalTitle,
      rewrittenTitle: schema.articles.rewrittenTitle,
      sourceName: schema.articles.sourceName,
      excerpt: schema.articles.excerpt,
      category: schema.articles.category,
      isShadow: schema.articles.isShadow,
    })
    .from(schema.articles)
    .where(
      and(
        isNull(schema.articles.storyId),
        gte(schema.articles.publishedAt, cutoff),
        sql`${schema.articles.status} IN ('ready', 'shadow')`
      )
    )
    .all();

  // Filter out niche categories
  const clusterableArticles = unclustered.filter(
    (a) => !a.category || !SKIP_CATEGORIES.includes(a.category)
  );

  if (clusterableArticles.length < 2) {
    return { clustersCreated: 0, articlesAssigned: 0, errors: [] };
  }

  // Process in batches of 50
  const batchSize = 50;
  for (let i = 0; i < clusterableArticles.length; i += batchSize) {
    const batch = clusterableArticles.slice(i, i + batchSize);

    const payload = batch.map((a) => ({
      id: a.id,
      title: getTitle(a),
      source: a.sourceName,
      excerpt: (a.excerpt || "").slice(0, 150),
    }));

    try {
      const client = getAnthropicClient();
      const response = await client.messages.create(
        {
          model: AI_MODEL,
          max_tokens: 4096,
          system: CLUSTERING_SYSTEM_PROMPT,
          messages: [
            { role: "user", content: JSON.stringify(payload) },
          ],
        },
        { signal: AbortSignal.timeout(30_000) }
      );

      const block = response.content?.[0];
      const text = block?.type === "text" ? block.text : "";

      let clusters: ClusterResult[];
      try {
        clusters = JSON.parse(text);
      } catch {
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          clusters = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Failed to parse clustering response as JSON");
        }
      }

      const now = new Date().toISOString();

      for (const cluster of clusters) {
        if (!cluster.article_ids || cluster.article_ids.length < 2) continue;

        // Ensure slug is unique by appending a suffix if needed
        let slug = cluster.slug || cluster.cluster_title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
          .slice(0, 80);

        const existingSlug = db
          .select()
          .from(schema.stories)
          .where(eq(schema.stories.slug, slug))
          .get();

        if (existingSlug) {
          slug = `${slug}-${Date.now()}`;
        }

        // Create story
        const insertResult = db
          .insert(schema.stories)
          .values({
            slug,
            title: cluster.cluster_title,
            articleCount: cluster.article_ids.length,
            leftCount: 0,
            centerCount: 0,
            rightCount: 0,
            isBlindspotLeft: 0,
            isBlindspotRight: 0,
            createdAt: now,
            updatedAt: now,
          })
          .run();

        const storyId = Number(insertResult.lastInsertRowid);

        // Assign articles to story
        // Only assign IDs that actually exist in our batch
        const validIds = cluster.article_ids.filter((id) =>
          batch.some((a) => a.id === id)
        );

        if (validIds.length > 0) {
          db.update(schema.articles)
            .set({ storyId })
            .where(inArray(schema.articles.id, validIds))
            .run();

          articlesAssigned += validIds.length;
        }

        clustersCreated++;
      }
    } catch (err) {
      errors.push(
        `Clustering batch failed: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  return { clustersCreated, articlesAssigned, errors };
}
