"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { S } from "@/lib/state";
import { clamp01, smoothstep, easeInOut, fbm } from "@/lib/utils";
import StudioEnv from "../StudioEnv";

const LOGO_URL = "/assets/3d/logo-3d.glb";

/* --------------------------- piece geometries --------------------------- */

function EnginePiece() {
  const teeth = useMemo(() => {
    const arr: { pos: [number, number, number]; rot: number }[] = [];
    const N = 10;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      arr.push({
        pos: [Math.cos(a) * 0.82, Math.sin(a) * 0.82, 0],
        rot: a,
      });
    }
    return arr;
  }, []);

  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh>
        <torusGeometry args={[0.62, 0.16, 16, 48]} />
        <ChromeMat />
      </mesh>
      {teeth.map((t, i) => (
        <mesh key={i} position={t.pos} rotation={[0, 0, t.rot]}>
          <boxGeometry args={[0.18, 0.1, 0.22]} />
          <ChromeMat />
        </mesh>
      ))}
      <mesh>
        <cylinderGeometry args={[0.2, 0.2, 0.3, 24]} />
        <ChromeMat accent />
      </mesh>
    </group>
  );
}

function DesignPiece() {
  const L = 0.75;
  const corners: [number, number][] = [
    [-L, L],
    [L, L],
    [L, -L],
    [-L, -L],
  ];
  return (
    <group>
      {corners.map(([x, y], i) => (
        <group key={i} position={[x, y, 0]}>
          <mesh>
            <boxGeometry args={[0.5, 0.09, 0.09]} />
            <ChromeMat />
          </mesh>
          <mesh position={[x > 0 ? -0.205 : 0.205, y > 0 ? -0.295 : 0.295, 0]}>
            <boxGeometry args={[0.09, 0.5, 0.09]} />
            <ChromeMat />
          </mesh>
        </group>
      ))}
      <mesh>
        <torusGeometry args={[0.28, 0.02, 8, 64]} />
        <ChromeMat accent />
      </mesh>
    </group>
  );
}

function AIPiece() {
  const core = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (core.current) {
      const m = core.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity =
        0.7 + Math.sin(state.clock.elapsedTime * 3) * 0.35;
    }
  });

  const pins = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < 6; i++) {
      const v = -0.5 + (i / 5) * 1.0;
      arr.push([v, 0.62, 0]);
      arr.push([v, -0.62, 0]);
      arr.push([0.62, v, 0]);
      arr.push([-0.62, v, 0]);
    }
    return arr;
  }, []);

  return (
    <group>
      <mesh>
        <boxGeometry args={[1.0, 1.0, 0.14]} />
        <ChromeMat />
      </mesh>
      {pins.map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry
            args={
              Math.abs(p[0]) > Math.abs(p[1]) ? [0.05, 0.16, 0.08] : [0.16, 0.05, 0.08]
            }
          />
          <ChromeMat />
        </mesh>
      ))}
      <mesh ref={core} position={[0, 0, 0.1]}>
        <sphereGeometry args={[0.22, 20, 20]} />
        <meshStandardMaterial
          color="#ffb27d"
          emissive="#ff4d00"
          emissiveIntensity={0.8}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>
    </group>
  );
}

function SpatialPiece() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(1.7, 1.7, 26, 26);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(i, (fbm(x * 1.4 + 40, z * 1.4 + 40, 3) - 0.4) * 0.9);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <group>
      <mesh geometry={geo}>
        <ChromeMat flat />
      </mesh>
      <mesh geometry={geo} scale={[1, -1, 1]} position={[0, 0.03, 0]}>
        <meshBasicMaterial color="#86efac" wireframe transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

function GamePiece() {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((state, dt) => {
    if (ring.current) ring.current.rotation.z += dt * 0.8;
  });
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.45, 32, 32]} />
        <ChromeMat />
      </mesh>
      <mesh ref={ring} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[0.78, 0.03, 12, 64]} />
        <ChromeMat accent />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[Math.cos((i / 3) * Math.PI * 2) * 1.05, 0, Math.sin((i / 3) * Math.PI * 2) * 1.05]}>
          <tetrahedronGeometry args={[0.13]} />
          <ChromeMat />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------ materials ------------------------------ */

