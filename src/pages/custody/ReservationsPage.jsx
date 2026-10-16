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
        <span className="font-mono text-xs font-semibold text-blue-400">{row.id}</span>
      ),
    },
    {
      header: 'Hardware Asset',
      accessor: 'nomenclature',
      render: (row) => (
        <div>
          <div className="font-medium text-zinc-200">{row.nomenclature}</div>
          <div className="font-mono text-[11px] text-zinc-500">Asset Tag: {row.itemId}</div>
        </div>
      ),
    },
    {
      header: 'Student Team',
      accessor: 'studentName',
      width: '180px',
      render: (row) => (
        <div className="font-mono text-xs">
          <div className="text-zinc-200">{row.studentName}</div>
          <div className="text-zinc-500 text-[11px]">{row.projectId}</div>
        </div>
      ),
    },
    {
      header: 'FIFO Queue Position',
      accessor: 'queuePosition',
      width: '180px',
      render: (row) => (
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 font-bold">
            Pos #{row.queuePosition}
          </span>
          <span className="text-zinc-500">of {row.totalInQueue}</span>
        </div>
      ),
    },
    {
      header: 'Est. Availability',
      accessor: 'estimatedAvailability',
      width: '160px',
      render: (row) => (
        <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-300">
          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
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
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-rose-950/40 hover:text-rose-400 text-zinc-400 font-mono text-xs transition-colors border border-zinc-700"
          title="Withdraw from waitlist backlog"
        >
          <XCircle className="w-3.5 h-3.5" />
          Cancel
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-800/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-blue-500" />
            Hardware Reservations & FIFO Backlog Queue
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-0.5">
            Automated queue sequencing for allocated or out-of-stock collegiate equipment.
          </p>
        </div>

        <div className="text-xs font-mono text-zinc-400 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded">
          Total Backlog Entries: <span className="text-zinc-100 font-bold">{displayedReservations.length}</span>
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-400 flex items-center gap-3">
        <Users className="w-4 h-4 text-blue-400 flex-shrink-0" />
        <span>
          When active borrowers check in their equipment at the assistant counter, the system automatically advances the FIFO reservation queue and dispatches an allocation notification to the next team in line.
        </span>
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
