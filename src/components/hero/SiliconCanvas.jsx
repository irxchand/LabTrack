import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  RotateCcw,
  Layers,
  Sparkles,
  Zap,
  ShieldCheck,
  Eye,
  Cpu,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// 1. Procedural High-Detail Circuit Textures (Gold Busses & Micro-Grid)
// ─────────────────────────────────────────────────────────────────────────────
function createCircuitTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Obsidian dark base
  ctx.fillStyle = '#0a0b0e';
  ctx.fillRect(0, 0, 512, 512);

  // Micro-circuit grid
  ctx.strokeStyle = 'rgba(201, 184, 160, 0.12)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= 512; x += 16) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y <= 512; y += 16) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  // Core Gold Data Bus Traces
  ctx.strokeStyle = '#c9b8a0';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = '#f5e6c8';
  ctx.shadowBlur = 6;

  // Concentric routing paths
  const paths = [
    [[64, 64], [128, 64], [192, 128], [192, 256]],
    [[448, 64], [384, 64], [320, 128], [320, 256]],
    [[64, 448], [128, 448], [192, 384], [192, 256]],
    [[448, 448], [384, 448], [320, 384], [320, 256]],
    [[256, 40], [256, 120]],
    [[256, 472], [256, 392]],
    [[40, 256], [120, 256]],
    [[472, 256], [392, 256]],
  ];

  paths.forEach((p) => {
    ctx.beginPath();
    ctx.moveTo(p[0][0], p[0][1]);
    for (let i = 1; i < p.length; i++) {
      ctx.lineTo(p[i][0], p[i][1]);
    }
    ctx.stroke();
  });

  // Gold Contact Pads
  ctx.fillStyle = '#f5e6c8';
  for (let x = 40; x < 500; x += 32) {
    ctx.beginPath();
    ctx.arc(x, 24, 3, 0, Math.PI * 2);
    ctx.arc(x, 488, 3, 0, Math.PI * 2);
    ctx.arc(24, x, 3, 0, Math.PI * 2);
    ctx.arc(488, x, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Exploded 3D Silicon Multi-Layer Assembly
// ─────────────────────────────────────────────────────────────────────────────
function ExplodedNeuralProcessor({ isExploded, showAnnotations }) {
  const groupRef = useRef();
  const circuitTex = useMemo(() => createCircuitTexture(), []);

  // Multi-tier Z separation positions (interpolated smoothly)
  const layer1Z = useRef(0);
  const layer2Z = useRef(0.12);
  const layer3Z = useRef(0.24);
  const layer4Z = useRef(0.36);

  useFrame(() => {
    const target1 = isExploded ? -0.4 : 0;
    const target2 = isExploded ? 0.05 : 0.08;
    const target3 = isExploded ? 0.55 : 0.16;
    const target4 = isExploded ? 1.05 : 0.24;

    layer1Z.current = THREE.MathUtils.lerp(layer1Z.current, target1, 0.08);
    layer2Z.current = THREE.MathUtils.lerp(layer2Z.current, target2, 0.08);
    layer3Z.current = THREE.MathUtils.lerp(layer3Z.current, target3, 0.08);
    layer4Z.current = THREE.MathUtils.lerp(layer4Z.current, target4, 0.08);
  });

  return (
    <group ref={groupRef}>
      {/* ───────────────────────────────────────────────────────────────── */}
      {/* LAYER 1: Base Ceramic PCB & 2,400 BGA Gold Pin Array */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <group position={[0, 0, layer1Z.current]}>
        {/* Main Base Carrier */}
        <mesh receiveShadow castShadow>
          <boxGeometry args={[3.2, 3.2, 0.12]} />
          <meshStandardMaterial
            color="#0b0c10"
            roughness={0.35}
            metalness={0.65}
            map={circuitTex}
          />
        </mesh>

        {/* Outer Perimeter Gold Edge Connectors */}
        {[-1.5, 1.5].map((x, idx) => (
          <mesh key={`connector-${idx}`} position={[x, 0, 0]}>
            <boxGeometry args={[0.06, 2.8, 0.13]} />
            <meshStandardMaterial
              color="#c9b8a0"
              metalness={0.95}
              roughness={0.15}
            />
          </mesh>
        ))}

        {/* Bottom Gold BGA Pin Array Representation */}
        <mesh position={[0, 0, -0.07]}>
          <boxGeometry args={[2.8, 2.8, 0.02]} />
          <meshStandardMaterial
            color="#e2d0b5"
            metalness={0.9}
            roughness={0.2}
            wireframe
          />
        </mesh>
      </group>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* LAYER 2: High-Density Silicon Interposer & Optical Routing Bus */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <group position={[0, 0, layer2Z.current]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.5, 2.5, 0.06]} />
          <meshPhysicalMaterial
            color="#141720"
            transmission={0.4}
            opacity={0.85}
            transparent
            roughness={0.12}
            metalness={0.8}
            ior={1.4}
          />
        </mesh>

        {/* Embedded Gold Bus Grid Lines */}
        <mesh position={[0, 0, 0.035]}>
          <planeGeometry args={[2.4, 2.4]} />
          <meshStandardMaterial
            map={circuitTex}
            transparent
            opacity={0.9}
            metalness={0.95}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* LAYER 3: Neural Core Dies & 4x HBM3e Memory Stacks */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <group position={[0, 0, layer3Z.current]}>
        {/* Central Monolithic Neural Engine Die (Mirror Champagne Gold) */}
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[1.35, 1.35, 0.09]} />
          <meshStandardMaterial
            color="#f5e6c8"
            metalness={0.98}
            roughness={0.08}
            envMapIntensity={2.0}
          />
        </mesh>

        {/* Laser Engraved Inner Core Crest */}
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[0.9, 0.9]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.9}
            roughness={0.1}
            emissive="#c9b8a0"
            emissiveIntensity={0.25}
            wireframe
          />
        </mesh>

        {/* 4x Surrounding HBM3e High-Bandwidth Memory Dies */}
        {[
          [-0.85, -0.85],
          [0.85, -0.85],
          [-0.85, 0.85],
          [0.85, 0.85],
        ].map(([hx, hy], idx) => (
          <mesh key={`hbm-${idx}`} position={[hx, hy, 0]} castShadow>
            <boxGeometry args={[0.55, 0.55, 0.085]} />
            <meshStandardMaterial
              color="#1a1c24"
              metalness={0.85}
              roughness={0.25}
            />
          </mesh>
        ))}

        {/* Annotations / 3D Spatial Pins */}
        {showAnnotations && (
          <>
            {/* Annotation 1: Central Tensor Engine */}
            <Html position={[0, 0.8, 0.2]} center distanceFactor={6}>
              <div className="pointer-events-none select-none flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
                <div className="px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-[#c9b8a0]/50 text-[10px] font-sans font-bold text-white shadow-xl flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f5e6c8] shadow-[0_0_8px_#f5e6c8]" />
                  <span>275 TOPS Tensor Matrix</span>
                </div>
                <div className="w-px h-6 bg-gradient-to-b from-[#c9b8a0] to-transparent" />
              </div>
            </Html>

            {/* Annotation 2: HBM3e Memory Stack */}
            <Html position={[1.15, -0.85, 0.2]} center distanceFactor={6}>
              <div className="pointer-events-none select-none flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
                <div className="px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-[10px] font-sans font-medium text-zinc-200 shadow-xl flex items-center gap-1.5 whitespace-nowrap">
                  <Zap className="w-3 h-3 text-[#c9b8a0]" />
                  <span>64GB HBM3e (1.2 TB/s)</span>
                </div>
                <div className="w-px h-6 bg-gradient-to-b from-white/30 to-transparent" />
              </div>
            </Html>

            {/* Annotation 3: Cryptographic Hardware Enclave */}
            <Html position={[-1.15, 0.35, 0.2]} center distanceFactor={6}>
              <div className="pointer-events-none select-none flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
                <div className="px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-emerald-500/40 text-[10px] font-sans font-medium text-emerald-300 shadow-xl flex items-center gap-1.5 whitespace-nowrap">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>SHA-256 Custody Root</span>
                </div>
                <div className="w-px h-6 bg-gradient-to-b from-emerald-500/30 to-transparent" />
              </div>
            </Html>
          </>
        )}
      </group>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* LAYER 4: Anodized CNC Gold Retention Bezel & Reticle */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <group position={[0, 0, layer4Z.current]}>
        {/* Chamfered Gold Reticle Frame */}
        <mesh position={[0, 0, 0]}>
          <ringGeometry args={[1.15, 1.35, 64]} />
          <meshStandardMaterial
            color="#c9b8a0"
            metalness={0.98}
            roughness={0.12}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Precision Torx Mounting Screws */}
        {[
          [-1.1, -1.1],
          [1.1, -1.1],
          [-1.1, 1.1],
          [1.1, 1.1],
        ].map(([sx, sy], idx) => (
          <mesh key={`screw-${idx}`} position={[sx, sy, 0.02]}>
            <cylinderGeometry args={[0.07, 0.07, 0.04, 16]} />
            <meshStandardMaterial
              color="#ffffff"
              metalness={0.95}
              roughness={0.2}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Dynamic Holographic Energy Ring & Data Particles
// ─────────────────────────────────────────────────────────────────────────────
function HolographicRings() {
  const ringRef = useRef();
  const ring2Ref = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.22;
    }
  });

  return (
    <group position={[0, 0, -0.1]}>
      {/* Primary Holographic Ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[2.1, 2.15, 64]} />
        <meshBasicMaterial
          color="#c9b8a0"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Secondary Ticked Compass Ring */}
      <mesh ref={ring2Ref}>
        <ringGeometry args={[2.3, 2.33, 48]} />
        <meshBasicMaterial
          color="#f5e6c8"
          transparent
          opacity={0.2}
          wireframe
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Studio Lighting Rig
// ─────────────────────────────────────────────────────────────────────────────
function StudioLighting() {
  const mouseLightRef = useRef();

  useFrame((state) => {
    if (!mouseLightRef.current) return;
    const { x, y } = state.pointer;
    mouseLightRef.current.position.x = x * 4;
    mouseLightRef.current.position.y = y * 4;
  });

  return (
    <>
      <ambientLight intensity={0.65} />
      {/* Dynamic Key Spotlight following cursor */}
      <pointLight
        ref={mouseLightRef}
        position={[0, 0, 4]}
        intensity={3.2}
        color="#fef6e4"
        distance={10}
        decay={2}
      />
      {/* Luxury Champagne Rim Light (Apple Chamfer Glint) */}
      <directionalLight
        position={[-5, 5, 4]}
        intensity={1.8}
        color="#ffffff"
      />
      {/* Warm Fill Light */}
      <pointLight
        position={[4, -4, 2]}
        intensity={1.6}
        color="#c9b8a0"
      />
      {/* Under-glow for depth */}
      <pointLight
        position={[0, 0, -3]}
        intensity={1.0}
        color="#6e5a40"
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Main SiliconCanvas Export with On-Screen Controls
// ─────────────────────────────────────────────────────────────────────────────
export function SiliconCanvas() {
  const [isExploded, setIsExploded] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const controlsRef = useRef();

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="relative w-full h-full min-h-[480px] lg:min-h-[580px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#0a0b0e] to-[#060709] border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.85)] flex items-center justify-center">
      {/* Top Diagnostic HUD Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-xs select-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-300">
          LT-X4 NEURAL CORE // 3D STAGE
        </span>
      </div>

      {/* Interactive 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, -0.6, 4.8], fov: 42 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <StudioLighting />
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={true}
          minDistance={3.2}
          maxDistance={7.5}
          autoRotate={autoRotate}
          autoRotateSpeed={0.8}
          dampingFactor={0.05}
          enableDamping={true}
        />
        <Float
          speed={1.6}
          rotationIntensity={0.2}
          floatIntensity={0.4}
          floatingRange={[-0.08, 0.08]}
        >
          <ExplodedNeuralProcessor
            isExploded={isExploded}
            showAnnotations={showAnnotations}
          />
          <HolographicRings />
        </Float>
      </Canvas>

      {/* Floating Bottom Control Bar */}
      <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="text-[10px] font-sans text-zinc-500 hidden sm:block">
          Click & drag to rotate 360° • Scroll to zoom
        </div>

        <div className="flex items-center gap-2 pointer-events-auto bg-black/70 backdrop-blur-2xl p-1 rounded-full border border-white/10 shadow-xl ml-auto">
          {/* Explode / Compact Button */}
          <button
            type="button"
            onClick={() => setIsExploded((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              isExploded
                ? 'bg-gradient-to-r from-[#f5e6c8] to-[#c9b8a0] text-black shadow-md'
                : 'text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
            title="Explode silicon layers along Z-axis"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isExploded ? 'Compact Core' : 'Explode 3D Layers'}</span>
          </button>

          {/* Annotations Toggle */}
          <button
            type="button"
            onClick={() => setShowAnnotations((prev) => !prev)}
            className={`p-1.5 rounded-full transition-all cursor-pointer ${
              showAnnotations
                ? 'text-[#f5e6c8] bg-white/10'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Toggle 3D HUD Annotations"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Auto Rotate Toggle */}
          <button
            type="button"
            onClick={() => setAutoRotate((prev) => !prev)}
            className={`p-1.5 rounded-full transition-all cursor-pointer ${
              autoRotate
                ? 'text-[#f5e6c8] bg-white/10'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Toggle Cinematic Auto-Rotation"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          {/* Reset Camera */}
          <button
            type="button"
            onClick={handleResetCamera}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Reset Camera View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SiliconCanvas;
