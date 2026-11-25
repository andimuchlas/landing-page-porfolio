"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";

/**
 * Single persistent WebGL context. Every section mounts a <View>
 * (scissored region) into this canvas — no multiple GL contexts.
 */
export default function Experience({
  source,
}: {
  source: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        eventSource={source as React.RefObject<HTMLElement>}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ fov: 45, position: [0, 0, 8], near: 0.1, far: 160 }}
      >
        <Suspense fallback={null}>
          <View.Port />
        </Suspense>
      </Canvas>
    </div>
  );
}
