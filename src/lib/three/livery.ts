import * as THREE from "three";
import { noiseGLSL } from "@/shaders/common";
import { fusionState } from "@/lib/world";

interface Livery {
  base: string;
  second: string;
  stripe: string;
  zone: [number, number];
  stripeY: number;
  metal: number;
}

const LIVERIES: Livery[] = [
  { base: "#0b0b0e", second: "#0b0b0e", stripe: "#1c1c22", zone: [0, 0], stripeY: 0.4, metal: 0.8 },
  { base: "#d30a0a", second: "#f2efe9", stripe: "#f2efe9", zone: [-2.8, -1.1], stripeY: 0.3, metal: 0.25 },
  { base: "#c9d1d8", second: "#0c0e10", stripe: "#00e0c6", zone: [-2.8, 0.3], stripeY: 0.42, metal: 0.92 },
  { base: "#ff7a00", second: "#0e0e10", stripe: "#ff7a00", zone: [-1.4, 0.9], stripeY: 0.2, metal: 0.3 },
  { base: "#ff7a00", second: "#0e0e10", stripe: "#ff7a00", zone: [-1.4, 0.9], stripeY: 0.2, metal: 0.3 },
];

const color = (hex: string) => new THREE.Color(hex);

export function createLiveryUniforms() {
  return {
    uBaseA: { value: color(LIVERIES[0].base) },
    uBaseB: { value: color(LIVERIES[1].base) },
    uSecondA: { value: color(LIVERIES[0].second) },
    uSecondB: { value: color(LIVERIES[1].second) },
    uStripeA: { value: color(LIVERIES[0].stripe) },
    uStripeB: { value: color(LIVERIES[1].stripe) },
    uZoneA: { value: new THREE.Vector3(0, 0, 0.4) },
    uZoneB: { value: new THREE.Vector3(0, 0, 0.4) },
    uMelt: { value: 0 },
  };
}

export type LiveryUniforms = ReturnType<typeof createLiveryUniforms>;

export function updateLivery(u: LiveryUniforms, fusion: number) {
  const { from, to, mix } = fusionState(fusion);
  const a = LIVERIES[from];
  const b = LIVERIES[to];
  u.uBaseA.value.set(a.base);
  u.uBaseB.value.set(b.base);
  u.uSecondA.value.set(a.second);
  u.uSecondB.value.set(b.second);
  u.uStripeA.value.set(a.stripe);
  u.uStripeB.value.set(b.stripe);
  u.uZoneA.value.set(a.zone[0], a.zone[1], a.stripeY);
  u.uZoneB.value.set(b.zone[0], b.zone[1], b.stripeY);
  u.uMelt.value = mix;
  return THREE.MathUtils.lerp(a.metal, b.metal, mix);
}

export function applyLivery(material: THREE.MeshPhysicalMaterial, uniforms: LiveryUniforms) {
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);

    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vLivery;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvLivery = position;");

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        varying vec3 vLivery;
        uniform vec3 uBaseA, uBaseB, uSecondA, uSecondB, uStripeA, uStripeB;
        uniform vec3 uZoneA, uZoneB;
        uniform float uMelt;
        ${noiseGLSL}
        vec3 paint(vec3 base, vec3 second, vec3 stripe, vec3 zone){
          float z = vLivery.z;
          float inZone = smoothstep(zone.x - 0.03, zone.x + 0.03, z) * (1.0 - smoothstep(zone.y - 0.03, zone.y + 0.03, z));
          vec3 c = mix(base, second, inZone);
          float y = vLivery.y + z * 0.07;
          float line = 1.0 - smoothstep(0.012, 0.022, abs(y - zone.z));
          return mix(c, stripe, line);
        }`,
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        vec3 liveryA = paint(uBaseA, uSecondA, uStripeA, uZoneA);
        vec3 liveryB = paint(uBaseB, uSecondB, uStripeB, uZoneB);
        float meltField = fbm(vLivery.zy * 1.5 + vLivery.x) * 0.45 + 0.5 + vLivery.z * 0.09;
        float meltEdge = mix(-0.35, 1.35, uMelt);
        float melt = smoothstep(meltEdge - 0.09, meltEdge + 0.09, meltField);
        diffuseColor.rgb = mix(liveryB, liveryA, melt);`,
      );
  };
  material.customProgramCacheKey = () => "livery";
}
