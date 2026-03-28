"use client";

import { useRef } from "react";
import type { SubheaderData } from "./types";

function Card({ children, accentColor }: { children: React.ReactNode; accentColor?: string }) {
  return (
    <div
      className="flex-shrink-0 bg-gray-50 rounded-md px-3 py-1.5 flex items-center gap-2 text-xs border border-gray-100"
      style={accentColor ? { borderLeft: `3px solid ${accentColor}` } : undefined}
    >
      {children}
    </div>
  );
}

export function CarouselSubheader({ data }: { data: SubheaderData }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 relative group">
      <div className="max-w-[1200px] mx-auto px-8 py-2 relative">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-white border border-gray-200 rounded-full text-gray-400 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity z-10 text-xs"
        >
          ‹
        </button>

        <div ref={scrollRef} className="flex items-center gap-2 overflow-x-auto scrollbar-hide scroll-smooth">
          {/* Weather card */}
          <Card accentColor="#3B82F6">
            <span className="text-base leading-none">{data.weather.icon}</span>
            <span className="font-bold text-gray-900">{data.weather.temp}°F</span>
            <span className="text-gray-500">{data.weather.condition}</span>
          </Card>

          {/* Market cards */}
          {data.markets.map((m) => {
            const isUp = m.change >= 0;
            return (
              <Card key={m.symbol} accentColor={isUp ? "#059669" : "#DC2626"}>
                <span className="font-semibold text-gray-700">{m.label}</span>
                <span className="tabular-nums text-gray-900">
                  {m.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className={`font-bold tabular-nums ${isUp ? "text-emerald-600" : "text-red-600"}`}>
                  {isUp ? "+" : ""}{m.changePercent.toFixed(2)}%
                </span>
              </Card>
            );
          })}

          {/* Sports card */}
          <Card accentColor="#C41E3A">
            <span className="text-base leading-none">⚾</span>
            <span className="font-bold" style={{ color: "#C41E3A" }}>Cardinals</span>
            {data.sports.status === "upcoming" ? (
              <span className="text-gray-500">vs {data.sports.opponent} · {data.sports.gameTime}</span>
            ) : (
              <>
                <span className="font-bold tabular-nums">
                  {data.sports.teamScore}-{data.sports.opponentScore}
                </span>
                <span className="text-gray-500">vs {data.sports.opponent}</span>
                {data.sports.status === "live" && (
                  <span className="text-emerald-600 font-semibold animate-pulse text-[10px]">● {data.sports.gameTime}</span>
                )}
                {data.sports.status === "final" && (
                  <span className="text-gray-400 font-semibold">FINAL</span>
                )}
              </>
            )}
          </Card>
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-white border border-gray-200 rounded-full text-gray-400 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity z-10 text-xs"
        >
          ›
        </button>
      </div>
    </nav>
  );
}
