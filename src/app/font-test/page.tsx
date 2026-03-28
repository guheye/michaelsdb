import {
  BRAND_DISPLAY,
  BRAND_WORDMARK_SANS,
  BRAND_WORDMARK_SERIF,
  BRAND_WORDMARK_SANS_ON_DARK,
} from "@/lib/brand";
import type { FontOption } from "./font-test-types";
import { SERIF_DISPLAY, SANS } from "./fonts-data";

function fontFaceBlocks(options: FontOption[]) {
  return options
    .map(
      (o) => `@font-face {
  font-family: '${o.family}';
  font-style: ${o.fontStyle ?? "normal"};
  font-weight: ${o.weight};
  font-display: swap;
  src: url('${o.url}') format('woff2');
}`,
    )
    .join("\n");
}

/** Display-size preview (gray box). Serif at 800 to match live wordmark intent. */
function wordmarkStyle(opt: FontOption, fontSize: string | number, color: string) {
  const textTransform = opt.casing === "uppercase" ? "uppercase" : "none";
  const fs = typeof fontSize === "number" ? `${fontSize}px` : fontSize;
  return {
    fontFamily: `'${opt.family}', ${opt.casing === "title" ? "Georgia, serif" : "sans-serif"}`,
    fontWeight: 800,
    fontSize: fs,
    color,
    letterSpacing: opt.letterSpacing,
    textTransform,
  } as const;
}

function FontRows({
  id,
  title,
  blurb,
  options,
}: {
  id: string;
  title: string;
  blurb: string;
  options: FontOption[];
}) {
  return (
    <section id={id}>
      <div style={{ marginBottom: 28, marginTop: 8 }}>
        <h2
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 15,
            fontWeight: 700,
            color: "#111",
            marginBottom: 8,
          }}
        >
          {title}{" "}
          <span style={{ fontWeight: 500, color: "#888", fontSize: 13 }}>({options.length})</span>
        </h2>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#666", lineHeight: 1.6 }}>{blurb}</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {options.map((opt) => (
          <div key={opt.id} style={{ borderBottom: "1px solid #e5e5e5", paddingBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 11,
                  fontWeight: 800,
                  background: "#111",
                  color: "white",
                  padding: "2px 8px",
                  borderRadius: 2,
                  letterSpacing: "0.06em",
                }}
              >
                {opt.id}
              </span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#111" }}>{opt.name}</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#888" }}>— {opt.description}</span>
            </div>

            <div className="test-header" style={{ marginBottom: 12 }}>
              <span
                className="test-wordmark-serif-live"
                style={{
                  fontFamily: `'${opt.family}', Georgia, serif`,
                  fontWeight: 800,
                  color: "white",
                  letterSpacing: "-0.025em",
                }}
              >
                {BRAND_WORDMARK_SERIF}
              </span>
              <span
                className="font-sans text-[1.375rem] sm:text-[1.5rem] font-extralight tracking-[0.14em] uppercase antialiased"
                style={{ color: BRAND_WORDMARK_SANS_ON_DARK }}
              >
                {BRAND_WORDMARK_SANS}
              </span>
            </div>

            <div style={{ background: "#f8f8f8", padding: "16px 20px", borderRadius: 4 }}>
              <span style={wordmarkStyle(opt, "2.25rem", "#111")}>{BRAND_WORDMARK_SERIF}</span>
              <span
                className="font-sans text-[1.375rem] font-extralight tracking-[0.14em] uppercase antialiased ml-2.5"
                style={{ color: "#737373" }}
              >
                {BRAND_WORDMARK_SANS}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function FontTestPage() {
  const allFaces = [...SERIF_DISPLAY, ...SANS];
  const total = allFaces.length;

  return (
    <>
      <style>{`
        ${fontFaceBlocks(allFaces)}
        .test-header {
          background: #111;
          min-height: 72px;
          padding: 0 16px;
          display: flex;
          align-items: baseline;
          gap: 8px;
          border-radius: 4px;
        }
        /* Matches Header.tsx: text-[2.25rem] sm:text-[2.5rem] font-extrabold tracking-tight */
        .test-wordmark-serif-live {
          font-size: 2.25rem;
          line-height: 1;
        }
        @media (min-width: 640px) {
          .test-wordmark-serif-live {
            font-size: 2.5rem;
          }
        }
      `}</style>

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#E01A2B",
              marginBottom: 8,
            }}
          >
            Font Test — {BRAND_DISPLAY}
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#666", lineHeight: 1.65, marginBottom: 16 }}>
            <strong>{total} live previews</strong> (Google Fonts, latin woff2).{" "}
            <strong>Domaine Display Black</strong> is commercial (Klim) and not included; serifs below are free stand-ins.
            Serifs use title case; sans use all caps.
          </p>
          <nav
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              display: "flex",
              flexWrap: "wrap",
              gap: "12px 20px",
              padding: "12px 0",
              borderTop: "1px solid #e5e5e5",
              borderBottom: "1px solid #e5e5e5",
            }}
          >
            <a href="#serif" style={{ color: "#E01A2B", fontWeight: 600 }}>
              Jump to serif / display ({SERIF_DISPLAY.length})
            </a>
            <a href="#sans" style={{ color: "#E01A2B", fontWeight: 600 }}>
              Jump to sans ({SANS.length})
            </a>
          </nav>
        </div>

        <FontRows
          id="serif"
          title="Serif / display (Domaine-adjacent)"
          blurb="Didones, transitional, slabs, and editorial serifs — compare the serif half of the wordmark at header and display sizes."
          options={SERIF_DISPLAY}
        />

        <div style={{ height: 48 }} />

        <FontRows
          id="sans"
          title="Sans — geometric / technical / display"
          blurb="Grotesks, rounds, posters, and UI workhorses — all caps for the wordmark."
          options={SANS}
        />
      </div>
    </>
  );
}
