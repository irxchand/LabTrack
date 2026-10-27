import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Modular 3-Bay Storage & Dispatch Docking Cassette
 * Features laser-etched coordinate placards, electronic solenoid lock bar,
 * barcode matrix plates, and an animated optical red laser scanner fan.
 */
export function StorageDock({
  position = [-3.4, 0.4, -0.6],
  rotation = [0, 0.45, 0],
  isLocked = true,
  isScanning = false,
}) {
  const dockRef = useRef();
  const scanLineRef = useRef();

  useFrame((state) => {
    if (isScanning && scanLineRef.current) {
      const time = state.clock.getElapsedTime();
      scanLineRef.current.position.z = Math.sin(time * 3.5) * 1.5;
      scanLineRef.current.material.opacity = 0.65 + Math.sin(time * 10) * 0.25;
    }
  });

  return (
    <group ref={dockRef} position={position} rotation={rotation}>
      {/* 1. Heavy Machined Aluminum Base Rails (3 Modular Cassettes) */}
      <mesh castShadow receiveShadow position={[0, -0.15, 0]}>
        <boxGeometry args={[2.6, 0.3, 4.2]} />
        <meshStandardMaterial color="#1f232b" roughness={0.3} metalness={0.85} />
      </mesh>

      {/* Side Rail Clamps */}
      {[-1.25, 1.25].map((x, i) => (
        <mesh key={i} position={[x, 0.35, 0]} castShadow>
          <boxGeometry args={[0.1, 0.7, 4.0]} />
          <meshStandardMaterial color="#2c323e" roughness={0.25} metalness={0.9} />
        </mesh>
      ))}

      {/* Laser-Etched Coordinate Placard */}
      <group position={[1.32, 0.35, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <planeGeometry args={[2.2, 0.35]} />
          <meshStandardMaterial color="#0c0e12" roughness={0.8} />
        </mesh>
      </group>

      {/* 2. Solenoid Electronic Custody Lock Bar */}
      <group position={[0, 0.6, -1.8]}>
        {/* Metal Locking Rod */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 2.5, 16]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.95} />
        </mesh>

        {/* Lock Housing */}
        <mesh position={[1.15, 0, 0]} castShadow>
          <boxGeometry args={[0.25, 0.35, 0.35]} />
          <meshStandardMaterial color="#1a1c22" roughness={0.5} />
        </mesh>

        {/* Custody State Indicator LED (Crimson = Locked, Gold = Released) */}
        <mesh position={[1.15, 0.22, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial
            color={isLocked ? '#e11d48' : '#c9b8a0'}
            emissive={isLocked ? '#8b1d2c' : '#c9b8a0'}
            emissiveIntensity={3.0}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* 3. Barcode / Data Matrix Verification Placard */}
      <group position={[0, 0.02, 1.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[1.4, 0.7]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
        {Array.from({ length: 14 }).map((_, i) => (
          <mesh key={i} position={[-0.55 + i * 0.085, 0, 0.005]}>
            <planeGeometry args={[0.035, 0.55]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
        ))}
      </group>

      {/* 4. Active Red Optical Laser Scanner Beam (Scene 05 Dispatch) */}
      {isScanning && (
        <group position={[0, 0.7, 0]}>
          <mesh ref={scanLineRef} rotation={[0, 0, 0]}>
            <planeGeometry args={[2.4, 0.04]} />
            <meshBasicMaterial
              color="#ff0044"
              transparent
              opacity={0.85}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, -0.35, 0]} rotation={[0.25, 0, 0]}>
            <planeGeometry args={[2.4, 0.7]} />
            <meshBasicMaterial
              color="#ff0044"
              transparent
              opacity={0.2}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}
