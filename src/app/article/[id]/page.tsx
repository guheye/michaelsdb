import { db, schema } from "@/lib/db";
import { eq, desc, and, ne } from "drizzle-orm";
import { notFound } from "next/navigation";
import { CategoryTag } from "@/components/ui/CategoryTag";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { formatDate } from "@/lib/utils/dates";
import type { Article } from "@/types";

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

  const title = article.rewrittenTitle || article.originalTitle;

  // Get related articles from same category
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

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="max-w-[720px] mx-auto">
        {article.category && (
          <div className="mb-3">
            <CategoryTag category={article.category} />
          </div>
        )}

        <h1 className="font-serif text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
          {title}
        </h1>

        {article.rewrittenTitle &&
          article.rewrittenTitle !== article.originalTitle && (
            <p className="text-gray-500 text-xs mb-4 italic">
              Original headline: &ldquo;{article.originalTitle}&rdquo;
            </p>
          )}

        <div className="metadata text-sm mb-4">
          {article.author && (
            <span className="font-semibold">{article.author}</span>
          )}
          {article.author && <span className="mx-1.5">&middot;</span>}
          <span>{article.sourceName}</span>
          <span className="mx-1.5">&middot;</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>

        {article.imageUrl && (
          <div className="mb-6">
            <img
              src={article.imageUrl}
              alt={title}
              className="w-full h-auto rounded-sm"
            />
          </div>
        )}

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

        {/* Related articles */}
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
