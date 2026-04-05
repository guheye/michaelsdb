"use client";

import { useState } from "react";
import { MOCK_DATA, MLB_TEAM_COLORS } from "@/components/subheader/types";
import type { SubheaderData, SportsScore } from "@/components/subheader/types";

const SPORT_STATES: Record<string, SportsScore> = {
  live: {
    team: "STL Cardinals",
    opponent: "Cubs",
    teamScore: 5,
    opponentScore: 3,
    status: "live",
    gameTime: "Bot 6th",
  },
  final: {
    team: "STL Cardinals",
    opponent: "Cubs",
    teamScore: 7,
    opponentScore: 4,
    status: "final",
  },
  upcoming: {
    team: "STL Cardinals",
    opponent: "Brewers",
    teamScore: null,
    opponentScore: null,
    status: "upcoming",
    gameTime: "Today 7:15 PM",
  },
};

// Each tunable element with option choices
interface ColorOption {
  label: string;
  value: string;       // Tailwind class
  hex: string;         // for display
  ratio: string;       // contrast ratio vs #111
}

interface TunableElement {
  id: string;
  label: string;
  description: string;
  current: number;     // index of the "current" option (pre-selected)
  options: ColorOption[];
}

const ELEMENTS: TunableElement[] = [
  {
    id: "separator",
    label: "Dot Separator ( • )",
    description: "Decorative bullet between ticker items",
    current: 0,
    options: [
      { label: "gray-600 (current)", value: "text-gray-600", hex: "#4B5563", ratio: "2.7:1 FAIL" },
      { label: "gray-500", value: "text-gray-500", hex: "#6B7280", ratio: "3.8:1" },
      { label: "gray-400", value: "text-gray-400", hex: "#9CA3AF", ratio: "5.5:1" },
      { label: "gray-300", value: "text-gray-300", hex: "#D1D5DB", ratio: "10.3:1" },
    ],
  },
  {
    id: "secondary",
    label: "Secondary Text (vs, game time, condition)",
    description: "Weather condition, 'vs', upcoming game time",
    current: 0,
    options: [
      { label: "gray-500 (current for 'vs')", value: "text-gray-500", hex: "#6B7280", ratio: "3.8:1 FAIL" },
      { label: "gray-400 (current for condition)", value: "text-gray-400", hex: "#9CA3AF", ratio: "5.5:1" },
      { label: "gray-300", value: "text-gray-300", hex: "#D1D5DB", ratio: "10.3:1" },
    ],
  },
  {
    id: "marketUp",
    label: "Market Up (positive change)",
    description: "Green text for positive market percentage",
    current: 0,
    options: [
      { label: "emerald-600 (current)", value: "text-emerald-600", hex: "#059669", ratio: "3.5:1 FAIL" },
      { label: "emerald-500", value: "text-emerald-500", hex: "#10B981", ratio: "5.0:1" },
      { label: "emerald-400", value: "text-emerald-400", hex: "#34D399", ratio: "7.8:1" },
      { label: "green-400", value: "text-green-400", hex: "#4ADE80", ratio: "8.6:1" },
    ],
  },
  {
    id: "marketDown",
    label: "Market Down (negative change)",
    description: "Red text for negative market percentage",
    current: 0,
    options: [
      { label: "red-600 (current)", value: "text-red-600", hex: "#DC2626", ratio: "3.5:1 FAIL" },
      { label: "red-500", value: "text-red-500", hex: "#EF4444", ratio: "4.6:1" },
      { label: "red-400", value: "text-red-400", hex: "#F87171", ratio: "5.9:1" },
      { label: "rose-400", value: "text-rose-400", hex: "#FB7185", ratio: "5.7:1" },
    ],
  },
  {
    id: "liveIndicator",
    label: "Live Game Indicator",
    description: "Pulsing text for live game inning",
    current: 0,
    options: [
      { label: "emerald-600 (current)", value: "text-emerald-600", hex: "#059669", ratio: "3.5:1 FAIL" },
      { label: "emerald-500", value: "text-emerald-500", hex: "#10B981", ratio: "5.0:1" },
      { label: "emerald-400", value: "text-emerald-400", hex: "#34D399", ratio: "7.8:1" },
      { label: "green-400", value: "text-green-400", hex: "#4ADE80", ratio: "8.6:1" },
    ],
  },
  {
    id: "finalLabel",
    label: "FINAL Label",
    description: "Text shown when a game is over",
    current: 0,
    options: [
      { label: "gray-400 (current)", value: "text-gray-400", hex: "#9CA3AF", ratio: "5.5:1" },
      { label: "gray-300", value: "text-gray-300", hex: "#D1D5DB", ratio: "10.3:1" },
      { label: "gray-500", value: "text-gray-500", hex: "#6B7280", ratio: "3.8:1" },
    ],
  },
];

function ChangeIndicator({
  change,
  changePercent,
  upClass,
  downClass,
}: {
  change: number;
  changePercent: number;
  upClass: string;
  downClass: string;
}) {
  const isUp = change >= 0;
  return (
    <span className={isUp ? upClass : downClass}>
      {isUp ? "▲" : "▼"} {Math.abs(changePercent).toFixed(2)}%
    </span>
  );
}

