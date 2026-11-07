import * as THREE from "three";
import { loft } from "./carGeometry";

export function buildHelmet() {
  const shell = new THREE.SphereGeometry(1, 48, 32);
  shell.scale(0.9, 1, 1.08);

  const chin = loft(
    [
      { z: 1.12, w: 0.2, bot: -0.62, top: -0.32, n: 2.2 },
      { z: 0.95, w: 0.52, bot: -0.8, top: -0.24, n: 2.4 },
      { z: 0.35, w: 0.8, bot: -0.92, top: -0.2, n: 2.6 },
      { z: -0.4, w: 0.8, bot: -0.92, top: -0.2, n: 2.6 },
      { z: -0.85, w: 0.42, bot: -0.8, top: -0.3, n: 2.2 },
    ],
    32,
    6,
  );

  const visorArc = 2.5;
  const visor = new THREE.SphereGeometry(1.015, 40, 16, Math.PI / 2 - visorArc / 2, visorArc, 1.28, 0.62);
  visor.scale(0.9, 1, 1.08);

  const spoiler = loft(
    [
      { z: -0.75, w: 0.02, bot: 0.58, top: 0.6, n: 2 },
      { z: -0.95, w: 0.42, bot: 0.5, top: 0.6, n: 3 },
      { z: -1.2, w: 0.46, bot: 0.47, top: 0.52, n: 3 },
    ],
    16,
    4,
  );

  return { shell, chin, visor, spoiler };
}

export type HelmetGeometry = ReturnType<typeof buildHelmet>;
