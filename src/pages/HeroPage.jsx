import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowUpRight,
  Menu,
  X,
  Check,
  AlertTriangle,
  Flame,
  Layers,
  Activity,
  Shield,
  FileCode2,
  Terminal,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// 1. SPEC COMPONENT: Status Chip (v-chip)
// ─────────────────────────────────────────────────────────────────────────────
function StatusChip({ status = 'PASS', label }) {
  const dotColor =
    status === 'PASS'
      ? 'bg-[#62c073]'
      : status === 'WARN'
      ? 'bg-[#999999]'
      : 'bg-[#ededed]';

  return (
    <span className="inline-flex items-center gap-[6px] px-[10px] py-[4px] rounded-[100px] bg-[#1f1f1f] text-[12px] font-mono uppercase text-[#999999] whitespace-nowrap select-none">
      <span className={`w-[6px] h-[6px] rounded-full ${dotColor}`} />
      <span>{label || status}</span>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. SPEC COMPONENT: Timeline Progress Bar
// ─────────────────────────────────────────────────────────────────────────────
function TimelineProgressBar({ startPercent = 0, durationPercent = 20, isActive = false }) {
  return (
    <div className="w-full h-1.5 bg-transparent relative">
      <div
        className={`absolute h-full rounded-[2px] transition-all duration-300 ${
          isActive ? 'bg-[#52a8ff]' : 'bg-[rgba(255,255,255,0.18)]'
        }`}
        style={{
          left: `${startPercent}%`,
          width: `${durationPercent}%`,
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. MAIN HERO PAGE (Strictly compliant with Dark Tech Brutalist Spec)
// ─────────────────────────────────────────────────────────────────────────────
export function HeroPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedSpanId, setSelectedSpanId] = useState('span-req-8821');

  const handleEnterWorkspace = () => {
    if (isAuthenticated) {
      navigate('/workspace');
    } else {
      navigate('/login');
    }
  };

  // Event stream mock data for LabTrack hardware spans
  const EVENT_SPANS = [
    {
      id: 'span-req-8821',
      label: 'requisition.verify_endorsement',
      actor: 'Dr. Anjali Dalvi (Guide)',
      startPercent: 8,
      durationPercent: 24,
      durationText: '142ms',
      status: 'PASS',
    },
    {
      id: 'span-fifo-waitlist',
      label: 'queue.fifo_allocation_lease',
      actor: 'Kernel Scheduler',
      startPercent: 32,
      durationPercent: 18,
      durationText: '88ms',
      status: 'PASS',
    },
    {
      id: 'span-hardware-dispatch',
      label: 'custody.counter_pickup_sign',
      actor: 'Ramesh Patil (Desk)',
      startPercent: 50,
      durationPercent: 35,
      durationText: '210ms',
      status: 'PASS',
    },
    {
      id: 'span-bga-pin-check',
      label: 'telemetry.pin_continuity_bench',
      actor: 'Automated RMA Node',
      startPercent: 85,
      durationPercent: 12,
      durationText: '45ms',
      status: 'WARN',
    },
    {
      id: 'span-return-ledger',
      label: 'ledger.sha256_custody_commit',
      actor: 'Vault Daemon',
      startPercent: 97,
      durationPercent: 3,
      durationText: '18ms',
      status: 'PASS',
    },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#52a8ff]/30 selection:text-white font-sans overflow-x-hidden relative">
      {/* ───────────────────────────────────────────────────────────────── */}
      {/* HEADER: Absolute positioned at top: 38px, horizontal padding 56px */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <header className="absolute top-[38px] left-0 right-0 px-6 sm:px-[56px] z-50 flex items-center justify-between">
        {/* Left: Geometric SVG Logo + Brand Name in Inter Medium (20px) */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          {/* Geometric SVG Monogram */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <rect x="2" y="2" width="9" height="9" fill="#ffffff" />
            <rect x="13" y="2" width="9" height="9" fill="#52a8ff" />
            <rect x="2" y="13" width="9" height="9" fill="#62c073" />
            <rect x="13" y="13" width="9" height="9" fill="#ededed" />
          </svg>
          <span className="font-['Inter'] font-medium text-[20px] tracking-[-0.5px] text-white">
            LabTrack
          </span>
        </div>

        {/* Center: Hidden-on-mobile nav with 16px white links */}
        <nav className="hidden md:flex items-center gap-8 text-[16px] text-white font-normal">
          <a
            href="#event-stream"
            className="hover:text-[#52a8ff] transition-colors duration-150"
          >
            Event Stream
          </a>
          <a
            href="#bento-grid"
            className="hover:text-[#52a8ff] transition-colors duration-150"
          >
            Architecture
          </a>
          <a
            href="#metrics"
            className="hover:text-[#52a8ff] transition-colors duration-150"
          >
            Metrics
          </a>
        </nav>

        {/* Right: btn-square CTA with 0px border-radius, background #fff, text #121212 */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleEnterWorkspace}
            className="hidden sm:inline-flex items-center gap-2 bg-[#FFFFFF] text-[#121212] px-[12px] py-[8px] text-[14px] font-medium tracking-[-0.2px] rounded-none hover:bg-[#ededed] active:bg-[#d4d4d4] transition-colors cursor-pointer"
          >
            <span>{isAuthenticated ? 'Enter Workspace' : 'Launch Depot'}</span>
            <ArrowUpRight className="w-[14px] h-[14px]" />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 text-white hover:text-[#52a8ff]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Full-screen Mobile Menu (Transitions on small screens) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#000000] z-40 flex flex-col justify-center px-8 space-y-6 md:hidden animate-in fade-in duration-200">
          <a
            href="#event-stream"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[24px] font-['Inter'] font-medium text-white hover:text-[#52a8ff]"
          >
            Event Stream
          </a>
          <a
            href="#bento-grid"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[24px] font-['Inter'] font-medium text-white hover:text-[#52a8ff]"
          >
            Architecture
          </a>
          <a
            href="#metrics"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[24px] font-['Inter'] font-medium text-white hover:text-[#52a8ff]"
          >
            Metrics
          </a>
          <div className="pt-6 border-t border-[rgba(255,255,255,0.145)]">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleEnterWorkspace();
              }}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#FFFFFF] text-[#121212] p-[16px] text-[18px] font-medium rounded-none"
            >
              <span>{isAuthenticated ? 'Enter Workspace' : 'Launch Depot'}</span>
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* HERO SECTION: Full-height (100svh), heavy black scrim overlay */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="relative w-full h-[100svh] min-h-[640px] flex items-end pb-[72px] sm:pb-[96px] px-6 sm:px-[56px] overflow-hidden">
        {/* Background Hardware Image */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <img
            src="/images/hardware/jetson-nano.jpg"
            alt="LabTrack Hardware Infrastructure"
            className="w-full h-full object-cover object-center filter brightness-[0.7] contrast-[1.1]"
          />
          {/* Spec Scrim: linear-gradient(to top, rgba(0,0,0,0.76) 0%, rgba(0,0,0,0) 93.785%) */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.76) 45%, rgba(0,0,0,0) 93.785%)',
            }}
          />
          {/* Subtle Accent Radial Glow */}
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[300px] bg-[#52a8ff]/10 rounded-full blur-[140px] pointer-events-none" />
        </div>

        {/* Hero Content Block */}
        <div className="max-w-[752px] z-10">
          <div className="mb-4">
            <StatusChip status="PASS" label="AIML LABORATORY 2026 // DEPT OF AI & DS" />
          </div>

          <h1 className="font-['Inter'] font-[500] text-white leading-[1.04] text-[34px] sm:text-[48px] lg:text-[60px] tracking-[-1px] sm:tracking-[-2px] lg:tracking-[-3.36px]">
            The Physical Hardware Custody Operating System.
          </h1>

          <p className="mt-[20px] text-[16px] text-[#e7e7e7] font-normal leading-[1.5] max-w-[640px]">
            Deterministic chain of custody, automated FIFO reservation queues, and cryptographically verified faculty endorsements for engineering research laboratories.
          </p>

          <div className="mt-[32px] flex items-center gap-4">
            {/* Spec Large CTA: btn-square, 0px border-radius, font-size: 20px, 12px diagonal arrow */}
            <button
              type="button"
              onClick={handleEnterWorkspace}
              className="inline-flex items-center gap-[10px] bg-[#FFFFFF] text-[#121212] px-[24px] py-[16px] text-[20px] font-medium tracking-[-0.5px] rounded-none hover:bg-[#ededed] active:bg-[#d4d4d4] transition-colors cursor-pointer"
            >
              <span>{isAuthenticated ? 'Enter Workspace' : 'Launch Depot'}</span>
              <ArrowUpRight className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* EVENT STREAM TABLE SECTION */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section
        id="event-stream"
        className="max-w-[1240px] mx-auto px-6 sm:px-[56px] py-[80px]"
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#52a8ff]" />
              <span className="text-[12px] font-mono uppercase tracking-wider text-[#999999]">
                Live Custody Telemetry
              </span>
            </div>
            <h2 className="font-['Inter'] font-[500] text-[28px] sm:text-[36px] tracking-[-1.5px] text-white">
              Event Stream Trace
            </h2>
          </div>

          {/* Header metadata chips */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[12px] text-[#999999] bg-[#1f1f1f] px-3 py-1 rounded-[100px]">
              trace_id: <span className="text-white">0x8f22_aiml_core</span>
            </span>
            <StatusChip status="PASS" label="240ms Total" />
          </div>
        </div>

        {/* Card-based Table Layout: #0a0a0a with 1px ring border rgba(255,255,255,0.145) */}
        <div className="bg-[#0a0a0a] ring-1 ring-[rgba(255,255,255,0.145)] rounded-none overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[rgba(255,255,255,0.145)]">
            {/* Left Sidebar (240px): Scrollable list of event IDs with status dots */}
            <div className="md:col-span-4 lg:col-span-3 p-4 bg-[#0a0a0a]">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#999999] mb-3 px-2">
                Active Spans ({EVENT_SPANS.length})
              </div>
              <div className="space-y-1">
                {EVENT_SPANS.map((span) => {
                  const isSelected = selectedSpanId === span.id;
                  return (
                    <button
                      key={span.id}
                      type="button"
                      onClick={() => setSelectedSpanId(span.id)}
                      className={`w-full text-left px-3 py-2 rounded-none text-[12px] font-mono transition-colors flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#1f1f1f] text-white ring-1 ring-[#52a8ff]/40'
                          : 'text-[#999999] hover:bg-[#141414] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className={`w-[6px] h-[6px] rounded-full flex-shrink-0 ${
                            span.status === 'PASS' ? 'bg-[#62c073]' : 'bg-[#999999]'
                          }`}
                        />
                        <span className="truncate">{span.id}</span>
                      </div>
                      <span className="text-[11px] text-[#999999]">{span.durationText}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Side: Table with SPAN, START, and DURATION columns */}
            <div className="md:col-span-8 lg:col-span-9 p-4 sm:p-6 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[540px]">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.145)] text-[11px] font-mono text-[#999999] uppercase tracking-wider">
                    <th className="pb-3 w-1/3">SPAN</th>
                    <th className="pb-3 w-1/2">START / TIMELINE OFFSET</th>
                    <th className="pb-3 text-right">DURATION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.08)]">
                  {EVENT_SPANS.map((span) => {
                    const isSelected = selectedSpanId === span.id;
                    return (
                      <tr
                        key={span.id}
                        onClick={() => setSelectedSpanId(span.id)}
                        className={`transition-colors cursor-pointer ${
                          isSelected ? 'bg-[#1f1f1f]/50' : 'hover:bg-white/[0.02]'
                        }`}
                      >
                        <td className="py-3.5 pr-4">
                          <div className="font-mono text-[13px] text-white truncate">
                            {span.label}
                          </div>
                          <div className="font-mono text-[11px] text-[#999999] mt-0.5">
                            {span.actor}
                          </div>
                        </td>

                        <td className="py-3.5 px-2">
                          <TimelineProgressBar
                            startPercent={span.startPercent}
                            durationPercent={span.durationPercent}
                            isActive={isSelected}
                          />
                        </td>

                        <td className="py-3.5 pl-4 text-right">
                          <span className="font-mono text-[13px] text-white">
                            {span.durationText}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* BENTO FEATURE GRID (3-column grid of #0a0a0a cards) */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section
        id="bento-grid"
        className="max-w-[1240px] mx-auto px-6 sm:px-[56px] py-[80px] border-t border-[rgba(255,255,255,0.145)]"
      >
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#62c073]" />
            <span className="text-[12px] font-mono uppercase tracking-wider text-[#999999]">
              Verified Infrastructure
            </span>
          </div>
          <h2 className="font-['Inter'] font-[500] text-[28px] sm:text-[36px] tracking-[-1.5px] text-white">
            Bento Subsystem Grid
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Regression / Chain of Custody Verification */}
          <div className="bg-[#0a0a0a] ring-1 ring-[rgba(255,255,255,0.145)] rounded-none p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono uppercase text-[#999999]">
                  01 // REGRESSION AUDIT
                </span>
                <StatusChip status="PASS" label="0 LEAKS" />
              </div>
              <h3 className="font-['Inter'] font-[500] text-[18px] text-white mb-2">
                Chain of Custody Verifier
              </h3>
              <p className="text-[13px] text-[#999999] leading-relaxed mb-6">
                Automated continuous verification checks every checked-out GPU, sensor, and board against faculty guide authorizations.
              </p>
            </div>

            {/* Vertical list of status rows with PASS/FAIL chips */}
            <div className="space-y-2.5 font-mono text-[12px] border-t border-[rgba(255,255,255,0.1)] pt-4">
              <div className="flex items-center justify-between">
                <span className="text-white">PRJ-AIML-08 Allocation</span>
                <StatusChip status="PASS" label="+0.0% DRIFT" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Orin Serial Verification</span>
                <StatusChip status="PASS" label="100% MATCH" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Overdue Return Flag</span>
                <StatusChip status="PASS" label="0 FLAGS" />
              </div>
            </div>
          </div>

          {/* Card 2: Failure Clustering / Defect Quarantine */}
          <div className="bg-[#0a0a0a] ring-1 ring-[rgba(255,255,255,0.145)] rounded-none p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono uppercase text-[#999999]">
                  02 // FAILURE CLUSTERING
                </span>
                <StatusChip status="WARN" label="1 QUARANTINE" />
              </div>
              <h3 className="font-['Inter'] font-[500] text-[18px] text-white mb-2">
                Defect Triage & RMA Bench
              </h3>
              <p className="text-[13px] text-[#999999] leading-relaxed mb-6">
                Component faults reported by students automatically route to the Lab Assistant diagnostic queue for bench isolation.
              </p>
            </div>

            {/* Stacked horizontal bar charts for error metrics */}
            <div className="space-y-3 font-mono text-[11px] border-t border-[rgba(255,255,255,0.1)] pt-4">
              <div>
                <div className="flex justify-between text-[#999999] mb-1">
                  <span>GPIO Pin Continuity Fatigue</span>
                  <span className="text-white">12%</span>
                </div>
                <div className="w-full h-1.5 bg-[#1f1f1f]">
                  <div className="h-full bg-[#52a8ff]" style={{ width: '12%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#999999] mb-1">
                  <span>Thermal Throttling Under Load</span>
                  <span className="text-white">4%</span>
                </div>
                <div className="w-full h-1.5 bg-[#1f1f1f]">
                  <div className="h-full bg-[#62c073]" style={{ width: '4%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#999999] mb-1">
                  <span>Sensor Calibration Drift</span>
                  <span className="text-white">1%</span>
                </div>
                <div className="w-full h-1.5 bg-[#1f1f1f]">
                  <div className="h-full bg-[#999999]" style={{ width: '1%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Version Replay / Ledger Code-Diff View */}
          <div className="bg-[#0a0a0a] ring-1 ring-[rgba(255,255,255,0.145)] rounded-none p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono uppercase text-[#999999]">
                  03 // IMMUTABLE LEDGER DIFF
                </span>
                <StatusChip status="PASS" label="SHA-256" />
              </div>
              <h3 className="font-['Inter'] font-[500] text-[18px] text-white mb-2">
                Custody Replay & State Diff
              </h3>
              <p className="text-[13px] text-[#999999] leading-relaxed mb-4">
                Every hardware check-in, counter dispatch, and mentor endorsement is logged as an atomic commit.
              </p>
            </div>

            {/* Code-diff view with green/blue side-borders for added/modified lines */}
            <div className="bg-[#000000] p-3 font-mono text-[11px] leading-relaxed border-t border-[rgba(255,255,255,0.1)]">
              <div className="border-l-2 border-[#62c073] pl-2 text-[#62c073] py-0.5 truncate">
                + commit_id: 0x9f1a_dispatch_desk
              </div>
              <div className="border-l-2 border-[#52a8ff] pl-2 text-[#52a8ff] py-0.5 truncate">
                ~ actor: student_202401048 (Rahul)
              </div>
              <div className="border-l-2 border-[#52a8ff] pl-2 text-zinc-300 py-0.5 truncate">
                ~ asset_tag: HW-JETSON-ORIN-01
              </div>
              <div className="border-l-2 border-[#62c073] pl-2 text-[#62c073] py-0.5 truncate">
                + status: In-Custody // Due Oct 24
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* METRICS GRID (4-column border-connected grid) */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section
        id="metrics"
        className="max-w-[1240px] mx-auto px-6 sm:px-[56px] py-[80px] border-t border-[rgba(255,255,255,0.145)]"
      >
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#52a8ff]" />
            <span className="text-[12px] font-mono uppercase tracking-wider text-[#999999]">
              Operational SLA
            </span>
          </div>
          <h2 className="font-['Inter'] font-[500] text-[28px] sm:text-[36px] tracking-[-1.5px] text-white">
            System Metrics Grid
          </h2>
        </div>

        {/* 4-column border-connected grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-[rgba(255,255,255,0.145)] gap-[1px]">
          {/* Cell 1 */}
          <div className="bg-[#000000] p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex items-baseline gap-1">
              <span className="font-['Inter'] font-[500] text-[48px] sm:text-[56px] tracking-[-3.36px] text-white leading-none">
                100
              </span>
              <span className="font-mono text-[18px] text-[#52a8ff]">%</span>
            </div>
            <div className="mt-4">
              <div className="font-['Inter'] text-[14px] font-medium text-white">
                Cryptographic Custody
              </div>
              <div className="font-mono text-[12px] text-[#999999] mt-1">
                Zero untracked hardware exit
              </div>
            </div>
          </div>

          {/* Cell 2 */}
          <div className="bg-[#000000] p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex items-baseline gap-1">
              <span className="font-['Inter'] font-[500] text-[48px] sm:text-[56px] tracking-[-3.36px] text-white leading-none">
                0
              </span>
              <span className="font-mono text-[18px] text-[#62c073]">ms</span>
            </div>
            <div className="mt-4">
              <div className="font-['Inter'] text-[14px] font-medium text-white">
                Verification Latency
              </div>
              <div className="font-mono text-[12px] text-[#999999] mt-1">
                Real-time MySQL signature check
              </div>
            </div>
          </div>

          {/* Cell 3 */}
          <div className="bg-[#000000] p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex items-baseline gap-1">
              <span className="font-['Inter'] font-[500] text-[48px] sm:text-[56px] tracking-[-3.36px] text-white leading-none">
                14.2
              </span>
              <span className="font-mono text-[18px] text-[#999999]">k</span>
            </div>
            <div className="mt-4">
              <div className="font-['Inter'] text-[14px] font-medium text-white">
                Monitored Components
              </div>
              <div className="font-mono text-[12px] text-[#999999] mt-1">
                Sensors, GPUs, MCUs tracked
              </div>
            </div>
          </div>

          {/* Cell 4 */}
          <div className="bg-[#000000] p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex items-baseline gap-1">
              <span className="font-['Inter'] font-[500] text-[48px] sm:text-[56px] tracking-[-3.36px] text-white leading-none">
                0
              </span>
              <span className="font-mono text-[18px] text-[#ededed]">%</span>
            </div>
            <div className="mt-4">
              <div className="font-['Inter'] text-[14px] font-medium text-white">
                FIFO Line Bypass
              </div>
              <div className="font-mono text-[12px] text-[#999999] mt-1">
                Deterministic fair allocation
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* FINAL CALL TO ACTION */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section className="max-w-[1240px] mx-auto px-6 sm:px-[56px] py-[96px] border-t border-[rgba(255,255,255,0.145)]">
        <div className="bg-[#0a0a0a] ring-1 ring-[rgba(255,255,255,0.145)] rounded-none p-8 sm:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <StatusChip status="PASS" label="READY FOR COUNTER DISPATCH" />
            <h2 className="font-['Inter'] font-[500] text-[32px] sm:text-[42px] tracking-[-2px] text-white mt-4">
              Launch the Hardware Depot.
            </h2>
            <p className="text-[15px] text-[#999999] max-w-xl mt-2 font-normal">
              Sign in with your university student, faculty mentor, or lab administrator credentials to manage active loans and requisitions.
            </p>
          </div>

          <button
            type="button"
            onClick={handleEnterWorkspace}
            className="inline-flex items-center gap-[10px] bg-[#FFFFFF] text-[#121212] px-[28px] py-[18px] text-[18px] font-medium tracking-[-0.5px] rounded-none hover:bg-[#ededed] active:bg-[#d4d4d4] transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>{isAuthenticated ? 'Open Active Workspace' : 'Sign In to LabTrack'}</span>
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* FOOTER */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[rgba(255,255,255,0.145)] py-[36px] px-6 sm:px-[56px] text-[12px] font-mono text-[#999999] flex flex-col sm:flex-row items-center justify-between gap-4 max-w-[1240px] mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-white font-medium">LabTrack</span>
          <span>//</span>
          <span>Department of Artificial Intelligence & Data Science</span>
        </div>
        <div>
          <span>Deterministic Hardware Custody • 2026</span>
        </div>
      </footer>
    </div>
  );
}

export default HeroPage;
