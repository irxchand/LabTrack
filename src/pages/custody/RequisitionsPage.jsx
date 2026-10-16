import React, { useState, useMemo } from 'react';
import { useLabData } from '../../context/LabDataContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Inbox, ShoppingBag, ArrowRight, Check, AlertCircle } from 'lucide-react';

export function RequisitionsPage() {
  const { requisitions, setIsBasketOpen } = useLabData();
  const { currentUser, role } = useAuth();
  const [selectedReq, setSelectedReq] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const formatHumanDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr.replace(' ', 'T'));
      if (isNaN(d.getTime())) return dateStr.split(' ')[0] || dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const formatHumanDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr.replace(' ', 'T'));
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // Filter based on role
  const roleRequisitions = useMemo(() => {
    if (role === 'Student') {
      return requisitions.filter((r) => r.studentPrn === currentUser?.prn);
    }
    if (role === 'Faculty') {
      return requisitions.filter(
        (r) => r.mentorId === currentUser?.prn || r.mentorName === currentUser?.name
      );
    }
    return requisitions;
  }, [requisitions, role, currentUser]);

  const counts = useMemo(() => ({
    all: roleRequisitions.length,
    submitted: roleRequisitions.filter((r) => r.status === 'Submitted').length,
    ready: roleRequisitions.filter(
      (r) => r.status === 'Ready for Counter Pickup' || r.status === 'Faculty Endorsed'
    ).length,
    dispatched: roleRequisitions.filter((r) => r.status === 'Dispatched').length,
  }), [roleRequisitions]);

  const filteredRequisitions = useMemo(() => {
    if (activeFilter === 'submitted') {
      return roleRequisitions.filter((r) => r.status === 'Submitted');
    }
    if (activeFilter === 'ready') {
      return roleRequisitions.filter(
        (r) => r.status === 'Ready for Counter Pickup' || r.status === 'Faculty Endorsed'
      );
    }
    if (activeFilter === 'dispatched') {
      return roleRequisitions.filter((r) => r.status === 'Dispatched');
    }
    return roleRequisitions;
  }, [roleRequisitions, activeFilter]);

  const getStageIndex = (status) => {
    switch (status) {
      case 'Submitted':
        return 1;
      case 'Faculty Endorsed':
        return 2;
      case 'Ready for Counter Pickup':
        return 3;
      case 'Dispatched':
        return 4;
      default:
        return 1;
    }
  };

  const stages = ['Submitted', 'Endorsed', 'Staged', 'Dispatched'];

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="text-[11px] font-sans font-medium text-zinc-400 tracking-wide uppercase">
            ORDERS & ENDORSEMENTS
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white mt-1">
            Requisitions
          </h1>
          <p className="text-sm font-sans text-zinc-400 mt-1 max-w-xl">
            Track hardware orders moving through faculty mentor endorsement, counter staging, and dispatch handover.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsBasketOpen(true)}
          className="px-4 py-2 rounded-full bg-white hover:bg-[#f5e6c8] text-black font-semibold text-xs tracking-wide transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95 flex-shrink-0"
        >
          <ShoppingBag className="w-4 h-4 text-black" />
          <span>Draft Requisition</span>
        </button>
      </div>

      {/* Segmented Filter Pills */}
      <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.04] border border-white/10 w-fit backdrop-blur-md">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'all'
              ? 'bg-white text-black font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <span>All</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeFilter === 'all' ? 'bg-black/10 text-black font-bold' : 'bg-white/10 text-zinc-300'}`}>
            {counts.all}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('submitted')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'submitted'
              ? 'bg-white text-black font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <span>Awaiting Review</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeFilter === 'submitted' ? 'bg-black/10 text-black font-bold' : 'bg-white/10 text-zinc-300'}`}>
            {counts.submitted}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('ready')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'ready'
              ? 'bg-white text-black font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <span>Ready for Pickup</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeFilter === 'ready' ? 'bg-black/10 text-black font-bold' : 'bg-white/10 text-zinc-300'}`}>
            {counts.ready}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('dispatched')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'dispatched'
              ? 'bg-white text-black font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <span>Dispatched</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeFilter === 'dispatched' ? 'bg-black/10 text-black font-bold' : 'bg-white/10 text-zinc-300'}`}>
            {counts.dispatched}
          </span>
        </button>
      </div>

      {/* Orders Grid */}
      {filteredRequisitions.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-zinc-500">
            <Inbox className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h3 className="font-display text-lg font-semibold text-white">No Requisitions Found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto font-sans leading-relaxed">
            No hardware orders match the selected filter. Browse the Workstation catalog to stage components into your requisition kit.
          </p>
          <button
            type="button"
            onClick={() => setIsBasketOpen(true)}
            className="mt-2 px-4 py-2 rounded-full bg-white hover:bg-[#f5e6c8] text-black font-semibold text-xs transition-all shadow-sm cursor-pointer"
          >
            Draft Requisition
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredRequisitions.map((req) => {
            const currentStage = getStageIndex(req.status);
            const isRejected = req.status === 'Rejected';

            return (
              <div
                key={req.id}
                onClick={() => setSelectedReq(req)}
                className="rounded-2xl p-6 bg-white/[0.025] hover:bg-white/[0.04] border border-white/10 transition-all backdrop-blur-md flex flex-col justify-between group cursor-pointer shadow-sm space-y-5"
              >
                {/* Header Row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-white group-hover:text-[#f5e6c8] transition-colors">
                      {req.id}
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-xs text-zinc-400 font-sans">
                      Requested {formatHumanDate(req.requestDate)}
                    </span>
                  </div>

                  <StatusBadge status={req.status} type="requisition" size="sm" />
                </div>

                {/* Stated Purpose */}
                <p className="text-sm font-sans text-zinc-300 leading-relaxed italic line-clamp-2">
                  "{req.technicalPurpose}"
                </p>

                {/* Manifest Component Chips */}
                <div className="space-y-2">
                  <div className="text-[10px] font-sans uppercase tracking-wider text-zinc-500 font-semibold">
                    Requested Manifest ({req.componentsRequested.length} {req.componentsRequested.length === 1 ? 'item' : 'items'})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {req.componentsRequested.map((item, idx) => (
                      <div
                        key={idx}
                        className="px-2.5 py-1 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-sans text-zinc-300 flex items-center gap-1.5"
                      >
                        <span className="font-mono font-bold text-white text-[11px]">
                          {item.quantity}x
                        </span>
                        <span className="truncate max-w-[190px]">{item.nomenclature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progression Stepper */}
                {isRejected ? (
                  <div className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-sans flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Order rejected by supervisor: {req.supervisorNotes || 'Review feedback required.'}</span>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-sans text-zinc-500">
                      <span>Order Progression</span>
                      <span className="text-zinc-400 font-medium">Stage {currentStage} of 4</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 items-center">
                      {stages.map((stageName, idx) => {
                        const stageNumber = idx + 1;
                        const isCompleted = stageNumber <= currentStage;
                        const isCurrent = stageNumber === currentStage;

                        return (
                          <div key={stageName} className="space-y-1 text-center">
                            <div
                              className={`h-1 rounded-full transition-all duration-300 ${
                                isCompleted
                                  ? isCurrent
                                    ? 'bg-[#c9b8a0]'
                                    : 'bg-white'
                                  : 'bg-white/10'
                              }`}
                            />
                            <span
                              className={`text-[10px] font-sans block truncate ${
                                isCurrent
                                  ? 'text-white font-medium'
                                  : isCompleted
                                  ? 'text-zinc-400'
                                  : 'text-zinc-600'
                              }`}
                            >
                              {stageName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Footer Strip */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-sans">
                  <div className="text-zinc-400 truncate max-w-[220px]">
                    <span className="text-white font-medium">{req.mentorName}</span>
                    <span className="text-zinc-600 mx-1.5">•</span>
                    <span className="font-mono text-zinc-500 text-[11px]">{req.projectId}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedReq(req);
                    }}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/[0.04] group-hover:bg-white text-zinc-300 group-hover:text-black border border-white/10 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Requisition Dossier Modal */}
      <Modal
        isOpen={!!selectedReq}
        onClose={() => setSelectedReq(null)}
        title={`Requisition Dossier: ${selectedReq?.id}`}
        subtitle={`Submitted by ${selectedReq?.studentName} • ${selectedReq?.projectId}`}
      >
        {selectedReq && (
          <div className="space-y-5 text-xs font-sans">
            {/* Stated Purpose */}
            <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/10 space-y-1.5">
              <div className="text-[10px] font-sans uppercase tracking-wider text-zinc-500 font-semibold">
                Stated Technical Purpose
              </div>
              <p className="text-zinc-200 text-sm leading-relaxed italic">
                "{selectedReq.technicalPurpose}"
              </p>
              <div className="pt-2 flex items-center gap-2 text-zinc-400 text-xs">
                <span>Endorsing Faculty:</span>
                <span className="text-white font-medium">{selectedReq.mentorName}</span>
                <span className="text-zinc-600">•</span>
                <span className="font-mono text-zinc-500">{selectedReq.courseCode}</span>
              </div>
            </div>

            {/* Hardware Manifest */}
            <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/10 space-y-3">
              <div className="text-[10px] font-sans uppercase tracking-wider text-zinc-500 font-semibold">
                Authorized Hardware Manifest
              </div>
              <div className="divide-y divide-white/5">
                {selectedReq.componentsRequested.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-white font-medium">{item.nomenclature}</div>
                      <div className="text-zinc-500 font-mono text-[11px] mt-0.5">Classification: {item.type}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 font-mono text-white font-semibold">
                      {item.quantity} Unit(s)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lifecycle Audit Timeline */}
            <div className="space-y-3">
              <div className="text-[10px] font-sans uppercase tracking-wider text-zinc-400 font-semibold">
                Audit Timeline Progression
              </div>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                {selectedReq.timeline.map((step, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-[#c9b8a0] text-black flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white font-sans text-xs">{step.step}</span>
                      <span className="text-[11px] text-zinc-500 font-sans">• {formatHumanDateTime(step.timestamp)}</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 font-sans">Recorded by: {step.actor}</div>
                    {step.note && (
                      <div className="text-zinc-300 bg-white/[0.03] p-2.5 rounded-xl border border-white/10 mt-1 text-xs leading-relaxed">
                        "{step.note}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setSelectedReq(null)}
                className="px-5 py-2 rounded-full bg-white hover:bg-[#f5e6c8] text-black text-xs font-semibold transition-all cursor-pointer shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default RequisitionsPage;
