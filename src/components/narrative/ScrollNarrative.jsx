import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  ScanLine,
  Sliders,
  ChevronDown,
  Box,
  FileText,
  AlertTriangle,
  FolderGit2,
  Volume2,
  VolumeX,
  Download,
  Plus,
  Radio,
  FileSpreadsheet,
} from 'lucide-react';
import { TechnicalLeaderLine } from './TechnicalLeaderLine';
import { HardwareParamControls, DispatchCounterWidget } from './InteractiveWidgets';
import { useAuth } from '../../context/AuthContext';
import { useLabData } from '../../context/LabDataContext';
import { audioFx } from '../../utils/audioFx';

export function ScrollNarrative({
  onScrollProgress,
  onSceneChange,
  exploded,
  setExploded,
  isInspecting,
  setIsInspecting,
  isScanning,
  setIsScanning,
  isLocked,
  setIsLocked,
  deviceType,
  setDeviceType,
  thermalLoad,
  setThermalLoad,
  onOpenRequisitionDrawer,
  onOpenDispatchModal,
  onOpenReliabilityModal,
}) {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { currentRole, setRole, user } = useAuth();
  const { inventory, activeLoans, addToBasket, basket } = useLabData();

  const [isMuted, setIsMuted] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [simulatedOverdueDays, setSimulatedOverdueDays] = useState(0);
  const [selectedProject, setSelectedProject] = useState('HYPERION');

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0;
      onScrollProgress(progress);

      const sceneIndex = Math.min(Math.floor(progress * 9), 8);
      onSceneChange(sceneIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onScrollProgress, onSceneChange]);

  const toggleSound = () => {
    const muted = audioFx.toggleMute();
    setIsMuted(muted);
    if (!muted) audioFx.playScanBeep();
  };

  // Filter inventory for Scene 02 preview
  const displayInventory = (inventory || []).filter((item) =>
    activeCategory === 'All' ? true : item.classification === activeCategory
  );

  // Dynamic Reliability Calculation based on simulated penalty
  const calculatedReliability = Math.max((96.4 - simulatedOverdueDays * 4.8).toFixed(1), 50.0);

  // CSV Export Function for Scene 09
  const handleExportCSV = () => {
    audioFx.playSuccessChime();
    const headers = ['AssetTag', 'Nomenclature', 'Classification', 'Coordinates', 'Status', 'Quantity'];
    const rows = (inventory || []).map((i) => [
      i.assetTag,
      `"${i.nomenclature}"`,
      i.classification,
      `"${i.coordinates}"`,
      i.status,
      i.quantity || 1,
    ]);
    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `LabTrack_Inventory_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div ref={containerRef} className="relative z-10 text-white pointer-events-auto">
      {/* ───────────────────────────────────────────────────────────────── */}
      {/* TOP EDITORIAL NAVIGATION BAR (ORYZO-INSPIRED)                     */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/10 bg-black/75 backdrop-blur-md">
        {/* Brand & Department Badge */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c8963e] shadow-[0_0_8px_#c8963e]" />
            <span className="font-mono-tech tracking-widest text-sm font-bold text-white uppercase">
              LABTRACK
            </span>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-mono-tech text-zinc-400 border-l border-white/10 pl-4">
            DEPT. OF ELECTRICAL & COMPUTER ENGINEERING
          </span>
        </div>

        {/* Center Technical Coordinates */}
        <div className="hidden lg:flex items-center space-x-6 text-[11px] font-mono-tech text-zinc-400">
          <span className="flex items-center space-x-1.5">
            <span className="text-[#c8963e]">STAGE:</span>
            <span>WB-04 // NIST-TRACEABLE</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="text-[#c9b8a0]">STATUS:</span>
            <span>CIRCULATION ACTIVE</span>
          </span>
        </div>

        {/* Right Role Switcher, Audio Toggle & Action CTA */}
        <div className="flex items-center space-x-3">
          {/* Sound Synthesizer Toggle */}
          <button
            onClick={toggleSound}
            className="p-1.5 rounded bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition"
            title={isMuted ? 'Unmute Laboratory Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#c8963e]" />}
          </button>

          {/* Quick Role Segmented Switcher */}
          <div className="hidden md:flex items-center space-x-1 bg-zinc-900/80 p-1 rounded-md border border-white/10 text-[10px] font-mono-tech">
            {['Student', 'Faculty', 'Lab Assistant', 'HoD / Admin'].map((role) => (
              <button
                key={role}
                onClick={() => {
                  audioFx.playTick();
                  setRole(role);
                }}
                className={`px-2.5 py-1 rounded transition-colors ${
                  currentRole === role
                    ? 'bg-[#c8963e] text-black font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Requisition Basket Shortcut */}
          <button
            onClick={onOpenRequisitionDrawer}
            className="relative p-1.5 rounded-md bg-white/10 hover:bg-white/15 border border-white/10 text-white transition"
            title="Open Requisition Basket"
          >
            <Box className="w-4 h-4 text-[#c8963e]" />
            {basket?.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#c8963e] text-black text-[10px] font-mono-tech font-bold flex items-center justify-center">
                {basket.length}
              </span>
            )}
          </button>

          {/* Direct Workspace Launcher */}
          <button
            onClick={() => navigate('/workspace/inventory')}
            className="py-1.5 px-3 rounded text-xs font-mono-tech bg-white/10 border border-white/20 text-white hover:bg-white/20 transition flex items-center space-x-1.5"
          >
            <span>Console Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* SCENE 01 — LABORATORY AWAKENING (HERO)                            */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="min-h-screen px-6 lg:px-16 pt-36 pb-20 flex flex-col justify-between">
        <div className="max-w-4xl space-y-4">
          <div className="flex items-center space-x-3">
            <span className="editorial-tag">[ 01 // OVERVIEW ]</span>
            <div className="w-12 dashline-h" />
            <span className="text-xs font-mono-tech text-zinc-400">
              PHYSICAL ASSET MANAGEMENT INFRASTRUCTURE
            </span>
          </div>

          <h1 className="editorial-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white uppercase">
            Laboratory <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-300 to-zinc-500">
              Awakening.
            </span>
          </h1>

          <p className="text-base md:text-lg text-zinc-300 max-w-2xl font-light leading-relaxed pt-2">
            An institutional hardware lifecycle platform designed for precision collegiate engineering departments.
            Merging physical workbenches with verifiable digital custody, serialized telemetry, and supervisor accountability.
          </p>
        </div>

        {/* Micro-Telemetry Footer Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-white/10">
          <div>
            <div className="text-[10px] font-mono-tech text-zinc-500 uppercase">Hardware Assets</div>
            <div className="text-xl md:text-2xl font-mono-tech text-white font-semibold mt-1">
              {inventory?.length || 42} Units
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">MCUs, SBCs & Test Gear</div>
          </div>
          <div>
            <div className="text-[10px] font-mono-tech text-zinc-500 uppercase">Active Circulations</div>
            <div className="text-xl md:text-2xl font-mono-tech text-[#c9b8a0] font-semibold mt-1">
              {activeLoans?.length || 18} Active
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">0 Overdue Loans</div>
          </div>
          <div>
            <div className="text-[10px] font-mono-tech text-zinc-500 uppercase">Mean Reliability</div>
            <div className="text-xl md:text-2xl font-mono-tech text-[#c8963e] font-semibold mt-1">
              96.4%
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Exemplary Tier</div>
          </div>
          <div>
            <div className="text-[10px] font-mono-tech text-zinc-500 uppercase">Session PRN</div>
            <div className="text-xl md:text-2xl font-mono-tech text-zinc-300 font-semibold mt-1">
              {user?.prn || '2024881'}
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">{currentRole}</div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex items-center space-x-2 text-xs font-mono-tech text-zinc-500 pt-6">
          <ChevronDown className="w-4 h-4 animate-bounce text-[#c8963e]" />
          <span>Scroll to traverse physical workbench</span>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* SCENE 02 — THE LIVING INVENTORY                                   */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="min-h-screen px-6 lg:px-16 py-32 flex flex-col justify-center">
        <div className="max-w-2xl space-y-4">
          <div className="flex items-center space-x-3">
            <span className="editorial-tag">[ 02 // LIVING INVENTORY ]</span>
            <div className="w-12 dashline-h" />
            <span className="text-xs font-mono-tech text-zinc-400">
              SHELF COORDINATE MATRIX
            </span>
          </div>

          <h2 className="editorial-heading text-4xl md:text-6xl font-bold tracking-tight text-white uppercase">
            Physical Inventory. <br />
            <span className="text-[#c8963e]">Spatial Precision.</span>
          </h2>

          <p className="text-sm md:text-base text-zinc-300 font-light leading-relaxed">
            Every serialized microcontroller, mixed-signal scope, and logic analyzer is indexed down to rack coordinates.
            Filter by classification to preview real-time availability in the departmental depot:
          </p>

          {/* Interactive Category Selector Filter Chips */}
          <div className="flex flex-wrap gap-2 pt-2">
            {['All', 'Asset', 'Component', 'Consumable'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  audioFx.playTick();
                  setActiveCategory(cat);
                }}
                className={`px-3 py-1 rounded font-mono-tech text-xs transition ${
                  activeCategory === cat
                    ? 'bg-[#c8963e] text-black font-semibold shadow-md'
                    : 'bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                {cat === 'All' ? 'All Classes' : `${cat}s`}
              </button>
            ))}
          </div>

          {/* Real-time Hardware Inventory Mini-Stream */}
          <div className="max-h-52 overflow-y-auto divide-y divide-white/5 bg-zinc-950/60 border border-white/10 rounded-lg p-3 space-y-2">
            {displayInventory.slice(0, 4).map((item) => (
              <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs font-mono-tech">
                <div>
                  <div className="font-bold text-[#c8963e]">{item.assetTag}</div>
                  <div className="text-zinc-300">{item.nomenclature}</div>
                  <div className="text-[10px] text-zinc-500">{item.coordinates}</div>
                </div>
                <button
                  onClick={() => {
                    audioFx.playSuccessChime();
                    addToBasket(item);
                  }}
                  className="p-1.5 rounded bg-white/10 hover:bg-[#c8963e] hover:text-black transition"
                  title="Add to Custody Basket"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigate('/workspace/inventory')}
              className="py-2.5 px-4 rounded text-xs font-mono-tech bg-white/10 border border-white/20 text-white hover:bg-white/20 transition flex items-center space-x-2"
            >
              <span>Explore Complete Hardware Registry Table</span>
              <ArrowRight className="w-4 h-4 text-[#c8963e]" />
            </button>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* SCENE 03 — EQUIPMENT DEEP INSPECTION                              */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="min-h-screen px-6 lg:px-16 py-32 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="max-w-xl space-y-4">
          <div className="flex items-center space-x-3">
            <span className="editorial-tag">[ 03 // INSPECTION ]</span>
            <div className="w-12 dashline-h" />
            <span className="text-xs font-mono-tech text-zinc-400">
              {deviceType} DOSSIER & BUS TELEMETRY
            </span>
          </div>

          <h2 className="editorial-heading text-4xl md:text-6xl font-bold tracking-tight text-white uppercase">
            Micron-Level <br />
            <span className="text-zinc-400">Telemetry.</span>
          </h2>

          <p className="text-sm md:text-base text-zinc-300 font-light leading-relaxed">
            Close-up inspection of laboratory computing hardware. Select between the Kintex-7 FPGA, Jetson Orin Nano,
            or STM32 Discovery kit to inspect real-time junction thermal load, high-speed differential traces, and verified GPIO pin headers.
          </p>

          <div className="space-y-2 pt-2 text-xs font-mono-tech text-zinc-400">
            <div className="flex justify-between py-1.5 border-b border-white/10">
              <span>HARDWARE TARGET</span>
              <span className="text-white font-semibold">{deviceType}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/10">
              <span>ACTIVE JUNCTION THERMAL</span>
              <span className="text-amber-400 font-semibold">{thermalLoad}°C</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/10">
              <span>CALIBRATION PROTOCOL</span>
              <span className="text-[#c9b8a0]">NIST TRACEABLE // PASSED</span>
            </div>
          </div>
        </div>

        {/* Interactive Hardware Parameter Widget */}
        <div className="w-full lg:w-auto">
          <HardwareParamControls
            exploded={exploded}
            setExploded={setExploded}
            isInspecting={isInspecting}
            setIsInspecting={setIsInspecting}
            deviceType={deviceType}
            setDeviceType={setDeviceType}
            thermalLoad={thermalLoad}
            setThermalLoad={setThermalLoad}
            onAddToBasket={onOpenRequisitionDrawer}
          />
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* SCENE 04 — REQUISITION & RESERVATION                              */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="min-h-screen px-6 lg:px-16 py-32 flex flex-col justify-center">
        <div className="max-w-2xl space-y-4">
          <div className="flex items-center space-x-3">
            <span className="editorial-tag">[ 04 // REQUISITION ENGINE ]</span>
            <div className="w-12 dashline-h" />
            <span className="text-xs font-mono-tech text-zinc-400">
              MULTI-TIER APPROVAL PROTOCOL
            </span>
          </div>

          <h2 className="editorial-heading text-4xl md:text-6xl font-bold tracking-tight text-white uppercase">
            Custody Basket. <br />
            <span className="text-[#c9b8a0]">Supervisory Sign-Off.</span>
          </h2>

          <p className="text-sm md:text-base text-zinc-300 font-light leading-relaxed">
            Students assemble serialized hardware baskets bounded by research group limits.
            Faculty mentors digitally authenticate requisitions before the custodian releases physical hardware.
          </p>

          <div className="p-4 rounded-lg bg-zinc-900/80 border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono-tech">
              <span className="text-zinc-400">CURRENT PROJECT GROUP:</span>
              <span className="text-[#c8963e]">TEAM HYPERION (AERO-24)</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono-tech">
              <span className="text-zinc-400">HARDWARE QUOTA:</span>
              <span className="text-[#c9b8a0]">{basket?.length || 0} of 4 Assets in Staging Basket</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono-tech">
              <span className="text-zinc-400">SUPERVISOR MENTOR:</span>
              <span className="text-white">Dr. Robert Chen (ECE)</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-4">
            <button
              onClick={() => {
                audioFx.playTick();
                onOpenRequisitionDrawer();
              }}
              className="py-2.5 px-5 rounded text-xs font-mono-tech bg-[#c8963e] text-black font-semibold hover:bg-[#d8a64e] transition flex items-center space-x-2 shadow-lg"
            >
              <Box className="w-4 h-4" />
              <span>Review Custody Requisition Basket ({basket?.length || 0})</span>
            </button>

            <button
              onClick={() => navigate('/workspace/custody/requests')}
              className="py-2.5 px-4 rounded text-xs font-mono-tech bg-white/10 border border-white/20 text-white hover:bg-white/20 transition flex items-center space-x-1.5"
            >
              <span>View Active Request Queue</span>
            </button>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* SCENE 05 — COUNTER DISPATCH TERMINAL                              */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="min-h-screen px-6 lg:px-16 py-32 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="max-w-xl space-y-4">
          <div className="flex items-center space-x-3">
            <span className="editorial-tag">[ 05 // DISPATCH COUNTER ]</span>
            <div className="w-12 dashline-h" />
            <span className="text-xs font-mono-tech text-zinc-400">
              CUSTODIAN TERMINAL
            </span>
          </div>

          <h2 className="editorial-heading text-4xl md:text-6xl font-bold tracking-tight text-white uppercase">
            Rapid Optical <br />
            <span className="text-[#c8963e]">Barcode Check-in.</span>
          </h2>

          <p className="text-sm md:text-base text-zinc-300 font-light leading-relaxed">
            Lab assistants verify student PRN credentials, scan physical asset tags under the optical laser beam,
            and release the electronic solenoid custody lock in seconds.
          </p>

          <div className="space-y-2 pt-2 text-xs font-mono-tech text-zinc-400">
            <div className="flex items-center space-x-2 text-[#c9b8a0]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Zero paper registers: 100% auditable timestamped checkout.</span>
            </div>
            <div className="flex items-center space-x-2 text-zinc-300">
              <Clock className="w-4 h-4 text-[#c8963e]" />
              <span>Real-time countdown timer to due date (7-day default loan period).</span>
            </div>
          </div>
        </div>

        {/* Interactive Dispatch Scanner Widget */}
        <div className="w-full lg:w-auto">
          <DispatchCounterWidget
            isScanning={isScanning}
            setIsScanning={setIsScanning}
            isLocked={isLocked}
            setIsLocked={setIsLocked}
            onOpenDispatchModal={onOpenDispatchModal}
          />
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* SCENE 06 — ACCOUNTABILITY & RELIABILITY TELEMETRY                 */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="min-h-screen px-6 lg:px-16 py-32 flex flex-col justify-center">
        <div className="max-w-2xl space-y-4">
          <div className="flex items-center space-x-3">
            <span className="editorial-tag">[ 06 // ACCOUNTABILITY ]</span>
            <div className="w-12 dashline-h" />
            <span className="text-xs font-mono-tech text-zinc-400">
              RELIABILITY SCORECARD
            </span>
          </div>

          <h2 className="editorial-heading text-4xl md:text-6xl font-bold tracking-tight text-white uppercase">
            Student Reliability. <br />
            <span className="text-[#c9b8a0]">{calculatedReliability} / 100 Score.</span>
          </h2>

          <p className="text-sm md:text-base text-zinc-300 font-light leading-relaxed">
            Every loan, on-time return, and incident condition report contributes to the student’s compliance rating.
            Students in Exemplary standing enjoy expanded allocation quotas.
          </p>

          {/* Interactive Penalty Simulator Slider */}
          <div className="p-4 rounded-lg bg-zinc-900 border border-white/10 space-y-3">
            <div className="flex justify-between text-xs font-mono-tech">
              <span className="text-zinc-400">Test Audit Penalty Simulation:</span>
              <span className="text-rose-400 font-bold">{simulatedOverdueDays} Days Overdue</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={simulatedOverdueDays}
              onChange={(e) => {
                setSimulatedOverdueDays(Number(e.target.value));
                audioFx.playTick();
              }}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="text-[11px] font-mono-tech text-zinc-500">
              Each day overdue deducts 4.8 penalty points and revokes priority reservation status.
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded bg-zinc-900 border border-white/10">
              <div className="text-[10px] font-mono-tech text-zinc-400 uppercase">Standing</div>
              <div className="text-base font-mono-tech text-[#c9b8a0] font-semibold mt-1">
                {calculatedReliability >= 90 ? 'Exemplary' : calculatedReliability >= 75 ? 'Standard' : 'Probation'}
              </div>
            </div>
            <div className="p-3 rounded bg-zinc-900 border border-white/10">
              <div className="text-[10px] font-mono-tech text-zinc-400 uppercase">On-Time Rate</div>
              <div className="text-base font-mono-tech text-white font-semibold mt-1">98.2%</div>
            </div>
            <div className="p-3 rounded bg-zinc-900 border border-white/10">
              <div className="text-[10px] font-mono-tech text-zinc-400 uppercase">Simulated Penalty</div>
              <div className="text-base font-mono-tech text-rose-400 font-semibold mt-1">
                -{(simulatedOverdueDays * 4.8).toFixed(1)} Pts
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={onOpenReliabilityModal}
              className="py-2.5 px-4 rounded text-xs font-mono-tech bg-white/10 border border-white/20 text-white hover:bg-white/20 transition flex items-center space-x-2"
            >
              <span>View Full Student Compliance Dossier</span>
              <ArrowRight className="w-4 h-4 text-[#c9b8a0]" />
            </button>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* SCENE 07 — ACADEMIC PROJECT CLUSTERS                              */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="min-h-screen px-6 lg:px-16 py-32 flex flex-col justify-center">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center space-x-3">
            <span className="editorial-tag">[ 07 // RESEARCH CLUSTERS ]</span>
            <div className="w-12 dashline-h" />
            <span className="text-xs font-mono-tech text-zinc-400">
              CAPSTONE & FACULTY INITIATIVES
            </span>
          </div>

          <h2 className="editorial-heading text-4xl md:text-6xl font-bold tracking-tight text-white uppercase">
            Project Cohorts. <br />
            <span className="text-zinc-400">Hardware Allocation.</span>
          </h2>

          <p className="text-sm md:text-base text-zinc-300 font-light leading-relaxed">
            Hardware allocations bind directly to academic courses and research initiatives.
            Select a project cohort to inspect active custody quotas and assigned equipment:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div
              onClick={() => {
                audioFx.playTick();
                setSelectedProject('HYPERION');
              }}
              className={`p-4 rounded-lg border transition cursor-pointer space-y-2 ${
                selectedProject === 'HYPERION'
                  ? 'bg-zinc-900 border-[#c8963e] shadow-lg'
                  : 'bg-zinc-900/60 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-tech font-bold text-white">TEAM HYPERION (AERO-24)</span>
                <span className="text-[10px] font-mono-tech text-[#c9b8a0]">ACTIVE</span>
              </div>
              <p className="text-xs text-zinc-400">Autonomous Quadrotor VTOL Flight Computer</p>
              <div className="text-[11px] font-mono-tech text-zinc-500 pt-1">
                Hardware: Jetson Orin Nano, BNO085 IMU, LiPo Pack
              </div>
            </div>

            <div
              onClick={() => {
                audioFx.playTick();
                setSelectedProject('NEURAL');
              }}
              className={`p-4 rounded-lg border transition cursor-pointer space-y-2 ${
                selectedProject === 'NEURAL'
                  ? 'bg-zinc-900 border-[#c8963e] shadow-lg'
                  : 'bg-zinc-900/60 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-tech font-bold text-white">NEURAL-SOC (ECE-492)</span>
                <span className="text-[10px] font-mono-tech text-[#c9b8a0]">ACTIVE</span>
              </div>
              <p className="text-xs text-zinc-400">Edge TPU Neural Accelerator Synthesis</p>
              <div className="text-[11px] font-mono-tech text-zinc-500 pt-1">
                Hardware: Kintex-7 FPGA DSP Rig, Logic Pro 16
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => navigate('/workspace/projects/overview')}
              className="py-2.5 px-4 rounded text-xs font-mono-tech bg-white/10 border border-white/20 text-white hover:bg-white/20 transition flex items-center space-x-1.5"
            >
              <span>Explore All Academic Project Profiles</span>
              <ArrowRight className="w-4 h-4 text-[#c8963e]" />
            </button>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* SCENE 08 — DEFECT TRIAGE & QUARANTINE                             */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="min-h-screen px-6 lg:px-16 py-32 flex flex-col justify-center">
        <div className="max-w-2xl space-y-4">
          <div className="flex items-center space-x-3">
            <span className="editorial-tag text-rose-400">[ 08 // DEFECT TRIAGE ]</span>
            <div className="w-12 dashline-h" />
            <span className="text-xs font-mono-tech text-zinc-400">
              FAULT ISOLATION & RMA ROUTING
            </span>
          </div>

          <h2 className="editorial-heading text-4xl md:text-6xl font-bold tracking-tight text-white uppercase">
            Quarantine Bench. <br />
            <span className="text-rose-500">Defect Triage.</span>
          </h2>

          <p className="text-sm md:text-base text-zinc-300 font-light leading-relaxed">
            Damaged, degraded, or calibration-expired hardware is locked from circulation instantly.
            Lab technicians trace fault origin, assign repair status, or decommission retired units.
          </p>

          <div className="p-4 rounded-lg bg-rose-950/20 border border-rose-500/20 text-xs font-mono-tech space-y-2">
            <div className="flex items-center justify-between text-rose-400 font-semibold">
              <span className="flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>ACTIVE QUARANTINE CASE: DEF-2026-08</span>
              </span>
              <span>SEVERITY: DEGRADED</span>
            </div>
            <div className="text-zinc-300">Target: STM32F4-DISC-02 (MCU Discovery Kit)</div>
            <div className="text-zinc-400">Diagnosis: GPIO Pin PA5 Overcurrent Burnout. Routed to SMD Rework Station.</div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => navigate('/workspace/operations/defects')}
              className="py-2.5 px-4 rounded text-xs font-mono-tech bg-white/10 border border-white/20 text-white hover:bg-white/20 transition flex items-center space-x-1.5"
            >
              <span>Open Defect Maintenance Desk</span>
              <ArrowRight className="w-4 h-4 text-rose-400" />
            </button>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* SCENE 09 — INTEGRATED COMMAND CENTRE DOCK (FOOTER)                */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="min-h-screen px-6 lg:px-16 py-32 flex flex-col justify-between">
        <div className="max-w-4xl space-y-4">
          <div className="flex items-center space-x-3">
            <span className="editorial-tag">[ 09 // RESOLUTION ]</span>
            <div className="w-12 dashline-h" />
            <span className="text-xs font-mono-tech text-zinc-400">
              SYSTEM COMMAND REPERTORY
            </span>
          </div>

          <h2 className="editorial-heading text-4xl md:text-7xl font-bold tracking-tight text-white uppercase">
            Complete Hardware <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c8963e] to-amber-200">
              Orchestration.
            </span>
          </h2>

          <p className="text-base text-zinc-300 max-w-2xl font-light leading-relaxed">
            The physical laboratory digitized. Access all institutional modules, role-gated execution desks,
            and export data directly from the unified LabTrack workspace.
          </p>

          <div className="pt-2">
            <button
              onClick={handleExportCSV}
              className="py-2 px-4 rounded text-xs font-mono-tech bg-[#c8963e]/20 border border-[#c8963e]/40 text-[#c8963e] hover:bg-[#c8963e]/30 transition flex items-center space-x-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Official Inventory Audit (CSV)</span>
            </button>
          </div>
        </div>

        {/* Full Module Deep Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-12 border-t border-white/10">
          <div
            onClick={() => navigate('/workspace/inventory')}
            className="p-5 rounded-lg bg-zinc-900/60 border border-white/10 hover:border-[#c8963e]/40 hover:bg-zinc-900/90 transition cursor-pointer group"
          >
            <div className="text-xs font-mono-tech text-[#c8963e] mb-1">MODULE 01</div>
            <div className="text-base font-semibold text-white group-hover:text-[#c8963e] transition">
              Hardware Registry
            </div>
            <p className="text-xs text-zinc-400 mt-1">Serialized MCUs, Test Gear, and Storage Coordinates</p>
          </div>

          <div
            onClick={() => navigate('/workspace/custody/active')}
            className="p-5 rounded-lg bg-zinc-900/60 border border-white/10 hover:border-[#c9b8a0]/40 hover:bg-zinc-900/90 transition cursor-pointer group"
          >
            <div className="text-xs font-mono-tech text-[#c9b8a0] mb-1">MODULE 02</div>
            <div className="text-base font-semibold text-white group-hover:text-[#c9b8a0] transition">
              Custody Circulation
            </div>
            <p className="text-xs text-zinc-400 mt-1">Active loans, due-date countdowns, and return logs</p>
          </div>

          <div
            onClick={() => navigate('/workspace/operations/dispatch')}
            className="p-5 rounded-lg bg-zinc-900/60 border border-white/10 hover:border-blue-500/40 hover:bg-zinc-900/90 transition cursor-pointer group"
          >
            <div className="text-xs font-mono-tech text-blue-400 mb-1">MODULE 03</div>
            <div className="text-base font-semibold text-white group-hover:text-blue-400 transition">
              Dispatch Terminal
            </div>
            <p className="text-xs text-zinc-400 mt-1">Custodian counter desk, barcode scanner, and PRN check-in</p>
          </div>
        </div>

        {/* Institutional Footer Metadata */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs font-mono-tech text-zinc-500 gap-4">
          <div>
            LABTRACK // DEPT OF ELECTRICAL & COMPUTER ENGINEERING © 2026. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#c9b8a0]" />
              <span className="text-zinc-400">DATABASE: POSTGRESQL CONNECTED</span>
            </span>
            <span>LATENCY: 14ms</span>
          </div>
        </div>
      </section>
    </div>
  );
}
