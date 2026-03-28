import type { FramingVerdict } from "@/types";

const VERDICT_CONFIG: Record<
  FramingVerdict,
  { className: string; label: string }
> = {
  "Fairly Reported": {
    className: "framing-fairly-reported",
    label: "Fairly Reported",
  },
  "Missing Context": {
    className: "framing-missing-context",
    label: "Missing Context",
  },
  "Loaded Language": {
    className: "framing-loaded-language",
    label: "Loaded Language",
  },
  "One-Sided": {
    className: "framing-one-sided",
    label: "One-Sided",
  },
  "Mixed Framing": {
    className: "framing-mixed",
    label: "Mixed Framing",
  },
};

export function FramingVerdictBadge({
  verdict,
  size = "default",
}: {
  verdict: FramingVerdict | null;
  size?: "default" | "large";
}) {
  if (!verdict) return null;

  const config = VERDICT_CONFIG[verdict];
  if (!config) return null;

  return (
    <span
      className={`framing-verdict-badge ${config.className} ${
        size === "large" ? "framing-verdict-large" : ""
      }`}
    >
      {config.label}
    </span>
  );
}