function TickerPreview({
  data,
  choices,
}: {
  data: SubheaderData;
  choices: Record<string, number>;
}) {
  const get = (id: string) => {
    const el = ELEMENTS.find((e) => e.id === id)!;
    return el.options[choices[id] ?? el.current].value;
  };

  const separatorClass = get("separator");
  const secondaryClass = get("secondary");
  const upClass = get("marketUp");
  const downClass = get("marketDown");
  const liveClass = get("liveIndicator");
  const finalClass = get("finalLabel");

  const items = [
    // Weather
    <span key="weather" className="inline-flex items-center gap-1.5">
      <span className="ticker-weather-icon">{data.weather.icon}</span>
      <span className="font-semibold">{data.weather.location}</span>
      <span>{data.weather.temp}°F</span>
      <span className={secondaryClass}>{data.weather.condition}</span>
    </span>,
    // Markets
    ...data.markets.map((m) => (
      <span key={m.symbol} className="inline-flex items-center gap-1.5">
        <span className="font-semibold">{m.label}</span>
        <span>
          {m.price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
        <ChangeIndicator
          change={m.change}
          changePercent={m.changePercent}
          upClass={upClass}
          downClass={downClass}
        />
      </span>
    )),
    // Sports
    <span key="sports" className="inline-flex items-center gap-1.5">
      <span className="font-semibold" style={{ color: "#C41E3A" }}>
        ⚾ Cardinals
      </span>
      {data.sports.status === "upcoming" ? (
        <span className="inline-flex items-center gap-1.5">
          <span className={secondaryClass}>vs</span>
          <span
            className="font-semibold"
            style={{ color: MLB_TEAM_COLORS[data.sports.opponent] || "#999" }}
          >
            {data.sports.opponent}
          </span>
          <span className={secondaryClass}>· {data.sports.gameTime}</span>
        </span>
      ) : (
        <>
          <span>
            {data.sports.teamScore} - {data.sports.opponentScore}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className={secondaryClass}>vs</span>
            <span
              className="font-semibold"
              style={{ color: MLB_TEAM_COLORS[data.sports.opponent] || "#999" }}
            >
              {data.sports.opponent}
            </span>
          </span>
          {data.sports.status === "live" ? (
            <span className={`${liveClass} font-semibold animate-pulse`}>
              {data.sports.gameTime}
            </span>
          ) : (
            <span className={finalClass}>FINAL</span>
          )}
        </>
      )}
    </span>,
  ];

  return (
    <div className="text-white" style={{ backgroundColor: "#111" }}>
      <div className="max-w-[1200px] mx-auto px-4 relative overflow-hidden">
        <div className="flex items-center gap-8 py-1.5 text-xs tracking-wide whitespace-nowrap">
          {items.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-8">
              {item}
              <span className={separatorClass}>•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TickerContrastPage() {
  const [sportsState, setSportsState] = useState<string>("live");
  const [choices, setChoices] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const el of ELEMENTS) init[el.id] = el.current;
    return init;
  });

  const data: SubheaderData = {
    ...MOCK_DATA,
    sports: SPORT_STATES[sportsState],
  };

  const setChoice = (id: string, index: number) => {
    setChoices((prev) => ({ ...prev, [id]: index }));
  };

  const hasChanges = ELEMENTS.some((el) => choices[el.id] !== el.current);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 px-6 py-4">
        <h1
          className="text-xl font-bold"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Ticker Contrast Options
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Pick the color you prefer for each element. The preview updates live.
        </p>

        {/* Sports state toggle */}
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="font-semibold text-gray-700">Game state:</span>
          {Object.keys(SPORT_STATES).map((state) => (
            <button
              key={state}
              onClick={() => setSportsState(state)}
              className={`px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider transition-colors ${
                sportsState === state
                  ? "bg-accent text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {state}
            </button>
          ))}
        </div>
      </div>

      {/* Live preview - sticky */}
      <div className="sticky top-0 z-50 shadow-lg">
        <div className="bg-gray-800 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">
          Live Preview
        </div>
        <TickerPreview data={data} choices={choices} />
      </div>

      {/* Controls */}
      <div className="max-w-[900px] mx-auto py-8 px-6 space-y-6">
        {ELEMENTS.map((el) => {
          // Filter visible elements based on sports state
          if (el.id === "liveIndicator" && sportsState !== "live") return null;
          if (el.id === "finalLabel" && sportsState !== "final") return null;

          return (
            <div
              key={el.id}
              className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
            >
              <div className="mb-3">
                <h2 className="text-sm font-bold text-gray-900">{el.label}</h2>
                <p className="text-xs text-gray-500">{el.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {el.options.map((opt, i) => {
                  const selected = choices[el.id] === i;
                  const isCurrent = i === el.current;
                  const failsAA = opt.ratio.includes("FAIL");

                  return (
                    <button
                      key={opt.value}
                      onClick={() => setChoice(el.id, i)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border-2 transition-all text-left ${
                        selected
                          ? "border-accent bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      {/* Color swatch on dark bg */}
                      <span
                        className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ backgroundColor: "#111", color: opt.hex }}
                      >
                        Aa
                      </span>
                      <span className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-800">
                          {opt.label}
                        </span>
                        <span className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`text-[10px] font-bold px-1 py-0.5 rounded ${
                              failsAA
                                ? "bg-red-100 text-red-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {opt.ratio}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-semibold text-gray-400 uppercase">
                              current
                            </span>
                          )}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Summary of selections */}
        {hasChanges && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-bold text-blue-900 mb-2">
              Your selections (changed from current)
            </h3>
            <ul className="text-xs text-blue-800 space-y-1">
              {ELEMENTS.filter((el) => choices[el.id] !== el.current).map(
                (el) => {
                  const opt = el.options[choices[el.id]];
                  return (
                    <li key={el.id}>
                      <span className="font-semibold">{el.label}:</span>{" "}
                      {el.options[el.current].label} &rarr; {opt.label}{" "}
                      <span className="text-blue-600">({opt.ratio})</span>
                    </li>
                  );
                }
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
