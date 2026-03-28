import Link from "next/link";
import {
  BRAND_DISPLAY,
  BRAND_WORDMARK_SANS,
  BRAND_WORDMARK_SERIF,
  BRAND_WORDMARK_SANS_ON_DARK,
} from "@/lib/brand";
import { wordmarkMichaelsdailybrief } from "@/lib/fonts";
import { CATEGORY_SLUGS, type Category } from "@/types";

const FOOTER_SECTIONS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "News & Politics",
    links: [
      { label: "News", href: `/section/${CATEGORY_SLUGS["News"]}` },
      { label: "Political Economy", href: `/section/${CATEGORY_SLUGS["Political Economy"]}` },
      { label: "Policy", href: `/section/${CATEGORY_SLUGS["Policy"]}` },
      { label: "Foreign Affairs", href: `/section/${CATEGORY_SLUGS["Foreign Affairs"]}` },
      { label: "Opinion", href: `/section/${CATEGORY_SLUGS["Opinion"]}` },
    ],
  },
  {
    heading: "Ideas & Culture",
    links: [
      { label: "Culture", href: `/section/${CATEGORY_SLUGS["Culture"]}` },
      { label: "Books & Ideas", href: `/section/${CATEGORY_SLUGS["Books & Ideas"]}` },
      { label: "Science & Tech", href: `/section/${CATEGORY_SLUGS["Science & Tech"]}` },
      { label: "Art & Luxury", href: `/section/${CATEGORY_SLUGS["Art & Luxury"]}` },
    ],
  },
  {
    heading: "Markets & More",
    links: [
      { label: "Markets", href: `/section/${CATEGORY_SLUGS["Markets"]}` },
      { label: "Tech", href: `/section/${CATEGORY_SLUGS["Tech"]}` },
      { label: "Artificial Intelligence", href: `/section/${CATEGORY_SLUGS["Artificial Intelligence"]}` },
      { label: "Firearms", href: `/section/${CATEGORY_SLUGS["Firearms"]}` },
      { label: "Sports", href: `/section/${CATEGORY_SLUGS["Sports"]}` },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="text-white mt-12" style={{ backgroundColor: "#111" }}>
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="mb-3 flex flex-wrap items-baseline gap-2 leading-tight">
              <span
                className={`${wordmarkMichaelsdailybrief.className} text-[1.5rem] sm:text-[1.75rem] font-extrabold tracking-tight`}
              >
                {BRAND_WORDMARK_SERIF}
              </span>
              <span
                className="font-sans text-[1.25rem] sm:text-[1.375rem] font-extralight tracking-[0.14em] uppercase antialiased"
                style={{ color: BRAND_WORDMARK_SANS_ON_DARK }}
              >
                {BRAND_WORDMARK_SANS}
              </span>
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Intellectual conservative news and analysis grounded in evidence,
              complexity, and honest argument.
            </p>
          </div>

          {/* Section columns */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.heading}>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-gray-300">
                {section.heading}
              </h4>
              <ul className="space-y-1.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 text-xs hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-gray-500 text-[0.625rem]">
          &copy; {new Date().getFullYear()} {BRAND_DISPLAY}. All rights reserved.
          Headlines curated and reframed by AI.
        </div>
      </div>
    </footer>
  );
}
