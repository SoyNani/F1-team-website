import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

interface Section {
  z: number;
  w: number;
  bot: number;
  top: number;
  n?: number;
  x?: number;
}

const catmull = (a: number, b: number, c: number, d: number, t: number) =>
  0.5 *
  (2 * b + (c - a) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (3 * b - a - 3 * c + d) * t * t * t);

export function loft(sections: Section[], radial = 28, sub = 7) {
  const rings: Required<Section>[] = [];
  const get = (i: number) => sections[Math.min(Math.max(i, 0), sections.length - 1)];

  for (let i = 0; i < sections.length - 1; i++) {
    const [s0, s1, s2, s3] = [get(i - 1), get(i), get(i + 1), get(i + 2)];
    for (let j = 0; j < sub; j++) {
      const t = j / sub;
      const f = (k: (s: Section) => number) => catmull(k(s0), k(s1), k(s2), k(s3), t);
      rings.push({
        z: s1.z + (s2.z - s1.z) * t,
        w: Math.max(f((s) => s.w), 0.002),
        bot: f((s) => s.bot),
        top: f((s) => s.top),
        n: THREE.MathUtils.lerp(s1.n ?? 2.4, s2.n ?? 2.4, t),
        x: THREE.MathUtils.lerp(s1.x ?? 0, s2.x ?? 0, t),
      });
    }
  }
  const last = sections[sections.length - 1];
  rings.push({ n: 2.4, x: 0, ...last });

  const pos: number[] = [];
  const idx: number[] = [];
  const spow = (v: number, e: number) => Math.sign(v) * Math.abs(v) ** e;

  rings.forEach((r) => {
    const yc = (r.top + r.bot) / 2;
    const hh = (r.top - r.bot) / 2;
    for (let k = 0; k < radial; k++) {
      const a = (k / radial) * Math.PI * 2;
      pos.push(
        r.x + r.w * spow(Math.cos(a), 2 / r.n),
        yc + hh * spow(Math.sin(a), 2 / r.n),
        r.z,
      );
    }
  });

  for (let i = 0; i < rings.length - 1; i++) {
    for (let k = 0; k < radial; k++) {
      const a = i * radial + k;
      const b = i * radial + ((k + 1) % radial);
      const c = a + radial;
      const d = b + radial;
      idx.push(a, c, b, b, c, d);
    }
  }

  const cap = (ring: number, flip: boolean) => {
    const r = rings[ring];
    const center = pos.length / 3;
    pos.push(r.x, (r.top + r.bot) / 2, r.z);
    for (let k = 0; k < radial; k++) {
      const a = ring * radial + k;
      const b = ring * radial + ((k + 1) % radial);
      if (flip) idx.push(center, b, a);
      else idx.push(center, a, b);
    }
  };
  cap(0, false);
  cap(rings.length - 1, true);

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

interface WingOptions {
  span: number;
  chord: number;
  thick: number;
  y: number;
  z: number;
  pitch?: number;
  lift?: (u: number) => number;
  sweep?: (u: number) => number;
  taper?: (u: number) => number;
}

export function wing({
  span,
  chord,
  thick,
  y,
  z,
  pitch = 0,
  lift = () => 0,
  sweep = () => 0,
  taper = () => 1,
}: WingOptions) {
  const P = 14;
  const S = 28;
  const pos: number[] = [];
  const idx: number[] = [];
  const cosP = Math.cos(pitch);
  const sinP = Math.sin(pitch);

  for (let i = 0; i <= S; i++) {
    const v = i / S;
    const x = (v - 0.5) * span;
    const u = Math.abs(v - 0.5) * 2;
    const c = chord * taper(u);
    for (let k = 0; k < P; k++) {
      const a = (k / P) * Math.PI * 2;
      const cx = Math.cos(a);
      const lz = (cx * 0.5 + 0.5) * c - c / 2;
      const ly = Math.sin(a) * thick * (0.35 + 0.65 * (cx * 0.5 + 0.5));
      const camber = (1 - cx * cx) * c * 0.07;
      const yy = ly + camber;
      pos.push(x, y + lift(u) + yy * cosP + lz * sinP, z + sweep(u) + lz * cosP - yy * sinP);
    }
  }
  for (let i = 0; i < S; i++) {
    for (let k = 0; k < P; k++) {
      const a = i * P + k;
      const b = i * P + ((k + 1) % P);
      idx.push(a, b, a + P, b, b + P, a + P);
    }
  }
  const capEnd = (ring: number, flip: boolean) => {
    const center = pos.length / 3;
    let cx = 0;
    let cy = 0;
    let cz = 0;
    for (let k = 0; k < P; k++) {
      cx += pos[(ring * P + k) * 3];
      cy += pos[(ring * P + k) * 3 + 1];
      cz += pos[(ring * P + k) * 3 + 2];
    }
    pos.push(cx / P, cy / P, cz / P);
    for (let k = 0; k < P; k++) {
      const a = ring * P + k;
      const b = ring * P + ((k + 1) % P);
      if (flip) idx.push(center, a, b);
      else idx.push(center, b, a);
    }
  };
  capEnd(0, false);
  capEnd(S, true);

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function rod(a: THREE.Vector3, b: THREE.Vector3, r = 0.013, flat = 1) {
  const len = a.distanceTo(b);
  const g = new THREE.CylinderGeometry(r, r, len, 8, 1);
  g.scale(1, 1, flat);
  const q = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    b.clone().sub(a).normalize(),
  );
  g.applyQuaternion(q);
  const mid = a.clone().add(b).multiplyScalar(0.5);
  g.translate(mid.x, mid.y, mid.z);
  return g;
}

function plate(points: [number, number][], thickness: number, x: number) {
  const shape = new THREE.Shape(points.map(([z, y]) => new THREE.Vector2(z, y)));
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: 0.004,
    bevelSize: 0.004,
    bevelSegments: 1,
    curveSegments: 6,
  });
  g.rotateY(-Math.PI / 2);
  g.translate(x + thickness / 2, 0, 0);
  return g;
}

