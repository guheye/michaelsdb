"use client";

import { useState, useEffect } from "react";
import type { SubheaderData } from "./types";

interface Slide {
  key: string;
  content: React.ReactNode;
}

function buildSlides(data: SubheaderData): Slide[] {
  const slides: Slide[] = [];

  // Weather slide
  slides.push({
    key: "weather",
    content: (
      <span className="inline-flex items-center gap-2">
        <span className="text-base">{data.weather.icon}</span>
        <span className="font-bold">{data.weather.location}</span>
        <span>{data.weather.temp}°F</span>
        <span className="text-gray-400">—</span>
        <span className="text-gray-600">{data.weather.condition}</span>
      </span>
    ),
  });

  // Markets slide
  slides.push({
    key: "markets",
    content: (
      <span className="inline-flex items-center gap-3">
        <span className="font-bold uppercase tracking-wider text-gray-400 text-[10px]">Markets</span>
        {data.markets.map((m) => {
          const isUp = m.change >= 0;
          return (
            <span key={m.symbol} className="inline-flex items-center gap-1">
              <span className="font-semibold">{m.label}</span>
              <span className="tabular-nums">
                {m.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`tabular-nums font-semibold ${isUp ? "text-emerald-600" : "text-red-600"}`}>
                {isUp ? "+" : ""}{m.changePercent.toFixed(2)}%
              </span>
            </span>
          );
        })}
      </span>
    ),
  });

  // Sports slide
  slides.push({
    key: "sports",
    content: (
      <span className="inline-flex items-center gap-2">
        <span>⚾</span>
        <span className="font-bold" style={{ color: "#C41E3A" }}>Cardinals</span>
        {data.sports.status === "upcoming" ? (
          <span className="text-gray-600">vs {data.sports.opponent} · {data.sports.gameTime}</span>
        ) : (
          <>
            <span className="font-bold tabular-nums">
              {data.sports.teamScore} - {data.sports.opponentScore}
            </span>
            <span className="text-gray-500">vs {data.sports.opponent}</span>
            {data.sports.status === "live" ? (
              <span className="text-emerald-600 font-semibold">{data.sports.gameTime}</span>
            ) : (
              <span className="text-gray-400">FINAL</span>
            )}
          </>
        )}
      </span>
    ),
  });

  return slides;
}

export function RotatingSubheader({ data }: { data: SubheaderData }) {
  const slides = buildSlides(data);
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setFading(false);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-[1200px] mx-auto px-4 py-2 flex items-center justify-center text-xs tracking-wide relative h-8">
        {/* Progress dots */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex gap-1">
          {slides.map((s, i) => (
            <button
              key={s.key}
              onClick={() => { setFading(false); setCurrent(i); }}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === current ? "bg-accent" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div
          className={`transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}
        >
          {slides[current].content}
        </div>

        {/* Category label */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">
            {slides[current].key}
          </span>
        </div>
      </div>
    </nav>
  );
}
