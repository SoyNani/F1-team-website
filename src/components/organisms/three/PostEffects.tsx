"use client";

import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, ToneMapping } from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import { SpeedEffect } from "@/lib/three/SpeedEffect";
import { world } from "@/lib/world";

export function PostEffects({ lite, calm }: { lite: boolean; calm: boolean }) {
  const speed = useMemo(() => new SpeedEffect(), []);

  useEffect(() => () => speed.dispose(), [speed]);

  useFrame(() => {
    speed.amount = calm ? 0 : Math.min(world.velocity * 1.15 + world.warp, 1.6);
  });

  return (
    <EffectComposer multisampling={lite ? 0 : 4} enableNormalPass={false}>
      <Bloom
        mipmapBlur
        intensity={0.55}
        luminanceThreshold={0.82}
        luminanceSmoothing={0.2}
        radius={0.7}
      />
      <primitive object={speed} />
      <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      <Noise premultiply opacity={0.16} blendFunction={BlendFunction.SOFT_LIGHT} />
    </EffectComposer>
  );
}
