import { getAnthropicClient, AI_MODEL } from "./client";
import { getTitle } from "@/lib/utils/articles";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { SOURCE_BIAS_MAP } from "@/lib/bias/ratings";
import type { Article, Story, FramingVerdict } from "@/types";

const FRAMING_SYSTEM_PROMPT = `You are a media framing analyst. Given a set of article headlines, excerpts, and their source bias ratings covering the same news story, assess the overall editorial framing quality.

Evaluate these dimensions:
1. **Language**: Is the coverage using neutral, factual language or loaded/emotional terms?
2. **Context**: Does the coverage provide sufficient background and multiple perspectives?
3. **Balance**: Are important counterarguments or alternative viewpoints represented?
4. **Framing**: Are headlines and excerpts framing the story to lead readers toward a particular conclusion?

Based on your analysis, assign ONE verdict:
- "Fairly Reported" — Coverage is largely neutral, provides context, and represents multiple viewpoints
- "Missing Context" — Coverage omits important background, caveats, or alternative perspectives
- "Loaded Language" — Coverage uses emotionally charged or leading language that biases the reader
- "One-Sided" — Coverage presents only one perspective without acknowledging legitimate counterpoints
- "Mixed Framing" — Sources vary significantly in quality — some fair, some biased

Return ONLY valid JSON — no markdown, no explanation:
{
  "verdict": "Fairly Reported",
  "analysis": "2-3 sentence analysis explaining your assessment. Reference specific framing patterns you observed across the sources."
}`;

interface FramingResult {
  verdict: FramingVerdict;
  analysis: string;
}

/**
 * Get or compute the framing analysis for a story.
 * Returns cached result if available, otherwise calls Claude Haiku.
 */
export async function getOrComputeFramingAnalysis(
  story: Story,
  articles: Article[]
): Promise<{ verdict: FramingVerdict | null; analysis: string | null }> {
  // Return cached result if available
  if (story.framingVerdict && story.framingAnalysis) {
    return {
      verdict: story.framingVerdict as FramingVerdict,
      analysis: story.framingAnalysis,
    };
  }

  // Need at least 2 articles to do framing analysis
  if (articles.length < 2) {
    return { verdict: null, analysis: null };
  }

  try {
    const result = await computeFramingAnalysis(story, articles);

    // Cache the result in the stories table
    db.update(schema.stories)
      .set({
        framingVerdict: result.verdict,
        framingAnalysis: result.analysis,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(schema.stories.id, story.id))
      .run();

    return result;
  } catch (err) {
    console.error(
      `[framing] Failed to compute analysis for story ${story.id}:`,
      err instanceof Error ? err.message : String(err)
    );
    return { verdict: null, analysis: null };
  }
}

async function computeFramingAnalysis(
  story: Story,
  articles: Article[]
): Promise<FramingResult> {
  const client = getAnthropicClient();

  const articleData = articles.map((a) => ({
    source: a.sourceName,
    bias_rating: SOURCE_BIAS_MAP[a.sourceName] || "Unknown",
    headline: getTitle(a),
    excerpt: a.excerpt ? a.excerpt.slice(0, 200) : "",
  }));

  const userMessage = `Story: "${story.title}"

Sources covering this story:
${JSON.stringify(articleData, null, 2)}`;

  const response = await client.messages.create(
    {
      model: AI_MODEL,
      max_tokens: 512,
      system: FRAMING_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    },
    { signal: AbortSignal.timeout(30_000) }
  );

  const block = response.content?.[0];
  const text = block?.type === "text" ? block.text : "";

  let parsed: FramingResult;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Failed to parse framing analysis response as JSON");
  }

  // Validate verdict
  const validVerdicts: FramingVerdict[] = [
    "Fairly Reported",
    "Missing Context",
    "Loaded Language",
    "One-Sided",
    "Mixed Framing",
  ];
  if (!validVerdicts.includes(parsed.verdict)) {
    parsed.verdict = "Mixed Framing";
  }

  return parsed;
}
