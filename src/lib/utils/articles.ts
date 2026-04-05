import type { Article } from "@/types";

export function getTitle(article: Pick<Article, "rewrittenTitle" | "originalTitle">): string {
  return article.rewrittenTitle || article.originalTitle;
}
