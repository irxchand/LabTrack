import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowUpRight,
  Menu,
  X,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// SPEC COMPONENT: Status Chip (v-chip)
// Specification:
// "Create an inline-flex element: background #1f1f1f, border-radius 100px,
// padding 4px 10px, gap 6px. Inside, a 6px x 6px circle with a status-dependent
// background color (#62c073 for PASS, #999999 for WARN, #ededed for ERROR/FAIL)
// followed by uppercase text in Geist Mono, font-size 12px, color #999999."
// ─────────────────────────────────────────────────────────────────────────────
export function StatusChip({ status = 'PASS', label }) {
  const dotColor =
    status === 'PASS'
      ? 'bg-[#62c073]'
      : status === 'WARN'
      ? 'bg-[#999999]'
      : 'bg-[#ededed]';

  return (
    <span
      className="v-chip"
      style={{
        backgroundColor: '#1f1f1f',
        borderRadius: '100px',
        padding: '4px 10px',
        gap: '6px',
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      <span
        className={`rounded-full flex-shrink-0 ${dotColor}`}
        style={{ width: '6px', height: '6px' }}
      />
      <span
        style={{
          fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
          fontSize: '12px',
          color: '#999999',
          textTransform: 'uppercase',
        }}
      >
        {label || status}
      </span>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SPEC COMPONENT: Timeline Progress Bar
// Specification:
// "Container: w-full, h-1.5, bg-transparent. Inner bar: absolute, height 100%,
// rounded-sm (2px). The inner bar's left position and width should be controlled
// via percentage to represent start time and duration respectively.
// Default color: rgba(255,255,255,0.18), Active color: #52a8ff."
// ─────────────────────────────────────────────────────────────────────────────
export function TimelineProgressBar({
  startPercent = 0,
  durationPercent = 20,
  isActive = false,
}) {
  return (
    <div className="w-full h-1.5 bg-transparent relative">
      <div
        className="absolute h-full transition-all duration-200"
        style={{
          left: `${startPercent}%`,
          width: `${durationPercent}%`,
          borderRadius: '2px',
          backgroundColor: isActive ? '#52a8ff' : 'rgba(255, 255, 255, 0.18)',
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE: Dark Tech Brutalist Implementation
// ─────────────────────────────────────────────────────────────────────────────
export function HeroPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedSpanId, setSelectedSpanId] = useState('span-req-8821');

  const handleAction = () => {
    if (isAuthenticated) {
      navigate('/workspace');
    } else {
      navigate('/login');
    }
  };

  // Telemetry Spans for Event Stream Table
  const EVENT_SPANS = [
    {
      id: 'span-req-8821',
      label: 'requisition.verify_endorsement',
      startPercent: 4,
      durationPercent: 26,
      durationText: '142ms',
      status: 'PASS',
    },
    {
      id: 'span-fifo-queue',
      label: 'queue.fifo_allocation_lease',
      startPercent: 30,
      durationPercent: 16,
      durationText: '88ms',
      status: 'PASS',
    },
    {
      id: 'span-counter-sign',
      label: 'custody.counter_pickup_sign',
      startPercent: 48,
      durationPercent: 38,
      durationText: '210ms',
      status: 'PASS',
    },
    {
      id: 'span-pin-continuity',
      label: 'telemetry.pin_continuity_bench',
      startPercent: 82,
      durationPercent: 12,
      durationText: '45ms',
      status: 'WARN',
    },
    {
      id: 'span-sha256-commit',
      label: 'ledger.sha256_custody_commit',
      startPercent: 96,
      durationPercent: 4,
      durationText: '18ms',
      status: 'PASS',
    },
  ];

  return (
    <div
      className="min-h-screen text-white font-sans overflow-x-hidden relative"
      style={{ backgroundColor: '#000000' }}
    >
      {/* ───────────────────────────────────────────────────────────────── */}
      {/* HEADER: Absolute at top: 38px, horizontal padding: 56px */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <header
        className="absolute z-50 flex items-center justify-between"
        style={{
          top: '38px',
          left: 0,
          right: 0,
          paddingLeft: '56px',
          paddingRight: '56px',
        }}
      >
        {/* Left: Geometric SVG + Brand Name in Inter Medium (20px) */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          {/* Geometric SVG */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="2" y="2" width="9" height="9" fill="#ffffff" />
            <rect x="13" y="2" width="9" height="9" fill="#52a8ff" />
            <rect x="2" y="13" width="9" height="9" fill="#62c073" />
            <rect x="13" y="13" width="9" height="9" fill="#ededed" />
          </svg>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: '20px',
              letterSpacing: '-0.5px',
              color: '#ffffff',
            }}
          >
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

        {/* Right: btn-square CTA 'Book a demo' (background: #fff, text: #121212, padding: 8px 12px) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAction}
            className="btn-square hidden sm:inline-flex items-center gap-2"
            style={{
              borderRadius: '0px',
              backgroundColor: '#ffffff',
              color: '#121212',
              padding: '8px 12px',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            <span>Book a demo</span>
            <ArrowUpRight style={{ width: '12px', height: '12px' }} />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 text-white hover:text-[#52a8ff]"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Full-screen Mobile Menu (Transitions on small screens) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col justify-center px-8 space-y-6 md:hidden animate-in fade-in duration-150"
          style={{ backgroundColor: '#000000' }}
        >
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
                handleAction();
              }}
              className="btn-square w-full inline-flex items-center justify-center gap-2"
              style={{
                borderRadius: '0px',
                backgroundColor: '#ffffff',
                color: '#121212',
                padding: '16px',
                fontSize: '18px',
                fontWeight: 500,
              }}
            >
              <span>Book a demo</span>
              <ArrowUpRight style={{ width: '14px', height: '14px' }} />
            </button>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* HERO SECTION: Full-height (100svh) canvas frame */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section
        className="relative w-full flex items-end overflow-hidden"
        style={{
          height: '100svh',
          minHeight: '620px',
          paddingBottom: '88px',
          paddingLeft: '56px',
          paddingRight: '56px',
        }}
      >
        {/* Background image with heavy black scrim overlay on bottom 40-70% */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <img
            src="/images/hardware/jetson-nano.jpg"
            alt="Hardware Infrastructure"
            className="w-full h-full object-cover object-center filter contrast-[1.15]"
          />
          {/* Spec Scrim: linear-gradient(to top, rgba(0,0,0,0.76) 0%, rgba(0,0,0,0) 93.785%) */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(0,0,0,0.76) 0%, rgba(0,0,0,0) 93.785%)',
            }}
          />
          {/* Accent radial background glow */}
          <div
            className="absolute bottom-0 left-1/3 w-[500px] h-[300px] rounded-full blur-[140px] pointer-events-none"
            style={{ backgroundColor: 'rgba(82, 168, 255, 0.08)' }}
          />
        </div>

        {/* Hero Content Block */}
        <div style={{ maxWidth: '752px' }} className="z-10">
          <div className="mb-4">
            <StatusChip status="PASS" label="DEPOT V4.2 // CONTINUOUS CUSTODY" />
          </div>

          {/* Headline: 'headline-fluid' (32px to 60px) in Inter Display, white, max-width 752px */}
          <h1 className="headline-fluid">
            The Physical Hardware Custody Operating System.
          </h1>

          {/* Subtext: font-size 16px, color #e7e7e7 */}
          <p
            className="mt-5 max-w-[640px]"
            style={{
              fontSize: '16px',
              color: '#e7e7e7',
              lineHeight: '1.5',
            }}
          >
            Deterministic chain of custody, automated FIFO reservation queues, and cryptographically verified faculty endorsements for engineering research laboratories.
          </p>

          {/* Large CTA: btn-square, 0px border-radius, font-size 20px, 12px diagonal arrow */}
          <div className="mt-8">
            <button
              type="button"
              onClick={handleAction}
              className="btn-square inline-flex items-center gap-3"
              style={{
                borderRadius: '0px',
                backgroundColor: '#ffffff',
                color: '#121212',
                fontSize: '20px',
                padding: '16px 24px',
                fontWeight: 500,
              }}
            >
              <span>Book a demo</span>
              <ArrowUpRight style={{ width: '12px', height: '12px' }} />
            </button>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* EVENT STREAM TABLE SECTION */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section
        id="event-stream"
        className="max-w-[1240px] mx-auto py-[96px]"
        style={{ paddingLeft: '56px', paddingRight: '56px' }}
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: '#52a8ff' }}
              />
              <span
                style={{
                  fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
                  fontSize: '12px',
                  color: '#999999',
                  textTransform: 'uppercase',
                }}
              >
                Real-Time Telemetry Trace
              </span>
            </div>
            <h2
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: '32px',
                letterSpacing: '-1.5px',
                color: '#ffffff',
              }}
            >
              Event Stream Table
            </h2>
          </div>

          {/* Header Metadata Chips */}
          <div className="flex items-center gap-3">
            <span
              style={{
                fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
                fontSize: '12px',
                color: '#999999',
                backgroundColor: '#1f1f1f',
                padding: '4px 10px',
                borderRadius: '100px',
              }}
            >
              trace_id: <span className="text-white">0x8f22_aiml_core</span>
            </span>
            <StatusChip status="PASS" label="240MS TOTAL" />
          </div>
        </div>

        {/* Card-based Table Layout: #0a0a0a with 1px ring border rgba(255,255,255,0.145) */}
        <div
          className="spec-card rounded-none overflow-hidden"
          style={{
            backgroundColor: '#0a0a0a',
            border: '1px solid rgba(255, 255, 255, 0.145)',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[rgba(255,255,255,0.145)]">
            {/* Left Sidebar (240px): Scrollable list of event IDs with status dots */}
            <div
              className="md:col-span-4 lg:w-[240px] p-4 flex-shrink-0"
              style={{ backgroundColor: '#0a0a0a' }}
            >
              <div
                style={{
                  fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
                  fontSize: '11px',
                  color: '#999999',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                  paddingLeft: '8px',
                }}
              >
                Event IDs ({EVENT_SPANS.length})
              </div>

              <div className="space-y-1">
                {EVENT_SPANS.map((span) => {
                  const isSelected = selectedSpanId === span.id;
                  return (
                    <button
                      key={span.id}
                      type="button"
                      onClick={() => setSelectedSpanId(span.id)}
                      className="w-full text-left px-3 py-2 rounded-none transition-colors flex items-center justify-between cursor-pointer"
                      style={{
                        backgroundColor: isSelected ? '#1f1f1f' : 'transparent',
                        border: isSelected
                          ? '1px solid #52a8ff'
                          : '1px solid transparent',
                        fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
                        fontSize: '12px',
                        color: isSelected ? '#ffffff' : '#999999',
                      }}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="rounded-full flex-shrink-0"
                          style={{
                            width: '6px',
                            height: '6px',
                            backgroundColor:
                              span.status === 'PASS' ? '#62c073' : '#999999',
                          }}
                        />
                        <span className="truncate">{span.id}</span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#999999' }}>
                        {span.durationText}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Side: Table with SPAN, START, and DURATION columns */}
            <div className="md:col-span-8 lg:flex-1 p-5 sm:p-6 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr
                    className="border-b border-[rgba(255,255,255,0.145)]"
                    style={{
                      fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
                      fontSize: '11px',
                      color: '#999999',
                      textTransform: 'uppercase',
                    }}
                  >
                    <th className="pb-3 w-2/5">SPAN</th>
                    <th className="pb-3 w-2/5">START</th>
                    <th className="pb-3 text-right w-1/5">DURATION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.08)]">
                  {EVENT_SPANS.map((span) => {
                    const isSelected = selectedSpanId === span.id;
                    return (
                      <tr
                        key={span.id}
                        onClick={() => setSelectedSpanId(span.id)}
                        className="transition-colors cursor-pointer"
                        style={{
                          backgroundColor: isSelected
                            ? 'rgba(31, 31, 31, 0.45)'
                            : 'transparent',
                        }}
                      >
                        <td className="py-3.5 pr-4">
                          <span
                            style={{
                              fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
                              fontSize: '13px',
                              color: isSelected ? '#ffffff' : '#ededed',
                            }}
                          >
                            {span.label}
                          </span>
                        </td>

                        <td className="py-3.5 px-2">
                          {/* Progress Bar Visualization: 1.5h relative background */}
                          <TimelineProgressBar
                            startPercent={span.startPercent}
                            durationPercent={span.durationPercent}
                            isActive={isSelected}
                          />
                        </td>

                        <td className="py-3.5 pl-4 text-right">
                          <span
                            style={{
                              fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
                              fontSize: '13px',
                              color: isSelected ? '#52a8ff' : '#999999',
                            }}
                          >
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
      {/* BENTO FEATURE GRID: 3-column grid of cards (#0a0a0a) */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section
        id="bento-grid"
        className="max-w-[1240px] mx-auto py-[96px] border-t border-[rgba(255,255,255,0.145)]"
        style={{ paddingLeft: '56px', paddingRight: '56px' }}
      >
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: '#62c073' }}
            />
            <span
              style={{
                fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
                fontSize: '12px',
                color: '#999999',
                textTransform: 'uppercase',
              }}
            >
              System Telemetry Architecture
            </span>
          </div>
          <h2
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: '32px',
              letterSpacing: '-1.5px',
              color: '#ffffff',
            }}
          >
            Bento Feature Grid
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 (Regression): Vertical list of status rows with PASS/FAIL chips & percentage changes */}
          <div
            className="spec-card p-6 flex flex-col justify-between"
            style={{
              backgroundColor: '#0a0a0a',
              border: '1px solid rgba(255, 255, 255, 0.145)',
              borderRadius: '0px',
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span
                  style={{
                    fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
                    fontSize: '11px',
                    color: '#999999',
                    textTransform: 'uppercase',
                  }}
                >
                  Regression
                </span>
                <StatusChip status="PASS" label="100% OK" />
              </div>
              <h3
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: '18px',
                  color: '#ffffff',
                  marginBottom: '8px',
                }}
              >
                Continuous Integrity
              </h3>
              <p style={{ fontSize: '13px', color: '#999999', lineHeight: '1.5' }}>
                Automated regression sweeps verify serial numbers, active workbench custody, and faculty endorsements every 60 seconds.
              </p>
            </div>

            {/* Vertical list of status rows with PASS/FAIL chips and percentage changes */}
            <div
              className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.1)] space-y-3"
              style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', monospace" }}
            >
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-white">PRJ-AIML-08_lease</span>
                <div className="flex items-center gap-2">
                  <span style={{ color: '#62c073' }}>+0.0%</span>
                  <StatusChip status="PASS" />
                </div>
              </div>

              <div className="flex items-center justify-between text-[12px]">
                <span className="text-white">orin_agx_signature</span>
                <div className="flex items-center gap-2">
                  <span style={{ color: '#62c073' }}>+0.0%</span>
                  <StatusChip status="PASS" />
                </div>
              </div>

              <div className="flex items-center justify-between text-[12px]">
                <span className="text-white">overdue_lock_check</span>
                <div className="flex items-center gap-2">
                  <span style={{ color: '#999999' }}>0.0%</span>
                  <StatusChip status="PASS" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 (Failure Clustering): Stacked horizontal bar charts for error metrics */}
          <div
            className="spec-card p-6 flex flex-col justify-between"
            style={{
              backgroundColor: '#0a0a0a',
              border: '1px solid rgba(255, 255, 255, 0.145)',
              borderRadius: '0px',
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span
                  style={{
                    fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
                    fontSize: '11px',
                    color: '#999999',
                    textTransform: 'uppercase',
                  }}
                >
                  Failure Clustering
                </span>
                <StatusChip status="WARN" label="1 FLAG" />
              </div>
              <h3
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: '18px',
                  color: '#ffffff',
                  marginBottom: '8px',
                }}
              >
                Defect Isolation
              </h3>
              <p style={{ fontSize: '13px', color: '#999999', lineHeight: '1.5' }}>
                Hardware anomaly categorization maps damaged pins, thermal throttles, and sensor drifts to quarantine benches.
              </p>
            </div>

            {/* Stacked horizontal bar charts for error metrics */}
            <div
              className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.1)] space-y-3"
              style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', monospace" }}
            >
              <div>
                <div className="flex justify-between text-[11px] text-[#999999] mb-1">
                  <span>GPIO Pin Continuity Fatigue</span>
                  <span className="text-white">12%</span>
                </div>
                <div className="w-full h-1.5 bg-[#1f1f1f]">
                  <div
                    className="h-full"
                    style={{ width: '12%', backgroundColor: '#52a8ff' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-[#999999] mb-1">
                  <span>Thermal Throttling Under Load</span>
                  <span className="text-white">4%</span>
                </div>
                <div className="w-full h-1.5 bg-[#1f1f1f]">
                  <div
                    className="h-full"
                    style={{ width: '4%', backgroundColor: '#62c073' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-[#999999] mb-1">
                  <span>Sensor Calibration Drift</span>
                  <span className="text-white">1%</span>
                </div>
                <div className="w-full h-1.5 bg-[#1f1f1f]">
                  <div
                    className="h-full"
                    style={{ width: '1%', backgroundColor: '#999999' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 (Version Replay): Code-diff view with green/blue side-borders for added/modified lines */}
          <div
            className="spec-card p-6 flex flex-col justify-between"
            style={{
              backgroundColor: '#0a0a0a',
              border: '1px solid rgba(255, 255, 255, 0.145)',
              borderRadius: '0px',
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span
                  style={{
                    fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
                    fontSize: '11px',
                    color: '#999999',
                    textTransform: 'uppercase',
                  }}
                >
                  Version Replay
                </span>
                <StatusChip status="PASS" label="ATOMIC" />
              </div>
              <h3
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: '18px',
                  color: '#ffffff',
                  marginBottom: '8px',
                }}
              >
                Immutable Ledger Diff
              </h3>
              <p style={{ fontSize: '13px', color: '#999999', lineHeight: '1.5' }}>
                Replay historical states of the laboratory ledger. Every counter transaction generates a verifiable SHA-256 state delta.
              </p>
            </div>

            {/* Code-diff view with green/blue side-borders */}
            <div
              className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.1)] p-3 space-y-1"
              style={{
                backgroundColor: '#000000',
                fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
                fontSize: '11px',
                lineHeight: '1.5',
              }}
            >
              <div
                style={{
                  borderLeft: '2px solid #62c073',
                  paddingLeft: '8px',
                  color: '#62c073',
                }}
              >
                + [COMMIT 0x8f2a] REQ-8821 verified
              </div>
              <div
                style={{
                  borderLeft: '2px solid #52a8ff',
                  paddingLeft: '8px',
                  color: '#52a8ff',
                }}
              >
                ~ [CUSTODY] Holder: Rahul Sharma (202401048)
              </div>
              <div
                style={{
                  borderLeft: '2px solid #52a8ff',
                  paddingLeft: '8px',
                  color: '#ededed',
                }}
              >
                ~ [LOCATION] Desk 04 // Due Oct 24
              </div>
              <div
                style={{
                  borderLeft: '2px solid #62c073',
                  paddingLeft: '8px',
                  color: '#62c073',
                }}
              >
                + [HASH] e3b0c44298fc1c149afbf4c8996fb
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* METRICS GRID: 4-column border-connected grid */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <section
        id="metrics"
        className="max-w-[1240px] mx-auto py-[96px] border-t border-[rgba(255,255,255,0.145)]"
        style={{ paddingLeft: '56px', paddingRight: '56px' }}
      >
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: '#52a8ff' }}
            />
            <span
              style={{
                fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
                fontSize: '12px',
                color: '#999999',
                textTransform: 'uppercase',
              }}
            >
              Telemetry Matrix
            </span>
          </div>
          <h2
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: '32px',
              letterSpacing: '-1.5px',
              color: '#ffffff',
            }}
          >
            Metrics Grid
          </h2>
        </div>

        {/* 4-column border-connected grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px]"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.145)' }}
        >
          {/* Cell 1: 100 % */}
          <div
            className="p-8 flex flex-col justify-between"
            style={{ backgroundColor: '#000000' }}
          >
            <div className="flex items-baseline gap-1">
              <span
                style={{
                  fontFamily: "'Geist', 'Inter', sans-serif",
                  fontSize: '56px',
                  letterSpacing: '-3.36px',
                  color: '#ffffff',
                  lineHeight: 1,
                  fontWeight: 500,
                }}
              >
                100
              </span>
              <span
                style={{
                  fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
                  fontSize: '18px',
                  color: '#52a8ff',
                }}
              >
                %
              </span>
            </div>
            <div className="mt-4">
              <div
                style={{
                  fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
                  fontSize: '12px',
                  color: '#999999',
                }}
              >
                Chain of Custody Rate
              </div>
            </div>
          </div>

          {/* Cell 2: 0 ms */}
          <div
            className="p-8 flex flex-col justify-between"
            style={{ backgroundColor: '#000000' }}
          >
            <div className="flex items-baseline gap-1">
              <span
                style={{
                  fontFamily: "'Geist', 'Inter', sans-serif",
                  fontSize: '56px',
                  letterSpacing: '-3.36px',
                  color: '#ffffff',
                  lineHeight: 1,
                  fontWeight: 500,
                }}
              >
                0
              </span>
              <span
                style={{
                  fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
                  fontSize: '18px',
                  color: '#62c073',
                }}
              >
                ms
              </span>
            </div>
            <div className="mt-4">
              <div
                style={{
                  fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
                  fontSize: '12px',
                  color: '#999999',
                }}
              >
                Audit Latency Drift
              </div>
            </div>
          </div>

          {/* Cell 3: 14.2 M */}
          <div
            className="p-8 flex flex-col justify-between"
            style={{ backgroundColor: '#000000' }}
          >
            <div className="flex items-baseline gap-1">
              <span
                style={{
                  fontFamily: "'Geist', 'Inter', sans-serif",
                  fontSize: '56px',
                  letterSpacing: '-3.36px',
                  color: '#ffffff',
                  lineHeight: 1,
                  fontWeight: 500,
                }}
              >
                14.2
              </span>
              <span
                style={{
                  fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
                  fontSize: '18px',
                  color: '#999999',
                }}
              >
                M
              </span>
            </div>
            <div className="mt-4">
              <div
                style={{
                  fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
                  fontSize: '12px',
                  color: '#999999',
                }}
              >
                Verified Clock Cycles
              </div>
            </div>
          </div>

          {/* Cell 4: 0 % */}
          <div
            className="p-8 flex flex-col justify-between"
            style={{ backgroundColor: '#000000' }}
          >
            <div className="flex items-baseline gap-1">
              <span
                style={{
                  fontFamily: "'Geist', 'Inter', sans-serif",
                  fontSize: '56px',
                  letterSpacing: '-3.36px',
                  color: '#ffffff',
                  lineHeight: 1,
                  fontWeight: 500,
                }}
              >
                0
              </span>
              <span
                style={{
                  fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
                  fontSize: '18px',
                  color: '#ededed',
                }}
              >
                %
              </span>
            </div>
            <div className="mt-4">
              <div
                style={{
                  fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
                  fontSize: '12px',
                  color: '#999999',
                }}
              >
                Unreturned Hardware Loss
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* FOOTER */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <footer
        className="border-t border-[rgba(255,255,255,0.145)] py-[36px] flex flex-col sm:flex-row items-center justify-between gap-4 max-w-[1240px] mx-auto"
        style={{
          paddingLeft: '56px',
          paddingRight: '56px',
          fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
          fontSize: '12px',
          color: '#999999',
        }}
      >
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
