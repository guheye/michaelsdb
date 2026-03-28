import Link from "next/link";
import { CATEGORY_SLUGS, type Category } from "@/types";

export function SectionDivider({
  title,
  href,
}: {
  title: string;
  href?: string;
}) {
  const slug =
    href ||
    `/section/${CATEGORY_SLUGS[title as Category] || title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="section-header mb-4">
      <Link href={slug} className="hover:text-red transition-colors">
        {title}
      </Link>
    </div>
  );
}
