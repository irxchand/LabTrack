import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BookmarkCheck,
  ChevronDown,
  Clock,
  Cpu,
  FolderGit2,
  Globe,
  Inbox,
  Lock,
  Radio,
  Server,
  Shield,
  Terminal,
  Zap,
} from 'lucide-react';

export function HeroPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dispatch'); // 'dispatch' | 'telemetry' | 'custody'
  const [digestEmail, setDigestEmail] = useState('');
  const [digestSubscribed, setDigestSubscribed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroContainerRef = useRef(null);

  // Subtle interactive parallax coordinates
  const handleMouseMove = (e) => {
    if (!heroContainerRef.current) return;
    const rect = heroContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleDigestSubmit = (e) => {
    e.preventDefault();
    if (digestEmail.trim()) {
      setDigestSubscribed(true);
      setTimeout(() => {
        setDigestSubscribed(false);
        setDigestEmail('');
      }, 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#a78b71] selection:text-black overflow-x-hidden relative font-sans">
      {/* ─────────────────────────────────────────────────────────────────────────
          RADIAL DOT GRID BACKGROUND
      ───────────────────────────────────────────────────────────────────────── */}
      <div className="fixed inset-0 bg-dots pointer-events-none z-0" />

      {/* Subtle Central Ambient Glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#a78b71]/[0.035] blur-[150px] pointer-events-none z-0" />

      {/* ─────────────────────────────────────────────────────────────────────────
          FIXED TOP NAVBAR (Matching LabTrack Brand Typography)
      ───────────────────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-[10px] bg-[#0a0a0a]/80 border-b border-white/10 px-6 sm:px-12 h-20 flex items-center justify-between transition-all duration-300">
        {/* Left: Brand Monogram in Clash Display with Champagne Gold Gradient */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 cursor-pointer group select-none"
        >
          <span className="font-display font-bold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f5e6c8] to-[#c9b8a0] leading-none">
            LabTrack
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#c9b8a0] shadow-[0_0_10px_#c9b8a0]" />
        </div>

        {/* Center: Real LabTrack Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-medium tracking-[0.25em] text-white/70 uppercase">
          <a
            href="#hardware-mesh"
            className="hover:text-[#e8d5b7] transition-colors duration-200"
          >
            Hardware Mesh
          </a>
          <a
            href="#capabilities"
            className="hover:text-[#e8d5b7] transition-colors duration-200"
          >
            Capabilities
          </a>
          <button
            onClick={() => navigate('/workspace/inventory')}
            className="hover:text-[#e8d5b7] transition-colors duration-200 text-left cursor-pointer"
          >
            Registry
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#c9b8a0] hover:text-white transition-colors px-3 py-1.5 hidden sm:inline-block cursor-pointer"
          >
            Sign In
          </button>
          {/* 'Enter Workspace' Pill Button */}
          <button
            onClick={() => navigate('/workspace')}
            className="bg-white text-black font-semibold text-xs tracking-wider uppercase px-5 py-2.5 rounded-full hover:bg-[#e8d5b7] transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.18)] hover:shadow-[0_0_30px_rgba(232,213,183,0.4)] cursor-pointer"
          >
            Enter Workspace
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────────────────
          HERO SECTION
      ───────────────────────────────────────────────────────────────────────── */}
      <section
        id="hardware-mesh"
        ref={heroContainerRef}
        onMouseMove={handleMouseMove}
        className="relative pt-36 pb-28 px-6 sm:px-12 flex flex-col items-center z-10 min-h-screen"
      >


        {/* Headline: Matched to Clash Display (Website Font DNA) */}
        <h1
          className="font-display font-bold tracking-tight text-white leading-[1.04] text-center max-w-5xl mx-auto mb-6"
          style={{ fontSize: 'clamp(2.5rem, 6.5vw, 5.5rem)' }}
        >
          Autonomous Hardware Custody &{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8d5b7] via-[#c9b8a0] to-[#a78b71]">
            Lab Telemetry
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-gray-400 text-base sm:text-lg font-normal text-center max-w-2xl mx-auto mb-10 leading-relaxed tracking-wide font-sans">
          The unified operating system for academic laboratories. Real-time instrument
          tracking, student capstone requisitions, bench custody countdowns, and
          zero-trust hardware dispatch.
        </p>

        {/* Dual-Button CTA Group */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
          {/* Solid White CTA */}
          <button
            onClick={() => navigate('/workspace')}
            className="bg-white text-[#0a0a0a] px-8 py-3.5 rounded-full font-semibold text-sm tracking-wider uppercase hover:bg-[#e8d5b7] transition-all duration-300 shadow-[0_0_35px_rgba(255,255,255,0.22)] hover:shadow-[0_0_40px_rgba(232,213,183,0.45)] flex items-center gap-2 cursor-pointer group"
          >
            <span>Enter Lab Workspace</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          {/* Bordered CTA */}
          <a
            href="#capabilities"
            className="border border-white/20 hover:border-[#a78b71] bg-white/[0.02] text-white px-8 py-3.5 rounded-full font-medium text-sm tracking-wider uppercase hover:text-[#e8d5b7] transition-all duration-300 backdrop-blur-[10px] flex items-center gap-2 cursor-pointer group"
          >
            <span>Browse Capabilities</span>
            <ChevronDown className="w-4 h-4 text-[#a78b71] group-hover:translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────
            AUTONOMOUS HARDWARE MESH & TELEMETRY HUB (Responsive 3-Column Cockpit)
        ───────────────────────────────────────────────────────────────────── */}
        <div className="relative w-full max-w-[1360px] mx-auto mt-4 px-2 sm:px-4 z-10">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-0 w-full">
            {/* ── LEFT SATELLITE COLUMN ── */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-6 w-full lg:w-[270px] xl:w-[290px] shrink-0 justify-between">
              {/* Satellite 1: Top-Left (FPGA) */}
              <div
                onClick={() => navigate('/workspace/inventory')}
                className="w-full gold-glass-card rounded-[22px] p-3 hover:-translate-y-1 hover:border-[#a78b71]/50 hover:shadow-[0_0_30px_rgba(167,139,113,0.25)] transition-all duration-300 cursor-pointer group relative overflow-hidden"
              >
                <div className="rounded-[14px] overflow-hidden aspect-video relative mb-3 bg-neutral-900 border border-white/5">
                  <img
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80"
                    alt="Xilinx Artix-7 FPGA"
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-[9px] font-mono text-[#c9b8a0]">
                    BENCH 04 // FPGA
                  </div>
                </div>
                <div className="px-1">
                  <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-neutral-400 uppercase mb-1">
                    <span>Xilinx Artix-7</span>
                    <span className="text-emerald-400 bg-emerald-400/10 px-1.5 py-0.2 rounded border border-emerald-400/20 font-semibold">
                      DISPATCHED
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-white group-hover:text-[#e8d5b7] transition-colors truncate">
                    100T CSG324 • PRN 202401048
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono mt-0.5 truncate">
                    Vivado HW Server • Port 3121
                  </div>
                </div>
                {/* Port anchor dot on right edge connecting to bus */}
                <div className="hidden lg:block absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#e8d5b7] shadow-[0_0_8px_#e8d5b7]" />
              </div>

              {/* Satellite 2: Bottom-Left (Jetson Orin) */}
              <div
                onClick={() => navigate('/workspace/custody/active')}
                className="w-full gold-glass-card rounded-[22px] p-3 hover:-translate-y-1 hover:border-[#a78b71]/50 hover:shadow-[0_0_30px_rgba(167,139,113,0.25)] transition-all duration-300 cursor-pointer group relative overflow-hidden"
              >
                <div className="rounded-[14px] overflow-hidden aspect-video relative mb-3 bg-neutral-900 border border-white/5">
                  <img
                    src="https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80"
                    alt="NVIDIA Jetson Orin Nano"
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-[9px] font-mono text-[#c9b8a0]">
                    DISPATCH // JETSON ORIN
                  </div>
                </div>
                <div className="px-1">
                  <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-neutral-400 uppercase mb-1">
                    <span>Jetson Orin Nano</span>
                    <span className="text-emerald-400 bg-emerald-400/10 px-1.5 py-0.2 rounded border border-emerald-400/20 font-semibold">
                      BENCH #08
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-white group-hover:text-[#e8d5b7] transition-colors truncate">
                    Autonomous Robotics Unit
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono mt-0.5 truncate">
                    CUDA 12.2 • JetPack 6.0 Deploy
                  </div>
                </div>
                {/* Port anchor dot on right edge connecting to bus */}
                <div className="hidden lg:block absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#e8d5b7] shadow-[0_0_8px_#e8d5b7]" />
              </div>
            </div>

            {/* ── LEFT TELEMETRY BUS CONNECTORS (Desktop) ── */}
            <div className="hidden lg:flex w-12 xl:w-16 h-[540px] shrink-0 relative items-center justify-center">
              <svg
                className="w-full h-full overflow-visible pointer-events-none"
                viewBox="0 0 64 540"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="goldGradientLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#c9b8a0" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#a78b71" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                {/* Upper Bus: Top Satellite (y: 130) to Center Console Top Port (y: 175) */}
                <path
                  d="M 0 130 C 32 130, 32 175, 64 175"
                  stroke="url(#goldGradientLeft)"
                  strokeWidth="2"
                  className="node-line"
                />
                <path
                  d="M 0 130 C 32 130, 32 175, 64 175"
                  stroke="#e8d5b7"
                  strokeWidth="1.5"
                  className="flow-dash"
                />
                <circle cx="0" cy="130" r="3.5" fill="#e8d5b7" />
                <circle cx="64" cy="175" r="3.5" fill="#e8d5b7" />
                <text x="32" y="142" textAnchor="middle" fill="#c9b8a0" fontSize="7.5" fontFamily="monospace" letterSpacing="0.1em">
                  BUS A
                </text>

                {/* Lower Bus: Bottom Satellite (y: 410) to Center Console Bottom Port (y: 365) */}
                <path
                  d="M 0 410 C 32 410, 32 365, 64 365"
                  stroke="url(#goldGradientLeft)"
                  strokeWidth="2"
                  className="node-line"
                />
                <path
                  d="M 0 410 C 32 410, 32 365, 64 365"
                  stroke="#e8d5b7"
                  strokeWidth="1.5"
                  className="flow-dash"
                />
                <circle cx="0" cy="410" r="3.5" fill="#e8d5b7" />
                <circle cx="64" cy="365" r="3.5" fill="#e8d5b7" />
                <text x="32" y="398" textAnchor="middle" fill="#c9b8a0" fontSize="7.5" fontFamily="monospace" letterSpacing="0.1em">
                  BUS B
                </text>
              </svg>
            </div>

            {/* ── CENTRAL CONSOLE HUB ── */}
            <div className="w-full lg:flex-1 max-w-[660px] xl:max-w-[700px] gold-glass-card rounded-[28px] sm:rounded-[32px] p-5 sm:p-7 central-glow flex flex-col justify-between relative border border-white/15 min-h-[540px] overflow-hidden my-2 lg:my-0 z-10">
              {/* Inner ambient glow */}
              <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#a78b71]/15 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#a78b71]/10 blur-3xl pointer-events-none" />

              {/* Hardware I/O Port Indicators on Left & Right Borders */}
              <div className="hidden lg:flex absolute -left-1 top-[168px] w-2 h-3.5 bg-[#e8d5b7] rounded-r-sm items-center justify-center shadow-[0_0_6px_#e8d5b7]" />
              <div className="hidden lg:flex absolute -left-1 top-[358px] w-2 h-3.5 bg-[#e8d5b7] rounded-r-sm items-center justify-center shadow-[0_0_6px_#e8d5b7]" />
              <div className="hidden lg:flex absolute -right-1 top-[168px] w-2 h-3.5 bg-[#e8d5b7] rounded-l-sm items-center justify-center shadow-[0_0_6px_#e8d5b7]" />
              <div className="hidden lg:flex absolute -right-1 top-[358px] w-2 h-3.5 bg-[#e8d5b7] rounded-l-sm items-center justify-center shadow-[0_0_6px_#e8d5b7]" />

              {/* Console Header */}
              <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 relative z-10 gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center w-3 h-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c9b8a0] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e8d5b7]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#a78b71]">
                        AIML LAB // HARDWARE HUB
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                        ONLINE
                      </span>
                    </div>
                    <div className="text-sm sm:text-base font-bold tracking-wide text-white font-display">
                      Hardware Custody & Telemetry Console
                    </div>
                  </div>
                </div>

                {/* Sub-node tabs */}
                <div className="flex items-center bg-black/60 p-1 rounded-full border border-white/10 text-[10px] font-mono">
                  <button
                    onClick={() => setActiveTab('dispatch')}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer font-medium ${
                      activeTab === 'dispatch'
                        ? 'bg-[#a78b71] text-black font-semibold shadow-[0_0_12px_rgba(167,139,113,0.5)]'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    DISPATCH
                  </button>
                  <button
                    onClick={() => setActiveTab('telemetry')}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer font-medium ${
                      activeTab === 'telemetry'
                        ? 'bg-[#a78b71] text-black font-semibold shadow-[0_0_12px_rgba(167,139,113,0.5)]'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    TELEMETRY
                  </button>
                  <button
                    onClick={() => setActiveTab('custody')}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer font-medium ${
                      activeTab === 'custody'
                        ? 'bg-[#a78b71] text-black font-semibold shadow-[0_0_12px_rgba(167,139,113,0.5)]'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    CUSTODY
                  </button>
                </div>
              </div>

              {/* Console Body: All 3 Tabs */}
              <div className="my-auto py-4 relative z-10">
                {/* ── TAB 1: CUSTODY (Dense Zero-Trust Hardware Ledger) ── */}
                {activeTab === 'custody' && (
                  <div className="space-y-3.5 font-mono">
                    {/* Active Session Banner */}
                    <div className="bg-black/50 p-3 rounded-2xl border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#a78b71]/15 border border-[#a78b71]/30 flex items-center justify-center text-[#e8d5b7]">
                          <Shield className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-white text-xs font-semibold flex items-center gap-2">
                            <span>Keysight DSOX1204G (4-Ch 70MHz)</span>
                            <span className="text-[9px] text-[#c9b8a0] bg-white/5 px-1.5 py-0.2 rounded border border-white/10">
                              TAG #EE-042
                            </span>
                          </div>
                          <div className="text-[10px] text-neutral-400 mt-0.5">
                            Asset ID: LT-HW-2024-0891 • Locker Bay B-04
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 px-2 py-0.5 rounded-full font-semibold inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          IN BENCH CUSTODY
                        </span>
                      </div>
                    </div>

                    {/* Custody Chain 4-Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      {/* Custody Cell 1: Requisitioner */}
                      <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                        <div className="text-[9px] text-neutral-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                          <span>REQUISITIONER</span>
                          <span className="text-emerald-400 font-bold">RFID VERIFIED</span>
                        </div>
                        <div className="text-white font-medium text-[11px] truncate">Rahul Sharma</div>
                        <div className="text-[10px] text-neutral-400 truncate">PRN: 202401048 • Final Year AIML</div>
                      </div>

                      {/* Custody Cell 2: Faculty Approval */}
                      <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                        <div className="text-[9px] text-neutral-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                          <span>FACULTY GUIDE</span>
                          <span className="text-emerald-400 font-bold">DUAL-SIGN PASS</span>
                        </div>
                        <div className="text-white font-medium text-[11px] truncate">Dr. Anjali Dalvi</div>
                        <div className="text-[10px] text-neutral-400 truncate">Department of EE/CS • Station Head</div>
                      </div>

                      {/* Custody Cell 3: Bench & Countdown */}
                      <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                        <div className="text-[9px] text-neutral-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                          <span>BENCH & WINDOW</span>
                          <span className="text-[#a78b71] font-bold">01h 42m LEFT</span>
                        </div>
                        <div className="text-white font-medium text-[11px] truncate">Bench #04 • Room 402</div>
                        <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div className="bg-gradient-to-r from-[#a78b71] to-[#e8d5b7] h-full rounded-full w-[65%]" />
                        </div>
                      </div>

                      {/* Custody Cell 4: Security Ledger */}
                      <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                        <div className="text-[9px] text-neutral-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                          <span>TAMPER INTEGRITY</span>
                          <span className="text-emerald-400 font-bold">SEAL #CS-9941</span>
                        </div>
                        <div className="text-white font-medium text-[11px] truncate">0 Penalty Strikes Accrued</div>
                        <div className="text-[10px] text-neutral-400 truncate">Risk Score: 0.00 • Clean Record</div>
                      </div>
                    </div>

                    {/* Pre-Return Verification Status Strip */}
                    <div className="bg-black/30 p-2 rounded-xl border border-white/5 flex flex-wrap items-center justify-between text-[10px] text-neutral-300 gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>4x 100MHz Passive Probes Attached</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Calibration Drift: &lt;0.01%</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#c9b8a0]">
                        <Clock className="w-3 h-3" />
                        <span>Auto Return: 17:30 IST</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TAB 2: TELEMETRY (Oscilloscope SCPI Stream & Waveforms) ── */}
                {activeTab === 'telemetry' && (
                  <div className="space-y-3 font-mono">
                    <div className="flex items-center justify-between text-xs text-neutral-300 border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#a78b71]" />
                        <span className="text-white font-medium">RIGOL DS1054Z // 192.168.1.104</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="text-emerald-400 font-semibold bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                          SCPI LIVE • 2.5 GSa/s
                        </span>
                      </div>
                    </div>

                    {/* Simulated Waveform SVG Screen with Oscilloscope Reticle */}
                    <div className="relative rounded-xl overflow-hidden bg-black/70 border border-white/10 p-2">
                      <svg className="w-full h-24" viewBox="0 0 540 90">
                        {/* Reticle Grid Lines */}
                        <defs>
                          <pattern id="scopeGrid" width="45" height="18" patternUnits="userSpaceOnUse">
                            <path d="M 45 0 L 0 0 0 18" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
                          </pattern>
                        </defs>
                        <rect width="540" height="90" fill="url(#scopeGrid)" />
                        
                        {/* Center Reticle Crosshairs */}
                        <line x1="0" y1="45" x2="540" y2="45" stroke="rgba(167,139,113,0.2)" strokeWidth="1" strokeDasharray="2 4" />
                        <line x1="270" y1="0" x2="270" y2="90" stroke="rgba(167,139,113,0.2)" strokeWidth="1" strokeDasharray="2 4" />

                        {/* Trace 1: Gold Waveform (Analog Modulation) */}
                        <path
                          d="M 0 45 Q 25 10 50 45 T 100 45 T 150 45 T 200 15 T 250 75 T 300 45 T 350 45 T 400 20 T 450 70 T 500 45 T 540 45"
                          fill="none"
                          stroke="#e8d5b7"
                          strokeWidth="2"
                          className="flow-dash"
                        />
                        {/* Trace 2: Emerald Waveform (Digital SPI Clock) */}
                        <path
                          d="M 0 68 L 45 68 L 45 22 L 90 22 L 90 68 L 135 68 L 135 22 L 180 22 L 180 68 L 225 68 L 225 22 L 270 22 L 270 68 L 315 68 L 315 22 L 360 22 L 360 68 L 405 68 L 405 22 L 450 22 L 450 68 L 495 68 L 495 22 L 540 22"
                          fill="none"
                          stroke="#62c073"
                          strokeWidth="1.2"
                          strokeOpacity="0.85"
                        />
                      </svg>
                      
                      {/* Real-time Oscilloscope Banner */}
                      <div className="flex items-center justify-between text-[9px] text-neutral-400 px-1 pt-1 border-t border-white/5">
                        <span className="text-[#e8d5b7]">CH1: 500mV/div (PWM)</span>
                        <span className="text-[#62c073]">CH2: 1.0V/div (SPI_CLK)</span>
                        <span className="text-neutral-500">TRIG: CH1 EDGE 1.65V</span>
                      </div>
                    </div>

                    {/* Telemetry Metrics Readout Grid */}
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                        <div className="text-[9px] text-neutral-400">V_PP</div>
                        <div className="text-xs font-bold text-white mt-0.5">3.32 V</div>
                      </div>
                      <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                        <div className="text-[9px] text-neutral-400">FREQ</div>
                        <div className="text-xs font-bold text-[#e8d5b7] mt-0.5">144.02 MHz</div>
                      </div>
                      <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                        <div className="text-[9px] text-neutral-400">RISE TIME</div>
                        <div className="text-xs font-bold text-white mt-0.5">2.84 ns</div>
                      </div>
                      <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                        <div className="text-[9px] text-neutral-400">DUTY CYCLE</div>
                        <div className="text-xs font-bold text-emerald-400 mt-0.5">50.2%</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TAB 3: DISPATCH (Live Allocations & Requisitions) ── */}
                {activeTab === 'dispatch' && (
                  <div className="space-y-2.5 font-mono text-xs">
                    <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#a78b71]/15 border border-[#a78b71]/30 flex items-center justify-center text-[#e8d5b7]">
                          <Cpu className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-white font-medium text-xs">Xilinx Artix-7 XC7A100T</div>
                          <div className="text-[10px] text-neutral-400">Bench #12 • PRN: 202401072 (Deepak Nair)</div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 px-2 py-0.5 rounded-full font-semibold">
                        DISPATCHED
                      </span>
                    </div>

                    <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#a78b71]/15 border border-[#a78b71]/30 flex items-center justify-center text-[#e8d5b7]">
                          <Activity className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-white font-medium text-xs">NVIDIA Jetson Orin Nano 8GB</div>
                          <div className="text-[10px] text-neutral-400">Bench #08 • PRN: 202401115 (Priya Patel)</div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-[#a78b71]/15 text-[#e8d5b7] border border-[#a78b71]/30 px-2 py-0.5 rounded-full font-semibold">
                        ACTIVE BENCH
                      </span>
                    </div>

                    <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#a78b71]/15 border border-[#a78b71]/30 flex items-center justify-center text-[#e8d5b7]">
                          <Radio className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-white font-medium text-xs">Keysight 33600A Waveform Gen</div>
                          <div className="text-[10px] text-neutral-400">Bench #03 • PRN: 202401033 (Aditya Verma)</div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-blue-400/10 text-blue-400 border border-blue-400/20 px-2 py-0.5 rounded-full font-semibold">
                        QUEUED (#1)
                      </span>
                    </div>

                    {/* Summary row */}
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1 px-1">
                      <span>Active Benches: 18 / 24</span>
                      <span>Turnaround: 4.2 min avg</span>
                      <span className="text-emerald-400">0 Overdue Violations</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Console Footer */}
              <div className="flex flex-wrap items-center justify-between border-t border-white/10 pt-3.5 text-[10px] font-mono text-neutral-400 relative z-10 gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>FACILITY: AIML LAB (ROOM 402)</span>
                  <span className="text-neutral-600 hidden sm:inline">|</span>
                  <span className="text-neutral-500 hidden sm:inline">NTP SYNCED • 12ms LATENCY</span>
                </div>
                <div className="text-[#a78b71] font-semibold tracking-wider">ZERO-TRUST HARDWARE LEDGER v2.4</div>
              </div>
            </div>

            {/* ── RIGHT TELEMETRY BUS CONNECTORS (Desktop) ── */}
            <div className="hidden lg:flex w-12 xl:w-16 h-[540px] shrink-0 relative items-center justify-center">
              <svg
                className="w-full h-full overflow-visible pointer-events-none"
                viewBox="0 0 64 540"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="goldGradientRight" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a78b71" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#c9b8a0" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                {/* Upper Bus: Center Console Top Port (y: 175) to Top Satellite (y: 130) */}
                <path
                  d="M 0 175 C 32 175, 32 130, 64 130"
                  stroke="url(#goldGradientRight)"
                  strokeWidth="2"
                  className="node-line"
                />
                <path
                  d="M 0 175 C 32 175, 32 130, 64 130"
                  stroke="#e8d5b7"
                  strokeWidth="1.5"
                  className="flow-dash"
                />
                <circle cx="0" cy="175" r="3.5" fill="#e8d5b7" />
                <circle cx="64" cy="130" r="3.5" fill="#e8d5b7" />
                <text x="32" y="142" textAnchor="middle" fill="#c9b8a0" fontSize="7.5" fontFamily="monospace" letterSpacing="0.1em">
                  BUS C
                </text>

                {/* Lower Bus: Center Console Bottom Port (y: 365) to Bottom Satellite (y: 410) */}
                <path
                  d="M 0 365 C 32 365, 32 410, 64 410"
                  stroke="url(#goldGradientRight)"
                  strokeWidth="2"
                  className="node-line"
                />
                <path
                  d="M 0 365 C 32 365, 32 410, 64 410"
                  stroke="#e8d5b7"
                  strokeWidth="1.5"
                  className="flow-dash"
                />
                <circle cx="0" cy="365" r="3.5" fill="#e8d5b7" />
                <circle cx="64" cy="410" r="3.5" fill="#e8d5b7" />
                <text x="32" y="398" textAnchor="middle" fill="#c9b8a0" fontSize="7.5" fontFamily="monospace" letterSpacing="0.1em">
                  BUS D
                </text>
              </svg>
            </div>

            {/* ── RIGHT SATELLITE COLUMN ── */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-6 w-full lg:w-[270px] xl:w-[290px] shrink-0 justify-between">
              {/* Satellite 3: Top-Right (Rigol Oscilloscope) */}
              <div
                onClick={() => navigate('/workspace/inventory')}
                className="w-full gold-glass-card rounded-[22px] p-3 hover:-translate-y-1 hover:border-[#a78b71]/50 hover:shadow-[0_0_30px_rgba(167,139,113,0.25)] transition-all duration-300 cursor-pointer group relative overflow-hidden"
              >
                {/* Port anchor dot on left edge connecting to bus */}
                <div className="hidden lg:block absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#e8d5b7] shadow-[0_0_8px_#e8d5b7]" />

                <div className="rounded-[14px] overflow-hidden aspect-video relative mb-3 bg-neutral-900 border border-white/5">
                  <img
                    src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
                    alt="Rigol DS1054Z Digital Storage Oscilloscope"
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-[9px] font-mono text-[#c9b8a0]">
                    TELEMETRY // RIGOL
                  </div>
                </div>
                <div className="px-1">
                  <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-neutral-400 uppercase mb-1">
                    <span>Rigol DS1054Z 4-Ch</span>
                    <span className="text-[#a78b71] bg-[#a78b71]/10 px-1.5 py-0.2 rounded border border-[#a78b71]/20 font-semibold">
                      100 MHz
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-white group-hover:text-[#e8d5b7] transition-colors truncate">
                    Live SCPI Channel Stream
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono mt-0.5 truncate">
                    Bench #02 • 4 Probes Online
                  </div>
                </div>
              </div>

              {/* Satellite 4: Bottom-Right (Keysight Waveform Rig) */}
              <div
                onClick={() => navigate('/workspace/custody/reservations')}
                className="w-full gold-glass-card rounded-[22px] p-3 hover:-translate-y-1 hover:border-[#a78b71]/50 hover:shadow-[0_0_30px_rgba(167,139,113,0.25)] transition-all duration-300 cursor-pointer group relative overflow-hidden"
              >
                {/* Port anchor dot on left edge connecting to bus */}
                <div className="hidden lg:block absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#e8d5b7] shadow-[0_0_8px_#e8d5b7]" />

                <div className="rounded-[14px] overflow-hidden aspect-video relative mb-3 bg-neutral-900 border border-white/5">
                  <img
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80"
                    alt="Keysight Precision Lab Bench Rig"
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-[9px] font-mono text-[#c9b8a0]">
                    CALIBRATED // BENCH RIG
                  </div>
                </div>
                <div className="px-1">
                  <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-neutral-400 uppercase mb-1">
                    <span>Keysight 33600A</span>
                    <span className="text-emerald-400 bg-emerald-400/10 px-1.5 py-0.2 rounded border border-emerald-400/20 font-semibold">
                      100% HEALTH
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-white group-hover:text-[#e8d5b7] transition-colors truncate">
                    Waveform Generator Rig
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono mt-0.5 truncate">
                    Dual-Ch 80MHz • Calib: Oct 2026
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────
          ACADEMIC FLOW // ALL 5 CARDS (5-Column Responsive Grid, Clash Display)
      ───────────────────────────────────────────────────────────────────────── */}
      <section
        id="capabilities"
        className="py-28 px-6 sm:px-12 max-w-7xl mx-auto relative z-10 border-t border-white/5"
      >
        <div className="text-center mb-16">
          <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#a78b71] mb-3">
            ACADEMIC LIFECYCLE // 5 PHASES
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-white">
            From Project Proposal to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8d5b7] to-[#a78b71]">
              Active Bench Custody
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {/* Card 1: Projects */}
          <div
            onClick={() => navigate('/workspace/projects')}
            className="gold-glass-card rounded-[24px] p-6 transition-all duration-500 hover:border-[#a78b71]/60 group cursor-pointer flex flex-col justify-between hover:-translate-y-1"
          >
            <div>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#a78b71]/10 text-[#c9b8a0] border border-[#a78b71]/20 mb-5 group-hover:scale-110 group-hover:border-[#a78b71]/50 transition-all duration-300">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div className="text-[10px] font-mono tracking-[0.2em] text-[#a78b71] mb-1.5 uppercase">
                PHASE 01
              </div>
              <h3 className="font-display font-bold text-xl text-white tracking-tight mb-2.5 group-hover:text-[#e8d5b7] transition-colors">
                Projects
              </h3>
              <p className="text-xs text-gray-400 font-normal leading-relaxed font-sans">
                Form Capstone and Mini Project teams, assemble collaborative rosters, and compile required hardware Bills of Materials.
              </p>
            </div>
            <div className="mt-6 pt-3.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#a78b71]">
              <span>CAPSTONES & BOM</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Workstation */}
          <div
            onClick={() => navigate('/workspace/inventory')}
            className="gold-glass-card rounded-[24px] p-6 transition-all duration-500 hover:border-[#a78b71]/60 group cursor-pointer flex flex-col justify-between hover:-translate-y-1"
          >
            <div>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#a78b71]/10 text-[#c9b8a0] border border-[#a78b71]/20 mb-5 group-hover:scale-110 group-hover:border-[#a78b71]/50 transition-all duration-300">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="text-[10px] font-mono tracking-[0.2em] text-[#a78b71] mb-1.5 uppercase">
                PHASE 02
              </div>
              <h3 className="font-display font-bold text-xl text-white tracking-tight mb-2.5 group-hover:text-[#e8d5b7] transition-colors">
                Workstation
              </h3>
              <p className="text-xs text-gray-400 font-normal leading-relaxed font-sans">
                Search real-time inventory across AIML, IoT, and Embedded labs for available FPGAs, microcontrollers, sensors, and instruments.
              </p>
            </div>
            <div className="mt-6 pt-3.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#a78b71]">
              <span>LAB INVENTORY</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Requisitions */}
          <div
            onClick={() => navigate('/workspace/custody/requests')}
            className="gold-glass-card rounded-[24px] p-6 transition-all duration-500 hover:border-[#a78b71]/60 group cursor-pointer flex flex-col justify-between hover:-translate-y-1"
          >
            <div>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#a78b71]/10 text-[#c9b8a0] border border-[#a78b71]/20 mb-5 group-hover:scale-110 group-hover:border-[#a78b71]/50 transition-all duration-300">
                <Inbox className="w-5 h-5" />
              </div>
              <div className="text-[10px] font-mono tracking-[0.2em] text-[#a78b71] mb-1.5 uppercase">
                PHASE 03
              </div>
              <h3 className="font-display font-bold text-xl text-white tracking-tight mb-2.5 group-hover:text-[#e8d5b7] transition-colors">
                Requisitions
              </h3>
              <p className="text-xs text-gray-400 font-normal leading-relaxed font-sans">
                Submit component baskets for faculty guide review, track one-tap approvals, and route approved items to the dispatch desk.
              </p>
            </div>
            <div className="mt-6 pt-3.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#a78b71]">
              <span>FACULTY APPROVALS</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Waitlist */}
          <div
            onClick={() => navigate('/workspace/custody/reservations')}
            className="gold-glass-card rounded-[24px] p-6 transition-all duration-500 hover:border-[#a78b71]/60 group cursor-pointer flex flex-col justify-between hover:-translate-y-1"
          >
            <div>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#a78b71]/10 text-[#c9b8a0] border border-[#a78b71]/20 mb-5 group-hover:scale-110 group-hover:border-[#a78b71]/50 transition-all duration-300">
                <BookmarkCheck className="w-5 h-5" />
              </div>
              <div className="text-[10px] font-mono tracking-[0.2em] text-[#a78b71] mb-1.5 uppercase">
                PHASE 04
              </div>
              <h3 className="font-display font-bold text-xl text-white tracking-tight mb-2.5 group-hover:text-[#e8d5b7] transition-colors">
                Waitlist
              </h3>
              <p className="text-xs text-gray-400 font-normal leading-relaxed font-sans">
                Reserve high-demand equipment, monitor live queue positioning, and automatically claim available instruments upon check-in.
              </p>
            </div>
            <div className="mt-6 pt-3.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#a78b71]">
              <span>EQUIPMENT QUEUE</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: My Bench */}
          <div
            onClick={() => navigate('/workspace/custody/active')}
            className="gold-glass-card rounded-[24px] p-6 transition-all duration-500 hover:border-[#a78b71]/60 group cursor-pointer flex flex-col justify-between hover:-translate-y-1"
          >
            <div>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#a78b71]/10 text-[#c9b8a0] border border-[#a78b71]/20 mb-5 group-hover:scale-110 group-hover:border-[#a78b71]/50 transition-all duration-300">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-[10px] font-mono tracking-[0.2em] text-[#a78b71] mb-1.5 uppercase">
                PHASE 05
              </div>
              <h3 className="font-display font-bold text-xl text-white tracking-tight mb-2.5 group-hover:text-[#e8d5b7] transition-colors">
                My Bench
              </h3>
              <p className="text-xs text-gray-400 font-normal leading-relaxed font-sans">
                Monitor active equipment custody, observe real-time countdown return timers, and report component defects with zero penalty strikes.
              </p>
            </div>
            <div className="mt-6 pt-3.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#a78b71]">
              <span>ACTIVE CUSTODY</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────
          FOOTER (Clash Display Brand & Real LabTrack Navigation)
      ───────────────────────────────────────────────────────────────────────── */}
      <footer className="pt-20 pb-12 px-6 sm:px-12 border-t border-white/10 bg-[#080808] relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Column 1: Logo & Socials */}
          <div className="lg:col-span-1 space-y-4">
            <div
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 cursor-pointer group select-none"
            >
              <span className="font-display font-bold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f5e6c8] to-[#c9b8a0]">
                LabTrack
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9b8a0]" />
            </div>
            <p className="text-xs text-gray-400 font-normal leading-relaxed font-sans">
              The unified operating system for academic laboratories, hardware lifecycle, and instrument custody.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#hardware-mesh"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-[#e8d5b7] hover:border-[#a78b71] transition-all cursor-pointer"
                title="Hardware Mesh"
              >
                <Globe className="w-4 h-4" />
              </a>
              <button
                onClick={() => navigate('/workspace')}
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-[#e8d5b7] hover:border-[#a78b71] transition-all cursor-pointer"
                title="Workspace Console"
              >
                <Terminal className="w-4 h-4" />
              </button>
              <a
                href="#capabilities"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-[#e8d5b7] hover:border-[#a78b71] transition-all cursor-pointer"
                title="Lab Facilities"
              >
                <Server className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Hardware Telemetry */}
          <div>
            <div className="text-[11px] font-mono tracking-[0.25em] text-[#a78b71] uppercase mb-4">
              HARDWARE
            </div>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-normal font-sans">
              <li>
                <button
                  onClick={() => navigate('/workspace/inventory/assets')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Instruments & Assets
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/workspace/inventory/components')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  FPGAs & Microcontrollers
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/workspace/inventory/consumables')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Sensors & IC Components
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/workspace/operations/defects')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Defect Quarantine
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Custody & Circulation */}
          <div>
            <div className="text-[11px] font-mono tracking-[0.25em] text-[#a78b71] uppercase mb-4">
              CUSTODY
            </div>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-normal font-sans">
              <li>
                <button
                  onClick={() => navigate('/workspace/custody/active')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Active Benches
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/workspace/custody/requests')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Requisition Queue
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/workspace/custody/reservations')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Waitlist Reservations
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/workspace/projects')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Capstone Projects
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Operations & Governance */}
          <div>
            <div className="text-[11px] font-mono tracking-[0.25em] text-[#a78b71] uppercase mb-4">
              OPERATIONS
            </div>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-normal font-sans">
              <li>
                <button
                  onClick={() => navigate('/workspace/operations/dispatch')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Dispatch Desk
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/workspace/operations/approvals')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Faculty Approvals
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/workspace/accountability/reliability')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Reliability Metrics
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/workspace/accountability/audit-log')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Verifiable Audit Log
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Lab Circular Digest */}
          <div className="space-y-4">
            <div className="text-[11px] font-mono tracking-[0.25em] text-[#a78b71] uppercase">
              LAB CIRCULAR
            </div>
            <p className="text-xs text-gray-400 font-normal font-sans">
              Subscribe for equipment availability, maintenance schedules, and lab facility notices.
            </p>
            {/* Low-opacity search bar with circular arrow-submit button */}
            <form
              onSubmit={handleDigestSubmit}
              className="bg-white/[0.03] border border-white/10 rounded-full pl-4 pr-1.5 py-1.5 flex items-center justify-between focus-within:border-[#a78b71] transition-all backdrop-blur-md"
            >
              <input
                type="email"
                placeholder="student@institute.edu"
                value={digestEmail}
                onChange={(e) => setDigestEmail(e.target.value)}
                required
                className="bg-transparent text-xs text-white placeholder:text-neutral-500 focus:outline-none w-full mr-2 font-mono"
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-full bg-[#a78b71] text-black flex items-center justify-center hover:bg-[#e8d5b7] transition-colors flex-shrink-0 cursor-pointer shadow-md"
                title="Subscribe to Circular"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            {digestSubscribed && (
              <div className="text-[10px] font-mono text-emerald-400 tracking-wide animate-fadeIn">
                ✓ Enrolled into LabTrack Maintenance Circular.
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-neutral-500 gap-4">
          <div>
            © {new Date().getFullYear()} LABTRACK ACADEMIC HARDWARE OS. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>LAB CLUSTERS NOMINAL</span>
            </span>
            <span>ZERO-TRUST VERIFIED</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HeroPage;
