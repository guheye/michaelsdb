import { db, schema } from "@/lib/db";
import { eq, and, desc } from "drizzle-orm";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Sidebar } from "@/components/layout/Sidebar";
import { SLUG_TO_CATEGORY, CATEGORIES } from "@/types";
import { notFound } from "next/navigation";
import type { Article } from "@/types";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return Object.values(
    Object.fromEntries(
      CATEGORIES.map((cat) => [
        cat,
        {
          slug: cat
            .toLowerCase()
            .replace(/\s+&\s+/g, "-")
            .replace(/\s+/g, "-"),
        },
      ])
    )
  );
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = SLUG_TO_CATEGORY[slug];
  if (!category) notFound();

  const articles = db
    .select()
    .from(schema.articles)
    .where(
      and(
        eq(schema.articles.status, "ready"),
        eq(schema.articles.category, category)
      )
    )
    .orderBy(desc(schema.articles.publishedAt))
    .limit(30)
    .all() as Article[];

  const opinions = db
    .select()
    .from(schema.articles)
    .where(eq(schema.articles.status, "ready"))
    .orderBy(desc(schema.articles.priority))
    .limit(6)
    .all() as Article[];

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <div className="section-header text-lg mb-6">{category}</div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          {articles.length === 0 ? (
            <p className="text-gray-500 text-sm py-8">
              No articles in this section yet. Run the aggregator to fetch
              content.
            </p>
          ) : (
            articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                showImage={true}
              />
            ))
          )}
        </div>
        <div className="lg:col-span-4">
          <Sidebar opinions={opinions} />
        </div>
      </div>
    </div>
  );
}
