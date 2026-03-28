import type { Metadata } from "next";
import { BRAND_DISPLAY } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Editorial Charter — ${BRAND_DISPLAY}`,
  description:
    "Editorial identity, principles, and standards. Intellectual conservative news grounded in ideas over tribes.",
};

export default function AboutPage() {
  return (
    <div className="max-w-[760px] mx-auto px-4 py-12">
      <header className="mb-10">
        <h1 className="font-serif text-4xl font-bold leading-tight mb-3">
          Editorial Charter
        </h1>
        <p className="text-gray-500 text-sm font-sans uppercase tracking-wider">
          Our identity, principles, and standards
        </p>
      </header>

      <div className="space-y-10 text-[0.9375rem] leading-relaxed text-gray-800">
        {/* Identity */}
        <section>
          <h2 className="section-header">Identity</h2>
          <p className="mb-4">
            <strong>{BRAND_DISPLAY}</strong> is an intellectual conservative news
            aggregator with AI-rewritten headlines and brief editorial
            annotations.
          </p>
          <p className="mb-4">
            Our core differentiator is{" "}
            <strong>ideas over tribes</strong> — engaging with ideas from any
            intellectual tradition rather than pledging loyalty to the
            conservative movement or any political party.
          </p>
          <p>
            Conservative media lacks intellectual rigor — too reactionary, too
            personality-driven, not enough thoughtful analysis. {BRAND_DISPLAY}
            fills that gap.
          </p>
        </section>

        {/* What We Do */}
        <section>
          <h2 className="section-header">What We Do</h2>
          <p className="mb-4">Three editorial layers:</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <strong>Curation</strong> — Selecting the stories that matter
              through an editorial lens.
            </li>
            <li>
              <strong>Headlines</strong> — AI-rewritten headlines that carry
              editorial perspective: pointed but honest.
            </li>
            <li>
              <strong>Annotations</strong> — Brief editorial notes providing
              context, pushback, or &ldquo;why this matters&rdquo; framing.
            </li>
          </ol>
        </section>

        {/* Editorial Positions */}
        <section>
          <h2 className="section-header">Editorial Positions</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-accent mb-2">
                Economics
              </h3>
              <p>
                Markets are the default. Government&rsquo;s legitimate role is
                limited to rule of law, property rights, national defense, and
                correcting genuine externalities. Skeptical of industrial policy
                and expansive safety nets. Not a free-market purist, but the bar
                for intervention is high.
              </p>
            </div>

            <div>
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-accent mb-2">
                Cultural Issues
              </h3>
              <p>
                Government should not legislate morality. {BRAND_DISPLAY} does not
                take editorial positions on underlying cultural questions — that
                is for individuals to decide. The editorial stance is that the
                state should stay out.
              </p>
            </div>

            <div>
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-accent mb-2">
                Foreign Policy
              </h3>
              <p>
                Maintain alliances and global engagement, but deeply skeptical of
                military intervention. Prefer diplomacy, trade, and deterrence.
                Wary of overextension. Not isolationist, but the bar for the use
                of force is high.
              </p>
            </div>

            <div>
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-accent mb-2">
                Partisan Personalities
              </h3>
              <p>
                Ideas and policy over personalities. Name political figures only
                when essential to the story — the policy is the subject, the
                person is incidental. We do not cover feuds, rallies, gaffes, or
                horse-race drama.
              </p>
            </div>

            <div>
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-accent mb-2">
                Intellectual Honesty
              </h3>
              <p>
                If a progressive policy works, we cover it. If a conservative
                policy fails, we cover it. This is not balance for its own sake —
                it is intellectual honesty as a core differentiator. Good ideas
                are acknowledged regardless of origin, and bad outcomes are
                reported regardless of who is responsible.
              </p>
            </div>

            <div>
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-accent mb-2">
                Religion
              </h3>
              <p>
                Religion is covered as a sociological and political force — it
                shapes politics and culture — but {BRAND_DISPLAY} takes no position
                on religion&rsquo;s proper role in public life. No tradition is
                privileged or dismissed.
              </p>
            </div>

            <div>
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-accent mb-2">
                Conspiracy Theories
              </h3>
              <p>
                Zero tolerance. A claim is conspiratorial if it requires assuming
                large-scale secret coordination without evidence. Heterodox
                claims backed by circumstantial evidence or credible experts are
                legitimate hypotheses, not conspiracy theories.
              </p>
            </div>
          </div>
        </section>

        {/* Coverage */}
        <section>
          <h2 className="section-header">What We Cover</h2>
          <p className="mb-4">
            Our signature area is <strong>political economy</strong>. We also
            cover fiscal, monetary, trade, regulatory, healthcare, education, and
            energy policy; foreign affairs, defense, and national security;
            constitutional law and civil liberties; technology and AI; science;
            and culture and ideas.
          </p>
          <p>
            We do not cover celebrity news, sports, crime blotter, human
            interest, weather, health and wellness, or lifestyle content.
          </p>
        </section>

        {/* Headline Standards */}
        <section>
          <h2 className="section-header">Headline Standards</h2>
          <p className="mb-4">
            Headlines are <strong>pointed but honest</strong> — they carry
            editorial perspective grounded in fact. Not neutral wire-service
            style, but never clickbait. Every headline must meet a dual standard:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <strong>Factually defensible</strong> — Every claim must be
              supportable from the source article. Perspective is fine;
              exaggeration or misleading framing is not.
            </li>
            <li>
              <strong>Steelman test</strong> — A thoughtful person who disagrees
              with our framing should still acknowledge the headline is fair and
              grounded, even if they would frame it differently.
            </li>
          </ol>
        </section>

        {/* Tone */}
        <section>
          <h2 className="section-header">Tone and Audience</h2>
          <p className="mb-4">
            Sober and direct. No wordplay, no cleverness. Sharp and pointed but
            earnest. Serious does not mean dense — we write clearly, not
            academically.
          </p>
          <p>
            Our readers are <strong>ambitious generalists</strong> — people who
            may not know everything but want to be challenged and learn. We write
            up, not down.
          </p>
        </section>

        {/* Sources */}
        <section>
          <h2 className="section-header">Source Standards</h2>
          <p>
            We aggregate from any outlet that has real editorial standards, even
            if sharply ideological. We exclude outlets without genuine editorial
            processes — propaganda, hyperpartisan sites without editorial
            accountability, and state media.
          </p>
        </section>

        {/* Transparency */}
        <section>
          <h2 className="section-header">Transparency</h2>
          <p>
            Headlines are rewritten by AI. Annotations are generated by AI under
            editorial guidance. We disclose this openly because transparency
            builds trust. The quality of our editorial judgment — in what we
            select, how we frame it, and what context we provide — is what we
            stand behind.
          </p>
        </section>

        {/* Pacing */}
        <section>
          <h2 className="section-header">Pacing</h2>
          <p>
            Rolling but deliberate. Updated throughout the day as stories
            develop, but never rushing. Quality and accuracy over speed. No
            breaking alerts.
          </p>
        </section>
      </div>
    </div>
  );
}
