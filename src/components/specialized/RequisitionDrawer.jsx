import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Send,
  ShoppingBag,
  Sparkles,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  UserCheck,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { useLabData } from '../../context/LabDataContext';
import { useAuth } from '../../context/AuthContext';

export function RequisitionDrawer() {
  const {
    basket,
    isBasketOpen,
    setIsBasketOpen,
    removeFromBasket,
    updateBasketQuantity,
    clearBasket,
    submitBasketRequisition,
  } = useLabData();
  const { currentUser } = useAuth();

  const [purpose, setPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  if (!isBasketOpen) return null;

  const quickJustifications = [
    'Edge model inference profiling for Course Mini-Project defense',
    'Laboratory practicals & sensor telemetry logging',
    'Hardware-in-the-loop firmware validation & bench testing',
  ];

  const handleCopyTag = (tag) => {
    navigator.clipboard?.writeText(tag);
    setCopiedId(tag);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!purpose.trim()) {
      setError('Technical purpose & justification is required by department audit policy.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const ok = await submitBasketRequisition(purpose);
      if (ok) {
        setPurpose('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalQuantity = basket.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans select-none">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. Frosted Ambient Backdrop                                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={() => setIsBasketOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 sm:pl-16">
        <div className="w-screen max-w-xl bg-[#090a0d]/95 border-l border-white/15 shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col h-full backdrop-blur-2xl relative text-white">
          
          {/* Specular edge top reflection line */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

          {/* ───────────────────────────────────────────────────────── */}
          {/* 2. Drawer Header                                          */}
          {/* ───────────────────────────────────────────────────────── */}
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#c9b8a0]/25 to-[#a78b71]/10 border border-[#c9b8a0]/30 flex items-center justify-center shadow-[0_0_20px_rgba(201,184,160,0.2)]">
                <ShoppingBag className="w-5 h-5 text-[#f5e6c8]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Requisition Kit</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/[0.08] text-[11px] font-mono font-semibold text-[#c9b8a0] border border-white/10">
                    {totalQuantity} {totalQuantity === 1 ? 'Unit' : 'Units'}
                  </span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5 font-normal">
                  Hardware staged for institutional laboratory custody
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsBasketOpen(false)}
              className="w-8 h-8 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/25 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="Close Drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ───────────────────────────────────────────────────────── */}
          {/* 3. Requester Profile & Accountability Banner               */}
          {/* ───────────────────────────────────────────────────────── */}
          <div className="px-6 py-4 bg-white/[0.015] border-b border-white/10 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-white">
                  {currentUser?.name || 'Rahul Sharma'}
                </span>
                <span className="text-zinc-500 font-mono text-[11px]">
                  ({currentUser?.prn || '202401048'})
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono font-semibold text-[10px]">
                Score: {currentUser?.reliabilityScore || 94}/100 • Tier 1
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px] text-zinc-400">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-zinc-600">PROJECT:</span>
                <span className="text-zinc-300 truncate">{currentUser?.projectId || 'PRJ-AIML-08'}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-zinc-600">MENTOR:</span>
                <span className="text-zinc-300 truncate">{currentUser?.mentorName || 'Dr. Anjali Dalvi'}</span>
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────── */}
          {/* 4. Staged Items Scroll Area                               */}
          {/* ───────────────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3.5">
            {basket.length === 0 ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-white/[0.02] border border-white/10 flex items-center justify-center text-zinc-600 mb-2">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-sm font-semibold text-white">Requisition Kit is Empty</h3>
                <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
                  Browse the Assets or Consumables catalog and click "+ Requisition" on any component to stage it for checkout.
                </p>
              </div>
            ) : (
              basket.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl p-4 bg-white/[0.025] hover:bg-white/[0.04] border border-white/10 hover:border-[#c9b8a0]/40 transition-all duration-200 flex items-center gap-4 group"
                >
                  {/* Component Picture Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-b from-[#18181b] to-[#0c0c0e] border border-white/10 flex-shrink-0 flex items-center justify-center p-1.5 shadow-md relative">
                    <img
                      src={item.image || '/images/hardware/raspberry-pi-5.jpg'}
                      alt={item.nomenclature}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '/images/hardware/raspberry-pi-5.jpg';
                      }}
                    />
                  </div>

                  {/* Component Information */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-[#c9b8a0]">
                        {item.assetTag}
                      </span>
                      <button
                        onClick={() => handleCopyTag(item.assetTag)}
                        className="text-zinc-500 hover:text-white transition-colors"
                        title="Copy Tag"
                      >
                        {copiedId === item.assetTag ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                      <span className="text-zinc-600">•</span>
                      <span className={`text-[10px] font-mono px-2 py-0.2 rounded-full border ${
                        item.classification === 'Asset'
                          ? 'bg-blue-950/40 border-blue-500/30 text-blue-300'
                          : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                      }`}>
                        {item.classification}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-white truncate mt-1">
                      {item.nomenclature}
                    </h4>

                    <div className="mt-1.5 flex items-center gap-1.5 text-xs font-mono text-zinc-400">
                      <MapPin className="w-3 h-3 text-[#a78b71] flex-shrink-0" />
                      <span className="text-[#f5e6c8]">{item.coordinates}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-[11px] text-zinc-400 truncate">{item.labRoom}</span>
                    </div>
                  </div>

                  {/* Stepper & Delete Action */}
                  <div className="flex flex-col items-end justify-between gap-3 flex-shrink-0">
                    <button
                      onClick={() => removeFromBasket(item.id)}
                      className="text-zinc-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Remove from kit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Tactile Cupertino Stepper */}
                    <div className="flex items-center bg-black/60 border border-white/15 rounded-full p-0.5">
                      <button
                        onClick={() => updateBasketQuantity(item.id, (item.quantity || 1) - 1)}
                        className="w-6 h-6 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center font-mono text-xs text-white font-bold">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => updateBasketQuantity(item.id, (item.quantity || 1) + 1)}
                        className="w-6 h-6 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* ─────────────────────────────────────────────────────── */}
            {/* Circulation Policy & Logistics Summary Card             */}
            {/* ─────────────────────────────────────────────────────── */}
            {basket.length > 0 && (
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5 text-xs font-sans">
                <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#a78b71]" />
                  Circulation & Custody Safeguards
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-300">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-amber-400 flex-shrink-0" />
                    <span>Loan: 14-Day Cycle</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3 h-3 text-[#c9b8a0] flex-shrink-0" />
                    <span>Counter: Lab 2 Desk</span>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans pt-1 border-t border-white/5">
                  Hardware will be held at Dispatch Desk Counter 2 upon Faculty approval. Barcode verification required at pickup.
                </p>
              </div>
            )}
          </div>

          {/* ───────────────────────────────────────────────────────── */}
          {/* 5. Submission Form Footer                                 */}
          {/* ───────────────────────────────────────────────────────── */}
          {basket.length > 0 && (
            <form onSubmit={handleSubmit} className="p-6 border-t border-white/10 bg-[#0c0d10] space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-300 font-semibold flex items-center gap-1">
                    <span>Technical Purpose & Justification</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[10px] text-zinc-500 font-mono">Institutional Policy</span>
                </div>

                {/* Quick Selection Pills */}
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {quickJustifications.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setPurpose(q)}
                      className="px-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-[10px] text-zinc-300 hover:text-white transition-all cursor-pointer text-left truncate max-w-full"
                    >
                      + {q}
                    </button>
                  ))}
                </div>

                <textarea
                  value={purpose}
                  onChange={(e) => {
                    setPurpose(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Specify experimental rationale, project milestone, or coursework practicals..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/15 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#c9b8a0] focus:ring-1 focus:ring-[#c9b8a0]/30 transition-all font-sans leading-relaxed"
                />

                {error && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={clearBasket}
                  className="px-4 py-3 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Clear
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-5 rounded-full text-black font-bold text-xs tracking-wide shadow-[0_4px_25px_rgba(167,139,113,0.45)] hover:shadow-[0_4px_30px_rgba(201,184,160,0.6)] hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 border border-[#f5e6c8]/60 disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(to right, #a78b71 0%, #c9b8a0 50%, #e8d5b7 100%)',
                  }}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {isSubmitting ? 'Transmitting to Faculty...' : 'Submit Requisition for Approval'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default RequisitionDrawer;
