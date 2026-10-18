import React, { useState } from 'react';
import { useLabData } from '../../context/LabDataContext';
import { useAuth } from '../../context/AuthContext';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import {
  CheckSquare,
  AlertTriangle,
  Check,
  X,
  Edit3,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export function ApprovalsQueuePage() {
  const { requisitions, approveRequisition, rejectRequisition } = useLabData();
  const { currentUser } = useAuth();

  const [rejectModalReq, setRejectModalReq] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const [modifyModalReq, setModifyModalReq] = useState(null);
  const [modifiedQuantities, setModifiedQuantities] = useState({});

  const pendingRequisitions = requisitions.filter((r) => r.status === 'Pending Approval');

  const handleApprove = (id) => {
    approveRequisition(id, currentUser?.name || 'Dr. Meenakshi Sharma');
  };

  const handleOpenReject = (req) => {
    setRejectModalReq(req);
    setRejectReason('');
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectModalReq) return;
    rejectRequisition(rejectModalReq.id, rejectReason, currentUser?.name || 'Dr. Meenakshi Sharma');
    setRejectModalReq(null);
  };

  const handleOpenModify = (req) => {
    setModifyModalReq(req);
    const initialMap = {};
    req.componentsRequested.forEach((c, idx) => {
      initialMap[idx] = c.quantity;
    });
    setModifiedQuantities(initialMap);
  };

  const handleConfirmModify = (e) => {
    e.preventDefault();
    if (!modifyModalReq) return;
    const updatedComponents = modifyModalReq.componentsRequested.map((c, idx) => ({
      ...c,
      quantity: Number(modifiedQuantities[idx]) || c.quantity,
    }));
    approveRequisition(
      modifyModalReq.id,
      currentUser?.name || 'Dr. Meenakshi Sharma',
      updatedComponents
    );
    setModifyModalReq(null);
  };

  const columns = [
    {
      header: 'Request Date & ID',
      accessor: 'id',
      width: '160px',
      render: (row) => (
        <div className="font-sans text-xs">
          <div className="font-semibold text-[#c9b8a0]">{row.id}</div>
          <div className="text-zinc-500 text-[11px]">{row.requestDate?.split(' ')[0]}</div>
        </div>
      ),
    },
    {
      header: 'Student Team & Course',
      accessor: 'studentName',
      width: '190px',
      render: (row) => (
        <div className="font-sans text-xs">
          <div className="text-white font-semibold">{row.studentName}</div>
          <div className="text-zinc-400 text-[11px]">{row.projectId} • {row.courseCode}</div>
        </div>
      ),
    },
    {
      header: 'Compliance Tier',
      accessor: 'teamReliabilityScore',
      width: '140px',
      render: (row) => {
        const isFlagged = row.teamReliabilityScore < 75;
        return (
          <div className="flex items-center gap-1.5 font-sans text-xs">
            <span
              className={`px-2 py-0.5 rounded-full font-bold border ${
                isFlagged
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}
            >
              {row.teamReliabilityScore}/100
            </span>
            {isFlagged && <AlertTriangle className="w-3.5 h-3.5 text-rose-400" title="Compliance Flagged" />}
          </div>
        );
      },
    },
    {
      header: 'Requested Components & Stated Purpose',
      accessor: 'technicalPurpose',
      render: (row) => (
        <div className="space-y-1.5 font-sans text-xs">
          <div className="flex flex-wrap gap-1.5">
            {row.componentsRequested.map((c, i) => (
              <span key={i} className="px-2.5 py-0.5 bg-white/[0.04] text-zinc-300 rounded-full border border-white/10 text-[11px]">
                {c.quantity}x {c.nomenclature}
              </span>
            ))}
          </div>
          <p className="text-zinc-400 font-inter text-xs line-clamp-2 italic">
            "{row.technicalPurpose}"
          </p>
        </div>
      ),
    },
    {
      header: 'Supervisor Review Controls',
      width: '240px',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2 font-inter text-xs">
          <button
            onClick={() => handleOpenModify(row)}
            className="p-2 rounded-full glass-neural text-zinc-400 hover:text-white hover:border-[#a78b71]/50 transition-neural"
            title="Modify Allocated Quantities"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => handleOpenReject(row)}
            className="px-3 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-neural flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Reject
          </button>

          <button
            onClick={() => handleApprove(row.id)}
            className="px-4 py-1.5 rounded-full bg-white hover:bg-[#e8d5b7] text-black font-semibold uppercase tracking-wider text-[11px] transition-neural flex items-center gap-1.5 shadow-sm"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            Approve
          </button>
        </div>
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
            <span>AUTHORIZATION DESK</span>
          </div>
          <h1 className="text-2xl font-playfair font-normal italic text-white flex items-center gap-2.5">
            <CheckSquare className="w-6 h-6 text-[#a78b71]" />
            Faculty Supervisor Review Desk
          </h1>
          <p className="text-xs font-inter text-zinc-400 mt-1 max-w-2xl">
            Academic authorization desk: review technical rationale, verify reliability badges, and approve or adjust allocations.
          </p>
        </div>

        <div className="text-xs font-inter text-zinc-400 px-4 py-2 rounded-full glass-neural border border-white/10 flex items-center gap-2">
          <span>Awaiting Action:</span>
          <span className="text-amber-400 font-bold">{pendingRequisitions.length}</span>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={pendingRequisitions}
        pageSize={8}
        emptyMessage="Requisition queue clear. No student hardware requests currently pending faculty review."
      />

      {/* Reject Modal */}
      <Modal
        isOpen={!!rejectModalReq}
        onClose={() => setRejectModalReq(null)}
        title={`Reject Requisition: ${rejectModalReq?.id}`}
        subtitle={`Requester: ${rejectModalReq?.studentName} (${rejectModalReq?.projectId})`}
      >
        <form onSubmit={handleConfirmReject} className="space-y-4 text-xs font-inter">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
              Academic Reason / Rejection Rationale <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Scope exceeding approved coursework milestones; please consult with mentor during Tuesday office hours."
              className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-500 transition-neural"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setRejectModalReq(null)}
              className="px-4 py-2 rounded-full border border-white/10 text-xs text-zinc-400 hover:text-white transition-neural"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white shadow-sm transition-neural"
            >
              Record Rejection
            </button>
          </div>
        </form>
      </Modal>

      {/* Modify Allocation Quantity Modal */}
      <Modal
        isOpen={!!modifyModalReq}
        onClose={() => setModifyModalReq(null)}
        title={`Adjust Allocated Quantities: ${modifyModalReq?.id}`}
        subtitle="Decrease or increase authorized hardware counts prior to counter dispatch."
      >
        <form onSubmit={handleConfirmModify} className="space-y-4 text-xs font-inter">
          <div className="space-y-3">
            {modifyModalReq?.componentsRequested.map((comp, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/10 rounded-2xl font-sans">
                <span className="text-white text-xs truncate max-w-[260px]">{comp.nomenclature}</span>
                <div className="flex items-center gap-2">
                  <label className="text-zinc-500 text-[11px]">Approved Qty:</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={modifiedQuantities[idx] ?? comp.quantity}
                    onChange={(e) =>
                      setModifiedQuantities({
                        ...modifiedQuantities,
                        [idx]: e.target.value,
                      })
                    }
                    className="w-16 px-2.5 py-1.5 bg-white/[0.06] border border-white/15 rounded-xl text-white text-center text-xs font-bold focus:outline-none focus:border-[#a78b71]"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setModifyModalReq(null)}
              className="px-4 py-2 rounded-full border border-white/10 text-xs text-zinc-400 hover:text-white transition-neural"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-white hover:bg-[#e8d5b7] text-black text-xs font-bold uppercase tracking-wider transition-neural shadow-md"
            >
              Save Allocation Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ApprovalsQueuePage;
