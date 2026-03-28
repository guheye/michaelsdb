import type { Story } from "@/types";

export function BiasDistributionBar({ story }: { story: Story }) {
  const total = story.leftCount + story.centerCount + story.rightCount;
  if (total === 0) return null;

  const leftPct = Math.round((story.leftCount / total) * 100);
  const centerPct = Math.round((story.centerCount / total) * 100);
  const rightPct = 100 - leftPct - centerPct;

  return (
    <div className="bias-distribution">
      <div className="bias-distribution-bar">
        {leftPct > 0 && (
          <div
            className="bias-bar-segment bias-bar-left"
            style={{ width: `${leftPct}%` }}
          />
        )}
        {centerPct > 0 && (
          <div
            className="bias-bar-segment bias-bar-center"
            style={{ width: `${centerPct}%` }}
          />
        )}
        {rightPct > 0 && (
          <div
            className="bias-bar-segment bias-bar-right"
            style={{ width: `${rightPct}%` }}
          />
        )}
      </div>
      <div className="bias-distribution-labels">
        <span className="bias-label-left">
          {story.leftCount} Left
        </span>
        <span className="bias-label-center">
          {story.centerCount} Center
        </span>
        <span className="bias-label-right">
          {story.rightCount} Right
        </span>
      </div>
    </div>
  );
}
