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
        {/* Live Notification Pill */}
        <div className="pill-glass-card rounded-full px-4 py-1.5 inline-flex items-center gap-2.5 mb-8 border border-white/10 bg-white/[0.03] backdrop-blur-[10px] shadow-[0_4px_24px_rgba(0,0,0,0.4)] animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]" />
          <span className="text-emerald-400 font-bold text-[8px] tracking-[0.25em] font-mono">
            LIVE
          </span>
          <span className="w-px h-3 bg-white/10" />
          <span className="text-white/90 text-[12px] font-light tracking-wide font-sans">
            AIML & IoT Labs Synchronized • 248 Active Benches • 1,420 Instruments in Custody
          </span>
        </div>

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
            NEURAL NETWORK CONNECTIVITY & SATELLITE SYSTEM
        ───────────────────────────────────────────────────────────────────── */}
        <div className="relative w-full max-w-6xl mx-auto mt-6 flex flex-col items-center justify-center">
          {/* SVG Connection Lines Overlay */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden lg:block"
            viewBox="0 0 1152 700"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="goldGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="10%" stopColor="#c9b8a0" stopOpacity="0.85" />
                <stop offset="90%" stopColor="#a78b71" stopOpacity="0.45" />
              </linearGradient>
            </defs>

            {/* Top-Left Satellite to Central Node */}
            <path
              d="M 170 120 C 260 120, 360 260, 420 310"
              className="node-line"
              stroke="url(#goldGradient)"
            />
            <path
              d="M 170 120 C 260 120, 360 260, 420 310"
              className="flow-dash"
              stroke="#e8d5b7"
              strokeWidth="1.5"
            />

            {/* Top-Right Satellite to Central Node */}
            <path
              d="M 982 120 C 892 120, 792 260, 732 310"
              className="node-line"
              stroke="url(#goldGradient)"
            />
            <path
              d="M 982 120 C 892 120, 792 260, 732 310"
              className="flow-dash"
              stroke="#e8d5b7"
              strokeWidth="1.5"
            />

            {/* Bottom-Left Satellite to Central Node */}
            <path
              d="M 180 580 C 280 580, 370 440, 420 390"
              className="node-line"
              stroke="url(#goldGradient)"
            />
            <path
              d="M 180 580 C 280 580, 370 440, 420 390"
              className="flow-dash"
              stroke="#e8d5b7"
              strokeWidth="1.5"
            />

            {/* Bottom-Right Satellite to Central Node */}
            <path
              d="M 972 580 C 872 580, 782 440, 732 390"
              className="node-line"
              stroke="url(#goldGradient)"
            />
            <path
              d="M 972 580 C 872 580, 782 440, 732 390"
              className="flow-dash"
              stroke="#e8d5b7"
              strokeWidth="1.5"
            />

            {/* Central Node Synapse Anchors */}
            <circle cx="420" cy="310" r="3.5" fill="#e8d5b7" />
            <circle cx="732" cy="310" r="3.5" fill="#e8d5b7" />
            <circle cx="420" cy="390" r="3.5" fill="#e8d5b7" />
            <circle cx="732" cy="390" r="3.5" fill="#e8d5b7" />
          </svg>

          {/* Floating Satellite Cards (Desktop Layout) */}
          <div className="w-full relative z-10 flex flex-col lg:block min-h-[640px]">
            {/* Satellite 1: Top-Left (260px) */}
            <div
              style={{
                transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)`,
              }}
              className="lg:absolute lg:top-4 lg:left-0 mb-6 lg:mb-0 w-full sm:w-[260px] gold-glass-card rounded-[20px] p-3 satellite-glow-hover cursor-pointer group z-20"
            >
              <div className="rounded-[14px] overflow-hidden aspect-video relative mb-3 bg-neutral-900 border border-white/5">
                <img
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80"
                  alt="Xilinx Artix-7 FPGA"
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-[9px] font-mono text-[#c9b8a0]">
                  BENCH 04 // FPGA
                </div>
              </div>
              <div className="px-1">
                <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-neutral-400 uppercase mb-1">
                  <span>Xilinx Artix-7</span>
                  <span className="text-emerald-400">DISPATCHED</span>
                </div>
                <div className="text-xs font-semibold text-white group-hover:text-[#e8d5b7] transition-colors truncate">
                  100T CSG324 • PRN 202401048
                </div>
              </div>
            </div>

            {/* Satellite 2: Top-Right (280px) */}
            <div
              style={{
                transform: `translate(${mousePos.x * -18}px, ${mousePos.y * 18}px)`,
              }}
              className="lg:absolute lg:top-4 lg:right-0 mb-6 lg:mb-0 w-full sm:w-[280px] gold-glass-card rounded-[20px] p-3 satellite-glow-hover cursor-pointer group z-20"
            >
              <div className="rounded-[14px] overflow-hidden aspect-video relative mb-3 bg-neutral-900 border border-white/5">
                <img
                  src="https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=600&q=80"
                  alt="Rigol Digital Oscilloscope"
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-[9px] font-mono text-[#c9b8a0]">
                  TELEMETRY // RIGOL
                </div>
              </div>
              <div className="px-1">
                <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-neutral-400 uppercase mb-1">
                  <span>DS1054Z 4-Ch</span>
                  <span className="text-[#a78b71]">100 MHz</span>
                </div>
                <div className="text-xs font-semibold text-white group-hover:text-[#e8d5b7] transition-colors truncate">
                  Live SCPI Channel Stream
                </div>
              </div>
            </div>

            {/* Central Interactive Node (16:9 aspect ratio glass card) */}
            <div
              style={{
                transform: `translate(${mousePos.x * 6}px, ${mousePos.y * 6}px)`,
              }}
              className="lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 w-full lg:w-[680px] aspect-[16/10] sm:aspect-video gold-glass-card rounded-[32px] p-6 sm:p-8 central-glow flex flex-col justify-between overflow-hidden relative border border-white/15 my-6 lg:my-0 z-10"
            >
              {/* Inner ambient glow */}
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#a78b71]/15 blur-3xl pointer-events-none" />

              {/* Node Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#a78b71] animate-ping" />
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#a78b71]">
                      AIML LAB // DISPATCH DESK
                    </div>
                    <div className="text-sm font-semibold tracking-wide text-white font-display">
                      Hardware Custody & Telemetry Console
                    </div>
                  </div>
                </div>

                {/* Sub-node tabs */}
                <div className="flex items-center bg-black/40 p-1 rounded-full border border-white/10 text-[10px] font-mono">
                  <button
                    onClick={() => setActiveTab('dispatch')}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      activeTab === 'dispatch'
                        ? 'bg-[#a78b71] text-black font-semibold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    DISPATCH
                  </button>
                  <button
                    onClick={() => setActiveTab('telemetry')}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      activeTab === 'telemetry'
                        ? 'bg-[#a78b71] text-black font-semibold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    TELEMETRY
                  </button>
                  <button
                    onClick={() => setActiveTab('custody')}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      activeTab === 'custody'
                        ? 'bg-[#a78b71] text-black font-semibold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    CUSTODY
                  </button>
                </div>
              </div>

              {/* Node Center Interactive Canvas / Telemetry Display */}
              <div className="my-auto py-4 relative z-10">
                {activeTab === 'dispatch' && (
                  <div className="space-y-2.5 font-mono text-xs">
                    <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Cpu className="w-4 h-4 text-[#a78b71]" />
                        <div>
                          <div className="text-white font-medium">Xilinx Artix-7 XC7A100T</div>
                          <div className="text-[10px] text-neutral-400">Bench #04 • PRN: 202401048 (Rahul Sharma)</div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 px-2.5 py-0.5 rounded-full font-semibold">
                        DISPATCHED
                      </span>
                    </div>

                    <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-[#c9b8a0]" />
                        <div>
                          <div className="text-white font-medium">Keysight DSOX1204G 4-Ch</div>
                          <div className="text-[10px] text-neutral-400">Bench #12 • PRN: 202401072 (Deepak Nair)</div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-[#a78b71]/15 text-[#e8d5b7] border border-[#a78b71]/30 px-2.5 py-0.5 rounded-full font-semibold">
                        ACTIVE BENCH
                      </span>
                    </div>
                  </div>
                )}

                {activeTab === 'telemetry' && (
                  <div className="space-y-3 font-mono">
                    <div className="flex justify-between text-xs text-neutral-400 border-b border-white/5 pb-1">
                      <span>CH 1: RIGOL DS1054Z OSCILLOSCOPE</span>
                      <span className="text-emerald-400">1.24 GHz STREAM</span>
                    </div>
                    {/* Simulated Waveform SVG */}
                    <svg className="w-full h-16" viewBox="0 0 500 60">
                      <path
                        d="M 0 30 Q 30 10 60 30 T 120 30 T 180 30 T 240 10 T 300 50 T 360 30 T 420 30 T 500 30"
                        fill="none"
                        stroke="#a78b71"
                        strokeWidth="2"
                        className="flow-dash"
                      />
                      <path
                        d="M 0 30 Q 30 20 60 30 T 120 30 T 180 40 T 240 30 T 300 20 T 360 30 T 420 40 T 500 30"
                        fill="none"
                        stroke="#c9b8a0"
                        strokeWidth="1"
                        strokeOpacity="0.4"
                      />
                    </svg>
                    <div className="flex justify-between text-[10px] text-neutral-500">
                      <span>SAMP: 2.5 GSa/s</span>
                      <span>V_PP: 3.32 V</span>
                      <span>FREQ: 144.02 MHz</span>
                    </div>
                  </div>
                )}

                {activeTab === 'custody' && (
                  <div className="space-y-2.5 font-mono text-xs">
                    <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-[#a78b71]" />
                        <span className="text-neutral-300">
                          FACULTY GUIDE: DR. ANJALI DALVI
                        </span>
                      </div>
                      <span className="text-[10px] bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 px-2 py-0.5 rounded-full font-semibold">
                        VERIFIED APPROVED
                      </span>
                    </div>
                    <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-[#c9b8a0]" />
                        <span className="text-neutral-300">
                          RETURN WINDOW: 17:30 IST
                        </span>
                      </div>
                      <span className="text-[10px] bg-[#a78b71]/15 text-[#e8d5b7] border border-[#a78b71]/30 px-2 py-0.5 rounded-full">
                        0 STRIKES ACCRUED
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Node Footer */}
              <div className="flex items-center justify-between border-t border-white/10 pt-4 text-[10px] font-mono text-neutral-400 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>FACILITY: AIML LAB (ROOM 402)</span>
                </div>
                <div className="text-[#a78b71]">ZERO-TRUST HARDWARE LEDGER</div>
              </div>
            </div>

            {/* Satellite 3: Bottom-Left (270px) */}
            <div
              style={{
                transform: `translate(${mousePos.x * 20}px, ${mousePos.y * -16}px)`,
              }}
              className="lg:absolute lg:bottom-4 lg:left-0 mb-6 lg:mb-0 w-full sm:w-[270px] gold-glass-card rounded-[20px] p-3 satellite-glow-hover cursor-pointer group z-20"
            >
              <div className="rounded-[14px] overflow-hidden aspect-video relative mb-3 bg-neutral-900 border border-white/5">
                <img
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80"
                  alt="NVIDIA Jetson Orin Nano"
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-[9px] font-mono text-[#c9b8a0]">
                  DISPATCH // JETSON ORIN
                </div>
              </div>
              <div className="px-1">
                <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-neutral-400 uppercase mb-1">
                  <span>Robotics Capstone</span>
                  <span className="text-emerald-400">BENCH #08</span>
                </div>
                <div className="text-xs font-semibold text-white group-hover:text-[#e8d5b7] transition-colors truncate">
                  Autonomous Unit Requisition
                </div>
              </div>
            </div>

            {/* Satellite 4: Bottom-Right (250px) */}
            <div
              style={{
                transform: `translate(${mousePos.x * -16}px, ${mousePos.y * -20}px)`,
              }}
              className="lg:absolute lg:bottom-4 lg:right-0 mb-6 lg:mb-0 w-full sm:w-[250px] gold-glass-card rounded-[20px] p-3 satellite-glow-hover cursor-pointer group z-20"
            >
              <div className="rounded-[14px] overflow-hidden aspect-video relative mb-3 bg-neutral-900 border border-white/5">
                <img
                  src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80"
                  alt="Keysight Waveform Generator"
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-[9px] font-mono text-[#c9b8a0]">
                  CALIBRATED // BENCH RIG
                </div>
              </div>
              <div className="px-1">
                <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-neutral-400 uppercase mb-1">
                  <span>Keysight 33600A</span>
                  <span className="text-[#a78b71]">100% HEALTH</span>
                </div>
                <div className="text-xs font-semibold text-white group-hover:text-[#e8d5b7] transition-colors truncate">
                  Waveform Generator Rig
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
