"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BRAND_WORDMARK_SANS,
  BRAND_WORDMARK_SERIF,
  BRAND_WORDMARK_SANS_ON_DARK,
} from "@/lib/brand";
import { wordmarkMichaelsdailybrief } from "@/lib/fonts";
import { CATEGORIES, CATEGORY_SLUGS, type Category } from "@/types";

export function Header() {
  const [aggregating, setAggregating] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleAggregate() {
    if (aggregating) return;
    setAggregating(true);
    setLastResult(null);
    try {
      const res = await fetch("/api/aggregate");
      const data = await res.json();
      if (res.status === 429 && data.retryAfterSeconds != null) {
        setLastResult(`Please wait ${data.retryAfterSeconds}s before aggregating again.`);
        return;
      }
      if (data.success) {
        const msg = `${data.feeds?.newArticles || 0} new · ${data.ai?.rewritten || 0} rewritten · ${data.images?.updated || 0} images`;
        setLastResult(msg);
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setLastResult("Error: " + (data.error || "unknown"));
      }
    } catch (err) {
      setLastResult("Failed to connect");
    } finally {
      setAggregating(false);
    }
  }

  return (
    <>
      <header style={{ backgroundColor: "#111" }}>
        <div className="max-w-[1200px] mx-auto px-4 min-h-[52px] h-[52px] flex items-center justify-between">
          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <span className="block w-5 h-[2px] bg-white" />
            <span className="block w-5 h-[2px] bg-white" />
            <span className="block w-5 h-[2px] bg-white" />
          </button>

          {/* Logo + wordmark */}
          <Link href="/" className="flex items-baseline gap-2 sm:gap-2.5 leading-none">
            <span
              className={`${wordmarkMichaelsdailybrief.className} text-white text-[1.75rem] sm:text-[2rem] font-extrabold tracking-tight`}
            >
              {BRAND_WORDMARK_SERIF}
            </span>
            <span
              className="font-sans text-[0.875rem] sm:text-[1.25rem] font-extralight tracking-[0.14em] uppercase antialiased hidden sm:inline"
              style={{ color: BRAND_WORDMARK_SANS_ON_DARK }}
            >
              {BRAND_WORDMARK_SANS}
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/section/opinion" className="text-white font-sans text-xs font-bold uppercase tracking-wider hover:text-gray-300 transition-colors">
              Opinion
            </Link>
            <Link href="/section/books-ideas" className="text-white font-sans text-xs font-bold uppercase tracking-wider hover:text-gray-300 transition-colors">
              Ideas
            </Link>
            <Link href="/contact" className="text-white font-sans text-xs font-bold uppercase tracking-wider hover:text-gray-300 transition-colors">
              Contact
            </Link>
            <button
              onClick={handleAggregate}
              disabled={aggregating}
              className="btn-subscribe flex items-center gap-2"
            >
              {aggregating ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                  </svg>
                  Fetching...
                </>
              ) : (
                "Aggregate"
              )}
            </button>
          </div>

          {/* Mobile aggregate button (refresh icon) */}
          <button
            onClick={handleAggregate}
            disabled={aggregating}
            className="md:hidden flex items-center justify-center w-8 h-8"
            aria-label="Aggregate"
          >
            {aggregating ? (
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M1 4v6h6M23 20v-6h-6" />
                <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
              </svg>
            )}
          </button>
        </div>

        {/* Result toast */}
        {lastResult && (
          <div className="bg-gray-800 text-center py-1.5 px-4">
            <span className="text-xs text-gray-300">{lastResult}</span>
          </div>
        )}
      </header>

      {/* Mobile slide-out drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMenuOpen(false)}
          />
          {/* Drawer */}
          <nav
            className="absolute top-0 left-0 bottom-0 w-[280px] overflow-y-auto"
            style={{ backgroundColor: "#111" }}
          >
            {/* Close button */}
            <div className="flex items-center justify-between px-4 h-[52px] border-b border-white/10">
              <span className={`${wordmarkMichaelsdailybrief.className} text-white text-[1.25rem] font-extrabold tracking-tight`}>
                {BRAND_WORDMARK_SERIF}
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-white w-8 h-8 flex items-center justify-center"
                aria-label="Close menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Primary links */}
            <div className="px-4 py-4 border-b border-white/10">
              <Link href="/" onClick={() => setMenuOpen(false)} className="block py-2.5 text-white font-sans text-sm font-bold uppercase tracking-wider">
                Home
              </Link>
              <Link href="/section/opinion" onClick={() => setMenuOpen(false)} className="block py-2.5 text-white font-sans text-sm font-bold uppercase tracking-wider">
                Opinion
              </Link>
              <Link href="/section/books-ideas" onClick={() => setMenuOpen(false)} className="block py-2.5 text-white font-sans text-sm font-bold uppercase tracking-wider">
                Ideas
              </Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)} className="block py-2.5 text-white font-sans text-sm font-bold uppercase tracking-wider">
                Contact
              </Link>
            </div>

            {/* All sections */}
            <div className="px-4 py-4">
              <div className="text-gray-500 text-[0.625rem] font-bold uppercase tracking-widest mb-3">
                Sections
              </div>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/section/${CATEGORY_SLUGS[cat as Category]}`}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 text-gray-300 font-sans text-sm hover:text-white transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>

            {/* Aggregate button in drawer */}
            <div className="px-4 py-4 border-t border-white/10">
              <button
                onClick={() => { handleAggregate(); setMenuOpen(false); }}
                disabled={aggregating}
                className="btn-subscribe w-full flex items-center justify-center gap-2"
              >
                {aggregating ? "Fetching..." : "Aggregate Feeds"}
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
