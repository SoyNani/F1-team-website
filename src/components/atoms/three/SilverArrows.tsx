"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { world } from "@/lib/world";

const COUNT = 110;
const NEAR = 7;
const FAR = -34;

export function SilverArrows() {
  const mesh = useRef<THREE.InstancedMesh>(null);

  const shards = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => {
        const a = (i * 2.399963) % (Math.PI * 2);
        const r = 2.4 + ((i * 37) % 100) / 100 * 7;
        return {
          x: Math.cos(a) * r * 1.5,
          y: Math.sin(a) * r * 0.75,
          phase: ((i * 61) % 100) / 100,
          speed: 0.22 + ((i * 17) % 100) / 300,
          length: 0.7 + ((i * 29) % 100) / 60,
        };
      }),
    [],
  );

  const geometry = useMemo(() => {
    const g = new THREE.ConeGeometry(0.05, 1, 4, 1);
    g.rotateX(Math.PI / 2);
    return g;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    const m = mesh.current;
    if (!m) return;
    m.visible = world.arrows > 0.001;
    if (!m.visible) return;

    const t = clock.elapsedTime;
    const rush = 1 + world.velocity * 3;
    shards.forEach((s, i) => {
      const u = (s.phase + t * s.speed * rush * 0.35) % 1;
      dummy.position.set(s.x, s.y, FAR + u * (NEAR - FAR));
      const presence = world.arrows * Math.min(1, u * 5);
      dummy.scale.set(presence, presence, s.length * presence * rush);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[geometry, undefined, COUNT]} frustumCulled={false} visible={false}>
      <meshStandardMaterial color="#dfe6ec" metalness={1} roughness={0.14} />
    </instancedMesh>
  );
}
