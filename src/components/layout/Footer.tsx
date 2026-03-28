import Link from "next/link";
import {
  BRAND_DISPLAY,
  BRAND_WORDMARK_SANS,
  BRAND_WORDMARK_SERIF,
  BRAND_WORDMARK_SANS_ON_DARK,
} from "@/lib/brand";
import { wordmarkMichaelsdailybrief } from "@/lib/fonts";
import { CATEGORIES, CATEGORY_SLUGS, type Category } from "@/types";

export function Footer() {
  return (
    <footer className="text-white mt-12" style={{ backgroundColor: "#111" }}>
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
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

          {/* Sections */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-gray-300">
              Sections
            </h4>
            <ul className="space-y-1.5">
              {CATEGORIES.slice(0, 4).map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/section/${CATEGORY_SLUGS[cat as Category]}`}
                    className="text-gray-400 text-xs hover:text-white transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-gray-300">
              More
            </h4>
            <ul className="space-y-1.5">
              {CATEGORIES.slice(4).map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/section/${CATEGORY_SLUGS[cat as Category]}`}
                    className="text-gray-400 text-xs hover:text-white transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-gray-300">
              About
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 text-xs hover:text-white transition-colors"
                >
                  Editorial Charter
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 text-xs hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-gray-500 text-[0.625rem]">
          &copy; {new Date().getFullYear()} {BRAND_DISPLAY}. All rights reserved.
          Headlines curated and reframed by AI in accordance with our editorial
          charter.
        </div>
      </div>
    </footer>
  );
}
