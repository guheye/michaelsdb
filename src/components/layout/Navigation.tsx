import Link from "next/link";
import { getTitle } from "@/lib/utils/articles";
import type { Article } from "@/types";

export function Navigation({ trending }: { trending?: Article[] }) {
  const trendingTopics = trending
    ? trending.slice(0, 6).map((a) => {
        const title = getTitle(a);
        const words = title.replace(/[:\u2014\-\u2013]/g, " ").split(/\s+/).filter(Boolean);
        const label = words.slice(0, 3).join(" ").toUpperCase();
        return { label, id: a.id };
      })
    : [];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-[1200px] mx-auto px-4 py-2 flex items-center justify-center gap-4 overflow-x-auto trending-bar">
        <span className="flex-shrink-0 flex items-center gap-1.5 font-bold uppercase text-xs tracking-wider" style={{ color: "#E01A2B" }}>
          🔥 Trending
        </span>
        {trendingTopics.map((topic) => (
          <Link
            key={topic.id}
            href={`/article/${topic.id}`}
            className="flex-shrink-0 text-gray-700 text-xs font-semibold uppercase tracking-wide hover:text-accent transition-colors whitespace-nowrap"
          >
            {topic.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
