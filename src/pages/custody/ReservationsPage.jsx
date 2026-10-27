import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLabData } from '../../context/LabDataContext';
import { useAuth } from '../../context/AuthContext';
import { DataTable } from '../../components/common/DataTable';
import {
  BookmarkCheck,
  Calendar,
  Users,
  XCircle,
  Clock,
  Cpu,
  Layers,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Search,
} from 'lucide-react';

export function ReservationsPage() {
  const navigate = useNavigate();
  const { reservations, inventory, leaveWaitlist } = useLabData();
  const { currentUser, role } = useAuth();

  const [activeTab, setActiveTab] = useState(role === 'Student' ? 'my' : 'all');
  const [searchQuery, setSearchQuery] = useState('');

  const isUserReservation = (r) => {
    return (
      r.studentPrn === currentUser?.prn ||
      r.requestorPrn === currentUser?.prn ||
      r.borrowerPrn === currentUser?.prn ||
      r.studentName === currentUser?.name
    );
  };

  const myReservations = useMemo(() => {
    return (reservations || []).filter(isUserReservation);
  }, [reservations, currentUser]);

  const displayedReservations = useMemo(() => {
    let list = reservations || [];
    if (activeTab === 'my') {
      list = myReservations;
    } else if (activeTab === 'aimL' || activeTab === 'AIML') {
      list = list.filter((r) => (r.department || '').toUpperCase().includes('AIML'));
    } else if (activeTab === 'cse' || activeTab === 'CSE') {
      list = list.filter((r) => (r.department || '').toUpperCase().includes('CSE'));
    } else if (activeTab === 'ra' || activeTab === 'RA') {
      list = list.filter((r) => (r.department || '').toUpperCase().includes('RA'));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.nomenclature?.toLowerCase().includes(q) ||
          r.itemId?.toLowerCase().includes(q) ||
          r.studentName?.toLowerCase().includes(q) ||
          r.projectId?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [reservations, myReservations, activeTab, searchQuery]);

  const resolveHardwareImage = (itemId, nomenclature) => {
    const match = inventory?.find(
      (i) =>
        i.id === itemId ||
        i.assetTag === itemId ||
        (i.nomenclature && nomenclature && i.nomenclature.toLowerCase().includes(nomenclature.toLowerCase()))
    );
    if (match?.image) return match.image;

    const nom = (nomenclature || itemId || '').toLowerCase();
    if (nom.includes('jetson') || nom.includes('orin') || nom.includes('nano')) return '/images/hardware/jetson-nano.jpg';
    if (nom.includes('raspberry') || nom.includes('rpi')) return '/images/hardware/raspberry-pi-5.jpg';
    if (nom.includes('realsense') || nom.includes('camera')) return '/images/hardware/realsense-camera.jpg';
    if (nom.includes('thermal') || nom.includes('flir')) return '/images/hardware/thermal-camera.jpg';
    if (nom.includes('dobot') || nom.includes('robotic')) return '/images/hardware/dobot-magician.jpg';
    if (nom.includes('oscilloscope') || nom.includes('rigol')) return '/images/hardware/oscilloscope.jpg';
    return '/images/hardware/raspberry-pi-5.jpg';
  };

  const columns = [
    {
      header: 'Reservation ID',
      accessor: 'id',
      width: '140px',
      render: (row) => (
        <div>
          <span className="font-sans text-xs font-semibold text-[#f5e6c8]">{row.id}</span>
          <div className="text-[11px] text-zinc-500 font-sans mt-0.5">
            {row.requestDate?.split(' ')[0] || 'Oct 18'}
          </div>
        </div>
      ),
    },
    {
      header: 'Queued Component',
      accessor: 'nomenclature',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-black/50 border border-white/10 p-1.5 flex items-center justify-center flex-shrink-0 shadow-inner">
            <img
              src={resolveHardwareImage(row.itemId, row.nomenclature)}
              alt={row.nomenclature}
              className="max-h-full max-w-full object-contain filter drop-shadow-sm"
              onError={(e) => {
                e.target.src = '/images/hardware/raspberry-pi-5.jpg';
              }}
            />
          </div>
          <div className="min-w-0">
            <div className="font-medium text-white text-xs truncate">{row.nomenclature}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-sans text-[11px] text-[#c9b8a0]">SKU: {row.itemId}</span>
              {row.department && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/[0.04] text-zinc-400 border border-white/5 font-sans font-medium">
                  {row.department}
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Requisitioner / Team',
      accessor: 'studentName',
      width: '190px',
      render: (row) => {
        const isMe = isUserReservation(row);
        return (
          <div className="font-sans text-xs">
            <div className="flex items-center gap-1.5">
              <span className={`font-medium ${isMe ? 'text-[#f5e6c8] font-semibold' : 'text-zinc-200'}`}>
                {row.studentName}
              </span>
              {isMe && (
                <span className="px-1.5 py-0.2 rounded bg-[#c9b8a0]/20 text-[#f5e6c8] text-[10px] font-bold border border-[#c9b8a0]/30">
                  You
                </span>
              )}
            </div>
            <div className="text-zinc-500 text-[11px] mt-0.5">{row.projectId} • {row.studentPrn}</div>
          </div>
        );
      },
    },
    {
      header: 'FIFO Position',
      accessor: 'queuePosition',
      width: '180px',
      render: (row) => {
        const isFirst = row.queuePosition === 1;
        return (
          <div className="flex items-center gap-2 font-sans text-xs">
            <span
              className={`px-3 py-1 rounded-full font-bold text-[11px] shadow-sm flex items-center gap-1.5 ${
                isFirst
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'bg-[#c9b8a0]/15 text-[#f5e6c8] border border-[#c9b8a0]/30'
              }`}
            >
              {isFirst && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
              <span>Pos #{row.queuePosition}</span>
            </span>
            <span className="text-zinc-500 text-[11px]">of {row.totalInQueue}</span>
          </div>
        );
      },
    },
    {
      header: 'Est. Next Allocation',
      accessor: 'estimatedAvailability',
      width: '170px',
      render: (row) => (
        <div className="flex items-center gap-1.5 font-sans text-xs text-zinc-300">
          <Calendar className="w-3.5 h-3.5 text-[#c9b8a0]" />
          <span>{row.estimatedAvailability}</span>
        </div>
      ),
    },
    {
      header: 'Action',
      width: '120px',
      align: 'right',
      render: (row) => {
        const canCancel = isUserReservation(row) || role !== 'Student';
        if (!canCancel) return null;
        return (
          <button
            onClick={() => leaveWaitlist(row.id)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-rose-500/15 hover:text-rose-300 text-zinc-400 font-sans text-xs transition-colors border border-white/10 cursor-pointer shadow-sm active:scale-95"
            title="Withdraw from waitlist backlog"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER                                                 */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#c9b8a0]">
              Hardware Circulation & Fairness
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              FIFO Engine Active
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mt-1 font-display flex items-center gap-2">
            <span>Circulation Waitlist</span>
          </h1>
          <p className="text-[13px] text-zinc-400 mt-1.5 max-w-xl font-normal leading-relaxed">
            Strict first-in, first-out sequencing for high-demand collegiate hardware kits. When checked-in components are intake-restocked at the counter, allocations automatically advance to the next queued scholar.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/workspace/inventory')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#c9b8a0] via-[#e2d2bc] to-[#f5e6c8] hover:opacity-95 text-black font-semibold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Cpu className="w-3.5 h-3.5 text-black" />
            <span>Enqueue From Catalog</span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. TELEMETRY STRIP                                            */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Total Enqueued Requests</div>
          <div className="text-2xl font-bold font-sans text-white mt-1">{(reservations || []).length}</div>
          <div className="text-[11px] text-zinc-500 mt-0.5">Across all lab wings</div>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#c9b8a0]">My Active Positions</div>
          <div className="text-2xl font-bold font-sans text-[#f5e6c8] mt-1">{myReservations.length}</div>
          <div className="text-[11px] text-zinc-500 mt-0.5">In student queue</div>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">Next In Line (#1)</div>
          <div className="text-2xl font-bold font-sans text-emerald-400 mt-1">
            {(reservations || []).filter((r) => r.queuePosition === 1).length}
          </div>
          <div className="text-[11px] text-zinc-500 mt-0.5">Awaiting counter drop-off</div>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Sequencing Policy</div>
          <div className="text-sm font-semibold font-sans text-white mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Strict FIFO Timestamp</span>
          </div>
          <div className="text-[11px] text-zinc-500 mt-0.5">Anti-hoarding fair rotation</div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. TABS & SEARCH BAR                                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('my')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'my'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            My Waitlist ({myReservations.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Collegiate Queues ({(reservations || []).length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('AIML')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'AIML'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            AIML Dept ({(reservations || []).filter((r) => (r.department || '').toUpperCase().includes('AIML')).length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('CSE')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'CSE'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            CSE Dept ({(reservations || []).filter((r) => (r.department || '').toUpperCase().includes('CSE')).length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('RA')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'RA'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            RA Dept ({(reservations || []).filter((r) => (r.department || '').toUpperCase().includes('RA')).length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by SKU, item, or student..."
            className="w-full pl-9 pr-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#c9b8a0]/60 transition-all font-sans"
          />
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. FIFO RESERVATIONS DATA TABLE                               */}
      {/* ───────────────────────────────────────────────────────────── */}
      <DataTable
        columns={columns}
        data={displayedReservations}
        pageSize={10}
        emptyMessage={
          activeTab === 'my'
            ? 'You do not have any hardware waitlist reservations active. Visit the Workstation catalog to join the queue for out-of-stock items.'
            : 'No matching reservation records found in the selected queue.'
        }
      />
    </div>
  );
}

export default ReservationsPage;
