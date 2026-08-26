"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { S, POINTER, isMobile } from "@/lib/state";
import { segment } from "@/lib/utils";
import StudioEnv from "../StudioEnv";

/* ------------------------------------------------------------------ */
/* FadeSlot — shows/hides its child based on which service segment     */
/* is active. Pure function of scroll progress → scrub-safe both ways. */
/* ------------------------------------------------------------------ */

function FadeSlot({
  order,
  total,
  children,
}: {
  order: number;
  total: number;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const { idx, frac } = segment(S.services.p, total);

    let s = 0;
    if (order === idx) s = 1 - frac;
    else if (order === idx + 1) s = frac;

    if (s <= 0.001) {
      g.visible = false;
      return;
    }
    g.visible = true;

    const e = s * s * (3 - 2 * s);
    const outDir = order === idx ? 1 : -1;
    g.scale.setScalar(0.001 + e * 0.999);
    g.rotation.y = (1 - e) * Math.PI * 0.75 * outDir + state.clock.elapsedTime * 0.12;
    g.position.y = (1 - e) * -0.7;
  });

  return <group ref={group}>{children}</group>;
}

/* ------------------------------- objects ------------------------------- */

function DeviceObject() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = Math.sin(t * 0.8) * 0.15;
    ref.current.rotation.z = Math.sin(t * 0.5) * 0.04;
  });
  return (
    <group ref={ref} rotation={[0.1, -0.5, 0]}>
      <RoundedBox args={[2.6, 1.65, 0.14]} radius={0.06} smoothness={4}>
        <meshStandardMaterial color="#17181d" metalness={0.9} roughness={0.32} />
      </RoundedBox>
      <mesh position={[0, 0, 0.078]}>
        <planeGeometry args={[2.36, 1.4]} />
        <meshStandardMaterial
          color="#0a1030"
          emissive="#7fb2ff"
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.2}
        />
      </mesh>
      {/* screen content hint */}
      <mesh position={[-0.55, 0.32, 0.082]}>
        <planeGeometry args={[0.9, 0.09]} />
        <meshBasicMaterial color="#cfe4ff" />
      </mesh>
      <mesh position={[-0.55, 0.12, 0.082]}>
        <planeGeometry args={[1.4, 0.05]} />
        <meshBasicMaterial color="#4a6fae" />
      </mesh>
      <mesh position={[-0.55, -0.04, 0.082]}>
        <planeGeometry args={[1.1, 0.05]} />
        <meshBasicMaterial color="#4a6fae" />
      </mesh>
      <mesh position={[0.72, -0.28, 0.082]}>
        <circleGeometry args={[0.16, 24]} />
        <meshBasicMaterial color="#ff4d00" />
      </mesh>
    </group>
  );
}

function NetworkObject() {
  const group = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { linesGeo, instanced } = useMemo(() => {
    const N = isMobile() ? 18 : 26;
    const nodes: THREE.Vector3[] = [];
    const rand = (i: number) => {
      const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
      return s - Math.floor(s);
    };
    for (let i = 0; i < N; i++) {
      const v = new THREE.Vector3(
        rand(i * 3) * 2 - 1,
        rand(i * 3 + 1) * 2 - 1,
        rand(i * 3 + 2) * 2 - 1
      )
        .normalize()
        .multiplyScalar(0.7 + rand(i * 7) * 0.85);
      nodes.push(v);
    }

    const nodeGeo = new THREE.SphereGeometry(0.07, 12, 12);
    const instanced = new THREE.InstancedMesh(
      nodeGeo,
      new THREE.MeshStandardMaterial({
        color: "#e8ecf4",
        metalness: 0.9,
        roughness: 0.25,
        emissive: "#5a70a8",
        emissiveIntensity: 0.25,
      }),
      N
    );
    const m = new THREE.Matrix4();
    nodes.forEach((v, i) => {
      m.setPosition(v);
      instanced.setMatrixAt(i, m);
    });

    const linePts: number[] = [];
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 1.05) {
          linePts.push(nodes[i].x, nodes[i].y, nodes[i].z);
          linePts.push(nodes[j].x, nodes[j].y, nodes[j].z);
        }
      }
    }
    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(linePts, 3)
    );

    return { linesGeo, instanced };
  }, []);

  useFrame((state, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.18;
    group.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.3) * 0.12;
    if (linesRef.current) {
      const mat = linesRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.22 + Math.sin(state.clock.elapsedTime * 2.2) * 0.08;
    }
  });

  return (
    <group ref={group}>
      <primitive object={instanced} />
      <lineSegments ref={linesRef} geometry={linesGeo}>
        <lineBasicMaterial color="#9db4e8" transparent opacity={0.25} />
      </lineSegments>
    </group>
  );
}

