"use client";

import type { Ref } from "react";
import type * as THREE from "three";

interface WheelProps {
  geometry: { tyre: THREE.BufferGeometry; rim: THREE.BufferGeometry; ring: THREE.BufferGeometry };
  materials: { rubber: THREE.Material; rim: THREE.Material; ring: THREE.Material };
  mountRef: Ref<THREE.Group>;
  spinRef: Ref<THREE.Group>;
}

export function Wheel({ geometry, materials, mountRef, spinRef }: WheelProps) {
  return (
    <group ref={mountRef}>
      <group ref={spinRef}>
        <mesh geometry={geometry.tyre} material={materials.rubber} />
        <mesh geometry={geometry.rim} material={materials.rim} />
      </group>
      <mesh geometry={geometry.ring} material={materials.ring} />
    </group>
  );
}
