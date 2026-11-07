"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { world } from "@/lib/world";

const LINES = 84;

const vertex = `
attribute vec3 aLine;
uniform float uTime;
uniform float uCarX;
uniform vec3 uCar;
varying float vAlong;
varying float vSeed;
varying float vLift;

void main(){
  float x = position.x;
  vec2 lane = aLine.xy;

  vec3 toCar = vec3(x - uCarX, lane.y - uCar.y, lane.x);
  vec3 q = toCar / vec3(3.3, 0.95, 1.5);
  float influence = exp(-dot(q, q) * 1.1);
  float dir = sign(lane.y - uCar.y + 0.0001);
  float y = lane.y + dir * influence * 0.85;
  float z = lane.x * (1.0 + influence * 0.7);

  float wake = smoothstep(2.4, 6.0, x - uCarX) * exp(-pow((lane.y - uCar.y) * 1.3, 2.0));
  y += sin(x * 3.2 - uTime * 7.0 + aLine.z * 40.0) * wake * 0.16;

  y += position.y * 0.016;

  vAlong = x;
  vSeed = aLine.z;
  vLift = influence;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(x, y, z, 1.0);
}
`;

const fragment = `
precision highp float;
uniform float uTime;
uniform float uAlpha;
varying float vAlong;
varying float vSeed;
varying float vLift;

void main(){
  float pulse = fract(vAlong * 0.09 - uTime * (0.32 + vSeed * 0.28) + vSeed * 7.0);
  float dash = smoothstep(0.0, 0.2, pulse) * smoothstep(0.75, 0.3, pulse);
  float fade = smoothstep(11.0, 6.0, abs(vAlong));
  vec3 cold = vec3(1.0, 0.94, 0.86);
  vec3 hot = vec3(1.0, 0.36, 0.0);
  vec3 c = mix(cold, hot, clamp(vLift * 1.5, 0.0, 1.0));
  gl_FragColor = vec4(c * 1.4, dash * fade * uAlpha * (0.4 + vLift * 0.6));
}
`;

export function WindTunnel() {
  const mesh = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const base = new THREE.PlaneGeometry(24, 1, 220, 1);
    const g = new THREE.InstancedBufferGeometry();
    g.index = base.index;
    g.setAttribute("position", base.attributes.position);
    const lanes = new Float32Array(LINES * 3);
    for (let i = 0; i < LINES; i++) {
      const row = i % 14;
      const col = Math.floor(i / 14);
      lanes[i * 3] = -2.2 + col * 0.88;
      lanes[i * 3 + 1] = -1.8 + row * 0.3 + ((i * 13) % 7) * 0.02;
      lanes[i * 3 + 2] = ((i * 37) % 100) / 100;
    }
    g.setAttribute("aLine", new THREE.InstancedBufferAttribute(lanes, 3));
    g.instanceCount = LINES;
    return g;
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          uTime: { value: 0 },
          uAlpha: { value: 0 },
          uCarX: { value: 0 },
          uCar: { value: new THREE.Vector3(0, 0.1, 0) },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    [],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    mesh.current.visible = world.flow > 0.001;
    const uniforms = material.uniforms;
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uAlpha.value = world.flow;
    uniforms.uCarX.value = world.car.x;
    uniforms.uCar.value.y = world.car.y + 0.45;
  });

  return (
    <mesh ref={mesh} geometry={geometry} material={material} frustumCulled={false} visible={false} />
  );
}
