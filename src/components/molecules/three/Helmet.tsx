"use client";

import type { Ref } from "react";
import type * as THREE from "three";
import type { HelmetGeometry } from "@/lib/three/helmetGeometry";

interface HelmetProps {
  ref: Ref<THREE.Group>;
  geometry: HelmetGeometry;
  materials: { paint: THREE.Material; visor: THREE.Material; trim: THREE.Material };
}

export function Helmet({ ref, geometry, materials }: HelmetProps) {
  return (
    <group ref={ref} visible={false}>
      <mesh geometry={geometry.shell} material={materials.paint} />
      <mesh geometry={geometry.chin} material={materials.paint} />
      <mesh geometry={geometry.visor} material={materials.visor} />
      <mesh geometry={geometry.spoiler} material={materials.trim} />
    </group>
  );
}
