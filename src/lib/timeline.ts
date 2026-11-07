import gsap from "gsap";
import { TEAMS, type TeamId } from "@/data/teams";
import { world } from "@/lib/world";

export const UNIT_VH = 70;

const INTRO = 3.6;
const TEAM = 16;
const OUTRO = 3.4;

export const TOTAL_UNITS = INTRO + TEAM * TEAMS.length + OUTRO;

type Vars = gsap.TweenVars;
type Entrance = { from: Vars; to: Vars };

const ENTRANCES: Record<TeamId, (el: Element, i: number) => Entrance> = {
  ferrari: (el, i) => ({
    from: { opacity: 0, scale: 1.5, y: -90, rotation: (i % 2 ? 14 : -14) },
    to: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotation: Number((el as HTMLElement).dataset.rot ?? 0),
      ease: "power3.out",
    },
  }),
  mercedes: () => ({
    from: { opacity: 1, clipPath: "inset(0% 100% 0% 0%)", x: -40 },
    to: { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", x: 0, ease: "expo.out" },
  }),
  mclaren: () => ({
    from: { opacity: 0, xPercent: 120, skewX: -22 },
    to: { opacity: 1, xPercent: 0, skewX: 0, ease: "power4.out" },
  }),
};

const CHAR_ENTRANCES: Record<TeamId, Entrance> = {
  ferrari: {
    from: { opacity: 0, yPercent: 60, rotation: 8 },
    to: { opacity: 1, yPercent: 0, rotation: 0, ease: "power3.out" },
  },
  mercedes: {
    from: { opacity: 0, xPercent: -30, scaleX: 1.6 },
    to: { opacity: 1, xPercent: 0, scaleX: 1, ease: "expo.out" },
  },
  mclaren: {
    from: { opacity: 0, xPercent: 140, skewX: -28 },
    to: { opacity: 1, xPercent: 0, skewX: 0, ease: "power4.out" },
  },
};

const HALF_PI = Math.PI / 2;

export interface BuiltTimeline {
  timeline: gsap.core.Timeline;
  starts: Record<TeamId, number>;
}

