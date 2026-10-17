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
  X,
  Zap,
} from 'lucide-react';
import { InteractiveWavesBackground } from '../components/canvas/InteractiveWavesBackground';
import { useAuth } from '../context/AuthContext';

const POLICIES = {
  privacy: {
    id: 'privacy',
    tag: 'Privacy & Legal',
    title: 'Privacy Policy',
    subtitle: 'Institutional data protection, student PRN encryption, and telemetry handling.',
    sections: [],
  },
  terms: {
    id: 'terms',
    tag: 'Privacy & Legal',
    title: 'Terms of Service',
    subtitle: 'Platform acceptable use, laboratory hardware custody agreements, and account standards.',
    sections: [],
  },
  cookies: {
    id: 'cookies',
    tag: 'Privacy & Legal',
    title: 'Cookie & Data Policy',
    subtitle: 'Session tokens, JWT authentication caching, and local storage standards.',
    sections: [],
  },
  security: {
    id: 'security',
    tag: 'Privacy & Legal',
    title: 'Security & Compliance',
    subtitle: 'Access controls, immutable audit logging, and vulnerability disclosure protocols.',
    sections: [],
  },
  instrumentSop: {
    id: 'instrumentSop',
    tag: 'Bench Operating Procedure',
    title: 'Instrument Calibration SOP',
    subtitle: 'Standardized calibration protocols for oscilloscopes, logic analyzers, and programmable supplies.',
    sections: [
      {
        heading: '10x Probe Attenuation & Compensation',
        body: 'Connect probe to the 1kHz square-wave calibration terminal. Adjust trimmer capacitor until leading edge shows zero overshoot or undershoot before probing active digital buses.',
      },
      {
        heading: 'DC Current Compliance Pre-Setting',
        body: 'Short the supply leads at zero voltage, dial current limit to the calculated safety ceiling (e.g. 250mA for microcontrollers), then disengage short before powering circuits.',
      },
      {
        heading: 'Common Ground Isolation',
        body: 'Ensure oscilloscope earth clip connects exclusively to system ground reference. Never connect probe ground to hot or floating power rail potentials.',
      },
    ],
  },
  toolchains: {
    id: 'toolchains',
    tag: 'Laboratory Software & Drivers',
    title: 'Embedded Toolchains & SDKs',
    subtitle: 'Verified compiler environments, synthesis tools, and hardware programming drivers.',
    sections: [
      {
        heading: 'FPGA Synthesis Environments',
        body: 'Lab workstations feature pre-licensed AMD Xilinx Vivado ML Enterprise and Lattice Diamond synthesis suites with Cable Driver USB drivers.',
      },
      {
        heading: 'Microcontroller Toolchains',
        body: 'Official support packages for STM32CubeIDE (ARM Cortex-M), ESP-IDF v5.2 (Xtensa / RISC-V), and Raspberry Pi Pico C/C++ SDK are synced across benches.',
      },
      {
        heading: 'Hardware JTAG/SWD Debuggers',
        body: 'OpenOCD and SEGGER J-Link debugging servers are accessible locally. Debug probes can be requisitioned via standard bench checkouts.',
      },
    ],
  },
  pinouts: {
    id: 'pinouts',
    tag: 'Hardware Reference Repository',
    title: 'Pinouts & Schematic Archive',
    subtitle: 'Official hardware reference diagrams, electrical characteristics, and interface timing.',
    sections: [
      {
        heading: 'Official GPIO Pin Maps',
        body: 'Verified pin multiplexing diagrams for Jetson Orin Nano, STM32F4 Discovery, ESP32-S3 DevKit, and Zynq-7000 FPGA development headers.',
      },
      {
        heading: 'Electrical Voltage Tolerances',
        body: 'Confirm 3.3V vs 5.0V I/O level tolerance tables before connecting mixed-voltage sensors. Use on-bench bi-directional level shifters where required.',
      },
      {
        heading: 'Communication Protocol Standards',
        body: 'Standard reference sheets for I2C pull-up resistor calculation, SPI clock polarity/phase (CPOL/CPHA), and differential CAN bus termination.',
      },
    ],
  },
  defectTriage: {
    id: 'defectTriage',
    tag: 'RMA & Quality Control Guide',
    title: 'Zero-Penalty Defect Triage',
    subtitle: 'Step-by-step protocol for defective or damaged components with guaranteed strike immunity.',
    sections: [
      {
        heading: 'Immediate Bench De-Energization',
        body: 'Switch off main DC supply breakers immediately upon observing component smoking, excessive package temperature (>85°C), or supply short-circuit buzzing.',
      },
      {
        heading: 'Logging RMA in Workspace',
        body: 'Navigate to My Bench → Active Custody → Report Defect. Select the failure mode (e.g. fried GPIO, dead bootloader, thermal overrun) with a brief note.',
      },
      {
        heading: 'Turn-In & Immediate Replacement',
        body: 'Present the quarantined hardware to Counter Station LA-04. The triage tag ensures 0 penalty strikes and priority issuance of an operational replacement.',
      },
    ],
  },
};

