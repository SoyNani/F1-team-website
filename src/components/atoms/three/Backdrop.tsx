"use client";

import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { fusionState, world } from "@/lib/world";
import { backdropFragment, backdropVertex } from "@/shaders/backdrop";

const PALETTE = [
  "#040406", "#2a0a10", "#000000",
  "#3a0004", "#c8050f", "#ffb321",
  "#0a0d10", "#a9b4bd", "#00e0c6",
  "#1d0c02", "#ff7a00", "#fff0dc",
  "#d4070f", "#b8c2ca", "#ff7a00",
];

export function Backdrop() {
  const material = useMemo(() => {
    const uniforms = {
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uMix: { value: 0 },
      uFrom: { value: 0 },
      uTo: { value: 1 },
      uDim: { value: 0 },
      uPaint: { value: 0 },
      uVelocity: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uPal: { value: PALETTE.map((c) => new THREE.Color(c)) },
    };
    return new THREE.ShaderMaterial({
      vertexShader: backdropVertex,
      fragmentShader: backdropFragment,
      uniforms,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    });
  }, []);

  useEffect(() => () => material.dispose(), [material]);

  useFrame(({ clock, viewport }) => {
    const { from, to, mix } = fusionState(world.fusion);
    const uniforms = material.uniforms;
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uAspect.value = viewport.aspect;
    uniforms.uFrom.value = from;
    uniforms.uTo.value = to;
    uniforms.uMix.value = mix;
    uniforms.uDim.value = world.dim;
    uniforms.uPaint.value = world.paint;
    uniforms.uVelocity.value = world.velocity;
    uniforms.uPointer.value.set(world.pointer.x, world.pointer.y);
  });

  return (
    <mesh frustumCulled={false} renderOrder={-1000} material={material}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}
