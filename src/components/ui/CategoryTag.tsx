import Link from "next/link";
import { CATEGORY_SLUGS, type Category } from "@/types";

export function CategoryTag({
  category,
  asSpan = false,
}: {
  category: string;
  variant?: "filled" | "text";
  asSpan?: boolean;
}) {
  const slug = CATEGORY_SLUGS[category as Category] || category.toLowerCase().replace(/\s+/g, "-");

  if (asSpan) {
    return (
      <span className="category-label">
        {category}
      </span>
    );
  }

  return (
    <Link
      href={`/section/${slug}`}
      className="category-label"
    >
      {category}
    </Link>
  );
}