const clean = (g: THREE.BufferGeometry) => {
  const out = g.index ? g.toNonIndexed() : g;
  for (const name of Object.keys(out.attributes)) {
    if (name !== "position" && name !== "normal") out.deleteAttribute(name);
  }
  if (!out.attributes.normal) out.computeVertexNormals();
  return out;
};

const merge = (list: THREE.BufferGeometry[]) => mergeGeometries(list.map(clean), false)!;

export interface CarPart {
  name: string;
  explode: [number, number, number];
  body?: THREE.BufferGeometry;
  carbon?: THREE.BufferGeometry;
  dark?: THREE.BufferGeometry;
}

export interface WheelSpec {
  position: [number, number, number];
  radius: number;
  width: number;
  explode: [number, number, number];
}

export const WHEELS: WheelSpec[] = [
  { position: [0.8, 0.36, 1.62], radius: 0.36, width: 0.3, explode: [1.3, 0.1, 0.6] },
  { position: [-0.8, 0.36, 1.62], radius: 0.36, width: 0.3, explode: [-1.3, 0.1, 0.6] },
  { position: [0.76, 0.37, -1.78], radius: 0.37, width: 0.4, explode: [1.3, 0.1, -0.6] },
  { position: [-0.76, 0.37, -1.78], radius: 0.37, width: 0.4, explode: [-1.3, 0.1, -0.6] },
];

