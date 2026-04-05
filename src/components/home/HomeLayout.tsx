import Link from "next/link";
import { timeAgo } from "@/lib/utils/dates";
import { getTitle } from "@/lib/utils/articles";
import { getPlaceholderImage } from "@/lib/feeds/images";
import { Sidebar } from "@/components/layout/Sidebar";
import { ArticleImage } from "@/components/ui/ArticleImage";
import { SourceCountBadge } from "@/components/ui/SourceCountBadge";
import { BiasVerdictBadge } from "@/components/ui/BiasVerdictBadge";
import { BlindspotSection } from "@/components/home/BlindspotSection";
import type { Article, Story } from "@/types";

/* ─── Mobile-optimized compact card: thumbnail on right ─── */
function MobileCard({ article, story }: { article: Article; story?: Story }) {
  const title = getTitle(article);
  const imgSrc = article.imageUrl || getPlaceholderImage(article.id, article.category);
  return (
    <Link
      href={`/article/${article.id}`}
      className="article-card flex gap-3 py-3.5 border-b border-gray-200 last:border-b-0 group"
    >
      <div className="flex-1 min-w-0">
        <div className="category-label mb-1">{article.category}</div>
        <h3 className="headline-compact line-clamp-3 mb-1">{title}</h3>
        <div className="metadata">
          <span>{article.author || article.sourceName}</span>
          <span className="mx-1">&middot;</span>
          <span>{timeAgo(article.publishedAt)}</span>
          <SourceCountBadge story={story} />
          <BiasVerdictBadge story={story} />
        </div>
      </div>
      {imgSrc && (
        <ArticleImage
          src={imgSrc}
          containerClassName="flex-shrink-0 w-[100px] h-[72px] overflow-hidden rounded-sm"
          className="w-full h-full object-cover"
        />
      )}
    </Link>
  );
}

