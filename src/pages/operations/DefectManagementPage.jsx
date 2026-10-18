import React, { useState, useMemo } from 'react';
import { useLabData } from '../../context/LabDataContext';
import { useAuth } from '../../context/AuthContext';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SearchInput } from '../../components/common/SearchInput';
import { Modal } from '../../components/common/Modal';
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Archive,
  FileText,
  Clock,
  Sparkles,
  LayoutGrid,
  Table as TableIcon,
  RotateCcw,
  Check,
  Package,
  Layers,
  ArrowRight,
  ShieldAlert,
  Search,
  MapPin,
} from 'lucide-react';

export function DefectManagementPage() {
  const { defects, inventory, updateDefectStatus, retireAsset } = useLabData();
  const { role } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // Default to Apple Cupertino Grid Cards

  // Modals state
  const [selectedDefect, setSelectedDefect] = useState(null);
  const [newStatus, setNewStatus] = useState('Under Inspection');
  const [actionPlan, setActionPlan] = useState('');
  const [retireDefect, setRetireDefect] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to fetch matching hardware photo from inventory
  const getAssetDetails = (assetTag) => {
    return inventory.find((i) => i.assetTag === assetTag) || null;
  };

  // Metrics telemetry
  const stats = useMemo(() => {
    const total = defects.length;
    const critical = defects.filter((d) => d.severity?.includes('Critical') || d.severity?.includes('Bricked')).length;
    const underInspection = defects.filter((d) => d.repairStatus === 'Under Inspection').length;
    const awaitingParts = defects.filter((d) => d.repairStatus === 'Awaiting Parts').length;
    const repaired = defects.filter((d) => d.repairStatus === 'Repaired').length;
    return { total, critical, underInspection, awaitingParts, repaired };
  }, [defects]);

  // Filtered defects
  const filteredDefects = useMemo(() => {
    return defects.filter((item) => {
      if (statusFilter !== 'ALL' && item.repairStatus !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.id?.toLowerCase().includes(q) ||
          item.assetTag?.toLowerCase().includes(q) ||
          item.nomenclature?.toLowerCase().includes(q) ||
          item.associatedPrn?.toLowerCase().includes(q) ||
          item.associatedProject?.toLowerCase().includes(q) ||
          item.conditionSummary?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [defects, statusFilter, searchQuery]);

  const handleOpenStatusModal = (defect) => {
    setSelectedDefect(defect);
    setNewStatus(defect.repairStatus);
    setActionPlan(defect.resolutionPlan || '');
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    if (!selectedDefect) return;
    setIsSubmitting(true);
    try {
      await updateDefectStatus(selectedDefect.id, newStatus, actionPlan);
      setSelectedDefect(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInstantRestock = async (defect) => {
    const asset = getAssetDetails(defect.assetTag);
    const location = asset?.coordinates || 'Shelf CB-04';
    await updateDefectStatus(
      defect.id,
      'Repaired',
      `Diagnostic verification passed at bench. Hardware certified operational and restocked to ${location}.`
    );
  };

  const handleConfirmRetire = async () => {
    if (!retireDefect) return;
    await retireAsset(retireDefect.id);
    setRetireDefect(null);
  };

  // Table Columns
  const tableColumns = [
    {
      header: 'Defect ID & Date',
      accessor: 'id',
      width: '150px',
      render: (row) => (
        <div className="font-sans text-xs">
          <div className="font-semibold text-rose-400">{row.id}</div>
          <div className="text-zinc-500 text-[11px] mt-0.5">{row.reportedDate?.split(' ')[0]}</div>
        </div>
      ),
    },
    {
      header: 'Hardware Asset',
      accessor: 'nomenclature',
      render: (row) => {
        const asset = getAssetDetails(row.assetTag);
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/[0.04] border border-white/10 flex-shrink-0 flex items-center justify-center p-1">
              <img
                src={asset?.image || '/images/hardware/raspberry-pi-5.jpg'}
                alt={row.nomenclature}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = '/images/hardware/raspberry-pi-5.jpg';
                }}
              />
            </div>
            <div>
              <div className="font-medium text-white text-xs">{row.nomenclature}</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                Tag: <span className="text-zinc-300 font-semibold">{row.assetTag}</span> <span className="text-zinc-600">/</span> {row.defectCategory}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Severity',
      accessor: 'severity',
      width: '130px',
      render: (row) => <StatusBadge status={row.severity} type="severity" size="xs" />,
    },
    {
      header: 'Diagnosis & Project Origin',
      accessor: 'conditionSummary',
      render: (row) => (
        <div className="space-y-0.5 font-sans text-xs">
          <div className="text-zinc-200 line-clamp-1">{row.conditionSummary}</div>
          <div className="text-[11px] text-zinc-500">
            PRN: {row.associatedPrn} ({row.associatedProject})
          </div>
        </div>
      ),
    },
    {
      header: 'Repair Status',
      accessor: 'repairStatus',
      width: '160px',
      render: (row) => {
        const dotColor =
          row.repairStatus === 'Repaired'
            ? 'bg-emerald-400'
            : row.repairStatus === 'Under Inspection'
            ? 'bg-amber-400'
            : row.repairStatus === 'Decommissioned'
            ? 'bg-rose-400'
            : 'bg-indigo-400';

        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-sans text-[11px] font-medium border border-white/10 bg-white/[0.04] text-zinc-300">
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
            {row.repairStatus}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      width: '180px',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2 font-sans text-xs">
          {row.repairStatus !== 'Repaired' && row.repairStatus !== 'Decommissioned' && (
            <button
              onClick={() => handleInstantRestock(row)}
              className="px-3 py-1 rounded-full bg-white hover:bg-neutral-200 text-black transition-all text-[11px] font-semibold flex items-center gap-1 cursor-pointer shadow-sm"
              title="1-Click Restock to Active Inventory"
            >
              <Check className="w-3 h-3 stroke-[2.5]" />
              <span>Restock</span>
            </button>
          )}

          <button
            onClick={() => handleOpenStatusModal(row)}
            className="p-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Update Triage Status"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          {role === 'HoD / Admin' && row.repairStatus !== 'Decommissioned' && (
            <button
              onClick={() => setRetireDefect(row)}
              className="p-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
              title="Decommission & Retire Asset"
            >
              <Archive className="w-3.5 h-3.5" />
            </button>
          )}
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
            Maintenance & Repairs
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white mt-1 font-display">
            Defect Bench
          </h1>
          <p className="text-[13px] text-zinc-400 mt-1 font-normal">
            Hardware triage, technician rework status, and restock tracking.
          </p>
        </div>

        {/* View Switcher: Apple Segmented Pill */}
        <div className="flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Quarantine Stage Cards"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Dense Table View"
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. SEGMENTED FILTER TOOLBAR & SEARCH                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Segmented Status Tabs: Apple Glass Pill */}
        <div className="inline-flex p-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl overflow-x-auto no-scrollbar">
          {[
            { id: 'ALL', label: 'All Incidents', count: defects.length },
            { id: 'Under Inspection', label: 'Under Inspection', count: stats.underInspection },
            { id: 'Awaiting Parts', label: 'Awaiting Parts', count: stats.awaitingParts },
            { id: 'Repaired', label: 'Repaired', count: stats.repaired },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-white text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label} {tab.count !== undefined ? `(${tab.count})` : ''}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="w-full md:w-72">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search Tag, PRN, or flaw..."
          />
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. MAIN CONTENT VIEW: CUPERTINO HARDWARE STAGING OR TABLE     */}
      {/* ───────────────────────────────────────────────────────────── */}
      {viewMode === 'grid' ? (
        filteredDefects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDefects.map((defect) => {
              const asset = getAssetDetails(defect.assetTag);
              const isCritical = defect.severity?.includes('Critical') || defect.severity?.includes('Bricked');
              const isModerate = defect.severity?.includes('Moderate');

              return (
                <div
                  key={defect.id}
                  className="rounded-2xl p-5 bg-[#121316]/90 border border-white/10 hover:border-white/20 transition-all duration-200 shadow-lg flex flex-col justify-between space-y-4"
                >
                  {/* Top Row: Defect ID & Severity Badge */}
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm tracking-wide font-sans">
                        {defect.id}
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-xs text-zinc-400 font-sans">
                        {defect.reportedDate?.split(' ')[0]}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border border-white/10 bg-white/[0.04]">
                      <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          isCritical
                            ? 'bg-rose-400'
                            : isModerate
                            ? 'bg-amber-400'
                            : 'bg-zinc-400'
                        }`}
                      />
                      <span className="text-zinc-200">{defect.severity}</span>
                    </div>
                  </div>

                  {/* Middle Row: Hardware details with thumbnail */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/10 p-1 flex items-center justify-center flex-shrink-0">
                      <img
                        src={asset?.image || '/images/hardware/raspberry-pi-5.jpg'}
                        alt={defect.nomenclature}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.src = '/images/hardware/raspberry-pi-5.jpg';
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <h3 className="font-semibold text-white text-sm truncate">
                        {defect.nomenclature}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-zinc-400 font-sans">
                        <span className="text-[#c9b8a0] font-mono">{defect.assetTag}</span>
                        <span>•</span>
                        <span>{defect.defectCategory}</span>
                      </div>
                    </div>
                  </div>

                  {/* Diagnostic Summary */}
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed line-clamp-2 px-0.5">
                    "{defect.conditionSummary}"
                  </p>

                  {/* Bottom Row: Status & Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs font-sans">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          defect.repairStatus === 'Repaired'
                            ? 'bg-emerald-400'
                            : defect.repairStatus === 'Under Inspection'
                            ? 'bg-amber-400'
                            : defect.repairStatus === 'Decommissioned'
                            ? 'bg-rose-400'
                            : 'bg-indigo-400'
                        }`}
                      />
                      <span className="text-zinc-300 font-medium">{defect.repairStatus}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {defect.repairStatus !== 'Repaired' && defect.repairStatus !== 'Decommissioned' && (
                        <button
                          onClick={() => handleInstantRestock(defect)}
                          className="px-3.5 py-1.5 rounded-full bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                          title="Verify operational & restock"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Restock</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenStatusModal(defect)}
                        className="px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white text-zinc-300 hover:text-black border border-white/10 font-medium text-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Triage</span>
                      </button>

                      {role === 'HoD / Admin' && defect.repairStatus !== 'Decommissioned' && (
                        <button
                          onClick={() => setRetireDefect(defect)}
                          className="p-1.5 rounded-full bg-white/[0.04] hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition-colors cursor-pointer"
                          title="Decommission & Retire Asset"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center rounded-3xl bg-white/[0.02] border border-white/[0.08] p-8 space-y-3">
            <Wrench className="w-9 h-9 mx-auto opacity-30 stroke-[1.5]" />
            <div className="text-white font-medium text-sm">No hardware defects match your current filter.</div>
            <p className="text-zinc-500 text-xs max-w-sm mx-auto">
              All bench triage tickets have been resolved or filtered out.
            </p>
          </div>
        )
      ) : (
        <DataTable
          columns={tableColumns}
          data={filteredDefects}
          pageSize={10}
          emptyMessage="No hardware defects currently registered."
        />
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. MODAL: UPDATE REPAIR / DIAGNOSTIC STATUS                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={!!selectedDefect}
        onClose={() => setSelectedDefect(null)}
        title={`Update Triage Status: ${selectedDefect?.id}`}
        subtitle={`Asset: ${selectedDefect?.assetTag} (${selectedDefect?.nomenclature})`}
      >
        <form onSubmit={handleSaveStatus} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block text-[11px] font-sans uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
              Repair & Diagnostic Pipeline Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full bg-[#111317] border border-white/15 rounded-xl px-3.5 py-2.5 font-sans text-xs text-white focus:outline-none focus:border-white/30 cursor-pointer"
            >
              <option value="Under Inspection" className="bg-[#111317]">
                Under Inspection (Diagnostic Bench Testing)
              </option>
              <option value="Awaiting Parts" className="bg-[#111317]">
                Awaiting Parts (Replacement MCU/Headers on order)
              </option>
              <option value="Repaired" className="bg-[#111317]">
                Repaired (Verified Operational & 1-Click Restocked)
              </option>
            </select>
            {newStatus === 'Repaired' && (
              <p className="text-[11px] text-emerald-400 mt-1.5 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                Selecting 'Repaired' will automatically reactivate this unit in active inventory.
              </p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-sans uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
              Technician Action Plan & Resolution Notes
            </label>
            <textarea
              rows={3}
              value={actionPlan}
              onChange={(e) => setActionPlan(e.target.value)}
              placeholder="e.g. Solder rework completed on pin header; tested 3.3V continuity on oscilloscope..."
              className="w-full px-3.5 py-2.5 bg-[#111317] border border-white/15 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 font-sans text-xs leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setSelectedDefect(null)}
              className="px-4 py-2 rounded-full border border-white/10 font-sans text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-full bg-white hover:bg-neutral-200 font-sans text-xs font-semibold text-black transition-colors cursor-pointer shadow-md"
            >
              {isSubmitting ? 'Saving...' : 'Save Triage State'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 6. MODAL: RETIRE ASSET (ADMIN ONLY)                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={!!retireDefect}
        onClose={() => setRetireDefect(null)}
        title="Institutional Asset Decommissioning"
        subtitle="Permanent removal of hardware from collegiate active registry."
      >
        <div className="space-y-4 text-xs font-sans">
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-200 space-y-1.5 font-sans">
            <div className="font-bold uppercase text-[11px] flex items-center gap-1.5 text-rose-400">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Administrative Decommission Warning
            </div>
            <p className="text-xs text-rose-300 leading-relaxed">
              Retiring asset <span className="font-bold text-white">{retireDefect?.assetTag}</span> will irrevocably write off the unit from collegiate lab books. An immutable retirement audit event will be recorded under your HoD credentials.
            </p>
          </div>

          <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/10 font-sans text-xs space-y-1.5">
            <div className="text-zinc-400">Nomenclature: <span className="text-white font-medium">{retireDefect?.nomenclature}</span></div>
            <div className="text-zinc-400">Reported Failure: <span className="text-zinc-300">{retireDefect?.conditionSummary}</span></div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
            <button
              onClick={() => setRetireDefect(null)}
              className="px-4 py-2 rounded-full border border-white/10 font-sans text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmRetire}
              className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-500 font-sans text-xs font-bold text-white shadow-sm transition-colors cursor-pointer"
            >
              Confirm Asset Retirement
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DefectManagementPage;
