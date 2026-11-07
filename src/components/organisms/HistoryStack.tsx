import { MilestoneCard } from "@/components/molecules/MilestoneCard";
import type { Milestone } from "@/data/teams";

const CARD_SLOTS = [
  { place: "left-[6vw] top-[23svh] md:left-[7vw] md:top-[27svh]", rotation: -3.2 },
  { place: "left-[8vw] top-[27svh] md:left-[30vw] md:top-[19svh]", rotation: 2.4 },
  { place: "left-[6vw] top-[31svh] md:left-[48vw] md:top-[40svh]", rotation: -1.8 },
  { place: "left-[8vw] top-[35svh] md:left-[22vw] md:top-[52svh]", rotation: 3 },
];

export function HistoryStack({ history }: { history: Milestone[] }) {
  return history.map((milestone, i) => (
    <MilestoneCard
      key={milestone.year}
      milestone={milestone}
      rotation={CARD_SLOTS[i].rotation}
      className={CARD_SLOTS[i].place}
    />
  ));
}
