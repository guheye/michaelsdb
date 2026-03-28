import Link from "next/link";
import { CategoryTag } from "@/components/ui/CategoryTag";
import { SourceCountBadge } from "@/components/ui/SourceCountBadge";
import { BiasVerdictBadge } from "@/components/ui/BiasVerdictBadge";
import { timeAgo } from "@/lib/utils/dates";
import { getPlaceholderImage } from "@/lib/feeds/images";
import type { Article, Story } from "@/types";

export function ArticleCard({
  article,
  showImage = true,
  story,
}: {
  article: Article;
  showImage?: boolean;
  story?: Story;
}) {
  const title = article.rewrittenTitle || article.originalTitle;
  const imgSrc = article.imageUrl || getPlaceholderImage(article.id, article.category);

  return (
    <Link
      href={`/article/${article.id}`}
      className="article-card block group py-3 border-b border-gray-200 last:border-b-0"
    >
      <div className={showImage ? "flex gap-4" : ""}>
        {showImage && (
          <div className="flex-shrink-0 w-[140px] h-[90px] overflow-hidden">
            <img
              src={imgSrc}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {article.category && (
            <div className="mb-1">
              <CategoryTag category={article.category} variant="text" asSpan />
            </div>
          )}
          <h3 className="headline-card mb-1 line-clamp-2">
            {title}
          </h3>
          {article.excerpt && (
            <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 mb-1">
              {article.excerpt}
            </p>
          )}
          <div className="metadata">
            {article.author && <span>{article.author}</span>}
            {article.author && <span className="mx-1">&middot;</span>}
            <span>{article.sourceName}</span>
            <span className="mx-1">&middot;</span>
            <span>{timeAgo(article.publishedAt)}</span>
            <SourceCountBadge story={story} />
            <BiasVerdictBadge story={story} />
          </div>
        </div>
      </div>
    </Link>
  );
}
