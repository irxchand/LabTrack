import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLabData } from '../context/LabDataContext';
import {
  Boxes,
  Cpu,
  Package,
  Clock,
  Inbox,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  LogOut,
  FolderGit2,
  Sparkles,
  ExternalLink,
  Check,
  Zap,
} from 'lucide-react';

export function HeroPage() {
  const navigate = useNavigate();
  const { currentUser, role, currentRole, switchRole, logout } = useAuth();
  const { basket, setIsBasketOpen } = useLabData();

  // Active tour stage: 0 = Workspace, 1 = The Queue, 2 = The Repo Score, 3 = Project & Return
  const [activeStage, setActiveStage] = useState(0);
  const [catalogSubTab, setCatalogSubTab] = useState('assets'); // 'assets' | 'consumables'

  const activeUserRole = currentRole || role || 'Student';

  const stages = [
    {
      id: 'workspace',
      title: 'The Workspace',
      badge: 'ASSETS & CONSUMABLES',
      icon: Boxes,
      headline: 'Everything in the lab, accounted for.',
      subhead: 'A clean 2-tier inventory boundary separating high-value capital assets from bulk project consumables—with exact shelf coordinates.',
    },
    {
      id: 'queue',
      title: 'The Queue',
      badge: 'LOANS & REQUESTS',
      icon: Clock,
      headline: 'Zero lost hardware. Zero notebook logs.',
      subhead: 'A single transparent queue tracking active loans with return countdowns, faculty approval pipelines, and automated waitlist reservations.',
    },
    {
      id: 'reputation',
      title: 'The Repo Score',
      badge: 'STUDENT TRUST RATING',
      icon: ShieldCheck,
      headline: 'Trust is earned with every return.',
      subhead: 'A dynamic 0–100% accountability rating calculated on return timeliness and equipment care, unlocking higher borrowing quotas.',
    },
    {
      id: 'project-handshake',
      title: 'Project & Return',
      badge: 'ACADEMIC ANCHOR',
      icon: FolderGit2,
      headline: 'Hardware tied to purpose. Verified at the counter.',
      subhead: 'Every component is strictly bound to an approved academic project team and faculty mentor, with fair counter return inspection.',
    },
  ];

  const currentStage = stages[activeStage];

  // Real Hardware Samples
  const assets = [
    {
      name: 'NVIDIA Jetson Orin Nano (8GB)',
      category: 'Edge AI / GPU',
      location: 'Shelf B-02',
      qty: '11 Available',
      tag: 'AST-JET-01',
      spec: '40 TOPS AI • 8GB LPDDR5',
    },
    {
      name: 'Xilinx Kintex-7 FPGA Board',
      category: 'Programmable Logic',
      location: 'Shelf C-01',
      qty: '3 Available',
      tag: 'AST-KINTEX-02',
      spec: '325K Logic Cells • DSP Slices',
    },
    {
      name: 'Raspberry Pi 4 Model B (8GB)',
      category: 'Single Board Computer',
      location: 'Shelf A-03',
      qty: '6 Available',
      tag: 'AST-RPI4-04',
      spec: 'Quad Core Cortex-A72 • Dual 4K',
    },
    {
      name: 'Saleae Logic 8 USB Analyzer',
      category: 'Test & Diagnostics',
      location: 'Drawer D-01',
      qty: '4 Available',
      tag: 'AST-LOGIC-01',
      spec: '8 Channels • 100MS/s Logic',
    },
  ];

  const consumables = [
    {
      name: 'ESP32-S3 Wireless Module',
      category: 'Microcontroller',
      location: 'Cabinet 1 • Drawer A-04',
      qty: '64 Units in Stock',
      tag: 'CON-ESP-01',
      spec: 'Wi-Fi + BLE 5.0 • Native USB OTG',
    },
    {
      name: 'MPU-6050 6-DoF Sensor Kit',
      category: 'Motion Sensor',
      location: 'Cabinet 2 • Tray 02',
      qty: '140 Pieces in Stock',
      tag: 'CON-SENS-08',
      spec: '3-Axis Gyro + 3-Axis Accelerometer',
    },
    {
      name: 'Dupont Jumper Wire Ribbons',
      category: 'Prototyping Cables',
      location: 'Open Bins • Station 03',
      qty: '420 Bundles in Stock',
      tag: 'CON-JUMP-02',
      spec: '40-pin 20cm Multi-Color M-M & M-F',
    },
    {
      name: '830-Tie Point Solderless Breadboard',
      category: 'Circuit Prototyping',
      location: 'Storage Rack 04',
      qty: '85 Units in Stock',
      tag: 'CON-BREAD-01',
      spec: 'Dual Power Rails • Phosphor Bronze',
    },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#09090b] text-white font-inter selection:bg-[#a78b71] selection:text-black flex flex-col justify-between relative select-none">
      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 1. AMBIENT BACKGROUND ATMOSPHERE                                  */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-dots pointer-events-none z-0 opacity-20" />

      {/* Radiant ambient gold light orb shining through central stage */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] rounded-full bg-gradient-to-br from-[#c9b8a0]/15 via-[#a78b71]/10 to-transparent blur-[160px] pointer-events-none -z-10" />

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 2. APPLE-GRADE GLASS TOOLBAR                                      */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <header className="h-20 px-6 lg:px-12 flex items-center justify-between border-b border-white/10 bg-white/[0.02] backdrop-blur-2xl z-30 flex-shrink-0">
        {/* Brand Block */}
        <div
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => setActiveStage(0)}
        >
          <span className="font-clash text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f5e6c8] to-[#c9b8a0] leading-none">
            LabTrack
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#c9b8a0] shadow-[0_0_10px_#c9b8a0]" />
        </div>

        {/* Center Floating Segmented Pill Control */}
        <nav className="flex items-center space-x-1 p-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl text-xs font-medium">
          {stages.map((stage, idx) => {
            const isSelected = activeStage === idx;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(idx)}
                className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-[#c9b8a0]/25 text-[#f5e6c8] border border-[#f5e6c8]/50 shadow-[0_0_15px_rgba(201,184,160,0.25)] font-semibold'
                    : 'text-stone-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span>{stage.title}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Persona & Action Controls */}
        <div className="flex items-center space-x-3">
          {/* Persona Capsule */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#c9b8a0]/30 to-[#a78b71]/20 flex items-center justify-center font-bold text-[#f5e6c8] text-[11px]">
              {currentUser?.name ? currentUser.name.charAt(0) : 'R'}
            </div>
            <div className="text-left font-sans leading-tight">
              <div className="text-[12px] font-medium text-white truncate max-w-[110px]">
                {currentUser?.name || 'Rahul Sharma'}
              </div>
              <div className="text-[10px] text-[#c9b8a0]/80 font-mono">
                {activeUserRole}
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
                  className={`px-2 py-0.5 rounded-lg transition-all font-medium cursor-pointer ${
                    isSelected
                      ? 'bg-[#c9b8a0]/25 text-[#f5e6c8] border border-[#f5e6c8]/40'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {r.split(' ')[0]}
                </button>
              );
            })}
          </div>

          {/* Sign Out */}
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
      {/* 3. CENTRAL INTERACTIVE SHOWCASE STAGE                             */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-hidden z-20">
        <div className="w-full max-w-5xl h-full max-h-[620px] rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/15 p-8 sm:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.3)] flex flex-col justify-between relative overflow-hidden">
          
          {/* Top Stage Bar: Stage Eyebrow + Stage Switch Counter */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10 flex-shrink-0">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[10px] font-mono uppercase tracking-widest text-[#c9b8a0]">
              <Sparkles className="w-3 h-3 text-[#f5e6c8]" />
              <span>{currentStage.badge}</span>
            </div>

            <div className="text-xs font-mono text-stone-400">
              FEATURE <span className="text-white font-bold">{activeStage + 1}</span> OF 4
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* DYNAMIC STAGE VIEWS                                           */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="flex-1 py-6 flex flex-col justify-center overflow-y-auto">
            {/* Stage Titles */}
            <div className="max-w-3xl mb-6">
              <h2 className="font-clash text-2xl sm:text-4xl font-bold text-white tracking-tight mb-2 leading-tight">
                {currentStage.headline}
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 font-normal leading-relaxed">
                {currentStage.subhead}
              </p>
            </div>

            {/* ── VIEW 0: THE WORKSPACE (ASSETS VS CONSUMABLES) ──────────── */}
            {activeStage === 0 && (
              <div className="space-y-4">
                {/* Sub Tab Toggle */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCatalogSubTab('assets')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      catalogSubTab === 'assets'
                        ? 'bg-[#c9b8a0] text-black shadow-[0_0_15px_rgba(201,184,160,0.3)]'
                        : 'bg-white/[0.04] text-stone-300 hover:bg-white/[0.08] border border-white/10'
                    }`}
                  >
                    Serialized Capital Assets (4)
                  </button>
                  <button
                    onClick={() => setCatalogSubTab('consumables')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      catalogSubTab === 'consumables'
                        ? 'bg-[#c9b8a0] text-black shadow-[0_0_15px_rgba(201,184,160,0.3)]'
                        : 'bg-white/[0.04] text-stone-300 hover:bg-white/[0.08] border border-white/10'
                    }`}
                  >
                    Bulk Project Consumables (4)
                  </button>
                </div>

                {/* 4 Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {(catalogSubTab === 'assets' ? assets : consumables).map((item) => (
                    <div
                      key={item.tag}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="text-[10px] font-mono text-stone-500 uppercase mb-1">
                          {item.location}
                        </div>
                        <h4 className="font-clash text-sm font-bold text-white mb-1 line-clamp-1">
                          {item.name}
                        </h4>
                        <div className="text-[11px] text-[#c9b8a0] font-mono mb-2">
                          {item.category}
                        </div>
                        <p className="text-[10px] text-stone-400 font-mono line-clamp-2">
                          {item.spec}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/10 mt-3 flex items-center justify-between text-xs">
                        <span className="font-mono text-emerald-400 text-[11px] font-semibold">
                          {item.qty}
                        </span>
                        <span className="text-[10px] font-mono text-stone-400">
                          {item.tag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── VIEW 1: THE QUEUE (ACTIVE LOANS, PIPELINE, WAITLIST) ──── */}
            {activeStage === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Column 1: Active Borrowings */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-[#c9b8a0] uppercase mb-3">
                      <span>1. Active Loans</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>

                    <div className="space-y-2.5">
                      <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                        <div className="flex justify-between items-start text-xs font-bold text-white mb-0.5">
                          <span>NVIDIA Jetson Nano 4GB</span>
                          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                            3d Left
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-stone-400">Tag: JET-NANO-04 • Due 19 Oct</div>
                      </div>

                      <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                        <div className="flex justify-between items-start text-xs font-bold text-white mb-0.5">
                          <span>Saleae Logic 8 USB</span>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            5d Left
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-stone-400">Tag: LOGIC-8-01 • Due 21 Oct</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 text-[11px] font-mono text-[#c9b8a0] flex items-center justify-between">
                    <span>2 Items in Custody</span>
                    <span>No Overdue</span>
                  </div>
                </div>

                {/* Column 2: Requisition Pipeline */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-[#c9b8a0] uppercase mb-3">
                      <span>2. Requisition Pipeline</span>
                      <span className="text-[10px] font-mono text-blue-400">STAGED</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
                      <div className="text-xs font-bold text-white">Google Coral Edge TPU (USB)</div>
                      
                      <div className="space-y-1 text-[10px] font-mono">
                        <div className="flex items-center space-x-1.5 text-emerald-400">
                          <Check className="w-3 h-3" />
                          <span>Requisition Submitted</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-emerald-400">
                          <Check className="w-3 h-3" />
                          <span>Endorsed by Dr. Dalvi</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-amber-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 ml-0.5 mr-1" />
                          <span>Staged at Counter Depot 02</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 text-[11px] font-mono text-emerald-400 flex items-center justify-between">
                    <span>Ready for Counter Pickup</span>
                  </div>
                </div>

                {/* Column 3: FIFO Waitlist */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-[#c9b8a0] uppercase mb-3">
                      <span>3. Reservation Waitlist</span>
                      <span className="text-[10px] font-mono text-amber-400">POSITION #2</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
                      <div className="text-xs font-bold text-white">Kintex-7 UltraScale+ FPGA</div>
                      <div className="text-[10px] font-mono text-stone-400">All 8 Units Currently Loaned</div>
                      <div className="text-xs font-mono text-[#f5e6c8]">
                        Your Queue: <strong>#2 in FIFO Queue</strong>
                      </div>
                      <div className="text-[10px] font-mono text-stone-400">
                        Next Return: Team Hyperion (2 days)
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 text-[11px] font-mono text-stone-400 flex items-center justify-between">
                    <span>Automated Notification Sync</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── VIEW 2: THE REPO SCORE (RELIABILITY RATING) ────────────── */}
            {activeStage === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Circular Gauge */}
                <div className="p-6 rounded-2xl bg-black/40 border border-white/10 flex flex-col items-center justify-center text-center">
                  <div className="relative w-32 h-32 flex items-center justify-center mb-3">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="7"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#c9b8a0"
                        strokeWidth="7"
                        strokeDasharray="251"
                        strokeDashoffset="10"
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-clash text-3xl font-bold text-white">96%</span>
                      <span className="text-[9px] font-mono text-[#c9b8a0] uppercase tracking-wider">
                        TRUST SCORE
                      </span>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-emerald-400 font-semibold">
                    TIER 1 • HIGH RELIABILITY
                  </div>
                </div>

                {/* Score Breakdown Rules */}
                <div className="md:col-span-2 space-y-3">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs">
                    <div>
                      <span className="font-semibold text-white block">On-Time Return Record (100%)</span>
                      <span className="text-stone-400 text-[11px]">14 of 14 hardware loans returned on or before scheduled deadline.</span>
                    </div>
                    <span className="text-emerald-400 font-mono font-bold">+15 Pts</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs">
                    <div>
                      <span className="font-semibold text-white block">Bench Inspection Pass Rate (95%)</span>
                      <span className="text-stone-400 text-[11px]">Zero bent pins, zero burned components, packaging preserved.</span>
                    </div>
                    <span className="text-emerald-400 font-mono font-bold">+20 Pts</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs">
                    <div>
                      <span className="font-semibold text-white block">Unlocked Hardware Custody Quota</span>
                      <span className="text-[#f5e6c8] text-[11px]">Tier 1 clearance unlocks up to 3 simultaneous high-value capital assets.</span>
                    </div>
                    <span className="text-[#c9b8a0] font-mono font-bold">MAX QUOTA</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── VIEW 3: PROJECT LINK & RETURN HANDSHAKE ────────────────── */}
            {activeStage === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Academic Project Anchor */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <div className="text-[10px] font-mono uppercase text-[#c9b8a0] font-bold">
                    ACADEMIC PROJECT ANCHOR
                  </div>
                  <h4 className="font-clash text-lg font-bold text-white">
                    PRJ-AIML-08: Autonomous Drone Navigation
                  </h4>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    All hardware requisitions are strictly validated against approved academic course projects and faculty mentor quotas.
                  </p>

                  <div className="space-y-1 text-xs font-mono text-stone-300 pt-1">
                    <div>Supervisor: <strong className="text-[#f5e6c8]">Dr. Anjali Dalvi (AIML Dept)</strong></div>
                    <div>Team Quota: <strong className="text-emerald-400">2 of 3 Capital Assets Active</strong></div>
                  </div>
                </div>

                {/* Physical Counter Return Inspection */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <div className="text-[10px] font-mono uppercase text-[#c9b8a0] font-bold">
                    PHYSICAL RETURN INSPECTION
                  </div>
                  <h4 className="font-clash text-lg font-bold text-white">
                    Dual-State Counter Handshake
                  </h4>
                  
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                      <strong>Clean Return:</strong> Verified by lab assistant, restocked, and releases next team on waitlist.
                    </div>
                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                      <strong>Defect Reported:</strong> Routed to repair bench without penalizing your Repo Score for honest wear & tear.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* BOTTOM TOUR CONTROLS: PREV / NEXT + LAUNCH WORKSPACE           */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between flex-shrink-0">
            {/* Step Navigation Dots */}
            <div className="flex items-center space-x-2">
              {stages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStage(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    activeStage === idx
                      ? 'w-8 bg-[#c9b8a0]'
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                  title={`Go to stage ${idx + 1}`}
                />
              ))}
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActiveStage((prev) => (prev > 0 ? prev - 1 : stages.length - 1))}
                className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-stone-300 hover:text-white border border-white/10 text-xs font-medium transition-colors cursor-pointer flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              <button
                onClick={() => setActiveStage((prev) => (prev < stages.length - 1 ? prev + 1 : 0))}
                className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-stone-300 hover:text-white border border-white/10 text-xs font-medium transition-colors cursor-pointer flex items-center space-x-1"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => navigate('/workspace/inventory')}
                className="px-6 py-2.5 rounded-full text-black font-bold text-xs uppercase tracking-wider transition-all shadow-[0_4px_25px_rgba(167,139,113,0.4)] cursor-pointer flex items-center space-x-2"
                style={{
                  background: 'linear-gradient(to right, #a78b71 0%, #c9b8a0 50%, #e8d5b7 100%)',
                }}
              >
                <span>Enter Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 4. UNDERSTATED ENGINEERING FOOTER BAR                             */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <footer className="h-12 px-6 lg:px-12 flex items-center justify-between border-t border-white/10 text-[11px] font-mono text-stone-500 bg-white/[0.01] flex-shrink-0">
        <div>Department of AIML • Symbiosis Institute of Technology</div>
        <div className="hidden sm:block">LabTrack Hardware Lifecycle Platform</div>
        <div className="text-stone-600">NIST SP 800-53 Audited</div>
      </footer>
    </div>
  );
}

export default HeroPage;
