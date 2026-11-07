"use client";

import { Environment, Lightformer } from "@react-three/drei";

export function Studio() {
  return (
    <>
      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#08090c"]} />
        <Lightformer form="rect" intensity={5} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[14, 5, 1]} />
        <Lightformer form="rect" intensity={3} position={[-7, 2, 2]} rotation-y={Math.PI / 2} scale={[12, 2.2, 1]} />
        <Lightformer form="rect" intensity={3} position={[7, 2, -2]} rotation-y={-Math.PI / 2} scale={[12, 2.2, 1]} />
        <Lightformer form="rect" intensity={1.6} position={[0, 2, 8]} rotation-y={Math.PI} scale={[8, 1.2, 1]} />
        <Lightformer form="ring" intensity={2.4} position={[3, 3, -7]} scale={3} />
      </Environment>
      <directionalLight position={[3, 6, 5]} intensity={1.6} />
      <directionalLight position={[-5, 2, -4]} intensity={1.1} color="#b8c8ff" />
    </>
  );
}