/* ─── Desktop left-column card ─── */
function LeftCard({ article, usePlaceholder = true, story }: { article: Article; usePlaceholder?: boolean; story?: Story }) {
  const title = getTitle(article);
  const imgSrc = article.imageUrl || (usePlaceholder ? getPlaceholderImage(article.id, article.category) : null);
  return (
    <Link href={`/article/${article.id}`} className="article-card block group mb-5">
      {imgSrc ? (
        <ArticleImage
          src={imgSrc}
          containerClassName="w-full h-[170px] overflow-hidden mb-2"
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />
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
      <div className="metadata mt-1">
        <SourceCountBadge story={story} />
        <BiasVerdictBadge story={story} />
      </div>
      {article.excerpt && (
        <p className="text-gray-600 text-sm leading-relaxed mt-1 line-clamp-2">
          {article.excerpt}
        </p>
      )}
    </Link>
  );
}

/* ─── Desktop article row ─── */
function ArticleRow({ article, story }: { article: Article; story?: Story }) {
  const title = getTitle(article);
  const imgSrc = article.imageUrl || getPlaceholderImage(article.id, article.category);
  return (
    <Link
      href={`/article/${article.id}`}
      className="article-card flex gap-4 py-4 border-b border-gray-200 last:border-b-0 group"
    >
      <ArticleImage
        src={imgSrc}
        containerClassName="flex-shrink-0 w-[200px] h-[130px] overflow-hidden"
        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
      />
      <div className="flex-1 min-w-0">
        <div className="category-label mb-1">{article.category}</div>
        <h3 className="headline-card mb-1 line-clamp-3">
          {title}
        </h3>
        <div className="byline mb-1">
          By <span className="byline-author">{article.author || "Staff"}</span>
        </div>
        <div className="metadata mb-1">
          <SourceCountBadge story={story} />
          <BiasVerdictBadge story={story} />
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

/** NR row 1 under lead: red circle + bold sans headline only */
function RelatedTextLink({ article }: { article: Article }) {
  const title = getTitle(article);
  return (
    <Link
      href={`/article/${article.id}`}
      className="related-bullet related-text-link flex items-start text-gray-900 hover:text-accent transition-colors"
    >
      {title}
    </Link>
  );
}

/** NR row 2 under lead: image + category + headline + byline + dek */
function RelatedImageCard({ article }: { article: Article }) {
  const title = getTitle(article);
  const imgSrc = article.imageUrl || getPlaceholderImage(article.id, article.category);
  return (
    <Link href={`/article/${article.id}`} className="article-card block group">
      <ArticleImage
        src={imgSrc}
        containerClassName="w-full aspect-[3/2] overflow-hidden mb-2"
        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
      />
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

function CompactItem({ article, index, story }: { article: Article; index?: number; story?: Story }) {
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
        <h4 className="headline-compact line-clamp-2 mb-0.5">
          {title}
        </h4>
        <div className="metadata">
          <span>{article.sourceName}</span>
          <span className="mx-1">&middot;</span>
          <span>{timeAgo(article.publishedAt)}</span>
          <SourceCountBadge story={story} />
          <BiasVerdictBadge story={story} />
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
  storyMap?: Map<number, Story>;
  blindspotStories?: { left: Story[]; right: Story[] };
}

export function HomeLayout({
  lead,
  leftColumn,
  related,
  cornerArticles,
  remaining,
  latest,
  trending,
  storyMap = new Map(),
  blindspotStories,
}: HomeLayoutProps) {
  const leadTitle = getTitle(lead);
  const leadImg = lead.imageUrl || null;

  return (
    <>
      {/* ═══════ MOBILE LAYOUT (< lg) ═══════ */}
      <div className="lg:hidden pt-4">
        {/* Mobile hero */}
        <Link href={`/article/${lead.id}`} className="article-card block group mb-1">
          {leadImg ? (
            <ArticleImage
              src={leadImg}
              containerClassName="w-full aspect-[16/9] overflow-hidden mb-3"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full aspect-[16/9] mb-3 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-xs uppercase tracking-wider">Image pending</span>
            </div>
          )}
          <div className="category-label mb-1.5">{lead.category}</div>
          <h2 className="headline-hero-mobile mb-1.5">{leadTitle}</h2>
          <div className="byline mb-1">
            By <span className="byline-author">{lead.author || "Staff"}</span>
          </div>
          {lead.excerpt && (
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{lead.excerpt}</p>
          )}
        </Link>

        {/* Top stories - compact cards with thumbnails on right */}
        <div className="border-t border-gray-200 mt-4">
          <div className="section-header">Top Stories</div>
          {leftColumn.map((article) => (
            <MobileCard key={article.id} article={article} story={storyMap.get(article.id)} />
          ))}
          {related.slice(0, 2).map((article) => (
            <MobileCard key={article.id} article={article} story={storyMap.get(article.id)} />
          ))}
        </div>

        {/* Related image cards - 2-up grid on mobile */}
        {related.length >= 3 && (
          <div className="grid grid-cols-2 gap-4 mt-5 pb-5 border-b border-gray-200">
            {related.slice(2, 4).map((article) => (
              <RelatedImageCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {/* AI Corner inline on mobile */}
        {cornerArticles.length > 0 && (
          <div className="mt-5">
            <Sidebar opinions={cornerArticles} />
          </div>
        )}

        {/* Most Popular inline on mobile */}
        <div className="mt-6">
          <div className="section-header">Most Popular</div>
          {trending.map((article, i) => (
            <CompactItem key={article.id} article={article} index={i} story={storyMap.get(article.id)} />
          ))}
        </div>

        {/* Blindspot Section */}
        {blindspotStories && (blindspotStories.left.length > 0 || blindspotStories.right.length > 0) && (
          <div className="border-t border-gray-200 mt-6 pt-4">
            <BlindspotSection stories={blindspotStories} />
          </div>
        )}

        {/* Latest Stories */}
        <div className="border-t border-gray-200 mt-6 pt-4">
          <div className="section-header">Latest Stories</div>
          {remaining.slice(0, 8).map((article) => (
            <MobileCard key={article.id} article={article} story={storyMap.get(article.id)} />
          ))}
        </div>
      </div>

      {/* ═══════ DESKTOP LAYOUT (>= lg) ═══════ */}
      <div className="hidden lg:grid grid-cols-12 gap-0 pt-6">
        {/* ===== LEFT + CENTER (main content area) ===== */}
        <div className="col-span-8 pr-5 border-r border-gray-200">

          {/* Hero section: left cards + center featured */}
          <div className="grid grid-cols-8 gap-0">
            {/* Left column - small article cards */}
            <div className="col-span-3 pr-4">
              {leftColumn.map((article, i) => (
                <LeftCard key={article.id} article={article} usePlaceholder={i !== 0} story={storyMap.get(article.id)} />
              ))}
            </div>

            {/* Center - featured story */}
            <div className="col-span-5 pl-4 border-l border-gray-200">
              <Link href={`/article/${lead.id}`} className="article-card block group">
                {leadImg ? (
                  <ArticleImage
                    src={leadImg}
                    containerClassName="w-full h-[300px] overflow-hidden mb-3"
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
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

              {/* NR-style under-lead: row 1 = two text + bullets; row 2 = two image cards */}
              {related.length > 0 && (
                <div className="border-t border-gray-200 pt-4 mt-3">
                  <div className="grid grid-cols-2 divide-x divide-gray-200">
                    {related[0] && (
                      <div className={related[1] ? "pr-5" : "pr-0"}>
                        <RelatedTextLink article={related[0]} />
                      </div>
                    )}
                    {related[1] && (
                      <div className="pl-5">
                        <RelatedTextLink article={related[1]} />
                      </div>
                    )}
                  </div>

                  {related.length >= 3 && (
                    <div className="grid grid-cols-2 gap-8 mt-6 pt-6 border-t border-gray-200">
                      {related.slice(2, 4).map((article) => (
                        <RelatedImageCard key={article.id} article={article} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Blindspot Section */}
          {blindspotStories && (blindspotStories.left.length > 0 || blindspotStories.right.length > 0) && (
            <div className="border-t border-gray-200 mt-6 pt-4">
              <BlindspotSection stories={blindspotStories} />
            </div>
          )}

          {/* Below-fold article rows */}
          <div className="border-t border-gray-200 mt-6 pt-4">
            <div className="section-header">Latest Stories</div>
            {remaining.slice(0, 6).map((article) => (
              <ArticleRow key={article.id} article={article} story={storyMap.get(article.id)} />
            ))}
          </div>
        </div>

        {/* ===== RIGHT SIDEBAR (spans full height) ===== */}
        <div className="col-span-4 pl-5">
          <div className="sticky top-[90px]">
            <Sidebar opinions={cornerArticles} />

            {/* Most Popular section below the sidebar */}
            <div className="mt-6">
              <div className="section-header">Most Popular</div>
              {trending.map((article, i) => (
                <CompactItem key={article.id} article={article} index={i} story={storyMap.get(article.id)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
