import React, { useState, useMemo } from 'react';
import { useLabData } from '../../context/LabDataContext';
import { useAuth } from '../../context/AuthContext';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Clock, AlertTriangle, CalendarPlus, CheckCircle2, ShieldAlert, Sparkles, MapPin } from 'lucide-react';

export function ActiveLoansPage() {
  const { activeLoans, requestExtension } = useLabData();
  const { currentUser, role } = useAuth();

  const [selectedLoan, setSelectedLoan] = useState(null);
  const [extensionDays, setExtensionDays] = useState('7');
  const [extensionReason, setExtensionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userHasOverdue = useMemo(() => {
    return activeLoans.some(
      (loan) => loan.borrowerPrn === currentUser?.prn && loan.status === 'Overdue'
    );
  }, [activeLoans, currentUser?.prn]);

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

  const stats = useMemo(() => {
    const total = displayedLoans.length;
    const imminent = displayedLoans.filter((l) => l.status === 'Imminent').length;
    const overdue = displayedLoans.filter((l) => l.status === 'Overdue').length;
    const normal = displayedLoans.filter((l) => l.status === 'Normal').length;
    return { total, imminent, overdue, normal };
  }, [displayedLoans]);

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

  const columns = [
    {
      header: 'Loan ID & Tag',
      accessor: 'assetTag',
      width: '160px',
      render: (row) => (
        <div>
          <div className="font-mono text-xs font-semibold text-[#c9b8a0]">{row.assetTag}</div>
          <div className="font-mono text-[10px] text-zinc-500">{row.id}</div>
        </div>
      ),
    },
    {
      header: 'Hardware Nomenclature',
      accessor: 'nomenclature',
      render: (row) => (
        <div>
          <div className="font-semibold text-white text-xs">{row.nomenclature}</div>
          <div className="font-mono text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-[#a78b71]" />
            <span>Origin: {row.locationCoordinates}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Custody Borrower',
      accessor: 'borrowerName',
      width: '180px',
      render: (row) => (
        <div className="font-mono text-xs">
          <div className="text-white font-medium">{row.borrowerName}</div>
          <div className="text-zinc-500 text-[11px]">{row.borrowerPrn} • {row.courseCode}</div>
        </div>
      ),
    },
    {
      header: 'Checkout Date',
      accessor: 'checkedOutDate',
      width: '140px',
      render: (row) => (
        <span className="font-mono text-xs text-zinc-400">
          {row.checkedOutDate?.split(' ')[0]}
        </span>
      ),
    },
    {
      header: 'Scheduled Due',
      accessor: 'dueDate',
      width: '160px',
      render: (row) => (
        <div className="font-mono text-xs">
          <div className="text-white font-medium">{row.dueDate?.split(' ')[0]}</div>
          <div className={`text-[10px] ${row.daysRemaining < 0 ? 'text-rose-400 font-bold' : row.daysRemaining <= 3 ? 'text-amber-400 font-semibold' : 'text-emerald-400'}`}>
            {row.daysRemaining < 0
              ? `${Math.abs(row.daysRemaining)} Days Overdue`
              : `${row.daysRemaining} Days Remaining`}
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      width: '130px',
      render: (row) => <StatusBadge status={row.status} type="due" size="xs" />,
    },
    {
      header: 'Action',
      width: '160px',
      align: 'right',
      render: (row) => {
        const isBorrower = row.borrowerPrn === currentUser?.prn;
        const isDisabled = userHasOverdue && isBorrower;

        return (
          <button
            onClick={() => handleOpenExtension(row)}
            disabled={isDisabled}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-inter text-xs transition-neural ${
              isDisabled
                ? 'bg-white/[0.02] text-zinc-600 border border-white/5 cursor-not-allowed'
                : 'glass-neural text-white hover:border-[#a78b71]/50 hover:text-[#e8d5b7]'
            }`}
            title={isDisabled ? 'Disabled: Student record has unreturned overdue items' : 'Request Term Extension'}
          >
            <CalendarPlus className="w-3.5 h-3.5 text-[#a78b71]" />
            Extension
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-playfair font-bold italic tracking-tight text-white flex items-center gap-3">
            <Clock className="w-6 h-6 text-[#a78b71]" />
            Active Hardware Borrowings & Custody
          </h1>
          <p className="text-xs font-inter text-zinc-400 mt-1">
            Real-time custody tracking, due-date countdowns, and academic loan extension controls.
          </p>
        </div>

        {/* Status metric chips */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1 rounded-full glass-neural text-zinc-300">
            Total: <span className="font-bold text-white">{stats.total}</span>
          </span>
          {stats.imminent > 0 && (
            <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
              Imminent: {stats.imminent}
            </span>
          )}
          {stats.overdue > 0 && (
            <span className="px-2.5 py-1 rounded-md bg-red-500/15 border border-red-500/40 text-red-400 font-bold">
              Overdue: {stats.overdue}
            </span>
          )}
        </div>
      </div>

      {/* Overdue Warning Alert */}
      {userHasOverdue && (
        <div className="p-4 bg-red-950/50 border border-red-600/60 rounded-xl flex items-start gap-3 text-red-200 shadow-xl backdrop-blur-md">
          <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-semibold tracking-tight uppercase font-mono text-red-300">
              Accountability Restriction Flag Triggered
            </div>
            <p className="text-red-200/80 font-sans leading-relaxed">
              Your collegiate record contains an unreturned item that has breached the scheduled deadline. Under department audit policy, extension requests and new requisitions are locked until overdue hardware is surrendered at the counter.
            </p>
          </div>
        </div>
      )}

      {/* Active Borrowings Table */}
      <DataTable
        columns={columns}
        data={displayedLoans}
        pageSize={10}
        emptyMessage="No active hardware loans currently registered under this account."
      />

      {/* Extension Modal */}
      <Modal
        isOpen={!!selectedLoan}
        onClose={() => setSelectedLoan(null)}
        title="Request Academic Loan Extension"
        subtitle="Submits a formal justification to extend equipment holding duration."
      >
        {selectedLoan && (
          <form onSubmit={handleConfirmExtension} className="space-y-4 text-xs font-sans">
            <div className="p-3.5 bg-[#0a0b0e] border border-white/[0.08] rounded-lg font-mono space-y-1.5">
              <div className="flex justify-between text-[#8a8f98]">
                <span>Asset:</span>
                <span className="text-[#8b95f6] font-bold">{selectedLoan.assetTag}</span>
              </div>
              <div className="flex justify-between text-[#8a8f98]">
                <span>Hardware:</span>
                <span className="text-white">{selectedLoan.nomenclature}</span>
              </div>
              <div className="flex justify-between text-[#8a8f98]">
                <span>Current Deadline:</span>
                <span className="text-amber-400 font-semibold">{selectedLoan.dueDate?.split(' ')[0]}</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#8a8f98] mb-1">
                Requested Extension Window
              </label>
              <select
                value={extensionDays}
                onChange={(e) => setExtensionDays(e.target.value)}
                className="w-full bg-[#0a0b0e] border border-white/[0.08] rounded-md px-3 py-2 font-mono text-white focus:outline-none focus:border-[#5e6ad2]"
              >
                <option value="3">3 Days (Quick Lab Validation)</option>
                <option value="7">7 Days (Standard Milestone Extension)</option>
                <option value="14">14 Days (Comprehensive Term Defense Sprint)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#8a8f98] mb-1">
                Technical Purpose & Rationale <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={extensionReason}
                onChange={(e) => setExtensionReason(e.target.value)}
                placeholder="e.g. Additional benchmarking required for thermal dissipation analysis under continuous inference workload..."
                className="w-full px-3 py-2 bg-[#0a0b0e] border border-white/[0.08] rounded-md text-white placeholder:text-[#444754] focus:outline-none focus:border-[#5e6ad2]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setSelectedLoan(null)}
                className="px-3 py-1.5 rounded-md border border-white/[0.1] font-mono text-xs text-[#8a8f98] hover:bg-white/[0.04]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="linear-btn-primary px-4 py-1.5 rounded-md font-mono text-xs font-semibold"
              >
                {isSubmitting ? 'Processing...' : 'Authorize Extension'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
