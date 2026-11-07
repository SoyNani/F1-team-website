"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Wheel } from "@/components/molecules/three/Wheel";
import {
  WHEELS,
  buildCar,
  rimGeometry,
  sidewallRing,
  tyreGeometry,
} from "@/lib/three/carGeometry";
import { applyLivery, createLiveryUniforms, updateLivery } from "@/lib/three/livery";
import { world } from "@/lib/world";

function createGroundShadow() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(64, 64, 8, 64, 64, 64);
  gradient.addColorStop(0, "rgba(0,0,0,0.85)");
  gradient.addColorStop(0.55, "rgba(0,0,0,0.5)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.MeshBasicMaterial({
    map: new THREE.CanvasTexture(canvas),
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  });
}

export function Car() {
  const root = useRef<THREE.Group>(null);
  const partRefs = useRef<(THREE.Group | null)[]>([]);
  const wheelRefs = useRef<(THREE.Group | null)[]>([]);
  const spinRefs = useRef<(THREE.Group | null)[]>([]);
  const aspect = useThree((s) => s.viewport.aspect);

  const parts = useMemo(buildCar, []);
  const wheels = useMemo(
    () =>
      WHEELS.map((w) => ({
        tyre: tyreGeometry(w.radius, w.width),
        rim: rimGeometry(w.radius, w.width),
        ring: sidewallRing(w.radius, w.width),
      })),
    [],
  );
  const shadow = useMemo(createGroundShadow, []);

  const { uniforms, body, carbon, dark, wheelMaterials } = useMemo(() => {
    const uniforms = createLiveryUniforms();
    const body = new THREE.MeshPhysicalMaterial({
      roughness: 0.3,
      metalness: 0.3,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
    });
    applyLivery(body, uniforms);
    return {
      uniforms,
      body,
      carbon: new THREE.MeshStandardMaterial({ color: "#121316", roughness: 0.42, metalness: 0.5 }),
      dark: new THREE.MeshStandardMaterial({ color: "#050506", roughness: 0.3, metalness: 0.2 }),
      wheelMaterials: {
        rubber: new THREE.MeshStandardMaterial({ color: "#0c0c0d", roughness: 0.82 }),
        rim: new THREE.MeshStandardMaterial({ color: "#2a2c30", roughness: 0.3, metalness: 0.9 }),
        ring: new THREE.MeshStandardMaterial({ color: "#e9e6df", roughness: 0.6, side: THREE.DoubleSide }),
      },
    };
  }, []);

  useEffect(
    () => () => {
      parts.forEach((p) => [p.body, p.carbon, p.dark].forEach((g) => g?.dispose()));
      wheels.forEach((w) => Object.values(w).forEach((g) => g.dispose()));
      [body, carbon, dark, ...Object.values(wheelMaterials)].forEach((m) => m.dispose());
      shadow.map?.dispose();
      shadow.dispose();
    },
    [parts, wheels, body, carbon, dark, wheelMaterials, shadow],
  );

  useFrame((_, delta) => {
    const group = root.current;
    if (!group) return;
    const c = world.car;

    body.metalness = updateLivery(uniforms, world.fusion);
    shadow.opacity = Math.max(1 - c.explode * 1.4, 0);

    const fit = Math.min(1, aspect / 1.35) * c.scale;
    group.position.set(c.x, c.y, c.z);
    group.rotation.set(c.rx, c.ry, c.rz);
    group.scale.setScalar(fit);

    parts.forEach((p, i) => {
      partRefs.current[i]?.position.set(
        p.explode[0] * c.explode,
        p.explode[1] * c.explode,
        p.explode[2] * c.explode,
      );
    });

    c.spin += delta * (1.2 + world.velocity * 40);
    WHEELS.forEach((w, i) => {
      wheelRefs.current[i]?.position.set(
        w.position[0] + w.explode[0] * c.explode,
        w.position[1] + w.explode[1] * c.explode,
        w.position[2] + w.explode[2] * c.explode,
      );
      const spin = spinRefs.current[i];
      if (spin) spin.rotation.x = c.spin;
    });
  });

  return (
    <group ref={root}>
      <mesh material={shadow} position={[0, 0, -0.1]} rotation-x={-Math.PI / 2} scale={[3.4, 7.6, 1]}>
        <planeGeometry />
      </mesh>
      {parts.map((p, i) => (
        <group
          key={p.name}
          ref={(el) => {
            partRefs.current[i] = el;
          }}
        >
          {p.body && <mesh geometry={p.body} material={body} />}
          {p.carbon && <mesh geometry={p.carbon} material={carbon} />}
          {p.dark && <mesh geometry={p.dark} material={dark} />}
        </group>
      ))}
      {wheels.map((geometry, i) => (
        <Wheel
          key={i}
          geometry={geometry}
          materials={wheelMaterials}
          mountRef={(el) => {
            wheelRefs.current[i] = el;
          }}
          spinRef={(el) => {
            spinRefs.current[i] = el;
          }}
        />
      ))}
    </group>
  );
}
