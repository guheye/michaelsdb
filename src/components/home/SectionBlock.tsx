import { ArticleCard } from "@/components/articles/ArticleCard";
import { SectionDivider } from "@/components/ui/SectionDivider";
import type { Article } from "@/types";

export function SectionBlock({
  title,
  articles,
}: {
  title: string;
  articles: Article[];
}) {
  if (articles.length === 0) return null;

  return (
    <div className="mb-6">
      <SectionDivider title={title} />
      <div>
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} showImage={true} />
        ))}
      </div>
    </div>
  );
}
