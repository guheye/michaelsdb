import Link from "next/link";
import { SOURCE_BIAS_MAP } from "@/lib/bias/ratings";
import type { Article, BiasRating } from "@/types";

const BIAS_DOT_COLOR: Record<string, string> = {
  "Far Left": "#1d4ed8",
  "Left": "#3b82f6",
  "Lean Left": "#60a5fa",
  "Center": "#22c55e",
  "Lean Right": "#f87171",
  "Right": "#ef4444",
  "Far Right": "#dc2626",
};

function BiasDot({ rating }: { rating: BiasRating | undefined }) {
  if (!rating) return null;
  const color = BIAS_DOT_COLOR[rating] || "#9ca3af";
  return (
    <span
      className="source-card-bias-dot"
      style={{ backgroundColor: color }}
    />
  );
}

export function SourceCard({
  article,
  isCurrent,
}: {
  article: Article;
  isCurrent?: boolean;
}) {
  const title = article.rewrittenTitle || article.originalTitle;
  const biasRating = SOURCE_BIAS_MAP[article.sourceName] as BiasRating | undefined;

  return (
    <div className={`source-card ${isCurrent ? "source-card-current" : ""}`}>
      <div className="source-card-header">
        <div className="source-card-icon">
          {article.sourceName.charAt(0).toUpperCase()}
        </div>
        <div className="source-card-meta">
          <span className="source-card-name">{article.sourceName}</span>
          {biasRating && (
            <span className="source-card-bias">
              <BiasDot rating={biasRating} />
              {biasRating}
            </span>
          )}
        </div>
      </div>
      <h4 className="source-card-headline">{title}</h4>
      {article.excerpt && (
        <p className="source-card-excerpt">{article.excerpt}</p>
      )}
      {isCurrent ? (
        <span className="source-card-link source-card-link-current">
          Currently viewing
        </span>
      ) : (
        <Link href={`/article/${article.id}`} className="source-card-link">
          Read this version &rarr;
        </Link>
      )}
    </div>
  );
}