function chassis() {
  const hull = loft(
    [
      { z: 2.78, w: 0.05, bot: 0.16, top: 0.23, n: 2.2 },
      { z: 2.5, w: 0.1, bot: 0.15, top: 0.29, n: 2.2 },
      { z: 2.0, w: 0.16, bot: 0.14, top: 0.39, n: 2.3 },
      { z: 1.5, w: 0.22, bot: 0.12, top: 0.5, n: 2.5 },
      { z: 1.0, w: 0.28, bot: 0.1, top: 0.6, n: 2.7 },
      { z: 0.55, w: 0.34, bot: 0.09, top: 0.67, n: 3 },
      { z: 0.1, w: 0.37, bot: 0.09, top: 0.67, n: 3 },
      { z: -0.3, w: 0.36, bot: 0.09, top: 0.8, n: 2.8 },
      { z: -0.62, w: 0.27, bot: 0.1, top: 0.96, n: 2.6 },
      { z: -1.1, w: 0.22, bot: 0.11, top: 0.86, n: 2.4 },
      { z: -1.7, w: 0.15, bot: 0.14, top: 0.66, n: 2.2 },
      { z: -2.3, w: 0.07, bot: 0.2, top: 0.47, n: 2 },
      { z: -2.62, w: 0.03, bot: 0.26, top: 0.38, n: 2 },
    ],
    36,
    8,
  );

  const fin = plate(
    [
      [-0.72, 0.9],
      [-1.0, 0.98],
      [-2.2, 0.72],
      [-2.42, 0.52],
      [-2.2, 0.46],
      [-0.72, 0.8],
    ],
    0.012,
    0,
  );

  const tub = new THREE.SphereGeometry(1, 28, 16);
  tub.scale(0.25, 0.1, 0.56);
  tub.translate(0, 0.66, 0.12);

  const helmet = new THREE.SphereGeometry(0.125, 24, 16);
  helmet.scale(0.95, 1, 1.12);
  helmet.translate(0, 0.79, -0.02);

  const airbox = new THREE.SphereGeometry(1, 20, 12);
  airbox.scale(0.09, 0.09, 0.05);
  airbox.translate(0, 0.9, -0.44);

  const haloCurve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-0.3, 0.72, -0.4),
      new THREE.Vector3(-0.31, 0.87, -0.1),
      new THREE.Vector3(-0.23, 0.95, 0.22),
      new THREE.Vector3(0, 0.98, 0.5),
      new THREE.Vector3(0.23, 0.95, 0.22),
      new THREE.Vector3(0.31, 0.87, -0.1),
      new THREE.Vector3(0.3, 0.72, -0.4),
    ],
    false,
    "catmullrom",
    0.5,
  );
  const halo = new THREE.TubeGeometry(haloCurve, 60, 0.027, 10, false);
  const pylon = rod(new THREE.Vector3(0, 0.98, 0.5), new THREE.Vector3(0, 0.62, 0.72), 0.034, 0.55);

  const mirrors = [-1, 1].flatMap((s) => {
    const head = new THREE.SphereGeometry(1, 12, 8);
    head.scale(0.075, 0.04, 0.03);
    head.translate(s * 0.53, 0.72, 0.5);
    return [head, rod(new THREE.Vector3(s * 0.31, 0.62, 0.52), new THREE.Vector3(s * 0.5, 0.72, 0.5), 0.008)];
  });

  return {
    body: merge([hull, fin]),
    carbon: merge([halo, pylon, ...mirrors]),
    dark: merge([tub, helmet, airbox]),
  };
}

function sidepods() {
  const body: THREE.BufferGeometry[] = [];
  const dark: THREE.BufferGeometry[] = [];
  for (const s of [-1, 1]) {
    body.push(
      loft(
        [
          { z: 0.42, w: 0.2, bot: 0.14, top: 0.48, n: 3.6, x: s * 0.56 },
          { z: 0.2, w: 0.25, bot: 0.1, top: 0.56, n: 3.8, x: s * 0.59 },
          { z: -0.35, w: 0.27, bot: 0.1, top: 0.56, n: 3.4, x: s * 0.58 },
          { z: -0.95, w: 0.23, bot: 0.1, top: 0.45, n: 3, x: s * 0.5 },
          { z: -1.5, w: 0.15, bot: 0.11, top: 0.3, n: 2.6, x: s * 0.38 },
          { z: -2.0, w: 0.05, bot: 0.14, top: 0.19, n: 2.2, x: s * 0.26 },
        ],
        24,
        7,
      ),
    );
    const intake = new THREE.BoxGeometry(0.34, 0.2, 0.02);
    intake.translate(s * 0.58, 0.41, 0.42);
    dark.push(intake);
  }
  return { body: merge(body), dark: merge(dark) };
}

