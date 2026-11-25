"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { S, POINTER, isMobile } from "@/lib/state";
import { plateau, sampleTextPoints } from "@/lib/utils";

const WORDS = ["GOAGRI", "LUWES", "RAJADEREK", "AVATAR", "GENSET", "CASANELA", "ROUTER"];

const VERT = /* glsl */ `
  attribute vec3 aP0;
  attribute vec3 aP1;
  attribute vec3 aP2;
  attribute vec3 aP3;
  attribute vec3 aP4;
  attribute vec3 aP5;
  attribute vec3 aP6;
  attribute float aRand;

  uniform float uProgress; // 0..6
  uniform float uTime;
  uniform vec2 uMouse;      // cursor in local particle world coords
  uniform float uMouseForce; // 0..1 smooth strength

  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float g = clamp(uProgress, 0.0, 6.0);

    // chained segment blends (no dynamic attribute indexing in GLSL ES)
    vec3 pos = mix(aP0, aP1, clamp(g, 0.0, 1.0));
    pos = mix(pos, aP2, clamp(g - 1.0, 0.0, 1.0));
    pos = mix(pos, aP3, clamp(g - 2.0, 0.0, 1.0));
    pos = mix(pos, aP4, clamp(g - 3.0, 0.0, 1.0));
    pos = mix(pos, aP5, clamp(g - 4.0, 0.0, 1.0));
    pos = mix(pos, aP6, clamp(g - 5.0, 0.0, 1.0));

    // disciplined palette transitions anchored to warm ink + accent orange
    vec3 c = mix(vec3(0.95, 0.94, 0.92), vec3(1.0, 0.35, 0.05), clamp(g, 0.0, 1.0));
    c = mix(c, vec3(0.85, 0.88, 0.95), clamp(g - 1.0, 0.0, 1.0));
    c = mix(c, vec3(1.0, 0.45, 0.2), clamp(g - 2.0, 0.0, 1.0));
    c = mix(c, vec3(0.92, 0.92, 0.95), clamp(g - 3.0, 0.0, 1.0));
    c = mix(c, vec3(1.0, 0.55, 0.25), clamp(g - 4.0, 0.0, 1.0));
    c = mix(c, vec3(0.95, 0.94, 0.92), clamp(g - 5.0, 0.0, 1.0));
    vColor = c;

    // mid-transition scatter ("break into particles")
    float tr = fract(g);
    float scatter = sin(tr * 3.14159265);
    vec3 dir = normalize(vec3(
      sin(aRand * 17.0),
      cos(aRand * 23.0),
      sin(aRand * 29.0 + 2.0)
    ));
    pos += dir * scatter * (1.8 + 4.5 * aRand) * 0.55;

    // gentle breathing so the cloud never looks frozen
    pos.y += sin(uTime * 0.7 + aRand * 40.0) * 0.03;

    // interactive blackhole / galaxy vortex (soft inward spiral around cursor)
    vec2 toParticle = pos.xy - uMouse;
    float dist = length(toParticle);
    float radius = 2.0;
    if (dist < radius && uMouseForce > 0.001) {
      float falloff = smoothstep(radius, 0.0, dist);
      float strength = falloff * falloff * uMouseForce;

      // spiral rotation around cursor (faster closer to the core, like a galaxy)
      float angle = strength * (2.2 + 0.5 * aRand) + strength * uTime * 0.6;
      float cs = cos(angle);
      float sn = sin(angle);
      vec2 rotated = vec2(
        toParticle.x * cs - toParticle.y * sn,
        toParticle.x * sn + toParticle.y * cs
      );

      // gentle gravitational pull inward while preserving a small event-horizon core
      float targetDist = max(0.14, dist * (1.0 - 0.58 * strength));
      vec2 swirled = dist > 0.001 ? normalize(rotated) * targetDist : rotated;
      pos.xy = uMouse + mix(toParticle, swirled, uMouseForce);

      // subtle gravity well depth + warm accretion rim glow
      pos.z -= strength * 0.65;
      float rim = smoothstep(0.12, 0.45, dist) * smoothstep(1.2, 0.35, dist);
      vColor = mix(vColor, vec3(1.0, 0.42, 0.1), (rim * 0.55 + strength * 0.35) * uMouseForce);
    }

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (20.0 + 34.0 * aRand) / -mv.z;
    gl_Position = projectionMatrix * mv;

    vAlpha = 0.75 + 0.25 * sin(uTime * 1.4 + aRand * 80.0);
  }
`;

