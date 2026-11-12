"use client";

import { Html, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { BLOCKS, RADIAL_ANGLES, RADII, type BlockDef } from "./cpLayout";

const COLORS = {
  sky: "#1b1035",
  ground: "#2a2440",
  road: "#3a3550",
  roadLine: "#e9d38a",
  park: "#3fae6a",
  parkPath: "#d9c9a3",
  building: "#f4efe6",
  roof: "#d8d0c2",
  arcade: "#ffd9a0",
  inCp: "#22e07a",
  visiting: "#4aa8ff",
  saffron: "#ff9933",
  green: "#138808",
  navy: "#000080",
};

/** An annular sector (a slice of a ring) on the ground, extruded upward. */
function sectorGeometry(r0: number, r1: number, a0: number, a1: number, height: number) {
  const steps = 24;
  const shape = new THREE.Shape();
  for (let i = 0; i <= steps; i++) {
    const a = a0 + ((a1 - a0) * i) / steps;
    const [x, y] = [r1 * Math.cos(a), -r1 * Math.sin(a)];
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  for (let i = steps; i >= 0; i--) {
    const a = a0 + ((a1 - a0) * i) / steps;
    shape.lineTo(r0 * Math.cos(a), -r0 * Math.sin(a));
  }
  const geo = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false });
  geo.rotateX(-Math.PI / 2);
  return geo;
}

function Block({ block }: { block: BlockDef }) {
  const { r0, r1 } = block.ring === "inner" ? RADII.innerBlock : RADII.outerBlock;
  const body = useMemo(() => sectorGeometry(r0, r1, block.start, block.end, 9), [r0, r1, block]);
  const roof = useMemo(
    () => sectorGeometry(r0 - 3, r1 + 0.6, block.start, block.end, 0.8),
    [r0, r1, block],
  );
  const glow = useMemo(
    () => sectorGeometry(r0 - 0.2, r0 + 0.1, block.start + 0.01, block.end - 0.01, 5.5),
    [r0, block],
  );
  const mid = (block.start + block.end) / 2;
  const labelR = (r0 + r1) / 2;

  return (
    <group>
      <mesh geometry={body} castShadow receiveShadow>
        <meshStandardMaterial color={COLORS.building} roughness={0.85} />
      </mesh>
      <mesh geometry={roof} position={[0, 6, 0]}>
        <meshStandardMaterial color={COLORS.roof} roughness={0.9} />
      </mesh>
      <mesh geometry={glow}>
        <meshStandardMaterial color={COLORS.arcade} emissive={COLORS.arcade} emissiveIntensity={0.6} />
      </mesh>
      <Html
        position={[labelR * Math.cos(mid), 13, labelR * Math.sin(mid)]}
        center
        zIndexRange={[10, 0]}
        className="pointer-events-none select-none"
      >
        <span className="block-tag">{block.letter}</span>
      </Html>
    </group>
  );
}

/** White Georgian colonnade pillars along the inner face of every block. */
function Colonnades() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const positions = useMemo(() => {
    const out: [number, number][] = [];
    for (const b of BLOCKS) {
      const { r0 } = b.ring === "inner" ? RADII.innerBlock : RADII.outerBlock;
      const r = r0 - 2.6;
      const count = Math.floor(((b.end - b.start) * r) / 3.2);
      for (let i = 0; i <= count; i++) {
        const a = b.start + ((b.end - b.start) * i) / count;
        out.push([r * Math.cos(a), r * Math.sin(a)]);
      }
    }
    return out;
  }, []);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    positions.forEach(([x, z], i) => {
      m.setPosition(x, 3, z);
      ref.current?.setMatrixAt(i, m);
    });
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
  }, [positions]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, positions.length]} castShadow>
      <cylinderGeometry args={[0.45, 0.55, 6, 8]} />
      <meshStandardMaterial color="#ffffff" roughness={0.6} />
    </instancedMesh>
  );
}

