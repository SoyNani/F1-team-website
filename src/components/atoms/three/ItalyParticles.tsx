"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ITALY_PINS } from "@/data/teams";
import { world } from "@/lib/world";
import { noiseGLSL } from "@/shaders/common";

type Point = [number, number];

const MAINLAND: Point[] = [
  [7.5, 43.8], [8.2, 44.0], [8.9, 44.4], [9.8, 44.05], [10.3, 43.5], [10.5, 42.95],
  [11.2, 42.4], [11.8, 42.1], [12.25, 41.75], [13.0, 41.25], [13.6, 41.2], [14.25, 40.8],
  [14.8, 40.65], [15.3, 40.0], [15.95, 39.5], [16.1, 38.9], [15.65, 38.1], [16.05, 37.92],
  [16.6, 38.4], [17.15, 39.05], [16.6, 39.7], [17.2, 40.45], [18.0, 39.95], [18.35, 39.8],
  [18.5, 40.15], [17.95, 40.65], [16.85, 41.15], [15.9, 41.6], [16.2, 41.85], [14.7, 42.15],
  [14.2, 42.45], [13.6, 43.5], [12.55, 44.05], [12.3, 44.45], [12.5, 44.95], [12.35, 45.4],
  [13.1, 45.65], [13.75, 45.65], [13.7, 46.5], [12.4, 47.05], [11.0, 46.8], [10.4, 46.6],
  [10.1, 46.25], [9.0, 45.9], [8.4, 46.4], [7.0, 45.9], [6.7, 45.1], [7.0, 44.2],
];
const SICILY: Point[] = [
  [12.45, 37.9], [13.35, 38.2], [15.6, 38.3], [15.1, 37.3], [15.1, 36.7], [14.0, 37.05], [12.6, 37.6],
];
const SARDINIA: Point[] = [
  [8.2, 40.9], [9.2, 41.25], [9.75, 40.5], [9.55, 39.15], [8.85, 38.9], [8.4, 39.2],
];
const SHAPES = [MAINLAND, SICILY, SARDINIA];

const inside = (poly: Point[], x: number, y: number) => {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
};

const MAP_SCALE = 0.36;
const project = (lon: number, lat: number): [number, number] => [
  (lon - 12.5) * Math.cos((42 * Math.PI) / 180) * MAP_SCALE,
  (lat - 41.8) * MAP_SCALE,
];

function mulberry(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const vertex = `
attribute vec3 aMap;
attribute vec3 aColor;
attribute float aSeed;
uniform float uTime;
uniform float uForm;
uniform float uPixel;
varying vec3 vColor;
varying float vAlpha;
${noiseGLSL}

void main(){
  float start = aSeed * 0.55;
  float k = smoothstep(start, start + 0.45, uForm);
  vec3 p = mix(position, aMap, k);
  float drift = 1.0 - k * 0.92;
  p.x += gnoise(vec2(aSeed * 40.0, uTime * 0.15)) * 0.35 * drift;
  p.y += gnoise(vec2(aSeed * 70.0 + 3.0, uTime * 0.15)) * 0.35 * drift;
  p.z += sin(uTime * 1.2 + aMap.x * 3.0 + aMap.y * 2.0) * 0.03;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uPixel * (0.6 + aSeed * 0.9) * (9.0 / -mv.z);
  vColor = aColor;
  vAlpha = k * smoothstep(0.0, 0.2, uForm);
}
`;

const fragment = `
precision highp float;
varying vec3 vColor;
varying float vAlpha;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.15, d) * vAlpha;
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor, a);
}
`;

export function ItalyParticles({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null);
  const points = useRef<THREE.Points>(null);
  const { camera, size, viewport } = useThree();

  const geometry = useMemo(() => {
    const rand = mulberry(1950);
    const dust = new Float32Array(count * 3);
    const map = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const green = new THREE.Color("#0fae5c");
    const white = new THREE.Color("#ffffff");
    const red = new THREE.Color("#ff2415");

    let n = 0;
    while (n < count) {
      const lon = 6.5 + rand() * 12.2;
      const lat = 36.5 + rand() * 10.7;
      if (!SHAPES.some((s) => inside(s, lon, lat))) continue;

      const [x, y] = project(lon, lat);
      map.set([x, y, (rand() - 0.5) * 0.08], n * 3);
      dust.set([(rand() - 0.5) * 14, (rand() - 0.5) * 9, (rand() - 0.5) * 6], n * 3);

      const band = (lon - 6.5) / 12.2 + (lat - 41.8) * 0.045;
      const c = band < 0.36 ? green : band < 0.62 ? white : red;
      colors.set([c.r, c.g, c.b], n * 3);
      seeds[n] = rand();
      n++;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(dust, 3));
    g.setAttribute("aMap", new THREE.BufferAttribute(map, 3));
    g.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 30);
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: { uTime: { value: 0 }, uForm: { value: 0 }, uPixel: { value: 2 } },
        transparent: true,
        depthWrite: false,
        toneMapped: false,
      }),
    [],
  );

  useEffect(
    () => () => {
      material.dispose();
      geometry.dispose();
    },
    [material, geometry],
  );

  const pins = useMemo(
    () =>
      ITALY_PINS.map((p) => {
        const [x, y] = project(p.lonLat[0], p.lonLat[1]);
        return { id: p.id, local: new THREE.Vector3(x, y, 0), el: null as HTMLElement | null };
      }),
    [],
  );

  const scratch = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock, gl }) => {
    const g = group.current;
    if (!g || !points.current) return;
    const uniforms = material.uniforms;
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uForm.value = world.italy;
    uniforms.uPixel.value = 2.1 * gl.getPixelRatio();

    const visible = world.italy > 0.001;
    points.current.visible = visible;
    if (!visible) return;

    const portrait = viewport.aspect < 1;
    const s = portrait ? Math.min(0.62, viewport.aspect * 0.95) : 1.02;
    g.scale.setScalar(s);
    g.position.set(portrait ? 0 : 1.55, portrait ? 0.82 : -0.1, 0);
    g.rotation.y = -0.2 + world.pointer.x * 0.08 + (1 - world.italy) * 0.8;
    g.rotation.x = world.pointer.y * 0.05;
    g.updateMatrixWorld();

    for (const pin of pins) {
      pin.el ??= document.querySelector<HTMLElement>(`[data-pin="${pin.id}"]`);
      if (!pin.el) continue;
      scratch.copy(pin.local).applyMatrix4(g.matrixWorld).project(camera);
      const x = (scratch.x * 0.5 + 0.5) * size.width;
      const y = (-scratch.y * 0.5 + 0.5) * size.height;
      pin.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }
  });

  return (
    <group ref={group}>
      <points ref={points} geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}
