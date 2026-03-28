"use client";

import type { SubheaderData } from "./types";

function Divider() {
  return <span className="text-gray-300 mx-2 select-none">|</span>;
}

export function EditorialSubheader({ data }: { data: SubheaderData }) {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-[1200px] mx-auto px-4 py-2 flex items-center justify-between text-xs tracking-wide overflow-x-auto whitespace-nowrap scrollbar-hide">
        {/* Weather - editorial style with location emphasis */}
        <span className="inline-flex items-center gap-1">
          <span className="font-bold uppercase text-gray-800 tracking-wider">{data.weather.location}</span>
          <span className="text-gray-600">{data.weather.icon} {data.weather.temp}° {data.weather.condition}</span>
        </span>

        <Divider />

        {/* Markets - newspaper ticker style: symbol in bold, then number */}
        {data.markets.map((m, i) => {
          const isUp = m.change >= 0;
          return (
            <span key={m.symbol} className="inline-flex items-center">
              {i > 0 && <span className="text-gray-300 mx-1.5">·</span>}
              <span className="font-bold text-gray-800">{m.label}</span>
              <span className="ml-1 tabular-nums text-gray-600">
                {m.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`ml-1 font-semibold tabular-nums ${isUp ? "text-emerald-700" : "text-red-700"}`}>
                {isUp ? "↑" : "↓"}{Math.abs(m.changePercent).toFixed(2)}%
              </span>
            </span>
          );
        })}

        <Divider />

        {/* Sports - editorial recap style */}
        <span className="inline-flex items-center gap-1">
          <span className="font-bold uppercase tracking-wider" style={{ color: "#C41E3A" }}>Cardinals</span>
          {data.sports.status === "upcoming" ? (
            <span className="text-gray-600">vs {data.sports.opponent} · {data.sports.gameTime}</span>
          ) : (
            <>
              <span className="font-semibold tabular-nums text-gray-800">
                {data.sports.teamScore}-{data.sports.opponentScore}
              </span>
              <span className="text-gray-500">vs {data.sports.opponent}</span>
              {data.sports.status === "live" ? (
                <span className="font-bold text-emerald-700">· {data.sports.gameTime}</span>
              ) : (
                <span className="text-gray-400 italic">Final</span>
              )}
            </>
          )}
        </span>
      </div>
    </nav>
  );
}
