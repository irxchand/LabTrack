import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Camera Waypoints for the 9 Cinematic Scenes defined in ORYZO_LABTRACK_SPECIFICATION.md
 */
export const CAMERA_WAYPOINTS = [
  // Scene 01: Laboratory Awakening (Hero Establishing Shot)
  { pos: [0, 3.8, 8.5], target: [0, 0, 0] },
  // Scene 02: Living Inventory (Storage Bins & Coordinates)
  { pos: [3.2, 2.5, 6.0], target: [0.5, 0.2, 0] },
  // Scene 03: Equipment Deep Inspection (Macro FPGA Core & Traces)
  { pos: [-0.6, 1.3, 2.6], target: [0.1, 0.2, 0] },
  // Scene 04: Requisition Stack (Exploded Layer Reveal)
  { pos: [0, 3.8, 3.4], target: [0, 0.3, 0] },
  // Scene 05: Dispatch Counter (Barcode Scanning Bay)
  { pos: [-2.6, 1.8, 3.2], target: [-2.2, 0.4, -0.6] },
  // Scene 06: Reliability & Audit (Holographic Compliance Ring)
  { pos: [0, 2.2, 5.2], target: [0, 0.6, 0] },
  // Scene 07: Academic Projects (Team Clusters)
  { pos: [2.8, 2.0, 5.0], target: [1.2, 0.3, 0] },
  // Scene 08: Operations & Defect Triage (Quarantine Bench)
  { pos: [-1.8, 2.6, 4.5], target: [-0.5, 0.2, 0] },
  // Scene 09: System Command Centre Dock (Wide Departmental View)
  { pos: [1.5, 3.0, 6.5], target: [0, 0.4, 0] },
];

export function CameraController({
  sceneIndex = 0,
  scrollProgress = 0,
  isInspecting = false,
  userMouse = { x: 0, y: 0 },
}) {
  const { camera } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const targetPos = useRef(new THREE.Vector3(0, 3.8, 8.5));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    // Determine target based on continuous scrollProgress across waypoints
    const totalScenes = CAMERA_WAYPOINTS.length;
    // Normalized scene index floating value
    const floatIndex = Math.min(Math.max(scrollProgress * (totalScenes - 1), 0), totalScenes - 1);
    const indexA = Math.floor(floatIndex);
    const indexB = Math.min(indexA + 1, totalScenes - 1);
    const blend = floatIndex - indexA;

    const wpA = CAMERA_WAYPOINTS[indexA];
    const wpB = CAMERA_WAYPOINTS[indexB];

    // Interpolate positions between adjacent waypoints
    const basePosX = THREE.MathUtils.lerp(wpA.pos[0], wpB.pos[0], blend);
    const basePosY = THREE.MathUtils.lerp(wpA.pos[1], wpB.pos[1], blend);
    const basePosZ = THREE.MathUtils.lerp(wpA.pos[2], wpB.pos[2], blend);

    const baseTgtX = THREE.MathUtils.lerp(wpA.target[0], wpB.target[0], blend);
    const baseTgtY = THREE.MathUtils.lerp(wpA.target[1], wpB.target[1], blend);
    const baseTgtZ = THREE.MathUtils.lerp(wpA.target[2], wpB.target[2], blend);

    // Subtle parallax tilt from cursor
    const mouseOffsetX = (userMouse.x - 0.5) * 0.4;
    const mouseOffsetY = (userMouse.y - 0.5) * 0.3;

    targetPos.current.set(basePosX + mouseOffsetX, basePosY - mouseOffsetY, basePosZ);
    targetLookAt.current.set(baseTgtX, baseTgtY, baseTgtZ);

    // Smooth inertia camera lerp (damped)
    const lerpFactor = THREE.MathUtils.clamp(delta * 3.5, 0.01, 0.25);
    camera.position.lerp(targetPos.current, lerpFactor);
    currentLookAt.current.lerp(targetLookAt.current, lerpFactor);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
