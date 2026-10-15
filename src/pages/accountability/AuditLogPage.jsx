import React, { useState, useMemo } from 'react';
import { useLabData } from '../../context/LabDataContext';
import { DataTable } from '../../components/common/DataTable';
import { SearchInput } from '../../components/common/SearchInput';
import { FileText, ShieldCheck, Hash, UserCheck } from 'lucide-react';

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
        <div className="font-mono text-xs">
          <div className="font-semibold text-blue-400">{row.id}</div>
          <div className="text-zinc-500 text-[11px]">{row.timestamp}</div>
        </div>
      ),
    },
    {
      header: 'Actor & Clearance',
      accessor: 'actorName',
      width: '190px',
      render: (row) => (
        <div className="font-mono text-xs">
          <div className="text-zinc-200 font-medium">{row.actorName}</div>
          <div className="text-zinc-500 text-[11px]">{row.actorPrn} • {row.actorRole}</div>
        </div>
      ),
    },
    {
      header: 'Action Type',
      accessor: 'action',
      width: '190px',
      render: (row) => {
        let badgeColor = 'bg-zinc-800 text-zinc-300 border-zinc-700';
        if (row.action.includes('DISPATCH')) badgeColor = 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60';
        else if (row.action.includes('DEFECT')) badgeColor = 'bg-rose-950/80 text-rose-400 border-rose-700/60';
        else if (row.action.includes('APPROVED')) badgeColor = 'bg-indigo-950/80 text-indigo-300 border-indigo-700/60';
        else if (row.action.includes('RETIRED')) badgeColor = 'bg-red-950 text-red-400 border-red-600';

        return (
          <span className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-semibold border ${badgeColor}`}>
            {row.action}
          </span>
        );
      },
    },
    {
      header: 'Audit Target & Details',
      accessor: 'details',
      render: (row) => (
        <div className="space-y-0.5 font-mono text-xs">
          <div className="text-zinc-200">{row.details}</div>
          <div className="text-zinc-500 text-[11px]">Entity Ref: {row.targetId}</div>
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
    <div className="space-y-4">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-800/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Immutable Institutional Audit Log
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-0.5">
            Tamper-evident record of all equipment checkouts, returns, faculty approvals, and hardware triage events.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
          <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800">
            Chain Status: <span className="text-emerald-400 font-semibold">VERIFIED SHA-256</span>
          </span>
        </div>
      </div>

      {/* Filter Surface */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-zinc-900/60 p-3 rounded-lg border border-zinc-800">
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
            className="w-full bg-zinc-900 border border-zinc-700/80 rounded px-2.5 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Event Types</option>
            <option value="DISPATCH_COMMITTED">Dispatch Committed</option>
            <option value="RETURN_ACCEPTED">Return Accepted</option>
            <option value="REQUISITION_APPROVED">Requisition Approved</option>
            <option value="DEFECT_LOGGED">Defect Logged</option>
            <option value="ASSET_RETIRED">Asset Retired</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <DataTable
        columns={columns}
        data={filteredLogs}
        pageSize={12}
        emptyMessage="No audit logs match current query filters."
      />
    </div>
  );
}
