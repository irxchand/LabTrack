import React, { useState, useMemo } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Send,
  ShoppingBag,
  MapPin,
  Check,
  Copy,
  AlertCircle,
  FolderGit2,
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
    projects,
    activeLoans,
    userDepartment,
    getItemDeptStock,
    resolveItemLocationForDept,
  } = useLabData();
  const { currentUser } = useAuth();
  const isStudent = currentUser?.role === 'Student';

  const userProjects = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    const myPrn = currentUser?.prn || '202401048';
    const filtered = projects.filter(
      (p) =>
        p.teamLeaderPrn === myPrn ||
        p.members?.some((m) => m.prn === myPrn) ||
        p.id === currentUser?.projectId
    );
    return filtered.length > 0 ? filtered : projects;
  }, [projects, currentUser]);

  const [selectedProjectId, setSelectedProjectId] = useState(
    currentUser?.projectId || 'PRJ-AIML-08'
  );

  const activeSelectedProject = useMemo(() => {
    return (
      userProjects.find((p) => p.id === selectedProjectId) ||
      userProjects[0] ||
      null
    );
  }, [userProjects, selectedProjectId]);

  const [purpose, setPurpose] = useState('');
  const [durationDays, setDurationDays] = useState(14);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const crossDeptItems = useMemo(() => {
    if (!isStudent) return [];
    return basket.filter((item) => {
      const stock = getItemDeptStock(item, userDepartment);
      return stock.available <= 0;
    });
  }, [basket, isStudent, userDepartment, getItemDeptStock]);

  const hasCrossDeptItems = crossDeptItems.length > 0;

  if (!isBasketOpen) return null;

  const handleCopyTag = (tag) => {
    navigator.clipboard?.writeText(tag);
    setCopiedId(tag);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!purpose.trim()) {
      setError('Please provide a brief justification for faculty approval.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const targetId = activeSelectedProject?.id || selectedProjectId;
      const ok = await submitBasketRequisition(purpose, targetId);
      if (ok) {
        setPurpose('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalUnits = basket.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans select-none">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. Backdrop                                                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300"
        onClick={() => setIsBasketOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-16">
        <div className="w-screen max-w-lg bg-[#0e0e11] border-l border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.85)] flex flex-col h-full text-white relative">
          
          {/* Specular edge top reflection line */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

          {/* ───────────────────────────────────────────────────────── */}
          {/* 2. Drawer Header (Apple Style)                            */}
          {/* ───────────────────────────────────────────────────────── */}
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-white tracking-tight">
                Requisition Kit
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-white/[0.08] text-xs font-medium text-zinc-300 border border-white/10">
                {totalUnits} {totalUnits === 1 ? 'item' : 'items'}
              </span>
            </div>

            <button
              onClick={() => setIsBasketOpen(false)}
              className="w-8 h-8 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.1] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ───────────────────────────────────────────────────────── */}
          {/* 3. Requester Strip (Subtle & Refined)                      */}
          {/* ───────────────────────────────────────────────────────── */}
          <div className="px-6 py-3.5 bg-white/[0.02] border-b border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/10 text-white font-medium text-[11px] flex items-center justify-center">
                {(currentUser?.name || 'R').charAt(0)}
              </div>
              <span className="font-medium text-white">{currentUser?.name || 'Rahul Sharma'}</span>
              <span className="text-zinc-500 font-sans text-[11px]">
                {currentUser?.prn || '202401048'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-500 text-[11px]">Enrolled Dept:</span>
              <span className="font-semibold text-emerald-400">
                {userDepartment}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-500 text-[11px]">Score</span>
              <span className="font-semibold text-[#f5e6c8]">
                {currentUser?.reliabilityScore || 94}%
              </span>
            </div>
          </div>

          {/* Cross-Department Policy Alert Banner */}
          {hasCrossDeptItems && (
            <div className="mx-6 mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
              <div>
                <span className="font-semibold block">Cross-Department Issue Prohibited</span>
                <span className="text-zinc-300 text-[11px] leading-relaxed">
                  SIT policy strictly restricts student issues to their own department ({userDepartment}). Basket contains hardware housed in other departments ({crossDeptItems.map((i) => i.nomenclature).join(', ')}). Please remove them to submit.
                </span>
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────── */}
          {/* 4. Staged Items List                                      */}
          {/* ───────────────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
            {basket.length === 0 ? (
              <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-center p-8 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-zinc-500 mb-1">
                  <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="text-sm font-semibold text-white">Your kit is empty</h3>
                <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
                  Browse the hardware catalog and click "+ Requisition" to add components to this checkout kit.
                </p>
              </div>
            ) : (
              basket.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl p-4 bg-white/[0.025] hover:bg-white/[0.04] border border-white/10 transition-all flex items-center gap-4 group"
                >
                  {/* Crisp Studio Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/50 border border-white/10 flex-shrink-0 relative shadow-sm">
                    <img
                      src={item.image || '/images/hardware/raspberry-pi-5.jpg'}
                      alt={item.nomenclature}
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        e.target.src = '/images/hardware/raspberry-pi-5.jpg';
                      }}
                    />
                  </div>

                  {/* Component Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-sans font-medium text-[11px] text-[#c9b8a0]">
                        {item.assetTag}
                      </span>
                      <button
                        onClick={() => handleCopyTag(item.assetTag)}
                        className="text-zinc-500 hover:text-white transition-colors"
                        title="Copy SKU / Tag"
                      >
                        {copiedId === item.assetTag ? (
                          <Check className="w-3 h-3 text-zinc-300" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                      <span className="text-zinc-600">•</span>
                      <span className="text-[11px] text-zinc-400 font-medium">
                        {item.classification}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-white truncate mt-1">
                      {item.nomenclature}
                    </h4>

                    {(() => {
                      const loc = resolveItemLocationForDept(item, userDepartment);
                      return (
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400">
                          <MapPin className="w-3.5 h-3.5 text-[#c9b8a0] flex-shrink-0" />
                          <span className="text-zinc-300">{loc.coordinates}</span>
                          <span className="text-zinc-600">•</span>
                          <span className="truncate">{loc.labRoom}</span>
                        </div>
                      );
                    })()}

                    {isStudent && (
                      <div className="mt-1.5">
                        {(() => {
                          const stock = getItemDeptStock(item, userDepartment);
                          if (stock.available <= 0) {
                            return (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                                <AlertCircle className="w-2.5 h-2.5" />
                                <span>{stock.depts.length > 0 ? `${stock.depts.join('/')} Dept Only` : `Not in ${userDepartment}`}</span>
                              </span>
                            );
                          }
                          return (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                              <span>✓ In {userDepartment} Labs ({stock.available} avail)</span>
                            </span>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Quantity Stepper & Remove Action */}
                  <div className="flex flex-col items-end justify-between gap-3 flex-shrink-0">
                    <button
                      onClick={() => removeFromBasket(item.id)}
                      className="text-zinc-500 hover:text-rose-400 p-1 rounded-lg transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {(() => {
                      const stock = getItemDeptStock(item, userDepartment);
                      const isAtMax = (item.quantity || 1) >= (isStudent ? stock.available : (item.availableStock ?? 99));
                      return (
                        <div className="flex items-center bg-white/[0.05] border border-white/10 rounded-full p-0.5">
                          <button
                            onClick={() => updateBasketQuantity(item.id, (item.quantity || 1) - 1)}
                            className="w-6 h-6 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold text-white">
                            {item.quantity || 1}
                          </span>
                          <button
                            disabled={isAtMax}
                            onClick={() => updateBasketQuantity(item.id, (item.quantity || 1) + 1)}
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                              isAtMax ? 'text-zinc-600 cursor-not-allowed opacity-40' : 'hover:bg-white/10 text-zinc-300 hover:text-white cursor-pointer'
                            }`}
                            title={isAtMax ? 'Reached maximum available stock' : 'Increase quantity'}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ───────────────────────────────────────────────────────── */}
          {/* 5. Purpose & Submission Area                              */}
          {/* ───────────────────────────────────────────────────────── */}
          {basket.length > 0 && (
            <form onSubmit={handleSubmit} className="p-6 border-t border-white/10 bg-[#0e0e11] space-y-4">
              {/* Target Project Group Selector */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-zinc-200 flex items-center gap-1.5">
                    <FolderGit2 className="w-3.5 h-3.5 text-[#c9b8a0]" />
                    <span>Target Academic Project Group</span>
                  </label>
                  {activeSelectedProject && (
                    <span className="text-[10px] text-zinc-400 font-sans">
                      Mentor: {activeSelectedProject.mentorName}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <select
                    value={activeSelectedProject?.id || selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#c9b8a0] transition-all cursor-pointer font-sans appearance-none pr-8"
                  >
                    {userProjects.map((p) => {
                      const assignedCount = (activeLoans || []).filter((l) => l.projectId === p.id).length;
                      return (
                        <option key={p.id} value={p.id} className="bg-[#141417] text-white py-1">
                          {p.id} • {p.title} ({assignedCount} items active)
                        </option>
                      );
                    })}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-[10px]">
                    ▼
                  </div>
                </div>

                {activeSelectedProject && (
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 px-0.5 pt-0.5">
                    <span>Course: {activeSelectedProject.courseCode}</span>
                    <span className="text-zinc-400">
                      {(activeLoans || []).filter((l) => l.projectId === activeSelectedProject.id).length} hardware items checked out
                    </span>
                  </div>
                )}
              </div>

              {/* Loan Duration Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-zinc-200">
                    Requisition Duration
                  </label>
                  <span className="text-[11px] text-[#c9b8a0] font-semibold">{durationDays} Days</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { days: 3, label: '3 Days' },
                    { days: 7, label: '1 Week' },
                    { days: 14, label: '2 Weeks' },
                    { days: 30, label: '1 Month' },
                  ].map((option) => (
                    <button
                      key={option.days}
                      type="button"
                      onClick={() => setDurationDays(option.days)}
                      className={`py-2 px-1 rounded-xl text-xs font-medium border transition-all cursor-pointer text-center ${
                        durationDays === option.days
                          ? 'bg-gradient-to-r from-[#c9b8a0] to-[#e2d2bc] text-black font-semibold border-transparent shadow-sm'
                          : 'bg-white/[0.04] border-white/10 text-zinc-300 hover:bg-white/[0.08]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-zinc-200">
                    Project Purpose & Justification
                  </label>
                  <span className="text-[11px] text-zinc-500">Required</span>
                </div>

                <textarea
                  value={purpose}
                  onChange={(e) => {
                    setPurpose(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Describe your experimental methodology and technical justification for faculty review..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/15 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#c9b8a0] focus:ring-1 focus:ring-[#c9b8a0]/30 transition-all leading-relaxed"
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
                  className="px-4 py-2.5 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Clear
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || hasCrossDeptItems}
                  className={`flex-1 py-2.5 px-5 rounded-full font-semibold text-xs tracking-wide transition-all flex items-center justify-center gap-2 shadow-sm ${
                    hasCrossDeptItems
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 cursor-not-allowed opacity-80'
                      : 'bg-white hover:bg-[#f5e6c8] text-black cursor-pointer active:scale-[0.99] disabled:opacity-50'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {isSubmitting
                      ? 'Submitting...'
                      : hasCrossDeptItems
                      ? 'Blocked: Cross-Department Hardware'
                      : 'Submit for Faculty Approval'}
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