export function buildTimeline(root: HTMLElement, portrait: boolean): BuiltTimeline {
  const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
  const car = world.car;
  const restX = portrait ? 0 : 0.8;
  const restY = portrait ? 0.1 : -0.62;
  const $ = (sel: string, scope: ParentNode = root) => gsap.utils.toArray<HTMLElement>(sel, scope);

  const place = (targets: gsap.TweenTarget, e: Entrance, at: number, duration = 0.9, extra: Vars = {}) =>
    tl.fromTo(targets, e.from, { ...e.to, duration, immediateRender: false, ...extra }, at);

  const lights = $("[data-light]");
  lights.forEach((light, i) => {
    tl.to(light, { "--on": 1, duration: 0.14 }, 0.25 + i * 0.36);
  });
  tl.to(lights, { "--on": 0, duration: 0.05 }, 2.3);
  tl.to("[data-intro-copy]", { opacity: 0, y: -30, duration: 0.3 }, 2.25);
  tl.to("[data-intro-gantry]", { opacity: 0, scale: 1.4, duration: 0.6 }, 2.4);

  tl.to(car, { z: -7, duration: 2.2, ease: "power1.in" }, 0);
  tl.to(car, { z: 20, y: -0.5, duration: 0.9, ease: "power3.in" }, 2.3);
  tl.to(world, { warp: 1.1, duration: 0.5, ease: "power2.in" }, 2.5);
  tl.to(world, { warp: 0, duration: 0.7, ease: "power2.out" }, 3.0);
  tl.to(world, { fusion: 0, duration: 1.1, ease: "sine.inOut" }, 2.6);

  const starts = {} as Record<TeamId, number>;

  TEAMS.forEach((team, index) => {
    const T = INTRO + index * TEAM;
    const id = team.id;
    starts[id] = T;
    const stage = root.querySelector<HTMLElement>(`[data-stage="${id}"]`)!;
    const entrance = ENTRANCES[id];

    const c = CHAR_ENTRANCES[id];
    place($("[data-char]", stage), c, T, 0.8, { stagger: 0.05 });
    const sub = $("[data-title-sub]", stage);
    tl.fromTo(sub, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, immediateRender: false }, T + 0.5);

    const title = stage.querySelector("[data-title]")!;
    tl.to(sub, { opacity: 0, y: -14, duration: 0.3 }, T + 2.1);
    tl.to(title, { scale: portrait ? 0.4 : 0.3, y: portrait ? "-6vh" : "-9vh", duration: 0.7, ease: "power2.inOut" }, T + 2.1);

    const cards = $("[data-card]", stage);
    cards.forEach((card, i) => {
      const at = T + 2.5 + i * 1.05;
      const e = entrance(card, i);
      place(card, e, at, 0.85);
      if (i > 0) {
        tl.to(cards.slice(0, i), { filter: "brightness(0.62)", duration: 0.5 }, at);
      }
    });

    const F = T + 7.1;
    tl.to(cards, {
      opacity: 0,
      scale: 0.72,
      x: (i) => (i % 2 ? 160 : -160),
      y: (i) => (i < 2 ? -120 : 120),
      duration: 0.7,
      stagger: 0.05,
      ease: "power2.in",
    }, F);
    tl.to(title, { opacity: 0, duration: 0.4 }, F + 0.1);

    const feature = stage.querySelector("[data-feature]")!;
    const chips = $("[data-chip]", stage);
    place(feature, entrance(feature, 0), F + 0.55, 0.8);
    chips.forEach((chip, i) => {
      place(chip, entrance(chip, i + 1), F + 1 + i * 0.32, 0.6);
    });
    const FE = T + 9.7;
    tl.to([feature, ...chips], { opacity: 0, y: -30, duration: 0.45, stagger: 0.03 }, FE - 0.2);

    if (id === "ferrari") {
      tl.to(world, { dim: 0.86, duration: 0.7 }, F + 0.1);
      tl.to(world, { italy: 1, duration: 1.5, ease: "power1.inOut" }, F + 0.25);
      tl.to(world, { flag: 1, duration: 1.2, ease: "power1.out" }, F + 0.35);
      const pins = $("[data-pin]", stage);
      tl.to(pins, { opacity: 1, duration: 0.25, stagger: 0.14 }, F + 1.5);
      tl.to(pins, { opacity: 0, duration: 0.25 }, FE - 0.2);
      tl.to(world, { italy: 0, flag: 0, dim: 0, duration: 0.7, ease: "power1.in" }, FE - 0.15);
    }
    if (id === "mercedes") {
      tl.to(world, { paint: 1, duration: 0.7, ease: "power2.inOut" }, F + 0.05);
      tl.to(world, { paint: 0, duration: 1.3, ease: "power1.inOut" }, F + 1.1);
      tl.to(world, { arrows: 1, duration: 0.6 }, F + 1.7);
      tl.to(world, { arrows: 0, duration: 0.6 }, T + 12);
    }
    if (id === "mclaren") {
      tl.to(world, { dim: 0.62, duration: 0.6 }, F + 0.1);
      tl.to(world, { flow: 1, duration: 0.8 }, F + 0.3);
      tl.to(world, { dim: 0.34, duration: 0.5 }, FE);
      tl.to(world, { flow: 0, duration: 0.5 }, T + 11.8);
      tl.to(world, { dim: 0, duration: 0.6 }, T + 11.9);
    }

    const C = T + 9.6;
    const carName = stage.querySelector("[data-car-name]")!;
    const specs = $("[data-spec]", stage);
    place(carName, entrance(carName, 0), C + 0.5, 0.7);
    specs.forEach((spec, i) => {
      place(spec, entrance(spec, i + 1), C + 0.9 + i * 0.26, 0.5);
    });
    const carExit = T + 12;
    tl.to([carName, ...specs], { opacity: 0, duration: 0.3, stagger: 0.02 }, carExit - 0.15);

    if (id === "ferrari") {
      tl.set(car, { x: 13, y: restY, z: 0, rx: 0.02, ry: -HALF_PI, rz: 0, explode: 0 }, C - 0.1);
      tl.to(car, { x: restX / 2, duration: 1.1, ease: "power3.out" }, C);
      tl.to(car, { ry: -0.78, rx: 0.12, x: restX, duration: 1.3, ease: "power1.inOut" }, C + 1.05);
    }
    if (id === "mercedes") {
      tl.set(car, { x: restX / 2, y: restY - 0.13, z: -3, rx: 0.5, ry: 0.6, rz: 0, explode: 1.25 }, C - 0.5);
      tl.to(car, { explode: 0, z: 0, duration: 1.8, ease: "power2.inOut" }, C);
      tl.to(car, { ry: -2.5, rx: 0.14, x: restX, y: restY, duration: 2.2, ease: "power1.inOut" }, C + 0.1);
    }
    if (id === "mclaren") {
      tl.set(car, { x: -13, y: portrait ? 0.75 : -0.65, z: 0, rx: 0.02, ry: HALF_PI, rz: 0, explode: 0 }, F);
      tl.to(car, { x: portrait ? 0 : 1.75, duration: 1.2, ease: "power3.out" }, F + 0.5);
      tl.to(car, { ry: 2.3, rx: 0.1, x: restX, y: restY, duration: 1.5, ease: "power1.inOut" }, C + 0.4);
    }
    tl.to(car, { x: -15, duration: 0.8, ease: "power3.in" }, carExit);

    const D = T + 12.3;
    const drivers = $("[data-driver]", stage);
    place(drivers[0], entrance(drivers[0], 0), D, 0.8);
    tl.to(world.helmets, { 0: 1, duration: 0.9, ease: "power3.out" }, D);
    if (portrait) {
      tl.to(drivers[0], { opacity: 0, duration: 0.3 }, D + 1.05);
    }
    place(drivers[1], entrance(drivers[1], 1), D + 1.2, 0.8);
    tl.to(world.helmets, { 1: 1, duration: 0.9, ease: "power3.out" }, D + 1.2);

    const X = T + 14.7;
    tl.to(drivers, { opacity: 0, y: -50, duration: 0.5, stagger: 0.06, ease: "power2.in" }, X);
    tl.to(world.helmets, { 0: 0, 1: 0, duration: 0.6, ease: "power2.in" }, X);
    tl.to(world, { fusion: index + 1, duration: 1.7, ease: "sine.inOut" }, X + 0.1);
    tl.to(world, { warp: 0.5, duration: 0.8, ease: "sine.inOut" }, X + 0.1);
    tl.to(world, { warp: 0, duration: 0.8, ease: "sine.inOut" }, X + 0.9);

    const next = TEAMS[index + 1]?.ui ?? team.ui;
    tl.to(root, { "--accent": next.accent, "--ink": next.ink, duration: 1.4 }, X + 0.2);
  });

  const O = INTRO + TEAM * TEAMS.length + 0.3;
  const outro = $("[data-outro-line]");
  tl.fromTo(
    outro,
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 0.8, stagger: 0.28, ease: "power3.out", immediateRender: false },
    O,
  );
  tl.fromTo("[data-restart]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, immediateRender: false }, O + 1.5);
  tl.set({}, {}, TOTAL_UNITS);

  return { timeline: tl, starts };
}
