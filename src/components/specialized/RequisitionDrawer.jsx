import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Send, ShoppingBag, Sparkles } from 'lucide-react';
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

  if (!isBasketOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsBasketOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0e1015] border-l border-white/[0.12] shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#12141a]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#5e6ad2]/15 text-[#5e6ad2] border border-[#5e6ad2]/30">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white tracking-tight">Requisition Basket</h2>
                <p className="text-[11px] font-mono text-[#8a8f98]">
                  {basket.length} item{basket.length === 1 ? '' : 's'} staged for allocation
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsBasketOpen(false)}
              className="p-1.5 rounded-md text-[#8a8f98] hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Requester Context Card */}
          <div className="px-5 py-3 bg-[#0a0b0e] border-b border-white/[0.06] text-xs font-mono space-y-1">
            <div className="flex justify-between text-[#8a8f98]">
              <span>Project Team:</span>
              <span className="text-[#f7f8f9] font-medium">{currentUser?.projectId || 'PRJ-AIML-08'}</span>
            </div>
            <div className="flex justify-between text-[#8a8f98]">
              <span>Course Mentor:</span>
              <span className="text-[#f7f8f9] font-medium">{currentUser?.mentorName || 'Prof. Sneha Kulkarni'}</span>
            </div>
            <div className="flex justify-between text-[#8a8f98]">
              <span>Reliability Score:</span>
              <span className="text-[#3ecf8e] font-bold">{currentUser?.reliabilityScore || 94}/100</span>
            </div>
          </div>

          {/* Staged Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-white/[0.06]">
            {basket.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-[#62666d] font-mono text-xs p-6 space-y-2">
                <ShoppingBag className="w-10 h-10 stroke-[1.2] opacity-30 mb-1" />
                <p className="text-[#8a8f98]">Requisition basket is empty.</p>
                <p className="text-[11px] text-[#62666d]">
                  Click "+ Requisition" on any hardware entry in the inventory registry to add items.
                </p>
              </div>
            ) : (
              basket.map((item) => (
                <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-mono font-bold text-[#8b95f6]">{item.assetTag}</div>
                    <div className="text-xs font-semibold text-white truncate mt-0.5">{item.nomenclature}</div>
                    <div className="text-[11px] font-mono text-[#62666d] mt-0.5">
                      Coordinates: {item.coordinates} • {item.classification}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex items-center bg-[#0a0b0e] border border-white/[0.1] rounded-md">
                      <button
                        onClick={() => updateBasketQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:text-white text-[#8a8f98] transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center font-mono text-xs text-white font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateBasketQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:text-white text-[#8a8f98] transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromBasket(item.id)}
                      className="p-1 text-[#62666d] hover:text-rose-400 transition-colors rounded hover:bg-white/[0.04]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Submission Form Footer */}
          {basket.length > 0 && (
            <form onSubmit={handleSubmit} className="p-5 border-t border-white/[0.08] bg-[#12141a] space-y-3">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#8a8f98] mb-1 font-semibold">
                  Technical Purpose & Justification <span className="text-rose-400">*</span>
                </label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Edge model latency profiling for Course Mini-Project defense (DCDS-SY-AIML)..."
                  rows={3}
                  className="w-full px-3 py-2 bg-[#0a0b0e] border border-white/[0.1] rounded-lg text-xs text-white placeholder:text-[#444754] focus:outline-none focus:border-[#5e6ad2] font-mono"
                />
                {error && <p className="text-[11px] text-rose-400 mt-1">{error}</p>}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={clearBasket}
                  className="px-3 py-2 rounded-md border border-white/[0.1] text-xs font-mono text-[#8a8f98] hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="linear-btn-primary flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-md font-mono text-xs font-semibold tracking-tight shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Transmitting to Faculty...' : 'Submit to Mentor for Approval'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
