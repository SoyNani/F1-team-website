"use client";

import dynamic from "next/dynamic";
import { FinishLine } from "@/components/organisms/FinishLine";
import { Hud } from "@/components/organisms/Hud";
import { StartGrid } from "@/components/organisms/StartGrid";
import { TeamChapter } from "@/components/organisms/TeamChapter";
import { ExperienceTemplate } from "@/components/templates/ExperienceTemplate";
import { TEAMS } from "@/data/teams";
import { useScrollExperience } from "@/hooks/useScrollExperience";
import { TOTAL_UNITS, UNIT_VH } from "@/lib/timeline";

const WorldCanvas = dynamic(() => import("@/components/organisms/three/WorldCanvas"), { ssr: false });

export function HomePage() {
  const { rootRef, barRef, active, navigate } = useScrollExperience();

  return (
    <ExperienceTemplate
      ref={rootRef}
      trackHeight={`${TOTAL_UNITS * UNIT_VH}svh`}
      theme={TEAMS[0].ui}
      scene={<WorldCanvas />}
      hud={<Hud teams={TEAMS} active={active} onNavigate={navigate} barRef={barRef} />}
    >
      <StartGrid />
      {TEAMS.map((team) => (
        <TeamChapter key={team.id} team={team} />
      ))}
      <FinishLine onRestart={() => navigate("start")} />
    </ExperienceTemplate>
  );
}
