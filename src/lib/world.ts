export const world = {
  fusion: -1,
  velocity: 0,
  warp: 0,
  dim: 0,
  paint: 0,
  italy: 0,
  flag: 0,
  arrows: 0,
  flow: 0,
  car: {
    x: 0,
    y: -1.15,
    z: -14,
    rx: 0.06,
    ry: 0,
    rz: 0,
    scale: 1,
    explode: 0,
    spin: 0,
  },
  helmets: [0, 0] as [number, number],
  pointer: { x: 0, y: 0 },
};

export type World = typeof world;

export function fusionState(fusion: number) {
  const f = Math.min(Math.max(fusion + 1, 0), 4);
  const from = Math.min(Math.floor(f), 3);
  return { from, to: from + 1, mix: f - from };
}
