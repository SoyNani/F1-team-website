import { Eyebrow } from "@/components/atoms/Eyebrow";
import { StatItem } from "@/components/molecules/StatItem";
import { TeamWordmark } from "@/components/molecules/TeamWordmark";
import type { Team } from "@/data/teams";

export function TeamHero({ team }: { team: Team }) {
  return (
    <div className="absolute left-[6vw] top-[22svh] md:top-[17svh]">
      <Eyebrow data-title-sub className="layer mb-3">
        {team.kicker}
      </Eyebrow>
      <TeamWordmark name={team.name} />
      <p data-title-sub className="layer mt-5 max-w-xl text-lg leading-snug md:text-2xl">
        {team.tagline}
      </p>
      <dl data-title-sub className="layer mt-8 flex flex-wrap gap-x-10 gap-y-4">
        {team.stats.map((s) => (
          <StatItem key={s.label} value={s.value} label={s.label} />
        ))}
      </dl>
    </div>
  );
}
