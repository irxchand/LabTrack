import React from 'react';
import { useLabData } from '../../context/LabDataContext';
import { useAuth } from '../../context/AuthContext';
import { DataTable } from '../../components/common/DataTable';
import { BookmarkCheck, Calendar, Users, XCircle } from 'lucide-react';

export function ReservationsPage() {
  const { reservations, leaveWaitlist } = useLabData();
  const { currentUser, role } = useAuth();

  const displayedReservations =
    role === 'Student'
      ? reservations.filter((r) => r.studentPrn === currentUser?.prn)
      : reservations;

  const columns = [
    {
      header: 'Reservation ID',
      accessor: 'id',
      width: '150px',
      render: (row) => (
        <span className="font-sans text-xs font-medium text-[#c9b8a0]">{row.id}</span>
      ),
    },
    {
      header: 'Hardware Asset',
      accessor: 'nomenclature',
      render: (row) => (
        <div>
          <div className="font-display font-semibold text-white">{row.nomenclature}</div>
          <div className="font-sans text-[11px] text-zinc-400 mt-0.5">Asset Tag: {row.itemId}</div>
        </div>
      ),
    },
    {
      header: 'Student Team',
      accessor: 'studentName',
      width: '180px',
      render: (row) => (
        <div className="font-sans text-xs">
          <div className="text-zinc-200 font-medium">{row.studentName}</div>
          <div className="text-zinc-400 text-[11px] mt-0.5">{row.projectId}</div>
        </div>
      ),
    },
    {
      header: 'FIFO Queue Position',
      accessor: 'queuePosition',
      width: '180px',
      render: (row) => (
        <div className="flex items-center gap-1.5 font-sans text-xs">
          <span className="px-2.5 py-0.5 rounded-full bg-[#c9b8a0]/15 text-[#f5e6c8] border border-[#c9b8a0]/30 font-semibold text-xs shadow-sm">
            Pos #{row.queuePosition}
          </span>
          <span className="text-zinc-400">of {row.totalInQueue}</span>
        </div>
      ),
    },
    {
      header: 'Est. Availability',
      accessor: 'estimatedAvailability',
      width: '160px',
      render: (row) => (
        <div className="flex items-center gap-1.5 font-sans text-xs text-zinc-300">
          <Calendar className="w-3.5 h-3.5 text-[#c9b8a0]" />
          <span>{row.estimatedAvailability}</span>
        </div>
      ),
    },
    {
      header: 'Action',
      width: '130px',
      align: 'right',
      render: (row) => (
        <button
          onClick={() => leaveWaitlist(row.id)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-rose-500/15 hover:text-rose-400 text-zinc-400 font-sans text-xs transition-colors border border-white/10 cursor-pointer"
          title="Withdraw from waitlist backlog"
        >
          <XCircle className="w-3.5 h-3.5" />
          Cancel
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#c9b8a0]">
            Queue & Reservations
          </span>
          <h1 className="text-3xl font-bold tracking-[-0.025em] text-white mt-1 font-display">
            Waitlist
          </h1>
          <p className="text-[13px] text-zinc-400 mt-1 font-normal">
            Hardware reserved for upcoming project sprints. Allocated automatically on return.
          </p>
        </div>

        <div className="text-xs font-sans text-zinc-300 px-3.5 py-1.5 bg-white/[0.03] border border-white/10 rounded-full shadow-sm">
          In Queue: <span className="text-[#f5e6c8] font-bold">{displayedReservations.length}</span>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={displayedReservations}
        pageSize={10}
        emptyMessage="No pending reservations in the FIFO waitlist."
      />
    </div>
  );
}

export default ReservationsPage;
