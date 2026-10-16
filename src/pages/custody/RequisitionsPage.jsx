import React, { useState, useMemo } from 'react';
import { useLabData } from '../../context/LabDataContext';
import { useAuth } from '../../context/AuthContext';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Inbox, Clock, CheckCircle2, AlertCircle, Eye, ShoppingBag } from 'lucide-react';

export function RequisitionsPage() {
  const { requisitions, setIsBasketOpen } = useLabData();
  const { currentUser, role } = useAuth();
  const [selectedReq, setSelectedReq] = useState(null);

  // Filter based on role
  const displayedRequisitions = useMemo(() => {
    if (role === 'Student') {
      return requisitions.filter((r) => r.studentPrn === currentUser?.prn);
    }
    if (role === 'Faculty') {
      return requisitions.filter(
        (r) => r.mentorId === currentUser?.prn || r.mentorName === currentUser?.name
      );
    }
    // Assistant and Admin view all
    return requisitions;
  }, [requisitions, role, currentUser]);

  const columns = [
    {
      header: 'Requisition ID',
      accessor: 'id',
      width: '150px',
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-blue-400">{row.id}</span>
      ),
    },
    {
      header: 'Project Team & Requester',
      accessor: 'studentName',
      width: '200px',
      render: (row) => (
        <div className="font-mono text-xs">
          <div className="text-zinc-200 font-medium">{row.studentName}</div>
          <div className="text-zinc-500 text-[11px]">{row.projectId} • {row.courseCode}</div>
        </div>
      ),
    },
    {
      header: 'Components Requested',
      accessor: 'componentsRequested',
      render: (row) => (
        <div className="space-y-1">
          {row.componentsRequested.map((c, i) => (
            <div key={i} className="text-xs text-zinc-300 flex items-center gap-1.5 font-mono">
              <span className="text-blue-400 font-semibold">{c.quantity}x</span>
              <span className="truncate">{c.nomenclature}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      header: 'Submitted Date',
      accessor: 'requestDate',
      width: '160px',
      render: (row) => (
        <span className="font-mono text-xs text-zinc-400">{row.requestDate?.split(' ')[0]}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      width: '170px',
      render: (row) => <StatusBadge status={row.status} type="requisition" />,
    },
    {
      header: 'Timeline & Notes',
      width: '130px',
      align: 'right',
      render: (row) => (
        <button
          onClick={() => setSelectedReq(row)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          Timeline
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-800/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <Inbox className="w-5 h-5 text-blue-500" />
            Requisition Tracking & Review Status
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-0.5">
            Audit pipeline tracking hardware requisitions through faculty endorsement and counter staging.
          </p>
        </div>

        <button
          onClick={() => setIsBasketOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-medium transition-colors shadow-sm"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Draft New Requisition
        </button>
      </div>

      {/* Requisitions Table */}
      <DataTable
        columns={columns}
        data={displayedRequisitions}
        pageSize={10}
        emptyMessage="No pending or historical requisitions recorded in this account's scope."
      />

      {/* Requisition Timeline Modal */}
      <Modal
        isOpen={!!selectedReq}
        onClose={() => setSelectedReq(null)}
        title={`Requisition Lifecycle: ${selectedReq?.id}`}
        subtitle={`Submitted by ${selectedReq?.studentName} (${selectedReq?.projectId})`}
      >
        {selectedReq && (
          <div className="space-y-5 text-xs font-sans">
            {/* Purpose */}
            <div className="p-3 bg-zinc-950 rounded border border-zinc-800 space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                Stated Technical Purpose
              </div>
              <p className="text-zinc-200 font-mono leading-relaxed">{selectedReq.technicalPurpose}</p>
            </div>

            {/* Lifecycle Stages */}
            <div className="space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                Audit Timeline Progression
              </div>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
                {selectedReq.timeline.map((step, idx) => (
                  <div key={idx} className="relative space-y-0.5">
                    <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-blue-600 border-2 border-zinc-900 flex items-center justify-center text-[9px] text-white font-bold">
                      {idx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-100 font-mono">{step.step}</span>
                      <span className="text-[10px] font-mono text-zinc-500">• {step.timestamp}</span>
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400">Actor: {step.actor}</div>
                    {step.note && (
                      <div className="text-zinc-300 bg-zinc-950 p-2 rounded border border-zinc-800/80 mt-1 font-mono text-[11px]">
                        "{step.note}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Item Allocation Summary */}
            <div className="p-3 bg-zinc-950 rounded border border-zinc-800 space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                Hardware Manifest
              </div>
              <div className="divide-y divide-zinc-800/80">
                {selectedReq.componentsRequested.map((item, idx) => (
                  <div key={idx} className="py-1.5 flex justify-between font-mono text-xs">
                    <span className="text-zinc-300">{item.nomenclature}</span>
                    <span className="text-blue-400 font-bold">{item.quantity} Unit(s)</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-zinc-800">
              <button
                onClick={() => setSelectedReq(null)}
                className="px-4 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-xs transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
