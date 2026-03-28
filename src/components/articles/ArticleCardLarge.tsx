import Link from "next/link";
import { CategoryTag } from "@/components/ui/CategoryTag";
import { timeAgo } from "@/lib/utils/dates";
import type { Article } from "@/types";

export function ArticleCardLarge({ article }: { article: Article }) {
  const title = article.rewrittenTitle || article.originalTitle;
  const hasImage = !!article.imageUrl;

  return (
    <Link
      href={`/article/${article.id}`}
      className="article-card block relative group overflow-hidden"
    >
      {/* Background image */}
      <div className="relative h-[400px] bg-navy">
        {hasImage ? (
          <img
            src={article.imageUrl!}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-navy to-navy-dark" />
        )}
        <div className="hero-gradient absolute inset-0" />

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {article.category && (
            <div className="mb-2">
              <CategoryTag category={article.category} asSpan />
            </div>
          )}
          <h2 className="headline-hero text-white mb-2 group-hover:text-gray-200 transition-colors">
            {title}
          </h2>
          <div className="metadata text-gray-300">
            {article.author && <span>{article.author}</span>}
            {article.author && <span className="mx-1.5">&middot;</span>}
            <span>{article.sourceName}</span>
            <span className="mx-1.5">&middot;</span>
            <span>{timeAgo(article.publishedAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
