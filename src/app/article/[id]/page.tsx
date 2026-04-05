import { db, schema } from "@/lib/db";
import { eq, desc, and, ne, inArray } from "drizzle-orm";
import { getTitle } from "@/lib/utils/articles";
import { notFound } from "next/navigation";
import { CategoryTag } from "@/components/ui/CategoryTag";
import { ArticleImage } from "@/components/ui/ArticleImage";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { FramingVerdictBadge } from "@/components/ui/FramingVerdictBadge";
import { BiasVerdictBadge } from "@/components/ui/BiasVerdictBadge";
import { BiasDistributionBar } from "@/components/ui/BiasDistributionBar";
import { SourceCard } from "@/components/ui/SourceCard";
import { formatDate } from "@/lib/utils/dates";
import { getOrComputeFramingAnalysis } from "@/lib/ai/framing-analysis";
import { SOURCE_BIAS_MAP } from "@/lib/bias/ratings";
import type { Article, Story, BiasRating, FramingVerdict } from "@/types";

export const dynamic = "force-dynamic";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const articleId = parseInt(id, 10);
  if (isNaN(articleId)) notFound();

  const article = db
    .select()
    .from(schema.articles)
    .where(eq(schema.articles.id, articleId))
    .get() as Article | undefined;

  if (!article) notFound();

  const title = getTitle(article);

  // Load story and sibling articles if this article belongs to a cluster
  let story: Story | null = null;
  let storyArticles: Article[] = [];
  let framingVerdict: FramingVerdict | null = null;
  let framingAnalysis: string | null = null;

  if (article.storyId) {
    story = (db
      .select()
      .from(schema.stories)
      .where(eq(schema.stories.id, article.storyId))
      .get() as Story | undefined) ?? null;

    if (story) {
      storyArticles = db
        .select()
        .from(schema.articles)
        .where(eq(schema.articles.storyId, story.id))
        .orderBy(desc(schema.articles.priority))
        .all() as Article[];

      // On-demand framing analysis (cached after first call)
      const framing = await getOrComputeFramingAnalysis(story, storyArticles);
      framingVerdict = framing.verdict;
      framingAnalysis = framing.analysis;
    }
  }

  // Get related articles from same category (fallback when no story)
  const related = article.category
    ? (db
        .select()
        .from(schema.articles)
        .where(
          and(
            eq(schema.articles.status, "ready"),
            eq(schema.articles.category, article.category),
            ne(schema.articles.id, article.id)
          )
        )
        .orderBy(desc(schema.articles.priority))
        .limit(5)
        .all() as Article[])
    : [];

  const biasRating = SOURCE_BIAS_MAP[article.sourceName] as BiasRating | undefined;
  const hasStoryData = story && storyArticles.length >= 2;
  const showCoverageAnalysis =
    hasStoryData && Boolean(framingAnalysis?.trim());

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="max-w-[800px] mx-auto">
        {/* ─── Header ─── */}
        {article.category && (
          <div className="mb-3">
            <CategoryTag category={article.category} />
          </div>
        )}

        <h1 className="font-serif text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-3">
          {title}
        </h1>

        {article.rewrittenTitle &&
          article.rewrittenTitle !== article.originalTitle && (
            <p className="text-gray-500 text-xs mb-3 italic">
              Original headline: &ldquo;{article.originalTitle}&rdquo;
            </p>
          )}

        <div className="metadata text-sm mb-4">
          {article.author && (
            <span className="font-semibold">{article.author}</span>
          )}
          {article.author && <span className="mx-1.5">&middot;</span>}
          <span>{article.sourceName}</span>
          {biasRating && (
            <>
              <span className="mx-1.5">&middot;</span>
              <span className="text-gray-500">{biasRating}</span>
            </>
          )}
          <span className="mx-1.5">&middot;</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>

        {/* ─── Framing Analysis Panel (only when AI analysis exists) ─── */}
        {showCoverageAnalysis && (
          <div className="framing-panel">
            <div className="framing-panel-header">
              <div className="framing-panel-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block mr-1.5 -mt-0.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
                Coverage Analysis
              </div>
              <div className="framing-panel-source-count">
                {story!.articleCount} sources
              </div>
            </div>

            {/* Verdict badges row */}
            <div className="framing-verdicts">
              {framingVerdict && (
                <FramingVerdictBadge verdict={framingVerdict} size="large" />
              )}
              <BiasVerdictBadge story={story!} />
            </div>

            {/* Bias distribution bar */}
            <BiasDistributionBar story={story!} />

            <div className="framing-analysis-text">
              <p>{framingAnalysis}</p>
            </div>
          </div>
        )}

        {/* ─── Article Image ─── */}
        {article.imageUrl && (
          <ArticleImage
            src={article.imageUrl}
            alt={title}
            containerClassName="mb-6"
            className="w-full h-auto rounded-sm"
          />
        )}

        {/* ─── Excerpt + Read Full Article ─── */}
        <div className="border-t border-b border-gray-200 py-4 mb-6">
          {article.excerpt && (
            <p className="text-gray-700 leading-relaxed mb-4">
              {article.excerpt}
            </p>
          )}
          <a
            href={article.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 text-sm font-semibold hover:bg-accent-dark transition-colors"
          >
            Read Full Article at {article.sourceName}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </a>
        </div>

        {/* ─── Source Coverage Cards ─── */}
        {hasStoryData && storyArticles.length > 1 && (
          <div className="mb-8">
            <div className="section-header">
              How Other Sources Cover This Story
            </div>
            <div className="source-cards-grid">
              {storyArticles.map((sa) => (
                <SourceCard
                  key={sa.id}
                  article={sa}
                  isCurrent={sa.id === article.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* ─── Related articles ─── */}
        {related.length > 0 && (
          <div>
            <div className="section-header">
              More in {article.category}
            </div>
            {related.map((r) => (
              <ArticleCard key={r.id} article={r} showImage={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
