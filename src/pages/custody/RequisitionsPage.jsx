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

  const getStageInfo = (status) => {
    switch (status) {
      case 'Submitted':
        return { index: 1, label: 'Awaiting Faculty Review', color: 'amber' };
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
          <div className="text-[11px] font-sans font-medium text-zinc-400 tracking-wide uppercase">
            ORDERS & ALLOCATIONS
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

      {/* Apple Store Orders Grid */}
      {filteredRequisitions.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-zinc-500 shadow-inner">
            <Inbox className="w-7 h-7 stroke-[1.5]" />
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRequisitions.map((req) => {
            const stageInfo = getStageInfo(req.status);
            const isRejected = req.status === 'Rejected';
            const primaryItem = req.componentsRequested?.[0] || { nomenclature: 'Hardware Component', quantity: 1, type: 'Asset' };
            const additionalItems = req.componentsRequested?.slice(1) || [];
            const primaryImage = getItemImage(primaryItem);

            return (
              <div
                key={req.id}
                onClick={() => setSelectedReq(req)}
                className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-[#141417]/95 via-[#0e0e11]/90 to-[#0a0a0c]/95 border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-xl flex flex-col justify-between group cursor-pointer shadow-[0_10px_35px_rgba(0,0,0,0.6)] hover:shadow-[0_15px_45px_rgba(0,0,0,0.8)] space-y-6 overflow-hidden"
              >
                {/* Specular Edge Highlight */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

                {/* Top Status & SKU Strip */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-sans font-semibold text-zinc-200 group-hover:text-white transition-colors">
                      {req.id}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-zinc-600" />
                    <span className="text-xs text-zinc-400 font-sans">
                      Requested {formatHumanDate(req.requestDate)}
                    </span>
                  </div>

                  {/* Vibrant Cupertino Status Pill */}
                  {stageInfo.color === 'amber' && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/25 flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <span>{stageInfo.label}</span>
                    </span>
                  )}
                  {stageInfo.color === 'emerald' && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/[0.08] text-white border border-white/15 flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c9b8a0]" />
                      <span>{stageInfo.label}</span>
                    </span>
                  )}
                  {stageInfo.color === 'champagne' && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#c9b8a0]/20 text-[#f5e6c8] border border-[#c9b8a0]/40 flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f5e6c8] animate-ping" />
                      <span>{stageInfo.label}</span>
                    </span>
                  )}
                  {stageInfo.color === 'white' && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/[0.08] text-white border border-white/15 flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      <span>{stageInfo.label}</span>
                    </span>
                  )}
                  {stageInfo.color === 'rose' && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      <span>{stageInfo.label}</span>
                    </span>
                  )}
                </div>

                {/* Primary Hardware Showcase (Hero Staging with Studio Image) */}
                <div className="flex items-center gap-5 pt-1">
                  {/* Studio Hardware Pedestal */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-black/60 border border-white/10 p-3 flex items-center justify-center relative flex-shrink-0 shadow-inner group-hover:border-white/25 transition-all">
                    <img
                      src={primaryImage}
                      alt={primaryItem.nomenclature}
                      className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '/images/hardware/raspberry-pi-5.jpg';
                      }}
                    />
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-white text-black font-sans font-bold text-[10px] shadow-md">
                      {primaryItem.quantity}x
                    </span>
                  </div>

                  {/* Component Metadata & Purpose */}
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-sans text-[#c9b8a0] font-semibold uppercase tracking-wider">
                        {primaryItem.type || 'Hardware Asset'}
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-[11px] font-sans text-zinc-400">
                        Aiming for AIML Lab
                      </span>
                    </div>

                    <h3 className="font-display text-base sm:text-lg font-semibold text-white tracking-tight group-hover:text-[#f5e6c8] transition-colors leading-snug">
                      {primaryItem.nomenclature}
                    </h3>

                    {/* Stated Purpose in Refined Glass Badge */}
                    <div className="mt-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-zinc-300 font-sans italic leading-relaxed">
                      "{req.technicalPurpose}"
                    </div>
                  </div>
                </div>

                {/* Additional Requested Items Strip (If Any) */}
                {additionalItems.length > 0 && (
                  <div className="pt-2 border-t border-white/5 space-y-1.5">
                    <div className="text-[10px] font-sans uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-[#c9b8a0]" />
                      <span>Additional Staged Components ({additionalItems.length})</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {additionalItems.map((subItem, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-zinc-300 font-sans shadow-sm"
                        >
                          <img
                            src={getItemImage(subItem)}
                            alt=""
                            className="w-4 h-4 object-contain rounded flex-shrink-0"
                          />
                          <span className="font-sans font-bold text-white text-[11px]">{subItem.quantity}x</span>
                          <span className="truncate max-w-[200px]">{subItem.nomenclature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tactile Progression Stepper */}
                {isRejected ? (
                  <div className="px-4 py-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-sans flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                    <span>Supervisor Feedback: {req.supervisorNotes || 'Requisition declined during review.'}</span>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-white/5 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] font-sans">
                      <span className="text-zinc-500">Circulation Timeline</span>
                      <span className="text-zinc-300 font-medium">Stage {stageInfo.index} of 4 • {stageInfo.label}</span>
                    </div>

                    {/* Apple Segmented Progress Bar */}
                    <div className="grid grid-cols-4 gap-2">
                      {stages.map((st) => {
                        const isCompleted = st.num <= stageInfo.index;
                        const isCurrent = st.num === stageInfo.index;

                        return (
                          <div key={st.name} className="space-y-1.5 text-center">
                            <div
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                isCompleted
                                  ? isCurrent
                                    ? 'bg-[#c9b8a0] shadow-[0_0_12px_rgba(201,184,160,0.6)]'
                                    : 'bg-white'
                                  : 'bg-white/10'
                              }`}
                            />
                            <span
                              className={`text-[10px] font-sans block truncate ${
                                isCurrent
                                  ? 'text-white font-semibold'
                                  : isCompleted
                                  ? 'text-zinc-400'
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

                {/* Footer Strip with Mentor Monogram and Action */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-sans">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500/25 to-blue-500/15 border border-indigo-500/30 text-indigo-200 font-semibold text-xs flex items-center justify-center shadow-sm flex-shrink-0">
                      {(req.mentorName?.replace('Dr. ', '').replace('Prof. ', '') || 'A').charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-medium text-xs font-sans truncate max-w-[170px] sm:max-w-[220px]">
                        {req.mentorName}
                      </div>
                      <div className="text-zinc-400 font-sans text-[11px] flex items-center gap-1.5 mt-0.5">
                        <span className="text-zinc-500 font-normal">Faculty Guide</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-700" />
                        <span className="text-zinc-300 font-medium">Group {req.projectId}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedReq(req);
                    }}
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-white hover:bg-[#f5e6c8] text-black transition-all flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95 flex-shrink-0"
                  >
                    <span>Order Dossier</span>
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
                      <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/10 p-1.5 flex items-center justify-center flex-shrink-0 shadow-inner">
                        <img
                          src={getItemImage(item)}
                          alt={item.nomenclature}
                          className="max-h-full max-w-full object-contain"
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
