"use client";

import type { SubheaderData } from "./types";

function ChangeBadge({ change, changePercent }: { change: number; changePercent: number }) {
  const isUp = change >= 0;
  return (
    <span
      className={`text-[10px] font-bold px-1 py-0.5 rounded ${
        isUp ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
      }`}
    >
      {isUp ? "+" : ""}{changePercent.toFixed(2)}%
    </span>
  );
}

export function DashboardSubheader({ data }: { data: SubheaderData }) {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-[1200px] mx-auto px-4 py-2 flex items-center text-xs tracking-wide">
        {/* Weather segment */}
        <div className="flex items-center gap-2 pr-4 border-r border-gray-200">
          <span className="text-base leading-none">{data.weather.icon}</span>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-gray-900">{data.weather.temp}°F</span>
            <span className="text-[10px] text-gray-500">{data.weather.location}</span>
          </div>
        </div>

        {/* Markets segment */}
        <div className="flex items-center gap-4 px-4 border-r border-gray-200 overflow-x-auto">
          {data.markets.map((m) => (
            <div key={m.symbol} className="flex items-center gap-1.5 flex-shrink-0">
              <span className="font-semibold text-gray-700">{m.label}</span>
              <span className="text-gray-900 tabular-nums">
                {m.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <ChangeBadge change={m.change} changePercent={m.changePercent} />
            </div>
          ))}
        </div>

        {/* Sports segment */}
        <div className="flex items-center gap-2 pl-4 flex-shrink-0">
          <span className="text-base leading-none">⚾</span>
          <div className="flex items-center gap-1.5">
            <span className="font-bold" style={{ color: "#C41E3A" }}>STL</span>
            {data.sports.status === "upcoming" ? (
              <span className="text-gray-500">vs {data.sports.opponent} · {data.sports.gameTime}</span>
            ) : (
              <>
                <span className="font-bold tabular-nums">
                  {data.sports.teamScore}-{data.sports.opponentScore}
                </span>
                <span className="text-gray-500">{data.sports.opponent}</span>
                {data.sports.status === "live" ? (
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                    LIVE · {data.sports.gameTime}
                  </span>
                ) : (
                  <span className="text-gray-400 font-semibold">F</span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
