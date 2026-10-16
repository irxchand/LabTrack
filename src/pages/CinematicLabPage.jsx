import React, { useState } from 'react';
import { LabCanvas } from '../components/canvas/LabCanvas';
import { ScrollNarrative } from '../components/narrative/ScrollNarrative';
import { RequisitionDrawer } from '../components/specialized/RequisitionDrawer';
import { QuickDispatchModal } from '../components/specialized/QuickDispatchModal';
import { QuickReliabilityModal } from '../components/specialized/QuickReliabilityModal';
import { useLabData } from '../context/LabDataContext';

export function CinematicLabPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sceneIndex, setSceneIndex] = useState(0);

  // 3D & Interactive Experience States
  const [exploded, setExploded] = useState(0);
  const [isInspecting, setIsInspecting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [deviceType, setDeviceType] = useState('FPGA');
  const [thermalLoad, setThermalLoad] = useState(42.0);

  // Modals & Drawers
  const { setIsBasketOpen } = useLabData();
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isReliabilityModalOpen, setIsReliabilityModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#07080a] text-white selection:bg-[#c8963e] selection:text-black">
      {/* 1. Persistent Fixed 3D WebGL Canvas Layer */}
      <LabCanvas
        scrollProgress={scrollProgress}
        sceneIndex={sceneIndex}
        isInspecting={isInspecting}
        exploded={exploded}
        isScanning={isScanning}
        isLocked={isLocked}
        showHoloGauge={sceneIndex === 5}
        deviceType={deviceType}
        thermalLoad={thermalLoad}
      />

      {/* 2. Editorial Scroll Narrative Layer */}
      <ScrollNarrative
        onScrollProgress={setScrollProgress}
        onSceneChange={setSceneIndex}
        exploded={exploded}
        setExploded={setExploded}
        isInspecting={isInspecting}
        setIsInspecting={setIsInspecting}
        isScanning={isScanning}
        setIsScanning={setIsScanning}
        isLocked={isLocked}
        setIsLocked={setIsLocked}
        deviceType={deviceType}
        setDeviceType={setDeviceType}
        thermalLoad={thermalLoad}
        setThermalLoad={setThermalLoad}
        onOpenRequisitionDrawer={() => setIsBasketOpen(true)}
        onOpenDispatchModal={() => setIsDispatchModalOpen(true)}
        onOpenReliabilityModal={() => setIsReliabilityModalOpen(true)}
      />

      {/* 3. Functional Requisition Basket Drawer */}
      <RequisitionDrawer />

      {/* 4. Custodian Counter Dispatch Terminal Modal */}
      <QuickDispatchModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
      />

      {/* 5. Student Reliability & Compliance Dossier Modal */}
      <QuickReliabilityModal
        isOpen={isReliabilityModalOpen}
        onClose={() => setIsReliabilityModalOpen(false)}
      />
    </div>
  );
}
