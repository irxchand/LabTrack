import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  CheckCircle2,
  Sparkles,
  Award,
  CheckSquare,
  FolderGit2,
} from 'lucide-react';

export function ReliabilityReportPage() {
  const { reliabilityData, incidentLedger } = useLabData();
  const { currentUser, permissions } = useAuth();

  const [highThreshold, setHighThreshold] = useState(90);
  const [flaggedThreshold, setFlaggedThreshold] = useState(75);
  const [isEditingThresholds, setIsEditingThresholds] = useState(false);

  // Faculty exemption guard: Faculty have no demerit score
  if (currentUser?.role === 'Faculty') {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 font-sans">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#141417]/95 via-[#0e0e11]/95 to-[#08080a]/95 border border-white/10 p-8 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white mb-6 shadow-inner">
            <Award className="w-8 h-8 text-white" />
          </div>

          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs font-medium text-zinc-300">
              <span>Academic Governance Exemption</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Faculty Standing & Mentor Governance
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Institutional demerit scoring and strike ratings apply exclusively to undergraduate student hardware loans. As an appointed faculty member (<span className="text-white font-medium">{currentUser.name}</span>, {currentUser.department}), your laboratory oversight operates under academic mentorship standards.
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 flex flex-wrap items-center gap-4">
            <Link
              to="/workspace/operations/approvals"
              className="px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs transition-transform active:scale-95 shadow-[0_2px_12px_rgba(255,255,255,0.25)] flex items-center gap-2 cursor-pointer"
            >
              <CheckSquare className="w-4 h-4 text-black" />
              <span>Go to Approvals Queue</span>
            </Link>
            <Link
              to="/workspace/projects"
              className="px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-white font-medium text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FolderGit2 className="w-4 h-4 text-zinc-300" />
              <span>Review Mentored Projects</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const score = currentUser?.reliabilityScore || reliabilityData?.score || 94;

  const formatHumanDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        return d.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const incidentColumns = [
    {
      header: 'Incident ID & Date',
      accessor: 'id',
      width: '160px',
      render: (row) => (
        <div className="font-sans text-xs">
          <div className="font-semibold text-white">{row.id}</div>
          <div className="text-zinc-400 text-[11px] mt-0.5">{formatHumanDate(row.date)}</div>
        </div>
      ),
    },
    {
      header: 'Hardware Asset',
      accessor: 'nomenclature',
      render: (row) => (
        <div className="font-sans">
          <div className="font-medium text-white text-xs">{row.nomenclature}</div>
          <div className="text-[11px] text-[#c9b8a0] mt-0.5 font-medium">{row.assetTag}</div>
        </div>
      ),
    },
    {
      header: 'Return Rating',
      accessor: 'conditionRating',
      width: '210px',
      render: (row) => {
        const raw = row.conditionRating || row.returnCondition || (row.onTime ? 'Clean Return' : 'Late Return');

        let title = raw;
        let tag = null;
        const match = raw.match(/^(.*?)\s*\((.*?)\)$/);
        if (match) {
          title = match[1].trim();
          tag = match[2].trim();
          if (tag.toLowerCase().includes('day grace')) {
            tag = tag.replace(/day grace/i, '1d Grace').replace(/^1\s*1d/i, '1d');
          }
        }

        const isLate = !row.onTime || raw.toLowerCase().includes('late');
        const isDefect = raw.toLowerCase().includes('defect') || raw.toLowerCase().includes('damage');

        if (isDefect) {
          return (
            <div className="inline-flex items-center gap-2 whitespace-nowrap px-2.5 py-1 rounded-md bg-rose-500/[0.06] border border-rose-500/20 text-xs font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.6)] shrink-0" />
              <span className="font-medium text-rose-200">{title}</span>
              {tag && (
                <span className="text-[10px] font-semibold tracking-tight text-rose-300 bg-rose-500/15 border border-rose-500/25 px-1.5 py-0.5 rounded">
                  {tag}
                </span>
              )}
            </div>
          );
        }

        if (isLate) {
          return (
            <div className="inline-flex items-center gap-2 whitespace-nowrap px-2.5 py-1 rounded-md bg-amber-500/[0.06] border border-amber-500/20 text-xs font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)] shrink-0" />
              <span className="font-medium text-amber-200">{title}</span>
              {tag && (
                <span className="text-[10px] font-semibold tracking-tight text-amber-300 bg-amber-500/15 border border-amber-500/25 px-1.5 py-0.5 rounded">
                  {tag}
                </span>
              )}
            </div>
          );
        }

        return (
          <div className="inline-flex items-center gap-2 whitespace-nowrap px-2.5 py-1 rounded-md bg-emerald-500/[0.06] border border-emerald-500/20 text-xs font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="font-medium text-emerald-200">{title}</span>
            {tag && (
              <span className="text-[10px] font-semibold tracking-tight text-emerald-300 bg-emerald-500/15 border border-emerald-500/25 px-1.5 py-0.5 rounded">
                {tag}
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: 'Technician Inspection Notes',
      accessor: 'technicianNotes',
      render: (row) => (
        <div className="font-sans text-xs text-zinc-300 leading-relaxed max-w-sm">
          <div className="text-zinc-200">{row.technicianNotes || row.returnCondition || 'Inspection completed; asset integrity verified.'}</div>
          <div className="text-[11px] text-zinc-500 mt-0.5">Verified by {row.technicianPrn || row.technicianSignOff || 'Depot Staff'}</div>
        </div>
      ),
    },
    {
      header: 'Score Impact',
      accessor: 'pointsImpact',
      width: '160px',
      render: (row) => {
        const impact = row.pointsImpact || '+0 Pts';
        const isPositive = impact.startsWith('+') && !impact.startsWith('+0');
        const isNegative = impact.startsWith('-');

        let sublabel = 'Standard Clearance';
        if (isPositive) sublabel = 'Punctual Incentive';
        else if (isNegative) sublabel = 'Policy Deduction';

        if (impact.includes('(')) {
          sublabel = impact.slice(impact.indexOf('(') + 1, -1);
        }

        return (
          <div className="font-sans text-xs">
            <div
              className={`font-semibold tracking-tight ${
                isPositive
                  ? 'text-emerald-400'
                  : isNegative
                  ? 'text-rose-400'
                  : 'text-zinc-400'
              }`}
            >
              {impact.split(' ')[0]} Pts
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">
              {sublabel}
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="text-[11px] font-sans font-semibold text-[#c9b8a0] tracking-wider uppercase flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9b8a0]" />
            COLLEGIATE ACCOUNTABILITY • REPUTATION SCORE
          </div>
          <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-[#c9b8a0]" />
            Reputation & Reliability Score
          </h1>
          <p className="text-sm font-sans text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Algorithmic compliance scoring tracking hardware return punctuality, condition integrity, and borrowing priority tiers.
          </p>
        </div>

        {permissions.canAdjustThresholds && (
          <button
            onClick={() => setIsEditingThresholds(!isEditingThresholds)}
            className="px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-sans text-[#c9b8a0] hover:text-white transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer flex-shrink-0"
          >
            <Sliders className="w-3.5 h-3.5 text-[#c9b8a0]" />
            <span>{isEditingThresholds ? 'Close Policy Config' : 'Adjust Policy Thresholds'}</span>
          </button>
        )}
      </div>

      {/* Admin Threshold Policy Editor */}
      {isEditingThresholds && permissions.canAdjustThresholds && (
        <div className="p-6 bg-gradient-to-b from-[#141417]/95 to-[#0c0c0e]/95 border border-[#c9b8a0]/30 rounded-3xl space-y-4 font-sans text-xs backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-2 font-bold text-[#c9b8a0] uppercase tracking-wider text-xs">
            <Sliders className="w-4 h-4 text-[#c9b8a0]" />
            Department Compliance Threshold Configuration (Auditor Mode)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
            <div>
              <label className="block text-zinc-400 text-xs mb-2">
                High Compliance Tier Cutoff (Current: {highThreshold}+)
              </label>
              <input
                type="range"
                min="80"
                max="98"
                value={highThreshold}
                onChange={(e) => setHighThreshold(Number(e.target.value))}
                className="w-full accent-[#c9b8a0] cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs mb-2">
                Flagged / Restriction Cutoff (Current: &lt;{flaggedThreshold})
              </label>
              <input
                type="range"
                min="60"
                max="85"
                value={flaggedThreshold}
                onChange={(e) => setFlaggedThreshold(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>
          </div>
          <p className="text-[11px] text-zinc-500 pt-1 border-t border-white/5">
            Changes immediately take effect across all course sections and auto-restrict student counter dispatches.
          </p>
        </div>
      )}

      {/* Primary Visual Element: Gauge and Key Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gauge (5 cols) */}
        <div className="lg:col-span-5 p-6 bg-gradient-to-b from-[#141417]/95 to-[#0c0c0e]/95 border border-white/10 rounded-3xl backdrop-blur-xl shadow-lg flex flex-col items-center justify-center">
          <ReliabilityGauge score={score} interactive={false} />
        </div>

        {/* Supporting Metric Cards (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-b from-[#141417]/95 to-[#0c0c0e]/95 border border-white/10 hover:border-white/20 rounded-3xl backdrop-blur-xl shadow-lg flex flex-col justify-between transition-all">
            <div className="flex items-center justify-between text-zinc-400 font-sans text-xs">
              <span className="uppercase tracking-wider text-[11px] font-semibold text-zinc-400">Term Allocation History</span>
              <TrendingUp className="w-4 h-4 text-[#c9b8a0]" />
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold font-sans text-white tracking-tight">14</span>
                <span className="text-sm font-medium font-sans text-zinc-400">Units</span>
              </div>
              <p className="text-xs text-zinc-400 font-sans mt-1">
                Issued across 3 coursework cycles
              </p>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-b from-[#141417]/95 to-[#0c0c0e]/95 border border-white/10 hover:border-white/20 rounded-3xl backdrop-blur-xl shadow-lg flex flex-col justify-between transition-all">
            <div className="flex items-center justify-between text-zinc-400 font-sans text-xs">
              <span className="uppercase tracking-wider text-[11px] font-semibold text-zinc-400">On-Time Return Rate</span>
              <Clock className="w-4 h-4 text-[#c9b8a0]" />
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl font-bold font-sans text-white tracking-tight">92.8%</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-sans font-medium bg-emerald-500/[0.08] text-emerald-300 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  On-Time
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-sans mt-1">
                13 on-time returns • 1 grace return
              </p>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-b from-[#141417]/95 to-[#0c0c0e]/95 border border-white/10 hover:border-white/20 rounded-3xl backdrop-blur-xl shadow-lg flex flex-col justify-between transition-all">
            <div className="flex items-center justify-between text-zinc-400 font-sans text-xs">
              <span className="uppercase tracking-wider text-[11px] font-semibold text-zinc-400">Defect Incidents</span>
              <AlertOctagon className="w-4 h-4 text-zinc-500" />
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold font-sans text-white tracking-tight">0</span>
                <span className="text-sm font-medium font-sans text-zinc-400">Incidents</span>
              </div>
              <p className="text-xs text-zinc-400 font-sans mt-1">
                Zero technician-verified equipment defects
              </p>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-b from-[#141417]/95 to-[#0c0c0e]/95 border border-white/10 hover:border-white/20 rounded-3xl backdrop-blur-xl shadow-lg flex flex-col justify-between transition-all">
            <div className="flex items-center justify-between text-zinc-400 font-sans text-xs">
              <span className="uppercase tracking-wider text-[11px] font-semibold text-zinc-400">Active Custody Budget</span>
              <CheckCircle2 className="w-4 h-4 text-[#c9b8a0]" />
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold font-sans text-[#f5e6c8] tracking-tight">2</span>
                <span className="text-sm font-medium font-sans text-zinc-400">of 5 Units</span>
              </div>
              <p className="text-xs text-zinc-400 font-sans mt-1">
                3 available custody allocations remaining
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Incident Ledger Table */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold tracking-tight text-white flex items-center gap-2 font-sans">
            <FileSpreadsheet className="w-4 h-4 text-[#c9b8a0]" />
            <span>Chronological Incident & Return Ledger</span>
          </h2>
          <span className="text-xs font-sans text-zinc-400">
            Immutable Audit Records: <span className="text-white font-medium">{incidentLedger.length}</span>
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
