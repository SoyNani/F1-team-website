"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Helmet } from "@/components/molecules/three/Helmet";
import { buildHelmet } from "@/lib/three/helmetGeometry";
import { applyLivery, createLiveryUniforms, updateLivery } from "@/lib/three/livery";
import { world } from "@/lib/world";

export function HelmetPair() {
  const refs = useRef<(THREE.Group | null)[]>([]);
  const aspect = useThree((s) => s.viewport.aspect);
  const viewportHeight = useThree((s) => s.viewport.height);
  const geometry = useMemo(buildHelmet, []);

  const { uniforms, materials } = useMemo(() => {
    const uniforms = createLiveryUniforms();
    const paint = new THREE.MeshPhysicalMaterial({
      roughness: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
    });
    applyLivery(paint, uniforms);
    return {
      uniforms,
      materials: {
        paint,
        visor: new THREE.MeshPhysicalMaterial({ color: "#050507", metalness: 1, roughness: 0.06, clearcoat: 1 }),
        trim: new THREE.MeshStandardMaterial({ color: "#101114", roughness: 0.5, metalness: 0.4 }),
      },
    };
  }, []);

  useEffect(
    () => () => {
      Object.values(geometry).forEach((g) => g.dispose());
      Object.values(materials).forEach((m) => m.dispose());
    },
    [geometry, materials],
  );

  useFrame(({ clock }) => {
    materials.paint.metalness = updateLivery(uniforms, world.fusion);
    const portrait = aspect < 1;
    const t = clock.elapsedTime;

    refs.current.forEach((g, i) => {
      if (!g) return;
      const k = world.helmets[i];
      g.visible = !portrait && k > 0.001;
      if (!g.visible) return;

      const width = viewportHeight * aspect;
      const side = i === 0 ? -1 : 1;
      const baseX = (i === 0 ? -0.44 * width : 0.06 * width) + 2.3;
      g.position.set(baseX + side * (1 - k) * 4, 0.62 + Math.sin(t * 0.9 + i * 2) * 0.05, (1 - k) * -3);
      g.rotation.set(0.06, -side * 0.72 + (1 - k) * side * 3 + world.pointer.x * 0.25, 0);
      g.scale.setScalar(0.5);
    });
  });

  return (
    <>
      {[0, 1].map((i) => (
        <Helmet
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          geometry={geometry}
          materials={materials}
        />
      ))}
    </>
  );
}