function floorGeometry() {
  const outline: [number, number][] = [
    [0.3, 1.2],
    [0.62, 0.72],
    [0.82, 0.3],
    [0.86, -0.4],
    [0.74, -1.3],
    [0.54, -2.05],
    [0.5, -2.4],
  ];
  const shape = new THREE.Shape();
  outline.forEach(([x, z], i) => (i ? shape.lineTo(x, z) : shape.moveTo(x, z)));
  [...outline].reverse().forEach(([x, z]) => shape.lineTo(-x, z));
  shape.closePath();

  const floor = new THREE.ExtrudeGeometry(shape, {
    depth: 0.025,
    bevelEnabled: true,
    bevelSize: 0.008,
    bevelThickness: 0.008,
    bevelSegments: 1,
  });
  floor.rotateX(Math.PI / 2);
  floor.translate(0, 0.085, 0);

  const diffuser = wing({ span: 1.0, chord: 0.45, thick: 0.02, y: 0.17, z: -2.46, pitch: -0.38 });
  return { carbon: merge([floor, diffuser]) };
}

function frontWing() {
  const nosePylons = [-1, 1].map((s) =>
    rod(new THREE.Vector3(s * 0.08, 0.19, 2.56), new THREE.Vector3(s * 0.14, 0.11, 2.62), 0.016, 0.45),
  );
  const curve = (u: number) => -0.26 * u * u;
  const mainPlane = wing({
    span: 1.9, chord: 0.34, thick: 0.014, y: 0.1, z: 2.72, pitch: 0.08,
    sweep: curve, lift: (u) => 0.02 * u,
  });
  const flap1 = wing({
    span: 1.86, chord: 0.17, thick: 0.01, y: 0.155, z: 2.54, pitch: 0.34,
    sweep: curve, lift: (u) => 0.035 * u,
  });
  const flap2 = wing({
    span: 1.82, chord: 0.13, thick: 0.009, y: 0.215, z: 2.44, pitch: 0.55,
    sweep: curve, lift: (u) => 0.05 * u,
  });
  const endplates = [-1, 1].map((s) =>
    plate(
      [
        [2.6, 0.06],
        [2.22, 0.06],
        [2.14, 0.3],
        [2.34, 0.32],
        [2.56, 0.2],
      ],
      0.016,
      s * 0.95,
    ),
  );
  return {
    body: merge([flap1, flap2, ...endplates]),
    carbon: merge([mainPlane, ...nosePylons]),
  };
}

function rearWing() {
  const main = wing({ span: 1.0, chord: 0.3, thick: 0.016, y: 0.94, z: -2.48, pitch: 0.16 });
  const flap = wing({ span: 1.0, chord: 0.17, thick: 0.012, y: 1.03, z: -2.32, pitch: 0.46 });
  const beam = wing({ span: 0.8, chord: 0.14, thick: 0.012, y: 0.56, z: -2.5, pitch: 0.2 });
  const endplates = [-1, 1].map((s) =>
    plate(
      [
        [-2.64, 0.66],
        [-2.26, 0.7],
        [-2.2, 1.1],
        [-2.32, 1.16],
        [-2.66, 1.1],
      ],
      0.016,
      s * 0.5,
    ),
  );
  const pillars = [-1, 1].map((s) =>
    rod(new THREE.Vector3(s * 0.04, 0.4, -2.42), new THREE.Vector3(s * 0.04, 0.95, -2.48), 0.02, 0.5),
  );
  return {
    body: merge([flap]),
    carbon: merge([main, beam, ...pillars, ...endplates]),
  };
}

