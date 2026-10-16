import React, { useState } from 'react';
import { useLabData } from '../../context/LabDataContext';
import { useAuth } from '../../context/AuthContext';
import { ReliabilityGauge } from '../../components/specialized/ReliabilityGauge';
import { DataTable } from '../../components/common/DataTable';
import {
  ShieldCheck,
  TrendingUp,
  Clock,
  AlertOctagon,
  FileSpreadsheet,
  Sliders,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

export function ReliabilityReportPage() {
  const { reliabilityData, incidentLedger } = useLabData();
  const { currentUser, role, permissions } = useAuth();

  const [highThreshold, setHighThreshold] = useState(90);
  const [flaggedThreshold, setFlaggedThreshold] = useState(75);
  const [isEditingThresholds, setIsEditingThresholds] = useState(false);

  const score = currentUser?.reliabilityScore || reliabilityData?.score || 94;

  const incidentColumns = [
    {
      header: 'Incident ID & Date',
      accessor: 'id',
      width: '160px',
      render: (row) => (
        <div className="font-sans text-xs">
          <div className="font-semibold text-[#c9b8a0]">{row.id}</div>
          <div className="text-zinc-500 text-[11px] mt-0.5">{row.date}</div>
        </div>
      ),
    },
    {
      header: 'Hardware Asset',
      accessor: 'nomenclature',
      render: (row) => (
        <div>
          <div className="font-semibold text-white text-xs">{row.nomenclature}</div>
          <div className="font-sans text-[11px] text-zinc-400 mt-0.5">Tag: {row.assetTag}</div>
        </div>
      ),
    },
    {
      header: 'Return Rating',
      accessor: 'conditionRating',
      width: '180px',
      render: (row) => (
        <span
          className={`font-sans text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
            row.onTime
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}
        >
          {row.conditionRating}
        </span>
      ),
    },
    {
      header: 'Technician Inspection Notes',
      accessor: 'technicianNotes',
      render: (row) => (
        <div className="font-sans text-xs text-zinc-300">
          <div>{row.technicianNotes}</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">Verified by: {row.technicianPrn}</div>
        </div>
      ),
    },
    {
      header: 'Impact',
      accessor: 'pointsImpact',
      width: '150px',
      render: (row) => (
        <span
          className={`font-sans text-xs font-semibold ${
            row.pointsImpact?.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'
          }`}
        >
          {row.pointsImpact}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-neural text-[10px] font-inter uppercase tracking-[0.2em] text-[#c9b8a0] mb-2">
            <Sparkles className="w-3 h-3 text-[#a78b71]" />
            <span>ACCOUNTABILITY INTELLIGENCE</span>
          </div>
          <h1 className="text-2xl font-playfair font-normal italic text-white flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-[#a78b71]" />
            Accountability & Reliability Desk
          </h1>
          <p className="text-xs font-inter text-zinc-400 mt-1 max-w-2xl">
            Algorithmic compliance scoring tracking hardware return punctuality, condition integrity, and FIFO priority tiers.
          </p>
        </div>

        {permissions.canAdjustThresholds && (
          <button
            onClick={() => setIsEditingThresholds(!isEditingThresholds)}
            className="px-4 py-2 rounded-full glass-neural hover:border-[#a78b71]/50 text-xs font-inter text-[#c9b8a0] hover:text-white transition-neural flex items-center gap-2 self-start sm:self-auto"
          >
            <Sliders className="w-3.5 h-3.5 text-[#a78b71]" />
            {isEditingThresholds ? 'Close Policy Config' : 'Adjust Policy Thresholds'}
          </button>
        )}
      </div>

      {/* Admin Threshold Policy Editor */}
      {isEditingThresholds && permissions.canAdjustThresholds && (
        <div className="glass-neural p-5 rounded-2xl border border-[#a78b71]/30 space-y-4 font-inter text-xs">
          <div className="flex items-center gap-2 font-bold text-[#c9b8a0] uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-[#a78b71]" />
            Department Compliance Threshold Configuration (Auditor Mode)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-zinc-400 text-[11px] mb-2">
                High Compliance Tier Cutoff (Current: {highThreshold}+)
              </label>
              <input
                type="range"
                min="80"
                max="98"
                value={highThreshold}
                onChange={(e) => setHighThreshold(Number(e.target.value))}
                className="w-full accent-[#a78b71]"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-[11px] mb-2">
                Flagged / Restriction Cutoff (Current: &lt;{flaggedThreshold})
              </label>
              <input
                type="range"
                min="60"
                max="85"
                value={flaggedThreshold}
                onChange={(e) => setFlaggedThreshold(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>
          </div>
          <p className="text-[11px] text-zinc-500">
            Changes immediately take effect across all course sections and auto-restrict student counter dispatches.
          </p>
        </div>
      )}

      {/* Primary Visual Element: Gauge and Key Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gauge (5 cols) */}
        <div className="lg:col-span-5">
          <ReliabilityGauge score={score} interactive={true} />
        </div>

        {/* Supporting Metric Cards (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-neural p-5 rounded-2xl flex flex-col justify-between border border-white/10 hover:border-[#a78b71]/30 transition-neural">
            <div className="flex items-center justify-between text-zinc-400 font-inter text-xs">
              <span className="uppercase tracking-wider text-[11px]">Term Allocation History</span>
              <TrendingUp className="w-4 h-4 text-[#a78b71]" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-playfair font-bold italic text-white">14 Items</div>
              <p className="text-xs text-zinc-400 font-inter mt-1">
                Issued across 3 coursework cycles
              </p>
            </div>
          </div>

          <div className="glass-neural p-5 rounded-2xl flex flex-col justify-between border border-white/10 hover:border-[#a78b71]/30 transition-neural">
            <div className="flex items-center justify-between text-zinc-400 font-inter text-xs">
              <span className="uppercase tracking-wider text-[11px]">On-Time Return Rate</span>
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-display font-bold text-emerald-400">92.8%</div>
              <p className="text-xs text-zinc-400 font-inter mt-1">
                13 on-time returns • 1 grace return
              </p>
            </div>
          </div>

          <div className="glass-neural p-5 rounded-2xl flex flex-col justify-between border border-white/10 hover:border-[#a78b71]/30 transition-neural">
            <div className="flex items-center justify-between text-zinc-400 font-inter text-xs">
              <span className="uppercase tracking-wider text-[11px]">Damage / Defect Incidents</span>
              <AlertOctagon className="w-4 h-4 text-zinc-500" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-playfair font-bold italic text-white">0</div>
              <p className="text-xs text-zinc-400 font-inter mt-1">
                Zero technician-verified equipment defects
              </p>
            </div>
          </div>

          <div className="glass-neural p-5 rounded-2xl flex flex-col justify-between border border-white/10 hover:border-[#a78b71]/30 transition-neural">
            <div className="flex items-center justify-between text-zinc-400 font-inter text-xs">
              <span className="uppercase tracking-wider text-[11px]">Active Custody Budget</span>
              <CheckCircle className="w-4 h-4 text-[#a78b71]" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-display font-bold text-white">2 / 5 Items</div>
              <p className="text-xs text-zinc-400 font-inter mt-1">
                3 available custody allocations remaining
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Incident Ledger Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#a78b71]" />
            Chronological Incident & Return Ledger
          </h2>
          <span className="text-xs font-sans text-zinc-400">
            Immutable Audit Records: {incidentLedger.length}
          </span>
        </div>

        <DataTable
          columns={incidentColumns}
          data={incidentLedger}
          pageSize={6}
          emptyMessage="No historical returns or incidents logged for this student record."
        />
      </div>
    </div>
  );
}

export default ReliabilityReportPage;
