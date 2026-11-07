"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { TEAMS, type TeamId } from "@/data/teams";
import { buildTimeline } from "@/lib/timeline";
import { world } from "@/lib/world";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Target = TeamId | "start";

export function useScrollExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const jump = useRef<(y: number) => void>((y) => window.scrollTo(0, y));
  const scrollFor = useRef<(target: Target) => number>(() => 0);
  const activeRef = useRef<TeamId | null>(null);
  const [active, setActive] = useState<TeamId | null>(null);

  useGSAP(
    () => {
      const el = rootRef.current!;
      ScrollTrigger.config({ ignoreMobileResize: true });

      const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let tick: ((time: number) => void) | undefined;

      if (!calm) {
        const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
        lenisRef.current = lenis;
        lenis.on("scroll", ScrollTrigger.update);
        jump.current = (y) => lenis.scrollTo(y, { duration: 2.4 });
        tick = (time) => {
          lenis.raf(time * 1000);
          const target = Math.min(Math.abs(lenis.velocity) / 70, 1);
          world.velocity += (target - world.velocity) * 0.12;
        };
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
      }

      const onPointer = (e: PointerEvent) => {
        world.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        world.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

      const media = gsap.matchMedia();
      media.add(
        { portrait: "(orientation: portrait)", landscape: "(orientation: landscape)" },
        (ctx) => {
          const { timeline, starts } = buildTimeline(el, Boolean(ctx.conditions?.portrait));
          const duration = timeline.duration();

          const trigger = ScrollTrigger.create({
            animation: timeline,
            trigger: "#track",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) => {
              if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
              const now = self.progress * duration;
              const team = [...TEAMS].reverse().find((t) => now >= starts[t.id] - 0.6)?.id ?? null;
              if (team !== activeRef.current) {
                activeRef.current = team;
                setActive(team);
              }
            },
          });

          scrollFor.current = (target) =>
            target === "start"
              ? 0
              : trigger.start + ((starts[target] + 0.9) / duration) * (trigger.end - trigger.start);
        },
      );

      return () => {
        window.removeEventListener("pointermove", onPointer);
        if (tick) gsap.ticker.remove(tick);
        lenisRef.current?.destroy();
        lenisRef.current = null;
        media.revert();
      };
    },
    { scope: rootRef },
  );

  const navigate = (target: Target) => jump.current(scrollFor.current(target));

  return { rootRef, barRef, active, navigate };
}
