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
import { InteractiveWavesBackground } from '../components/canvas/InteractiveWavesBackground';

export function HeroPage() {
  const navigate = useNavigate();
  const [wavePreset, setWavePreset] = useState('harmonic'); // 'harmonic' | 'velocity' | 'calm'
  const [waveColorMode, setWaveColorMode] = useState('gold'); // 'gold' | 'emerald' | 'cyan'
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
            INTERACTIVE WAVES TELEMETRY STAGE (Replaces Hardware Mesh & Satellites)
        ───────────────────────────────────────────────────────────────────── */}
        <div className="relative w-full max-w-6xl mx-auto mt-6 z-10 px-2 sm:px-0">
          <div className="relative w-full h-[480px] sm:h-[560px] rounded-[32px] overflow-hidden gold-glass-card border border-white/10 shadow-[0_0_90px_rgba(167,139,113,0.18)] flex flex-col justify-between group">
            {/* Interactive Perlin Noise Canvas */}
            <InteractiveWavesBackground
              lineColor={
                waveColorMode === 'gold'
                  ? 'rgba(201, 184, 160, 0.38)'
                  : waveColorMode === 'emerald'
                  ? 'rgba(98, 192, 115, 0.38)'
                  : 'rgba(82, 168, 255, 0.38)'
              }
              backgroundColor="transparent"
              waveSpeedX={
                wavePreset === 'velocity' ? 0.035 : wavePreset === 'calm' ? 0.008 : 0.016
              }
              waveSpeedY={
                wavePreset === 'velocity' ? 0.015 : wavePreset === 'calm' ? 0.004 : 0.007
              }
              waveAmpX={
                wavePreset === 'velocity' ? 52 : wavePreset === 'calm' ? 24 : 38
              }
              waveAmpY={
                wavePreset === 'velocity' ? 26 : wavePreset === 'calm' ? 12 : 18
              }
              friction={0.925}
              tension={0.007}
              maxCursorMove={120}
              xGap={wavePreset === 'velocity' ? 10 : wavePreset === 'calm' ? 14 : 12}
              yGap={wavePreset === 'velocity' ? 30 : wavePreset === 'calm' ? 38 : 34}
              cursorDotColor={
                waveColorMode === 'gold'
                  ? 'rgba(232, 213, 183, 0.85)'
                  : waveColorMode === 'emerald'
                  ? 'rgba(98, 192, 115, 0.85)'
                  : 'rgba(82, 168, 255, 0.85)'
              }
            />

            {/* Inner Radial Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[320px] rounded-full bg-[#a78b71]/10 blur-[110px] pointer-events-none" />

            {/* Top HUD Overlay */}
            <div className="relative z-10 px-6 pt-5 pb-3 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-3 h-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c9b8a0] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e8d5b7]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#a78b71]">
                      AIML LAB // HARMONIC TELEMETRY FIELD
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                      FLUID ACTIVE
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold tracking-wide text-white font-display">
                    Interactive RF Carrier & Waveform Surface
                  </div>
                </div>
              </div>

              {/* Mode Selector Chips (Clickable) */}
              <div className="flex items-center gap-1 bg-black/60 p-1 rounded-full border border-white/10 text-[10px] font-mono pointer-events-auto">
                <button
                  onClick={() => setWavePreset('harmonic')}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    wavePreset === 'harmonic'
                      ? 'bg-[#a78b71] text-black font-semibold shadow-[0_0_12px_rgba(167,139,113,0.4)]'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  HARMONIC
                </button>
                <button
                  onClick={() => setWavePreset('velocity')}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    wavePreset === 'velocity'
                      ? 'bg-[#a78b71] text-black font-semibold shadow-[0_0_12px_rgba(167,139,113,0.4)]'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  VELOCITY
                </button>
                <button
                  onClick={() => setWavePreset('calm')}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    wavePreset === 'calm'
                      ? 'bg-[#a78b71] text-black font-semibold shadow-[0_0_12px_rgba(167,139,113,0.4)]'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  CALM
                </button>
              </div>
            </div>

            {/* Center Visual Interaction Indicator */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none select-none my-auto">
              <div className="inline-flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-[11px] font-mono text-[#e8d5b7] mb-3 shadow-[0_0_20px_rgba(167,139,113,0.2)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a78b71] animate-pulse" />
                <span>PERLIN NOISE FLUID PHYSICS</span>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-semibold text-white tracking-tight drop-shadow-md">
                Move cursor across the wave field to distort the carrier
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-neutral-400 max-w-md font-sans leading-relaxed">
                Dynamic fluid tension, friction dampening, and Perlin vector displacement simulating continuous high-frequency RF transmission.
              </p>
            </div>

            {/* Bottom HUD Telemetry Strip & Color Palette Toggles */}
            <div className="relative z-10 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-black/50 backdrop-blur-md font-mono text-xs">
              {/* Telemetry Metrics */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[10px] text-neutral-400">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500">BASE FREQ:</span>
                  <span className="text-white font-medium">144.02 MHz</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500">SAMPLING:</span>
                  <span className="text-emerald-400 font-medium">2.50 GSa/s</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500">TENSION:</span>
                  <span className="text-[#e8d5b7] font-medium">0.007</span>
                </div>
                <div className="flex items-center gap-2 hidden md:flex">
                  <span className="text-neutral-500">FRICTION:</span>
                  <span className="text-white font-medium">0.925</span>
                </div>
              </div>

              {/* Color Palette Switcher (Clickable) */}
              <div className="flex items-center gap-2 text-[10px] pointer-events-auto">
                <span className="text-neutral-400 mr-1 hidden sm:inline">PALETTE:</span>
                <button
                  onClick={() => setWaveColorMode('gold')}
                  className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 ${
                    waveColorMode === 'gold'
                      ? 'border-[#a78b71] bg-[#a78b71]/20 text-[#e8d5b7]'
                      : 'border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#c9b8a0]" />
                  <span>Gold</span>
                </button>
                <button
                  onClick={() => setWaveColorMode('emerald')}
                  className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 ${
                    waveColorMode === 'emerald'
                      ? 'border-emerald-400 bg-emerald-400/20 text-emerald-300'
                      : 'border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Emerald</span>
                </button>
                <button
                  onClick={() => setWaveColorMode('cyan')}
                  className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 ${
                    waveColorMode === 'cyan'
                      ? 'border-blue-400 bg-blue-400/20 text-blue-300'
                      : 'border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>Cyan</span>
                </button>
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
