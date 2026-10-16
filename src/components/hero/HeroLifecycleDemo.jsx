import React, { useState } from 'react';
import {
  FolderGit2,
  Cpu,
  Inbox,
  BookmarkCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  Calendar,
} from 'lucide-react';

const STAGES = [
  {
    step: 1,
    id: 'projects',
    title: 'Projects',
    icon: FolderGit2,
    badge: 'Step 1: Academic Scope',
    headline: 'Define Project Group & Allocation',
    summary:
      'Form team rosters, attach your faculty guide (Dr. Anjali Dalvi), and unlock the authorized Bill of Materials for your research domain.',
    actionLabel: 'Assign Project PRJ-AIML-08',
    telemetry: {
      team: 'Group PRJ-AIML-08 (4 Members)',
      mentor: 'Dr. Anjali Dalvi (Guide)',
      status: 'Approved Allocation Scope',
    },
  },
  {
    step: 2,
    id: 'workstation',
    title: 'Workstation',
    icon: Cpu,
    badge: 'Step 2: Component Depot',
    headline: 'Explore & Stage Hardware Kit',
    summary:
      'Browse real-time calibrated stock across AI, IoT, and Robotics labs. Add components directly into your active Requisition Kit.',
    actionLabel: 'Stage Jetson Orin to Basket',
    telemetry: {
      sku: 'HW-JETSON-ORIN-01',
      stock: 'Available in Bay 402',
      inspection: 'Pre-flight Calibrated',
    },
  },
  {
    step: 3,
    id: 'requisitions',
    title: 'Requisitions',
    icon: Inbox,
    badge: 'Step 3: Faculty Verification',
    headline: 'Dual-Key Faculty Endorsement',
    summary:
      'Requisitions require faculty guide digital review before being staged at the counter. Eliminates untracked hardware leakage.',
    actionLabel: 'Endorse Requisition REQ-8821',
    telemetry: {
      orderId: 'REQ-8821',
      mentorReview: 'Endorsed by Guide',
      counterDesk: 'Ready for Counter Pickup',
    },
  },
  {
    step: 4,
    id: 'waitlist',
    title: 'Waitlist',
    icon: BookmarkCheck,
    badge: 'Step 4: Fair Allocation',
    headline: 'Automated FIFO Reservation Queue',
    summary:
      'If high-demand computing rigs are deployed, students join an automated FIFO line. No favoritism, zero line jumping.',
    actionLabel: 'Position #1 in Line',
    telemetry: {
      queuePosition: '#1 in FIFO Line',
      autoDispatch: 'Triggers on Next Return',
      holdWindow: '24h Reservation Lock',
    },
  },
  {
    step: 5,
    id: 'my-bench',
    title: 'My Bench',
    icon: Clock,
    badge: 'Step 5: Active Custody',
    headline: 'Tactile Custody & Defect Bench',
    summary:
      'Collected hardware is in active student custody. Track return countdowns, request 7-day extensions, or file immediate defect reports.',
    actionLabel: 'Active on Student Workbench',
    telemetry: {
      custodyHolder: 'Rahul Sharma (202401048)',
      countdown: '6 Days Remaining',
      benchStatus: 'Active Testing Nominal',
    },
  },
];

export function HeroLifecycleDemo() {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const activeStage = STAGES[activeStageIndex];

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs text-[#c9b8a0] mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CHAIN OF CUSTODY LIFECYCLE</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
          The Verified Student Flow, Interactive.
        </h2>
        <p className="mt-3 text-sm text-zinc-400 font-sans">
          Click any phase below to experience how physical computing moves from syllabus approval to hands-on experimentation.
        </p>
      </div>

      {/* Stage Selector Segmented Control */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
        {STAGES.map((s, idx) => {
          const isCurrent = idx === activeStageIndex;
          const isPassed = idx < activeStageIndex;
          return (
            <button
              key={s.id}
              onClick={() => setActiveStageIndex(idx)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                isCurrent
                  ? 'bg-gradient-to-b from-white to-zinc-200 text-black font-semibold shadow-[0_2px_15px_rgba(255,255,255,0.25)]'
                  : 'bg-white/[0.03] hover:bg-white/[0.07] text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              <s.icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-black' : isPassed ? 'text-[#c9b8a0]' : 'text-zinc-500'}`} />
              <span>{s.title}</span>
              {isPassed && <CheckCircle2 className="w-3 h-3 text-[#c9b8a0]" />}
            </button>
          );
        })}
      </div>

      {/* Interactive Stage Visualizer Box */}
      <div className="relative rounded-3xl bg-[#0b0c10]/90 border border-white/10 backdrop-blur-2xl p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.7)] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#c9b8a0]/10 via-transparent to-transparent pointer-events-none rounded-full blur-3xl" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Narrative & Description */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c9b8a0] bg-[#c9b8a0]/10 px-2.5 py-1 rounded-full border border-[#c9b8a0]/20">
                {activeStage.badge}
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mt-4 tracking-tight">
                {activeStage.headline}
              </h3>
              <p className="mt-3 text-sm text-zinc-400 font-sans leading-relaxed">
                {activeStage.summary}
              </p>
            </div>

            {/* Quick Progression Controls */}
            <div className="flex items-center gap-3 mt-8">
              {activeStageIndex < STAGES.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveStageIndex((prev) => prev + 1)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#f5e6c8] to-[#c9b8a0] text-black font-semibold text-xs transition-all hover:scale-[1.02] shadow-[0_2px_15px_rgba(201,184,160,0.3)] cursor-pointer"
                >
                  <span>Advance to {STAGES[activeStageIndex + 1].title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveStageIndex(0)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-white font-medium text-xs hover:bg-white/15 transition-all cursor-pointer"
                >
                  <span>Restart Lifecycle Loop</span>
                </button>
              )}
            </div>
          </div>

          {/* Right: Live Simulated Telemetry Card */}
          <div className="lg:col-span-5 rounded-2xl bg-black/40 border border-white/10 p-5 sm:p-6 shadow-inner">
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                Live State Ledger
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Verified
              </span>
            </div>

            <div className="space-y-3 font-sans">
              {Object.entries(activeStage.telemetry).map(([key, val]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs"
                >
                  <span className="text-zinc-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-semibold text-zinc-100">{val}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
              <span>Department Verification Protocol</span>
              <span className="text-[#c9b8a0]">SHA-256 Ledger</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroLifecycleDemo;