function Roads() {
  return (
    <group position={[0, 0.02, 0]}>
      {[
        [RADII.park, RADII.innerBlock.r0 - 3],
        [RADII.innerBlock.r1, RADII.outerBlock.r0 - 3],
        [RADII.outerBlock.r1, RADII.outerRoad + 6],
      ].map(([a, b]) => (
        <mesh key={a} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[a, b, 96]} />
          <meshStandardMaterial color={COLORS.road} roughness={1} />
        </mesh>
      ))}
      {RADIAL_ANGLES.map((a) => (
        <mesh
          key={a}
          rotation={[-Math.PI / 2, 0, -a]}
          position={[Math.cos(a) * 68, 0.01, Math.sin(a) * 68]}
        >
          <planeGeometry args={[70, 7]} />
          <meshStandardMaterial color={COLORS.road} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function CentralPark() {
  const trees = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const a = (i / 22) * Math.PI * 2;
        const r = RADII.park - 4 - (i % 2) * 3;
        return [r * Math.cos(a), r * Math.sin(a), 0.8 + (i % 3) * 0.25] as const;
      }),
    [],
  );
  const flag = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (flag.current) flag.current.rotation.y = Math.sin(clock.elapsedTime * 0.6) * 0.15;
  });

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.05, 0]} receiveShadow>
        <circleGeometry args={[RADII.park, 64]} />
        <meshStandardMaterial color={COLORS.park} roughness={1} />
      </mesh>
      {[0, Math.PI / 2].map((rot) => (
        <mesh key={rot} rotation={[-Math.PI / 2, 0, rot]} position={[0, 0.08, 0]}>
          <planeGeometry args={[RADII.park * 2 - 2, 2.2]} />
          <meshStandardMaterial color={COLORS.parkPath} />
        </mesh>
      ))}
      {/* fountain */}
      <mesh position={[14, 0.6, 14]}>
        <cylinderGeometry args={[4, 4.4, 1.2, 32]} />
        <meshStandardMaterial color="#5fd3ff" emissive="#1a7fb0" emissiveIntensity={0.5} />
      </mesh>
      {trees.map(([x, z, s], i) => (
        <group key={i} position={[x, 0, z]} scale={s}>
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.3, 0.4, 3, 6]} />
            <meshStandardMaterial color="#6b4a2f" />
          </mesh>
          <mesh position={[0, 4.4, 0]} castShadow>
            <icosahedronGeometry args={[2.4, 0]} />
            <meshStandardMaterial color="#2f8f52" flatShading />
          </mesh>
        </group>
      ))}
      {/* the giant tricolour */}
      <mesh position={[0, 18, 0]}>
        <cylinderGeometry args={[0.35, 0.5, 36, 12]} />
        <meshStandardMaterial color="#cfcfcf" metalness={0.6} roughness={0.3} />
      </mesh>
      <group ref={flag} position={[0, 32, 0]}>
        {[COLORS.saffron, "#ffffff", COLORS.green].map((c, i) => (
          <mesh key={c} position={[5, 2 - i * 2, 0]}>
            <boxGeometry args={[10, 2, 0.15]} />
            <meshStandardMaterial color={c} side={THREE.DoubleSide} />
          </mesh>
        ))}
        <mesh position={[5, 0, 0.1]}>
          <torusGeometry args={[0.7, 0.1, 6, 24]} />
          <meshStandardMaterial color={COLORS.navy} />
        </mesh>
      </group>
    </group>
  );
}

type Walker = { r: number; a0: number; speed: number; color: string; inCp: boolean; bob: number };

function Avatar({ walker }: { walker: Walker }) {
  const ref = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const a = walker.a0 + t * walker.speed;
    if (ref.current) {
      ref.current.position.set(walker.r * Math.cos(a), Math.abs(Math.sin(t * 6 + walker.bob)) * 0.3, walker.r * Math.sin(a));
      ref.current.rotation.y = -a - Math.sign(walker.speed) * Math.PI / 2 + Math.PI;
    }
    if (ringRef.current) {
      const s = 1 + Math.sin(t * 3 + walker.bob) * 0.12;
      ringRef.current.scale.set(s, s, s);
    }
  });
  const ringColor = walker.inCp ? COLORS.inCp : COLORS.visiting;
  return (
    <group ref={ref}>
      <mesh ref={ringRef} rotation-x={-Math.PI / 2} position={[0, 0.12, 0]}>
        <ringGeometry args={[1.3, 1.8, 32]} />
        <meshBasicMaterial color={ringColor} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 1.8, 0]} castShadow>
        <capsuleGeometry args={[0.8, 1.6, 4, 12]} />
        <meshStandardMaterial color={walker.color} roughness={0.5} />
      </mesh>
      <mesh position={[0, 3.9, 0]}>
        <sphereGeometry args={[0.75, 16, 16]} />
        <meshStandardMaterial color="#c68b59" roughness={0.6} />
      </mesh>
    </group>
  );
}

const OUTFITS = ["#ff5fa2", "#ffd23f", "#7b5cff", "#00d1b2", "#ff7a3d", "#ffffff", "#111111"];

function Crowd() {
  const walkers = useMemo<Walker[]>(() => {
    const lanes = [RADII.park - 10, RADII.park - 2, RADII.innerBlock.r0 - 1.5, RADII.middleRoad - 2, RADII.outerBlock.r0 - 1.5];
    return Array.from({ length: 26 }, (_, i) => ({
      r: lanes[i % lanes.length],
      a0: (i * 2.399) % (Math.PI * 2),
      speed: (i % 2 ? 1 : -1) * (0.03 + (i % 5) * 0.008),
      color: OUTFITS[i % OUTFITS.length],
      inCp: i % 3 !== 0,
      bob: i,
    }));
  }, []);
  return (
    <>
      {walkers.map((w, i) => (
        <Avatar key={i} walker={w} />
      ))}
    </>
  );
}

export default function CPScene({ interactive = false }: { interactive?: boolean }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [0, 95, 140], fov: 42, near: 1, far: 800 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={[COLORS.sky]} />
      <fog attach="fog" args={[COLORS.sky, 180, 380]} />
      <hemisphereLight args={["#ffd6f0", "#2a2440", 0.9]} />
      <directionalLight
        position={[80, 120, 40]}
        intensity={1.6}
        color="#ffe2c4"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-110}
        shadow-camera-right={110}
        shadow-camera-top={110}
        shadow-camera-bottom={-110}
      />
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[260, 64]} />
        <meshStandardMaterial color={COLORS.ground} roughness={1} />
      </mesh>
      <Roads />
      <CentralPark />
      {BLOCKS.map((b) => (
        <Block key={b.letter} block={b} />
      ))}
      <Colonnades />
      <Crowd />
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.5}
        enablePan={false}
        enableZoom={interactive}
        minDistance={60}
        maxDistance={220}
        maxPolarAngle={Math.PI / 2.3}
        enableDamping
      />
    </Canvas>
  );
}
