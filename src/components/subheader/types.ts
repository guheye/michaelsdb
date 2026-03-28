export interface MarketItem {
  symbol: string;
  label: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface WeatherData {
  temp: number;
  condition: string;
  icon: string; // emoji
  location: string;
}

export interface SportsScore {
  team: string;
  opponent: string;
  teamScore: number | null;
  opponentScore: number | null;
  status: "live" | "final" | "upcoming";
  gameTime?: string; // e.g. "Today 7:15 PM" or "Top 5th"
}

export interface SubheaderData {
  weather: WeatherData;
  markets: MarketItem[];
  sports: SportsScore;
}

// MLB team colors (primary) keyed by simplified team name
export const MLB_TEAM_COLORS: Record<string, string> = {
  "Diamondbacks": "#A71930",
  "Braves": "#CE1141",
  "Orioles": "#DF4601",
  "Red Sox": "#BD3039",
  "Cubs": "#0E3386",
  "White Sox": "#27251F",
  "Reds": "#C6011F",
  "Guardians": "#00385D",
  "Rockies": "#333366",
  "Tigers": "#0C2340",
  "Astros": "#EB6E1F",
  "Royals": "#004687",
  "Angels": "#BA0021",
  "Dodgers": "#005A9C",
  "Marlins": "#00A3E0",
  "Brewers": "#FFC52F",
  "Twins": "#002B5C",
  "Mets": "#FF5910",
  "Yankees": "#003087",
  "Athletics": "#003831",
  "Phillies": "#E81828",
  "Pirates": "#FDB827",
  "Padres": "#2F241D",
  "Giants": "#FD5A1E",
  "Mariners": "#0C2C56",
  "Cardinals": "#C41E3A",
  "Rays": "#092C5C",
  "Rangers": "#003278",
  "Blue Jays": "#134A8E",
  "Nationals": "#AB0003",
};

export const MOCK_DATA: SubheaderData = {
  weather: {
    temp: 62,
    condition: "Foggy",
    icon: "🌫️",
    location: "SF",
  },
  markets: [
    { symbol: "SPX", label: "S&P 500", price: 5892.34, change: 23.17, changePercent: 0.39 },
    { symbol: "DJI", label: "DOW", price: 43287.56, change: -102.44, changePercent: -0.24 },
    { symbol: "CL", label: "OIL", price: 71.82, change: -0.54, changePercent: -0.75 },
  ],
  sports: {
    team: "STL Cardinals",
    opponent: "Cubs",
    teamScore: 5,
    opponentScore: 3,
    status: "live",
    gameTime: "Bot 6th",
  },
};
