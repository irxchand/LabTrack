import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLabData } from '../context/LabDataContext';
import {
  Boxes,
  Cpu,
  Layers,
  ShieldCheck,
  ScanLine,
  ArrowRight,
  Activity,
  CheckCircle2,
  Terminal,
  Lock,
  Radio,
  Sparkles,
  Search,
  Check,
  LogOut,
  ChevronRight,
  FileText,
  AlertCircle,
  Clock,
  Compass,
} from 'lucide-react';

export function HeroPage() {
  const navigate = useNavigate();
  const { currentUser, role, currentRole, switchRole, logout } = useAuth();
  const { basket, setIsBasketOpen, inventory } = useLabData();

  // Mouse tracking for subtle 3D perspective tilt on interactive hardware node
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [promptText, setPromptText] = useState('Allocate Jetson Nano 4GB to PRJ-AIML-08');
  const [promptSubmitted, setPromptSubmitted] = useState(false);
  const [activeStage, setActiveStage] = useState(0);

  const activeUserRole = currentRole || role || 'Student';

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handlePromptSubmit = (e) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    setPromptSubmitted(true);
    setTimeout(() => {
      navigate('/workspace/inventory');
    }, 600);
  };

  // 5-Stage Lifecycle Model (Replacing manual notebooks with complete digital lifecycle)
  const lifecycleStages = [
    {
      step: '01',
      title: 'Component Discovery',
      tagline: '2-Tier Stock Boundary Model',
      description:
        'Digitized catalogue separates serialized high-value capital assets (FPGAs, GPUs, logic analyzers) from bulk passive consumables (jumpers, sensors, breadboards). Real-time inventory status prevents duplicate ordering and manual notebook searches.',
      metrics: ['2-Tier Classification', 'Real-Time Stock Query', 'Sub-Zero Drift'],
      responsibleRole: 'Student / Research Team',
    },
    {
      step: '02',
      title: 'Faculty Endorsement',
      tagline: 'Supervisor Project Quota Governance',
      description:
        'Requisitions are cryptographically bound to approved academic projects. Faculty supervisors evaluate hardware necessity, project budget caps, and team return reliability before one-click endorsement.',
      metrics: ['Project Cap Enforcement', 'Cryptographic Audit Trail', 'Zero Paper Slips'],
      responsibleRole: 'Faculty Mentor / Supervisor',
    },
    {
      step: '03',
      title: 'Counter Dispatch',
      tagline: 'Optical Barcode & Custody Handshake',
      description:
        'The lab assistant executes physical fulfillment using high-speed optical barcode & RFID scanning. Verification of pre-existing cosmetic condition is timestamped before student checkout.',
      metrics: ['Optical Scanner Link', 'Sub-Second Handshake', 'Immutable Custody Transfer'],
      responsibleRole: 'Lab Assistant Depot Custodian',
    },
    {
      step: '04',
      title: 'Physical Return & Triage',
      tagline: 'Dual-State Return Verification',
      description:
        'Upon project completion, equipment undergoes bench inspection. Clean items immediately restock and notify waiting students in FIFO queues; defective items route to maintenance with automated incident logs.',
      metrics: ['Bench Inspection Checklist', 'FIFO Waitlist Release', 'Automated Damage Ledger'],
      responsibleRole: 'Lab Assistant & Maintenance Bench',
    },
    {
      step: '05',
      title: 'Reliability Index',
      tagline: 'Vector Accountability Scoring',
      description:
        'An empirical compliance score (0-100%) dynamically updates based on on-time return rate, equipment handling hygiene, and prompt defect reporting, ensuring university-wide hardware accountability.',
      metrics: ['Empirical 0-100% Score', 'Academic ESE Rubric Sync', 'Institutional Transparency'],
      responsibleRole: 'Department HoD & Auditors',
    },
  ];

  // Quad-Persona Institutional Matrix
  const personas = [
    {
      role: 'Student',
      title: 'Student Requester',
      headline: 'Project Team Workspace',
      description: 'Explore verified lab silicon, stage batch component requisitions, and track active loan countdowns.',
      route: '/workspace/inventory',
      badge: 'REQUEST CLEARANCE',
      capabilities: ['Hardware discovery & reservation', 'Project team requisition basket', 'Active loan deadline tracking'],
    },
    {
      role: 'Faculty',
      title: 'Faculty Mentor',
      headline: 'Supervisory Review Desk',
      description: 'Review student project hardware requests, endorse allocations, and inspect team reliability ratings.',
      route: '/workspace/operations/approvals',
      badge: 'ENDORSEMENT CLEARANCE',
      capabilities: ['Requisition queue authorization', 'Project allocation limits', 'Student accountability score review'],
    },
    {
      role: 'Lab Assistant',
      title: 'Lab Assistant',
      headline: 'Counter Dispatch Terminal',
      description: 'Physical equipment check-in/out station with optical barcode scanning, condition verification, and return triage.',
      route: '/workspace/operations/dispatch',
      badge: 'DISPATCH CLEARANCE',
      capabilities: ['Barcode/RFID physical issue', 'Return inspection checklist', 'Defect triage & maintenance routing'],
    },
    {
      role: 'HoD / Admin',
      title: 'HoD / Department Auditor',
      headline: 'Executive Governance Hub',
      description: 'Department-wide hardware valuation, reliability distribution analytics, and immutable cryptographic audit trails.',
      route: '/workspace/accountability/audit',
      badge: 'GOVERNANCE CLEARANCE',
      capabilities: ['Institutional asset valuation', 'NIST SP 800-53 audit ledger', 'System-wide policy configuration'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-inter selection:bg-[#a78b71] selection:text-black overflow-x-hidden relative select-none">
      {/* ───────────────────────────────────────────────────────────────── */}
      {/* AMBIENT LIGHTING & DOT GRID CANVAS                                */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-dots pointer-events-none z-0 opacity-25" />

      {/* Luminous Ambient Halos behind glass elements */}
      <div className="absolute top-20 left-1/4 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#c9b8a0]/15 via-[#a78b71]/10 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-96 right-1/4 translate-x-1/3 w-[700px] h-[700px] rounded-full bg-gradient-to-tl from-[#e8d5b7]/15 via-[#8a6845]/10 to-transparent blur-[160px] pointer-events-none -z-10" />

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 1. TOP FLOATING GLASS NAVIGATION BAR                              */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 h-20 px-6 lg:px-12 flex items-center justify-between bg-white/[0.02] backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        {/* Brand Block */}
        <div
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => navigate('/hero')}
        >
          <span className="font-clash text-2xl lg:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f5e6c8] to-[#c9b8a0] leading-none">
            LabTrack
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#c9b8a0] shadow-[0_0_12px_#c9b8a0] group-hover:scale-125 transition-transform" />
        </div>

        {/* Center Live Status Pill */}
        <div className="hidden lg:flex items-center space-x-3 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-stone-300 font-mono text-[11px] tracking-wider uppercase">
            1,420 HARDWARE NODES ONLINE
          </span>
          <span className="text-white/20">|</span>
          <span className="text-[#c9b8a0] font-mono text-[11px]">
            {activeUserRole.toUpperCase()} CLEARANCE
          </span>
        </div>

        {/* Right Persona & Action Controls */}
        <div className="flex items-center space-x-3">
          {/* Active Persona Pill */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#c9b8a0]/30 to-[#a78b71]/20 flex items-center justify-center font-bold text-[#f5e6c8] text-[11px]">
              {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
            </div>
            <div className="text-left font-sans leading-tight">
              <div className="text-[12px] font-medium text-white truncate max-w-[120px]">
                {currentUser?.name || 'Rahul Sharma'}
              </div>
              <div className="text-[10px] text-[#c9b8a0]/70 font-mono">
                {currentUser?.prn || '202401048'}
              </div>
            </div>
          </div>

          {/* Quick Role Switcher */}
          <div className="hidden md:flex items-center space-x-1 p-1 rounded-xl bg-white/[0.03] border border-white/10 text-[11px]">
            {['Student', 'Faculty', 'Lab Assistant', 'HoD / Admin'].map((r) => {
              const isSelected = activeUserRole === r;
              return (
                <button
                  key={r}
                  onClick={() => switchRole(r)}
                  className={`px-2.5 py-1 rounded-lg transition-all font-medium cursor-pointer ${
                    isSelected
                      ? 'bg-[#c9b8a0]/25 text-[#f5e6c8] border border-[#f5e6c8]/40 shadow-[0_0_15px_rgba(201,184,160,0.2)]'
                      : 'text-stone-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {r.split(' ')[0]}
                </button>
              );
            })}
          </div>

          {/* Enter Workstation Shell Button */}
          <button
            onClick={() => navigate('/workspace/inventory')}
            className="px-5 py-2 rounded-full text-black font-bold text-xs tracking-wide shadow-[0_4px_20px_rgba(167,139,113,0.35)] hover:shadow-[0_4px_25px_rgba(201,184,160,0.5)] transition-all cursor-pointer flex items-center space-x-1.5"
            style={{
              background: 'linear-gradient(to right, #a78b71 0%, #c9b8a0 50%, #e8d5b7 100%)',
            }}
          >
            <span>Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Sign Out Button */}
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="p-2 rounded-xl bg-white/[0.03] hover:bg-red-500/10 text-stone-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-all cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 2. HERO VISION SECTION                                            */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="relative z-10 pt-36 pb-20 px-6 lg:px-12 flex flex-col items-center justify-center text-center">
        {/* Subtle Eyebrow */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md text-[11px] font-mono uppercase tracking-[0.25em] text-[#c9b8a0] mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#e8d5b7]" />
          <span>PHYSICAL COMPUTING ARCHITECTURE</span>
        </div>

        {/* Master Headline */}
        <h1 className="font-clash text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-5xl mx-auto mb-6 leading-[1.08]">
          Hardware Lifecycle Orchestrated with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8d5b7] via-[#c9b8a0] to-[#a78b71]">
            Absolute Precision.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-stone-400 font-normal max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
          The collegiate hardware lifecycle unified. Eliminate manual notebook logs with verified component availability,
          cryptographic faculty endorsements, optical counter dispatch, and real-time reliability scoring.
        </p>

        {/* Dual Primary Action Gateway */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
          <button
            onClick={() => navigate('/workspace/inventory')}
            className="px-8 py-3.5 rounded-full text-black font-bold text-xs uppercase tracking-wider hover:brightness-105 transition-all shadow-[0_4px_30px_rgba(167,139,113,0.4)] cursor-pointer flex items-center space-x-2"
            style={{
              background: 'linear-gradient(to right, #a78b71 0%, #c9b8a0 50%, #e8d5b7 100%)',
            }}
          >
            <span>Launch Master Inventory</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#lifecycle-flow"
            className="px-8 py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-stone-300 hover:text-white font-medium text-xs uppercase tracking-wider transition-all backdrop-blur-md cursor-pointer flex items-center space-x-2"
          >
            <span>Explore 5-Stage Lifecycle</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* CENTRAL INTERACTIVE SILICON NODE & 4 FLOATING GLASS SATELLITES  */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full max-w-5xl mx-auto my-4 px-4"
        >
          {/* Dynamic SVG Bezier Lines connecting central node to satellites */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible hidden md:block"
            viewBox="0 0 1000 560"
            fill="none"
          >
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c9b8a0" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#a78b71" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <path
              d="M 500 280 C 350 200, 220 160, 120 100"
              stroke="url(#goldGradient)"
              strokeWidth="2"
              className="node-line pulsing-branch"
            />
            <path
              d="M 500 280 C 650 200, 780 160, 880 100"
              stroke="url(#goldGradient)"
              strokeWidth="2"
              className="node-line pulsing-branch"
            />
            <path
              d="M 500 280 C 380 380, 240 440, 140 480"
              stroke="url(#goldGradient)"
              strokeWidth="2"
              className="node-line pulsing-branch"
            />
            <path
              d="M 500 280 C 620 380, 760 440, 860 480"
              stroke="url(#goldGradient)"
              strokeWidth="2"
              className="node-line pulsing-branch"
            />
          </svg>

          {/* Central 16:9 Transparent Glass Card */}
          <div className="relative z-20 aspect-video w-full rounded-3xl bg-white/[0.03] backdrop-blur-2xl p-6 sm:p-10 flex flex-col justify-between overflow-hidden text-left border border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.35)]">
            {/* Top Bar of Central Node */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c9b8a0] animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[#c9b8a0]">
                  CENTRAL SILICON NODE // DSP-RIG-8840
                </span>
              </div>
              <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                ACTIVE TELEMETRY • L2-CB4-R2
              </span>
            </div>

            {/* Center Telemetry Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
              <div className="space-y-1">
                <div className="text-[11px] font-mono text-stone-500 uppercase tracking-wider">Device Architecture</div>
                <div className="text-xl sm:text-2xl font-clash font-bold text-white">NVIDIA Jetson Orin Nano</div>
                <div className="text-xs text-[#c9b8a0] font-mono">Serial: JET-ORIN-0104</div>
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-mono text-stone-500 uppercase tracking-wider">Operating Telemetry</div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-white">38.4°C / 62.5MHz</div>
                <div className="text-xs text-emerald-400 font-mono">Emissivity: Normal • 5V / 2.1A</div>
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-mono text-stone-500 uppercase tracking-wider">Custody State</div>
                <div className="text-xl sm:text-2xl font-clash font-bold text-[#f5e6c8]">Active Academic Loan</div>
                <div className="text-xs text-amber-400 font-mono">Due: 04h 12m Remaining</div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2 text-stone-400 font-mono">
                <Radio className="w-3.5 h-3.5 text-[#c9b8a0]" />
                <span>RFID TAG: AT-ESP-0104 // 100% TELEMETRY SYNC</span>
              </div>
              <button
                onClick={() => navigate('/workspace/inventory')}
                className="px-4 py-1.5 rounded-full bg-white/[0.05] hover:bg-[#c9b8a0] text-[#f5e6c8] hover:text-black font-medium transition-all flex items-center space-x-1.5 border border-white/15 cursor-pointer"
              >
                <span>Inspect Registry Node</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* 4 FLOATING GLASS SATELLITES (3D Perspective Tilt)             */}
          {/* ───────────────────────────────────────────────────────────── */}

          {/* SATELLITE 1: TELEMETRY SPARKLINE */}
          <div
            onClick={() => navigate('/workspace/custody')}
            style={{
              transform: `perspective(1000px) rotateX(${-mousePos.y * 14}deg) rotateY(${mousePos.x * 14}deg) translateZ(15px)`,
            }}
            className="satellite-card absolute -top-12 -left-8 z-30 w-72 bg-white/[0.04] backdrop-blur-2xl rounded-2xl p-4 text-left cursor-pointer border border-white/15 hidden md:block hover:border-[#c9b8a0]/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c9b8a0] font-bold">
                TELEMETRY SPARKLINE
              </div>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                STABLE
              </span>
            </div>
            <div className="font-clash text-base text-white font-bold mb-2">
              NVIDIA Jetson Nano
            </div>
            <div className="h-12 w-full bg-white/[0.02] rounded-xl border border-white/10 p-1 relative overflow-hidden flex items-end">
              <svg className="w-full h-full" viewBox="0 0 200 50" preserveAspectRatio="none">
                <path
                  d="M 0 40 Q 30 15, 60 25 T 120 10 T 170 30 T 200 15 L 200 50 L 0 50 Z"
                  fill="rgba(201, 184, 160, 0.15)"
                />
                <path
                  d="M 0 40 Q 30 15, 60 25 T 120 10 T 170 30 T 200 15"
                  fill="none"
                  stroke="#c9b8a0"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="mt-2 text-[10px] text-stone-400 font-mono flex items-center justify-between">
              <span>Drift: ±0.01%</span>
              <span className="text-amber-400 font-bold">4h left</span>
            </div>
          </div>

          {/* SATELLITE 2: HARDWARE KERNEL */}
          <div
            onClick={() => navigate('/workspace/projects')}
            style={{
              transform: `perspective(1000px) rotateX(${-mousePos.y * 14}deg) rotateY(${mousePos.x * 14}deg) translateZ(15px)`,
            }}
            className="satellite-card absolute -top-12 -right-8 z-30 w-72 bg-white/[0.04] backdrop-blur-2xl rounded-2xl p-4 text-left cursor-pointer border border-white/15 hidden md:block hover:border-[#c9b8a0]/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c9b8a0] font-bold">
                HARDWARE KERNEL
              </div>
              <div className="flex space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
            </div>
            <div className="font-mono text-xs text-stone-300 font-semibold mb-1.5">
              fpga_accelerator.v
            </div>
            <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 font-mono text-[10px] leading-relaxed text-stone-300">
              <div><span className="text-purple-400">module</span> <span className="text-[#f5e6c8]">accelerator</span> (</div>
              <div className="pl-2 text-stone-400">input <span className="text-blue-400">clk</span>, <span className="text-blue-400">rst_n</span>,</div>
              <div className="pl-2 text-stone-400">input [31:0] <span className="text-[#c9b8a0]">din</span></div>
              <div>);</div>
            </div>
            <div className="mt-2 text-[10px] text-stone-400 font-mono flex items-center justify-between">
              <span>Kintex-7 UltraScale+</span>
              <span className="text-[#c9b8a0]">Ready</span>
            </div>
          </div>

          {/* SATELLITE 3: OPTICAL SIGNAL BAY */}
          <div
            onClick={() => navigate('/workspace/operations/dispatch')}
            style={{
              transform: `perspective(1000px) rotateX(${-mousePos.y * 14}deg) rotateY(${mousePos.x * 14}deg) translateZ(15px)`,
            }}
            className="satellite-card absolute -bottom-10 -left-6 z-30 w-72 bg-white/[0.04] backdrop-blur-2xl rounded-2xl p-4 text-left cursor-pointer border border-white/15 hidden md:block hover:border-[#c9b8a0]/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c9b8a0] font-bold">
                SIGNAL BENCH
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="font-clash text-base text-white font-bold mb-2">
              Optical Solenoid Bay
            </div>
            <div className="h-10 w-full bg-black/40 rounded-xl border border-white/10 px-3 flex items-end justify-between py-1.5">
              {[40, 75, 45, 90, 65, 30, 85, 95, 40, 70, 80, 50, 65].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className="w-1.5 rounded-full bg-gradient-to-t from-[#a78b71] to-[#f5e6c8]"
                />
              ))}
            </div>
            <div className="mt-2 text-[10px] text-stone-400 font-mono flex items-center justify-between">
              <span>650nm Laser Latch</span>
              <span className="text-emerald-400 font-bold">LOCKED</span>
            </div>
          </div>

          {/* SATELLITE 4: DISPATCH CO-PILOT PROMPT */}
          <div
            style={{
              transform: `perspective(1000px) rotateX(${-mousePos.y * 14}deg) rotateY(${mousePos.x * 14}deg) translateZ(15px)`,
            }}
            className="satellite-card absolute -bottom-10 -right-6 z-30 w-80 bg-white/[0.04] backdrop-blur-2xl rounded-2xl p-4 text-left border border-white/15 hidden md:block"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c9b8a0] font-bold">
                CO-PILOT // PROMPT
              </div>
              <Sparkles className="w-3.5 h-3.5 text-[#f5e6c8]" />
            </div>
            <div className="font-clash text-base text-white font-bold mb-2">
              Natural Query Dispatch
            </div>
            <form onSubmit={handlePromptSubmit} className="relative flex items-center">
              <input
                type="text"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Ask hardware co-pilot..."
                className="w-full bg-black/60 border border-white/15 rounded-xl py-2 pl-3 pr-8 font-mono text-[10px] text-white placeholder-stone-500 focus:outline-none focus:border-[#c9b8a0]"
              />
              <button
                type="submit"
                className="absolute right-1.5 p-1 rounded-lg bg-[#c9b8a0] hover:bg-[#e8d5b7] text-black transition-colors cursor-pointer"
                title="Execute query"
              >
                <ArrowRight className="w-3 h-3" />
              </button>
            </form>
            <div className="mt-2 text-[10px] text-stone-400 font-mono flex items-center justify-between">
              <span>NLP Hardware Parser</span>
              <span className={promptSubmitted ? 'text-emerald-400 font-bold' : 'text-[#c9b8a0]'}>
                {promptSubmitted ? 'Query Dispatched!' : 'Press Enter'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 3. THE 5-STAGE HARDWARE LIFECYCLE ARCHITECTURE                     */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section id="lifecycle-flow" className="relative z-10 py-24 px-6 lg:px-12 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono uppercase tracking-widest text-[#c9b8a0] mb-3">
            <span>DIGITAL LIFECYCLE DISCIPLINE</span>
          </div>
          <h2 className="font-clash text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            From Manual Paper Notebooks to an Auditable Lifecycle.
          </h2>
          <p className="text-sm sm:text-base text-stone-400 max-w-2xl mx-auto font-normal font-sans">
            LabTrack eliminates manual notebooks, lost hardware, and unverified returns by turning physical lab handling into an immutable 5-stage workflow.
          </p>
        </div>

        {/* Stepper Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8">
          {lifecycleStages.map((stage, idx) => {
            const isActive = activeStage === idx;
            return (
              <button
                key={stage.step}
                onClick={() => setActiveStage(idx)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer backdrop-blur-xl ${
                  isActive
                    ? 'bg-[#c9b8a0]/20 border-[#f5e6c8]/60 shadow-[0_0_20px_rgba(201,184,160,0.25)]'
                    : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] text-stone-400'
                }`}
              >
                <div className="text-[10px] font-mono text-[#c9b8a0] font-bold mb-1">
                  STAGE {stage.step}
                </div>
                <div className={`font-clash text-sm font-bold truncate ${isActive ? 'text-white' : 'text-stone-300'}`}>
                  {stage.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Glass Card */}
        <div className="rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/20 p-8 sm:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.3)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-[#c9b8a0]">
                <span>STAGE {lifecycleStages[activeStage].step} ARCHITECTURAL SPECIFICATION</span>
              </div>
              <h3 className="font-clash text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {lifecycleStages[activeStage].title} —{' '}
                <span className="text-[#f5e6c8]">
                  {lifecycleStages[activeStage].tagline}
                </span>
              </h3>
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
                {lifecycleStages[activeStage].description}
              </p>

              <div className="pt-2 flex flex-wrap gap-2">
                {lifecycleStages[activeStage].metrics.map((m) => (
                  <span
                    key={m}
                    className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-[#f5e6c8]"
                  >
                    ✓ {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-black/50 border border-white/10 p-6 space-y-4 text-left">
              <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                GOVERNING AUTHORITY
              </div>
              <div className="text-base font-clash font-bold text-white">
                {lifecycleStages[activeStage].responsibleRole}
              </div>
              <div className="h-[1px] bg-white/10" />
              <div className="text-xs text-stone-400 font-mono leading-relaxed">
                Automated notification webhooks trigger upon stage progression, updating global inventory locks in sub-100ms.
              </div>
              <button
                onClick={() => navigate('/workspace/inventory')}
                className="w-full py-2.5 rounded-xl bg-white/[0.05] hover:bg-[#c9b8a0] text-[#f5e6c8] hover:text-black font-medium text-xs transition-all border border-white/15 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>Simulate in Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 4. THE QUAD-PERSONA CLEARANCE MATRIX                              */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-20 px-6 lg:px-12 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono uppercase tracking-widest text-[#c9b8a0] mb-3">
            <span>INSTITUTIONAL ROLES</span>
          </div>
          <h2 className="font-clash text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Engineered for Every Stakeholder in the Laboratory.
          </h2>
          <p className="text-sm sm:text-base text-stone-400 max-w-2xl mx-auto font-normal">
            Four tailored operational views ensure students, faculty supervisors, lab technicians, and department auditors work in complete synchronization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {personas.map((p) => {
            const isCurrent = activeUserRole === p.role;
            return (
              <div
                key={p.role}
                className={`rounded-3xl p-6 flex flex-col justify-between transition-all backdrop-blur-2xl border ${
                  isCurrent
                    ? 'bg-[#c9b8a0]/15 border-[#f5e6c8]/60 shadow-[0_15px_40px_rgba(201,184,160,0.2)]'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/[0.05]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[#c9b8a0]">
                      {p.badge}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>ACTIVE</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-clash text-xl font-bold text-white mb-1">
                    {p.title}
                  </h3>
                  <div className="text-xs text-[#c9b8a0] font-mono mb-3">
                    {p.headline}
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed mb-6 font-normal">
                    {p.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {p.capabilities.map((cap) => (
                      <div key={cap} className="flex items-start space-x-2 text-[11px] text-stone-300">
                        <span className="text-[#c9b8a0] mt-0.5">•</span>
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    switchRole(p.role);
                    navigate(p.route);
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                    isCurrent
                      ? 'bg-[#c9b8a0] text-black hover:bg-[#e8d5b7]'
                      : 'bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/15'
                  }`}
                >
                  <span>Launch {p.role.split(' ')[0]} Desk</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 5. EXECUTIVE WORKSTATION LAUNCHPAD                                */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-20 px-6 lg:px-12 max-w-6xl mx-auto">
        <div className="rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/20 p-8 sm:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.8)] text-center relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="font-clash text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Ready to Explore the Live Workstation?
            </h2>
            <p className="text-sm sm:text-base text-stone-400 font-normal">
              Enter the functional application environment. Query serialized hardware assets, build multi-item project requisitions, or test the optical return inspection station.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 text-left">
              {[
                { title: 'Master Registry', desc: 'Browse assets, FPGAs, and microcontrollers', path: '/workspace/inventory', icon: Boxes },
                { title: 'Custody Desk', desc: 'Active loans, return timers, and extensions', path: '/workspace/custody', icon: Clock },
                { title: 'Dispatch Terminal', desc: 'Optical barcode scan & return checklist', path: '/workspace/operations/dispatch', icon: Terminal },
                { title: 'Reliability Index', desc: 'Vector scores & immutable audit logs', path: '/workspace/accountability', icon: ShieldCheck },
              ].map((tile) => {
                const IconComponent = tile.icon;
                return (
                  <div
                    key={tile.title}
                    onClick={() => navigate(tile.path)}
                    className="p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#c9b8a0]/50 transition-all cursor-pointer group"
                  >
                    <IconComponent className="w-6 h-6 text-[#c9b8a0] mb-3 group-hover:scale-110 transition-transform" />
                    <div className="font-clash text-base font-bold text-white mb-1">
                      {tile.title}
                    </div>
                    <div className="text-xs text-stone-400 leading-tight">
                      {tile.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 6. APPLE-GRADE MINIMAL ENGINEERING FOOTER                        */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 py-12 px-6 lg:px-12 border-t border-white/10 text-center text-xs text-stone-500 font-mono">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-clash text-base font-bold text-stone-300">LabTrack</span>
            <span>— Hardware Lifecycle Platform</span>
          </div>
          <div>Department of AIML • Symbiosis Institute of Technology</div>
          <div className="text-stone-600">NIST SP 800-53 Audited</div>
        </div>
      </footer>
    </div>
  );
}

export default HeroPage;
