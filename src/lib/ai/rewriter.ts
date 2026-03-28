import { getAnthropicClient } from "./client";
import { EDITORIAL_SYSTEM_PROMPT } from "./prompts";
import { db, schema } from "@/lib/db";
import { eq, inArray } from "drizzle-orm";

interface RewriteResult {
  id: number;
  rewritten_title: string;
  summary?: string;
  category: string;
  priority: number;
}

export async function rewriteHeadlines(batchSize: number = 15): Promise<{
  processed: number;
  errors: string[];
}> {
  const errors: string[] = [];

  // Get unprocessed articles
  const newArticles = db
    .select()
    .from(schema.articles)
    .where(eq(schema.articles.status, "new"))
    .limit(batchSize)
    .all();

  if (newArticles.length === 0) {
    return { processed: 0, errors: [] };
  }

  // Mark as processing
  const ids = newArticles.map((a) => a.id);
  db.update(schema.articles)
    .set({ status: "processing" })
    .where(inArray(schema.articles.id, ids))
    .run();

  const articlesPayload = newArticles.map((a) => ({
    id: a.id,
    title: a.originalTitle,
    source: a.sourceName,
    excerpt: a.excerpt?.slice(0, 300) || "",
  }));

  try {
    const client = getAnthropicClient();
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 8192,
      system: EDITORIAL_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: JSON.stringify(articlesPayload),
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    let results: RewriteResult[];
    try {
      results = JSON.parse(text);
    } catch {
      // Try to extract JSON from potential markdown wrapping
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        results = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse AI response as JSON");
      }
    }

    const now = new Date().toISOString();
    for (const result of results) {
      const updateData: Record<string, unknown> = {
        rewrittenTitle: result.rewritten_title,
        category: result.category,
        priority: result.priority,
        status: "ready",
        aiProcessedAt: now,
      };

      // Use AI summary if provided (richer than RSS excerpt)
      if (result.summary) {
        updateData.excerpt = result.summary;
      }

      db.update(schema.articles)
        .set(updateData)
        .where(eq(schema.articles.id, result.id))
        .run();
    }

    return { processed: results.length, errors };
  } catch (err) {
    const errorMsg = `AI rewrite failed: ${err instanceof Error ? err.message : String(err)}`;
    errors.push(errorMsg);

    // Fallback: mark articles as ready with original titles
    for (const article of newArticles) {
      db.update(schema.articles)
        .set({
          rewrittenTitle: article.originalTitle,
          status: "ready",
          aiProcessedAt: new Date().toISOString(),
        })
        .where(eq(schema.articles.id, article.id))
        .run();
    }

    return { processed: newArticles.length, errors };
  }
}
