import type { Story, BiasVerdict } from "@/types";

const VERDICT_STYLES: Record<BiasVerdict, string> = {
  "Heavily Left-Covered": "bias-verdict-heavy-left",
  "Left-Leaning Coverage": "bias-verdict-left",
  "Balanced Coverage": "bias-verdict-balanced",
  "Right-Leaning Coverage": "bias-verdict-right",
  "Heavily Right-Covered": "bias-verdict-heavy-right",
  "Single Source": "bias-verdict-single",
};

const VERDICT_LABELS: Record<BiasVerdict, string> = {
  "Heavily Left-Covered": "Heavily Left",
  "Left-Leaning Coverage": "Lean Left",
  "Balanced Coverage": "Balanced",
  "Right-Leaning Coverage": "Lean Right",
  "Heavily Right-Covered": "Heavily Right",
  "Single Source": "Single Source",
};

export function BiasVerdictBadge({ story }: { story: Story | undefined }) {
  if (!story || !story.biasVerdict || story.articleCount < 2) return null;

  const verdict = story.biasVerdict as BiasVerdict;
  const className = VERDICT_STYLES[verdict];
  const label = VERDICT_LABELS[verdict];

  if (!className || !label) return null;

  return (
    <span className={`bias-verdict-badge ${className}`}>
      {label}
    </span>
  );
}
