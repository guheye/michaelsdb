"use client";

import { useState } from "react";
import { MOCK_DATA } from "@/components/subheader/types";
import type { SubheaderData, SportsScore } from "@/components/subheader/types";
import { TickerSubheader } from "@/components/subheader/TickerSubheader";
import { DashboardSubheader } from "@/components/subheader/DashboardSubheader";
import { CarouselSubheader } from "@/components/subheader/CarouselSubheader";
import { EditorialSubheader } from "@/components/subheader/EditorialSubheader";
import { RotatingSubheader } from "@/components/subheader/RotatingSubheader";

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

export default function SubheaderDevPage() {
  const [sportsState, setSportsState] = useState<string>("live");

  const data: SubheaderData = {
    ...MOCK_DATA,
    sports: SPORT_STATES[sportsState],
  };

  const variants = [
    {
      name: "1. Rolling Ticker",
      description: "Bloomberg/CNBC-style continuous horizontal scroll. Dark background, pauses on hover.",
      component: <TickerSubheader data={data} />,
    },
    {
      name: "2. Compact Dashboard",
      description: "Fixed segments separated by dividers: Weather | Markets | Sports. Clean and scannable.",
      component: <DashboardSubheader data={data} />,
    },
    {
      name: "3. Card Carousel",
      description: "Swipeable mini-cards with color-coded left borders. Arrows appear on hover.",
      component: <CarouselSubheader data={data} />,
    },
    {
      name: "4. Editorial Strip",
      description: "Newspaper-style single line with pipe dividers. Matches the editorial tone of the site.",
      component: <EditorialSubheader data={data} />,
    },
    {
      name: "5. Minimal Rotating",
      description: "Cycles through data types with a fade transition every 4 seconds. Dot navigation.",
      component: <RotatingSubheader data={data} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 px-6 py-4">
        <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-serif)" }}>
          Subheader Variants — Dev Preview
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Comparing 5 style options for the info bar. All use mock data.
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

      {/* Variants */}
      <div className="max-w-[1400px] mx-auto py-8 px-6 space-y-10">
        {variants.map((v) => (
          <div key={v.name}>
            <div className="mb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">{v.name}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{v.description}</p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-md border border-gray-200">
              {v.component}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
