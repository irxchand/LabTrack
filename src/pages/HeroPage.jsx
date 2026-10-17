import React, { useState, useRef, useEffect } from 'react';
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
import { useAuth } from '../context/AuthContext';

export function HeroPage() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [digestEmail, setDigestEmail] = useState('');
  const [digestSubscribed, setDigestSubscribed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroContainerRef = useRef(null);

  // Auth gate: First is auth page, then hero page
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

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

  const getUserInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#a78b71] selection:text-black overflow-x-hidden relative font-sans">
      {/* ─────────────────────────────────────────────────────────────────────────
          WHOLE-PAGE INTERACTIVE WAVES BACKGROUND (Full Bleed Viewport Canvas)
      ───────────────────────────────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <InteractiveWavesBackground
          lineColor="rgba(201, 184, 160, 0.2)"
          backgroundColor="transparent"
          waveSpeedX={0.015}
          waveSpeedY={0.007}
          waveAmpX={36}
          waveAmpY={16}
          friction={0.925}
          tension={0.007}
          maxCursorMove={120}
          xGap={14}
          yGap={36}
          showCursorDot={false}
        />
      </div>

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
        </div>

        {/* Center: Apple-Grade Glass Segmented Navigation Pill */}
        <nav className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <a
            href="#capabilities"
            className="text-xs font-medium text-stone-300 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/[0.06] transition-all font-sans"
          >
            Capabilities
          </a>
          <button
            type="button"
            onClick={() => navigate('/workspace/inventory')}
            className="text-xs font-medium text-stone-300 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/[0.06] transition-all cursor-pointer font-sans"
          >
            Workstation
          </button>
          <button
            type="button"
            onClick={() => navigate('/workspace/custody/active')}
            className="text-xs font-medium text-stone-300 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/[0.06] transition-all cursor-pointer font-sans"
          >
            Active Loans
          </button>
          <button
            type="button"
            onClick={() => navigate('/workspace/custody/requisitions')}
            className="text-xs font-medium text-stone-300 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/[0.06] transition-all cursor-pointer font-sans"
          >
            Requisitions
          </button>
          <button
            type="button"
            onClick={() => navigate('/workspace/projects')}
            className="text-xs font-medium text-stone-300 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/[0.06] transition-all cursor-pointer font-sans"
          >
            Projects
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {isAuthenticated && currentUser ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden md:flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-full bg-white/[0.03] border border-white/10 hover:border-[#a78b71]/40 transition-all backdrop-blur-md shadow-sm">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#a78b71]/35 to-[#e8d5b7]/20 border border-[#c9b8a0]/30 flex items-center justify-center text-[10px] font-semibold text-[#f5e6c8] tracking-tight select-none">
                  {getUserInitials(currentUser.name || currentUser.prn)}
                </div>
                <span className="font-medium text-white/90 text-xs tracking-tight">
                  {currentUser.name || currentUser.prn}
                </span>
                <span className="text-[10px] font-medium text-[#c9b8a0] bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/10">
                  {currentUser.role}
                </span>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#c9b8a0] hover:text-rose-400 transition-colors px-2.5 py-1.5 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#c9b8a0] hover:text-white transition-colors px-3 py-1.5 hidden sm:inline-block cursor-pointer"
            >
              Sign In
            </button>
          )}
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
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12 sm:mb-16">
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
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────
          Capabilities & Workflow Cards (5-Column Responsive Grid, Clash Display)
      ───────────────────────────────────────────────────────────────────────── */}
      <section
        id="capabilities"
        className="py-28 px-6 sm:px-12 max-w-7xl mx-auto relative z-10 border-t border-white/5"
      >
        <div className="text-center mb-20 max-w-3xl mx-auto px-4">
          <h2 className="font-display font-semibold text-3xl sm:text-4xl lg:text-[44px] text-white leading-[1.25] tracking-[-0.01em]">
            From Project Proposal{' '}
            <span className="block mt-1.5 text-transparent bg-clip-text bg-gradient-to-r from-[#e8d5b7] via-[#c9b8a0] to-[#a78b71]">
              to Active Bench Custody
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
              <h3 className="font-display font-bold text-xl text-white tracking-tight mb-2.5 group-hover:text-[#e8d5b7] transition-colors">
                Projects
              </h3>
              <p className="text-xs text-gray-400 font-normal leading-relaxed font-sans">
                Form Capstone and Mini Project teams, assemble collaborative rosters, and compile required hardware Bills of Materials.
              </p>
            </div>
            <div className="mt-6 pt-3.5 border-t border-white/5 flex items-center justify-between text-[11px] font-sans font-medium tracking-wide text-[#c9b8a0] group-hover:text-[#e8d5b7] transition-colors">
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
              <h3 className="font-display font-bold text-xl text-white tracking-tight mb-2.5 group-hover:text-[#e8d5b7] transition-colors">
                Workstation
              </h3>
              <p className="text-xs text-gray-400 font-normal leading-relaxed font-sans">
                Search real-time inventory across AIML, IoT, and Embedded labs for available FPGAs, microcontrollers, sensors, and instruments.
              </p>
            </div>
            <div className="mt-6 pt-3.5 border-t border-white/5 flex items-center justify-between text-[11px] font-sans font-medium tracking-wide text-[#c9b8a0] group-hover:text-[#e8d5b7] transition-colors">
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
              <h3 className="font-display font-bold text-xl text-white tracking-tight mb-2.5 group-hover:text-[#e8d5b7] transition-colors">
                Requisitions
              </h3>
              <p className="text-xs text-gray-400 font-normal leading-relaxed font-sans">
                Submit component baskets for faculty guide review, track one-tap approvals, and route approved items to the dispatch desk.
              </p>
            </div>
            <div className="mt-6 pt-3.5 border-t border-white/5 flex items-center justify-between text-[11px] font-sans font-medium tracking-wide text-[#c9b8a0] group-hover:text-[#e8d5b7] transition-colors">
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
              <h3 className="font-display font-bold text-xl text-white tracking-tight mb-2.5 group-hover:text-[#e8d5b7] transition-colors">
                Waitlist
              </h3>
              <p className="text-xs text-gray-400 font-normal leading-relaxed font-sans">
                Reserve high-demand equipment, monitor live queue positioning, and automatically claim available instruments upon check-in.
              </p>
            </div>
            <div className="mt-6 pt-3.5 border-t border-white/5 flex items-center justify-between text-[11px] font-sans font-medium tracking-wide text-[#c9b8a0] group-hover:text-[#e8d5b7] transition-colors">
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
              <h3 className="font-display font-bold text-xl text-white tracking-tight mb-2.5 group-hover:text-[#e8d5b7] transition-colors">
                My Bench
              </h3>
              <p className="text-xs text-gray-400 font-normal leading-relaxed font-sans">
                Monitor active equipment custody, observe real-time countdown return timers, and report component defects with zero penalty strikes.
              </p>
            </div>
            <div className="mt-6 pt-3.5 border-t border-white/5 flex items-center justify-between text-[11px] font-sans font-medium tracking-wide text-[#c9b8a0] group-hover:text-[#e8d5b7] transition-colors">
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
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Column 1: Institutional Identity & Telemetry */}
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
            <p className="text-xs text-stone-400 font-normal leading-relaxed font-sans">
              Department of Computer Science & Engineering • Physical Computing & Embedded Systems Division.
            </p>

            {/* Live Station Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-sans font-medium text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Counter Station: Active • LA-04</span>
            </div>

            <div className="flex items-center gap-2.5 pt-1 text-stone-400 text-xs font-sans">
              <span>Counter Extension: <strong className="text-white">Ex-408</strong></span>
            </div>
          </div>

          {/* Column 2: Physical Facilities & Operating Windows */}
          <div>
            <div className="text-xs font-semibold tracking-wider text-stone-300 font-sans uppercase mb-4">
              Facilities & Schedules
            </div>
            <ul className="space-y-3.5 text-xs text-stone-400 font-normal font-sans">
              <li className="flex flex-col gap-0.5">
                <span className="text-stone-200 font-medium hover:text-[#e8d5b7] transition-colors cursor-default">
                  AIML & Robotics Suite (Lab 304)
                </span>
                <span className="text-[11px] text-stone-500">
                  GPU Rigs • LiDAR Sensors • Robotic Arms
                </span>
              </li>
              <li className="flex flex-col gap-0.5">
                <span className="text-stone-200 font-medium hover:text-[#e8d5b7] transition-colors cursor-default">
                  IoT & Sensor Mesh Lab (Lab 212)
                </span>
                <span className="text-[11px] text-stone-500">
                  LoRaWAN Gateway • Spectrum Analyzers • RF Testbeds
                </span>
              </li>
              <li className="flex flex-col gap-0.5">
                <span className="text-stone-200 font-medium hover:text-[#e8d5b7] transition-colors cursor-default">
                  VLSI & Silicon Synthesis (Lab 401)
                </span>
                <span className="text-[11px] text-stone-500">
                  FPGA Workstations • Logic Analyzers
                </span>
              </li>
              <li className="flex flex-col gap-0.5">
                <span className="text-stone-200 font-medium hover:text-[#e8d5b7] transition-colors cursor-default">
                  Rapid Prototyping Bay (Shop B)
                </span>
                <span className="text-[11px] text-stone-500">
                  PCB Milling • Soldering Stations • 3D Printing
                </span>
              </li>
              <li className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-[#c9b8a0]">
                <span>Counter Dispatch Windows</span>
                <span className="font-medium text-stone-300">08:30 – 19:30 IST</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Custody Charter & Governance Policies */}
          <div>
            <div className="text-xs font-semibold tracking-wider text-stone-300 font-sans uppercase mb-4">
              Governance & Policies
            </div>
            <ul className="space-y-3 text-xs text-stone-400 font-normal font-sans">
              <li>
                <button
                  type="button"
                  onClick={() => alert("Fair-Use Lending Terms & SLA:\n\n• Short-term loans: 72h max checkout with 1 extension permit.\n• Capstone allocation: Full semester custody linked to approved PRJ Bill of Materials.\n• Zero overdue penalties when extension is requested 24h prior to return deadline.")}
                  className="hover:text-white transition-colors text-left cursor-pointer flex flex-col gap-0.5 group w-full"
                >
                  <span className="text-stone-200 font-medium group-hover:text-[#e8d5b7] transition-colors">
                    Fair-Use Lending SLA
                  </span>
                  <span className="text-[11px] text-stone-500">
                    72h standard bench checkout & extension rules
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => alert("ESD & High-Voltage Bench Safety Protocol:\n\n• Anti-static wrist straps mandatory on all FPGA & CMOS benches.\n• Current-limited power supplies must be pre-set before device connection.\n• Report burnt traces or component smoking immediately to Counter LA-04.")}
                  className="hover:text-white transition-colors text-left cursor-pointer flex flex-col gap-0.5 group w-full"
                >
                  <span className="text-stone-200 font-medium group-hover:text-[#e8d5b7] transition-colors">
                    ESD & Clean Bench Protocol
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Static grounding & oscilloscope voltage limits
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => alert("Penalty Contest & Dispute Resolution:\n\n• Accidental hardware defects reported via Bench Triage carry 0 penalty strikes.\n• Involuntary return delays caused by institutional exam schedules qualify for automatic strike waivers.\n• Written appeals reviewed weekly by the Department Academic Council.")}
                  className="hover:text-white transition-colors text-left cursor-pointer flex flex-col gap-0.5 group w-full"
                >
                  <span className="text-stone-200 font-medium group-hover:text-[#e8d5b7] transition-colors">
                    Dispute Appeals & Waivers
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Zero-penalty triage contestation process
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => alert("Capstone Attribution & Open Source IP:\n\n• Hardware components provided by LabTrack remain institutional property.\n• Firmware, Verilog, and machine learning models created by students belong 100% to the student group.\n• Research papers must include standard institutional equipment acknowledgement.")}
                  className="hover:text-white transition-colors text-left cursor-pointer flex flex-col gap-0.5 group w-full"
                >
                  <span className="text-stone-200 font-medium group-hover:text-[#e8d5b7] transition-colors">
                    Capstone IP Attribution
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Open hardware licensing & student project IP
                  </span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Lab Circular & Procurement Bulletins */}
          <div className="space-y-4">
            <div className="text-xs font-semibold tracking-wider text-stone-300 font-sans uppercase">
              Lab Circular & Bulletins
            </div>
            <p className="text-xs text-stone-400 font-normal leading-relaxed font-sans">
              Subscribe for semester procurement arrivals, maintenance blackouts, and hackathon component quota reservations.
            </p>
            {/* Sleek Apple-style pill input with luxury gold submit button */}
            <form
              onSubmit={handleDigestSubmit}
              className="relative flex items-center rounded-full bg-white/[0.04] border border-white/10 hover:border-white/20 focus-within:border-[#c9b8a0]/60 focus-within:bg-white/[0.06] transition-all duration-200 p-1.5 pl-4 backdrop-blur-md"
            >
              <input
                type="email"
                placeholder="student@institute.edu"
                value={digestEmail}
                onChange={(e) => setDigestEmail(e.target.value)}
                required
                className="w-full bg-transparent text-xs text-white placeholder:text-stone-500 font-sans focus:outline-none pr-2"
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f5e6c8] to-[#c9b8a0] text-black flex items-center justify-center hover:opacity-95 active:scale-95 transition-all flex-shrink-0 cursor-pointer shadow-sm"
                title="Subscribe to Circular"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            {digestSubscribed && (
              <div className="text-xs font-sans text-emerald-400 tracking-normal animate-fadeIn">
                ✓ Enrolled in Institutional Procurement & Maintenance Circular.
              </div>
            )}
            <div className="pt-2 text-[11px] text-stone-500 font-sans">
              Official institutional notifications delivered directly to collegiate PRN inboxes.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs font-sans text-stone-500 gap-4">
          <div>
            © {new Date().getFullYear()} LabTrack Academic Hardware OS • Department of Computer Science & Engineering.
          </div>
          <div className="flex items-center gap-6 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Lab Clusters Nominal</span>
            </span>
            <span>•</span>
            <span>Zero-Trust Hardware Dispatch</span>
            <span>•</span>
            <span>ISO 9001 Lab Compliance</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HeroPage;
