/**
 * Shared markup for app icons (favicon sizes + PWA) rendered via `next/og` ImageResponse.
 * Editorial serif “M” on the same background as the site header.
 */
export const ICON_BG = "#111111";
export const ICON_FG = "#ffffff";

type MonogramProps = {
  /** Total width/height of the raster (square). */
  dimension: number;
  /** Extra inset as a fraction of dimension (larger = smaller glyph; use for maskable safe zone). */
  insetFraction?: number;
};

export function MonogramIcon({ dimension, insetFraction = 0.12 }: MonogramProps) {
  const pad = Math.max(1, Math.round(dimension * insetFraction));
  const inner = dimension - pad * 2;
  const fontSize = Math.max(6, Math.round(inner * 0.62));

  return (
    <div
      style={{
        width: dimension,
        height: dimension,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: ICON_BG,
        borderRadius: dimension >= 180 ? Math.round(dimension * 0.2) : 0,
      }}
    >
      <div
        style={{
          width: inner,
          height: inner,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: ICON_FG,
          fontSize,
          fontWeight: 700,
          fontFamily: 'Georgia, "Times New Roman", serif',
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        M
      </div>
    </div>
  );
}
