import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────────────────
// 1. 3D Silicon Wafer Substrate & Neural Computing Die
// ─────────────────────────────────────────────────────────────────────────────
function SiliconWafer() {
  const meshRef = useRef();
  const innerDieRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const { x, y } = state.pointer;
    // Smooth magnetic mouse tilt interpolation
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      x * 0.5,
      0.06
    );
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      -y * 0.5 + 0.15,
      0.06
    );

    // Subtle breathing pulse for inner neural die
    if (innerDieRef.current) {
      const t = state.clock.getElapsedTime();
      const s = 1 + Math.sin(t * 1.5) * 0.015;
      innerDieRef.current.scale.set(s, s, 1);
    }
  });

  return (
    <group ref={meshRef}>
      {/* Outer Ceramic / Substrate Carrier */}
      <mesh receiveShadow castShadow>
        <boxGeometry args={[2.4, 2.4, 0.1]} />
        <meshStandardMaterial
          color="#121318"
          roughness={0.4}
          metalness={0.6}
          envMapIntensity={0.8}
        />
      </mesh>

      {/* Substrate Chamfered Bezel Ring */}
      <mesh position={[0, 0, 0.055]}>
        <ringGeometry args={[1.05, 1.15, 64]} />
        <meshStandardMaterial
          color="#c9b8a0"
          metalness={0.95}
          roughness={0.2}
        />
      </mesh>

      {/* High-Purity Neural Silicon Die (Champagne Gold Refraction) */}
      <mesh ref={innerDieRef} position={[0, 0, 0.07]} castShadow>
        <boxGeometry args={[1.4, 1.4, 0.08]} />
        <meshStandardMaterial
          color="#f5e6c8"
          roughness={0.15}
          metalness={0.92}
          emissive="#7d6748"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Core Logic Monogram / Bus Cross */}
      <mesh position={[0, 0, 0.12]}>
        <boxGeometry args={[0.5, 0.5, 0.02]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.1}
          metalness={1.0}
          emissive="#c9b8a0"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Four Precision Corner Gold BGA Alignment Markers */}
      {[
        [-0.95, -0.95],
        [0.95, -0.95],
        [-0.95, 0.95],
        [0.95, 0.95],
      ].map(([x, y], idx) => (
        <mesh key={idx} position={[x, y, 0.06]}>
          <cylinderGeometry args={[0.07, 0.07, 0.02, 16]} />
          <meshStandardMaterial
            color="#c9b8a0"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Ambient Floating Particulates (Dust Motes)
// ─────────────────────────────────────────────────────────────────────────────
function ParticleAtmosphere({ count = 90 }) {
  const pointsRef = useRef();

  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return pos;
  });

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime() * 0.08;
    pointsRef.current.rotation.y = t * 0.3;
    pointsRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#c9b8a0"
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Dynamic Cursor-Tracking Lighting Rig
// ─────────────────────────────────────────────────────────────────────────────
function DynamicLighting() {
  const lightRef = useRef();

  useFrame((state) => {
    if (!lightRef.current) return;
    const { x, y } = state.pointer;
    lightRef.current.position.x = x * 3;
    lightRef.current.position.y = y * 3;
    lightRef.current.position.z = 2.5;
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight
        ref={lightRef}
        intensity={2.8}
        color="#f5e6c8"
        distance={8}
        decay={2}
      />
      <directionalLight
        position={[-4, 5, 3]}
        intensity={1.2}
        color="#ffffff"
      />
      <pointLight
        position={[3, -4, 2]}
        intensity={1.5}
        color="#c9b8a0"
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CSS 3D Perspective Fallback Component
// ─────────────────────────────────────────────────────────────────────────────
function CSS3DSiliconWafer() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setCoords({ x, y });
  };

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full flex items-center justify-center [perspective:1000px] cursor-grab active:cursor-grabbing select-none"
    >
      <div
        className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl p-6 transition-transform duration-150 ease-out [transform-style:preserve-3d] shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/10"
        style={{
          transform: `rotateX(${-coords.y * 30}deg) rotateY(${coords.x * 30}deg)`,
          background: 'radial-gradient(circle at 50% 50%, #16171d 0%, #0a0b0e 100%)',
        }}
      >
        {/* Specular lighting sheen */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none opacity-40 transition-opacity"
          style={{
            background: `radial-gradient(circle at ${coords.x * 100 + 50}% ${
              coords.y * 100 + 50
            }%, rgba(245,230,200,0.25) 0%, transparent 60%)`,
          }}
        />

        {/* Outer Gold Boundary Trace */}
        <div className="absolute inset-4 rounded-2xl border border-[#c9b8a0]/30 [transform:translateZ(20px)] flex items-center justify-center">
          {/* Inner Neural Silicon Die */}
          <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-[#f5e6c8] via-[#c9b8a0] to-[#8c7457] p-0.5 shadow-2xl [transform:translateZ(35px)] flex items-center justify-center">
            <div className="w-full h-full bg-[#111216] rounded-[10px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#c9b8a0]/20 to-transparent" />
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#f5e6c8] to-[#c9b8a0] shadow-[0_0_20px_rgba(201,184,160,0.5)] flex items-center justify-center font-display text-xs font-bold text-black tracking-tighter">
                AIML
              </div>
            </div>
          </div>
        </div>

        {/* Corner alignment markers */}
        <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-[#c9b8a0] shadow-[0_0_8px_#c9b8a0]" />
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#c9b8a0] shadow-[0_0_8px_#c9b8a0]" />
        <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-[#c9b8a0] shadow-[0_0_8px_#c9b8a0]" />
        <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-[#c9b8a0] shadow-[0_0_8px_#c9b8a0]" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Main SiliconCanvas Export with WebGL Error Boundary
// ─────────────────────────────────────────────────────────────────────────────
class WebGLErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err) {
    console.warn('WebGL initialization failed, falling back to CSS 3D:', err);
  }
  render() {
    if (this.state.hasError) {
      return <CSS3DSiliconWafer />;
    }
    return this.props.children;
  }
}

export function SiliconCanvas() {
  const [canRenderWebGL, setCanRenderWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setCanRenderWebGL(false);
    } catch {
      setCanRenderWebGL(false);
    }
  }, []);

  if (!canRenderWebGL) {
    return <CSS3DSiliconWafer />;
  }

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <WebGLErrorBoundary>
        <Canvas
          shadows
          camera={{ position: [0, 0, 4.5], fov: 42 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
        >
          <Suspense fallback={null}>
            <DynamicLighting />
            <Float
              speed={2.0}
              rotationIntensity={0.3}
              floatIntensity={0.6}
              floatingRange={[-0.1, 0.1]}
            >
              <SiliconWafer />
            </Float>
            <ParticleAtmosphere count={85} />
          </Suspense>
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}

export default SiliconCanvas;
