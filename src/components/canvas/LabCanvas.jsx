import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { CameraController } from './CameraController';
import { FpgaBoard } from './FpgaBoard';
import { Oscilloscope } from './Oscilloscope';
import { StorageDock } from './StorageDock';
import { HoloGauge } from './HoloGauge';

/**
 * Procedural Laboratory Ambient Dust Particles (Floating Specks)
 * Adds authentic atmospheric depth as seen in Oryzo.
 */
function LabAtmosphere() {
  const particles = useMemo(() => {
    const count = 48;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = Math.random() * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    return pos;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#c8963e"
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * Procedural Laboratory Workbench Surface Plane
 */
function WorkbenchFloor() {
  return (
    <group position={[0, -0.05, 0]}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial
          color="#08090c"
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      <gridHelper
        args={[30, 30, '#c8963e', '#1c2330']}
        position={[0, 0.002, 0]}
      />
    </group>
  );
}

/**
 * Main Persistent WebGL Canvas Stage for LabTrack
 */
export function LabCanvas({
  scrollProgress = 0,
  sceneIndex = 0,
  isInspecting = false,
  exploded = 0,
  isScanning = false,
  isLocked = true,
  showHoloGauge = false,
  deviceType = 'FPGA',
  thermalLoad = 42,
}) {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouse({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: isInspecting ? 'auto' : 'none',
        background: '#07080a',
      }}
    >
      <Canvas
        shadows
        onCreated={({ gl }) => {
          if (gl.shadowMap) gl.shadowMap.type = THREE.PCFShadowMap;
        }}
        dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5)]}
        camera={{ position: [0, 3.8, 8.5], fov: 38, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
      >
        <color attach="background" args={['#07080a']} />

        {/* Studio Lighting Rig */}
        <ambientLight color="#181e2b" intensity={0.8} />

        <directionalLight
          position={[6, 12, 8]}
          intensity={2.8}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
        />

        <directionalLight
          position={[-6, 4, -4]}
          intensity={1.8}
          color="#c8963e"
        />

        <directionalLight
          position={[6, -2, -4]}
          intensity={1.2}
          color="#3b82f6"
        />

        {/* Camera Trajectory Controller */}
        <CameraController
          sceneIndex={sceneIndex}
          scrollProgress={scrollProgress}
          isInspecting={isInspecting}
          userMouse={mouse}
        />

        {/* Physical Laboratory Elements */}
        <Suspense fallback={null}>
          <WorkbenchFloor />
          <LabAtmosphere />

          {/* Central Computing Rig */}
          <FpgaBoard
            exploded={exploded}
            isInspecting={isInspecting}
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            deviceType={deviceType}
            thermalLoad={thermalLoad}
          />

          {/* Precision Test Gear (Oscilloscope with flexible probe cables) */}
          <Oscilloscope position={[3.6, 0.95, -0.8]} rotation={[0, -0.4, 0]} />

          {/* Custody Storage & Dispatch Docking Cassette */}
          <StorageDock
            position={[-3.4, 0.4, -0.6]}
            rotation={[0, 0.45, 0]}
            isLocked={isLocked}
            isScanning={isScanning}
          />

          {/* Holographic Compliance Rings (Scene 06) */}
          <HoloGauge
            position={[0, 1.2, 0]}
            visible={showHoloGauge || sceneIndex === 5}
            score={96.4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
