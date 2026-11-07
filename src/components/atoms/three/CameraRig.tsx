"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { world } from "@/lib/world";

export function CameraRig() {
  const target = useRef(new THREE.Vector3(0, 0.05, 0));

  useFrame(({ camera }, delta) => {
    const k = 1 - Math.exp(-delta * 3);
    camera.position.x += (world.pointer.x * 0.22 - camera.position.x) * k;
    camera.position.y += (0.55 - world.pointer.y * 0.14 - camera.position.y) * k;
    camera.lookAt(target.current);
  });

  return null;
}
