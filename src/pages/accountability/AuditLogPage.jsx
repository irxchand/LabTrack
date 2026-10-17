import React, { useState, useMemo } from 'react';
import { useLabData } from '../../context/LabDataContext';
import { DataTable } from '../../components/common/DataTable';
import { SearchInput } from '../../components/common/SearchInput';
import {
  FileText,
  ShieldCheck,
  Hash,
  UserCheck,
  Sparkles,
  Download,
  Copy,
  Check,
  Calendar,
  Layers,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

export function AuditLogPage() {
  const { auditLogs } = useLabData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');
  const [copiedHash, setCopiedHash] = useState(null);

  // Copy SHA-256 Hash to Clipboard
  const handleCopyChecksum = (hash, e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 1500);
  };

  // Export Audit Ledger to CSV
  const handleExportCSV = () => {
    if (!filteredLogs.length) return;
    const headers = ['Event ID', 'Timestamp', 'Actor Name', 'Actor PRN', 'Actor Role', 'Action', 'Target ID', 'Details', 'SHA256 Checksum'];
    const rows = filteredLogs.map((log) => [
      `"${log.id}"`,
      `"${log.timestamp}"`,
      `"${log.actorName}"`,
      `"${log.actorPrn}"`,
      `"${log.actorRole}"`,
      `"${log.action}"`,
      `"${log.targetId}"`,
      `"${log.details.replace(/"/g, '""')}"`,
      `"${log.checksum}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `labtrack-audit-ledger-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics calculation
  const stats = useMemo(() => {
    const total = auditLogs.length;
    const dispatches = auditLogs.filter((l) => l.action?.includes('DISPATCH')).length;
    const returns = auditLogs.filter((l) => l.action?.includes('RETURN')).length;
    const defects = auditLogs.filter((l) => l.action?.includes('DEFECT')).length;
    return { total, dispatches, returns, defects };
  }, [auditLogs]);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (filterAction !== 'ALL' && log.action !== filterAction) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          log.id?.toLowerCase().includes(q) ||
          log.actorPrn?.toLowerCase().includes(q) ||
          log.actorName?.toLowerCase().includes(q) ||
          log.targetId?.toLowerCase().includes(q) ||
          log.details?.toLowerCase().includes(q) ||
          log.action?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [auditLogs, filterAction, searchQuery]);

  const columns = [
    {
      header: 'Event ID & Timestamp',
      accessor: 'id',
      width: '180px',
      render: (row) => (
        <div className="font-sans text-xs">
          <div className="font-semibold text-white tracking-wide">{row.id}</div>
          <div className="text-zinc-500 text-[11px] mt-0.5">{row.timestamp}</div>
        </div>
      ),
    },
    {
      header: 'Actor & Department Role',
      accessor: 'actorName',
      width: '200px',
      render: (row) => (
        <div className="font-sans text-xs">
          <div className="text-white font-medium flex items-center gap-1.5">
            <span>{row.actorName}</span>
          </div>
          <div className="text-zinc-400 text-[11px] mt-0.5">
            PRN: <span className="text-zinc-300">{row.actorPrn}</span> • {row.actorRole}
          </div>
        </div>
      ),
    },
    {
      header: 'Action Type',
      accessor: 'action',
      width: '190px',
      render: (row) => {
        let badgeColor = 'bg-white/[0.04] text-zinc-300 border-white/10';
        if (row.action.includes('DISPATCH')) badgeColor = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
        else if (row.action.includes('DEFECT')) badgeColor = 'bg-rose-500/15 text-rose-300 border-rose-500/30';
        else if (row.action.includes('RETURN')) badgeColor = 'bg-sky-500/15 text-sky-300 border-sky-500/30';
        else if (row.action.includes('APPROVED')) badgeColor = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
        else if (row.action.includes('RETIRED')) badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/30';

        return (
          <span className={`px-2.5 py-0.5 rounded-full font-sans text-[10px] uppercase font-semibold border ${badgeColor}`}>
            {row.action.replace(/_/g, ' ')}
          </span>
        );
      },
    },
    {
      header: 'Audit Target & Operational Details',
      accessor: 'details',
      render: (row) => (
        <div className="space-y-0.5 font-sans text-xs">
          <div className="text-zinc-200 leading-snug">{row.details}</div>
          <div className="text-zinc-400 text-[11px]">
            Target Entity: <span className="text-white font-medium">{row.targetId}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'SHA-256 Checksum',
      accessor: 'checksum',
      width: '180px',
      render: (row) => (
        <div className="flex items-center gap-1.5 group">
          <span className="font-sans text-[11px] text-zinc-500 truncate block max-w-[130px]" title={row.checksum}>
            {row.checksum?.slice(0, 16)}...
          </span>
          <button
            onClick={(e) => handleCopyChecksum(row.checksum, e)}
            className="p-1 rounded hover:bg-white/10 text-zinc-500 hover:text-white transition-all cursor-pointer opacity-70 group-hover:opacity-100"
            title="Copy SHA-256 hash"
          >
            {copiedHash === row.checksum ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER & VERIFICATION SEAL                             */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#c9b8a0]">
            Immutable Custody Ledger • Executive Accountability
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white mt-1 font-display">
            Institutional Audit Log
          </h1>
          <p className="text-[13px] text-zinc-400 mt-1 max-w-xl font-normal leading-relaxed">
            Cryptographically sealed timeline of all hardware checkouts, multi-point return inspections, approvals, and triage events.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Integrity Seal */}
          <span className="px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 shadow-sm flex items-center gap-2 text-xs font-sans">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-400">Ledger Status:</span>
            <span className="text-white font-semibold">VERIFIED SHA-256</span>
          </span>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="px-4 py-1.5 rounded-full bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. TELEMETRY STATS RIBBON                                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl space-y-1">
          <div className="text-[11px] font-sans uppercase tracking-wider text-zinc-400 font-semibold">
            Recorded Ledger Events
          </div>
          <div className="text-2xl font-bold text-white font-sans">{stats.total}</div>
          <div className="text-[11px] text-zinc-500">Immutable transaction count</div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/20 backdrop-blur-xl space-y-1">
          <div className="text-[11px] font-sans uppercase tracking-wider text-emerald-300 font-semibold">
            Dispatches Committed
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-sans">{stats.dispatches}</div>
          <div className="text-[11px] text-emerald-300/60">Verified counter handovers</div>
        </div>

        <div className="p-4 rounded-2xl bg-sky-500/[0.04] border border-sky-500/20 backdrop-blur-xl space-y-1">
          <div className="text-[11px] font-sans uppercase tracking-wider text-sky-300 font-semibold">
            Inspected Returns
          </div>
          <div className="text-2xl font-bold text-sky-400 font-sans">{stats.returns}</div>
          <div className="text-[11px] text-sky-300/60">Condition checklists executed</div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-500/[0.04] border border-rose-500/20 backdrop-blur-xl space-y-1">
          <div className="text-[11px] font-sans uppercase tracking-wider text-rose-300 font-semibold">
            Defect Incident Logs
          </div>
          <div className="text-2xl font-bold text-rose-400 font-sans">{stats.defects}</div>
          <div className="text-[11px] text-rose-300/60">Quarantine triage records</div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. SEARCH & SEGMENTED ACTION FILTER                           */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Segmented Action Filters */}
        <div className="inline-flex p-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl overflow-x-auto max-w-full">
          {[
            { id: 'ALL', label: 'All Transactions' },
            { id: 'EQUIPMENT_DISPATCH', label: 'Dispatches' },
            { id: 'EQUIPMENT_RETURNED', label: 'Returns' },
            { id: 'DEFECT_LOGGED', label: 'Defects' },
            { id: 'REQUISITION_APPROVED', label: 'Approvals' },
            { id: 'ASSET_RETIRED', label: 'Retirements' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterAction(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterAction === tab.id
                  ? 'bg-white text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full md:w-80">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search Actor PRN, Name, Tag, or Description..."
          />
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. DATA TABLE                                                 */}
      {/* ───────────────────────────────────────────────────────────── */}
      <DataTable
        columns={columns}
        data={filteredLogs}
        pageSize={10}
        emptyMessage="No cryptographic audit records found matching your filter criteria."
      />
    </div>
  );
}

export default AuditLogPage;
