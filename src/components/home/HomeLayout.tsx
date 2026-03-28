import Link from "next/link";
import { timeAgo } from "@/lib/utils/dates";
import { getPlaceholderImage } from "@/lib/feeds/images";
import { Sidebar } from "@/components/layout/Sidebar";
import type { Article } from "@/types";

function LeftCard({ article, usePlaceholder = true }: { article: Article; usePlaceholder?: boolean }) {
  const title = article.rewrittenTitle || article.originalTitle;
  const imgSrc = article.imageUrl || (usePlaceholder ? getPlaceholderImage(article.id, article.category) : null);
  return (
    <Link href={`/article/${article.id}`} className="article-card block group mb-5">
      {imgSrc ? (
        <div className="w-full h-[170px] overflow-hidden mb-2">
          <img
            src={imgSrc}
            alt=""
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-full h-[170px] mb-2 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-xs uppercase tracking-wider">Image pending</span>
        </div>
      )}
      <div className="category-label mb-1">{article.category}</div>
      <h3 className="headline-card mb-1">
        {title}
      </h3>
      <div className="byline">
        By <span className="byline-author">{article.author || "Staff"}</span>
      </div>
      {article.excerpt && (
        <p className="text-gray-600 text-sm leading-relaxed mt-1 line-clamp-2">
          {article.excerpt}
        </p>
      )}
    </Link>
  );
}

function ArticleRow({ article }: { article: Article }) {
  const title = article.rewrittenTitle || article.originalTitle;
  const imgSrc = article.imageUrl || getPlaceholderImage(article.id, article.category);
  return (
    <Link
      href={`/article/${article.id}`}
      className="article-card flex gap-4 py-4 border-b border-gray-200 last:border-b-0 group"
    >
      <div className="flex-shrink-0 w-[200px] h-[130px] overflow-hidden">
        <img
          src={imgSrc}
          alt=""
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="category-label mb-1">{article.category}</div>
        <h3 className="headline-card mb-1 line-clamp-3">
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
  const title = article.rewrittenTitle || article.originalTitle;
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
        <h4 className="headline-compact line-clamp-2 mb-0.5">
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

interface HomeLayoutProps {
  lead: Article;
  leftColumn: Article[];
  related: Article[];
  cornerArticles: Article[];
  remaining: Article[];
  latest: Article[];
  trending: Article[];
}

export function HomeLayout({
  lead,
  leftColumn,
  related,
  cornerArticles,
  remaining,
  latest,
  trending,
}: HomeLayoutProps) {
  const leadTitle = lead.rewrittenTitle || lead.originalTitle;
  const leadImg = lead.imageUrl || null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 pt-6">
      {/* ===== LEFT + CENTER (main content area) ===== */}
      <div className="lg:col-span-8 lg:pr-5 lg:border-r border-gray-200">

        {/* Hero section: left cards + center featured */}
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-0">
          {/* Left column - small article cards */}
          <div className="lg:col-span-3 lg:pr-4">
            {leftColumn.map((article, i) => (
              <LeftCard key={article.id} article={article} usePlaceholder={i !== 0} />
            ))}
          </div>

          {/* Center - featured story */}
          <div className="lg:col-span-5 lg:pl-4 lg:border-l border-gray-200">
            <Link href={`/article/${lead.id}`} className="article-card block group">
              {leadImg ? (
                <div className="w-full h-[300px] overflow-hidden mb-3">
                  <img
                    src={leadImg}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-full h-[300px] mb-3 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-xs uppercase tracking-wider">Image pending</span>
                </div>
              )}
              <div className="category-label mb-2">{lead.category}</div>
              <h2 className="headline-hero mb-2">
                {leadTitle}
              </h2>
              <div className="byline mb-2">
                By <span className="byline-author">{lead.author || "Staff"}</span>
              </div>
              {lead.excerpt && (
                <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                  {lead.excerpt}
                </p>
              )}
            </Link>

            {/* Related stories bullet list */}
            {related.length > 0 && (
              <div className="border-t border-gray-200 pt-3 mt-1">
                <div className="grid grid-cols-2 gap-3">
                  {related.slice(0, 4).map((article) => {
                    const title = article.rewrittenTitle || article.originalTitle;
                    return (
                      <Link
                        key={article.id}
                        href={`/article/${article.id}`}
                        className="related-bullet flex items-start text-xs font-semibold text-gray-900 hover:text-accent transition-colors leading-snug"
                      >
                        {title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Below-fold article rows */}
        <div className="border-t border-gray-200 mt-6 pt-4">
          <div className="section-header">Latest Stories</div>
          {remaining.slice(0, 6).map((article) => (
            <ArticleRow key={article.id} article={article} />
          ))}
        </div>
      </div>

      {/* ===== RIGHT SIDEBAR (spans full height) ===== */}
      <div className="lg:col-span-4 lg:pl-5">
        <div className="lg:sticky lg:top-4">
          <Sidebar opinions={cornerArticles} />

          {/* Most Popular section below the sidebar */}
          <div className="mt-6">
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
