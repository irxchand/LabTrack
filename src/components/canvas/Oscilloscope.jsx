import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Procedural Mixed-Signal Digital Oscilloscope
 * Inspired by Keysight / Rigol test equipment. Features live phosphor waveform screen,
 * rotary encoder knobs, BNC jacks, and real curved coaxial test probe cables.
 */
export function Oscilloscope({ position = [3.6, 0.95, -0.8], rotation = [0, -0.4, 0] }) {
  const oscRef = useRef();
  const screenCanvasRef = useRef(null);
  const screenTextureRef = useRef(null);

  // Set up dynamic HTML5 Canvas for the live phosphor screen
  const { canvas, texture } = useMemo(() => {
    const cvs = document.createElement('canvas');
    cvs.width = 512;
    cvs.height = 384;
    const tex = new THREE.CanvasTexture(cvs);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return { canvas: cvs, texture: tex };
  }, []);

  useEffect(() => {
    screenCanvasRef.current = canvas;
    screenTextureRef.current = texture;
  }, [canvas, texture]);

  // Procedural curved coaxial test probe cable snaking across the workbench
  const { probeCable1, probeCable2 } = useMemo(() => {
    // Channel 1 cable from BNC 1 down to the table and towards FPGA test point
    const curve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.6, -0.78, 0.92),
      new THREE.Vector3(-1.0, -0.9, 1.4),
      new THREE.Vector3(-1.8, -0.92, 1.8),
      new THREE.Vector3(-2.8, -0.92, 1.2),
      new THREE.Vector3(-3.4, -0.85, 0.6),
    ]);

    // Channel 2 cable from BNC 2
    const curve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.2, -0.78, 0.92),
      new THREE.Vector3(-0.6, -0.9, 1.6),
      new THREE.Vector3(-1.5, -0.92, 2.1),
      new THREE.Vector3(-2.5, -0.92, 1.6),
      new THREE.Vector3(-3.2, -0.85, 0.9),
    ]);

    const geom1 = new THREE.TubeGeometry(curve1, 32, 0.035, 8, false);
    const geom2 = new THREE.TubeGeometry(curve2, 32, 0.035, 8, false);
    return { probeCable1: geom1, probeCable2: geom2 };
  }, []);

  // Render live phosphor waveforms every frame
  useFrame((state) => {
    if (!screenCanvasRef.current || !screenTextureRef.current) return;
    const ctx = screenCanvasRef.current.getContext('2d');
    const t = state.clock.getElapsedTime();

    // Dark phosphor CRT background
    ctx.fillStyle = '#060d09';
    ctx.fillRect(0, 0, 512, 384);

    // Oscilloscope Grid Lines (10x8 divisions)
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)'; // Muted phosphor green
    ctx.lineWidth = 1;

    for (let x = 32; x < 512; x += 44.8) {
      ctx.beginPath();
      ctx.moveTo(x, 24);
      ctx.lineTo(x, 360);
      ctx.stroke();
    }
    for (let y = 24; y < 384; y += 42) {
      ctx.beginPath();
      ctx.moveTo(32, y);
      ctx.lineTo(480, y);
      ctx.stroke();
    }

    // Center graticule ticks
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
    ctx.beginPath();
    ctx.moveTo(32, 192);
    ctx.lineTo(480, 192);
    ctx.moveTo(256, 24);
    ctx.lineTo(256, 360);
    ctx.stroke();

    // Channel 1 Waveform (Glowing Neon Green High-Speed Sine Wave with harmonics)
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 8;
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    for (let x = 32; x <= 480; x += 4) {
      const phase = (x / 448) * Math.PI * 8 - t * 6;
      const y = 140 + Math.sin(phase) * 45 + Math.sin(phase * 3) * 12;
      if (x === 32) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Channel 2 Waveform (Digital Clock Pulse Train - Cyan)
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 6;
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let x = 32; x <= 480; x += 4) {
      const pulsePhase = (x / 448) * Math.PI * 12 - t * 4;
      const pulse = Math.sin(pulsePhase) > 0 ? 1 : -1;
      const y = 260 + pulse * 28;
      if (x === 32) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Reset shadow
    ctx.shadowBlur = 0;

    // Technical Oscilloscope HUD overlay text
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('CH1: 500mV/div  10.0ns/div', 36, 18);
    ctx.fillStyle = '#06b6d4';
    ctx.fillText('CH2: 3.3V CLK  AUTO TRIG', 260, 18);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '11px monospace';
    ctx.fillText('FREQ: 100.002 MHz // PK-PK: 3.28V // NIST CALIBRATED', 36, 376);

    screenTextureRef.current.needsUpdate = true;
  });

  return (
    <group ref={oscRef} position={position} rotation={rotation}>
      {/* 1. Main Oscilloscope Body Chassis */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[3.4, 2.2, 1.8]} />
        <meshStandardMaterial color="#1a1d24" roughness={0.65} metalness={0.3} />
      </mesh>

      {/* Rubber Corner Protective Bumpers */}
      {[
        [-1.68, 1.08, 0],
        [1.68, 1.08, 0],
        [-1.68, -1.08, 0],
        [1.68, -1.08, 0],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[0.15, 0.25, 1.85]} />
          <meshStandardMaterial color="#0f1115" roughness={0.9} />
        </mesh>
      ))}

      {/* 2. Phosphor Screen Display Glass */}
      <mesh position={[-0.45, 0.15, 0.91]}>
        <planeGeometry args={[2.0, 1.5]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* Screen Bezel Frame */}
      <mesh position={[-0.45, 0.15, 0.905]}>
        <boxGeometry args={[2.08, 1.58, 0.04]} />
        <meshStandardMaterial color="#0b0d10" roughness={0.8} />
      </mesh>

      {/* 3. Control Panel on Right Side */}
      <group position={[1.05, 0.15, 0.92]}>
        {/* Large Rotary Encoders (Knurled Aluminum Knobs) */}
        {/* Horizontal Time/Div Knob */}
        <mesh position={[0, 0.45, 0.08]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.16, 24]} />
          <meshStandardMaterial color="#4a5260" roughness={0.25} metalness={0.85} />
        </mesh>

        {/* Vertical Volts/Div Knob */}
        <mesh position={[0, -0.05, 0.08]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.16, 24]} />
          <meshStandardMaterial color="#4a5260" roughness={0.25} metalness={0.85} />
        </mesh>

        {/* Tactile Push Buttons */}
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={i} position={[-0.28 + (i % 2) * 0.56, -0.45 - Math.floor(i / 2) * 0.18, 0.04]}>
            <boxGeometry args={[0.16, 0.1, 0.06]} />
            <meshStandardMaterial color="#2c3340" roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* 4. Bottom BNC Probe Terminals */}
      <group position={[-0.45, -0.78, 0.92]}>
        {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
          <group key={i} position={[x, 0, 0]}>
            {/* BNC Outer Metal Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.1, 0.15, 16]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
            </mesh>
            {/* Gold Center Pin */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.05]}>
              <cylinderGeometry args={[0.02, 0.02, 0.12, 8]} />
              <meshStandardMaterial color="#c8963e" metalness={0.95} roughness={0.1} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 5. Curved Flexible Coaxial Probe Cables Snaking Across Workbench */}
      <mesh geometry={probeCable1} castShadow>
        <meshStandardMaterial color="#1f242d" roughness={0.6} />
      </mesh>
      <mesh geometry={probeCable2} castShadow>
        <meshStandardMaterial color="#10b981" roughness={0.5} />
      </mesh>

      {/* Probe Tips with Gold Contact Pins */}
      <group position={[-3.4, -0.85, 0.6]} rotation={[0, 0.5, 0.3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.4, 12]} />
          <meshStandardMaterial color="#333a46" roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <coneGeometry args={[0.02, 0.1, 8]} />
          <meshStandardMaterial color="#c8963e" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}
