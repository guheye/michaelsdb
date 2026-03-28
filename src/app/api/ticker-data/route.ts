import { NextResponse } from "next/server";
import type { SubheaderData, WeatherData, MarketItem, SportsScore } from "@/components/subheader/types";
import { MOCK_DATA } from "@/components/subheader/types";

export const dynamic = "force-dynamic";

// Cache results in memory for 5 minutes to avoid hammering free APIs
// Use globalThis to survive hot reloads in dev, but allow cache busting
const globalCache = globalThis as unknown as { __tickerCache?: { data: SubheaderData; timestamp: number } | null };
if (!globalCache.__tickerCache) globalCache.__tickerCache = null;
const CACHE_TTL = 5 * 60 * 1000;

// --- Weather via wttr.in (free, no key) ---
async function fetchWeather(): Promise<WeatherData> {
  try {
    const res = await fetch("https://wttr.in/San+Francisco?format=j1", {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`wttr.in ${res.status}`);
    const data = await res.json();
    const current = data.current_condition?.[0];
    if (!current) throw new Error("No current condition");

    return {
      temp: Math.round(Number(current.temp_F)),
      condition: current.weatherDesc?.[0]?.value || "Unknown",
      icon: weatherCodeToEmoji(current.weatherCode),
      location: "SF",
    };
  } catch (e) {
    console.error("Weather fetch failed:", e);
    return MOCK_DATA.weather;
  }
}

function weatherCodeToEmoji(code: string): string {
  const c = Number(code);
  if (c === 113) return "☀️";
  if (c === 116) return "⛅";
  if (c === 119 || c === 122) return "☁️";
  if (c === 143 || c === 248 || c === 260) return "🌫️";
  if ([176, 263, 266, 293, 296, 299, 302, 305, 308, 311, 314, 353, 356, 359].includes(c)) return "🌧️";
  if ([179, 182, 185, 227, 230, 317, 320, 323, 326, 329, 332, 335, 338, 350, 362, 365, 368, 371, 374, 377].includes(c)) return "🌨️";
  if ([200, 386, 389, 392, 395].includes(c)) return "⛈️";
  return "🌤️";
}

// --- Markets via Yahoo Finance v8 chart endpoint (free, no key needed) ---
async function fetchMarkets(): Promise<MarketItem[]> {
  const symbols = [
    { yahoo: "^GSPC", label: "S&P 500", symbol: "SPX" },
    { yahoo: "^DJI", label: "DOW", symbol: "DJI" },
    { yahoo: "CL=F", label: "OIL", symbol: "CL" },
  ];

  const results = await Promise.all(
    symbols.map(async (s) => {
      try {
        const res = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(s.yahoo)}?range=2d&interval=1d`,
          {
            headers: { "User-Agent": "Mozilla/5.0" },
            signal: AbortSignal.timeout(8000),
          }
        );
        if (!res.ok) throw new Error(`Yahoo v8 ${res.status}`);
        const data = await res.json();
        const meta = data.chart?.result?.[0]?.meta;
        if (!meta) throw new Error("No meta");

        const price = meta.regularMarketPrice;
        const prevClose = meta.chartPreviousClose ?? meta.previousClose;
        const change = prevClose ? price - prevClose : 0;
        const changePercent = prevClose ? (change / prevClose) * 100 : 0;

        return {
          symbol: s.symbol,
          label: s.label,
          price,
          change,
          changePercent,
        };
      } catch (e) {
        console.error(`Market fetch failed for ${s.yahoo}:`, e);
        return MOCK_DATA.markets.find((m) => m.symbol === s.symbol) || MOCK_DATA.markets[0];
      }
    })
  );

  return results;
}

// --- Cardinals via MLB Stats API (free, no key) ---
// Team ID 138 = St. Louis Cardinals
async function fetchCardinals(): Promise<SportsScore> {
  try {
    // Get today's schedule and also check yesterday if no game today
    const today = new Date();
    const todayStr = formatDate(today);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDate(yesterday);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = formatDate(tomorrow);

    // Fetch a 3-day window
    const res = await fetch(
      `https://statsapi.mlb.com/api/v1/schedule?sportId=1&teamId=138&startDate=${yesterdayStr}&endDate=${tomorrowStr}&hydrate=linescore,team`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) throw new Error(`MLB API ${res.status}`);
    const data = await res.json();

    const allGames: GameData[] = [];
    for (const date of data.dates || []) {
      for (const game of date.games || []) {
        allGames.push(game);
      }
    }

    if (allGames.length === 0) {
      return MOCK_DATA.sports;
    }

    // Priority: live game > today's upcoming > most recent final
    const liveGame = allGames.find((g: GameData) => {
      const status = g.status?.abstractGameState;
      return status === "Live";
    });

    if (liveGame) return parseGame(liveGame, "live");

    const todayGames = allGames.filter((g: GameData) => g.gameDate?.startsWith(todayStr));
    const todayUpcoming = todayGames.find((g: GameData) => g.status?.abstractGameState === "Preview");
    if (todayUpcoming) return parseGame(todayUpcoming, "upcoming");

    // Find next upcoming game
    const upcoming = allGames
      .filter((g: GameData) => g.status?.abstractGameState === "Preview")
      .sort((a: GameData, b: GameData) => new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime());
    if (upcoming.length > 0) return parseGame(upcoming[0], "upcoming");

    // Most recent final
    const finals = allGames
      .filter((g: GameData) => g.status?.abstractGameState === "Final")
      .sort((a: GameData, b: GameData) => new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime());
    if (finals.length > 0) return parseGame(finals[0], "final");

    return MOCK_DATA.sports;
  } catch (e) {
    console.error("MLB fetch failed:", e);
    return MOCK_DATA.sports;
  }
}

interface GameData {
  gameDate: string;
  status?: { abstractGameState?: string; detailedState?: string };
  teams?: {
    away?: { team?: { id?: number; name?: string }; score?: number };
    home?: { team?: { id?: number; name?: string }; score?: number };
  };
  linescore?: { inningHalf?: string; currentInning?: number };
}

function parseGame(game: GameData, status: "live" | "final" | "upcoming"): SportsScore {
  const isHome = game.teams?.home?.team?.id === 138;
  const opponent = isHome
    ? simplifyTeamName(game.teams?.away?.team?.name || "TBD")
    : simplifyTeamName(game.teams?.home?.team?.name || "TBD");

  const teamScore = isHome ? (game.teams?.home?.score ?? null) : (game.teams?.away?.score ?? null);
  const opponentScore = isHome ? (game.teams?.away?.score ?? null) : (game.teams?.home?.score ?? null);

  let gameTime: string | undefined;
  if (status === "live" && game.linescore) {
    const half = game.linescore.inningHalf === "Top" ? "Top" : "Bot";
    gameTime = `${half} ${game.linescore.currentInning}`;
  } else if (status === "upcoming") {
    const d = new Date(game.gameDate);
    gameTime = d.toLocaleString("en-US", {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/Chicago",
    });
  }

  return {
    team: "STL Cardinals",
    opponent,
    teamScore,
    opponentScore,
    status,
    gameTime,
  };
}

function simplifyTeamName(fullName: string): string {
  // "St. Louis Cardinals" -> "Cardinals", "Chicago Cubs" -> "Cubs"
  const parts = fullName.split(" ");
  return parts[parts.length - 1];
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

// --- Main handler ---
export async function GET() {
  // Return cached if fresh
  if (globalCache.__tickerCache && Date.now() - globalCache.__tickerCache.timestamp < CACHE_TTL) {
    return NextResponse.json(globalCache.__tickerCache.data, {
      headers: { "Cache-Control": "no-cache" },
    });
  }

  const [weather, markets, sports] = await Promise.all([
    fetchWeather(),
    fetchMarkets(),
    fetchCardinals(),
  ]);

  const result: SubheaderData = { weather, markets, sports };

  globalCache.__tickerCache = { data: result, timestamp: Date.now() };

  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-cache" },
  });
}
