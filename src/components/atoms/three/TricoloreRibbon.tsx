"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { world } from "@/lib/world";

const vertex = `
uniform float uTime;
varying vec2 vUv;
varying float vShade;
void main(){
  vUv = uv;
  vec3 p = position;
  float wave = sin(p.x * 1.1 - uTime * 1.6) * 0.34 + sin(p.x * 2.3 + p.y * 2.0 - uTime * 2.3) * 0.12;
  p.y += wave * 0.75;
  p.z += cos(p.x * 1.4 - uTime * 1.4) * 0.5;
  vShade = 0.72 + 0.28 * sin(p.x * 1.1 - uTime * 1.6 + 1.2);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const fragment = `
precision highp float;
uniform float uReveal;
varying vec2 vUv;
varying float vShade;
void main(){
  float head = uReveal * 1.25;
  float edge = smoothstep(head, head - 0.14, vUv.x + sin(vUv.y * 22.0) * 0.012);
  if (edge < 0.01) discard;

  vec3 green = vec3(0.0, 0.42, 0.13);
  vec3 white = vec3(0.92, 0.92, 0.9);
  vec3 red = vec3(0.78, 0.02, 0.03);
  vec3 c = vUv.y > 0.667 ? green : (vUv.y > 0.333 ? white : red);
  gl_FragColor = vec4(c * vShade, edge);
}
`;

export function TricoloreRibbon() {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: { uTime: { value: 0 }, uReveal: { value: 0 } },
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
      }),
    [],
  );

  useEffect(() => () => material.dispose(), [material]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uReveal.value = world.flag;
    mesh.current.visible = world.flag > 0.001;
  });

  return (
    <mesh ref={mesh} position={[0, -1.25, -2.4]} rotation={[0, 0, 0.1]} visible={false} material={material}>
      <planeGeometry args={[18, 1.15, 200, 6]} />
    </mesh>
  );
}
