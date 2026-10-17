import React from 'react';
import { X, ShieldCheck, Award, AlertCircle, Clock, CheckCircle2, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function QuickReliabilityModal({ isOpen, onClose }) {
  const { user } = useAuth();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#0c0e14] border border-white/10 rounded-xl shadow-2xl p-6 z-10 font-mono-tech text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight uppercase">
                Student Reliability & Compliance Dossier
              </h2>
              <p className="text-xs text-zinc-400">
                Institutional Conduct Scorecard & Audit Standing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scorecard Hero */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-white/10">
          <div className="flex items-center space-x-5">
            {/* Circular Rating Gauge */}
            <div className="relative w-24 h-24 flex items-center justify-center rounded-full border-4 border-emerald-500/30 bg-emerald-500/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">96.4</div>
                <div className="text-[10px] text-zinc-400">/ 100</div>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold text-white">{user?.name || 'Aarav Patel'}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] uppercase font-semibold">
                  Exemplary Tier
                </span>
              </div>
              <div className="text-xs text-zinc-400 mt-1">
                PRN: {user?.prn || '2024881'} • Project: Team Hyperion (AERO-24)
              </div>
              <div className="text-xs text-emerald-400 mt-1 flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>Eligibility: Priority hardware booking & expanded equipment access privileges.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Metric Breakdown Cards */}
        <div className="grid grid-cols-3 gap-3 py-4 border-b border-white/10">
          <div className="p-3 rounded bg-zinc-900/60 border border-white/5">
            <div className="text-[10px] text-zinc-500 uppercase">On-Time Return Rate</div>
            <div className="text-lg font-bold text-white mt-1">98.2%</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">24 of 25 Returns on-time</div>
          </div>
          <div className="p-3 rounded bg-zinc-900/60 border border-white/5">
            <div className="text-[10px] text-zinc-500 uppercase">Hardware Care Index</div>
            <div className="text-lg font-bold text-white mt-1">95.0%</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">0 Defect Quarantines</div>
          </div>
          <div className="p-3 rounded bg-zinc-900/60 border border-white/5">
            <div className="text-[10px] text-zinc-500 uppercase">Audit Strike Penalty</div>
            <div className="text-lg font-bold text-zinc-400 mt-1">0 Pts</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Zero Infractions</div>
          </div>
        </div>

        {/* Historical Event Log */}
        <div className="py-4 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Recent Audit Event Stream
          </div>
          <div className="space-y-1.5 text-xs text-zinc-300">
            <div className="p-2 rounded bg-white/5 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Returned Jetson Orin Nano (SBC-8821) in pristine condition</span>
              </span>
              <span className="text-[10px] text-zinc-500">2026-03-14</span>
            </div>
            <div className="p-2 rounded bg-white/5 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>Requisition approved by Dr. Robert Chen for RIG-8840-FPGA</span>
              </span>
              <span className="text-[10px] text-zinc-500">2026-03-10</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-zinc-800 text-zinc-300 hover:text-white transition text-xs font-semibold"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}
