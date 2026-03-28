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
];
