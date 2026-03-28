import type { Category } from "@/types";

export interface FeedSource {
  name: string;
  url: string;
  tier: 1 | 2 | 3 | 4;
  defaultCategory: Category;
}

export const FEED_SOURCES: FeedSource[] = [
  // Tier 1 — Core Sources (every 15 min)
  {
    name: "National Review",
    url: "https://www.nationalreview.com/feed/",
    tier: 1,
    defaultCategory: "Opinion",
  },
  {
    name: "Reason",
    url: "https://reason.com/feed/",
    tier: 1,
    defaultCategory: "Policy",
  },
  {
    name: "WSJ Opinion",
    url: "https://feeds.a.dj.com/rss/RSSOpinion.xml",
    tier: 1,
    defaultCategory: "Opinion",
  },
  {
    name: "Marginal Revolution",
    url: "https://marginalrevolution.com/feed",
    tier: 1,
    defaultCategory: "Political Economy",
  },
  {
    name: "The Dispatch",
    url: "https://thedispatch.com/feed/",
    tier: 1,
    defaultCategory: "News",
  },

  // Tier 2 — Broadening Sources (every 30 min)
  {
    name: "The Hill",
    url: "https://thehill.com/feed/",
    tier: 2,
    defaultCategory: "News",
  },
  {
    name: "Reuters",
    url: "https://www.reutersagency.com/feed/",
    tier: 2,
    defaultCategory: "News",
  },
  {
    name: "AP News",
    url: "https://apnews.com/feed",
    tier: 2,
    defaultCategory: "News",
  },
  {
    name: "Lawfare",
    url: "https://www.lawfaremedia.org/feed",
    tier: 2,
    defaultCategory: "Policy",
  },
  {
    name: "RealClearPolitics",
    url: "https://feeds.feedburner.com/realclearpolitics/qlMj",
    tier: 2,
    defaultCategory: "News",
  },

  // Tier 3 — Ideas and Culture (every 60 min)
  {
    name: "City Journal",
    url: "https://www.city-journal.org/rss.xml",
    tier: 3,
    defaultCategory: "Political Economy",
  },
  {
    name: "Commentary",
    url: "https://www.commentary.org/feed/",
    tier: 3,
    defaultCategory: "Opinion",
  },
  {
    name: "Quillette",
    url: "https://quillette.com/feed/",
    tier: 3,
    defaultCategory: "Culture",
  },
  {
    name: "The New Atlantis",
    url: "https://www.thenewatlantis.com/rss",
    tier: 3,
    defaultCategory: "Science & Tech",
  },
  {
    name: "American Enterprise Institute",
    url: "https://www.aei.org/feed/",
    tier: 3,
    defaultCategory: "Policy",
  },

  // Tier 4 — Cross-Spectrum Intelligence (every 60 min)
  {
    name: "Brookings",
    url: "https://www.brookings.edu/feed/",
    tier: 4,
    defaultCategory: "Policy",
  },
  {
    name: "Cato Institute",
    url: "https://www.cato.org/rss/recent-opeds",
    tier: 4,
    defaultCategory: "Policy",
  },
  {
    name: "Discourse Magazine",
    url: "https://www.discoursemagazine.com/feed/",
    tier: 4,
    defaultCategory: "Political Economy",
  },

  // Tier 2 — Tech
  {
    name: "Hacker News",
    url: "https://hnrss.org/frontpage",
    tier: 2,
    defaultCategory: "Tech",
  },
  {
    name: "Ars Technica",
    url: "https://feeds.arstechnica.com/arstechnica/index",
    tier: 2,
    defaultCategory: "Tech",
  },

  // Tier 3 — Tech
  {
    name: "Wired",
    url: "https://www.wired.com/feed/rss",
    tier: 3,
    defaultCategory: "Tech",
  },

  // Tier 2 — AI
  {
    name: "MIT Technology Review AI",
    url: "https://www.technologyreview.com/feed/",
    tier: 2,
    defaultCategory: "AI",
  },
  {
    name: "The Verge AI",
    url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    tier: 2,
    defaultCategory: "AI",
  },

  // Tier 2 — Markets
  {
    name: "Bloomberg",
    url: "https://feeds.bloomberg.com/markets/news.rss",
    tier: 2,
    defaultCategory: "Markets",
  },
  {
    name: "Financial Times",
    url: "https://www.ft.com/rss/home",
    tier: 2,
    defaultCategory: "Markets",
  },
  {
    name: "WSJ Markets",
    url: "https://feeds.a.dj.com/rss/RSSMarketsMain.xml",
    tier: 2,
    defaultCategory: "Markets",
  },

  // Tier 3 — Art & Luxury
  {
    name: "Sotheby's",
    url: "https://www.sothebys.com/en/rss",
    tier: 3,
    defaultCategory: "Art & Luxury",
  },
  {
    name: "Christie's",
    url: "https://www.christies.com/rss/lotfinderrss.aspx",
    tier: 3,
    defaultCategory: "Art & Luxury",
  },
  {
    name: "Robb Report",
    url: "https://robbreport.com/feed/",
    tier: 3,
    defaultCategory: "Art & Luxury",
  },
  {
    name: "Architectural Digest",
    url: "https://www.architecturaldigest.com/feed/rss",
    tier: 3,
    defaultCategory: "Art & Luxury",
  },
  {
    name: "Artnet News",
    url: "https://news.artnet.com/feed",
    tier: 3,
    defaultCategory: "Art & Luxury",
  },
  {
    name: "duPont Registry",
    url: "https://blog.dupontregistry.com/feed/",
    tier: 3,
    defaultCategory: "Art & Luxury",
  },

  // Tier 3 — Firearms
  {
    name: "American Rifleman",
    url: "https://www.americanrifleman.org/feed/",
    tier: 3,
    defaultCategory: "Firearms",
  },
  {
    name: "Shooting Illustrated",
    url: "https://www.shootingillustrated.com/feed/",
    tier: 3,
    defaultCategory: "Firearms",
  },

  // Tier 3 — Sports
  {
    name: "STL Cardinals",
    url: "https://www.mlb.com/feeds/news/rss/cardinals",
    tier: 3,
    defaultCategory: "Sports",
  },
];