function GlobeObject() {
  const group = useRef<THREE.Group>(null);

  const pointsGeo = useMemo(() => {
    const N = 420;
    const arr = new Float32Array(N * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      arr[i * 3] = Math.cos(th) * r * 1.38;
      arr[i * 3 + 1] = y * 1.38;
      arr[i * 3 + 2] = Math.sin(th) * r * 1.38;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return geo;
  }, []);

  useFrame((state, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.16;
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.35, 2]} />
        <meshStandardMaterial
          color="#10131a"
          metalness={0.7}
          roughness={0.45}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.36, 3]} />
        <meshBasicMaterial color="#5f6b80" wireframe transparent opacity={0.35} />
      </mesh>
      <points geometry={pointsGeo}>
        <pointsMaterial color="#a8f0c0" size={0.028} sizeAttenuation />
      </points>
      <mesh rotation={[Math.PI / 2.3, 0.3, 0]}>
        <torusGeometry args={[1.95, 0.006, 8, 100]} />
        <meshBasicMaterial color="#86efac" transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 1.8, -0.5, 0.4]}>
        <torusGeometry args={[2.2, 0.006, 8, 100]} />
        <meshBasicMaterial color="#86efac" transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

function AssetObject() {
  const crystal = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (crystal.current) {
      crystal.current.rotation.y += dt * 0.5;
      crystal.current.position.y = Math.sin(t * 1.1) * 0.12;
    }
    if (ring.current) {
      ring.current.rotation.z += dt * 0.4;
    }
  });

  return (
    <group>
      <mesh ref={crystal} scale={[1, 1.5, 1]}>
        <octahedronGeometry args={[1.02, 0]} />
        <meshStandardMaterial
          color="#dfe3ea"
          metalness={0.95}
          roughness={0.15}
          flatShading
        />
      </mesh>
      <group ref={ring} rotation={[Math.PI / 2.2, 0, 0]}>
        <mesh>
          <torusGeometry args={[1.75, 0.015, 8, 100]} />
          <meshBasicMaterial color="#ff4d00" transparent opacity={0.55} />
        </mesh>
        <mesh position={[1.75, 0, 0]}>
          <tetrahedronGeometry args={[0.12]} />
          <meshBasicMaterial color="#ff8a50" />
        </mesh>
      </group>
    </group>
  );
}

/* --------------------------------- rig --------------------------------- */

function CameraRig() {
  const look = useRef(new THREE.Vector3());
  useFrame((state, dt) => {
    const cam = state.camera as THREE.PerspectiveCamera;
    const targetZ = 7 - S.services.p * 0.6;
    cam.position.z += (targetZ - cam.position.z) * Math.min(1, dt * 2);
    cam.position.x +=
      (POINTER.x * 0.3 - cam.position.x) * Math.min(1, dt * 2);
    cam.position.y +=
      (-POINTER.y * 0.2 - cam.position.y) * Math.min(1, dt * 2);
    look.current.set(0, 0, 0);
    cam.lookAt(look.current);
  });
  return null;
}

export default function ServicesScene() {
  return (
    <>
      {/* own camera — never shares state with other views */}
      <PerspectiveCamera makeDefault fov={45} position={[0, 0, 7]} near={0.1} far={60} />
      <StudioEnv />
      <CameraRig />
      <FadeSlot order={0} total={4}>
        <DeviceObject />
      </FadeSlot>
      <FadeSlot order={1} total={4}>
        <NetworkObject />
      </FadeSlot>
      <FadeSlot order={2} total={4}>
        <GlobeObject />
      </FadeSlot>
      <FadeSlot order={3} total={4}>
        <AssetObject />
      </FadeSlot>
    </>
  );
}
