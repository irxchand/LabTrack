import React, { useState, useMemo } from 'react';
import { useLabData } from '../../context/LabDataContext';
import { DataTable } from '../../components/common/DataTable';
import { SearchInput } from '../../components/common/SearchInput';
import { Download, Copy, Check } from 'lucide-react';

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

  // Metrics calculation for segmented filter tabs
  const stats = useMemo(() => {
    const total = auditLogs.length;
    const dispatches = auditLogs.filter((l) => l.action?.includes('DISPATCH')).length;
    const returns = auditLogs.filter((l) => l.action?.includes('RETURN')).length;
    const defects = auditLogs.filter((l) => l.action?.includes('DEFECT')).length;
    const approvals = auditLogs.filter((l) => l.action?.includes('APPROVED')).length;
    const retirements = auditLogs.filter((l) => l.action?.includes('RETIRED')).length;
    return { total, dispatches, returns, defects, approvals, retirements };
  }, [auditLogs]);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (filterAction !== 'ALL' && !log.action?.includes(filterAction)) {
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

  const columns = [
    {
      header: 'Event ID & Timestamp',
      accessor: 'id',
      width: '180px',
      render: (row) => (
        <div className="font-sans text-xs">
          <div className="font-semibold text-[#c9b8a0] tracking-wide">{row.id}</div>
          <div className="text-zinc-400 text-[11px] mt-0.5">{row.timestamp}</div>
        </div>
      ),
    },
    {
      header: 'Actor & Role',
      accessor: 'actorName',
      width: '200px',
      render: (row) => (
        <div className="font-sans text-xs">
          <div className="text-white font-medium">{row.actorName}</div>
          <div className="text-zinc-400 text-[11px] mt-0.5">
            PRN: <span className="text-zinc-300">{row.actorPrn}</span> • <span className="text-zinc-400">{row.actorRole}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Action Type',
      accessor: 'action',
      width: '190px',
      render: (row) => {
        const isDispatch = row.action?.includes('DISPATCH');
        const isReturn = row.action?.includes('RETURN');
        const isDefect = row.action?.includes('DEFECT');
        const isApprove = row.action?.includes('APPROVED');
        const isRetired = row.action?.includes('RETIRED');

        const dotColor = isDispatch
          ? 'bg-emerald-400'
          : isReturn
          ? 'bg-sky-400'
          : isDefect
          ? 'bg-rose-400'
          : isApprove
          ? 'bg-amber-400'
          : isRetired
          ? 'bg-rose-400'
          : 'bg-zinc-400';

        const actionLabel = row.action
          ? row.action
              .toLowerCase()
              .split('_')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')
          : 'Event';

        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-sans text-[11px] font-medium border border-white/10 bg-white/[0.04] text-zinc-300">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor}`} />
            <span>{actionLabel}</span>
          </span>
        );
      },
    },
    {
      header: 'Audit Target & Operational Details',
      accessor: 'details',
      render: (row) => (
        <div className="space-y-1 font-sans text-xs">
          <div className="text-zinc-200 leading-relaxed">{row.details}</div>
          <div className="text-zinc-400 text-[11px] flex items-center gap-1.5">
            <span className="text-zinc-500">Target:</span>
            <span className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/10 text-zinc-300 font-medium">
              {row.targetId}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'SHA-256 Checksum',
      accessor: 'checksum',
      width: '180px',
      render: (row) => (
        <div className="flex items-center gap-2 group">
          <span
            className="font-sans text-[11px] text-zinc-400 truncate block max-w-[120px] bg-black/40 px-2.5 py-1 rounded-md border border-white/10"
            title={row.checksum}
          >
            {row.checksum?.slice(0, 16)}...
          </span>
          <button
            onClick={(e) => handleCopyChecksum(row.checksum, e)}
            className="p-1.5 rounded-full bg-white/[0.04] hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 transition-all cursor-pointer"
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
            Immutable Custody Ledger • Operations
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white mt-1 font-display">
            Institutional Audit Log
          </h1>
          <p className="text-[13px] text-zinc-400 mt-1 max-w-xl font-normal leading-relaxed">
            Cryptographically sealed timeline of all hardware checkouts, multi-point return inspections, approvals, and triage events.
          </p>
        </div>

        <div>
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
      {/* 2. SEARCH & SEGMENTED ACTION FILTER                           */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Segmented Action Filters: Apple Glass Pill */}
        <div className="inline-flex p-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl overflow-x-auto no-scrollbar">
          {[
            { id: 'ALL', label: 'All Transactions', count: stats.total },
            { id: 'DISPATCH', label: 'Dispatches', count: stats.dispatches },
            { id: 'RETURN', label: 'Returns', count: stats.returns },
            { id: 'DEFECT', label: 'Defects', count: stats.defects },
            { id: 'APPROVED', label: 'Approvals', count: stats.approvals },
            { id: 'RETIRED', label: 'Retirements', count: stats.retirements },
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
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full md:w-80">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search Actor PRN, Name, Tag, or flaw..."
          />
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. DATA TABLE                                                 */}
      {/* ───────────────────────────────────────────────────────────── */}
      <DataTable
        columns={columns}
        data={filteredLogs}
        pageSize={12}
        emptyMessage="No cryptographic audit records found matching your filter criteria."
      />
    </div>
  );
}

export default AuditLogPage;
