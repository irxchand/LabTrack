import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FileText,
  Boxes,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export function ApprovalsQueuePage() {
  const navigate = useNavigate();
  const { requisitions, inventory, activeLoans, approveRequisition, rejectRequisition } = useLabData();
  const { currentUser } = useAuth();
  const facultyName = currentUser?.name || 'Dr. Anjali Dalvi';

  // Modal states
  const [rejectModalReq, setRejectModalReq] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const [modifyModalReq, setModifyModalReq] = useState(null);
  const [modifiedQuantities, setModifiedQuantities] = useState({});

  const [endorseModalReq, setEndorseModalReq] = useState(null);
  const [authorizedLocation, setAuthorizedLocation] = useState('Room 402 Bench Only');
  const [authorizedTerm, setAuthorizedTerm] = useState('14-Day Sprint');
  const [customEndorsementNotes, setCustomEndorsementNotes] = useState('');
  const [isBatchApproving, setIsBatchApproving] = useState(false);

  // Filter scope: 'mentored' vs 'all'
  const [activeScope, setActiveScope] = useState('mentored');

  // Friendly date helper (e.g. Oct 15)
  const formatFriendlyDate = (dateString) => {
    if (!dateString) return '';
    try {
      const parts = dateString.split(' ')[0].split('-');
      if (parts.length === 3) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const m = monthNames[parseInt(parts[1], 10) - 1] || parts[1];
        const d = parseInt(parts[2], 10);
        return `${m} ${d}`;
      }
      return dateString.split(' ')[0];
    } catch {
      return dateString.split(' ')[0];
    }
  };

  // Filter requisitions needing review: matching both 'Submitted' and legacy 'Pending Approval'
  const allPendingRequisitions = useMemo(() => {
    return requisitions.filter(
      (r) => r.status === 'Submitted' || r.status === 'Pending Approval'
    );
  }, [requisitions]);

  const isMentorMatch = (req) => {
    if (!req.mentorName) return false;
    const m = req.mentorName.toLowerCase();
    const f = facultyName.toLowerCase();
    return m.includes(f) || f.includes(m) || req.mentorId === currentUser?.prn;
  };

  const mentoredPending = useMemo(() => {
    return allPendingRequisitions.filter(isMentorMatch);
  }, [allPendingRequisitions, facultyName, currentUser]);

  const displayedRequisitions = useMemo(() => {
    if (activeScope === 'mentored' && mentoredPending.length > 0) {
      return mentoredPending;
    }
    return allPendingRequisitions;
  }, [allPendingRequisitions, mentoredPending, activeScope]);

  // Live component bench stock resolution
  const getComponentStock = (comp) => {
    const match = inventory.find(
      (i) =>
        i.id === comp.itemId ||
        i.assetTag === comp.itemId ||
        (i.nomenclature && comp.nomenclature && (
          i.nomenclature.toLowerCase().includes(comp.nomenclature.toLowerCase()) ||
          comp.nomenclature.toLowerCase().includes(i.nomenclature.toLowerCase())
        ))
    );
    if (!match) return { inStock: true, count: 4, depot: 'Shelf L2' };
    const count = match.stockCount ?? (match.stockStatus === 'Available' ? 1 : 0);
    return {
      inStock: count > 0,
      count,
      coordinates: match.coordinates || 'Bench Rack',
    };
  };

  // Team custody load lookup
  const getTeamCustodyLoad = (projectId, prn) => {
    const loans = activeLoans.filter(
      (l) => l.projectId === projectId || l.borrowerPrn === prn
    );
    const overdueCount = loans.filter((l) => l.status === 'Overdue' || l.daysRemaining < 0).length;
    return {
      activeCount: loans.length,
      overdueCount,
    };
  };

  // 1-Click Fast-Pass Quick Approve
  const handleQuickApprove = (id) => {
    approveRequisition(id, `Endorsed by ${facultyName} for laboratory coursework milestones.`);
  };

  // Open Endorsement with Caveat Dialog
  const handleOpenEndorseWithCaveat = (req) => {
    setEndorseModalReq(req);
    setAuthorizedLocation('Room 402 Bench Only');
    setAuthorizedTerm('14-Day Sprint');
    setCustomEndorsementNotes('Coursework validated. Safe handling authorized.');
  };

  const handleConfirmEndorseWithCaveat = (e) => {
    e.preventDefault();
    if (!endorseModalReq) return;
    const combinedNotes = `Scope: ${authorizedLocation} • Cap: ${authorizedTerm} • Notes: ${customEndorsementNotes}`;
    approveRequisition(endorseModalReq.id, combinedNotes);
    setEndorseModalReq(null);
  };

  // Fast-Pass Batch Endorse for Compliant Mentored Teams
  const handleBatchEndorseCompliant = async () => {
    const compliant = displayedRequisitions.filter((r) => (r.teamReliabilityScore || 90) >= 75);
    if (!compliant.length) return;
    setIsBatchApproving(true);
    try {
      for (const req of compliant) {
        await approveRequisition(
          req.id,
          `Batch faculty endorsement: ${facultyName} verified compliant curriculum proposal.`
        );
      }
    } finally {
      setIsBatchApproving(false);
    }
  };

  // Reject handlers
  const handleOpenReject = (req) => {
    setRejectModalReq(req);
    setRejectReason('');
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectModalReq) return;
    rejectRequisition(rejectModalReq.id, rejectReason, facultyName);
    setRejectModalReq(null);
  };

  // Modify handlers
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
      facultyName,
      updatedComponents
    );
    setModifyModalReq(null);
  };

  const columns = [
    {
      header: 'Request Date & ID',
      accessor: 'id',
      width: '150px',
      render: (row) => (
        <div className="font-sans text-xs">
          <div className="font-semibold text-white tracking-wide">{row.id}</div>
          <div className="text-zinc-500 text-[11px] mt-0.5">{formatFriendlyDate(row.requestDate)}</div>
        </div>
      ),
    },
    {
      header: 'Student Team & Governance',
      accessor: 'studentName',
      width: '210px',
      render: (row) => {
        const custody = getTeamCustodyLoad(row.projectId, row.studentPrn);
        const isMyMentoredTeam = isMentorMatch(row);
        return (
          <div className="font-sans text-xs space-y-1">
            <div className="text-white font-medium">{row.studentName}</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => navigate(`/workspace/projects/${row.projectId}`)}
                className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[#c9b8a0] border border-white/10 hover:border-white/25 text-[11px] font-medium transition-all"
                title="View Project Dossier"
              >
                {row.projectId}
              </button>
              <span className="text-zinc-500 text-[11px]">{row.courseCode}</span>
            </div>
            <div className="text-[11px] text-zinc-400 flex items-center gap-1">
              <span>Custody:</span>
              <span className="text-zinc-300 font-medium">
                {custody.activeCount} active unit{custody.activeCount === 1 ? '' : 's'}
              </span>
              {custody.overdueCount > 0 && (
                <span className="text-rose-400 font-semibold">• {custody.overdueCount} Overdue</span>
              )}
              {isMyMentoredTeam && (
                <span className="ml-auto text-[10px] px-1.5 py-0.2 rounded bg-[#c9b8a0]/15 text-[#c9b8a0] font-medium border border-[#c9b8a0]/25">
                  Mentored
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      header: 'Compliance Health',
      accessor: 'teamReliabilityScore',
      width: '130px',
      render: (row) => {
        const isFlagged = row.teamReliabilityScore < 75;
        return (
          <div className="font-sans text-xs space-y-1">
            <div className="flex items-center gap-1.5">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                  isFlagged
                    ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {row.teamReliabilityScore}/100
              </span>
              {isFlagged && <AlertTriangle className="w-3.5 h-3.5 text-rose-400" title="Low Integrity Flag" />}
            </div>
            <div className="text-[10px] text-zinc-500">
              {isFlagged ? 'Scrutiny Required' : 'Clean Audit History'}
            </div>
          </div>
        );
      },
    },
    {
      header: 'Requested Components & Bench Stock',
      accessor: 'technicalPurpose',
      render: (row) => (
        <div className="space-y-2 font-sans text-xs">
          <div className="flex flex-wrap gap-1.5">
            {row.componentsRequested.map((c, i) => {
              const stock = getComponentStock(c);
              const isShortage = stock.count < c.quantity;
              return (
                <div
                  key={i}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] ${
                    isShortage
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                      : 'bg-white/[0.03] border-white/10 text-zinc-200'
                  }`}
                >
                  <span className="font-semibold text-white">{c.quantity}x</span>
                  <span>{c.nomenclature}</span>
                  <span className="text-[10px] text-zinc-400 font-mono pl-1 border-l border-white/10">
                    {stock.count > 0 ? `${stock.count} bench` : '0 avail'}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-zinc-400 text-xs italic font-normal leading-relaxed line-clamp-2">
            "{row.technicalPurpose}"
          </p>
        </div>
      ),
    },
    {
      header: 'Supervisor Review Controls',
      width: '260px',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5 font-sans text-xs">
          {/* Modify Allocation Button */}
          <button
            onClick={() => handleOpenModify(row)}
            className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Adjust Allocation Quantities"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          {/* Endorse with Caveat Button */}
          <button
            onClick={() => handleOpenEndorseWithCaveat(row)}
            className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-[#c9b8a0] hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Attach Restrictions & Endorse"
          >
            <FileText className="w-3.5 h-3.5" />
          </button>

          {/* Reject Button */}
          <button
            onClick={() => handleOpenReject(row)}
            className="px-3 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 transition-colors flex items-center gap-1 cursor-pointer text-[11px] font-medium"
          >
            <X className="w-3 h-3" />
            <span>Reject</span>
          </button>

          {/* 1-Click Quick Endorse Button */}
          <button
            onClick={() => handleQuickApprove(row.id)}
            className="px-3.5 py-1.5 rounded-full bg-white hover:bg-neutral-200 text-black font-semibold text-[11px] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Endorse</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER & TELEMETRY STRIP                               */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#c9b8a0]">
            Academic Governance & BOM Oversight
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white mt-1 font-display">
            Faculty Supervisor Review Desk
          </h1>
          <p className="text-[13px] text-zinc-400 mt-1 max-w-2xl font-normal leading-relaxed">
            Review student capstone proposals, inspect live bench stock, verify team reliability scores, and authorize hardware allocations.
          </p>
        </div>

        {/* Scope Selector: Apple Segmented Pill */}
        <div className="flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveScope('mentored')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeScope === 'mentored'
                ? 'bg-white text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>My Mentored Teams</span>
            <span className="px-1.5 py-0.2 rounded-full bg-black/10 text-[10px]">
              {mentoredPending.length}
            </span>
          </button>

          <button
            onClick={() => setActiveScope('all')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeScope === 'all'
                ? 'bg-white text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>All Requests</span>
            <span className="px-1.5 py-0.2 rounded-full bg-black/10 text-[10px]">
              {allPendingRequisitions.length}
            </span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. FAST-PASS BATCH ENDORSEMENT BANNER                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      {displayedRequisitions.length > 1 && (
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-xl">
          <div className="space-y-0.5">
            <div className="font-semibold text-white text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#c9b8a0]" />
              <span>Fast-Pass Academic Batch Endorsement</span>
            </div>
            <p className="text-zinc-400 text-xs">
              {displayedRequisitions.filter((r) => (r.teamReliabilityScore || 90) >= 75).length} of {displayedRequisitions.length} pending orders meet strict collegiate compliance standards (&gt;75 integrity).
            </p>
          </div>
          <button
            type="button"
            onClick={handleBatchEndorseCompliant}
            disabled={isBatchApproving}
            className="px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{isBatchApproving ? 'Endorsing...' : `Endorse Compliant (${displayedRequisitions.filter((r) => (r.teamReliabilityScore || 90) >= 75).length})`}</span>
          </button>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. REQUISITIONS DATA TABLE                                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      <DataTable
        columns={columns}
        data={displayedRequisitions}
        pageSize={8}
        emptyMessage="Requisition queue clear. No student hardware requests currently pending faculty review in this scope."
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 1: ENDORSE WITH RESTRICTIONS & ACADEMIC CAVEATS         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={!!endorseModalReq}
        onClose={() => setEndorseModalReq(null)}
        title={`Authorize Endorsement: ${endorseModalReq?.id}`}
        subtitle={`Requester: ${endorseModalReq?.studentName} • ${endorseModalReq?.projectId}`}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleConfirmEndorseWithCaveat} className="space-y-4 text-xs font-sans text-zinc-300">
          {/* Location Authorization */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-2">
              Authorized Custody Boundary
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'Room 402 Bench Only', label: 'Room 402 Bench Only', desc: 'No off-campus or hostel removal' },
                { id: 'Open Campus / Lab Clearance', label: 'Open Campus Permitted', desc: 'Coursework term deployment authorized' },
              ].map((loc) => {
                const isSelected = authorizedLocation === loc.id;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => setAuthorizedLocation(loc.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-black font-semibold border-white shadow-sm'
                        : 'bg-white/[0.03] text-zinc-400 border-white/10 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-semibold">{loc.label}</div>
                    <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-zinc-700' : 'text-zinc-500'}`}>
                      {loc.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Term Cap */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-2">
              Milestone Time Cap
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['48-Hour Rapid Benchmark', '14-Day Sprint', 'Full Term Clearance'].map((term) => {
                const isSelected = authorizedTerm === term;
                return (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setAuthorizedTerm(term)}
                    className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer text-[11px] font-medium ${
                      isSelected
                        ? 'bg-white text-black font-semibold border-white shadow-sm'
                        : 'bg-white/[0.03] text-zinc-400 border-white/10 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {term}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Faculty Remarks Textarea */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1.5">
              Faculty Endorsement Notes
            </label>
            <textarea
              rows={3}
              value={customEndorsementNotes}
              onChange={(e) => setCustomEndorsementNotes(e.target.value)}
              placeholder="e.g. Authorized for capstone benchmark in Lab 3. Return before Friday evaluation."
              className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 transition-all font-sans text-xs"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setEndorseModalReq(null)}
              className="px-4 py-2 rounded-full border border-white/10 text-xs text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-all shadow-md cursor-pointer"
            >
              Commit Endorsement
            </button>
          </div>
        </form>
      </Modal>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 2: REJECT REQUISITION                                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={!!rejectModalReq}
        onClose={() => setRejectModalReq(null)}
        title={`Reject Requisition: ${rejectModalReq?.id}`}
        subtitle={`Requester: ${rejectModalReq?.studentName} • ${rejectModalReq?.projectId}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleConfirmReject} className="space-y-4 text-xs font-sans text-zinc-300">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
              Academic Reason / Rejection Rationale <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Requested hardware exceeds approved capstone scope. Consult with supervisor during Tuesday office hours."
              className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-500/50 transition-all font-sans text-xs"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setRejectModalReq(null)}
              className="px-4 py-2 rounded-full border border-white/10 text-xs text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-rose-500 hover:bg-rose-400 text-white text-xs font-semibold transition-all shadow-md cursor-pointer"
            >
              Record Rejection
            </button>
          </div>
        </form>
      </Modal>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 3: MODIFY ALLOCATION QUANTITIES                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={!!modifyModalReq}
        onClose={() => setModifyModalReq(null)}
        title={`Adjust Allocated Quantities: ${modifyModalReq?.id}`}
        subtitle="Decrease or adjust authorized component counts prior to counter dispatch."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleConfirmModify} className="space-y-4 text-xs font-sans text-zinc-300">
          <div className="space-y-2.5">
            {modifyModalReq?.componentsRequested.map((comp, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/10 rounded-xl font-sans">
                <span className="text-white text-xs truncate max-w-[240px]">{comp.nomenclature}</span>
                <div className="flex items-center gap-2">
                  <label className="text-zinc-400 text-[11px]">Approved:</label>
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
                    className="w-16 px-2.5 py-1.5 bg-[#141417] border border-white/15 rounded-xl text-white text-center text-xs font-semibold focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setModifyModalReq(null)}
              className="px-4 py-2 rounded-full border border-white/10 text-xs text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-all shadow-md cursor-pointer"
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
