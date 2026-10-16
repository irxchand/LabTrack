import React, { useState } from 'react';
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

  // CHECKIN STATE
  const [checkinSearchQuery, setCheckinSearchQuery] = useState('');
  const [selectedReturnLoan, setSelectedReturnLoan] = useState(null);

  // Filter approved requisitions ready for physical dispatch
  const readyRequisitions = requisitions.filter(
    (r) => r.status === 'Approved' || r.status === 'Pending Approval'
  );

  const availableRequisitionsForPrn = readyRequisitions.filter((r) => {
    if (!dispatchSearchPrn.trim()) return true;
    const query = dispatchSearchPrn.toLowerCase();
    return (
      r.studentPrn.toLowerCase().includes(query) ||
      r.studentName.toLowerCase().includes(query) ||
      r.projectId.toLowerCase().includes(query) ||
      r.id.toLowerCase().includes(query)
    );
  });

  // Filter available serialized physical assets for allocation
  const availableSerializedAssets = inventory.filter(
    (item) => item.classification === 'Asset' && item.status === 'Available'
  );

  // Filter active loans for check-in
  const matchingReturnLoans = activeLoans.filter((loan) => {
    if (!checkinSearchQuery.trim()) return true;
    const query = checkinSearchQuery.toLowerCase();
    return (
      loan.assetTag.toLowerCase().includes(query) ||
      loan.borrowerPrn.toLowerCase().includes(query) ||
      loan.borrowerName.toLowerCase().includes(query) ||
      loan.nomenclature.toLowerCase().includes(query)
    );
  });

  const handleExecuteDispatch = async (e) => {
    e.preventDefault();
    if (!selectedRequisition || !selectedAssetTag) return;
    setIsDispatching(true);

    try {
      await executeDispatch(
        selectedRequisition.id,
        selectedAssetTag,
        currentUser?.prn || 'LA-04',
        Number(dueDateDays)
      );
      setSelectedRequisition(null);
      setSelectedAssetTag('');
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
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Title & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-neural text-[10px] font-inter uppercase tracking-[0.2em] text-[#c9b8a0] mb-2">
            <Sparkles className="w-3 h-3 text-[#a78b71]" />
            <span>OPERATIONAL COUNTER TERMINAL</span>
          </div>
          <h1 className="text-2xl font-playfair font-normal italic text-white flex items-center gap-2.5">
            <Terminal className="w-6 h-6 text-[#a78b71]" />
            Lab Assistant Counter & Dispatch Terminal
          </h1>
          <p className="text-xs font-inter text-zinc-400 mt-1 max-w-2xl">
            Rapid keyboard-driven counter desk: issue approved hardware loans and execute digital check-in inspection checklists.
          </p>
        </div>

        {/* Dual Mode Switcher */}
        <div className="flex items-center p-1 rounded-full glass-neural border border-white/10">
          <button
            onClick={() => setTerminalMode('dispatch')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-inter text-xs font-semibold transition-neural ${
              terminalMode === 'dispatch'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            Mode 1: Dispatch
          </button>
          <button
            onClick={() => setTerminalMode('checkin')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-inter text-xs font-semibold transition-neural ${
              terminalMode === 'checkin'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Mode 2: Check-in / Return
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: DISPATCH DESK */}
      {/* ========================================================================= */}
      {terminalMode === 'dispatch' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Student Lookup & Endorsed Orders (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="glass-neural p-5 rounded-2xl border border-white/10 space-y-3">
              <label className="block text-xs font-inter uppercase tracking-wider text-zinc-400 font-semibold">
                Step 1: Rapid Student PRN / Project ID Lookup
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={dispatchSearchPrn}
                  onChange={(e) => setDispatchSearchPrn(e.target.value)}
                  placeholder="Type student PRN (e.g. 202401048) or Project ID..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl font-mono text-xs text-white focus:outline-none focus:border-[#a78b71] transition-neural"
                />
              </div>
              <p className="text-[11px] text-zinc-500 font-inter">
                Decoupled from barcode scanners. Enter collegiate identifier to pull pre-endorsed requisitions.
              </p>
            </div>

            {/* Endorsed Requisitions Pool */}
            <div className="glass-neural p-5 rounded-2xl border border-white/10 space-y-3 font-inter text-xs">
              <div className="flex items-center justify-between text-zinc-400 uppercase text-[11px] font-semibold border-b border-white/10 pb-2">
                <span>Pre-Approved Hardware Orders</span>
                <span className="text-emerald-400 font-bold">{availableRequisitionsForPrn.length} Ready</span>
              </div>

              {availableRequisitionsForPrn.length > 0 ? (
                <div className="space-y-3">
                  {availableRequisitionsForPrn.map((req) => (
                    <div
                      key={req.id}
                      onClick={() => setSelectedRequisition(req)}
                      className={`p-4 rounded-xl border transition-neural cursor-pointer ${
                        selectedRequisition?.id === req.id
                          ? 'bg-[#a78b71]/15 border-[#a78b71] text-white shadow-[0_0_20px_rgba(167,139,113,0.2)]'
                          : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold font-mono text-[#c9b8a0]">{req.id}</span>
                        <StatusBadge status={req.status} type="requisition" size="xs" />
                      </div>

                      <div className="mt-2 space-y-0.5">
                        <div className="text-white font-semibold">{req.studentName} ({req.studentPrn})</div>
                        <div className="text-zinc-500 text-[11px]">{req.projectId} • Mentor: {req.mentorName}</div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-white/10 flex flex-wrap gap-1.5 font-mono">
                        {req.componentsRequested.map((c, i) => (
                          <span key={i} className="px-2.5 py-0.5 rounded-full bg-white/[0.06] text-white border border-white/10 text-[11px]">
                            {c.quantity}x {c.nomenclature}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-zinc-500 text-xs">
                  No pending faculty-endorsed requisitions found for query "{dispatchSearchPrn}".
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Physical Asset Assignment & Checkout Commit (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="glass-neural p-6 rounded-2xl border border-white/10 space-y-4 font-inter text-xs">
              <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold border-b border-white/10 pb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Step 2: Physical Serialized Allocation & Checkout
              </div>

              {selectedRequisition ? (
                <form onSubmit={handleExecuteDispatch} className="space-y-4">
                  <div className="p-4 bg-white/[0.03] rounded-xl border border-white/10 space-y-1.5">
                    <div className="text-zinc-500 text-[11px]">Selected Order:</div>
                    <div className="text-white font-bold font-mono text-sm">{selectedRequisition.id}</div>
                    <div className="text-zinc-400 text-[11px]">
                      Requester: {selectedRequisition.studentName} • {selectedRequisition.projectId}
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-[11px] uppercase tracking-wider font-semibold mb-1.5">
                      Select Physical Asset Tag From Counter Tray <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={selectedAssetTag}
                      onChange={(e) => setSelectedAssetTag(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5 font-mono text-xs text-white focus:outline-none focus:border-[#a78b71] transition-neural"
                    >
                      <option value="" className="bg-[#0a0a0a]">-- Choose verified bench hardware --</option>
                      {availableSerializedAssets.map((asset) => (
                        <option key={asset.id} value={asset.assetTag} className="bg-[#0a0a0a]">
                          {asset.assetTag} — {asset.nomenclature} ({asset.coordinates})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-[11px] uppercase tracking-wider font-semibold mb-1.5">
                      Loan Duration Window (Academic Term Cap)
                    </label>
                    <select
                      value={dueDateDays}
                      onChange={(e) => setDueDateDays(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5 font-mono text-xs text-white focus:outline-none focus:border-[#a78b71] transition-neural"
                    >
                      <option value="7" className="bg-[#0a0a0a]">7 Days (Standard Coursework Check)</option>
                      <option value="14" className="bg-[#0a0a0a]">14 Days (Standard Two-Week Term Sprint)</option>
                      <option value="21" className="bg-[#0a0a0a]">21 Days (Capstone Milestone Duration)</option>
                    </select>
                  </div>

                  <div className="p-3.5 bg-white/[0.02] rounded-xl border border-white/10 space-y-1 text-zinc-400 text-[11px]">
                    <div className="font-semibold text-white">Counter Verification Checklist:</div>
                    <div>✓ Student photo PRN checked at counter desk</div>
                    <div>✓ Faculty supervisor endorsement verified in system</div>
                    <div>✓ Anti-static bag and power accessories inspected</div>
                  </div>

                  <button
                    type="submit"
                    disabled={isDispatching || !selectedAssetTag}
                    className="w-full py-3 px-4 rounded-full bg-white hover:bg-[#e8d5b7] disabled:opacity-50 text-black font-inter font-bold text-xs uppercase tracking-wider transition-neural flex items-center justify-center gap-2 shadow-lg"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isDispatching ? 'Committing Relational Record...' : 'Execute Counter Dispatch'}
                  </button>
                </form>
              ) : (
                <div className="py-14 text-center text-zinc-500 font-inter text-xs">
                  Select a pre-approved requisition from the left panel to begin physical equipment dispatch.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: CHECK-IN & RETURN MODE */}
      {/* ========================================================================= */}
      {terminalMode === 'checkin' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Rapid Search & Active Loan Selection (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-neural p-5 rounded-2xl border border-white/10 space-y-3">
              <label className="block text-xs font-inter uppercase tracking-wider text-zinc-400 font-semibold">
                Equipment Box Identifier / PRN Search
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={checkinSearchQuery}
                  onChange={(e) => setCheckinSearchQuery(e.target.value)}
                  placeholder="Enter Asset Tag (e.g. AT-JET-0012) or Student PRN..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl font-mono text-xs text-white focus:outline-none focus:border-[#a78b71] transition-neural"
                />
              </div>
            </div>

            {/* Active Loans List */}
            <div className="glass-neural p-5 rounded-2xl border border-white/10 space-y-2 font-inter text-xs max-h-[500px] overflow-y-auto">
              <div className="text-zinc-500 text-[11px] uppercase tracking-wider font-semibold border-b border-white/10 pb-2">
                Active Loans in Circulation ({matchingReturnLoans.length})
              </div>

              {matchingReturnLoans.map((loan) => (
                <div
                  key={loan.id}
                  onClick={() => setSelectedReturnLoan(loan)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-neural ${
                    selectedReturnLoan?.id === loan.id
                      ? 'bg-[#a78b71]/15 border-[#a78b71] text-white shadow-sm'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-mono text-[#c9b8a0]">{loan.assetTag}</span>
                    <StatusBadge status={loan.status} type="due" size="xs" />
                  </div>
                  <div className="mt-1 font-inter text-xs text-white font-medium truncate">
                    {loan.nomenclature}
                  </div>
                  <div className="mt-1 text-[11px] text-zinc-500 font-mono flex justify-between">
                    <span>PRN: {loan.borrowerPrn} ({loan.borrowerName})</span>
                    <span>Due: {loan.dueDate?.split(' ')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Digital Condition Checklist InspectionForm (7 cols) */}
          <div className="lg:col-span-7">
            <div className="glass-neural p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold border-b border-white/10 pb-2 flex items-center gap-2 font-inter">
                <RotateCcw className="w-4 h-4 text-[#a78b71]" />
                Physical Inspection & Return Triage Desk
              </div>

              {selectedReturnLoan ? (
                <InspectionForm
                  loan={selectedReturnLoan}
                  onComplete={handleCompleteInspection}
                  onCancel={() => setSelectedReturnLoan(null)}
                />
              ) : (
                <div className="py-20 text-center text-zinc-500 font-inter text-xs space-y-2">
                  <Package className="w-8 h-8 mx-auto opacity-30 stroke-[1.5]" />
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
