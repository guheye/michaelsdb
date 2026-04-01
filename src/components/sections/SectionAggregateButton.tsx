"use client";

import { useState } from "react";
import { AggregatePasswordModal } from "@/components/ui/AggregatePasswordModal";

export function SectionAggregateButton({ category }: { category: string }) {
  const [aggregating, setAggregating] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  async function handleAggregate(password: string) {
    setShowPasswordModal(false);
    setAggregating(true);
    setLastResult(null);
    try {
      const res = await fetch(
        `/api/aggregate?category=${encodeURIComponent(category)}`,
        {
          method: "POST",
          headers: { "x-aggregate-secret": password },
        }
      );
      const data = await res.json();
      if (res.status === 401) {
        setLastResult("Incorrect password.");
        return;
      }
      if (res.status === 429 && data.retryAfterSeconds != null) {
        setLastResult(
          `Please wait ${data.retryAfterSeconds}s before aggregating again.`
        );
        return;
      }
      if (data.success) {
        const msg = `${data.feeds?.newArticles || 0} new · ${data.ai?.rewritten || 0} rewritten · ${data.images?.updated || 0} images`;
        setLastResult(msg);
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setLastResult("Error: " + (data.error || "unknown"));
      }
    } catch {
      setLastResult("Failed to connect");
    } finally {
      setAggregating(false);
    }
  }

  return (
    <>
      {showPasswordModal && (
        <AggregatePasswordModal
          onConfirm={handleAggregate}
          onCancel={() => setShowPasswordModal(false)}
        />
      )}
    <div className="flex items-center gap-3">
      <button
        onClick={() => { if (!aggregating) setShowPasswordModal(true); }}
        disabled={aggregating}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-sans font-bold uppercase tracking-wider border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50"
      >
        {aggregating ? (
          <>
            <svg
              className="animate-spin h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                className="opacity-25"
              />
              <path
                d="M4 12a8 8 0 018-8"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                className="opacity-75"
              />
            </svg>
            Fetching {category}...
          </>
        ) : (
          `Aggregate ${category}`
        )}
      </button>
      {lastResult && (
        <span className="text-xs text-gray-500">{lastResult}</span>
      )}
    </div>
    </>
  );
}
