"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BRAND_WORDMARK_SANS,
  BRAND_WORDMARK_SERIF,
  BRAND_WORDMARK_SANS_ON_DARK,
} from "@/lib/brand";
import { wordmarkMichaelsdailybrief } from "@/lib/fonts";

export function Header() {
  const [aggregating, setAggregating] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);

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
        // Reload after a short delay so user sees the result
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
    <header style={{ backgroundColor: "#111" }}>
      <div className="max-w-[1200px] mx-auto px-4 min-h-[72px] h-[72px] flex items-center justify-between">
        {/* Left: logo + wordmark */}
        <Link href="/" className="flex items-baseline gap-2 sm:gap-2.5 leading-none">
          <span
            className={`${wordmarkMichaelsdailybrief.className} text-white text-[2.25rem] sm:text-[2.5rem] font-extrabold tracking-tight`}
          >
            {BRAND_WORDMARK_SERIF}
          </span>
          <span
            className="font-sans text-[1.375rem] sm:text-[1.5rem] font-extralight tracking-[0.14em] uppercase antialiased"
            style={{ color: BRAND_WORDMARK_SANS_ON_DARK }}
          >
            {BRAND_WORDMARK_SANS}
          </span>
        </Link>

        {/* Right: nav links + aggregate + search */}
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
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M1 4v6h6M23 20v-6h-6" />
                  <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
                </svg>
                Aggregate
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result toast */}
      {lastResult && (
        <div className="bg-gray-800 text-center py-1.5 px-4">
          <span className="text-xs text-gray-300">{lastResult}</span>
        </div>
      )}
    </header>
  );
}
