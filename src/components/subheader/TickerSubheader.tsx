"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type { SubheaderData } from "./types";
import { MOCK_DATA, MLB_TEAM_COLORS } from "./types";

function ChangeIndicator({ change, changePercent }: { change: number; changePercent: number }) {
  const isUp = change >= 0;
  return (
    <span className={isUp ? "text-emerald-600" : "text-red-600"}>
      {isUp ? "▲" : "▼"} {Math.abs(changePercent).toFixed(2)}%
    </span>
  );
}

type TickerSubheaderProps = {
  /** When set, uses this data and skips live API fetch (e.g. dev preview). */
  data?: SubheaderData;
};

export function TickerSubheader({ data: controlledData }: TickerSubheaderProps = {}) {
  const [fetchedData, setFetchedData] = useState<SubheaderData>(MOCK_DATA);
  const data = controlledData ?? fetchedData;
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const SPEED = 40; // pixels per second
  const REFRESH_INTERVAL = 5 * 60 * 1000; // refresh data every 5 min

  // Fetch live data when not controlled by parent
  useEffect(() => {
    if (controlledData) return;

    let mounted = true;

    async function fetchData() {
      try {
        const res = await fetch("/api/ticker-data", { cache: "no-store" });
        if (!res.ok) throw new Error(`${res.status}`);
        const json = await res.json();
        if (mounted) setFetchedData(json);
      } catch (e) {
        console.error("Ticker data fetch failed, using mock:", e);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [controlledData]);

  const tick = useCallback(
    (timestamp: number) => {
      if (!trackRef.current) return;

      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp;
      }

      if (!paused) {
        const delta = (timestamp - lastTimeRef.current) / 1000;
        offsetRef.current -= SPEED * delta;

        // The track has three identical thirds. When we've scrolled past
        // the first third, jump forward by exactly that amount so the
        // seam is never visible.
        const thirdWidth = trackRef.current.scrollWidth / 3;
        if (Math.abs(offsetRef.current) >= thirdWidth) {
          offsetRef.current += thirdWidth;
        }

        trackRef.current.style.transform = `translateX(${offsetRef.current}px)`;
      }

      lastTimeRef.current = timestamp;
      rafRef.current = requestAnimationFrame(tick);
    },
    [paused]
  );

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  const items = [
    // Weather
    <span key="weather" className="inline-flex items-center gap-1.5">
      <span>{data.weather.icon}</span>
      <span className="font-semibold">{data.weather.location}</span>
      <span>{data.weather.temp}°F</span>
      <span className="text-gray-400">{data.weather.condition}</span>
    </span>,
    // Markets
    ...data.markets.map((m) => (
      <span key={m.symbol} className="inline-flex items-center gap-1.5">
        <span className="font-semibold">{m.label}</span>
        <span>{m.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        <ChangeIndicator change={m.change} changePercent={m.changePercent} />
      </span>
    )),
    // Sports
    <span key="sports" className="inline-flex items-center gap-1.5">
      <span className="font-semibold" style={{ color: "#C41E3A" }}>⚾ Cardinals</span>
      {data.sports.status === "upcoming" ? (
        <span className="inline-flex items-center gap-1.5">
          <span className="text-gray-500">vs</span>
          <span className="font-semibold" style={{ color: MLB_TEAM_COLORS[data.sports.opponent] || "#999" }}>{data.sports.opponent}</span>
          <span className="text-gray-500">· {data.sports.gameTime}</span>
        </span>
      ) : (
        <>
          <span>
            {data.sports.teamScore} - {data.sports.opponentScore}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="text-gray-500">vs</span>
            <span className="font-semibold" style={{ color: MLB_TEAM_COLORS[data.sports.opponent] || "#999" }}>{data.sports.opponent}</span>
          </span>
          {data.sports.status === "live" ? (
            <span className="text-emerald-600 font-semibold animate-pulse">{data.sports.gameTime}</span>
          ) : (
            <span className="text-gray-400">FINAL</span>
          )}
        </>
      )}
    </span>,
  ];

  // Render items 3 times for plenty of buffer
  const tickerContent = [...items, ...items, ...items];

  return (
    <div
      className="text-white"
      style={{ backgroundColor: "#111" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-[1200px] mx-auto px-2 sm:px-4 relative overflow-hidden">
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #111, transparent)" }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #111, transparent)" }}
        />
        <div
          ref={trackRef}
          className="flex items-center gap-5 sm:gap-8 py-1 sm:py-1.5 text-[0.6875rem] sm:text-xs tracking-wide whitespace-nowrap will-change-transform"
        >
          {tickerContent.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-5 sm:gap-8">
              {item}
              <span className="text-gray-600">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
