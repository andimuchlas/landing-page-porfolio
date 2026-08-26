"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * Procedural studio lighting — no network HDR needed.
 * Gives metals their chrome reflections.
 */
export default function StudioEnv() {
  return (
    <>
      <ambientLight intensity={0.12} />
      <directionalLight position={[4, 6, 6]} intensity={0.7} color="#dfe6ff" />
      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#0a0a0d"]} />
        <Lightformer
          form="rect"
          intensity={3}
          position={[0, 4, -6]}
          scale={[4, 1.5, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.5}
          position={[-5, 0, -2]}
          rotation-y={Math.PI / 3}
          scale={[3, 0.8, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.5}
          position={[5, -1, -2]}
          rotation-y={-Math.PI / 3}
          scale={[3, 0.8, 1]}
        />
        <Lightformer
          form="circle"
          intensity={2}
          color="#ffd9c0"
          position={[0, -4, 2]}
          scale={2}
        />
      </Environment>
    </>
  );
}
