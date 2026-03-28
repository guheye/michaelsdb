import type { Story } from "@/types";

export function SourceCountBadge({ story }: { story: Story | undefined }) {
  if (!story || story.articleCount < 2) return null;

  return (
    <span className="source-count-badge">
      {story.articleCount} sources
    </span>
  );
}
