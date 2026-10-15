import React, { useState } from 'react';
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
  Globe,
  Share2,
  Code,
  Send,
  Zap,
} from 'lucide-react';

export function HeroPage() {
  const navigate = useNavigate();
  const { currentRole, setRole } = useAuth();
  const { basket, setIsBasketOpen } = useLabData();

  // Pricing toggle state: monthly vs annual
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'

  // Interactive mouse tracking for 3D tilt effect on satellites
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [promptText, setPromptText] = useState('Allocate Jetson Nano 4GB to PRJ-AIML-08');
  const [promptSubmitted, setPromptSubmitted] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-inter selection:bg-[#a78b71] selection:text-black overflow-x-hidden relative">
      {/* ───────────────────────────────────────────────────────────────── */}
      {/* RADIAL DOT GRID OVERLAY (32px spacing, white at 8% opacity)        */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-dots pointer-events-none z-0" />

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 1. FIXED TOP NAVBAR (100% width, px-6 to px-12, Playfair logo)    */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 h-20 px-6 lg:px-12 flex items-center justify-between bg-[#0a0a0a]/85 backdrop-blur-[10px] border-b border-white/10">
        {/* Brand Block */}
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate('/hero')}
        >
          <span className="font-playfair text-2xl lg:text-3xl font-bold tracking-tight text-white italic">
            LabTrack
          </span>
          <span className="w-2 h-2 rounded-full bg-[#a78b71] shadow-[0_0_10px_#a78b71]" />
        </div>

        {/* Center-Aligned Links in Inter (11px, uppercase, tracking-wide) */}
        <nav className="hidden lg:flex items-center space-x-8 text-[11px] font-inter font-medium uppercase tracking-[0.2em] text-zinc-300">
          {[
            { label: 'Inventory', path: '/workspace/inventory' },
            { label: 'Custody Desk', path: '/workspace/custody' },
            { label: 'Reliability Index', path: '/workspace/accountability' },
            { label: 'Dispatch Terminal', path: '/workspace/operations/dispatch' },
            { label: 'Research Projects', path: '/workspace/projects' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="hover:text-[#c9b8a0] transition-neural"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Action Block */}
        <div className="flex items-center space-x-4">
          {/* Live Notification Pill */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full glass-neural text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-bold text-[8px] tracking-wider uppercase">LIVE</span>
            <span className="text-white text-[12px] font-medium font-inter">1,420 Hardware Nodes</span>
          </div>

          {/* Quick Role Switcher Pill */}
          <div className="hidden md:flex items-center space-x-1 p-1 rounded-full glass-neural text-[10px] font-inter uppercase tracking-wider">
            {['Student', 'Faculty', 'Lab Assistant', 'HoD / Admin'].map((role) => (
              <button
                key={role}
                onClick={() => setRole(role)}
                className={`px-2.5 py-1 rounded-full transition-neural ${
                  currentRole === role
                    ? 'bg-[#a78b71] text-black font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Requisition Basket Shortcut */}
          <button
            onClick={() => setIsBasketOpen(true)}
            className="relative p-2.5 rounded-full glass-neural hover:border-[#a78b71]/50 text-white transition-neural"
            title="Requisition Basket"
          >
            <Boxes className="w-4 h-4 text-[#c9b8a0]" />
            {basket?.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#a78b71] text-black text-[10px] font-bold flex items-center justify-center">
                {basket.length}
              </span>
            )}
          </button>

          {/* Start Free Trial / Enter Workspace Pill Button */}
          <button
            onClick={() => navigate('/workspace/inventory')}
            className="px-6 py-2.5 rounded-full bg-white text-black font-inter font-semibold text-xs uppercase tracking-wider hover:bg-[#e8d5b7] transition-neural shadow-md"
          >
            Start Free Trial
          </button>
        </div>
      </header>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 2. HERO SECTION WITH CENTRAL INTERACTIVE NODE & 4 SATELLITES     */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative z-10 pt-36 pb-28 px-6 lg:px-12 flex flex-col items-center justify-center min-h-screen text-center"
      >
        {/* Glow backdrop behind central node */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-[#a78b71]/15 blur-[140px] rounded-full pointer-events-none" />

        {/* Small uppercase eyebrow */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-neural text-[11px] font-inter uppercase tracking-[0.25em] text-[#c9b8a0] mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#a78b71]" />
          <span>NEURAL NETWORK HARDWARE ORCHESTRATION</span>
        </div>

        {/* Headline: Playfair Display Italic clamp(2.5rem, 8vw, 6rem) with words highlighted in #a78b71 */}
        <h1 className="font-playfair text-[clamp(2.5rem,7.5vw,5.8rem)] font-normal italic leading-[1.05] tracking-tight max-w-5xl mx-auto mb-6 text-white">
          Empirical Hardware Lifecycle <span className="text-[#a78b71]">Synthesized</span> Through{' '}
          <span className="text-[#a78b71]">Neural</span> Rigor.
        </h1>

        <p className="font-inter text-sm sm:text-base lg:text-lg text-zinc-400 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
          The collegiate hardware lifecycle unified. Enforce strict 2-tier inventory boundaries, cryptographic
          faculty endorsements, and optical dispatch traceability in real time.
        </p>

        {/* Dual-Button CTA Group: one bordered and one solid white */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={() => navigate('/workspace/inventory')}
            className="px-8 py-3.5 rounded-full bg-white text-black font-inter font-bold text-xs uppercase tracking-[0.18em] hover:bg-[#e8d5b7] transition-neural shadow-xl"
          >
            Enter Workstation Shell
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3.5 rounded-full border border-white/20 text-white font-inter font-semibold text-xs uppercase tracking-[0.18em] hover:border-[#a78b71] hover:text-[#c9b8a0] transition-neural"
          >
            Authenticate Persona
          </button>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* CENTRAL INTERACTIVE NODE & 4 FLOATING SATELLITES (3D TILT)    */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="relative w-full max-w-5xl mx-auto my-6 px-4">
          {/* Dynamic SVG Bezier Curves Overlay connecting central node to all 4 satellites */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
            viewBox="0 0 1000 560"
            fill="none"
          >
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c9b8a0" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#a78b71" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Neural Bezier Curve 1: To Satellite 1 (Top Left: Line Chart) */}
            <path
              d="M 500 280 C 350 200, 220 160, 120 100"
              stroke="url(#goldGradient)"
              strokeWidth="2.5"
              className="node-line pulsing-branch"
            />
            <path
              d="M 500 280 C 350 200, 220 160, 120 100"
              stroke="#e8d5b7"
              strokeWidth="1.5"
              className="node-dashed opacity-60"
            />

            {/* Neural Bezier Curve 2: To Satellite 2 (Top Right: Code Block) */}
            <path
              d="M 500 280 C 650 200, 780 160, 880 100"
              stroke="url(#goldGradient)"
              strokeWidth="2.5"
              className="node-line pulsing-branch"
            />
            <path
              d="M 500 280 C 650 200, 780 160, 880 100"
              stroke="#e8d5b7"
              strokeWidth="1.5"
              className="node-dashed opacity-60"
            />

            {/* Neural Bezier Curve 3: To Satellite 3 (Bottom Left: Audio Visualizer) */}
            <path
              d="M 500 280 C 380 380, 240 440, 140 480"
              stroke="url(#goldGradient)"
              strokeWidth="2.5"
              className="node-line pulsing-branch"
            />
            <path
              d="M 500 280 C 380 380, 240 440, 140 480"
              stroke="#e8d5b7"
              strokeWidth="1.5"
              className="node-dashed opacity-60"
            />

            {/* Neural Bezier Curve 4: To Satellite 4 (Bottom Right: Prompt Input) */}
            <path
              d="M 500 280 C 620 380, 760 440, 860 480"
              stroke="url(#goldGradient)"
              strokeWidth="2.5"
              className="node-line pulsing-branch"
            />
            <path
              d="M 500 280 C 620 380, 760 440, 860 480"
              stroke="#e8d5b7"
              strokeWidth="1.5"
              className="node-dashed opacity-60"
            />
          </svg>

          {/* Central 16:9 Interactive Glass Card with Central Glow */}
          <div className="relative z-20 aspect-video w-full rounded-[36px] glass-neural central-glow p-6 sm:p-10 flex flex-col justify-between overflow-hidden text-left border border-white/15">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#a78b71] animate-pulse" />
                <span className="text-xs font-inter font-bold tracking-[0.2em] uppercase text-[#c9b8a0]">
                  CENTRAL SILICON NODE // DSP-RIG-8840
                </span>
              </div>
              <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                NIST SP 800-53 AUDITED
              </span>
            </div>

            {/* Center Node Telemetry Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
              <div className="space-y-1">
                <div className="text-[11px] font-inter text-zinc-500 uppercase tracking-wider">Active Device</div>
                <div className="text-xl sm:text-2xl font-playfair font-bold text-white italic">Kintex-7 UltraScale+</div>
                <div className="text-xs text-[#a78b71] font-mono">Location: L2-CB4-R2</div>
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-inter text-zinc-500 uppercase tracking-wider">Thermal Load</div>
                <div className="text-xl sm:text-2xl font-inter font-bold text-white">42.1°C / 50MHz</div>
                <div className="text-xs text-emerald-400 font-mono">Emissivity: Normal</div>
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-inter text-zinc-500 uppercase tracking-wider">Custody State</div>
                <div className="text-xl sm:text-2xl font-playfair font-bold text-[#c9b8a0] italic">Team Hyperion</div>
                <div className="text-xs text-zinc-400 font-mono">Due: 04h 12m Remaining</div>
              </div>
            </div>

            {/* Bottom Node Bar */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2 text-zinc-400 font-mono">
                <Radio className="w-3.5 h-3.5 text-[#a78b71]" />
                <span>RFID TAG: AT-ESP-0104 // 100% TELEMETRY SYNC</span>
              </div>
              <button
                onClick={() => navigate('/workspace/inventory')}
                className="px-5 py-2 rounded-full bg-[#a78b71]/20 hover:bg-[#a78b71] text-[#e8d5b7] hover:text-black font-inter font-semibold transition-neural flex items-center space-x-1.5"
              >
                <span>Inspect Registry Node</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* 4 FLOATING SATELLITES WITH MICRO-PREVIEWS & 3D TILT           */}
          {/* ───────────────────────────────────────────────────────────── */}

          {/* SATELLITE 1 (Top Left): LINE CHART MICRO-PREVIEW */}
          <div
            onClick={() => navigate('/workspace/custody')}
            style={{
              transform: `perspective(1000px) rotateX(${-mousePos.y * 18}deg) rotateY(${mousePos.x * 18}deg) translateZ(20px)`,
            }}
            className="satellite-card absolute -top-12 -left-8 z-30 w-72 glass-neural rounded-[24px] p-4 text-left cursor-pointer border border-white/15 hidden md:block"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-inter uppercase tracking-[0.2em] text-[#a78b71] font-bold">
                TELEMETRY // LINE CHART
              </div>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                2.4 GHz PEAK
              </span>
            </div>
            <div className="font-playfair text-base text-white font-bold italic mb-2">
              NVIDIA Jetson Nano
            </div>
            {/* SVG Line Chart Sparkline */}
            <div className="h-14 w-full bg-white/[0.02] rounded-xl border border-white/10 p-1 relative overflow-hidden flex items-end">
              <svg className="w-full h-full" viewBox="0 0 200 50" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78b71" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#a78b71" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 40 Q 30 15, 60 25 T 120 10 T 170 30 T 200 15 L 200 50 L 0 50 Z"
                  fill="url(#chartGradient)"
                />
                <path
                  d="M 0 40 Q 30 15, 60 25 T 120 10 T 170 30 T 200 15"
                  fill="none"
                  stroke="#c9b8a0"
                  strokeWidth="2"
                />
                <circle cx="120" cy="10" r="3" fill="#e8d5b7" />
                <circle cx="200" cy="15" r="3" fill="#a78b71" />
              </svg>
            </div>
            <div className="mt-2 text-[10px] text-zinc-400 font-mono flex items-center justify-between">
              <span>Fluctuation: ±0.02%</span>
              <span className="text-amber-400 font-bold">4h left</span>
            </div>
          </div>

          {/* SATELLITE 2 (Top Right): CODE BLOCK MICRO-PREVIEW */}
          <div
            onClick={() => navigate('/workspace/projects')}
            style={{
              transform: `perspective(1000px) rotateX(${-mousePos.y * 18}deg) rotateY(${mousePos.x * 18}deg) translateZ(20px)`,
            }}
            className="satellite-card absolute -top-12 -right-8 z-30 w-72 glass-neural rounded-[24px] p-4 text-left cursor-pointer border border-white/15 hidden md:block"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-inter uppercase tracking-[0.2em] text-[#a78b71] font-bold">
                KERNEL // CODE BLOCK
              </div>
              <div className="flex space-x-1">
                <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
              </div>
            </div>
            <div className="font-playfair text-base text-white font-bold italic mb-1.5">
              neural_core.v
            </div>
            {/* Formatted Code Block */}
            <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 font-mono text-[10px] leading-relaxed text-zinc-300">
              <div><span className="text-purple-400">module</span> <span className="text-[#e8d5b7]">accelerator</span> (</div>
              <div className="pl-2 text-zinc-400">input <span className="text-blue-400">clk</span>, <span className="text-blue-400">rst_n</span>,</div>
              <div className="pl-2 text-zinc-400">input [31:0] <span className="text-[#c9b8a0]">tensor_in</span>,</div>
              <div className="pl-2 text-zinc-400">output [31:0] <span className="text-emerald-400">systolic_out</span></div>
              <div>);</div>
            </div>
            <div className="mt-2 text-[10px] text-zinc-400 font-mono flex items-center justify-between">
              <span>FPGA Synthesized</span>
              <span className="text-[#c9b8a0]">Pipeline Ready</span>
            </div>
          </div>

          {/* SATELLITE 3 (Bottom Left): AUDIO VISUALIZER MICRO-PREVIEW */}
          <div
            onClick={() => navigate('/workspace/operations/dispatch')}
            style={{
              transform: `perspective(1000px) rotateX(${-mousePos.y * 18}deg) rotateY(${mousePos.x * 18}deg) translateZ(20px)`,
            }}
            className="satellite-card absolute -bottom-10 -left-6 z-30 w-72 glass-neural rounded-[24px] p-4 text-left cursor-pointer border border-white/15 hidden md:block"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-[10px] font-inter uppercase tracking-[0.2em] text-[#a78b71] font-bold">
                SIGNAL // AUDIO VISUALIZER
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="font-playfair text-base text-white font-bold italic mb-2">
              Optical Solenoid Bay
            </div>
            {/* Equalizer Bars Visualizer */}
            <div className="h-12 w-full bg-black/40 rounded-xl border border-white/10 px-3 flex items-end justify-between py-1.5">
              {[60, 90, 45, 100, 75, 30, 85, 95, 40, 70, 80, 50, 65, 88].map((h, i) => (
                <div
                  key={i}
                  style={{
                    height: `${h}%`,
                    animation: `pulse ${1 + (i % 5) * 0.3}s ease-in-out infinite alternate`,
                  }}
                  className="w-1.5 rounded-full bg-gradient-to-t from-[#a78b71] to-[#e8d5b7]"
                />
              ))}
            </div>
            <div className="mt-2 text-[10px] text-zinc-400 font-mono flex items-center justify-between">
              <span>650nm Laser Latch</span>
              <span className="text-emerald-400 font-bold">LOCKED</span>
            </div>
          </div>

          {/* SATELLITE 4 (Bottom Right): PROMPT INPUT MICRO-PREVIEW */}
          <div
            style={{
              transform: `perspective(1000px) rotateX(${-mousePos.y * 18}deg) rotateY(${mousePos.x * 18}deg) translateZ(20px)`,
            }}
            className="satellite-card absolute -bottom-10 -right-6 z-30 w-80 glass-neural rounded-[24px] p-4 text-left border border-white/15 hidden md:block"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-[10px] font-inter uppercase tracking-[0.2em] text-[#a78b71] font-bold">
                CO-PILOT // PROMPT INPUT
              </div>
              <Sparkles className="w-3.5 h-3.5 text-[#e8d5b7]" />
            </div>
            <div className="font-playfair text-base text-white font-bold italic mb-2">
              Natural Dispatch Query
            </div>
            {/* Interactive Prompt Input Box */}
            <form onSubmit={handlePromptSubmit} className="relative flex items-center">
              <input
                type="text"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Ask hardware co-pilot..."
                className="w-full bg-black/60 border border-white/15 rounded-xl py-2 pl-3 pr-9 font-mono text-[10px] text-white placeholder-zinc-500 focus:outline-none focus:border-[#a78b71] transition-neural"
              />
              <button
                type="submit"
                className="absolute right-1.5 p-1 rounded-lg bg-[#a78b71] hover:bg-[#c9b8a0] text-black transition-neural"
                title="Execute hardware query"
              >
                <ArrowRight className="w-3 h-3" />
              </button>
            </form>
            <div className="mt-2 text-[10px] text-zinc-400 font-mono flex items-center justify-between">
              <span>NIST NLP Parser</span>
              <span className={promptSubmitted ? 'text-emerald-400 font-bold' : 'text-[#c9b8a0]'}>
                {promptSubmitted ? 'Dispatched!' : 'Enter to Run'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 3. FEATURES GRID (4-COLUMN GLASSMORPHIC CARDS)                    */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs uppercase font-inter font-bold tracking-[0.25em] text-[#a78b71]">
            CORE ARCHITECTURAL MODULES
          </div>
          <h2 className="font-playfair text-4xl sm:text-5xl font-normal italic text-white">
            Engineered For Empirical Rigor.
          </h2>
          <p className="text-sm font-inter text-zinc-400 font-light">
            Discrete operational desks replacing spreadsheets with auditable digital governance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Master Inventory */}
          <div
            onClick={() => navigate('/workspace/inventory')}
            className="glass-neural rounded-[28px] p-8 hover:border-[#a78b71]/50 transition-neural group cursor-pointer flex flex-col justify-between border border-white/10"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#a78b71]/10 text-[#c9b8a0] flex items-center justify-center group-hover:scale-110 transition-neural mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-inter font-bold text-xl text-white mb-2">
                2-Tier Registry
              </h3>
              <p className="font-inter text-sm text-zinc-400 leading-relaxed">
                Absolute separation between Serialized Assets (discrete loans) and Depletable Consumables (batch issue).
              </p>
            </div>
            <div className="pt-6 flex items-center space-x-1.5 text-xs font-inter font-bold uppercase tracking-wider text-[#c9b8a0]">
              <span>Explore Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Custody Desk */}
          <div
            onClick={() => navigate('/workspace/custody')}
            className="glass-neural rounded-[28px] p-8 hover:border-[#a78b71]/50 transition-neural group cursor-pointer flex flex-col justify-between border border-white/10"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#a78b71]/10 text-[#c9b8a0] flex items-center justify-center group-hover:scale-110 transition-neural mb-6">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-inter font-bold text-xl text-white mb-2">
                Custody & Loans
              </h3>
              <p className="font-inter text-sm text-zinc-400 leading-relaxed">
                Real-time loan countdowns, overdue alerts, and permanent project consumable disbursement tracking.
              </p>
            </div>
            <div className="pt-6 flex items-center space-x-1.5 text-xs font-inter font-bold uppercase tracking-wider text-[#c9b8a0]">
              <span>Active Borrowings</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Reliability Scorecard */}
          <div
            onClick={() => navigate('/workspace/accountability')}
            className="glass-neural rounded-[28px] p-8 hover:border-[#a78b71]/50 transition-neural group cursor-pointer flex flex-col justify-between border border-white/10"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#a78b71]/10 text-[#c9b8a0] flex items-center justify-center group-hover:scale-110 transition-neural mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-inter font-bold text-xl text-white mb-2">
                Reliability Index
              </h3>
              <p className="font-inter text-sm text-zinc-400 leading-relaxed">
                Algorithmic 0–100 compliance rating rewards verified returns while controlling access to high-value silicon.
              </p>
            </div>
            <div className="pt-6 flex items-center space-x-1.5 text-xs font-inter font-bold uppercase tracking-wider text-[#c9b8a0]">
              <span>Audit Metrics</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Dispatch Terminal */}
          <div
            onClick={() => navigate('/workspace/operations/dispatch')}
            className="glass-neural rounded-[28px] p-8 hover:border-[#a78b71]/50 transition-neural group cursor-pointer flex flex-col justify-between border border-white/10"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#a78b71]/10 text-[#c9b8a0] flex items-center justify-center group-hover:scale-110 transition-neural mb-6">
                <ScanLine className="w-6 h-6" />
              </div>
              <h3 className="font-inter font-bold text-xl text-white mb-2">
                Optical Dispatch
              </h3>
              <p className="font-inter text-sm text-zinc-400 leading-relaxed">
                Single-second PRN lookup, verified mentor approvals, and solenoid locker unlatch for Lab Assistants.
              </p>
            </div>
            <div className="pt-6 flex items-center space-x-1.5 text-xs font-inter font-bold uppercase tracking-wider text-[#c9b8a0]">
              <span>Counter Desk</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 4. PRICING & TIER SECTION (THREE-TIERED LAYOUT WITH PRO HIGHLIGHT) */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="text-xs uppercase font-inter font-bold tracking-[0.25em] text-[#a78b71]">
            INSTITUTIONAL TIERING
          </div>
          <h2 className="font-playfair text-4xl sm:text-5xl font-normal italic text-white">
            Structured Department Allocation.
          </h2>
          <p className="text-sm font-inter text-zinc-400 font-light">
            Scalable governance whether managing a single capstone bench or an entire engineering school.
          </p>

          {/* Monthly / Annual Toggle Switch */}
          <div className="pt-6 flex items-center justify-center">
            <div className="p-1 rounded-full glass-neural flex items-center space-x-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-full text-xs font-inter font-semibold transition-neural ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Semester Cycle
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1.5 rounded-full text-xs font-inter font-semibold transition-neural ${
                  billingCycle === 'annual'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Annual License
              </button>
            </div>
          </div>
        </div>

        {/* 3-Tier Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Tier 1: Student / Project Cohort */}
          <div className="glass-neural rounded-[32px] p-8 flex flex-col justify-between border border-white/10">
            <div className="space-y-4">
              <div className="text-xs font-inter uppercase font-bold tracking-widest text-zinc-400">
                Student Cohort
              </div>
              <div className="font-playfair text-3xl font-bold italic text-white">Academic Free</div>
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl sm:text-5xl font-bold text-white font-inter">$0</span>
                <span className="text-xs text-zinc-400 uppercase tracking-wider font-mono">/ semester</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed pt-2">
                Included for all enrolled engineering students with active institutional PRN.
              </p>
              <ul className="space-y-2.5 text-xs text-zinc-300 pt-4 border-t border-white/10">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#a78b71]" />
                  <span>Up to 3 concurrent serialized asset loans</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#a78b71]" />
                  <span>Requisition basket queue integration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#a78b71]" />
                  <span>Personal reliability scorecard & history</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/workspace/inventory')}
              className="mt-8 w-full py-3 rounded-full border border-white/20 hover:border-[#a78b71] text-white hover:text-[#c9b8a0] text-xs uppercase font-inter font-bold tracking-wider transition-neural"
            >
              Sign In With PRN
            </button>
          </div>

          {/* Tier 2: Pro Department Lab (HIGHLIGHTED WITH #a78b71/40 & BADGE) */}
          <div className="glass-neural rounded-[32px] p-8 flex flex-col justify-between border border-[#a78b71]/40 central-glow relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#a78b71] text-black text-[10px] font-inter font-bold uppercase tracking-[0.2em] shadow-lg">
              Most Popular
            </div>

            <div className="space-y-4 pt-2">
              <div className="text-xs font-inter uppercase font-bold tracking-widest text-[#c9b8a0]">
                Department Lab Pro
              </div>
              <div className="font-playfair text-3xl font-bold italic text-white">Full Lab Custody</div>
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl sm:text-5xl font-bold text-white font-inter">
                  {billingCycle === 'monthly' ? '$49' : '$39'}
                </span>
                <span className="text-xs text-zinc-400 uppercase tracking-wider font-mono">/ bench / mo</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed pt-2">
                Full-scale hardware governance for faculty supervisors, lab technicians, and active capstones.
              </p>
              <ul className="space-y-2.5 text-xs text-zinc-200 pt-4 border-t border-white/10">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#a78b71]" />
                  <span>Unlimited serialized assets & consumable tracking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#a78b71]" />
                  <span>Faculty supervisor approval queue dashboard</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#a78b71]" />
                  <span>Optical barcode scanner dispatch terminal</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#a78b71]" />
                  <span>Automated defect triage & quarantine workflow</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/workspace/inventory')}
              className="mt-8 w-full py-3.5 rounded-full bg-white text-black font-inter font-bold text-xs uppercase tracking-wider hover:bg-[#e8d5b7] transition-neural shadow-xl"
            >
              Deploy Department Node
            </button>
          </div>

          {/* Tier 3: Institutional Enterprise */}
          <div className="glass-neural rounded-[32px] p-8 flex flex-col justify-between border border-white/10">
            <div className="space-y-4">
              <div className="text-xs font-inter uppercase font-bold tracking-widest text-zinc-400">
                Dean / Executive
              </div>
              <div className="font-playfair text-3xl font-bold italic text-white">Enterprise Campus</div>
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl sm:text-5xl font-bold text-white font-inter">
                  {billingCycle === 'monthly' ? '$199' : '$159'}
                </span>
                <span className="text-xs text-zinc-400 uppercase tracking-wider font-mono">/ campus / mo</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed pt-2">
                Cross-department hardware sharing, HoD policy threshold overrides, and accreditation audit reports.
              </p>
              <ul className="space-y-2.5 text-xs text-zinc-300 pt-4 border-t border-white/10">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#a78b71]" />
                  <span>Multi-department hardware federation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#a78b71]" />
                  <span>NIST SP 800-53 / ISO 17025 compliance export</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#a78b71]" />
                  <span>Custom RBAC & SSO integration</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/workspace/accountability')}
              className="mt-8 w-full py-3 rounded-full border border-white/20 hover:border-[#a78b71] text-white hover:text-[#c9b8a0] text-xs uppercase font-inter font-bold tracking-wider transition-neural"
            >
              Contact Accreditation Desk
            </button>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 5. TEAM SECTION (TWO-COLUMN 4:5 ASPECT RATIO CARDS)               */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-24 px-6 lg:px-12 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs uppercase font-inter font-bold tracking-[0.25em] text-[#a78b71]">
            FACULTY & CUSTODY SUPERVISION
          </div>
          <h2 className="font-playfair text-4xl sm:text-5xl font-normal italic text-white">
            Lead Investigators & Custodians.
          </h2>
          <p className="text-sm font-inter text-zinc-400 font-light">
            Every collegiate loan is authorized and inspected by accredited departmental faculty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Team Member 1: Dr. Anjali Dalvi */}
          <div className="glass-neural rounded-[36px] p-6 group overflow-hidden border border-white/10 hover:border-[#a78b71]/50 transition-neural">
            <div className="aspect-[4/5] rounded-[24px] overflow-hidden bg-zinc-900 relative">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                alt="Dr. Anjali Dalvi"
                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-neural group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-[10px] font-inter uppercase tracking-[0.3em] text-[#a78b71] font-semibold mb-1">
                  FACULTY MENTOR // PRINCIPAL INVESTIGATOR
                </div>
                <h3 className="font-playfair text-3xl font-bold italic text-white">
                  Dr. Anjali Dalvi
                </h3>
                <div className="text-xs font-mono text-zinc-400 mt-1">
                  FAC-AI-019 • Dept. of AIML & Computing
                </div>
              </div>
            </div>
            <p className="text-xs font-inter text-zinc-400 leading-relaxed pt-5 px-2">
              Overseeing 3 active research cohorts with cryptographic requisition sign-off authority. Specialist in
              embedded neural acceleration on FPGA and Jetson architectures.
            </p>
          </div>

          {/* Team Member 2: Ramesh Patil */}
          <div className="glass-neural rounded-[36px] p-6 group overflow-hidden border border-white/10 hover:border-[#a78b71]/50 transition-neural">
            <div className="aspect-[4/5] rounded-[24px] overflow-hidden bg-zinc-900 relative">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80"
                alt="Ramesh Patil"
                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-neural group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-[10px] font-inter uppercase tracking-[0.3em] text-[#a78b71] font-semibold mb-1">
                  CHIEF CUSTODIAN // DISPATCH CONTROLLER
                </div>
                <h3 className="font-playfair text-3xl font-bold italic text-white">
                  Ramesh Patil
                </h3>
                <div className="text-xs font-mono text-zinc-400 mt-1">
                  STAFF ID: LA-04 • Depot Lab 02
                </div>
              </div>
            </div>
            <p className="text-xs font-inter text-zinc-400 leading-relaxed pt-5 px-2">
              Direct controller of the 3-bay modular storage dock and optical checkout scanner. Verifies returned
              pin integrity, cable accessories, and NIST calibration timestamps.
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 6. MULTI-COLUMN LUXURY FOOTER (5-COLUMN DESKTOP)                  */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 bg-[#0a0a0a] border-t border-white/10 pt-20 pb-12 px-6 lg:px-12 text-zinc-400 text-xs font-inter">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-white/10">
          {/* Column 1: Logo & Social Icons */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="font-playfair text-2xl font-bold italic text-white">LabTrack</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#a78b71]" />
            </div>
            <p className="text-zinc-500 leading-relaxed text-[11px]">
              High-end hardware lifecycle orchestration platform designed for institutional engineering rigor.
            </p>
            {/* Social Icons in circular bordered containers */}
            <div className="flex items-center space-x-2 pt-2">
              <a
                href="#network"
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#a78b71] transition-neural"
                title="Global Hardware Network"
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
              <a
                href="#code"
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#a78b71] transition-neural"
                title="Telemetry API & Repository"
              >
                <Code className="w-3.5 h-3.5" />
              </a>
              <a
                href="#share"
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#a78b71] transition-neural"
                title="Department Federation"
              >
                <Share2 className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Platform Modules */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c9b8a0]">
              Architecture
            </div>
            <ul className="space-y-2 text-[12px]">
              <li>
                <button onClick={() => navigate('/workspace/inventory')} className="hover:text-white transition-neural">
                  Master Inventory
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/workspace/custody')} className="hover:text-white transition-neural">
                  Custody Circulation
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/workspace/accountability')} className="hover:text-white transition-neural">
                  Reliability Scores
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/workspace/operations/dispatch')} className="hover:text-white transition-neural">
                  Dispatch Terminal
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Governance */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c9b8a0]">
              Governance
            </div>
            <ul className="space-y-2 text-[12px]">
              <li>NIST SP 800-53 Audited</li>
              <li>2-Tier Hardware Separation</li>
              <li>Faculty Mentorship Sign-off</li>
              <li>Defect Quarantine Policy</li>
            </ul>
          </div>

          {/* Column 4: Institutional Resources */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c9b8a0]">
              Resources
            </div>
            <ul className="space-y-2 text-[12px]">
              <li>Institutional PRN Verification</li>
              <li>NIST Calibration TP1-TP32</li>
              <li>System API Schema</li>
              <li>Department Policy Docs</li>
            </ul>
          </div>

          {/* Column 5: Join Digest Search Input */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c9b8a0]">
              Join Digest
            </div>
            <p className="text-zinc-500 text-[11px]">
              Receive weekly telemetry bulletins on departmental hardware allocations.
            </p>
            <div className="relative flex items-center">
              <input
                type="email"
                placeholder="faculty@institution.edu"
                className="w-full bg-white/[0.04] border border-white/10 rounded-full py-2.5 pl-4 pr-10 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#a78b71] transition-neural"
              />
              <button
                type="button"
                className="absolute right-1 w-7 h-7 rounded-full bg-[#a78b71] hover:bg-[#c9b8a0] text-black flex items-center justify-center transition-neural"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500">
          <div>© 2026 LABTRACK PLATFORM // DEPT. OF ARTIFICIAL INTELLIGENCE & MACHINE LEARNING</div>
          <div className="mt-2 sm:mt-0 font-playfair italic text-zinc-400">
            Crafted for academic rigor and physical computing excellence.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HeroPage;
