"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { Backdrop } from "@/components/atoms/three/Backdrop";
import { CameraRig } from "@/components/atoms/three/CameraRig";
import { ItalyParticles } from "@/components/atoms/three/ItalyParticles";
import { SilverArrows } from "@/components/atoms/three/SilverArrows";
import { Studio } from "@/components/atoms/three/Studio";
import { TricoloreRibbon } from "@/components/atoms/three/TricoloreRibbon";
import { WindTunnel } from "@/components/atoms/three/WindTunnel";
import { Car } from "./Car";
import { HelmetPair } from "./HelmetPair";
import { PostEffects } from "./PostEffects";

export default function WorldCanvas() {
  const [lite, setLite] = useState(false);
  const [calm, setCalm] = useState(false);
  const [dpr, setDpr] = useState(1.6);

  useEffect(() => {
    const small = window.matchMedia("(max-width: 820px)").matches;
    setLite(small);
    setDpr(small ? 1.25 : Math.min(window.devicePixelRatio, 1.6));
    setCalm(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <Canvas
      className="!fixed inset-0"
      dpr={dpr}
      camera={{ position: [0, 0.55, 8], fov: 32, near: 0.1, far: 80 }}
      gl={{ antialias: false, powerPreference: "high-performance", stencil: false, alpha: false }}
      aria-hidden
    >
      <PerformanceMonitor
        onDecline={() => setDpr((d) => Math.max(d - 0.25, 0.85))}
        flipflops={3}
      />
      <Studio />
      <CameraRig />
      <Backdrop />
      <TricoloreRibbon />
      <ItalyParticles count={lite ? 12000 : 24000} />
      <SilverArrows />
      <Car />
      <WindTunnel />
      <HelmetPair />
      <PostEffects lite={lite} calm={calm} />
    </Canvas>
  );
}
