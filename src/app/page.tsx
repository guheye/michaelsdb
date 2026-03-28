import { db, schema } from "@/lib/db";
import { desc, eq } from "drizzle-orm";
import { Navigation } from "@/components/layout/Navigation";
import { HomeLayout } from "@/components/home/HomeLayout";
import type { Article, Category } from "@/types";
import { CATEGORIES } from "@/types";

export const dynamic = "force-dynamic";

function getArticles(): Article[] {
  // Fetch recent articles, then rank with time-decayed AI priority
  const articles = db
    .select()
    .from(schema.articles)
    .where(eq(schema.articles.status, "ready"))
    .orderBy(desc(schema.articles.publishedAt))
    .limit(200)
    .all() as Article[];

  // Score = AI priority * time decay factor
  // Articles lose ~50% of their score every 12 hours
  const now = Date.now();
  const HALF_LIFE_MS = 12 * 60 * 60 * 1000; // 12 hours

  const scored = articles.map((a) => {
    const ageMs = now - new Date(a.publishedAt).getTime();
    const decay = Math.pow(0.5, ageMs / HALF_LIFE_MS);
    const score = a.priority * decay;
    return { article: a, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 100).map((s) => s.article);
}

function getMockArticles(): Article[] {
  const now = new Date();

  const mockData: {
    title: string;
    source: string;
    category: Category;
    excerpt: string;
    author: string;
    priority: number;
  }[] = [
    {
      title: "Federal Reserve Holds Rates Steady as Inflation Data Complicates the Path Forward",
      source: "WSJ Opinion",
      category: "Political Economy",
      excerpt: "The central bank's decision reflects genuine uncertainty about whether current price pressures are transitory or structural — a distinction with enormous policy implications.",
      author: "Editorial Board",
      priority: 9,
    },
    {
      title: "Senate Trade Bill Would Rewrite Tariff Authority — With Bipartisan Support",
      source: "The Hill",
      category: "Policy",
      excerpt: "A rare cross-party coalition aims to reclaim congressional trade powers, raising constitutional questions about executive authority that both parties have long avoided.",
      author: "Sarah Mitchell",
      priority: 8,
    },
    {
      title: "Why Germany's Industrial Decline Should Worry American Manufacturers",
      source: "Marginal Revolution",
      category: "Political Economy",
      excerpt: "Europe's largest economy is deindustrializing faster than anyone predicted. The parallels to American Rust Belt dynamics are uncomfortable but instructive.",
      author: "Tyler Cowen",
      priority: 8,
    },
    {
      title: "The Honest Case for School Choice — and Its Honest Limitations",
      source: "Reason",
      category: "Policy",
      excerpt: "Voucher programs show real gains for participants, but the system-wide transformation advocates promise remains elusive. Both sides of this debate deserve more nuance.",
      author: "Katherine Mangu-Ward",
      priority: 7,
    },
    {
      title: "Supreme Court Takes Up Major Administrative Law Case This Term",
      source: "Lawfare",
      category: "Policy",
      excerpt: "The justices will consider whether Chevron deference, long a pillar of the regulatory state, should be narrowed or overturned entirely.",
      author: "Benjamin Wittes",
      priority: 9,
    },
    {
      title: "NATO's Credibility Gap: Alliance Spending Pledges Still Fall Short",
      source: "National Review",
      category: "Foreign Affairs",
      excerpt: "Despite a decade of promises, most European allies still underspend on defense. The question is whether American patience — and security guarantees — should be unconditional.",
      author: "Michael Brendan Dougherty",
      priority: 7,
    },
    {
      title: "The Coming AI Productivity Boom May Not Be Evenly Distributed",
      source: "The New Atlantis",
      category: "Science & Tech",
      excerpt: "Artificial intelligence promises aggregate economic gains, but the distributional effects could widen the gap between knowledge workers and everyone else.",
      author: "Ari Schulman",
      priority: 7,
    },
    {
      title: "How Local Zoning Laws Became America's Most Regressive Tax",
      source: "City Journal",
      category: "Political Economy",
      excerpt: "Restrictive land use regulation functions as a wealth transfer from renters to homeowners and from young to old — a fundamentally unconservative arrangement.",
      author: "Edward Glaeser",
      priority: 8,
    },
    {
      title: "Roger Scruton's Posthumous Essays Reveal a Thinker Still Ahead of His Time",
      source: "Commentary",
      category: "Books & Ideas",
      excerpt: "A new collection shows Scruton grappling with questions about beauty, belonging, and modernity that the broader culture is only now catching up to.",
      author: "Daniel Johnson",
      priority: 6,
    },
    {
      title: "The Progressive Case for Fiscal Restraint — Yes, It Exists",
      source: "Brookings",
      category: "Opinion",
      excerpt: "A Brookings scholar argues that runaway deficits hurt the poor most. When honest analysis crosses party lines, Michael's Daily Brief takes notice.",
      author: "Louise Sheiner",
      priority: 6,
    },
    {
      title: "Free Speech on Campus: New Data Shows the Problem Is Worse Than Either Side Admits",
      source: "Quillette",
      category: "Culture",
      excerpt: "Self-censorship among both conservative and liberal students has increased, suggesting the chilling effect extends beyond any single ideological direction.",
      author: "Jonathan Haidt",
      priority: 7,
    },
    {
      title: "India's Economic Reforms Are Working — But Not For Everyone",
      source: "The Dispatch",
      category: "Foreign Affairs",
      excerpt: "Modi's market liberalization has produced impressive GDP growth alongside widening inequality. The tension is instructive for American reformers.",
      author: "Chris Stirewalt",
      priority: 6,
    },
    {
      title: "The Quiet Bipartisan Consensus on Antitrust Is Reshaping Tech Regulation",
      source: "Reason",
      category: "Policy",
      excerpt: "Both progressives and New Right populists want to break up Big Tech, but for different reasons. The policy convergence conceals deep philosophical disagreements.",
      author: "Peter Suderman",
      priority: 7,
    },
    {
      title: "Why Conservative Economics Needs to Take Housing Costs Seriously",
      source: "American Enterprise Institute",
      category: "Political Economy",
      excerpt: "When half of young Americans can't afford a home, the market isn't failing — it's being prevented from working by government-created scarcity.",
      author: "Michael Strain",
      priority: 7,
    },
    {
      title: "The Realist Case for Engaging China on Climate Without Naivety",
      source: "Brookings",
      category: "Foreign Affairs",
      excerpt: "Strategic competition and environmental cooperation aren't mutually exclusive. A serious conservative foreign policy can walk and chew gum.",
      author: "Ryan Hass",
      priority: 5,
    },
    {
      title: "Criminal Justice Reform Finds an Unlikely Champion in Red States",
      source: "The Dispatch",
      category: "Policy",
      excerpt: "Republican governors are leading on sentencing reform, not out of progressive sympathy but from conservative principles: fiscal prudence and limited government.",
      author: "David French",
      priority: 6,
    },
  ];

  return mockData.map((item, i) => ({
    id: i + 1,
    feedId: 1,
    guid: `mock-${i}`,
    originalUrl: "#",
    originalTitle: item.title,
    rewrittenTitle: item.title,
    author: item.author,
    sourceName: item.source,
    excerpt: item.excerpt,
    imageUrl: null,
    publishedAt: new Date(now.getTime() - i * 45 * 60 * 1000).toISOString(),
    fetchedAt: now.toISOString(),
    category: item.category,
    priority: item.priority,
    status: "ready" as const,
    aiProcessedAt: now.toISOString(),
    analysis: null,
  }));
}

export default function HomePage() {
  let articles = getArticles();
  if (articles.length === 0) {
    articles = getMockArticles();
  }

  // Lead featured story (center)
  const lead = articles[0];
  // Left column cards
  const leftColumn = articles.slice(1, 3);
  // Related bullet points under lead
  const related = articles.slice(3, 7);
  // Corner sidebar opinions
  const opinions = articles.filter(
    (a) => a.category === "Opinion" || a.category === "Books & Ideas" || a.category === "Culture"
  );
  const cornerArticles = opinions.length >= 4
    ? opinions.slice(0, 5)
    : [...opinions, ...articles.filter((a) => !opinions.includes(a))].slice(0, 5);

  // Remaining for below-fold content
  const usedIds = new Set([lead.id, ...leftColumn.map((a) => a.id), ...related.map((a) => a.id)]);
  const remaining = articles.filter((a) => !usedIds.has(a.id));

  // Trending (highest priority)
  const trending = [...articles].sort((a, b) => b.priority - a.priority).slice(0, 5);

  // Latest (most recent from remaining)
  const latest = [...remaining]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 8);

  return (
    <>
      <Navigation trending={trending} />
      <div className="max-w-[1200px] mx-auto px-4">
        <HomeLayout
          lead={lead}
          leftColumn={leftColumn}
          related={related}
          cornerArticles={cornerArticles}
          remaining={remaining}
          latest={latest}
          trending={trending}
        />
      </div>
    </>
  );
}
