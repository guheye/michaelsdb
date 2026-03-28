import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { getPlaceholderImage } from "@/lib/feeds/images";
import type { Article } from "@/types";

function RelatedTextLink({ article }: { article: Article }) {
  const title = article.rewrittenTitle || article.originalTitle;
  return (
    <Link
      href={`/article/${article.id}`}
      className="related-bullet related-text-link flex items-start text-gray-900 hover:text-accent transition-colors"
    >
      {title}
    </Link>
  );
}

function RelatedImageCard({ article }: { article: Article }) {
  const title = article.rewrittenTitle || article.originalTitle;
  const imgSrc = article.imageUrl || getPlaceholderImage(article.id, article.category);
  return (
    <Link href={`/article/${article.id}`} className="article-card block group">
      <div className="w-full aspect-[3/2] overflow-hidden mb-2">
        <img
          src={imgSrc}
          alt=""
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />
      </div>
      <div className="category-label mb-1">{article.category}</div>
      <h3 className="headline-card mb-1 line-clamp-3">{title}</h3>
      <div className="byline">
        By <span className="byline-author">{article.author || "Staff"}</span>
      </div>
      {article.excerpt && (
        <p className="text-gray-600 text-sm leading-relaxed mt-1 line-clamp-2">{article.excerpt}</p>
      )}
    </Link>
  );
}

function LeftCard({ article }: { article: Article }) {
  const title = article.rewrittenTitle || article.originalTitle;
  return (
    <Link href={`/article/${article.id}`} className="article-card block group mb-6">
      {article.imageUrl && (
        <div className="w-full h-[180px] overflow-hidden mb-2">
          <img
            src={article.imageUrl}
            alt=""
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        </div>
      )}
      <div className="category-label mb-1">{article.category}</div>
      <h3 className="headline-card mb-1.5">
        {title}
      </h3>
      <div className="byline">
        By <span className="byline-author">{article.author || "Staff"}</span>
      </div>
      {article.excerpt && (
        <p className="text-gray-600 text-sm leading-relaxed mt-1.5 line-clamp-2">
          {article.excerpt}
        </p>
      )}
    </Link>
  );
}

export function HeroSection({
  lead,
  leftColumn,
  opinions,
  related,
}: {
  lead: Article;
  secondary: Article[];
  leftColumn: Article[];
  opinions: Article[];
  related: Article[];
}) {
  const leadTitle = lead.rewrittenTitle || lead.originalTitle;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 pt-6">
      {/* Left column - small article cards with images */}
      <div className="lg:col-span-3 lg:pr-5">
        {leftColumn.map((article) => (
          <LeftCard key={article.id} article={article} />
        ))}
      </div>

      {/* Center column - featured story */}
      <div className="lg:col-span-5 lg:border-l lg:border-r border-gray-200 lg:px-5">
        <Link href={`/article/${lead.id}`} className="article-card block group">
          {lead.imageUrl && (
            <div className="w-full h-[320px] overflow-hidden mb-3">
              <img
                src={lead.imageUrl}
                alt=""
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
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
            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
              {lead.excerpt}
            </p>
          )}
        </Link>

        {related.length > 0 && (
          <div className="border-t border-gray-200 pt-4 mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:divide-x sm:divide-gray-200 gap-y-4 sm:gap-y-0">
              {related[0] && (
                <div className={related[1] ? "sm:pr-5" : "sm:pr-0"}>
                  <RelatedTextLink article={related[0]} />
                </div>
              )}
              {related[1] && (
                <div className="sm:pl-5">
                  <RelatedTextLink article={related[1]} />
                </div>
              )}
            </div>

            {related.length >= 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mt-6 pt-6 border-t border-gray-200">
                {related.slice(2, 4).map((article) => (
                  <RelatedImageCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right column - The Corner sidebar */}
      <div className="lg:col-span-4 lg:pl-5">
        <Sidebar opinions={opinions} />
      </div>
    </div>
  );
}
