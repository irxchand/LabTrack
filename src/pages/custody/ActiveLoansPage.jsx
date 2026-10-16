import React, { useState, useMemo } from 'react';
import { useLabData } from '../../context/LabDataContext';
import { useAuth } from '../../context/AuthContext';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SearchInput } from '../../components/common/SearchInput';
import { Modal } from '../../components/common/Modal';
import {
  Clock,
  AlertTriangle,
  CalendarPlus,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  MapPin,
  Eye,
  LayoutGrid,
  Table as TableIcon,
  Check,
  Calendar,
  Boxes,
  Cpu,
  Layers,
  Activity,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

export function ActiveLoansPage() {
  const { activeLoans, inventory, requestExtension } = useLabData();
  const { currentUser, role } = useAuth();

  const [selectedLoan, setSelectedLoan] = useState(null);
  const [inspectedLoan, setInspectedLoan] = useState(null);
  const [extensionDays, setExtensionDays] = useState('7');
  const [extensionReason, setExtensionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // Default to Apple Hardware Stage Cards

  // Check if current user has any unreturned overdue hardware
  const userHasOverdue = useMemo(() => {
    return activeLoans.some(
      (loan) => loan.borrowerPrn === currentUser?.prn && loan.status === 'Overdue'
    );
  }, [activeLoans, currentUser?.prn]);

  // Persona-aware filtration
  const displayedLoans = useMemo(() => {
    if (role === 'Student') {
      return activeLoans.filter(
        (loan) =>
          loan.borrowerPrn === currentUser?.prn || loan.projectId === currentUser?.projectId
      );
    }
    if (role === 'Faculty') {
      return activeLoans.filter(
        (loan) =>
          currentUser?.supervisedCourses?.includes(loan.courseCode) ||
          loan.courseCode === 'DCDS-SY-AIML' ||
          loan.courseCode === 'CCE-TY'
      );
    }
    return activeLoans;
  }, [activeLoans, role, currentUser]);

  // Real-time telemetry metrics
  const stats = useMemo(() => {
    const total = displayedLoans.length;
    const imminent = displayedLoans.filter((l) => l.status === 'Imminent').length;
    const overdue = displayedLoans.filter((l) => l.status === 'Overdue').length;
    const normal = displayedLoans.filter((l) => l.status === 'Normal').length;
    return { total, imminent, overdue, normal };
  }, [displayedLoans]);

  // Friendly date formatter (e.g. Oct 24)
  const formatFriendlyDate = (dateString) => {
    if (!dateString) return '';
    try {
      const parts = dateString.split(' ')[0].split('-');
      if (parts.length === 3) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const m = monthNames[parseInt(parts[1], 10) - 1] || parts[1];
        const d = parseInt(parts[2], 10);
        return `${m} ${d}`;
      }
      return dateString.split(' ')[0];
    } catch {
      return dateString.split(' ')[0];
    }
  };

  // Inventory lookup helper for rich photos & specs
  const getInventoryItem = (assetTag) => {
    return inventory.find((i) => i.assetTag === assetTag || i.id === assetTag) || {};
  };

  // Filtered list based on search and status tabs
  const filteredLoans = useMemo(() => {
    return displayedLoans.filter((loan) => {
      if (statusFilter === 'Normal' && loan.status !== 'Normal') return false;
      if (statusFilter === 'Imminent' && loan.status !== 'Imminent') return false;
      if (statusFilter === 'Overdue' && loan.status !== 'Overdue') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          loan.nomenclature.toLowerCase().includes(q) ||
          loan.assetTag.toLowerCase().includes(q) ||
          loan.id.toLowerCase().includes(q) ||
          loan.locationCoordinates?.toLowerCase().includes(q) ||
          loan.borrowerName?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [displayedLoans, statusFilter, searchQuery]);

  // Calculate new due date preview for extension modal
  const calculatedNewDueDate = useMemo(() => {
    if (!selectedLoan?.dueDate) return '';
    try {
      const parts = selectedLoan.dueDate.split(' ')[0].split('-');
      const current = new Date(parts[0], parts[1] - 1, parts[2]);
      current.setDate(current.getDate() + parseInt(extensionDays, 10));
      return current.toISOString().split('T')[0];
    } catch {
      return '';
    }
  }, [selectedLoan, extensionDays]);

  const handleOpenExtension = (loan) => {
    setSelectedLoan(loan);
    setExtensionDays('7');
    setExtensionReason('');
  };

  const handleConfirmExtension = async (e) => {
    e.preventDefault();
    if (!selectedLoan) return;
    setIsSubmitting(true);
    try {
      await requestExtension(selectedLoan.id, extensionDays, extensionReason);
      setSelectedLoan(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dense Table View Columns
  const tableColumns = [
    {
      header: 'Asset & Tag',
      accessor: 'assetTag',
      width: '180px',
      render: (row) => {
        const invItem = getInventoryItem(row.assetTag);
        return (
          <div className="flex items-center gap-3">
            <img
              src={invItem.image || '/images/hardware/raspberry-pi-5.jpg'}
              alt={row.nomenclature}
              className="w-10 h-10 object-contain rounded-lg bg-black/40 p-1 flex-shrink-0"
              onError={(e) => {
                e.target.src = '/images/hardware/raspberry-pi-5.jpg';
              }}
            />
            <div>
              <div className="font-mono text-xs font-semibold text-white">{row.assetTag}</div>
              <div className="font-mono text-[10px] text-zinc-500">{row.id}</div>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Component Nomenclature',
      accessor: 'nomenclature',
      render: (row) => (
        <div>
          <div className="font-medium text-white text-xs">{row.nomenclature}</div>
          <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
            <MapPin className="w-3 h-3 text-[#c9b8a0]" />
            <span>Origin: {row.locationCoordinates}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Custody Holder',
      accessor: 'borrowerName',
      width: '180px',
      render: (row) => (
        <div className="text-xs">
          <div className="text-white font-medium">{row.borrowerName}</div>
          <div className="text-zinc-500 text-[11px] font-mono">{row.borrowerPrn} • {row.courseCode}</div>
        </div>
      ),
    },
    {
      header: 'Issued Date',
      accessor: 'checkedOutDate',
      width: '130px',
      render: (row) => (
        <span className="font-mono text-xs text-zinc-400">
          {row.checkedOutDate?.split(' ')[0]}
        </span>
      ),
    },
    {
      header: 'Scheduled Return',
      accessor: 'dueDate',
      width: '170px',
      render: (row) => (
        <div className="text-xs">
          <div className="text-white font-mono font-medium">{row.dueDate?.split(' ')[0]}</div>
          <div
            className={`text-[11px] font-medium flex items-center gap-1.5 mt-0.5 ${
              row.daysRemaining < 0
                ? 'text-rose-400 font-semibold'
                : row.daysRemaining <= 3
                ? 'text-amber-400 font-semibold'
                : 'text-zinc-400'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                row.daysRemaining < 0
                  ? 'bg-rose-400 animate-pulse'
                  : row.daysRemaining <= 3
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-[#c9b8a0]'
              }`}
            />
            {row.daysRemaining < 0
              ? `${Math.abs(row.daysRemaining)} Days Overdue`
              : `${row.daysRemaining} Days Remaining`}
          </div>
        </div>
      ),
    },
    {
      header: 'Action',
      width: '150px',
      align: 'right',
      render: (row) => {
        const isBorrower = row.borrowerPrn === currentUser?.prn;
        const isDisabled = userHasOverdue && isBorrower;

        return (
          <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setInspectedLoan(row)}
              className="p-1.5 rounded-full border border-white/10 text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              title="Inspect Specs"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleOpenExtension(row)}
              disabled={isDisabled}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                isDisabled
                  ? 'bg-white/[0.03] text-zinc-600 border border-white/5 cursor-not-allowed'
                  : 'bg-white hover:bg-zinc-200 text-black shadow-sm active:scale-95 cursor-pointer font-semibold'
              }`}
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Extend</span>
            </button>
          </div>
        );
      },
    },
  ];

  // Render Cupertino Product Staging Card for Issued Hardware
  const renderHardwareCard = (loan) => {
    const invItem = getInventoryItem(loan.assetTag);
    const isBorrower = loan.borrowerPrn === currentUser?.prn;
    const isExtensionDisabled = userHasOverdue && isBorrower;

    return (
      <div
        key={loan.id}
        onClick={() => setInspectedLoan(loan)}
        className="group relative rounded-3xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] hover:from-white/[0.07] hover:to-white/[0.02] border border-white/[0.08] hover:border-white/20 p-7 transition-all duration-300 hover:shadow-[0_30px_70px_rgba(0,0,0,0.9)] flex flex-col justify-between cursor-pointer backdrop-blur-2xl"
      >
        {/* Specular hairline top rim */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none rounded-t-3xl" />

        <div>
          {/* Category & Tag Header */}
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#c9b8a0]">
              {invItem.category || 'Bench Hardware'}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono font-medium text-zinc-400 bg-white/[0.03] px-2.5 py-0.5 rounded-full border border-white/5">
                {loan.assetTag}
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                {loan.id}
              </span>
            </div>
          </div>

          {/* Product Hero Image (Clean Dark Floating Stage) */}
          <div className="relative w-full h-52 sm:h-56 flex items-center justify-center my-3 overflow-hidden">
            <img
              src={invItem.image || '/images/hardware/raspberry-pi-5.jpg'}
              alt={loan.nomenclature}
              className="max-h-full max-w-full object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.95)] group-hover:scale-[1.03] transition-transform duration-500 ease-out"
              onError={(e) => {
                e.target.src = '/images/hardware/raspberry-pi-5.jpg';
              }}
            />
          </div>

          {/* Product Title & Subtitle */}
          <div className="space-y-1.5 mt-2">
            <h3 className="text-[17px] font-semibold text-white tracking-[-0.015em] leading-snug group-hover:text-[#f5e6c8] transition-colors">
              {loan.nomenclature}
            </h3>
            <p className="text-[13px] text-zinc-400 font-normal line-clamp-2 leading-relaxed">
              {invItem.subSpecs || 'Institutional lab hardware unit issued for project development.'}
            </p>
          </div>

          {/* Origin Depot & Custody Strip */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 text-zinc-300 font-mono font-medium text-[11px]">
              <MapPin className="w-3 h-3 text-[#c9b8a0] flex-shrink-0" />
              <span>{loan.locationCoordinates}</span>
            </div>
            <span className="text-zinc-500 text-[12px]">
              Held by {loan.borrowerName?.split(' ')[0]} ({loan.borrowerPrn})
            </span>
          </div>
        </div>

        {/* Card Footer: Deadline Status & Actions */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-4">
          {/* Status info */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  loan.daysRemaining < 0
                    ? 'bg-rose-400'
                    : loan.daysRemaining <= 3
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
              />
              <span className="text-[13px] font-medium text-white truncate">
                {loan.daysRemaining < 0
                  ? `${Math.abs(loan.daysRemaining)} ${Math.abs(loan.daysRemaining) === 1 ? 'day' : 'days'} overdue`
                  : `${loan.daysRemaining} ${loan.daysRemaining === 1 ? 'day' : 'days'} remaining`}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5 font-normal">
              Due {formatFriendlyDate(loan.dueDate)}
            </p>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenExtension(loan);
            }}
            disabled={isExtensionDisabled}
            className={`px-4 py-2 rounded-full text-[13px] font-semibold tracking-tight transition-all shadow-sm active:scale-95 flex-shrink-0 cursor-pointer ${
              isExtensionDisabled
                ? 'bg-white/[0.04] text-zinc-600 border border-white/5 cursor-not-allowed'
                : 'bg-white hover:bg-zinc-200 text-black'
            }`}
            title={
              isExtensionDisabled
                ? 'Extension locked: overdue item pending return'
                : 'Request Term Extension'
            }
          >
            Extend
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 select-none font-sans max-w-7xl mx-auto">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER                                                 */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#c9b8a0]">
            Station & Field Deployments
          </span>
          <h1 className="text-3xl font-bold tracking-[-0.025em] text-white mt-1 font-display">
            My Bench
          </h1>
          <p className="text-[13px] text-zinc-400 mt-1.5 max-w-xl font-normal leading-relaxed">
            Hardware modules and bench instrumentation currently in your possession.
          </p>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. OVERDUE ACCOUNTABILITY NOTICE (Apple Style Minimal Toast)  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {userHasOverdue && (
        <div className="px-5 py-3.5 rounded-2xl bg-white/[0.03] border border-rose-500/20 backdrop-blur-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse flex-shrink-0" />
            <span className="text-zinc-300 text-[12px]">
              One or more items are overdue. Please surrender the equipment at Lab 1 Counter (Desk 2).
            </span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
            Extensions Locked
          </span>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. APPLE SEGMENTED FILTER & SEARCH TOOLBAR                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Filter Segmented Pills */}
        <div className="inline-flex p-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white text-black font-semibold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Hardware ({displayedLoans.length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('Normal')}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
              statusFilter === 'Normal'
                ? 'bg-white text-black font-semibold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            In Good Standing ({stats.normal})
          </button>

          {stats.imminent > 0 && (
            <button
              type="button"
              onClick={() => setStatusFilter('Imminent')}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
                statusFilter === 'Imminent'
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Due Soon ({stats.imminent})
            </button>
          )}

          {stats.overdue > 0 && (
            <button
              type="button"
              onClick={() => setStatusFilter('Overdue')}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
                statusFilter === 'Overdue'
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Overdue ({stats.overdue})
            </button>
          )}
        </div>

        {/* Right: Search & View Switcher */}
        <div className="flex items-center gap-3">
          <div className="w-64">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by component or SKU..."
            />
          </div>

          {/* View Switcher */}
          <div className="flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Cupertino Stage Cards"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Dense Ledger View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. HARDWARE PRESENTATION (Unified Cupertino Grid vs Ledger)   */}
      {/* ───────────────────────────────────────────────────────────── */}
      {viewMode === 'grid' ? (
        filteredLoans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLoans.map(renderHardwareCard)}
          </div>
        ) : (
          <div className="text-center py-20 text-zinc-400 text-sm bg-white/[0.02] border border-white/[0.08] rounded-3xl backdrop-blur-xl">
            <Boxes className="w-8 h-8 text-zinc-500 mx-auto mb-3" />
            <p className="font-medium text-white">No hardware staged at your bench</p>
            <p className="text-xs text-zinc-500 mt-1">
              Browse the Hardware Workstation to requisition components for your projects.
            </p>
          </div>
        )
      ) : (
        <DataTable
          columns={tableColumns}
          data={filteredLoans}
          keyField="id"
          onRowClick={(loan) => setInspectedLoan(loan)}
        />
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. TACTILE TERM EXTENSION MODAL (Cupertino Dialog)            */}
      {/* ───────────────────────────────────────────────────────────── */}
      {selectedLoan && (
        <Modal
          isOpen={!!selectedLoan}
          onClose={() => setSelectedLoan(null)}
          title="Extend Hardware Custody"
          subtitle={`Request duration renewal for ${selectedLoan.nomenclature}`}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleConfirmExtension} className="space-y-5 text-xs font-sans text-white">
            {/* Component Summary Card */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3.5">
              {(() => {
                const invItem = getInventoryItem(selectedLoan.assetTag);
                return (
                  <img
                    src={invItem.image || '/images/hardware/raspberry-pi-5.jpg'}
                    alt={selectedLoan.nomenclature}
                    className="w-14 h-14 object-contain rounded-xl bg-black/40 p-1 flex-shrink-0"
                    onError={(e) => {
                      e.target.src = '/images/hardware/raspberry-pi-5.jpg';
                    }}
                  />
                );
              })()}
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-white truncate text-sm">
                  {selectedLoan.nomenclature}
                </div>
                <div className="font-mono text-zinc-400 text-[11px] mt-0.5">
                  {selectedLoan.assetTag} • {selectedLoan.id}
                </div>
                <div className="flex items-center gap-2 mt-1 text-[11px]">
                  <span className="text-zinc-500">Current Due:</span>
                  <span className="text-amber-400 font-mono font-medium">
                    {selectedLoan.dueDate?.split(' ')[0]}
                  </span>
                </div>
              </div>
            </div>

            {/* Tactile Duration Picker */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-400 mb-2">
                Select Extension Duration
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { days: '3', label: '+3 Days', sub: 'Quick bench validation' },
                  { days: '7', label: '+7 Days', sub: 'Milestone sprint' },
                  { days: '14', label: '+14 Days', sub: 'Term defense phase' },
                ].map((tier) => (
                  <button
                    key={tier.days}
                    type="button"
                    onClick={() => setExtensionDays(tier.days)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      extensionDays === tier.days
                        ? 'bg-white text-black border-white shadow-md'
                        : 'bg-white/[0.03] border-white/10 text-zinc-300 hover:border-white/25'
                    }`}
                  >
                    <span className="font-semibold text-xs block">{tier.label}</span>
                    <span
                      className={`text-[10px] mt-1 line-clamp-1 ${
                        extensionDays === tier.days ? 'text-zinc-700' : 'text-zinc-500'
                      }`}
                    >
                      {tier.sub}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Date Preview Pill */}
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between text-xs">
              <span className="text-zinc-400">New Scheduled Return Date:</span>
              <span className="font-mono font-semibold text-[#f5e6c8] text-sm">
                {calculatedNewDueDate}
              </span>
            </div>

            {/* Quick Reason Presets */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-400 mb-1.5">
                Justification & Rationale <span className="text-rose-400">*</span>
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {[
                  'Benchmarking & thermal dissipation test',
                  'Model profiling for TensorRT deployment',
                  'Project milestone defense sprint',
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setExtensionReason(preset)}
                    className="px-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-[10px] text-zinc-400 hover:text-white transition-all cursor-pointer"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
              <textarea
                required
                rows={3}
                value={extensionReason}
                onChange={(e) => setExtensionReason(e.target.value)}
                placeholder="Describe experimental requirements necessitating extended custody..."
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#c9b8a0] transition-colors leading-relaxed"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedLoan(null)}
                className="px-4 py-2.5 rounded-full border border-white/10 text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !extensionReason.trim()}
                className="px-5 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black font-semibold text-xs tracking-wide transition-all shadow-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Authorizing...' : 'Authorize Extension'}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 6. COMPONENT QUICK SPECS MODAL                                */}
      {/* ───────────────────────────────────────────────────────────── */}
      {inspectedLoan && (
        <Modal
          isOpen={!!inspectedLoan}
          onClose={() => setInspectedLoan(null)}
          title={inspectedLoan.nomenclature}
          subtitle={`Custody Record: ${inspectedLoan.id} • Tag: ${inspectedLoan.assetTag}`}
          maxWidth="max-w-lg"
        >
          {(() => {
            const invItem = getInventoryItem(inspectedLoan.assetTag);
            return (
              <div className="space-y-4 text-xs font-sans text-white">
                <div className="w-full h-48 rounded-2xl bg-black/50 border border-white/10 p-3 flex items-center justify-center overflow-hidden">
                  <img
                    src={invItem.image || '/images/hardware/raspberry-pi-5.jpg'}
                    alt={inspectedLoan.nomenclature}
                    className="h-full object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
                    onError={(e) => {
                      e.target.src = '/images/hardware/raspberry-pi-5.jpg';
                    }}
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Origin Depot Coordinates:</span>
                    <span className="font-mono text-white font-medium">
                      {inspectedLoan.locationCoordinates}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Dispatch Technician:</span>
                    <span className="text-zinc-300">
                      {inspectedLoan.dispatchTechnician || 'Counter Desk 1'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Checked Out Date:</span>
                    <span className="font-mono text-zinc-300">
                      {inspectedLoan.checkedOutDate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Scheduled Due:</span>
                    <span className="font-mono text-[#f5e6c8] font-semibold">
                      {inspectedLoan.dueDate}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="font-medium text-zinc-300">Hardware Specifications</div>
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-zinc-300 leading-relaxed">
                    {invItem.subSpecs || 'Standard departmental lab hardware module.'}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setInspectedLoan(null)}
                    className="px-5 py-2 rounded-full bg-white hover:bg-zinc-200 text-black font-semibold text-xs tracking-wide transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}
    </div>
  );
}

export default ActiveLoansPage;