function ChromeMat({
  accent = false,
  flat = false,
}: {
  accent?: boolean;
  flat?: boolean;
} = {}) {
  if (accent) {
    return (
      <meshStandardMaterial
        color="#ff8a50"
        emissive="#ff4d00"
        emissiveIntensity={0.4}
        metalness={0.85}
        roughness={0.25}
        flatShading={flat}
      />
    );
  }
  return (
    <meshPhysicalMaterial
      color="#dfe3ea"
      metalness={1}
      roughness={0.18}
      clearcoat={0.5}
      envMapIntensity={1.5}
      flatShading={flat}
    />
  );
}

/* ------------------------------- assembly ------------------------------- */

const PIECE_COUNT = 5;

function startPose(i: number) {
  const a = (i / PIECE_COUNT) * Math.PI * 2 + 0.55;
  return {
    pos: new THREE.Vector3(
      Math.cos(a) * 7.2,
      Math.sin(a * 1.7) * 2.4,
      Math.sin(a) * 5 - 2
    ),
    rot: new THREE.Euler(Math.sin(i * 9) * 1.4, Math.cos(i * 7) * 1.4, Math.sin(i * 5) * 1.2),
  };
}

function endPose(i: number) {
  const a = (i / PIECE_COUNT) * Math.PI * 2 - Math.PI / 2;
  return {
    pos: new THREE.Vector3(Math.cos(a) * 2.05, Math.sin(a) * 2.05 + 0.35, 0),
    rot: new THREE.Euler(0, 0, a + Math.PI / 2),
  };
}

export default function MachineAssembly() {
  const groups = useRef<(THREE.Group | null)[]>([]);
  const mark = useRef<THREE.Group>(null);
  const whole = useRef<THREE.Group>(null);

  const { scene } = useGLTF(LOGO_URL);
  const markModel = useMemo(() => scene.clone(true), [scene]);

  const poses = useMemo(
    () =>
      Array.from({ length: PIECE_COUNT }, (_, i) => ({
        start: startPose(i),
        end: endPose(i),
        qStart: new THREE.Quaternion().setFromEuler(startPose(i).rot),
        qEnd: new THREE.Quaternion().setFromEuler(endPose(i).rot),
      })),
    []
  );

  useFrame((state) => {
    const p = clamp01(S.machine.p);
    const t = state.clock.elapsedTime;

    groups.current.forEach((g, i) => {
      if (!g) return;
      const { start, end, qStart, qEnd } = poses[i];
      const local = smoothstep(i * 0.11, i * 0.11 + 0.6, p);
      const e = easeInOut(local);

      // swirl the scattered start pose around center while converging
      const swirl = (1 - e) * 2.6;
      const sp = start.pos.clone();
      sp.applyAxisAngle(new THREE.Vector3(0, 1, 0), swirl);
      sp.y += Math.sin(t * 0.8 + i * 2.1) * 0.25 * (1 - e);

      g.position.lerpVectors(sp, end.pos, e);
      g.quaternion.slerpQuaternions(qStart, qEnd, e);
      g.scale.setScalar(0.85 + 0.15 * e);
    });

    if (whole.current) {
      whole.current.rotation.y =
        Math.sin(t * 0.2) * 0.25 + (1 - smoothstep(0.5, 1, p)) * t * 0.15;
    }

    // central mark materializes at the end
    if (mark.current) {
      const tm = smoothstep(0.82, 1.0, p);
      const back = tm === 1 ? 1 : 1 - Math.pow(1 - tm, 3);
      mark.current.scale.setScalar(Math.max(0.001, back));
      mark.current.rotation.y = t * 0.4;
      mark.current.visible = tm > 0.01;
    }
  });

  return (
    <>
      <StudioEnv />
      <PerspectiveCamera makeDefault fov={42} position={[0, 0, 9]} near={0.1} far={60} />
      <group ref={whole}>
        {[EnginePiece, DesignPiece, AIPiece, SpatialPiece, GamePiece].map(
          (Piece, i) => (
            <group
              key={i}
              ref={(el) => {
                groups.current[i] = el;
              }}
            >
              <Piece />
            </group>
          )
        )}
        {/* final assembled mark — the real NOVA//LAB logo */}
        <group ref={mark} visible={false} position={[0, 0.35, 0]}>
          <primitive object={markModel} scale={0.85} />
        </group>
      </group>
    </>
  );
}

useGLTF.preload(LOGO_URL);