function suspension() {
  const rods: THREE.BufferGeometry[] = [];
  for (const s of [-1, 1]) {
    const front = new THREE.Vector3(s * 0.66, 0.36, 1.62);
    const rear = new THREE.Vector3(s * 0.56, 0.37, -1.78);
    rods.push(
      rod(new THREE.Vector3(s * 0.2, 0.47, 1.85), front.clone().setY(0.5), 0.014, 0.5),
      rod(new THREE.Vector3(s * 0.22, 0.47, 1.35), front.clone().setY(0.5), 0.014, 0.5),
      rod(new THREE.Vector3(s * 0.17, 0.25, 1.9), front.clone().setY(0.22), 0.014, 0.5),
      rod(new THREE.Vector3(s * 0.22, 0.22, 1.32), front.clone().setY(0.22), 0.014, 0.5),
      rod(new THREE.Vector3(s * 0.2, 0.33, 1.68), front.clone().setY(0.34), 0.012, 0.6),
    );
    rods.push(
      rod(new THREE.Vector3(s * 0.15, 0.5, -1.55), rear.clone().setY(0.52), 0.014, 0.5),
      rod(new THREE.Vector3(s * 0.1, 0.46, -2.05), rear.clone().setY(0.52), 0.014, 0.5),
      rod(new THREE.Vector3(s * 0.14, 0.25, -1.5), rear.clone().setY(0.22), 0.014, 0.5),
      rod(new THREE.Vector3(s * 0.1, 0.25, -2.1), rear.clone().setY(0.22), 0.014, 0.5),
    );
  }
  return { carbon: merge(rods) };
}

export function buildCar(): CarPart[] {
  return [
    { name: "suelo", explode: [0, -0.9, 0], ...floorGeometry() },
    { name: "suspension", explode: [0, -0.3, 0], ...suspension() },
    { name: "chasis", explode: [0, 0.75, 0], ...chassis() },
    { name: "pontones", explode: [0, 0.28, -0.1], ...sidepods() },
    { name: "aleron-delantero", explode: [0, 0.1, 1.5], ...frontWing() },
    { name: "aleron-trasero", explode: [0, 0.6, -1.5], ...rearWing() },
  ];
}

export function tyreGeometry(radius: number, width: number) {
  const h = width / 2;
  const inner = radius * 0.62;
  const shoulder = 0.05;
  const pts = [
    [inner, -h * 0.82],
    [radius - shoulder * 1.3, -h * 0.98],
    [radius - shoulder * 0.3, -h * 0.93],
    [radius, -h * 0.72],
    [radius, h * 0.72],
    [radius - shoulder * 0.3, h * 0.93],
    [radius - shoulder * 1.3, h * 0.98],
    [inner, h * 0.82],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  const g = new THREE.LatheGeometry(pts, 48);
  g.rotateZ(Math.PI / 2);
  return g;
}

export function rimGeometry(radius: number, width: number) {
  const r = radius * 0.62;
  const barrel = new THREE.CylinderGeometry(r, r, width * 0.8, 32, 1, true);
  barrel.rotateZ(Math.PI / 2);
  const hub = new THREE.CylinderGeometry(r * 0.2, r * 0.26, width * 0.86, 16);
  hub.rotateZ(Math.PI / 2);
  const parts: THREE.BufferGeometry[] = [barrel, hub];
  for (const face of [-1, 1]) {
    for (let i = 0; i < 6; i++) {
      const spoke = new THREE.BoxGeometry(0.012, r * 0.95, 0.042);
      spoke.translate(face * width * 0.37, r * 0.5, 0);
      spoke.rotateX((i / 6) * Math.PI * 2);
      parts.push(spoke);
    }
  }
  return merge(parts);
}

export function sidewallRing(radius: number, width: number) {
  const parts = [-1, 1].map((s) => {
    const ring = new THREE.RingGeometry(radius * 0.8, radius * 0.86, 48);
    ring.rotateY((s * Math.PI) / 2);
    ring.translate(s * width * 0.495, 0, 0);
    return ring;
  });
  return merge(parts);
}
