import type { Team } from "@/data/teams";
import { CarShowcase } from "./CarShowcase";
import { DriverLineup } from "./DriverLineup";
import { HistoryStack } from "./HistoryStack";
import { ItalyMapPins } from "./ItalyMapPins";
import { TeamFeature } from "./TeamFeature";
import { TeamHero } from "./TeamHero";

export function TeamChapter({ team }: { team: Team }) {
  return (
    <section
      data-stage={team.id}
      data-team={team.id}
      aria-label={team.name}
      className="absolute inset-0 overflow-hidden"
    >
      <TeamHero team={team} />
      <HistoryStack history={team.history} />
      <TeamFeature feature={team.feature} />
      {team.id === "ferrari" && <ItalyMapPins />}
      <CarShowcase car={team.car} />
      <DriverLineup drivers={team.drivers} />
    </section>
  );
}
