import React, { useState, useMemo } from 'react';
import { useLabData } from '../../context/LabDataContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { InspectionForm } from '../../components/specialized/InspectionForm';
import {
  Terminal,
  Search,
  CheckCircle2,
  Package,
  RotateCcw,
  Send,
  Sparkles,
  ArrowRight,
  MapPin,
  Clock,
  User,
  ShieldCheck,
  Check,
  Cpu,
  Layers,
  AlertCircle,
} from 'lucide-react';

export function DispatchDeskPage() {
  const {
    inventory,
    requisitions,
    activeLoans,
    executeDispatch,
    executeReturn,
  } = useLabData();
  const { currentUser } = useAuth();

  // Mode switcher: 'dispatch' | 'checkin'
  const [terminalMode, setTerminalMode] = useState('dispatch');

  // DISPATCH STATE
  const [dispatchSearchPrn, setDispatchSearchPrn] = useState('');
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [selectedAssetTag, setSelectedAssetTag] = useState('');
  const [dueDateDays, setDueDateDays] = useState('14');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(null);

  // CHECKIN STATE
  const [checkinSearchQuery, setCheckinSearchQuery] = useState('');
  const [selectedReturnLoan, setSelectedReturnLoan] = useState(null);

  const [queueFilter, setQueueFilter] = useState('ready'); // 'ready' | 'pending' | 'all'

  // Partition requisitions by operational status
  const readyRequisitions = useMemo(() => {
    return requisitions.filter(
      (r) =>
        r.status === 'Approved' ||
        r.status === 'Faculty Endorsed' ||
        r.status === 'Ready for Counter Pickup'
    );
  }, [requisitions]);

  const pendingRequisitions = useMemo(() => {
    return requisitions.filter(
      (r) =>
        r.status === 'Submitted' ||
        r.status === 'Pending Approval' ||
        r.status === 'Awaiting Faculty Review'
    );
  }, [requisitions]);

  const displayedQueue = useMemo(() => {
    let pool = readyRequisitions;
    if (queueFilter === 'pending') pool = pendingRequisitions;
    if (queueFilter === 'all') pool = requisitions.filter((r) => r.status !== 'Dispatched');

    if (!dispatchSearchPrn.trim()) return pool;
    const query = dispatchSearchPrn.toLowerCase();
    return pool.filter(
      (r) =>
        r.studentPrn?.toLowerCase().includes(query) ||
        r.studentName?.toLowerCase().includes(query) ||
        r.projectId?.toLowerCase().includes(query) ||
        r.id?.toLowerCase().includes(query)
    );
  }, [queueFilter, readyRequisitions, pendingRequisitions, requisitions, dispatchSearchPrn]);

  // Filter available serialized physical assets for allocation
  const availableSerializedAssets = useMemo(() => {
    return inventory.filter(
      (item) => item.classification === 'Asset' && item.stockStatus === 'Available'
    );
  }, [inventory]);

  // Matching assets for the selected requisition
  const matchingAssets = useMemo(() => {
    if (!selectedRequisition || !selectedRequisition.componentsRequested?.length) {
      return availableSerializedAssets;
    }
    const requestedNoms = selectedRequisition.componentsRequested.map((c) =>
      c.nomenclature.toLowerCase()
    );
    const matched = availableSerializedAssets.filter((asset) =>
      requestedNoms.some(
        (nom) =>
          asset.nomenclature.toLowerCase().includes(nom) ||
          nom.includes(asset.nomenclature.toLowerCase())
      )
    );
    return matched.length > 0 ? matched : availableSerializedAssets;
  }, [selectedRequisition, availableSerializedAssets]);

  // Filter active loans for check-in
  const matchingReturnLoans = useMemo(() => {
    if (!checkinSearchQuery.trim()) return activeLoans;
    const query = checkinSearchQuery.toLowerCase();
    return activeLoans.filter((loan) => {
      return (
        loan.assetTag?.toLowerCase().includes(query) ||
        loan.borrowerPrn?.toLowerCase().includes(query) ||
        loan.borrowerName?.toLowerCase().includes(query) ||
        loan.nomenclature?.toLowerCase().includes(query)
      );
    });
  }, [activeLoans, checkinSearchQuery]);

  const handleExecuteDispatch = async (e) => {
    e.preventDefault();
    if (!selectedRequisition || !selectedAssetTag) return;
    setIsDispatching(true);

    const assetObj = inventory.find((i) => i.assetTag === selectedAssetTag);
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Number(dueDateDays));
    const formattedDueDate = dueDate.toISOString().replace('T', ' ').substring(0, 19);

    try {
      const payload = {
        requisitionId: selectedRequisition.id,
        assetTag: selectedAssetTag,
        nomenclature:
          assetObj?.nomenclature ||
          selectedRequisition.componentsRequested?.[0]?.nomenclature ||
          'Laboratory Hardware',
        studentPrn: selectedRequisition.studentPrn,
        studentName: selectedRequisition.studentName,
        projectId: selectedRequisition.projectId,
        courseCode: selectedRequisition.courseCode || 'DCDS-SY-AIML',
        dueDate: formattedDueDate,
        coordinates: assetObj?.coordinates || 'Room 402 • Counter Tray',
      };

      const success = await executeDispatch(payload);
      if (success) {
        setDispatchSuccess({
          assetTag: selectedAssetTag,
          borrowerName: selectedRequisition.studentName,
          borrowerPrn: selectedRequisition.studentPrn,
        });
        setSelectedRequisition(null);
        setSelectedAssetTag('');
        setTimeout(() => setDispatchSuccess(null), 4000);
      }
    } finally {
      setIsDispatching(false);
    }
  };

  const handleCompleteInspection = async ({ checklist, returnType, defectDetails }) => {
    if (!selectedReturnLoan) return;
    await executeReturn(selectedReturnLoan.id, checklist, returnType, defectDetails);
    setSelectedReturnLoan(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER & OPERATIONAL DESK CONTEXT                      */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#c9b8a0]">
            Operational Counter Terminal • Desk LA-04
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white mt-1 font-display">
            Dispatch & Return Desk
          </h1>
          <p className="text-[13px] text-zinc-400 mt-1 max-w-xl font-normal leading-relaxed">
            Fast-track physical hardware checkout, collegiate serial allocation, and multi-point return inspection desk.
          </p>
        </div>

        {/* Dual Mode Switcher: Apple Segmented Pill */}
        <div className="inline-flex p-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl">
          <button
            onClick={() => setTerminalMode('dispatch')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              terminalMode === 'dispatch'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Mode 1: Fast Dispatch</span>
            {readyRequisitions.length > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                terminalMode === 'dispatch' ? 'bg-black/10 text-black' : 'bg-white/10 text-white'
              }`}>
                {readyRequisitions.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTerminalMode('checkin')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              terminalMode === 'checkin'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mode 2: Return & Inspection</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              terminalMode === 'checkin' ? 'bg-black/10 text-black' : 'bg-white/10 text-white'
            }`}>
              {activeLoans.length}
            </span>
          </button>
        </div>
      </div>

      {/* Dispatch Success Alert Banner */}
      {dispatchSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-center justify-between text-emerald-300 text-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="font-semibold text-white">Hardware Dispatch Committed:</span>{' '}
              Asset <span className="font-semibold text-emerald-300">{dispatchSuccess.assetTag}</span> successfully checked out to{' '}
              <span className="text-white font-medium">{dispatchSuccess.borrowerName}</span> (PRN {dispatchSuccess.borrowerPrn}).
            </div>
          </div>
          <button
            onClick={() => setDispatchSuccess(null)}
            className="text-emerald-400 hover:text-white text-xs cursor-pointer ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 1: DISPATCH DESK                                                     */}
      {/* ========================================================================= */}
      {terminalMode === 'dispatch' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Student Lookup & Endorsed Orders (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Search Box */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl space-y-2.5">
              <label className="block text-[11px] font-sans uppercase tracking-wider text-zinc-400 font-semibold">
                Step 1: Rapid Student PRN / Project ID Search
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={dispatchSearchPrn}
                  onChange={(e) => setDispatchSearchPrn(e.target.value)}
                  placeholder="Enter Student PRN (e.g. 202401048) or Project ID..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl font-sans text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 transition-all"
                />
              </div>
              <p className="text-[11px] text-zinc-500">
                Type collegiate identifier to filter faculty-endorsed requisitions awaiting physical pickup.
              </p>
            </div>

            {/* Requisitions Queue Pool with Segmented Status Tabs */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl space-y-3 font-sans text-xs">
              {/* Segmented Queue Filter */}
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                <div className="inline-flex p-1 rounded-full bg-white/[0.04] border border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setQueueFilter('ready');
                      setSelectedRequisition(null);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      queueFilter === 'ready'
                        ? 'bg-white text-black shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Ready for Pickup ({readyRequisitions.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQueueFilter('pending');
                      setSelectedRequisition(null);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      queueFilter === 'pending'
                        ? 'bg-white text-black shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Awaiting Approval ({pendingRequisitions.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQueueFilter('all');
                      setSelectedRequisition(null);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      queueFilter === 'all'
                        ? 'bg-white text-black shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    All ({requisitions.filter((r) => r.status !== 'Dispatched').length})
                  </button>
                </div>
              </div>

              {displayedQueue.length > 0 ? (
                <div className="space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
                  {displayedQueue.map((req) => {
                    const isSelected = selectedRequisition?.id === req.id;
                    const isApproved =
                      req.status === 'Approved' ||
                      req.status === 'Faculty Endorsed' ||
                      req.status === 'Ready for Counter Pickup';

                    return (
                      <div
                        key={req.id}
                        onClick={() => {
                          setSelectedRequisition(req);
                          setSelectedAssetTag('');
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white/[0.08] border-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
                            : 'bg-white/[0.02] border-white/[0.06] hover:border-white/20 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white tracking-wide">{req.id}</span>
                          <StatusBadge status={req.status} type="requisition" size="xs" />
                        </div>

                        <div className="mt-2 space-y-0.5">
                          <div className="text-white font-medium flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-zinc-400" />
                            <span>{req.studentName}</span>
                            <span className="text-zinc-500 text-xs">({req.studentPrn})</span>
                          </div>
                          <div className="text-zinc-400 text-[11px] pl-5">
                            {req.projectId} • Mentor: {req.mentorName}
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between gap-1.5">
                          <div className="flex flex-wrap gap-1.5">
                            {req.componentsRequested?.map((c, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 rounded-full bg-white/[0.04] text-zinc-200 border border-white/10 text-[11px] font-medium"
                              >
                                {c.quantity}x {c.nomenclature}
                              </span>
                            ))}
                          </div>
                          {!isApproved && (
                            <span className="text-[10px] text-amber-400 font-medium whitespace-nowrap">
                              Pending Endorsement
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-zinc-500 text-xs space-y-1">
                  <Package className="w-7 h-7 mx-auto opacity-30 stroke-[1.5]" />
                  <p>
                    {queueFilter === 'ready'
                      ? 'No pre-approved requisitions awaiting counter pickup.'
                      : queueFilter === 'pending'
                      ? 'No student requisitions currently pending faculty review.'
                      : 'No student requisitions found.'}
                  </p>
                  {dispatchSearchPrn && (
                    <button
                      onClick={() => setDispatchSearchPrn('')}
                      className="text-xs text-white underline hover:opacity-80 pt-1 cursor-pointer"
                    >
                      Clear search filter
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Physical Asset Assignment & Checkout Commit (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl space-y-4 font-sans text-xs">
              <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold border-b border-white/[0.06] pb-2.5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Step 2: Physical Serialized Allocation & Checkout</span>
              </div>

              {selectedRequisition ? (
                (() => {
                  const isRequisitionApproved =
                    selectedRequisition.status === 'Approved' ||
                    selectedRequisition.status === 'Faculty Endorsed' ||
                    selectedRequisition.status === 'Ready for Counter Pickup';

                  if (!isRequisitionApproved) {
                    return (
                      <div className="space-y-4">
                        <div className="p-4 bg-amber-500/10 border border-amber-500/25 rounded-2xl space-y-2">
                          <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs">
                            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                            <span>Hardware Handover Locked — Awaiting Faculty Endorsement</span>
                          </div>
                          <p className="text-[11px] text-amber-200/80 leading-relaxed">
                            This requisition is in the institutional queue but has not yet been endorsed by supervising mentor {selectedRequisition.mentorName}. Physical allocation and checkout are restricted until faculty sign-off is completed.
                          </p>
                        </div>

                        <div className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.08] space-y-2 text-xs">
                          <div className="flex items-center justify-between text-zinc-400">
                            <span>Requisition Identifier:</span>
                            <span className="font-semibold text-white">{selectedRequisition.id}</span>
                          </div>
                          <div className="flex items-center justify-between text-zinc-400">
                            <span>Student Requester:</span>
                            <span className="text-white font-medium">
                              {selectedRequisition.studentName} ({selectedRequisition.studentPrn})
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-zinc-400">
                            <span>Academic Project:</span>
                            <span className="text-zinc-200">{selectedRequisition.projectId}</span>
                          </div>
                          <div className="flex items-center justify-between text-zinc-400">
                            <span>Faculty Mentor:</span>
                            <span className="text-amber-300 font-medium">{selectedRequisition.mentorName}</span>
                          </div>
                          <div className="flex items-center justify-between text-zinc-400">
                            <span>Current Status:</span>
                            <StatusBadge status={selectedRequisition.status} type="requisition" size="xs" />
                          </div>
                        </div>

                        <div className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.08] space-y-2">
                          <span className="text-[11px] font-sans uppercase tracking-wider text-zinc-400 font-semibold block">
                            Requested Hardware Components
                          </span>
                          <div className="space-y-1.5">
                            {selectedRequisition.componentsRequested?.map((comp, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs"
                              >
                                <span className="text-white font-medium">{comp.nomenclature}</span>
                                <span className="text-zinc-400 font-sans">Qty: {comp.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-3.5 bg-white/[0.02] rounded-xl border border-white/[0.08] text-[11px] text-zinc-400 space-y-1">
                          <div className="font-semibold text-white">Desk Guidance for Student Inquiry:</div>
                          <div>
                            • Inform student {selectedRequisition.studentName} that their request is waiting in the Approvals Queue for {selectedRequisition.mentorName}.
                          </div>
                          <div>
                            • Once faculty endorsement is confirmed, this requisition will automatically unlock in your "Ready for Pickup" queue.
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <form onSubmit={handleExecuteDispatch} className="space-y-4">
                      {/* Selected Requisition Summary */}
                      <div className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.08] space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-zinc-400">
                          <span>Selected Order</span>
                          <span className="font-semibold text-white">{selectedRequisition.id}</span>
                        </div>
                        <div className="text-white font-medium text-xs">
                          Requester: {selectedRequisition.studentName} ({selectedRequisition.studentPrn})
                        </div>
                        <div className="text-zinc-400 text-[11px]">
                          Project: {selectedRequisition.projectId} • Faculty: {selectedRequisition.mentorName}
                        </div>
                        <div className="pt-1.5 text-zinc-300 text-[11px]">
                          Requested: {selectedRequisition.componentsRequested?.map((c) => `${c.quantity}x ${c.nomenclature}`).join(', ')}
                        </div>
                      </div>

                      {/* Physical Asset Tag Picker */}
                      <div>
                        <label className="block text-zinc-400 text-[11px] uppercase tracking-wider font-semibold mb-1.5">
                          Allocate Physical Hardware Asset <span className="text-rose-400">*</span>
                        </label>
                        <select
                          value={selectedAssetTag}
                          onChange={(e) => setSelectedAssetTag(e.target.value)}
                          required
                          className="w-full bg-[#111317] border border-white/15 rounded-xl px-3.5 py-2.5 font-sans text-xs text-white focus:outline-none focus:border-white/30 transition-all cursor-pointer"
                        >
                          <option value="" className="bg-[#111317]">
                            -- Select physical unit from bench inventory --
                          </option>
                          {matchingAssets.map((asset) => (
                            <option key={asset.id} value={asset.assetTag} className="bg-[#111317]">
                              {asset.assetTag} — {asset.nomenclature} ({asset.coordinates})
                            </option>
                          ))}
                        </select>
                        <p className="text-[11px] text-zinc-500 mt-1">
                          {matchingAssets.length} verified available units matching this requisition.
                        </p>
                      </div>

                      {/* Loan Duration Window Selector */}
                      <div>
                        <label className="block text-zinc-400 text-[11px] uppercase tracking-wider font-semibold mb-1.5">
                          Loan Duration Window (Collegiate Term Cap)
                        </label>
                        <select
                          value={dueDateDays}
                          onChange={(e) => setDueDateDays(e.target.value)}
                          className="w-full bg-[#111317] border border-white/15 rounded-xl px-3.5 py-2.5 font-sans text-xs text-white focus:outline-none focus:border-white/30 transition-all cursor-pointer"
                        >
                          <option value="7" className="bg-[#111317]">7 Days (Standard Coursework Check)</option>
                          <option value="14" className="bg-[#111317]">14 Days (Standard Two-Week Sprint)</option>
                          <option value="21" className="bg-[#111317]">21 Days (Capstone Milestone Duration)</option>
                          <option value="30" className="bg-[#111317]">30 Days (Extended Semester Term)</option>
                        </select>
                      </div>

                      {/* Counter Verification Checklist */}
                      <div className="p-3.5 bg-white/[0.02] rounded-xl border border-white/[0.08] space-y-1.5 text-zinc-400 text-[11px]">
                        <div className="font-semibold text-white flex items-center gap-1.5 pb-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-zinc-300" />
                          <span>Counter Handover Protocols:</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-3 h-3 text-zinc-400" />
                          <span>Student collegiate photo PRN card verified at counter desk</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-3 h-3 text-zinc-400" />
                          <span>Faculty supervisor project endorsement confirmed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-3 h-3 text-zinc-400" />
                          <span>Anti-static conductive pouch & power accessories packaged</span>
                        </div>
                      </div>

                      {/* Dispatch Commit Button */}
                      <button
                        type="submit"
                        disabled={isDispatching || !selectedAssetTag}
                        className="w-full py-3 px-4 rounded-full bg-white hover:bg-neutral-200 disabled:opacity-40 disabled:hover:bg-white text-black font-semibold text-xs tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {isDispatching ? 'Committing Relational Record...' : 'Execute Counter Dispatch'}
                        </span>
                      </button>
                    </form>
                  );
                })()
              ) : (
                <div className="py-20 text-center text-zinc-500 font-sans text-xs space-y-2">
                  <Package className="w-9 h-9 mx-auto opacity-30 stroke-[1.5]" />
                  <p>Select a pre-approved requisition from the left panel to begin physical equipment dispatch.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: CHECK-IN & RETURN MODE                                            */}
      {/* ========================================================================= */}
      {terminalMode === 'checkin' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Rapid Search & Active Loan Selection (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl space-y-2.5">
              <label className="block text-[11px] font-sans uppercase tracking-wider text-zinc-400 font-semibold">
                Equipment Box Identifier / PRN Search
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={checkinSearchQuery}
                  onChange={(e) => setCheckinSearchQuery(e.target.value)}
                  placeholder="Enter Asset Tag (e.g. AT-JET-0012) or Student PRN..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl font-sans text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 transition-all"
                />
              </div>
            </div>

            {/* Active Loans List */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl space-y-2 font-sans text-xs max-h-[540px] overflow-y-auto">
              <div className="flex items-center justify-between text-zinc-400 uppercase text-[11px] font-semibold border-b border-white/[0.06] pb-2">
                <span>Active Loans in Circulation</span>
                <span className="text-white px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 font-medium">
                  {matchingReturnLoans.length}
                </span>
              </div>

              {matchingReturnLoans.length > 0 ? (
                matchingReturnLoans.map((loan) => {
                  const isSelected = selectedReturnLoan?.id === loan.id;
                  return (
                    <div
                      key={loan.id}
                      onClick={() => setSelectedReturnLoan(loan)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-white/[0.08] border-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
                          : 'bg-white/[0.02] border-white/[0.06] hover:border-white/20 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white tracking-wide">{loan.assetTag}</span>
                        <StatusBadge status={loan.status} type="due" size="xs" />
                      </div>
                      <div className="mt-1 font-medium text-xs text-white truncate">
                        {loan.nomenclature}
                      </div>
                      <div className="mt-1 text-[11px] text-zinc-400 flex justify-between">
                        <span>PRN: {loan.borrowerPrn} ({loan.borrowerName})</span>
                        <span>Due: {loan.dueDate?.split(' ')[0]}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-zinc-500 text-xs">
                  No active loans found matching query "{checkinSearchQuery}".
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Digital Condition Checklist InspectionForm (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl space-y-4">
              <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold border-b border-white/[0.06] pb-2 flex items-center gap-2 font-sans">
                <RotateCcw className="w-4 h-4 text-zinc-300" />
                <span>Physical Return Inspection & Triage Station</span>
              </div>

              {selectedReturnLoan ? (
                <InspectionForm
                  loan={selectedReturnLoan}
                  onComplete={handleCompleteInspection}
                  onCancel={() => setSelectedReturnLoan(null)}
                />
              ) : (
                <div className="py-24 text-center text-zinc-500 font-sans text-xs space-y-2">
                  <Package className="w-9 h-9 mx-auto opacity-30 stroke-[1.5]" />
                  <p>Select an active loan record from the left list to initiate return inspection.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DispatchDeskPage;
