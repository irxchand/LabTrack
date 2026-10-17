import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLabData } from '../../context/LabDataContext';
import { useAuth } from '../../context/AuthContext';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import {
  CheckSquare,
  AlertTriangle,
  Check,
  X,
  Edit3,
  FileText,
  Boxes,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  Search,
  LayoutGrid,
  Table as TableIcon,
  Cpu,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export function ApprovalsQueuePage() {
  const navigate = useNavigate();
  const { requisitions, inventory, activeLoans, approveRequisition, rejectRequisition } = useLabData();
  const { currentUser } = useAuth();
  const facultyName = currentUser?.name || 'Dr. Anjali Dalvi';

  // Modal states
  const [rejectModalReq, setRejectModalReq] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const [modifyModalReq, setModifyModalReq] = useState(null);
  const [modifiedQuantities, setModifiedQuantities] = useState({});

  const [endorseModalReq, setEndorseModalReq] = useState(null);
  const [authorizedLocation, setAuthorizedLocation] = useState('Room 402 Bench Only');
  const [authorizedTerm, setAuthorizedTerm] = useState('14-Day Sprint');
  const [customEndorsementNotes, setCustomEndorsementNotes] = useState('');
  const [isBatchApproving, setIsBatchApproving] = useState(false);

  // Search & View Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [activeScope, setActiveScope] = useState('mentored'); // 'mentored' | 'all'

  // Friendly date helper (e.g. Oct 15)
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

  // Resolve genuine hardware photography
  const getItemImage = (item) => {
    if (!item) return '/images/hardware/raspberry-pi-5.jpg';
    if (item.image) return item.image;

    const match = inventory?.find(
      (i) =>
        i.id === item.assetTag ||
        i.assetTag === item.assetTag ||
        i.id === item.itemId ||
        (i.nomenclature && item.nomenclature && (
          i.nomenclature.toLowerCase().includes(item.nomenclature.toLowerCase()) ||
          item.nomenclature.toLowerCase().includes(i.nomenclature.toLowerCase())
        ))
    );
    if (match?.image) return match.image;

    const nom = (item.nomenclature || item.name || '').toLowerCase();
    if (nom.includes('oled') || nom.includes('display')) return '/images/hardware/oled-display.jpg';
    if (nom.includes('jetson') || nom.includes('orin') || nom.includes('nano')) return '/images/hardware/jetson-nano.jpg';
    if (nom.includes('arduino') || nom.includes('uno')) return '/images/hardware/arduino-uno-r3.jpg';
    if (nom.includes('esp32') || nom.includes('micro') || nom.includes('wroom')) return '/images/hardware/esp32-wroom.jpg';
    if (nom.includes('oscilloscope') || nom.includes('rigol')) return '/images/hardware/oscilloscope.jpg';
    if (nom.includes('jumper') || nom.includes('wire') || nom.includes('ribbon')) return '/images/hardware/jumper-wires.jpg';
    if (nom.includes('breadboard')) return '/images/hardware/breadboard-830.jpg';
    if (nom.includes('sensor') || nom.includes('imu') || nom.includes('mpu') || nom.includes('bmp')) return '/images/hardware/bmp280-sensor.jpg';
    if (nom.includes('resistor')) return '/images/hardware/resistors-pack.jpg';
    return '/images/hardware/raspberry-pi-5.jpg';
  };

  // Filter requisitions needing review: matching both 'Submitted' and legacy 'Pending Approval'
  const allPendingRequisitions = useMemo(() => {
    return requisitions.filter(
      (r) => r.status === 'Submitted' || r.status === 'Pending Approval'
    );
  }, [requisitions]);

  const isMentorMatch = (req) => {
    if (!req.mentorName) return false;
    const m = req.mentorName.toLowerCase();
    const f = facultyName.toLowerCase();
    return m.includes(f) || f.includes(m) || req.mentorId === currentUser?.prn;
  };

  const mentoredPending = useMemo(() => {
    return allPendingRequisitions.filter(isMentorMatch);
  }, [allPendingRequisitions, facultyName, currentUser]);

  const scopedRequisitions = useMemo(() => {
    if (activeScope === 'mentored' && mentoredPending.length > 0) {
      return mentoredPending;
    }
    return allPendingRequisitions;
  }, [allPendingRequisitions, mentoredPending, activeScope]);

  // Apply real-time search query
  const filteredRequisitions = useMemo(() => {
    if (!searchQuery.trim()) return scopedRequisitions;
    const q = searchQuery.toLowerCase();
    return scopedRequisitions.filter(
      (r) =>
        r.studentName?.toLowerCase().includes(q) ||
        r.studentPrn?.toLowerCase().includes(q) ||
        r.projectId?.toLowerCase().includes(q) ||
        r.id?.toLowerCase().includes(q) ||
        r.technicalPurpose?.toLowerCase().includes(q) ||
        r.componentsRequested?.some((c) => c.nomenclature?.toLowerCase().includes(q))
    );
  }, [scopedRequisitions, searchQuery]);

  // Live component bench stock resolution
  const getComponentStock = (comp) => {
    const match = inventory.find(
      (i) =>
        i.id === comp.itemId ||
        i.assetTag === comp.itemId ||
        (i.nomenclature && comp.nomenclature && (
          i.nomenclature.toLowerCase().includes(comp.nomenclature.toLowerCase()) ||
          comp.nomenclature.toLowerCase().includes(i.nomenclature.toLowerCase())
        ))
    );
    if (!match) return { inStock: true, count: 4, depot: 'Shelf L2' };
    const count = match.stockCount ?? (match.stockStatus === 'Available' ? 1 : 0);
    return {
      inStock: count > 0,
      count,
      coordinates: match.coordinates || 'Bench Rack',
    };
  };

  // Team custody load lookup
  const getTeamActiveLoans = (projectId, prn) => {
    return activeLoans.filter(
      (l) => l.projectId === projectId || l.borrowerPrn === prn
    );
  };

  // 1-Click Fast-Pass Quick Approve
  const handleQuickApprove = (id, preset = null) => {
    const note = preset
      ? `${preset} — Endorsed by ${facultyName}.`
      : `Endorsed by ${facultyName} for laboratory coursework milestones.`;
    approveRequisition(id, note);
  };

  // Open Endorsement with Caveat Dialog
  const handleOpenEndorseWithCaveat = (req) => {
    setEndorseModalReq(req);
    setAuthorizedLocation('Room 402 Bench Only');
    setAuthorizedTerm('14-Day Sprint');
    setCustomEndorsementNotes('Coursework validated. Safe handling authorized.');
  };

  const handleConfirmEndorseWithCaveat = (e) => {
    e.preventDefault();
    if (!endorseModalReq) return;
    const combinedNotes = `Scope: ${authorizedLocation} • Cap: ${authorizedTerm} • Notes: ${customEndorsementNotes}`;
    approveRequisition(endorseModalReq.id, combinedNotes);
    setEndorseModalReq(null);
  };

  // Fast-Pass Batch Endorse for Compliant Mentored Teams
  const handleBatchEndorseCompliant = async () => {
    const compliant = filteredRequisitions.filter((r) => (r.teamReliabilityScore || 90) >= 75);
    if (!compliant.length) return;
    setIsBatchApproving(true);
    try {
      for (const req of compliant) {
        await approveRequisition(
          req.id,
          `Batch faculty endorsement: ${facultyName} verified compliant curriculum proposal.`
        );
      }
    } finally {
      setIsBatchApproving(false);
    }
  };

  // Reject handlers
  const handleOpenReject = (req) => {
    setRejectModalReq(req);
    setRejectReason('');
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectModalReq) return;
    rejectRequisition(rejectModalReq.id, rejectReason, facultyName);
    setRejectModalReq(null);
  };

  // Modify handlers
  const handleOpenModify = (req) => {
    setModifyModalReq(req);
    const initialMap = {};
    req.componentsRequested.forEach((c, idx) => {
      initialMap[idx] = c.quantity;
    });
    setModifiedQuantities(initialMap);
  };

  const handleConfirmModify = (e) => {
    e.preventDefault();
    if (!modifyModalReq) return;
    const updatedComponents = modifyModalReq.componentsRequested.map((c, idx) => ({
      ...c,
      quantity: Number(modifiedQuantities[idx]) || c.quantity,
    }));
    approveRequisition(
      modifyModalReq.id,
      facultyName,
      updatedComponents
    );
    setModifyModalReq(null);
  };

  // Table Columns (for optional compact table mode)
  const columns = [
    {
      header: 'Request Date & ID',
      accessor: 'id',
      width: '150px',
      render: (row) => (
        <div className="font-sans text-xs">
          <div className="font-semibold text-white tracking-wide">{row.id}</div>
          <div className="text-zinc-500 text-[11px] mt-0.5">{formatFriendlyDate(row.requestDate)}</div>
        </div>
      ),
    },
    {
      header: 'Student Team & Governance',
      accessor: 'studentName',
      width: '210px',
      render: (row) => {
        const teamLoans = getTeamActiveLoans(row.projectId, row.studentPrn);
        const isMyMentoredTeam = isMentorMatch(row);
        return (
          <div className="font-sans text-xs space-y-1">
            <div className="text-white font-medium">{row.studentName}</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => navigate(`/workspace/projects/${row.projectId}`)}
                className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[#c9b8a0] border border-white/10 hover:border-white/25 text-[11px] font-medium transition-all"
                title="View Project Dossier"
              >
                {row.projectId}
              </button>
              <span className="text-zinc-500 text-[11px]">{row.courseCode}</span>
            </div>
            <div className="text-[11px] text-zinc-400 flex items-center gap-1">
              <span>Custody:</span>
              <span className="text-zinc-300 font-medium">
                {teamLoans.length} active unit{teamLoans.length === 1 ? '' : 's'}
              </span>
              {isMyMentoredTeam && (
                <span className="ml-auto text-[10px] px-1.5 py-0.2 rounded bg-[#c9b8a0]/15 text-[#c9b8a0] font-medium border border-[#c9b8a0]/25">
                  Mentored
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      header: 'Compliance Health',
      accessor: 'teamReliabilityScore',
      width: '130px',
      render: (row) => {
        const isFlagged = row.teamReliabilityScore < 75;
        return (
          <div className="font-sans text-xs space-y-1">
            <div className="flex items-center gap-1.5">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                  isFlagged
                    ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {row.teamReliabilityScore}/100
              </span>
              {isFlagged && <AlertTriangle className="w-3.5 h-3.5 text-rose-400" title="Low Integrity Flag" />}
            </div>
            <div className="text-[10px] text-zinc-500">
              {isFlagged ? 'Scrutiny Required' : 'Clean Audit History'}
            </div>
          </div>
        );
      },
    },
    {
      header: 'Requested Components & Bench Stock',
      accessor: 'technicalPurpose',
      render: (row) => (
        <div className="space-y-2 font-sans text-xs">
          <div className="flex flex-wrap gap-1.5">
            {row.componentsRequested.map((c, i) => {
              const stock = getComponentStock(c);
              const isShortage = stock.count < c.quantity;
              return (
                <div
                  key={i}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] ${
                    isShortage
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                      : 'bg-white/[0.03] border-white/10 text-zinc-200'
                  }`}
                >
                  <span className="font-semibold text-white">{c.quantity}x</span>
                  <span>{c.nomenclature}</span>
                  <span className="text-[10px] text-zinc-400 font-mono pl-1 border-l border-white/10">
                    {stock.count > 0 ? `${stock.count} bench` : '0 avail'}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-zinc-400 text-xs italic font-normal leading-relaxed line-clamp-2">
            "{row.technicalPurpose}"
          </p>
        </div>
      ),
    },
    {
      header: 'Supervisor Review Controls',
      width: '260px',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5 font-sans text-xs">
          <button
            onClick={() => handleOpenModify(row)}
            className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Adjust Allocation Quantities"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => handleOpenEndorseWithCaveat(row)}
            className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-[#c9b8a0] hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Attach Restrictions & Endorse"
          >
            <FileText className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => handleOpenReject(row)}
            className="px-3 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 transition-colors flex items-center gap-1 cursor-pointer text-[11px] font-medium"
          >
            <X className="w-3 h-3" />
            <span>Reject</span>
          </button>

          <button
            onClick={() => handleQuickApprove(row.id)}
            className="px-3.5 py-1.5 rounded-full bg-white hover:bg-neutral-200 text-black font-semibold text-[11px] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Endorse</span>
          </button>
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
            Academic Governance & BOM Oversight
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white mt-1 font-display">
            Faculty Supervisor Review Desk
          </h1>
          <p className="text-[13px] text-zinc-400 mt-1 max-w-2xl font-normal leading-relaxed">
            Review capstone hardware proposals, inspect live bench stock, verify team reliability scores, and authorize equipment allocations.
          </p>
        </div>

        {/* Header Right: Scope Selector & View Mode Switcher */}
        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          {/* Scope Selector: Apple Segmented Pill */}
          <div className="flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1">
            <button
              onClick={() => setActiveScope('mentored')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeScope === 'mentored'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>My Mentored Teams</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeScope === 'mentored' ? 'bg-black/15 text-black font-bold' : 'bg-white/10 text-zinc-300'}`}>
                {mentoredPending.length}
              </span>
            </button>

            <button
              onClick={() => setActiveScope('all')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeScope === 'all'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>All Requests</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeScope === 'all' ? 'bg-black/15 text-black font-bold' : 'bg-white/10 text-zinc-300'}`}>
                {allPendingRequisitions.length}
              </span>
            </button>
          </div>

          {/* View Mode Switcher: Apple Segmented Pill */}
          <div className="flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Rich Proposal Dossier Cards"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dossier Cards</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Compact Ledger Table"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ledger Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. INSTANT SEARCH BAR & FAST-PASS BAR                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Real-time Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, PRN, project group, or component..."
            className="w-full pl-10 pr-4 py-2 bg-white/[0.03] border border-white/10 rounded-full font-sans text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-zinc-500 hover:text-white text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Fast-Pass Quick Batch Endorsement Button */}
        {filteredRequisitions.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBatchEndorseCompliant}
              disabled={isBatchApproving}
              className="px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>
                {isBatchApproving
                  ? 'Endorsing...'
                  : `Fast-Endorse Compliant (${filteredRequisitions.filter((r) => (r.teamReliabilityScore || 90) >= 75).length})`}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. PRIMARY VIEW: APPLE CUPERTINO PROPOSAL DOSSIER CARDS       */}
      {/* ───────────────────────────────────────────────────────────── */}
      {viewMode === 'grid' && (
        <div className="space-y-4">
          {filteredRequisitions.length > 0 ? (
            filteredRequisitions.map((req) => {
              const teamLoans = getTeamActiveLoans(req.projectId, req.studentPrn);
              const isMyMentoredTeam = isMentorMatch(req);
              const isFlagged = req.teamReliabilityScore < 75;

              return (
                <div
                  key={req.id}
                  className="group relative rounded-3xl p-6 bg-gradient-to-b from-[#16171b]/90 via-[#111215]/85 to-[#0a0a0d]/95 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl flex flex-col justify-between space-y-5"
                >
                  {/* Specular Edge Rim Reflection */}
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

                  {/* Card Header Row: Metadata & Governance */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-white font-mono text-[11px] font-semibold tracking-wider">
                          {req.id}
                        </span>
                        <button
                          type="button"
                          onClick={() => navigate(`/workspace/projects/${req.projectId}`)}
                          className="px-2.5 py-0.5 rounded-full bg-[#c9b8a0]/15 border border-[#c9b8a0]/30 text-[#f5e6c8] text-[11px] font-semibold hover:border-[#c9b8a0] transition-colors flex items-center gap-1 cursor-pointer"
                          title="Open Project Dossier"
                        >
                          <span>{req.projectId}</span>
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </button>
                        <span className="text-zinc-600 text-xs">•</span>
                        <span className="text-zinc-400 text-xs font-sans">{req.courseCode}</span>
                        {isMyMentoredTeam && (
                          <span className="px-2 py-0.5 rounded-full bg-[#c9b8a0]/15 border border-[#c9b8a0]/30 text-[#c9b8a0] text-[10px] font-semibold tracking-wide">
                            My Mentored Team
                          </span>
                        )}
                      </div>

                      <div className="text-white text-base font-semibold pt-1 flex items-center gap-2">
                        <span>{req.studentName}</span>
                        <span className="text-zinc-500 text-xs font-normal">PRN: {req.studentPrn}</span>
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        Requested on {formatFriendlyDate(req.requestDate)} • Assigned Mentor: <span className="text-zinc-300 font-medium">{req.mentorName}</span>
                      </div>
                    </div>

                    {/* Right Badges: Compliance & Milestone */}
                    <div className="flex sm:flex-col items-end gap-2 flex-shrink-0">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-xs shadow-sm">
                        <span
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            isFlagged
                              ? 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.6)]'
                              : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                          }`}
                        />
                        <span className="text-white font-semibold">{req.teamReliabilityScore}/100</span>
                        <span className="text-zinc-400 text-[11px]">Integrity</span>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-white/[0.04] text-zinc-400 border border-white/5 font-mono">
                        Milestone 2 Sprint
                      </span>
                    </div>
                  </div>

                  {/* Component Allocation Showcase with Physical Photography */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-zinc-400 font-semibold font-sans">
                      <span>Requested Hardware Components ({req.componentsRequested.length} items)</span>
                      <span className="text-[10px] text-zinc-500 font-mono">Real-Time Bench Inventory Checked</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {req.componentsRequested.map((comp, idx) => {
                        const stock = getComponentStock(comp);
                        const image = getItemImage(comp);
                        const isShortage = stock.count < comp.quantity;

                        return (
                          <div
                            key={idx}
                            className="p-3.5 rounded-2xl bg-black/50 border border-white/10 flex items-center gap-3 hover:border-white/20 transition-all shadow-inner"
                          >
                            <div className="w-14 h-14 rounded-xl bg-black/70 border border-white/10 p-1.5 flex items-center justify-center flex-shrink-0 shadow-sm">
                              <img
                                src={image}
                                alt={comp.nomenclature}
                                className="max-h-full max-w-full object-contain filter drop-shadow"
                                onError={(e) => {
                                  e.target.src = '/images/hardware/raspberry-pi-5.jpg';
                                }}
                              />
                            </div>
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="text-xs font-semibold text-white truncate leading-snug">
                                {comp.nomenclature}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-[10px] font-bold">
                                  {comp.quantity}x
                                </span>
                                <span
                                  className={`text-[10px] font-sans ${
                                    isShortage ? 'text-amber-400 font-medium' : 'text-zinc-400'
                                  }`}
                                >
                                  {stock.count > 0 ? `${stock.count} in depot` : 'Depot exhausted'}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Technical Purpose & Curriculum Justification */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-1.5">
                    <div className="text-[10px] uppercase tracking-wider text-[#c9b8a0] font-semibold flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Technical Purpose & Curriculum Justification</span>
                    </div>
                    <p className="text-xs font-sans text-zinc-200 leading-relaxed italic">
                      "{req.technicalPurpose}"
                    </p>
                  </div>

                  {/* Immediate Active Custody Burden (Human Context) */}
                  {teamLoans.length > 0 && (
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-zinc-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                        <span>
                          Team currently holding <strong className="text-white">{teamLoans.length} active unit{teamLoans.length === 1 ? '' : 's'}</strong>:
                          {' '}{teamLoans.map((l) => `${l.nomenclature} (${l.assetTag})`).join(', ')}
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-500 font-sans flex-shrink-0">
                        Earliest Due: {teamLoans[0]?.dueDate?.split(' ')[0]}
                      </span>
                    </div>
                  )}

                  {/* Action Command Bar */}
                  <div className="pt-3 border-t border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    {/* 1-Click Fast Remark Presets */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider mr-1">
                        Fast Presets:
                      </span>
                      {[
                        'Coursework Validated',
                        'Lab 402 Bench Only',
                        'Sprint 2 Authorized',
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handleQuickApprove(req.id, preset)}
                          className="px-2.5 py-1 rounded-full text-[10px] font-sans font-medium bg-white/[0.04] text-zinc-300 border border-white/10 hover:border-white/25 hover:text-white transition-all cursor-pointer"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModify(req)}
                        className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                        title="Adjust Component Quantities"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleOpenEndorseWithCaveat(req)}
                        className="px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-[#c9b8a0] hover:text-white border border-white/10 transition-colors text-xs font-medium cursor-pointer"
                        title="Attach Custom Restrictions & Time Caps"
                      >
                        <span>Add Caveat</span>
                      </button>

                      <button
                        onClick={() => handleOpenReject(req)}
                        className="px-3 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 transition-colors text-xs font-medium cursor-pointer flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => handleQuickApprove(req.id)}
                        className="px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Endorse</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-16 text-center space-y-3 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
              <CheckSquare className="w-10 h-10 mx-auto text-zinc-600 stroke-[1.5]" />
              <h3 className="text-white text-base font-semibold">Review Queue Clear</h3>
              <p className="text-zinc-400 text-xs max-w-sm mx-auto font-sans">
                {searchQuery
                  ? `No pending requisitions matched "${searchQuery}".`
                  : 'No student hardware requests currently pending faculty endorsement in this scope.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. SECONDARY VIEW: COMPACT LEDGER TABLE                       */}
      {/* ───────────────────────────────────────────────────────────── */}
      {viewMode === 'table' && (
        <DataTable
          columns={columns}
          data={filteredRequisitions}
          pageSize={8}
          emptyMessage="Requisition queue clear. No student hardware requests currently pending faculty review in this scope."
        />
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 1: ENDORSE WITH RESTRICTIONS & ACADEMIC CAVEATS         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={!!endorseModalReq}
        onClose={() => setEndorseModalReq(null)}
        title={`Authorize Endorsement: ${endorseModalReq?.id}`}
        subtitle={`Requester: ${endorseModalReq?.studentName} • ${endorseModalReq?.projectId}`}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleConfirmEndorseWithCaveat} className="space-y-4 text-xs font-sans text-zinc-300">
          {/* Location Authorization */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-2">
              Authorized Custody Boundary
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'Room 402 Bench Only', label: 'Room 402 Bench Only', desc: 'No off-campus or hostel removal' },
                { id: 'Open Campus / Lab Clearance', label: 'Open Campus Permitted', desc: 'Coursework term deployment authorized' },
              ].map((loc) => {
                const isSelected = authorizedLocation === loc.id;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => setAuthorizedLocation(loc.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-black font-semibold border-white shadow-sm'
                        : 'bg-white/[0.03] text-zinc-400 border-white/10 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-semibold">{loc.label}</div>
                    <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-zinc-700' : 'text-zinc-500'}`}>
                      {loc.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Term Cap */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-2">
              Milestone Time Cap
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['48-Hour Rapid Benchmark', '14-Day Sprint', 'Full Term Clearance'].map((term) => {
                const isSelected = authorizedTerm === term;
                return (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setAuthorizedTerm(term)}
                    className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer text-[11px] font-medium ${
                      isSelected
                        ? 'bg-white text-black font-semibold border-white shadow-sm'
                        : 'bg-white/[0.03] text-zinc-400 border-white/10 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {term}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Faculty Remarks Textarea */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1.5">
              Faculty Endorsement Notes
            </label>
            <textarea
              rows={3}
              value={customEndorsementNotes}
              onChange={(e) => setCustomEndorsementNotes(e.target.value)}
              placeholder="e.g. Authorized for capstone benchmark in Lab 3. Return before Friday evaluation."
              className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 transition-all font-sans text-xs"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setEndorseModalReq(null)}
              className="px-4 py-2 rounded-full border border-white/10 text-xs text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-all shadow-md cursor-pointer"
            >
              Commit Endorsement
            </button>
          </div>
        </form>
      </Modal>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 2: REJECT REQUISITION                                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={!!rejectModalReq}
        onClose={() => setRejectModalReq(null)}
        title={`Reject Requisition: ${rejectModalReq?.id}`}
        subtitle={`Requester: ${rejectModalReq?.studentName} • ${rejectModalReq?.projectId}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleConfirmReject} className="space-y-4 text-xs font-sans text-zinc-300">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
              Academic Reason / Rejection Rationale <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Requested hardware exceeds approved capstone scope. Consult with supervisor during Tuesday office hours."
              className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-500/50 transition-all font-sans text-xs"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setRejectModalReq(null)}
              className="px-4 py-2 rounded-full border border-white/10 text-xs text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-rose-500 hover:bg-rose-400 text-white text-xs font-semibold transition-all shadow-md cursor-pointer"
            >
              Record Rejection
            </button>
          </div>
        </form>
      </Modal>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 3: MODIFY ALLOCATION QUANTITIES                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={!!modifyModalReq}
        onClose={() => setModifyModalReq(null)}
        title={`Adjust Allocated Quantities: ${modifyModalReq?.id}`}
        subtitle="Decrease or adjust authorized component counts prior to counter dispatch."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleConfirmModify} className="space-y-4 text-xs font-sans text-zinc-300">
          <div className="space-y-2.5">
            {modifyModalReq?.componentsRequested.map((comp, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/10 rounded-xl font-sans">
                <span className="text-white text-xs truncate max-w-[240px]">{comp.nomenclature}</span>
                <div className="flex items-center gap-2">
                  <label className="text-zinc-400 text-[11px]">Approved:</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={modifiedQuantities[idx] ?? comp.quantity}
                    onChange={(e) =>
                      setModifiedQuantities({
                        ...modifiedQuantities,
                        [idx]: e.target.value,
                      })
                    }
                    className="w-16 px-2.5 py-1.5 bg-[#141417] border border-white/15 rounded-xl text-white text-center text-xs font-semibold focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setModifyModalReq(null)}
              className="px-4 py-2 rounded-full border border-white/10 text-xs text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-all shadow-md cursor-pointer"
            >
              Save Allocation Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ApprovalsQueuePage;
