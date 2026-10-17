import React, { useState, useMemo } from 'react';
import { useLabData } from '../../context/LabDataContext';
import { DataTable } from '../../components/common/DataTable';
import { SearchInput } from '../../components/common/SearchInput';
import { FileText, ShieldCheck, Hash, UserCheck, Sparkles } from 'lucide-react';

export function AuditLogPage() {
  const { auditLogs } = useLabData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (filterAction !== 'ALL' && log.action !== filterAction) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          log.actorPrn.toLowerCase().includes(q) ||
          log.actorName.toLowerCase().includes(q) ||
          log.targetId.toLowerCase().includes(q) ||
          log.details.toLowerCase().includes(q) ||
          log.action.toLowerCase().includes(q)
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
          <div className="font-semibold text-[#c9b8a0]">{row.id}</div>
          <div className="text-zinc-500 text-[11px] mt-0.5">{row.timestamp}</div>
        </div>
      ),
    },
    {
      header: 'Actor & Clearance',
      accessor: 'actorName',
      width: '190px',
      render: (row) => (
        <div className="font-sans text-xs">
          <div className="text-white font-medium">{row.actorName}</div>
          <div className="text-zinc-400 text-[11px] mt-0.5">{row.actorPrn} • {row.actorRole}</div>
        </div>
      ),
    },
    {
      header: 'Action Type',
      accessor: 'action',
      width: '190px',
      render: (row) => {
        let badgeColor = 'bg-white/[0.04] text-zinc-300 border-white/10';
        if (row.action.includes('DISPATCH')) badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
        else if (row.action.includes('DEFECT')) badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
        else if (row.action.includes('APPROVED')) badgeColor = 'bg-[#c9b8a0]/15 text-[#f5e6c8] border-[#c9b8a0]/30';
        else if (row.action.includes('RETIRED')) badgeColor = 'bg-rose-500/15 text-rose-300 border-rose-500/30';

        return (
          <span className={`px-2.5 py-0.5 rounded-full font-sans text-[10px] uppercase font-semibold border ${badgeColor}`}>
            {row.action}
          </span>
        );
      },
    },
    {
      header: 'Audit Target & Details',
      accessor: 'details',
      render: (row) => (
        <div className="space-y-0.5 font-sans text-xs">
          <div className="text-zinc-200">{row.details}</div>
          <div className="text-zinc-400 text-[11px]">Entity Ref: <span className="text-[#c9b8a0]">{row.targetId}</span></div>
        </div>
      ),
    },
    {
      header: 'Cryptographic Checksum',
      accessor: 'checksum',
      width: '180px',
      render: (row) => (
        <span className="font-mono text-[11px] text-zinc-500 truncate block">
          {row.checksum}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="text-[11px] font-sans font-semibold text-[#c9b8a0] tracking-wider uppercase flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9b8a0]" />
            EXECUTIVE AUDIT TRAIL
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Immutable Institutional Audit Log
          </h1>
          <p className="text-xs font-sans text-zinc-400 mt-1 max-w-xl">
            Tamper-evident record of all equipment checkouts, returns, faculty approvals, and hardware triage events.
          </p>
        </div>

        <div className="flex items-center gap-2 font-sans text-xs text-zinc-400">
          <span className="px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 shadow-sm flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-400">Chain Status:</span>
            <span className="text-emerald-400 font-semibold">VERIFIED SHA-256</span>
          </span>
        </div>
      </div>

      {/* Filter Surface */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-white/[0.02] p-3 rounded-2xl border border-white/10 backdrop-blur-xl">
        <div className="md:col-span-8">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by Actor PRN, name, target entity ID, or description..."
          />
        </div>

        <div className="md:col-span-4">
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full bg-[#111215] border border-white/15 rounded-xl px-3 py-2 text-xs font-sans text-zinc-200 focus:outline-none focus:border-[#c9b8a0] cursor-pointer"
          >
            <option value="ALL">All Recorded Actions</option>
            <option value="REQUISITION_APPROVED">Requisition Approvals</option>
            <option value="EQUIPMENT_DISPATCH">Equipment Dispatches</option>
            <option value="EQUIPMENT_RETURNED">Equipment Returns</option>
            <option value="DEFECT_LOGGED">Defect Incidents</option>
            <option value="ASSET_RETIRED">Asset Retirements</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredLogs}
        pageSize={10}
        emptyMessage="No audit log entries found matching criteria."
      />
    </div>
  );
}

export default AuditLogPage;
