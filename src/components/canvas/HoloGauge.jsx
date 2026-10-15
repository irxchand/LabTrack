import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * 3D Holographic Concentric Reliability & Accountability Rings
 * Used in Scene 06 to encircle the equipment with dynamic compliance telemetry.
 */
export function HoloGauge({ position = [0, 1.2, 0], score = 96.4, visible = false }) {
  const outerRingRef = useRef();
  const innerRingRef = useRef();
  const tickRingRef = useRef();

  useFrame((state, delta) => {
    if (!visible) return;
    if (outerRingRef.current) outerRingRef.current.rotation.z += delta * 0.25;
    if (innerRingRef.current) innerRingRef.current.rotation.z -= delta * 0.4;
    if (tickRingRef.current) tickRingRef.current.rotation.z += delta * 0.15;
  });

  if (!visible) return null;

  return (
    <group position={position} rotation={[-Math.PI / 2.5, 0, 0]}>
      {/* Outer Rotating Concentric Arc */}
      <mesh ref={outerRingRef}>
        <ringGeometry args={[2.4, 2.45, 64]} />
        <meshBasicMaterial
          color="#10b981"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner Compliance Metric Arc */}
      <mesh ref={innerRingRef}>
        <ringGeometry args={[2.1, 2.18, 64, 1, 0, Math.PI * 1.65]} />
        <meshBasicMaterial
          color="#c8963e"
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Segmented Calibration Ticks */}
      <group ref={tickRingRef}>
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i / 36) * Math.PI * 2;
          const x = Math.cos(angle) * 1.85;
          const y = Math.sin(angle) * 1.85;
          return (
            <mesh key={i} position={[x, y, 0]} rotation={[0, 0, angle]}>
              <planeGeometry args={[0.02, 0.14]} />
              <meshBasicMaterial
                color={i % 6 === 0 ? '#10b981' : 'rgba(255, 255, 255, 0.3)'}
                transparent
                opacity={0.6}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })}
      </group>

      {/* Soft Volumetric Ambient Field */}
      <mesh>
        <circleGeometry args={[2.5, 32]} />
        <meshBasicMaterial
          color="#10b981"
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
