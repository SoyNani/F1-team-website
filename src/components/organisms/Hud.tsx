import type { Ref } from "react";
import { Button } from "@/components/atoms/Button";
import { ProgressBar } from "@/components/atoms/ProgressBar";
import type { Team, TeamId } from "@/data/teams";

interface HudProps {
  teams: Team[];
  active: TeamId | null;
  onNavigate: (target: TeamId | "start") => void;
  barRef: Ref<HTMLDivElement>;
}

export function Hud({ teams, active, onNavigate, barRef }: HudProps) {
  return (
    <>
      <header className="hud fixed inset-x-0 top-0 z-20 flex items-center justify-between px-[6vw] py-5">
        <Button variant="mark" onClick={() => onNavigate("start")}>
          Parrilla<span>26</span>
        </Button>
        <nav aria-label="Escuderías" className="flex gap-1 md:gap-2">
          {teams.map((t) => (
            <Button
              key={t.id}
              variant="link"
              onClick={() => onNavigate(t.id)}
              aria-current={active === t.id ? "true" : undefined}
            >
              {t.name}
            </Button>
          ))}
        </nav>
      </header>
      <ProgressBar ref={barRef} />
    </>
  );
}
