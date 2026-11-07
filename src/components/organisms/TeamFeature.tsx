import { Eyebrow } from "@/components/atoms/Eyebrow";
import { FeatureChip } from "@/components/molecules/FeatureChip";
import type { Team } from "@/data/teams";

export function TeamFeature({ feature }: { feature: Team["feature"] }) {
  return (
    <div className="absolute inset-x-[6vw] bottom-[7svh] md:bottom-auto md:left-[6vw] md:right-auto md:top-[20svh] md:w-[min(40vw,34rem)]">
      <div data-feature data-rot={-1.2} className="layer card">
        <Eyebrow className="card-eyebrow">{feature.eyebrow}</Eyebrow>
        <h3 className="feature-title">{feature.title}</h3>
        <p className="card-text">{feature.text}</p>
      </div>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {feature.chips.map((chip, i) => (
          <FeatureChip
            key={chip.term}
            term={chip.term}
            meaning={chip.meaning}
            rotation={i % 2 ? 1.4 : -1}
            className={i > 1 ? "max-sm:hidden" : ""}
          />
        ))}
      </ul>
    </div>
  );
}