const FRAG = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.08, d) * vAlpha;
    gl_FragColor = vec4(vColor, a);
  }
`;

export default function WorkParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const COUNT = isMobile() ? 2600 : 6000;

  // fit the wordmark to the viewport: visible width at z=9, fov 40
  const WORLD_W = useMemo(() => {
    const aspect = window.innerWidth / window.innerHeight;
    return Math.min(8.6, 6.55 * aspect * 0.92);
  }, []);

  const geometry = useMemo(() => {
    const targets = WORDS.map((w) => sampleTextPoints(w, COUNT, WORLD_W));
    const rand = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
      rand[i] = s - Math.floor(s);
    }

    const geo = new THREE.BufferGeometry();
    const names = ["aP0", "aP1", "aP2", "aP3", "aP4", "aP5", "aP6"];
    targets.forEach((t, i) =>
      geo.setAttribute(names[i], new THREE.BufferAttribute(t, 3))
    );
    geo.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    // three.js needs a `position` attribute for draw count + bounds,
    // even though the shader derives position from aP0..aP3
    geo.setAttribute("position", new THREE.BufferAttribute(targets[0].slice(), 3));
    return geo;
  }, [COUNT, WORLD_W]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uProgress: { value: 0 },
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(99, 99) },
          uMouseForce: { value: 0 },
        },
      }),
    []
  );
  const matRef = useRef(material);
  const ndcRef = useRef({ x: 99, y: 99, active: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      ndcRef.current.x = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
      ndcRef.current.y = -((e.clientY / Math.max(1, window.innerHeight)) * 2 - 1);
      ndcRef.current.active = 1;
    };
    const onLeave = () => {
      ndcRef.current.active = 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  useFrame((state, dt) => {
    matRef.current.uniforms.uTime.value += dt;
    matRef.current.uniforms.uProgress.value = plateau(S.work.p, WORDS.length);

    // map WebGL NDC (-1..1, +1 top) into particle local space at z=0, fov=40, cam z=9, group y=1.85
    const aspect = state.size.width / Math.max(1, state.size.height);
    const halfH = Math.tan(THREE.MathUtils.degToRad(20)) * 9;
    const targetX = ndcRef.current.x * halfH * aspect;
    const targetY = ndcRef.current.y * halfH - 1.85;
    const uMouse = matRef.current.uniforms.uMouse.value as THREE.Vector2;
    uMouse.x += (targetX - uMouse.x) * Math.min(1, dt * 7);
    uMouse.y += (targetY - uMouse.y) * Math.min(1, dt * 7);

    matRef.current.uniforms.uMouseForce.value +=
      (ndcRef.current.active - matRef.current.uniforms.uMouseForce.value) * Math.min(1, dt * 6);

    if (pointsRef.current) {
      pointsRef.current.rotation.x +=
        (-POINTER.y * 0.06 - pointsRef.current.rotation.x) *
        Math.min(1, dt * 2);
      pointsRef.current.rotation.y +=
        (POINTER.x * 0.1 - pointsRef.current.rotation.y) *
        Math.min(1, dt * 2);
    }
  });

  return (
    <>
      {/* own camera — never shares state with other views */}
      <PerspectiveCamera makeDefault fov={40} position={[0, 0, 9]} near={0.1} far={60} />
      <ambientLight intensity={1} />
      <points ref={pointsRef} geometry={geometry} frustumCulled={false} position={[0, 1.85, 0]}>
        <primitive object={material} attach="material" />
      </points>
    </>
  );
}
