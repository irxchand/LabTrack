import React, { useState, useMemo } from 'react';
import { useLabData } from '../../context/LabDataContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';
import {
  Inbox,
  ShoppingBag,
  ArrowRight,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';
import { isRequisitionMentoredByUser } from '../../utils/facultyAuth';

export function RequisitionsPage() {
  const { requisitions, setIsBasketOpen, inventory } = useLabData();
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

  // Resolve authentic hardware image from inventory or fallback catalog
  const getItemImage = (comp) => {
    if (!comp) return '/images/hardware/raspberry-pi-5.jpg';
    if (comp.image) return comp.image;

    const match = inventory?.find(
      (i) =>
        i.id === comp.itemId ||
        i.assetTag === comp.itemId ||
        (i.nomenclature && comp.nomenclature && (
          i.nomenclature.toLowerCase().includes(comp.nomenclature.toLowerCase()) ||
          comp.nomenclature.toLowerCase().includes(i.nomenclature.toLowerCase())
        ))
    );
    if (match?.image) return match.image;

    const nom = comp.nomenclature?.toLowerCase() || '';
    if (nom.includes('oled') || nom.includes('display')) return '/images/hardware/oled-display.jpg';
    if (nom.includes('jetson') || nom.includes('orin') || nom.includes('nano')) return '/images/hardware/jetson-nano.jpg';
    if (nom.includes('arduino') || nom.includes('uno')) return '/images/hardware/arduino-uno-r3.jpg';
    if (nom.includes('esp32') || nom.includes('micro') || nom.includes('mcu')) return '/images/hardware/esp32-wroom.jpg';
    if (nom.includes('oscilloscope') || nom.includes('rigol')) return '/images/hardware/oscilloscope.jpg';
    if (nom.includes('jumper') || nom.includes('wire') || nom.includes('ribbon')) return '/images/hardware/jumper-wires.jpg';
    if (nom.includes('breadboard')) return '/images/hardware/breadboard-830.jpg';
    if (nom.includes('sensor') || nom.includes('imu') || nom.includes('mpu') || nom.includes('bmp')) return '/images/hardware/bmp280-sensor.jpg';
    if (nom.includes('resistor')) return '/images/hardware/resistors-pack.jpg';
    return '/images/hardware/raspberry-pi-5.jpg';
  };

  // Filter based on role
  const roleRequisitions = useMemo(() => {
    if (role === 'Student') {
      return requisitions.filter((r) => r.studentPrn === currentUser?.prn);
    }
    if (role === 'Faculty') {
      return requisitions.filter((r) => isRequisitionMentoredByUser(r, currentUser));
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

  const getStageInfo = (status) => {
    switch (status) {
      case 'Submitted':
        return { index: 1, label: 'Awaiting Faculty Review', color: 'champagne' };
      case 'Faculty Endorsed':
        return { index: 2, label: 'Faculty Endorsed • Staging', color: 'emerald' };
      case 'Ready for Counter Pickup':
        return { index: 3, label: 'Ready for Pickup (Desk 2)', color: 'champagne' };
      case 'Dispatched':
        return { index: 4, label: 'Dispatched & In Custody', color: 'white' };
      case 'Rejected':
        return { index: 0, label: 'Rejected by Supervisor', color: 'rose' };
      default:
        return { index: 1, label: status, color: 'zinc' };
    }
  };

  const stages = [
    { num: 1, name: 'Submitted' },
    { num: 2, name: 'Endorsed' },
    { num: 3, name: 'Staged' },
    { num: 4, name: 'Dispatched' },
  ];

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#c9b8a0]">
            Orders & Requests
          </span>
          <h1 className="text-3xl font-bold tracking-[-0.025em] text-white mt-1 font-display">
            Requisitions
          </h1>
          <p className="text-[13px] text-zinc-400 mt-1 font-normal">
            Track hardware requests through faculty approval and counter pickup.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsBasketOpen(true)}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-[#c9b8a0] via-[#e2d2bc] to-[#f5e6c8] hover:opacity-95 text-black font-semibold text-xs tracking-wide transition-all shadow-[0_0_15px_rgba(201,184,160,0.3)] flex items-center gap-2 cursor-pointer active:scale-95 flex-shrink-0"
        >
          <ShoppingBag className="w-4 h-4 text-black stroke-[2.5]" />
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
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-sans font-medium ${activeFilter === 'all' ? 'bg-black/10 text-black font-bold' : 'bg-white/10 text-zinc-300'}`}>
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
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-sans font-medium ${activeFilter === 'submitted' ? 'bg-black/10 text-black font-bold' : 'bg-white/10 text-zinc-300'}`}>
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
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-sans font-medium ${activeFilter === 'ready' ? 'bg-black/10 text-black font-bold' : 'bg-white/10 text-zinc-300'}`}>
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
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-sans font-medium ${activeFilter === 'dispatched' ? 'bg-black/10 text-black font-bold' : 'bg-white/10 text-zinc-300'}`}>
            {counts.dispatched}
          </span>
        </button>
      </div>

      {/* Orders Grid */}
      {filteredRequisitions.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-zinc-500 shadow-inner">
            <Inbox className="w-7 h-7 stroke-[1.5]" />
          </div>
          <h3 className="font-display text-lg font-bold text-white">No Requisitions Found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto font-sans leading-relaxed">
            No hardware orders match the selected filter.
          </p>
          <button
            type="button"
            onClick={() => setIsBasketOpen(true)}
            className="mt-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#c9b8a0] via-[#e2d2bc] to-[#f5e6c8] text-black font-semibold text-xs transition-all shadow-[0_0_15px_rgba(201,184,160,0.3)] cursor-pointer"
          >
            Draft Requisition
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredRequisitions.map((req) => {
            const stageInfo = getStageInfo(req.status);
            const isRejected = req.status === 'Rejected';
            const allItems = req.componentsRequested || [];

            return (
              <div
                key={req.id}
                onClick={() => setSelectedReq(req)}
                className="rounded-2xl p-5 bg-[#121316]/90 border border-white/10 hover:border-white/20 transition-all duration-200 shadow-lg flex flex-col justify-between space-y-4 cursor-pointer"
              >
                {/* Row 1: Header with Order ID & Status */}
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm tracking-wide font-sans">
                      {req.id}
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-xs text-zinc-400 font-sans">
                      {formatHumanDate(req.requestDate)}
                    </span>
                  </div>

                  {/* Status Pill */}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1.5 border ${
                      stageInfo.color === 'emerald'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25'
                        : stageInfo.color === 'rose'
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/25'
                        : stageInfo.color === 'white'
                        ? 'bg-white/10 text-white border-white/20'
                        : 'bg-[#c9b8a0]/15 text-[#f5e6c8] border-[#c9b8a0]/30'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        stageInfo.color === 'emerald'
                          ? 'bg-emerald-400'
                          : stageInfo.color === 'rose'
                          ? 'bg-rose-400'
                          : stageInfo.color === 'white'
                          ? 'bg-white'
                          : 'bg-[#f5e6c8]'
                      }`}
                    />
                    <span>{stageInfo.label}</span>
                  </span>
                </div>

                {/* Row 2: Requested Items List */}
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {allItems.map((comp, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10 flex items-center gap-2.5"
                      >
                        <div className="w-9 h-9 rounded-lg bg-black/60 border border-white/10 p-1 flex items-center justify-center flex-shrink-0">
                          <img
                            src={getItemImage(comp)}
                            alt={comp.nomenclature}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              e.target.src = '/images/hardware/raspberry-pi-5.jpg';
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-medium text-white truncate">
                            {comp.nomenclature}
                          </div>
                          <div className="text-[11px] text-[#f5e6c8] font-semibold mt-0.5">
                            Qty {comp.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Row 3: Stated Purpose (clean 1-line quote) */}
                  {req.technicalPurpose && (
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed line-clamp-1 italic px-0.5">
                      "{req.technicalPurpose}"
                    </p>
                  )}
                </div>

                {/* Row 4: Circulation Stepper */}
                {isRejected ? (
                  <div className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-sans flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-rose-400" />
                    <span className="truncate">Rejected: {req.supervisorNotes || 'Declined during review.'}</span>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-sans text-zinc-400">
                      <span>Timeline</span>
                      <span className="text-zinc-300 font-medium">Stage {stageInfo.index} of 4</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {stages.map((st) => {
                        const isCompleted = st.num <= stageInfo.index;
                        const isCurrent = st.num === stageInfo.index;
                        return (
                          <div key={st.name} className="space-y-1 text-center">
                            <div
                              className={`h-1 rounded-full transition-all duration-300 ${
                                isCompleted
                                  ? isCurrent
                                    ? 'bg-[#c9b8a0] shadow-[0_0_8px_rgba(201,184,160,0.8)]'
                                    : 'bg-white'
                                  : 'bg-white/10'
                              }`}
                            />
                            <span
                              className={`text-[10px] font-sans block truncate ${
                                isCurrent
                                  ? 'text-[#f5e6c8] font-semibold'
                                  : isCompleted
                                  ? 'text-zinc-300'
                                  : 'text-zinc-600'
                              }`}
                            >
                              {st.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Row 5: Footer with Mentor & Dossier CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs font-sans">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-white/[0.08] border border-white/10 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {(req.mentorName?.replace('Dr. ', '').replace('Prof. ', '') || 'M').charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-white font-medium text-xs truncate">
                        {req.mentorName || 'Faculty Mentor'}
                      </div>
                      <div className="text-zinc-500 text-[10px]">
                        Group {req.projectId}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedReq(req);
                    }}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.08] hover:bg-white text-zinc-300 hover:text-black border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 flex-shrink-0"
                  >
                    <span>Dossier</span>
                    <ArrowRight className="w-3 h-3" />
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
        subtitle={`Submitted by ${selectedReq?.studentName} • Group ${selectedReq?.projectId}`}
      >
        {selectedReq && (
          <div className="space-y-6 text-xs font-sans">
            {/* Stated Purpose */}
            <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/10 space-y-2">
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
                <span className="font-sans text-zinc-400">{selectedReq.courseCode}</span>
              </div>
            </div>

            {/* Hardware Manifest with Real Thumbnails */}
            <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/10 space-y-3">
              <div className="text-[10px] font-sans uppercase tracking-wider text-zinc-500 font-semibold">
                Authorized Hardware Manifest ({selectedReq.componentsRequested.length} items)
              </div>
              <div className="divide-y divide-white/5">
                {selectedReq.componentsRequested.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 relative flex-shrink-0 bg-black shadow-sm">
                        <img
                          src={getItemImage(item)}
                          alt={item.nomenclature}
                          className="w-full h-full object-cover object-center"
                          onError={(e) => {
                            e.target.src = '/images/hardware/raspberry-pi-5.jpg';
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-white font-semibold text-sm truncate">{item.nomenclature}</div>
                        <div className="text-zinc-400 font-sans text-xs mt-0.5">Classification: {item.type}</div>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-white text-black font-sans font-semibold text-xs shadow-sm flex-shrink-0">
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

              <div className="relative pl-7 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                {selectedReq.timeline.map((step, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <span className="absolute -left-7 top-0.5 w-5 h-5 rounded-full bg-[#c9b8a0] text-black flex items-center justify-center text-[10px] font-bold shadow-md">
                      {idx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white font-sans text-xs">{step.step}</span>
                      <span className="text-[11px] text-zinc-500 font-sans">• {formatHumanDateTime(step.timestamp)}</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 font-sans">Recorded by: {step.actor}</div>
                    {step.note && (
                      <div className="text-zinc-300 bg-white/[0.03] p-3 rounded-xl border border-white/10 mt-1 text-xs leading-relaxed">
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
                className="px-6 py-2 rounded-full bg-white hover:bg-[#f5e6c8] text-black text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
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
