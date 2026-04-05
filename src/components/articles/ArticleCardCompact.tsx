import Link from "next/link";
import { timeAgo } from "@/lib/utils/dates";
import { getTitle } from "@/lib/utils/articles";
import type { Article } from "@/types";

export function ArticleCardCompact({
  article,
  index,
}: {
  article: Article;
  index?: number;
}) {
  const title = getTitle(article);

  return (
    <Link
      href={`/article/${article.id}`}
      className="article-card flex gap-3 py-2.5 border-b border-gray-200 last:border-b-0 group"
    >
      {index !== undefined && (
        <span className="flex-shrink-0 font-serif text-2xl font-bold text-gray-200 w-6 text-right leading-none pt-0.5">
          {index + 1}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <h4 className="headline-compact text-gray-900 line-clamp-2 mb-0.5">
          {title}
        </h4>
        <div className="metadata">
          <span>{article.sourceName}</span>
          <span className="mx-1">&middot;</span>
          <span>{timeAgo(article.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}
