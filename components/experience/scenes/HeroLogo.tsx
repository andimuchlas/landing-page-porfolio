"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { S, POINTER } from "@/lib/state";
import { smoothstep } from "@/lib/utils";
import StudioEnv from "../StudioEnv";

const LOGO_URL = "/assets/3d/logo-3d.glb";

export default function HeroLogo() {
  const parallax = useRef<THREE.Group>(null);
  const spinGroup = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);

  const { scene } = useGLTF(LOGO_URL);

  // clone + collect materials in one pure pass (no refs touched during render)
  const { model, materials } = useMemo(() => {
    const clone = scene.clone(true);
    const mats: THREE.Material[] = [];
    clone.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        const mesh = o as THREE.Mesh;
        mesh.material = (mesh.material as THREE.Material).clone();
        mesh.material.transparent = true;
        mats.push(mesh.material);
      }
    });
    return { model: clone, materials: mats };
  }, [scene]);
  const matsRef = useRef(materials);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const p = S.hero.p;

    // pointer parallax (outer group)
    if (parallax.current) {
      const g = parallax.current;
      g.rotation.x += (POINTER.y * 0.18 - g.rotation.x) * Math.min(1, dt * 3);
      g.rotation.z += (POINTER.x * -0.08 - g.rotation.z) * Math.min(1, dt * 3);
    }

    const spinT = smoothstep(0.02, 0.38, p);
    const recede = smoothstep(0.34, 0.58, p);
    const fade = 1 - smoothstep(0.46, 0.66, p);

    if (spinGroup.current) {
      const g = spinGroup.current;
      g.rotation.y = t * 0.22 + spinT * Math.PI * 3;
      g.position.z = -recede * 8;
      const s = 1 - recede * 0.3;
      g.scale.setScalar(s);
    }

    for (const m of matsRef.current) m.opacity = fade;

    if (ring.current) {
      ring.current.rotation.x = Math.PI / 2.4 + t * 0.1;
      const m = ring.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.22 * fade;
    }
  });

  return (
    <>
      <StudioEnv />
      <PerspectiveCamera makeDefault fov={42} position={[0, 0, 7]} near={0.1} far={60} />
      <group ref={parallax}>
        <group ref={spinGroup}>
          <primitive object={model} scale={1.35} />
          <mesh ref={ring}>
            <torusGeometry args={[2.3, 0.008, 8, 128]} />
            <meshBasicMaterial color="#ff4d00" transparent opacity={0.22} />
          </mesh>
        </group>
      </group>
    </>
  );
}

useGLTF.preload(LOGO_URL);
