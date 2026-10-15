import React, { useState } from 'react';
import {
  Layers,
  Rotate3d,
  Cpu,
  Flame,
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { audioFx } from '../../utils/audioFx';
import { useLabData } from '../../context/LabDataContext';

/**
 * Interactive Hardware Parameter Controls for Scene 03 & 04
 * Allows real-time clock frequency scaling, thermal telemetry simulation,
 * device selection, and exploded 3D assembly inspection.
 */
export function HardwareParamControls({
  exploded = 0,
  setExploded,
  isInspecting,
  setIsInspecting,
  deviceType = 'FPGA',
  setDeviceType,
  thermalLoad = 42,
  setThermalLoad,
  onAddToBasket,
}) {
  const [clockFreq, setClockFreq] = useState(250);
  const { addToBasket, inventory } = useLabData();

  const handleFreqChange = (e) => {
    const val = Number(e.target.value);
    setClockFreq(val);
    const newThermal = Number((38 + (val / 400) * 16.5).toFixed(1));
    setThermalLoad(newThermal);
    audioFx.playTick();
  };

  const handleDeviceChange = (dev) => {
    setDeviceType(dev);
    audioFx.playTick();
    if (dev === 'JETSON') {
      setClockFreq(625);
    } else if (dev === 'STM32') {
      setClockFreq(168);
    } else {
      setClockFreq(250);
    }
  };

  const handleAddCurrentToBasket = () => {
    audioFx.playSuccessChime();
    const itemTag =
      deviceType === 'JETSON'
        ? 'SBC-8821-JETSON'
        : deviceType === 'STM32'
        ? 'MCU-STM32-DISC'
        : 'RIG-8840-FPGA';

    const match = inventory?.find((i) => i.assetTag === itemTag) || {
      id: `dev-${Date.now()}`,
      assetTag: itemTag,
      nomenclature:
        deviceType === 'JETSON'
          ? 'NVIDIA Jetson Orin Nano Developer Kit'
          : deviceType === 'STM32'
          ? 'STM32F407G Discovery ARM Cortex-M4'
          : 'Xilinx Kintex-7 FPGA DSP Acceleration Board',
      coordinates: 'BAY-02 › RACK-04 › BIN-12',
      classification: 'Asset',
      quantity: 1,
    };

    addToBasket(match);
  };

  return (
    <div className="glass-panel-dark p-5 rounded-lg border border-white/10 w-full max-w-md shadow-2xl backdrop-blur-xl">
      {/* Device Selector Tabs */}
      <div className="flex items-center space-x-1 p-1 bg-black/60 rounded-md border border-white/10 mb-4 text-[10px] font-mono-tech">
        {[
          { id: 'FPGA', label: 'Kintex-7 FPGA' },
          { id: 'JETSON', label: 'Jetson Orin' },
          { id: 'STM32', label: 'STM32 Discovery' },
        ].map((d) => (
          <button
            key={d.id}
            onClick={() => handleDeviceChange(d.id)}
            className={`flex-1 py-1.5 px-2 rounded transition-all ${
              deviceType === d.id
                ? 'bg-[#c8963e] text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-[#c8963e]" />
          <span className="text-xs font-mono-tech tracking-wider text-zinc-300 uppercase">
            {deviceType === 'JETSON'
              ? 'SBC-8821 Telemetry'
              : deviceType === 'STM32'
              ? 'MCU-STM32 Telemetry'
              : 'RIG-8840 Telemetry Matrix'}
          </span>
        </div>
        <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          NIST CALIBRATED
        </span>
      </div>

      {/* Clock Frequency Slider */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-xs font-mono-tech">
          <span className="text-zinc-400">Core Clock Frequency:</span>
          <span className="text-[#c8963e] font-semibold">{clockFreq} MHz</span>
        </div>
        <input
          type="range"
          min={deviceType === 'JETSON' ? 300 : deviceType === 'STM32' ? 50 : 100}
          max={deviceType === 'JETSON' ? 1200 : deviceType === 'STM32' ? 240 : 400}
          step="10"
          value={clockFreq}
          onChange={handleFreqChange}
          className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#c8963e]"
        />
      </div>

      {/* Live Thermal Sensor Telemetry */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-2.5 rounded bg-zinc-900/60 border border-white/5">
          <div className="flex items-center space-x-1.5 text-[11px] text-zinc-400 mb-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Thermal Junction</span>
          </div>
          <div className="text-lg font-mono-tech text-zinc-100 font-semibold">
            {thermalLoad}°C
          </div>
        </div>

        <div className="p-2.5 rounded bg-zinc-900/60 border border-white/5">
          <div className="flex items-center space-x-1.5 text-[11px] text-zinc-400 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Bus Calibration</span>
          </div>
          <div className="text-lg font-mono-tech text-blue-400 font-semibold">
            ±0.02 ps
          </div>
        </div>
      </div>

      {/* Exploded View Slider */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-xs font-mono-tech">
          <span className="text-zinc-400 flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            <span>Exploded Assembly:</span>
          </span>
          <span className="text-zinc-300">{Math.round(exploded * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={exploded}
          onChange={(e) => {
            setExploded(Number(e.target.value));
            audioFx.playTick();
          }}
          className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            audioFx.playTick();
            setIsInspecting(!isInspecting);
          }}
          className={`py-2 px-3 rounded flex items-center justify-center space-x-1.5 text-xs font-mono-tech transition-all border ${
            isInspecting
              ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40'
              : 'bg-zinc-800/80 text-zinc-300 border-white/10 hover:border-[#c8963e]/40 hover:text-white'
          }`}
        >
          <Rotate3d className="w-3.5 h-3.5" />
          <span>{isInspecting ? 'Exit Orbit' : '360° Orbit'}</span>
        </button>

        <button
          onClick={handleAddCurrentToBasket}
          className="py-2 px-3 rounded flex items-center justify-center space-x-1.5 text-xs font-mono-tech bg-[#c8963e]/20 border border-[#c8963e]/40 text-[#c8963e] hover:bg-[#c8963e]/30 transition"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add to Basket</span>
        </button>
      </div>
    </div>
  );
}

/**
 * Dispatch & Rapid Barcode Counter Widget for Scene 05
 */
export function DispatchCounterWidget({
  isScanning,
  setIsScanning,
  isLocked,
  setIsLocked,
  onOpenDispatchModal,
}) {
  const [scanResult, setScanResult] = useState(null);

  const handleSimulateScan = () => {
    setIsScanning(true);
    audioFx.playScanBeep();

    setTimeout(() => {
      setIsScanning(false);
      setIsLocked(false);
      audioFx.playSolenoidClick();
      setScanResult({
        assetId: 'RIG-8840-FPGA',
        custodian: 'Team Hyperion (PRN: 2024881)',
        status: 'DISPATCH READY // CUSTODY APPROVED',
      });
    }, 1800);
  };

  return (
    <div className="glass-panel-dark p-5 rounded-lg border border-white/10 w-full max-w-md shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
        <div className="flex items-center space-x-2">
          <ScanLine className="w-4 h-4 text-[#c8963e]" />
          <span className="text-xs font-mono-tech tracking-wider text-zinc-300 uppercase">
            Counter Dispatch Terminal
          </span>
        </div>
        <span
          className={`text-[10px] font-mono-tech px-2 py-0.5 rounded border ${
            isLocked
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}
        >
          {isLocked ? 'SOLENOID LOCKED' : 'CUSTODY RELEASED'}
        </span>
      </div>

      <p className="text-xs text-zinc-400 leading-relaxed mb-4">
        Point optical barcode scanner at physical asset placard or input student PRN to verify supervisor authorization.
      </p>

      {scanResult ? (
        <div className="p-3 mb-4 rounded bg-emerald-950/20 border border-emerald-500/30 text-xs font-mono-tech space-y-1">
          <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{scanResult.status}</span>
          </div>
          <div className="text-zinc-300">Asset: {scanResult.assetId}</div>
          <div className="text-zinc-400">Recipient: {scanResult.custodian}</div>
        </div>
      ) : (
        <div className="p-3 mb-4 rounded bg-zinc-900/60 border border-white/5 text-xs font-mono-tech text-zinc-400 flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>Awaiting Optical Laser Sweep or PRN Input...</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleSimulateScan}
          disabled={isScanning}
          className="py-2 px-3 rounded text-xs font-mono-tech bg-[#c8963e]/15 border border-[#c8963e]/40 text-[#c8963e] hover:bg-[#c8963e]/25 transition flex items-center justify-center space-x-1.5"
        >
          <ScanLine className="w-3.5 h-3.5" />
          <span>{isScanning ? 'Sweeping...' : 'Trigger Laser Scan'}</span>
        </button>

        <button
          onClick={onOpenDispatchModal}
          className="py-2 px-3 rounded text-xs font-mono-tech bg-zinc-800 text-zinc-200 border border-white/10 hover:border-white/20 transition flex items-center justify-center space-x-1.5"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Manual PRN Lookup</span>
        </button>
      </div>
    </div>
  );
}
