import Link from "next/link";
import { BRAND_DISPLAY } from "@/lib/brand";
import { timeAgo } from "@/lib/utils/dates";
import { getTitle } from "@/lib/utils/articles";
import type { Article } from "@/types";

export function Sidebar({ opinions }: { opinions: Article[] }) {
  return (
    <aside>
      {/* The Corner-style opinion section */}
      <div className="border-2 border-accent p-4">
        <div className="corner-header">
          <Link href="/section/ai" className="flex items-center justify-center gap-1 transition-colors" style={{ color: "#E01A2B" }}>
            AI Corner <span className="text-lg">&#10132;</span>
          </Link>
        </div>

        <div className="divide-y divide-gray-200">
          {opinions.slice(0, 5).map((article) => {
            const title = getTitle(article);
            return (
              <Link
                key={article.id}
                href={`/article/${article.id}`}
                className="article-card block text-center group py-4 first:pt-0"
              >
                <h3 className="headline-sidebar mb-1">
                  {title}
                </h3>
                <div className="byline">
                  By <span className="byline-author">{article.author || article.sourceName}</span>
                  <span className="mx-1.5">|</span>
                  <span>{timeAgo(article.publishedAt)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Support section - NR donate style */}
      <div className="mt-6 border border-gray-200 p-5 text-center">
        <h3 className="font-sans text-sm font-black uppercase tracking-wider mb-3">
          Support {BRAND_DISPLAY}
        </h3>
        <p className="text-gray-600 text-xs leading-relaxed mb-4">
          Champion intellectual conservatism &mdash; support independent journalism
          committed to evidence and honest argument.
        </p>
        <button className="btn-subscribe w-full">
          Subscribe
        </button>
      </div>
    </aside>
  );
}
