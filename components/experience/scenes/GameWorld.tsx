"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { S, POINTER, isMobile } from "@/lib/state";
import { clamp01, fbm } from "@/lib/utils";

/* ------------------------------ terrain ------------------------------ */

function useTerrainGeometry() {
  return useMemo(() => {
    const SIZE = 90;
    const SEG = isMobile() ? 90 : 140;
    const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEG, SEG);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      // valley corridor along the flight path (x ≈ 0)
      const corridor = THREE.MathUtils.smoothstep(Math.abs(x), 2.5, 12);
      const h = (fbm(x * 0.055 + 10, z * 0.055 + 10, 4) - 0.35) * 9 * corridor;
      pos.setY(i, h);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);
}

function Terrain() {
  const geo = useTerrainGeometry();
  return (
    <>
      <mesh geometry={geo}>
        <meshStandardMaterial color="#171b23" roughness={0.9} metalness={0.05} flatShading />
      </mesh>
      <mesh geometry={geo} position={[0, 0.04, 0]}>
        <meshBasicMaterial
          color="#ff4d00"
          wireframe
          transparent
          opacity={0.09}
        />
      </mesh>
    </>
  );
}

function Rocks() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const placed = useRef(false);

  useFrame(() => {
    if (!ref.current || placed.current) return;
    placed.current = true;
    const N = isMobile() ? 40 : 80;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const s = new THREE.Vector3();
    const p = new THREE.Vector3();
    for (let i = 0; i < N; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      p.set(
        side * (5 + Math.random() * 18),
        -0.6 + Math.random() * 2,
        20 - Math.random() * 55
      );
      e.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      q.setFromEuler(e);
      const sc = 0.3 + Math.random() * 1.8;
      s.set(sc, sc * (0.7 + Math.random()), sc);
      m.compose(p, q, s);
      ref.current.setMatrixAt(i, m);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  const count = isMobile() ? 40 : 80;
  return (
    <instancedMesh ref={ref} args={[undefined!, undefined!, count]}>
      <coneGeometry args={[0.55, 1.4, 5]} />
      <meshStandardMaterial color="#1a1e26" roughness={0.9} flatShading />
    </instancedMesh>
  );
}

/* --------------------------- horizon + dust --------------------------- */

function HorizonGlow() {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(128, 118, 8, 128, 118, 120);
    g.addColorStop(0, "rgba(255,110,40,0.85)");
    g.addColorStop(0.45, "rgba(255,77,0,0.28)");
    g.addColorStop(1, "rgba(255,77,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 128);
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }, []);

  return (
    <mesh position={[0, 5, -46]}>
      <planeGeometry args={[130, 34]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={1}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        fog={false}
      />
    </mesh>
  );
}

function Dust() {
  const ref = useRef<THREE.Points>(null);

  const { geo, velocities } = useMemo(() => {
    const N = isMobile() ? 350 : 750;
    const arr = new Float32Array(N * 3);
    const vel = new Float32Array(N);
    const rand = (i: number) => {
      const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
      return s - Math.floor(s);
    };
    for (let i = 0; i < N; i++) {
      arr[i * 3] = (rand(i) - 0.5) * 44;
      arr[i * 3 + 1] = rand(i + N) * 11;
      arr[i * 3 + 2] = 18 - rand(i + N * 2) * 60;
      vel[i] = 0.15 + rand(i + N * 3) * 0.4;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return { geo, velocities: vel };
  }, []);

  useFrame((state, dt) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < pos.count; i++) {
      let y = pos.getY(i) + velocities[i] * dt * 0.6;
      if (y > 11.5) y = 0;
      pos.setY(i, y);
      pos.setX(i, pos.getX(i) + Math.sin(t * 0.4 + i) * dt * 0.08);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color="#ffb27d"
        size={0.05}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/* ------------------------------- camera ------------------------------- */

function FlyRig() {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 7.5, 17),
        new THREE.Vector3(1.5, 6, 8),
        new THREE.Vector3(-1, 5, 0),
        new THREE.Vector3(1, 4, -8),
        new THREE.Vector3(0, 3.4, -15),
      ]),
    []
  );
  const look = useRef(new THREE.Vector3());

  useFrame((state, dt) => {
    const cam = state.camera as THREE.PerspectiveCamera;
    const p = clamp01(S.game.p);
    const pos = curve.getPoint(p);
    const ahead = curve.getPoint(Math.min(p + 0.12, 1));

    cam.position.lerp(pos, Math.min(1, dt * 6));
    cam.position.x += POINTER.x * 0.35;
    look.current.set(ahead.x, ahead.y - 0.7, ahead.z);
    cam.lookAt(look.current);
  });

  return null;
}

export default function GameWorld() {
  return (
    <>
      {/* own camera — never shares state with other views */}
      <PerspectiveCamera makeDefault fov={55} position={[0, 7.5, 17]} near={0.1} far={160} />
      <fogExp2 attach="fog" args={["#07080a", 0.042]} />
      <color attach="background" args={["#07080a"]} />
      <ambientLight intensity={0.45} color="#8fa3c8" />
      <directionalLight position={[-6, 10, 4]} intensity={1.7} color="#ffd9c0" />
      <FlyRig />
      <Terrain />
      <Rocks />
      <HorizonGlow />
      <Dust />
    </>
  );
}
