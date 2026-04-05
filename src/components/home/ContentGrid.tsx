import Link from "next/link";
import { ArticleImage } from "@/components/ui/ArticleImage";
import { timeAgo } from "@/lib/utils/dates";
import { getTitle } from "@/lib/utils/articles";
import type { Article } from "@/types";

function ArticleRow({ article }: { article: Article }) {
  const title = getTitle(article);
  return (
    <Link
      href={`/article/${article.id}`}
      className="article-card flex gap-4 py-4 border-b border-gray-200 last:border-b-0 group"
    >
      {article.imageUrl && (
        <ArticleImage
          src={article.imageUrl}
          containerClassName="flex-shrink-0 w-[200px] h-[130px] overflow-hidden"
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="category-label mb-1">{article.category}</div>
        <h3 className="headline-card mb-1.5 line-clamp-3 group-hover:text-accent transition-colors">
          {title}
        </h3>
        <div className="byline mb-1">
          By <span className="byline-author">{article.author || "Staff"}</span>
        </div>
        {article.excerpt && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}

function CompactItem({ article, index }: { article: Article; index?: number }) {
  const title = getTitle(article);
  return (
    <Link
      href={`/article/${article.id}`}
      className="article-card flex gap-3 py-3 border-b border-gray-200 last:border-b-0 group"
    >
      {index !== undefined && (
        <span className="flex-shrink-0 font-sans text-2xl font-black text-gray-200 w-6 text-right leading-none pt-1">
          {index + 1}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <div className="category-label mb-0.5">{article.category}</div>
        <h4 className="headline-compact line-clamp-2 mb-0.5 group-hover:text-accent transition-colors">
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

interface ContentGridProps {
  sections: { title: string; articles: Article[] }[];
  latest: Article[];
  trending: Article[];
}

export function ContentGrid({ sections, latest, trending }: ContentGridProps) {
  // Flatten all section articles for the main feed
  const allArticles = sections.flatMap((s) => s.articles);

  return (
    <div className="border-t border-gray-200 mt-8 pt-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-start">
        {/* Main content feed - left */}
        <div className="lg:col-span-7 lg:pr-5">
          {allArticles.map((article) => (
            <ArticleRow key={article.id} article={article} />
          ))}
        </div>

        {/* Right sidebar: Latest + Most Popular */}
        <div className="lg:col-span-5 lg:pl-5 lg:border-l border-gray-200">
          {/* Latest */}
          <div className="mb-8">
            <div className="section-header">Latest</div>
            {latest.map((article) => (
              <CompactItem key={article.id} article={article} />
            ))}
          </div>

          {/* Most Popular / Trending */}
          <div>
            <div className="section-header">Most Popular</div>
            {trending.map((article, i) => (
              <CompactItem key={article.id} article={article} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
