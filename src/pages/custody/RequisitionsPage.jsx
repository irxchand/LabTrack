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
  Bell,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  Trash2,
} from 'lucide-react';

export function RequisitionsPage() {
  const { requisitions, setIsBasketOpen, inventory, deleteRequisition } = useLabData();
  const { currentUser, role } = useAuth();
  const [selectedReq, setSelectedReq] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showNotificationSection, setShowNotificationSection] = useState(true);

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
    if (nom.includes('mpu') || nom.includes('imu') || nom.includes('gyro') || nom.includes('accelerometer')) return '/images/hardware/mpu6050-sensor.jpg';
    if (nom.includes('sensor') || nom.includes('bmp')) return '/images/hardware/bmp280-sensor.jpg';
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

  const handleCancelRequisition = async (reqId) => {
    if (window.confirm(`Are you sure you want to cancel and delete requisition ${reqId}? This action cannot be undone.`)) {
      await deleteRequisition(reqId);
      if (selectedReq && (selectedReq.id === reqId || selectedReq.requestNumber === reqId)) {
        setSelectedReq(null);
      }
    }
  };

  const isReturnedStatus = (status) => {
    const s = String(status || '').trim().toLowerCase();
    return s.includes('return') || s.includes('restock') || s.includes('closed') || s.includes('complete');
  };

  const isPendingStatus = (status) => {
    const s = String(status || '').trim().toLowerCase();
    return (s.includes('pending') || s.includes('submit') || s.includes('review')) && !isReturnedStatus(s);
  };

  const isReadyStatus = (status) => {
    const s = String(status || '').trim().toLowerCase();
    return (s.includes('ready') || s.includes('endorsed') || s.includes('staging') || s.includes('pickup')) && !s.includes('reject') && !isReturnedStatus(s);
  };

  const isDispatchedStatus = (status) => {
    const s = String(status || '').trim().toLowerCase();
    return (s.includes('dispatch') || s.includes('custody')) && !isReturnedStatus(s);
  };

  const isRejectedStatus = (status) => {
    const s = String(status || '').trim().toLowerCase();
    return s.includes('reject');
  };

  const getNormalizedTimeline = (req) => {
    if (!req) return [];
    const tl = Array.isArray(req.timeline) ? [...req.timeline] : [];
    const isReturned = isReturnedStatus(req.status);
    const isDispatched = req.status === 'Dispatched' || isDispatchedStatus(req.status) || isReturned;
    const isEndorsed = req.status === 'Faculty Endorsed' || req.status === 'Ready for Counter Pickup' || isDispatched;
    const isHodSanctioned = req.status === 'Ready for Counter Pickup' || isDispatched || Boolean(req.hodSanctionedBy);

    const mapped = tl.map((step) => {
      const stepLower = (step.step || '').toLowerCase();
      const stageLower = (step.stage || '').toLowerCase();

      if (stepLower.includes('mentor') || stageLower.includes('mentor') || stepLower.includes('faculty')) {
        if (isEndorsed) {
          return {
            ...step,
            completed: true,
            actor: step.actor && !step.actor.includes('N/A') ? step.actor : `${req.mentorName || 'Dr. Manoj Patil'} (${req.mentorId || 'T100460'})`,
            timestamp: step.timestamp || req.requestDate || new Date().toISOString(),
            note: step.note || req.supervisorNotes || 'Approved by Dr. Manoj Patil for departmental coursework milestones.',
          };
        }
      }

      if (stepLower.includes('hod') || stageLower.includes('hod')) {
        if (isHodSanctioned) {
          return {
            ...step,
            completed: true,
            actor: step.actor && !step.actor.includes('N/A') ? step.actor : `${req.hodSanctionedBy || 'Dr. Sumit Kumar (HoD)'} (T100101)`,
            timestamp: step.timestamp || req.requestDate || new Date().toISOString(),
            note: step.note || req.hodSanctionedNotes || 'Department allocation sanctioned by HoD. Passed to Counter Desk. — Endorsed by Dr. Sumit Kumar.',
          };
        }
      }

      if (stepLower.includes('dispatch') || stageLower.includes('dispatch') || stepLower.includes('custody')) {
        if (isDispatched) {
          return {
            ...step,
            completed: true,
            actor: step.actor && !step.actor.includes('N/A') ? step.actor : `${req.dispatchedBy || 'Ramesh Patil (Lab Assistant)'}`,
            timestamp: step.timestamp || req.requestDate || new Date().toISOString(),
            note: step.note || 'Physical hardware kit handover committed at counter desk.',
          };
        }
      }

      if (stepLower.includes('return') || stageLower.includes('return') || stepLower.includes('restock')) {
        if (isReturned) {
          return {
            ...step,
            completed: true,
            actor: step.actor && !step.actor.includes('N/A') ? step.actor : 'Ramesh Patil (Lab Assistant)',
            timestamp: step.timestamp || new Date().toISOString(),
            note: step.note || 'Hardware returned & restocked into central depot inventory pool.',
          };
        }
      }

      return step;
    });

    if (isReturned && !mapped.some((s) => (s.step || '').toLowerCase().includes('return') || (s.stage || '').toLowerCase().includes('return'))) {
      mapped.push({
        step: 'Returned & Restocked',
        stage: 'Returned',
        completed: true,
        actor: 'Ramesh Patil (Lab Assistant)',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        note: 'Hardware returned & restocked into central depot inventory pool. Custody cleared.',
      });
    }

    return mapped;
  };

  const counts = useMemo(() => ({
    all: roleRequisitions.length,
    submitted: roleRequisitions.filter((r) => isPendingStatus(r.status) && !isRejectedStatus(r.status) && !isReturnedStatus(r.status)).length,
    ready: roleRequisitions.filter((r) => isReadyStatus(r.status) && !isReturnedStatus(r.status)).length,
    dispatched: roleRequisitions.filter((r) => isDispatchedStatus(r.status) && !isReturnedStatus(r.status)).length,
    returned: roleRequisitions.filter((r) => isReturnedStatus(r.status)).length,
    rejected: roleRequisitions.filter((r) => isRejectedStatus(r.status)).length,
  }), [roleRequisitions]);

  const filteredRequisitions = useMemo(() => {
    if (activeFilter === 'submitted') {
      return roleRequisitions.filter((r) => isPendingStatus(r.status) && !isRejectedStatus(r.status) && !isReturnedStatus(r.status));
    }
    if (activeFilter === 'ready') {
      return roleRequisitions.filter((r) => isReadyStatus(r.status) && !isReturnedStatus(r.status));
    }
    if (activeFilter === 'dispatched') {
      return roleRequisitions.filter((r) => isDispatchedStatus(r.status) && !isReturnedStatus(r.status));
    }
    if (activeFilter === 'returned') {
      return roleRequisitions.filter((r) => isReturnedStatus(r.status));
    }
    if (activeFilter === 'rejected') {
      return roleRequisitions.filter((r) => isRejectedStatus(r.status));
    }
    return roleRequisitions;
  }, [roleRequisitions, activeFilter]);

  const getStageInfo = (status) => {
    const s = String(status || '').trim().toLowerCase();
    if (isReturnedStatus(s)) {
      return { index: 5, label: 'Returned & Restocked', color: 'emerald' };
    }
    if (s.includes('reject')) {
      return { index: 0, label: 'Rejected by Supervisor', color: 'rose' };
    }
    if (s.includes('endorsed') || s.includes('staging')) {
      return { index: 2, label: 'Faculty Endorsed • Staging', color: 'emerald' };
    }
    if (s.includes('ready') || s.includes('pickup') || s.includes('sanctioned')) {
      return { index: 3, label: 'Ready for Pickup (Desk 2)', color: 'champagne' };
    }
    if (s.includes('dispatch') || s.includes('custody')) {
      return { index: 4, label: 'Dispatched & In Custody', color: 'white' };
    }
    return { index: 1, label: 'Awaiting Faculty Review', color: 'champagne' };
  };

  const stages = [
    { num: 1, name: 'Submitted' },
    { num: 2, name: 'Endorsed' },
    { num: 3, name: 'Staged' },
    { num: 4, name: 'Dispatched' },
    { num: 5, name: 'Returned' },
  ];

  const recentNotifications = useMemo(() => {
    return roleRequisitions.slice(0, 4).map((req) => {
      const isRej = isRejectedStatus(req.status);
      const isEnd = isReadyStatus(req.status);
      const primaryComp = req.componentsRequested?.[0]?.nomenclature || 'Hardware Item';
      const qty = req.componentsRequested?.[0]?.quantity || 1;

      return {
        id: req.id,
        req,
        title: isRej
          ? `Requisition ${req.id} Declined by Supervisor`
          : isEnd
          ? `Requisition ${req.id} Endorsed & Ready`
          : `Requisition ${req.id} Under Mentor Review`,
        message: isRej
          ? req.supervisorNotes ? `Supervisor Reason: "${req.supervisorNotes}"` : 'Request declined during faculty evaluation.'
          : isEnd
          ? `${primaryComp} (Qty ${qty}) verified. Awaiting counter pickup.`
          : `${primaryComp} (Qty ${qty}) awaiting Dr. Manoj Patil review.`,
        type: isRej ? 'error' : isEnd ? 'success' : 'info',
        date: req.requestDate || req.submittedDate,
      };
    });
  }, [roleRequisitions]);

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#c9b8a0]">
            Orders & Allocations
          </span>
          <h1 className="text-3xl font-bold tracking-[-0.025em] text-white mt-1 font-display">
            Requisitions
          </h1>
          <p className="text-[13px] text-zinc-400 mt-1.5 max-w-xl font-normal leading-relaxed">
            Track hardware orders moving through faculty mentor endorsement, counter staging, and dispatch handover.
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
      <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.04] border border-white/10 w-fit backdrop-blur-md flex-wrap">
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

        <button
          type="button"
          onClick={() => setActiveFilter('returned')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'returned'
              ? 'bg-emerald-400 text-black font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-emerald-300 hover:bg-emerald-500/10'
          }`}
        >
          <span>Returned</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-sans font-medium ${activeFilter === 'returned' ? 'bg-black/20 text-black font-bold' : 'bg-white/10 text-zinc-300'}`}>
            {counts.returned}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('rejected')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'rejected'
              ? 'bg-rose-500 text-white font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-rose-300 hover:bg-rose-500/10'
          }`}
        >
          <span>Rejected</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-sans font-medium ${activeFilter === 'rejected' ? 'bg-black/30 text-white font-bold' : 'bg-white/10 text-zinc-300'}`}>
            {counts.rejected}
          </span>
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ACTIVITY & NOTIFICATIONS SECTION (Real-Time Requisition Alerts) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showNotificationSection && recentNotifications.length > 0 && (
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 sm:p-5 backdrop-blur-xl relative overflow-hidden shadow-lg animate-in fade-in duration-300">
          <div className="flex items-center justify-between gap-3 mb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#c9b8a0]/20 border border-[#c9b8a0]/30 flex items-center justify-center text-[#f5e6c8]">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white tracking-tight flex items-center gap-2">
                  <span>Requisition Activity & Notifications Feed</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#c9b8a0]/20 text-[#f5e6c8] border border-[#c9b8a0]/30">
                    {recentNotifications.length} Recent
                  </span>
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowNotificationSection(false)}
              className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-xs flex items-center gap-1"
              title="Dismiss feed banner"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Hide</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => setSelectedReq(notif.req)}
                className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2.5 group ${
                  notif.type === 'error'
                    ? 'bg-rose-500/[0.06] hover:bg-rose-500/[0.12] border-rose-500/30 shadow-[0_4px_20px_rgba(244,63,94,0.1)]'
                    : notif.type === 'success'
                    ? 'bg-emerald-500/[0.06] hover:bg-emerald-500/[0.12] border-emerald-500/30'
                    : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex-shrink-0">
                    {notif.type === 'error' && <XCircle className="w-4 h-4 text-rose-400" />}
                    {notif.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {notif.type === 'info' && <Inbox className="w-4 h-4 text-[#c9b8a0]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold text-white truncate">
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-zinc-500 whitespace-nowrap">
                        {formatHumanDate(notif.date)}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-snug line-clamp-2 mt-0.5 font-normal">
                      {notif.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-white/[0.06] text-[10px] text-zinc-400 group-hover:text-[#f5e6c8]">
                  <span className="font-mono text-zinc-400">Order #{notif.id}</span>
                  <span className="flex items-center gap-1 font-medium">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Apple Store Orders Grid */}
      {filteredRequisitions.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-zinc-500 shadow-inner">
            <Inbox className="w-7 h-7 stroke-[1.5]" />
          </div>
          <h3 className="font-display text-lg font-bold text-white">No Requisitions Found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto font-sans leading-relaxed">
            No hardware orders match the selected filter. Browse the Workstation catalog to stage components into your requisition kit.
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRequisitions.map((req) => {
            const stageInfo = getStageInfo(req.status);
            const isRejected = isRejectedStatus(req.status);
            const primaryItem = req.componentsRequested?.[0] || { nomenclature: 'Hardware Component', quantity: 1, type: 'Asset' };
            const additionalItems = req.componentsRequested?.slice(1) || [];
            const primaryImage = getItemImage(primaryItem);

            return (
              <div
                key={req.id}
                onClick={() => setSelectedReq(req)}
                className={`group relative rounded-3xl border transition-all duration-500 flex flex-col justify-between cursor-pointer overflow-hidden min-h-[500px] ${
                  isRejected
                    ? 'border-rose-500/40 hover:border-rose-500/70 hover:shadow-[0_24px_60px_rgba(244,63,94,0.25)]'
                    : 'border-white/10 hover:border-[#c9b8a0]/50 hover:shadow-[0_24px_60px_rgba(0,0,0,0.95)]'
                }`}
              >
                {/* Full Image Box Background - Picture fills 100% of the box edge-to-edge */}
                <img
                  src={primaryImage}
                  alt={primaryItem.nomenclature}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out z-0"
                  onError={(e) => {
                    e.target.src = '/images/hardware/raspberry-pi-5.jpg';
                  }}
                />

                {/* Dark Cinematic Gradient Scrim for crisp text contrast over picture */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/45 to-black/95 pointer-events-none z-10" />

                {/* Specular hairline top rim */}
                <div className={`absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent ${isRejected ? 'via-rose-500/50' : 'via-white/30'} to-transparent pointer-events-none rounded-t-3xl z-20`} />

                {/* Details Layered Directly On Top of the Picture */}
                <div className="relative z-20 p-6 sm:p-7 flex flex-col justify-between h-full min-h-[500px] space-y-6">
                  {/* Top Status & SKU Strip */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 shadow-lg">
                      <span className="text-xs font-sans font-semibold text-zinc-200 group-hover:text-white transition-colors">
                        {req.id}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-zinc-500" />
                      <span className="text-xs text-zinc-300 font-sans">
                        Requested {formatHumanDate(req.requestDate)}
                      </span>
                    </div>

                    {/* Cupertino Status Pill */}
                    {stageInfo.color === 'rose' && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/25 backdrop-blur-md text-rose-300 border border-rose-500/40 flex items-center gap-1.5 shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                        <span>{stageInfo.label}</span>
                      </span>
                    )}
                    {stageInfo.color === 'emerald' && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{stageInfo.label}</span>
                      </span>
                    )}
                    {stageInfo.color === 'white' && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center gap-1.5 shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        <span>{stageInfo.label}</span>
                      </span>
                    )}
                    {(stageInfo.color === 'champagne' || stageInfo.color === 'amber' || stageInfo.color === 'zinc') && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#c9b8a0]/15 backdrop-blur-md text-[#f5e6c8] border border-[#c9b8a0]/35 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f5e6c8]" />
                        <span>{stageInfo.label}</span>
                      </span>
                    )}
                  </div>

                  {/* Hardware Nomenclature & Purpose Details Overlaid on Picture */}
                  <div className="space-y-3 pt-6">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-sans text-[#f5e6c8] font-semibold uppercase tracking-wider bg-black/60 backdrop-blur-md border border-white/15 shadow-sm">
                        {primaryItem.type || 'Consumable'}
                      </span>
                      <span className="text-zinc-500">•</span>
                      <span className="text-xs font-sans text-zinc-300 drop-shadow-sm">
                        Aiming for AIML Lab
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-[#f5e6c8] transition-colors leading-snug drop-shadow-md">
                        {primaryItem.nomenclature}
                      </h3>
                      <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white font-sans font-bold text-xs border border-white/20 shadow-md flex-shrink-0">
                        {primaryItem.quantity}x
                      </span>
                    </div>

                    {/* Stated Purpose */}
                    <div className="px-3.5 py-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-xs text-zinc-200 font-sans leading-relaxed shadow-sm">
                      <span className="text-zinc-300 font-normal">"{req.technicalPurpose}"</span>
                    </div>

                    {/* Additional Requested Items Strip (If Any) */}
                    {additionalItems.length > 0 && (
                      <div className="pt-2 border-t border-white/10 space-y-1.5">
                        <div className="text-[10px] font-sans uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
                          <Layers className="w-3 h-3 text-[#c9b8a0]" />
                          <span>Additional Staged Components ({additionalItems.length})</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {additionalItems.map((subItem, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-xs text-zinc-200 font-sans shadow-sm"
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
                  </div>

                  {/* Circulation Timeline & Footer Area */}
                  <div className="space-y-4">
                    {/* Tactile Progression Stepper */}
                    {isRejected ? (
                      <div className="space-y-2.5 pt-3 border-t border-rose-500/30">
                        <div className="flex items-center justify-between text-[11px] font-sans">
                          <span className="text-rose-400 font-semibold drop-shadow-sm flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                            <span>Circulation Halted • Requisition Declined</span>
                          </span>
                          <span className="text-rose-300 font-medium">Stage 0 of 4</span>
                        </div>
                        <div className="px-4 py-3 rounded-2xl bg-rose-500/20 backdrop-blur-md border border-rose-500/40 text-rose-200 text-xs font-sans flex flex-col gap-1.5 shadow-sm">
                          <div className="font-semibold text-rose-300 flex items-center justify-between">
                            <span>Supervisor Feedback:</span>
                            <span className="text-[11px] font-normal text-rose-300/80">{req.mentorName || 'Faculty Guide'}</span>
                          </div>
                          <div className="italic text-rose-100 bg-black/50 px-3 py-2 rounded-xl border border-rose-500/20 font-sans">
                            "{req.supervisorNotes || 'Requisition declined during review.'}"
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-3 border-t border-white/10 space-y-2.5">
                        <div className="flex items-center justify-between text-[11px] font-sans">
                          <span className="text-zinc-400 font-medium drop-shadow-sm">Circulation Timeline</span>
                          <span className="text-zinc-200 font-semibold drop-shadow-sm">Stage {stageInfo.index} of {stages.length} • {stageInfo.label}</span>
                        </div>

                        {/* Apple Segmented Progress Bar */}
                        <div className="grid grid-cols-5 gap-2">
                          {stages.map((st) => {
                            const isCompleted = st.num <= stageInfo.index;
                            const isCurrent = st.num === stageInfo.index;

                            return (
                              <div key={st.name} className="space-y-1.5 text-center">
                                <div
                                  className={`h-1.5 rounded-full transition-all duration-300 ${
                                    isCompleted
                                      ? isCurrent
                                        ? stageInfo.color === 'emerald'
                                          ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]'
                                          : 'bg-[#c9b8a0] shadow-[0_0_12px_rgba(201,184,160,0.8)]'
                                        : 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                                      : 'bg-white/15 backdrop-blur-sm'
                                  }`}
                                />
                                <span
                                  className={`text-[10px] font-sans block truncate drop-shadow-sm ${
                                    isCurrent
                                      ? stageInfo.color === 'emerald'
                                        ? 'text-emerald-300 font-bold'
                                        : 'text-[#f5e6c8] font-bold'
                                      : isCompleted
                                      ? 'text-zinc-300'
                                      : 'text-zinc-500'
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
                        <div className="w-9 h-9 rounded-full bg-[#c9b8a0]/25 border border-[#c9b8a0]/40 text-[#f5e6c8] font-bold text-xs flex items-center justify-center shadow-md backdrop-blur-md flex-shrink-0">
                          {(req.mentorName?.replace('Dr. ', '').replace('Prof. ', '') || 'A').charAt(0)}
                        </div>
                        <div>
                          <div className="text-white font-medium text-xs font-sans truncate max-w-[170px] sm:max-w-[220px] drop-shadow-sm">
                            {req.mentorName}
                          </div>
                          <div className="text-zinc-300 font-sans text-[11px] flex items-center gap-1.5 mt-0.5 drop-shadow-sm">
                            <span className="text-zinc-400 font-normal">Faculty Guide</span>
                            <span className="w-1 h-1 rounded-full bg-zinc-600" />
                            <span className="text-[#c9b8a0] font-semibold">Group {req.projectId}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isPendingStatus(req.status) && !isRejectedStatus(req.status) && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelRequisition(req.id || req.requestNumber);
                            }}
                            className="px-3 py-2 rounded-full text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/30 border border-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                            title="Cancel requisition before approval"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReq(req);
                          }}
                          className="px-4 py-2 rounded-full text-xs font-semibold bg-white hover:bg-[#f5e6c8] text-black transition-all flex items-center gap-1.5 shadow-lg backdrop-blur-md cursor-pointer active:scale-95 flex-shrink-0"
                        >
                          <span>Order Dossier</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
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
            {/* Rejection Alert Banner if rejected */}
            {isRejectedStatus(selectedReq.status) && (
              <div className="p-4 bg-rose-500/20 border border-rose-500/40 rounded-2xl text-rose-200 text-xs flex items-start gap-3 shadow-sm">
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-rose-300 text-sm">Requisition Declined by Faculty Supervisor</div>
                  <p className="text-rose-100">
                    Reason: <span className="font-semibold underline">"{selectedReq.supervisorNotes || 'Declined during review.'}"</span>
                  </p>
                  <p className="text-zinc-400 text-[11px]">
                    Authorized Decision by {selectedReq.mentorName || 'Faculty Guide'}
                  </p>
                </div>
              </div>
            )}

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
                {getNormalizedTimeline(selectedReq).map((step, idx) => (
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

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              {isPendingStatus(selectedReq.status) && !isRejectedStatus(selectedReq.status) ? (
                <button
                  type="button"
                  onClick={() => handleCancelRequisition(selectedReq.id || selectedReq.requestNumber)}
                  className="px-4 py-2 rounded-full bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Cancel Requisition</span>
                </button>
              ) : <div />}

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
