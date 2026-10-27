import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Multi-device Laboratory Board
 * Renders Kintex-7 FPGA, Jetson Orin Nano, or STM32 Discovery depending on selection.
 * Features exploded animation, thermal response, and interactive 360 orbit.
 */
export function FpgaBoard({
  exploded = 0,
  isInspecting = false,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  deviceType = 'FPGA', // 'FPGA' | 'JETSON' | 'STM32'
  thermalLoad = 42,
}) {
  const boardRef = useRef();
  const ledRef1 = useRef();
  const ledRef2 = useRef();
  const heatsinkRef = useRef();

  // Create procedural silkscreen circuit trace texture using Canvas
  const traceTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Base matte FR4 circuit board background
    ctx.fillStyle = deviceType === 'STM32' ? '#0d2238' : deviceType === 'JETSON' ? '#0a0d12' : '#0f1712';
    ctx.fillRect(0, 0, 1024, 1024);

    // Draw gold & copper differential pair traces
    ctx.strokeStyle = '#c8963e';
    ctx.lineWidth = 2;

    for (let i = 0; i < 24; i++) {
      ctx.beginPath();
      ctx.moveTo(80, 200 + i * 25);
      ctx.lineTo(240, 200 + i * 25);
      ctx.lineTo(320, 280 + i * 18);
      ctx.lineTo(512, 280 + i * 18);
      ctx.stroke();
    }

    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(940, 300 + i * 22);
      ctx.lineTo(820, 300 + i * 22);
      ctx.lineTo(720, 380 + i * 14);
      ctx.lineTo(580, 380 + i * 14);
      ctx.stroke();
    }

    // Silkscreen text & technical calibration grid
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.font = 'bold 20px monospace';
    const label =
      deviceType === 'JETSON'
        ? 'NVIDIA JETSON ORIN NANO // 40 TOPS'
        : deviceType === 'STM32'
        ? 'STM32F4-DISCOVERY // ARM CORTEX-M4'
        : 'LABTRACK // DSP-RIG-8840 KINTEX-7';
    ctx.fillText(label, 80, 100);
    ctx.font = '14px monospace';
    ctx.fillText('CALIBRATED TP1-TP32 NIST CERTIFIED', 80, 130);
    ctx.fillText('REV 4.2C // DEPT OF ECE', 700, 100);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, [deviceType]);

  // Animating activity LEDs & subtle thermal float
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    if (ledRef1.current) {
      ledRef1.current.material.emissiveIntensity = Math.sin(time * 12) > 0.2 ? 3.5 : 0.4;
    }
    if (ledRef2.current) {
      ledRef2.current.material.emissiveIntensity = Math.sin(time * 5 + 1) > -0.2 ? 2.8 : 0.2;
    }
    if (isInspecting && boardRef.current) {
      boardRef.current.rotation.y += delta * 0.45;
    }

    // Dynamic thermal emissive color on heatsink when temperature rises above 46°C
    if (heatsinkRef.current) {
      const heatFactor = Math.max((thermalLoad - 38) / 16, 0);
      heatsinkRef.current.material.emissive.setRGB(heatFactor * 0.35, heatFactor * 0.05, 0);
    }
  });

  // Exploded offsets
  const heatsinkY = 0.28 + exploded * 0.55;
  const chipY = 0.08 + exploded * 0.2;
  const pcbY = 0;

  return (
    <group ref={boardRef} position={position} rotation={rotation}>
      {/* 1. Base FR4 PCB Board */}
      <group position={[0, pcbY, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4.2, 0.08, 3.2]} />
          <meshStandardMaterial
            map={traceTexture}
            color={deviceType === 'STM32' ? '#14314d' : '#141c18'}
            roughness={0.4}
            metalness={0.2}
          />
        </mesh>

        {/* Gold PCIe / Expansion Edge Fingers */}
        <mesh position={[0, -0.01, 1.62]} castShadow>
          <boxGeometry args={[3.6, 0.04, 0.12]} />
          <meshStandardMaterial color="#c8963e" roughness={0.2} metalness={0.9} />
        </mesh>

        {/* 40-Pin GPIO Header Array */}
        <group position={[-1.7, 0.18, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.3, 0.22, 2.6]} />
            <meshStandardMaterial color="#1a1c22" roughness={0.7} />
          </mesh>
          {Array.from({ length: 20 }).map((_, i) => (
            <mesh key={i} position={[0, 0.18, -1.15 + i * 0.12]}>
              <cylinderGeometry args={[0.02, 0.02, 0.25, 8]} />
              <meshStandardMaterial color="#c8963e" roughness={0.2} metalness={0.95} />
            </mesh>
          ))}
        </group>

        {/* Dual RJ45 Ethernet Ports */}
        <mesh position={[1.8, 0.35, -0.8]} castShadow>
          <boxGeometry args={[0.7, 0.65, 0.9]} />
          <meshStandardMaterial color="#8892a0" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Micro-USB Diagnostic Debug Port */}
        <mesh position={[1.9, 0.12, 0.4]} castShadow>
          <boxGeometry args={[0.4, 0.15, 0.3]} />
          <meshStandardMaterial color="#b0b8c4" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* SMD Capacitor & Resistor Banks */}
        {Array.from({ length: 16 }).map((_, i) => (
          <mesh key={i} position={[-0.8 + (i % 4) * 0.25, 0.07, -0.8 + Math.floor(i / 4) * 0.2]}>
            <boxGeometry args={[0.12, 0.06, 0.08]} />
            <meshStandardMaterial color="#8a7352" metalness={0.5} roughness={0.4} />
          </mesh>
        ))}

        {/* Blinking Status LEDs */}
        <mesh ref={ledRef1} position={[1.4, 0.08, 1.2]}>
          <boxGeometry args={[0.08, 0.06, 0.08]} />
          <meshStandardMaterial
            color="#c9b8a0"
            emissive="#c9b8a0"
            emissiveIntensity={2.5}
            toneMapped={false}
          />
        </mesh>

        <mesh ref={ledRef2} position={[1.2, 0.08, 1.2]}>
          <boxGeometry args={[0.08, 0.06, 0.08]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={2.0}
            toneMapped={false}
          />
        </mesh>

        <mesh position={[1.0, 0.08, 1.2]}>
          <boxGeometry args={[0.08, 0.06, 0.08]} />
          <meshStandardMaterial
            color="#e11d48"
            emissive="#8b1d2c"
            emissiveIntensity={1.2}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* 2. Silicon BGA Package (Kintex-7 or Jetson Core) */}
      <group position={[0.2, chipY, -0.1]}>
        <mesh castShadow>
          <boxGeometry args={[1.5, 0.09, 1.5]} />
          <meshStandardMaterial color="#1a1e24" roughness={0.5} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.055, 0]} castShadow>
          <boxGeometry args={[1.1, 0.03, 1.1]} />
          <meshStandardMaterial color="#e5e7eb" roughness={0.15} metalness={0.92} />
        </mesh>
      </group>

      {/* 3. Extruded Aluminum Heatsink Assembly with Dynamic Thermal Glow */}
      <group position={[0.2, heatsinkY, -0.1]}>
        <mesh ref={heatsinkRef} castShadow receiveShadow>
          <boxGeometry args={[1.7, 0.12, 1.7]} />
          <meshStandardMaterial
            color="#15171c"
            roughness={0.3}
            metalness={0.8}
            emissive={new THREE.Color(0, 0, 0)}
          />
        </mesh>
        {Array.from({ length: 9 }).map((_, i) => (
          <mesh key={i} position={[-0.72 + i * 0.18, 0.26, 0]} castShadow>
            <boxGeometry args={[0.04, 0.42, 1.65]} />
            <meshStandardMaterial color="#1f232b" roughness={0.35} metalness={0.75} />
          </mesh>
        ))}
      </group>

      {/* 4. DDR4 High Speed Memory Modules */}
      <group position={[0.2, 0.08, 1.0]}>
        <mesh castShadow>
          <boxGeometry args={[1.4, 0.07, 0.4]} />
          <meshStandardMaterial color="#111317" roughness={0.6} metalness={0.2} />
        </mesh>
      </group>
    </group>
  );
}
