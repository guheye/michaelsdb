import { BiasVerdictBadge } from "@/components/ui/BiasVerdictBadge";
import type { Story } from "@/types";

function BlindspotCard({ story, direction }: { story: Story; direction: "left" | "right" }) {
  const label = direction === "left"
    ? `${story.rightCount} right-leaning source${story.rightCount !== 1 ? "s" : ""}`
    : `${story.leftCount} left-leaning source${story.leftCount !== 1 ? "s" : ""}`;

  return (
    <div className="blindspot-card py-3 border-b border-gray-200 last:border-b-0">
      <h4 className="font-serif font-bold text-[0.9375rem] leading-snug mb-1.5 text-gray-900">
        {story.title}
      </h4>
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
        <span className="font-semibold">{story.articleCount} sources</span>
        <span>&middot;</span>
        <span>{label}</span>
        <BiasVerdictBadge story={story} />
      </div>
    </div>
  );
}

export function BlindspotSection({
  stories,
}: {
  stories: { left: Story[]; right: Story[] };
}) {
  const hasLeft = stories.left.length > 0;
  const hasRight = stories.right.length > 0;

  if (!hasLeft && !hasRight) return null;

  return (
    <div className="blindspot-section">
      <div className="section-header blindspot-header">Coverage Blindspots</div>
      <p className="text-xs text-gray-500 mb-4">
        Stories with lopsided coverage across the political spectrum.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Blindspot: stories the LEFT is ignoring (only right covers) */}
        {hasLeft && (
          <div>
            <div className="text-xs font-sans font-bold uppercase tracking-wider text-blue-700 mb-2 pb-1 border-b-2 border-blue-700">
              Left Blindspot
            </div>
            <p className="text-xs text-gray-400 mb-2">Covered by the right, ignored by the left</p>
            {stories.left.slice(0, 5).map((story) => (
              <BlindspotCard key={story.id} story={story} direction="left" />
            ))}
          </div>
        )}

        {/* Right Blindspot: stories the RIGHT is ignoring (only left covers) */}
        {hasRight && (
          <div>
            <div className="text-xs font-sans font-bold uppercase tracking-wider text-red-700 mb-2 pb-1 border-b-2 border-red-700">
              Right Blindspot
            </div>
            <p className="text-xs text-gray-400 mb-2">Covered by the left, ignored by the right</p>
            {stories.right.slice(0, 5).map((story) => (
              <BlindspotCard key={story.id} story={story} direction="right" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