export function HeroPage() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [digestEmail, setDigestEmail] = useState('');
  const [digestSubscribed, setDigestSubscribed] = useState(false);
  const [activePolicyModal, setActivePolicyModal] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroContainerRef = useRef(null);

  // Keyboard Escape and body scroll lock for Cupertino Policy Modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActivePolicyModal(null);
      }
    };
    if (activePolicyModal) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [activePolicyModal]);

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
            onClick={() => navigate('/workspace/projects')}
            className="text-xs font-medium text-stone-300 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/[0.06] transition-all cursor-pointer font-sans"
          >
            Projects
          </button>
          <button
            type="button"
            onClick={() => navigate('/workspace/inventory')}
            className="text-xs font-medium text-stone-300 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/[0.06] transition-all cursor-pointer font-sans"
          >
            Workstation
          </button>
          <button
            type="button"
            onClick={() => navigate('/workspace/custody/requests')}
            className="text-xs font-medium text-stone-300 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/[0.06] transition-all cursor-pointer font-sans"
          >
            Requisitions
          </button>
          <button
            type="button"
            onClick={() => navigate('/workspace/custody/active')}
            className="text-xs font-medium text-stone-300 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/[0.06] transition-all cursor-pointer font-sans"
          >
            Active Loans
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
          </div>

          {/* Column 2: Bench SOPs & Technical Toolchains */}
          <div>
            <div className="text-xs font-semibold tracking-wider text-stone-300 font-sans uppercase mb-4">
              Bench SOPs & Guides
            </div>
            <ul className="space-y-3 text-xs text-stone-400 font-normal font-sans">
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicyModal(POLICIES.instrumentSop)}
                  className="hover:text-white transition-colors text-left cursor-pointer flex flex-col gap-0.5 group w-full"
                >
                  <span className="text-stone-200 font-medium group-hover:text-[#e8d5b7] transition-colors">
                    Instrument Calibration SOP
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Oscilloscope 10x probe grounding & DC current limits
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicyModal(POLICIES.toolchains)}
                  className="hover:text-white transition-colors text-left cursor-pointer flex flex-col gap-0.5 group w-full"
                >
                  <span className="text-stone-200 font-medium group-hover:text-[#e8d5b7] transition-colors">
                    Embedded Toolchains & SDKs
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Vivado, STM32Cube, and ESP-IDF board packages
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicyModal(POLICIES.pinouts)}
                  className="hover:text-white transition-colors text-left cursor-pointer flex flex-col gap-0.5 group w-full"
                >
                  <span className="text-stone-200 font-medium group-hover:text-[#e8d5b7] transition-colors">
                    Pinouts & Schematic Archive
                  </span>
                  <span className="text-[11px] text-stone-500">
                    High-res GPIO pin maps & component timing sheets
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicyModal(POLICIES.defectTriage)}
                  className="hover:text-white transition-colors text-left cursor-pointer flex flex-col gap-0.5 group w-full"
                >
                  <span className="text-stone-200 font-medium group-hover:text-[#e8d5b7] transition-colors">
                    Zero-Penalty Defect Triage
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Safe bench shutdown & RMA replacement guide
                  </span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Privacy & Legal Policies */}
          <div>
            <div className="text-xs font-semibold tracking-wider text-stone-300 font-sans uppercase mb-4">
              Privacy & Legal
            </div>
            <ul className="space-y-3 text-xs text-stone-400 font-normal font-sans">
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicyModal(POLICIES.privacy)}
                  className="hover:text-white transition-colors text-left cursor-pointer flex flex-col gap-0.5 group w-full"
                >
                  <span className="text-stone-200 font-medium group-hover:text-[#e8d5b7] transition-colors">
                    Privacy Policy
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Data protection & student identity handling
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicyModal(POLICIES.terms)}
                  className="hover:text-white transition-colors text-left cursor-pointer flex flex-col gap-0.5 group w-full"
                >
                  <span className="text-stone-200 font-medium group-hover:text-[#e8d5b7] transition-colors">
                    Terms of Service
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Acceptable use & laboratory access guidelines
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicyModal(POLICIES.cookies)}
                  className="hover:text-white transition-colors text-left cursor-pointer flex flex-col gap-0.5 group w-full"
                >
                  <span className="text-stone-200 font-medium group-hover:text-[#e8d5b7] transition-colors">
                    Cookie & Data Policy
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Session tokens & local browser storage
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicyModal(POLICIES.security)}
                  className="hover:text-white transition-colors text-left cursor-pointer flex flex-col gap-0.5 group w-full"
                >
                  <span className="text-stone-200 font-medium group-hover:text-[#e8d5b7] transition-colors">
                    Security & Compliance
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Access control & institutional data standards
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
              <div className="text-xs font-sans text-[#c9b8a0] tracking-normal animate-fadeIn flex items-center gap-1.5">
                <span>✓ Enrolled in Institutional Procurement & Maintenance Circular.</span>
              </div>
            )}
            <div className="pt-2 text-[11px] text-stone-500 font-sans">
              Official institutional notifications delivered directly to collegiate PRN inboxes.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex items-center justify-between text-xs font-sans text-stone-500">
          <div>
            © {new Date().getFullYear()} LabTrack Academic Hardware OS • Department of Computer Science & Engineering. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────────────────
          CUPERTINO GLASS POLICY MODAL DIALOG (Zero Browser Alerts)
      ───────────────────────────────────────────────────────────────────────── */}
      {activePolicyModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="policy-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setActivePolicyModal(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl bg-[#0d0d0d]/95 border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.85)] backdrop-blur-2xl p-6 sm:p-8 overflow-hidden text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Specular Bevel Line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Header: Category Badge & Close Button */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#a78b71]/10 border border-[#a78b71]/30 text-[#e8d5b7] text-[11px] font-medium tracking-wide uppercase font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9b8a0]" />
                <span>{activePolicyModal.tag}</span>
              </div>
              <button
                type="button"
                onClick={() => setActivePolicyModal(null)}
                className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 flex items-center justify-center text-stone-400 hover:text-white transition-colors cursor-pointer -mr-1 -mt-1"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title & Subtitle */}
            <h3
              id="policy-dialog-title"
              className="font-display font-semibold text-2xl text-white tracking-tight mb-2"
            >
              {activePolicyModal.title}
            </h3>
            <p className="text-xs text-stone-400 font-normal leading-relaxed font-sans mb-6">
              {activePolicyModal.subtitle}
            </p>

            {/* Policy Sections or Clean Empty State */}
            {activePolicyModal.sections && activePolicyModal.sections.length > 0 ? (
              <div className="space-y-3 mb-6">
                {activePolicyModal.sections.map((section, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white/[0.025] border border-white/5 space-y-1"
                  >
                    <div className="text-xs font-medium text-stone-200 font-sans flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-[#c9b8a0]" />
                      <span>{section.heading}</span>
                    </div>
                    <p className="text-[12px] text-stone-400 font-normal leading-relaxed font-sans pl-3">
                      {section.body}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 px-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center mb-6">
                <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-3 text-stone-400">
                  <Shield className="w-5 h-5 text-[#c9b8a0]" />
                </div>
                <h4 className="text-sm font-medium text-white mb-1 font-sans">
                  Section In Preparation
                </h4>
                <p className="text-xs text-stone-400 font-sans max-w-sm mx-auto leading-relaxed">
                  Official policy terms are currently empty and scheduled for publication. Full legal text will be posted here.
                </p>
              </div>
            )}

            {/* Dismiss CTA */}
            <div className="flex justify-end pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={() => setActivePolicyModal(null)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-[#e8d5b7] transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer"
              >
                Understood & Acknowledged
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HeroPage;
