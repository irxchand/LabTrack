import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SiliconCanvas } from '../components/hero/SiliconCanvas';
import { HeroFeatureGrid } from '../components/hero/HeroFeatureGrid';
import { HeroLifecycleDemo } from '../components/hero/HeroLifecycleDemo';
import {
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  ChevronRight,
  Terminal,
  Activity,
  Zap,
  Radio,
  CheckCircle2,
  Box,
} from 'lucide-react';

export function HeroPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('3d-core');

  const handleLaunchWorkspace = () => {
    if (isAuthenticated) {
      navigate('/workspace');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-white selection:bg-[#c9b8a0]/30 selection:text-white font-sans overflow-x-hidden relative">
      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 1. Ambient Velvet Lighting Orbs */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#c9b8a0]/15 via-[#a78b71]/5 to-transparent blur-[150px] pointer-events-none -z-10" />
      <div className="absolute top-[750px] right-0 w-[550px] h-[550px] bg-gradient-to-bl from-[#c9b8a0]/10 via-transparent to-transparent blur-[160px] pointer-events-none -z-10" />

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 2. Top Navigation Bar */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 h-16 bg-[#07080a]/80 backdrop-blur-2xl border-b border-white/10 z-50 px-4 sm:px-8 flex items-center justify-between">
        <div
          className="flex items-center space-x-2 cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="LabTrack Flagship Overview"
        >
          <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f5e6c8] to-[#c9b8a0] leading-none">
            LabTrack
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#c9b8a0] shadow-[0_0_10px_#c9b8a0]" />
        </div>

        {/* Center Links (Anchor Jumps) */}
        <nav className="hidden md:flex items-center gap-6 text-xs text-zinc-400">
          <a
            href="#stage-3d"
            className="hover:text-white transition-colors duration-200"
          >
            3D Architecture
          </a>
          <a
            href="#hardware"
            className="hover:text-white transition-colors duration-200"
          >
            Hardware Catalog
          </a>
          <a
            href="#lifecycle"
            className="hover:text-white transition-colors duration-200"
          >
            Custody Lifecycle
          </a>
          <a
            href="#specs"
            className="hover:text-white transition-colors duration-200"
          >
            Security & Ledger
          </a>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLaunchWorkspace}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-[#f5e6c8] via-[#e2d0b5] to-[#c9b8a0] text-black shadow-[0_2px_15px_rgba(201,184,160,0.35)] hover:shadow-[0_4px_25px_rgba(201,184,160,0.5)] hover:scale-[1.02] transition-all cursor-pointer"
          >
            <span>{isAuthenticated ? 'Open Workspace' : 'Sign In to Lab'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 3. Hero Section with 3D Silicon Stage */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <main className="pt-24 sm:pt-32 pb-16">
        <section id="stage-3d" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Editorial Headline & Actions */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs text-[#c9b8a0] mb-5 w-fit shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9b8a0] shadow-[0_0_8px_#c9b8a0]" />
                <span className="font-semibold tracking-[0.16em] uppercase text-[10px]">
                  AIML RESEARCH DEPOT // 2026 ARCHITECTURE
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-[#c9b8a0] leading-[1.06]">
                Silicon-Grade Custody for AI Laboratories.
              </h1>

              <p className="mt-5 text-base text-zinc-400 font-sans leading-relaxed max-w-xl">
                Eliminate untracked hardware leakage. Dual-signature faculty endorsements, automated FIFO reservation queues, and cryptographic chain-of-custody—from depot dispatch to active workbench.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 mt-8">
                <button
                  type="button"
                  onClick={handleLaunchWorkspace}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-white via-[#f5e6c8] to-[#c9b8a0] text-black font-bold text-sm transition-all hover:scale-[1.03] shadow-[0_4px_30px_rgba(201,184,160,0.4)] cursor-pointer group"
                >
                  <span>Launch Lab Workspace</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="#hardware"
                  className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 text-sm font-medium transition-all"
                >
                  <span>Inspect Hardware</span>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </a>
              </div>

              {/* Real-time Status Telemetry */}
              <div className="grid grid-cols-3 gap-4 mt-10 pt-6 border-t border-white/10 max-w-lg">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-xl sm:text-2xl font-bold text-[#f5e6c8]">10</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Active AI Rigs</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white">0%</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Hardware Loss</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-[#c9b8a0]">FIFO</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Queue Protocol</div>
                </div>
              </div>
            </div>

            {/* Right Column: Next-Gen Exploded 3D Silicon Stage */}
            <div className="lg:col-span-6 w-full flex items-center justify-center relative">
              <div className="w-full h-[520px] sm:h-[580px] lg:h-[620px]">
                <SiliconCanvas />
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 4. Flagship Hardware Component Grid */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div id="hardware">
          <HeroFeatureGrid />
        </div>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 5. Interactive Hardware Lifecycle Sandbox */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div id="lifecycle">
          <HeroLifecycleDemo />
        </div>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 6. Security & Cryptographic Ledger Specs */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <section id="specs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="rounded-3xl bg-gradient-to-b from-[#0c0d12] to-[#07080a] border border-white/10 p-8 sm:p-12 relative overflow-hidden">
            <div className="max-w-2xl">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c9b8a0]">
                ZERO-TRUST INFRASTRUCTURE
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3 tracking-tight">
                Academic Integrity Built Directly into Hardware.
              </h2>
              <p className="text-sm text-zinc-400 mt-3 font-sans leading-relaxed">
                Every requisition is anchored to an approved academic project group and endorsed by an authenticated faculty guide. Digital audit trails ensure laboratory equipment remains calibrated, accountable, and safeguarded.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                <ShieldCheck className="w-5 h-5 text-[#c9b8a0] mb-3" />
                <h4 className="text-sm font-bold text-white">Dual-Signature Custody</h4>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Both student custody holder and dispatch counter staff sign off at issue and return checkpoints.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                <Terminal className="w-5 h-5 text-[#c9b8a0] mb-3" />
                <h4 className="text-sm font-bold text-white">Tamper-Proof Audit Trail</h4>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Every status mutation, fault report, and extension request is logged with immutable timestamps.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                <Activity className="w-5 h-5 text-[#c9b8a0] mb-3" />
                <h4 className="text-sm font-bold text-white">Automated RMA Bench</h4>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Defective sensors or damaged pins trigger immediate quarantine workflows for lab assistants.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 7. Bottom Call to Action */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <section className="text-center max-w-4xl mx-auto px-4 py-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Ready to Build at the Edge?
          </h2>
          <p className="mt-3 text-sm text-zinc-400 font-sans">
            Log in with your university credentials or launch the hardware depot overview.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleLaunchWorkspace}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-all shadow-[0_4px_30px_rgba(255,255,255,0.2)] cursor-pointer"
            >
              <span>{isAuthenticated ? 'Go to Active Workspace' : 'Access LabTrack'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 8. Minimalist Cupertino Footer */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 py-8 px-4 sm:px-8 text-xs text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-zinc-300">LabTrack</span>
          <span>•</span>
          <span>AIML Hardware Depot & Custody System</span>
        </div>
        <div>
          <span>Department of Artificial Intelligence & Data Science</span>
        </div>
      </footer>
    </div>
  );
}

export default HeroPage;
