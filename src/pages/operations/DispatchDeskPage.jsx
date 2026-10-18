import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLabData } from '../../context/LabDataContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { InspectionForm } from '../../components/specialized/InspectionForm';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import {
  Terminal,
  Search,
  CheckCircle2,
  Package,
  RotateCcw,
  Send,
  User,
  ShieldCheck,
  Check,
  Clock,
  Layers,
  Download,
  LayoutGrid,
  Table as TableIcon,
  Eye,
  MapPin,
  Boxes,
  AlertTriangle,
} from 'lucide-react';

export function DispatchDeskPage() {
  const [searchParams] = useSearchParams();
  const urlMode = searchParams.get('mode');
  const urlAssetTag = searchParams.get('assetTag');

  const {
    inventory,
    requisitions,
    activeLoans,
    executeDispatch,
    executeReturn,
  } = useLabData();
  const { currentUser } = useAuth();

  // Mode switcher: 'dispatch' | 'checkin' | 'circulation'
  const [terminalMode, setTerminalMode] = useState(() => {
    if (urlMode === 'checkin') return 'checkin';
    if (urlMode === 'circulation' || urlMode === 'ledger') return 'circulation';
    return 'dispatch';
  });

  // DISPATCH STATE
  const [dispatchSearchPrn, setDispatchSearchPrn] = useState('');
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [selectedAssetTag, setSelectedAssetTag] = useState('');
  const [assignedTags, setAssignedTags] = useState({});
  const [dueDateDays, setDueDateDays] = useState('14');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(null);

  // CHECKIN STATE
  const [checkinSearchQuery, setCheckinSearchQuery] = useState(urlAssetTag || '');
  const [returnSuccess, setReturnSuccess] = useState(null);
  const [isBatchReturning, setIsBatchReturning] = useState(false);
  const [selectedReturnLoan, setSelectedReturnLoan] = useState(() => {
    if (urlAssetTag && activeLoans.length > 0) {
      return activeLoans.find((l) => l.assetTag === urlAssetTag) || null;
    }
    return null;
  });

  // CIRCULATION REGISTRY (MODE 3) STATE
  const [circulationFilter, setCirculationFilter] = useState('all');
  const [circulationSearch, setCirculationSearch] = useState('');
  const [circulationViewMode, setCirculationViewMode] = useState('grid');
  const [inspectedCirculationLoan, setInspectedCirculationLoan] = useState(null);

  // Keep synced if url search params change
  useEffect(() => {
    if (urlMode === 'checkin') {
      setTerminalMode('checkin');
    } else if (urlMode === 'circulation' || urlMode === 'ledger') {
      setTerminalMode('circulation');
    }
    if (urlAssetTag) {
      setCheckinSearchQuery(urlAssetTag);
      const matched = activeLoans.find((l) => l.assetTag === urlAssetTag);
      if (matched) {
        setSelectedReturnLoan(matched);
      }
    }
  }, [urlMode, urlAssetTag, activeLoans]);

  // Inventory lookup helper
  const getInventoryItem = (assetTag) => {
    return inventory.find((i) => i.assetTag === assetTag || i.id === assetTag) || {};
  };

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

  // Circulation telemetry metrics
  const circulationStats = useMemo(() => {
    const total = activeLoans.length;
    const imminent = activeLoans.filter((l) => l.status === 'Imminent').length;
    const overdue = activeLoans.filter((l) => l.status === 'Overdue').length;
    const normal = activeLoans.filter((l) => l.status === 'Normal').length;
    return { total, imminent, overdue, normal };
  }, [activeLoans]);

  // Filtered circulation loans
  const filteredCirculationLoans = useMemo(() => {
    return activeLoans.filter((loan) => {
      if (circulationFilter === 'Normal' && loan.status !== 'Normal') return false;
      if (circulationFilter === 'Imminent' && loan.status !== 'Imminent') return false;
      if (circulationFilter === 'Overdue' && loan.status !== 'Overdue') return false;

      if (circulationSearch.trim()) {
        const q = circulationSearch.toLowerCase();
        return (
          loan.nomenclature?.toLowerCase().includes(q) ||
          loan.assetTag?.toLowerCase().includes(q) ||
          loan.id?.toLowerCase().includes(q) ||
          loan.locationCoordinates?.toLowerCase().includes(q) ||
          loan.borrowerName?.toLowerCase().includes(q) ||
          loan.borrowerPrn?.toLowerCase().includes(q) ||
          loan.projectId?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeLoans, circulationFilter, circulationSearch]);

  // Export Circulation Registry to CSV
  const handleExportCirculationCSV = () => {
    if (!filteredCirculationLoans.length) return;
    const headers = ['Loan ID', 'Asset Tag', 'Nomenclature', 'Borrower Name', 'Borrower PRN', 'Project ID', 'Course Code', 'Checked Out Date', 'Due Date', 'Status', 'Days Remaining', 'Depot Coordinates'];
    const rows = filteredCirculationLoans.map((l) => [
      `"${l.id}"`,
      `"${l.assetTag}"`,
      `"${l.nomenclature}"`,
      `"${l.borrowerName}"`,
      `"${l.borrowerPrn}"`,
      `"${l.projectId}"`,
      `"${l.courseCode}"`,
      `"${l.checkedOutDate}"`,
      `"${l.dueDate}"`,
      `"${l.status}"`,
      `"${l.daysRemaining}"`,
      `"${l.locationCoordinates}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `labtrack-circulation-ledger-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryStyle = (item) => {
    const cat = (item?.category || item?.classification || '').toLowerCase();
    const nom = (item?.nomenclature || '').toLowerCase();

    if (cat.includes('ai edge') || cat.includes('sbc') || nom.includes('jetson') || nom.includes('raspberry')) {
      return {
        badgeBg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
        pedestalGlow: 'bg-indigo-500/25',
        borderHover: 'hover:border-indigo-500/40',
        cardBg: 'from-[#121422]/90 via-[#0e0f18]/85 to-[#08090f]/95',
        tag: 'AI Compute & Edge',
      };
    }
    if (cat.includes('microcontroller') || nom.includes('arduino') || nom.includes('esp32')) {
      return {
        badgeBg: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
        pedestalGlow: 'bg-sky-500/25',
        borderHover: 'hover:border-sky-500/40',
        cardBg: 'from-[#0e1622]/90 via-[#0a111a]/85 to-[#08090f]/95',
        tag: 'Microcontroller',
      };
    }
    if (cat.includes('sensor') || nom.includes('sensor') || nom.includes('imu') || nom.includes('oled') || nom.includes('bmp')) {
      return {
        badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        pedestalGlow: 'bg-amber-500/25',
        borderHover: 'hover:border-amber-500/40',
        cardBg: 'from-[#1a160e]/90 via-[#14100a]/85 to-[#08090f]/95',
        tag: 'Sensor & Module',
      };
    }
    if (cat.includes('instrument') || nom.includes('oscilloscope') || nom.includes('analyzer')) {
      return {
        badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
        pedestalGlow: 'bg-purple-500/25',
        borderHover: 'hover:border-purple-500/40',
        cardBg: 'from-[#191022]/90 via-[#130b1c]/85 to-[#08090f]/95',
        tag: 'Test Instrument',
      };
    }
    return {
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      pedestalGlow: 'bg-emerald-500/25',
      borderHover: 'hover:border-emerald-500/40',
      cardBg: 'from-[#0e1a16]/90 via-[#0a1411]/85 to-[#08090f]/95',
      tag: item?.category || 'Bench Hardware',
    };
  };

  const getSpecChips = (item) => {
    const nom = (item?.nomenclature || '').toLowerCase();
    const specs = (item?.subSpecs || '');
    if (nom.includes('raspberry pi 5')) return ['Quad ARM A76', '8GB LPDDR4X', 'Dual 4Kp60'];
    if (nom.includes('jetson nano')) return ['128-core Maxwell GPU', '4GB LPDDR4', '40-pin GPIO'];
    if (nom.includes('arduino uno')) return ['ATmega328P', '14 Digital I/O', 'USB Type-B'];
    if (nom.includes('esp32')) return ['Dual-Core 240MHz', 'Wi-Fi & BLE 4.2', '4MB Flash'];
    if (nom.includes('oscilloscope')) return ['50MHz Bandwidth', '4 Channels', '1GSa/s'];
    if (nom.includes('oled')) return ['0.96" Monochrome', '128x64 Pixels', 'I2C Interface'];
    if (nom.includes('bmp280')) return ['Barometric & Temp', 'I2C / SPI Bus', 'High Accuracy'];
    if (nom.includes('mpu-6050')) return ['6-Axis Gyro & Accel', 'Digital Motion', 'I2C Fast'];
    if (nom.includes('jumper')) return ['120-Pin Ribbon', 'Male-to-Female', '20cm Length'];
    if (nom.includes('breadboard')) return ['830 Tie-Points', 'Dual Power Rails', 'Nickel Plated'];
    if (nom.includes('resistor')) return ['600pcs Assorted', '1/4W Metal Film', '1% Precision'];

    if (specs) {
      return specs.split(',').slice(0, 3).map((s) => s.trim()).filter(Boolean);
    }
    return ['Certified Laboratory Grade', 'Active Loan'];
  };

  // Circulation Table Columns
  const circulationTableColumns = [
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
              <div className="font-sans text-xs font-semibold text-white">{row.assetTag}</div>
              <div className="font-sans text-[11px] text-zinc-500">{row.id}</div>
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
          <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-0.5 font-sans">
            <MapPin className="w-3 h-3 text-[#c9b8a0]" />
            <span>Depot: {row.locationCoordinates}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Custody Holder',
      accessor: 'borrowerName',
      width: '190px',
      render: (row) => (
        <div className="text-xs">
          <div className="text-white font-medium">{row.borrowerName}</div>
          <div className="text-zinc-400 text-[11px] font-sans">
            PRN: {row.borrowerPrn} • <span className="text-[#c9b8a0]">{row.projectId}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Issued Date',
      accessor: 'checkedOutDate',
      width: '120px',
      render: (row) => (
        <span className="font-sans text-xs text-zinc-400">
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
          <div className="text-white font-sans font-medium">{row.dueDate?.split(' ')[0]}</div>
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
      width: '160px',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setInspectedCirculationLoan(row)}
            className="p-1.5 rounded-full border border-white/10 text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
            title="Inspect Specs"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setTerminalMode('checkin');
              setSelectedReturnLoan(row);
              setCheckinSearchQuery(row.assetTag);
            }}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-zinc-200 text-black shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
            title="Process counter check-in & inspection"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Process Return</span>
          </button>
        </div>
      ),
    },
  ];

  // Strictly filter pre-approved requisitions ready for physical counter handover
  const readyRequisitions = useMemo(() => {
    const approved = requisitions.filter(
      (r) =>
        r.status === 'Approved' ||
        r.status === 'Faculty Endorsed' ||
        r.status === 'Ready for Counter Pickup'
    );
    if (!dispatchSearchPrn.trim()) return approved;
    const query = dispatchSearchPrn.toLowerCase();
    return approved.filter(
      (r) =>
        r.studentPrn?.toLowerCase().includes(query) ||
        r.studentName?.toLowerCase().includes(query) ||
        r.projectId?.toLowerCase().includes(query) ||
        r.id?.toLowerCase().includes(query)
    );
  }, [requisitions, dispatchSearchPrn]);

  // Filter available serialized physical assets for allocation
  const availableSerializedAssets = useMemo(() => {
    return inventory.filter(
      (item) => item.classification === 'Asset' && item.stockStatus === 'Available'
    );
  }, [inventory]);

  // Matching assets for the selected requisition
  const matchingAssets = useMemo(() => {
    if (!selectedRequisition || !selectedRequisition.componentsRequested?.length) {
      return availableSerializedAssets;
    }
    const requestedNoms = selectedRequisition.componentsRequested.map((c) =>
      c.nomenclature.toLowerCase()
    );
    const matched = availableSerializedAssets.filter((asset) =>
      requestedNoms.some(
        (nom) =>
          asset.nomenclature.toLowerCase().includes(nom) ||
          nom.includes(asset.nomenclature.toLowerCase())
      )
    );
    return matched.length > 0 ? matched : availableSerializedAssets;
  }, [selectedRequisition, availableSerializedAssets]);

  // Sync assignedTags whenever selectedRequisition changes
  useEffect(() => {
    if (selectedRequisition?.componentsRequested?.length) {
      const initial = {};
      selectedRequisition.componentsRequested.forEach((comp, idx) => {
        const match = availableSerializedAssets.find(
          (a) =>
            a.nomenclature.toLowerCase().includes(comp.nomenclature.toLowerCase()) ||
            comp.nomenclature.toLowerCase().includes(a.nomenclature.toLowerCase())
        );
        if (match) {
          initial[idx] = match.assetTag;
        } else if (availableSerializedAssets[idx]) {
          initial[idx] = availableSerializedAssets[idx].assetTag;
        }
      });
      setAssignedTags(initial);
      setSelectedAssetTag(initial[0] || '');
    } else {
      setAssignedTags({});
      setSelectedAssetTag('');
    }
  }, [selectedRequisition, availableSerializedAssets]);

  // Filter active loans for check-in
  const matchingReturnLoans = useMemo(() => {
    if (!checkinSearchQuery.trim()) return activeLoans;
    const query = checkinSearchQuery.toLowerCase();
    return activeLoans.filter((loan) => {
      return (
        loan.assetTag?.toLowerCase().includes(query) ||
        loan.borrowerPrn?.toLowerCase().includes(query) ||
        loan.borrowerName?.toLowerCase().includes(query) ||
        loan.nomenclature?.toLowerCase().includes(query)
      );
    });
  }, [activeLoans, checkinSearchQuery]);

  // Detect student kit with multiple loans under active search
  const groupedBorrowerLoans = useMemo(() => {
    if (!checkinSearchQuery.trim()) return null;
    const query = checkinSearchQuery.toLowerCase();
    const loans = activeLoans.filter(
      (l) => l.borrowerPrn?.toLowerCase() === query || l.borrowerName?.toLowerCase().includes(query)
    );
    return loans.length > 1 ? loans : null;
  }, [activeLoans, checkinSearchQuery]);

  const handleBatchReturnClean = async (loansToReturn) => {
    if (!loansToReturn?.length) return;
    setIsBatchReturning(true);
    try {
      const defaultChecklist = {
        physicalIntegrity: true,
        powerTest: true,
        firmwareReset: true,
        accessoriesPresent: true,
        esdPackaging: true,
      };
      for (const loan of loansToReturn) {
        await executeReturn(loan.id, defaultChecklist, 'clean', null);
      }
      setReturnSuccess({
        assetTag: `${loansToReturn.length} Units`,
        nomenclature: `${loansToReturn.length} Kit Items Restocked`,
        returnType: 'clean',
        borrowerName: loansToReturn[0].borrowerName,
        borrowerPrn: loansToReturn[0].borrowerPrn,
        locationCoordinates: 'Assigned Shelves',
      });
      setSelectedReturnLoan(null);
    } finally {
      setIsBatchReturning(false);
    }
  };

  const handleExecuteDispatch = async (e) => {
    e.preventDefault();
    if (!selectedRequisition) return;
    setIsDispatching(true);

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Number(dueDateDays));
    const formattedDueDate = dueDate.toISOString().replace('T', ' ').substring(0, 19);

    try {
      const dispatchedTags = [];
      const components = selectedRequisition.componentsRequested?.length
        ? selectedRequisition.componentsRequested
        : [{ nomenclature: 'Laboratory Hardware', quantity: 1 }];

      for (let i = 0; i < components.length; i++) {
        const comp = components[i];
        const tag = assignedTags[i] || selectedAssetTag;
        if (tag) {
          const assetObj = inventory.find((it) => it.assetTag === tag);
          await executeDispatch({
            requisitionId: selectedRequisition.id,
            assetTag: tag,
            nomenclature: assetObj?.nomenclature || comp.nomenclature,
            studentPrn: selectedRequisition.studentPrn,
            studentName: selectedRequisition.studentName,
            projectId: selectedRequisition.projectId,
            courseCode: selectedRequisition.courseCode || 'DCDS-SY-AIML',
            dueDate: formattedDueDate,
            coordinates: assetObj?.coordinates || 'Room 402 • Counter Tray',
          });
          dispatchedTags.push(tag);
        }
      }

      if (dispatchedTags.length > 0) {
        setDispatchSuccess({
          assetTag: dispatchedTags.join(', '),
          borrowerName: selectedRequisition.studentName,
          borrowerPrn: selectedRequisition.studentPrn,
        });
        setSelectedRequisition(null);
        setSelectedAssetTag('');
        setAssignedTags({});
        setTimeout(() => setDispatchSuccess(null), 4000);
      }
    } finally {
      setIsDispatching(false);
    }
  };

  const handleCompleteInspection = async ({ checklist, returnType, defectDetails }) => {
    if (!selectedReturnLoan) return;
    const loanRef = selectedReturnLoan;
    const success = await executeReturn(loanRef.id, checklist, returnType, defectDetails);
    if (success) {
      setReturnSuccess({
        assetTag: loanRef.assetTag,
        nomenclature: loanRef.nomenclature,
        returnType,
        borrowerName: loanRef.borrowerName,
        borrowerPrn: loanRef.borrowerPrn,
        locationCoordinates: loanRef.locationCoordinates,
      });
      setSelectedReturnLoan(null);
      setTimeout(() => setReturnSuccess(null), 6000);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER & OPERATIONAL DESK CONTEXT                      */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#c9b8a0]">
            Assistant Station • Counter 2
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white mt-1 font-display">
            Dispatch & Returns
          </h1>
          <p className="text-[13px] text-zinc-400 mt-1 font-normal">
            Order handovers, 5-point return triage, and live circulation.
          </p>
        </div>

        {/* 3-Mode Switcher: Segmented Control */}
        <div className="inline-flex p-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl overflow-x-auto no-scrollbar">
          <button
            onClick={() => setTerminalMode('dispatch')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              terminalMode === 'dispatch'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Handover</span>
            {readyRequisitions.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                terminalMode === 'dispatch' ? 'bg-black/10 text-black' : 'bg-white/10 text-white'
              }`}>
                {readyRequisitions.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTerminalMode('checkin')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              terminalMode === 'checkin'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Return Intake</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              terminalMode === 'checkin' ? 'bg-black/10 text-black' : 'bg-white/10 text-white'
            }`}>
              {activeLoans.length}
            </span>
          </button>
          <button
            onClick={() => setTerminalMode('circulation')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              terminalMode === 'circulation'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Circulation</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              terminalMode === 'circulation' ? 'bg-black/10 text-black' : 'bg-white/10 text-white'
            }`}>
              {activeLoans.length}
            </span>
          </button>
        </div>
      </div>

      {/* Dispatch Success Alert Banner */}
      {dispatchSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-center justify-between text-emerald-300 text-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="font-semibold text-white">Hardware Dispatch Committed:</span>{' '}
              Asset <span className="font-semibold text-emerald-300">{dispatchSuccess.assetTag}</span> successfully checked out to{' '}
              <span className="text-white font-medium">{dispatchSuccess.borrowerName}</span> (PRN {dispatchSuccess.borrowerPrn}).
            </div>
          </div>
          <button
            onClick={() => setDispatchSuccess(null)}
            className="text-emerald-400 hover:text-white text-xs cursor-pointer ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Return & Stock Reset Success Alert Banner */}
      {returnSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-center justify-between text-emerald-300 text-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="font-semibold text-white">
                {returnSuccess.returnType === 'clean' ? 'Hardware Verified & Stock Reset:' : 'Defect Logged & Quarantined:'}
              </span>{' '}
              Asset <span className="font-semibold text-emerald-300">{returnSuccess.assetTag}</span> ({returnSuccess.nomenclature}) returned by{' '}
              <span className="text-white font-medium">{returnSuccess.borrowerName}</span> (PRN {returnSuccess.borrowerPrn}).{' '}
              {returnSuccess.returnType === 'clean' ? (
                <span>
                  Physical inspection & firmware reset passed. Available stock incremented by <span className="font-bold text-white">+1</span> at {returnSuccess.locationCoordinates || 'Shelf CB-04'}.
                </span>
              ) : (
                <span>
                  Hardware quarantined to Defect Bench. Recorded in institutional repair ledger.
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setReturnSuccess(null)}
            className="text-emerald-400 hover:text-white text-xs cursor-pointer ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 1: DISPATCH DESK                                                     */}
      {/* ========================================================================= */}
      {terminalMode === 'dispatch' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Student Lookup & Endorsed Orders (6 cols) */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl h-full flex flex-col min-h-[580px]">
              {/* Header */}
              <div className="flex items-center justify-between text-zinc-400 uppercase text-xs font-semibold border-b border-white/[0.06] pb-3 font-sans">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#c9b8a0]" />
                  <span>Step 1: Rapid Student PRN / Order Search</span>
                </div>
                <span className="text-white px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-medium font-sans">
                  {readyRequisitions.length} Ready for Pickup
                </span>
              </div>

              {/* Integrated Search Bar */}
              <div className="pt-3 pb-2 space-y-1.5">
                <div className="relative">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={dispatchSearchPrn}
                    onChange={(e) => setDispatchSearchPrn(e.target.value)}
                    placeholder="Enter Student PRN (e.g. 202401048) or Requisition ID..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl font-sans text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 transition-all"
                  />
                </div>
                <p className="text-[11px] text-zinc-500 font-sans">
                  Shows faculty-approved requisitions awaiting physical counter handover.
                </p>
              </div>

              {/* Pre-Approved Requisitions List */}
              <div className="flex-1 overflow-y-auto space-y-2.5 mt-2 pr-1 min-h-[360px]">
                {readyRequisitions.length > 0 ? (
                  readyRequisitions.map((req) => {
                    const isSelected = selectedRequisition?.id === req.id;
                    return (
                      <div
                        key={req.id}
                        onClick={() => {
                          setSelectedRequisition(req);
                          setSelectedAssetTag('');
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white/[0.08] border-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
                            : 'bg-white/[0.02] border-white/[0.06] hover:border-white/20 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white tracking-wide">{req.id}</span>
                          <StatusBadge status={req.status} type="requisition" size="xs" />
                        </div>

                        <div className="mt-2 space-y-0.5">
                          <div className="text-white font-medium flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-zinc-400" />
                            <span>{req.studentName}</span>
                            <span className="text-zinc-500 text-xs">({req.studentPrn})</span>
                          </div>
                          <div className="text-zinc-400 text-[11px] pl-5">
                            {req.projectId} • Mentor: {req.mentorName}
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex flex-wrap gap-1.5">
                          {req.componentsRequested?.map((c, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-full bg-white/[0.04] text-zinc-200 border border-white/10 text-[11px] font-medium"
                            >
                              {c.quantity}x {c.nomenclature}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center text-zinc-500 text-xs space-y-1">
                    <Package className="w-8 h-8 opacity-30 stroke-[1.5]" />
                    <p>No pre-approved requisitions awaiting counter pickup.</p>
                    {dispatchSearchPrn && (
                      <button
                        onClick={() => setDispatchSearchPrn('')}
                        className="text-xs text-white underline hover:opacity-80 pt-1 cursor-pointer"
                      >
                        Clear search filter
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Physical Asset Assignment & Checkout Commit (6 cols) */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl h-full flex flex-col min-h-[580px] font-sans text-xs">
              {/* Header */}
              <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold border-b border-white/[0.06] pb-3 flex items-center justify-between font-sans">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Step 2: Physical Serialized Allocation & Checkout</span>
                </div>
                {selectedRequisition && (
                  <span className="text-[#c9b8a0] font-sans text-[11px]">
                    Order {selectedRequisition.id}
                  </span>
                )}
              </div>

              {selectedRequisition ? (
                <form onSubmit={handleExecuteDispatch} className="flex-1 flex flex-col justify-between pt-3 space-y-4">
                  {/* Selected Requisition Summary */}
                  <div className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.08] space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                      <span>Selected Order</span>
                      <span className="font-semibold text-white">{selectedRequisition.id}</span>
                    </div>
                    <div className="text-white font-medium text-xs">
                      Requester: {selectedRequisition.studentName} ({selectedRequisition.studentPrn})
                    </div>
                    <div className="text-zinc-400 text-[11px]">
                      Project: {selectedRequisition.projectId} • Faculty: {selectedRequisition.mentorName}
                    </div>
                    <div className="pt-1.5 text-zinc-300 text-[11px]">
                      Requested: {selectedRequisition.componentsRequested?.map((c) => `${c.quantity}x ${c.nomenclature}`).join(', ')}
                    </div>
                  </div>

                  {/* Physical Asset Tag Picker (Kit & Single Item Allocation) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-zinc-400 text-[11px] uppercase tracking-wider font-semibold">
                        Allocate Physical Hardware Serial(s) <span className="text-rose-400">*</span>
                      </label>
                      <span className="text-[10px] text-zinc-500">
                        {availableSerializedAssets.length} total units on bench
                      </span>
                    </div>

                    {(selectedRequisition.componentsRequested?.length
                      ? selectedRequisition.componentsRequested
                      : [{ nomenclature: 'Laboratory Hardware', quantity: 1 }]
                    ).map((comp, idx) => {
                      const compMatchedAssets = availableSerializedAssets.filter((a) =>
                        a.nomenclature.toLowerCase().includes(comp.nomenclature.toLowerCase()) ||
                        comp.nomenclature.toLowerCase().includes(a.nomenclature.toLowerCase())
                      );
                      const assetOptions = compMatchedAssets.length > 0 ? compMatchedAssets : availableSerializedAssets;
                      const currentTag = assignedTags[idx] || (idx === 0 ? selectedAssetTag : '');

                      return (
                        <div key={idx} className="p-3 bg-white/[0.02] border border-white/[0.08] rounded-xl space-y-1.5">
                          <div className="flex items-center justify-between text-xs text-white">
                            <span className="font-medium text-zinc-200">
                              Item {idx + 1}: {comp.nomenclature}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-400 font-mono">
                              Qty: {comp.quantity || 1}
                            </span>
                          </div>
                          <select
                            value={currentTag}
                            onChange={(e) => {
                              const val = e.target.value;
                              setAssignedTags((prev) => ({ ...prev, [idx]: val }));
                              if (idx === 0) setSelectedAssetTag(val);
                            }}
                            required
                            className="w-full bg-[#111317] border border-white/15 rounded-xl px-3 py-2 font-sans text-xs text-white focus:outline-none focus:border-white/30 transition-all cursor-pointer"
                          >
                            <option value="" className="bg-[#111317]">
                              -- Select physical unit for {comp.nomenclature} --
                            </option>
                            {assetOptions.map((asset) => (
                              <option key={asset.id} value={asset.assetTag} className="bg-[#111317]">
                                {asset.assetTag} — {asset.nomenclature} ({asset.coordinates || 'Depot'})
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>

                  {/* Loan Duration Window Selector */}
                  <div>
                    <label className="block text-zinc-400 text-[11px] uppercase tracking-wider font-semibold mb-1.5">
                      Loan Duration Window (Collegiate Term Cap)
                    </label>
                    <select
                      value={dueDateDays}
                      onChange={(e) => setDueDateDays(e.target.value)}
                      className="w-full bg-[#111317] border border-white/15 rounded-xl px-3.5 py-2.5 font-sans text-xs text-white focus:outline-none focus:border-white/30 transition-all cursor-pointer"
                    >
                      <option value="7" className="bg-[#111317]">7 Days (Standard Coursework Check)</option>
                      <option value="14" className="bg-[#111317]">14 Days (Standard Two-Week Sprint)</option>
                      <option value="21" className="bg-[#111317]">21 Days (Capstone Milestone Duration)</option>
                      <option value="30" className="bg-[#111317]">30 Days (Extended Semester Term)</option>
                    </select>
                  </div>

                  {/* Counter Verification Checklist */}
                  <div className="p-3.5 bg-white/[0.02] rounded-xl border border-white/[0.08] space-y-1.5 text-zinc-400 text-[11px]">
                    <div className="font-semibold text-white flex items-center gap-1.5 pb-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-zinc-300" />
                      <span>Counter Handover Protocols:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-zinc-400" />
                      <span>Student collegiate photo PRN card verified at counter desk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-zinc-400" />
                      <span>Faculty supervisor project endorsement confirmed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-zinc-400" />
                      <span>Anti-static conductive pouch & power accessories packaged</span>
                    </div>
                  </div>

                  {/* Dispatch Commit Button */}
                  <button
                    type="submit"
                    disabled={
                      isDispatching ||
                      !(selectedRequisition.componentsRequested?.length
                        ? selectedRequisition.componentsRequested.every((_, idx) => assignedTags[idx])
                        : (selectedAssetTag || assignedTags[0]))
                    }
                    className="w-full py-3 px-4 rounded-full bg-white hover:bg-neutral-200 disabled:opacity-40 disabled:hover:bg-white text-black font-semibold text-xs tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer mt-auto"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {isDispatching ? 'Committing Relational Record...' : 'Execute Counter Dispatch'}
                    </span>
                  </button>
                </form>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-zinc-500 font-sans text-xs space-y-2 p-6 min-h-[360px]">
                  <Package className="w-10 h-10 mx-auto opacity-30 stroke-[1.5]" />
                  <div className="text-sm font-medium text-white">No Order Selected</div>
                  <p className="max-w-xs text-zinc-400">
                    Select a pre-approved requisition from the left panel to begin physical equipment dispatch and asset allocation.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: CHECK-IN & RETURN MODE                                            */}
      {/* ========================================================================= */}
      {terminalMode === 'checkin' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Rapid Search & Active Loan Selection (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl h-full flex flex-col min-h-[580px] font-sans text-xs">
              <div className="flex items-center justify-between text-zinc-400 uppercase text-xs font-semibold border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[#c9b8a0]" />
                  <span>Active Circulation Pool</span>
                </div>
                <span className="text-white px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-medium">
                  {matchingReturnLoans.length}
                </span>
              </div>

              {/* Integrated Search Bar */}
              <div className="pt-3 pb-2 space-y-1.5">
                <div className="relative">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={checkinSearchQuery}
                    onChange={(e) => setCheckinSearchQuery(e.target.value)}
                    placeholder="Enter Asset Tag (e.g. AT-JET-0012) or Student PRN..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl font-sans text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 transition-all"
                  />
                </div>
              </div>

              {/* Multi-Item Kit Quick Batch Return Banner */}
              {groupedBorrowerLoans && groupedBorrowerLoans.length > 1 && (
                <div className="p-3 bg-white/[0.04] border border-[#c9b8a0]/30 rounded-xl my-1 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <Boxes className="w-3.5 h-3.5 text-[#c9b8a0]" />
                      <span>Student Kit Return Detected</span>
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      {groupedBorrowerLoans[0].borrowerName} holds {groupedBorrowerLoans.length} circulating items
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleBatchReturnClean(groupedBorrowerLoans)}
                    disabled={isBatchReturning}
                    className="px-3 py-1.5 rounded-full bg-white hover:bg-neutral-200 text-black font-semibold text-[11px] disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isBatchReturning ? 'Restocking...' : `Return All (${groupedBorrowerLoans.length}) Clean`}</span>
                  </button>
                </div>
              )}

              {/* Active Loans List */}
              <div className="flex-1 overflow-y-auto space-y-2 mt-2 pr-1 min-h-[360px]">
                {matchingReturnLoans.length > 0 ? (
                  matchingReturnLoans.map((loan) => {
                    const isSelected = selectedReturnLoan?.id === loan.id;
                    return (
                      <div
                        key={loan.id}
                        onClick={() => setSelectedReturnLoan(loan)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-white/[0.08] border-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
                            : 'bg-white/[0.02] border-white/[0.06] hover:border-white/20 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white tracking-wide">{loan.assetTag}</span>
                          <StatusBadge status={loan.status} type="due" size="xs" />
                        </div>
                        <div className="mt-1 font-medium text-xs text-white truncate">
                          {loan.nomenclature}
                        </div>
                        <div className="mt-1 text-[11px] text-zinc-400 flex justify-between">
                          <span>PRN: {loan.borrowerPrn} ({loan.borrowerName})</span>
                          <span>Due: {loan.dueDate?.split(' ')[0]}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center text-zinc-500 text-xs">
                    <Package className="w-8 h-8 opacity-30 stroke-[1.5] mb-2" />
                    No active loans found matching query "{checkinSearchQuery}".
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Digital Condition Checklist InspectionForm (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl h-full flex flex-col min-h-[580px] space-y-4">
              <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold border-b border-white/[0.06] pb-3 flex items-center justify-between font-sans">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-zinc-300" />
                  <span>Physical Return Inspection & Triage Station</span>
                </div>
                {selectedReturnLoan && (
                  <span className="text-[#c9b8a0] font-sans text-[11px]">
                    Asset {selectedReturnLoan.assetTag}
                  </span>
                )}
              </div>

              {selectedReturnLoan ? (
                <div className="flex-1 flex flex-col">
                  <InspectionForm
                    loan={selectedReturnLoan}
                    onComplete={handleCompleteInspection}
                    onCancel={() => setSelectedReturnLoan(null)}
                  />
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-zinc-500 font-sans text-xs space-y-2 p-6 min-h-[360px]">
                  <Package className="w-10 h-10 mx-auto opacity-30 stroke-[1.5]" />
                  <div className="text-sm font-medium text-white">No Return Item Selected</div>
                  <p className="max-w-xs text-zinc-400">
                    Select an active loan record from the left list to initiate physical condition inspection, firmware reset, and dynamic stock restock.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODE 3: CIRCULATION REGISTRY (INSTITUTIONAL ASSET LEDGER)     */}
      {/* ───────────────────────────────────────────────────────────── */}
      {terminalMode === 'circulation' && (
        <div className="space-y-6">
          {/* Overdue Alert Banner */}
          {circulationStats.overdue > 0 && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-300 text-xs animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-white">Overdue Circulation Alert:</span>{' '}
                  There {circulationStats.overdue === 1 ? 'is' : 'are'}{' '}
                  <span className="font-semibold text-rose-400">{circulationStats.overdue} institutional item{circulationStats.overdue > 1 ? 's' : ''}</span>{' '}
                  past due return schedule requiring counter return and triage.
                </div>
              </div>
              <button
                onClick={() => setCirculationFilter('Overdue')}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
              >
                Filter Overdue Units
              </button>
            </div>
          )}

          {/* Filter Bar, Search & View Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Apple Segmented Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setCirculationFilter('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  circulationFilter === 'all'
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/[0.08]'
                }`}
              >
                <span>All Circulating</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  circulationFilter === 'all' ? 'bg-black/10 text-black font-bold' : 'bg-white/10 text-zinc-400'
                }`}>
                  {circulationStats.total}
                </span>
              </button>

              <button
                onClick={() => setCirculationFilter('Normal')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  circulationFilter === 'Normal'
                    ? 'bg-emerald-400 text-black font-semibold shadow-sm'
                    : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/[0.08]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Good Standing</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  circulationFilter === 'Normal' ? 'bg-black/10 text-black font-bold' : 'bg-white/10 text-zinc-400'
                }`}>
                  {circulationStats.normal}
                </span>
              </button>

              <button
                onClick={() => setCirculationFilter('Imminent')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  circulationFilter === 'Imminent'
                    ? 'bg-amber-400 text-black font-semibold shadow-sm'
                    : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/[0.08]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Due Soon</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  circulationFilter === 'Imminent' ? 'bg-black/10 text-black font-bold' : 'bg-white/10 text-zinc-400'
                }`}>
                  {circulationStats.imminent}
                </span>
              </button>

              <button
                onClick={() => setCirculationFilter('Overdue')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  circulationFilter === 'Overdue'
                    ? 'bg-rose-500 text-white font-semibold shadow-sm'
                    : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/[0.08]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                <span>Overdue</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  circulationFilter === 'Overdue' ? 'bg-white/20 text-white font-bold' : 'bg-white/10 text-zinc-400'
                }`}>
                  {circulationStats.overdue}
                </span>
              </button>
            </div>

            {/* Search, View Mode Toggle & CSV Export */}
            <div className="flex items-center gap-3">
              <div className="relative min-w-[220px] max-w-xs">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={circulationSearch}
                  onChange={(e) => setCirculationSearch(e.target.value)}
                  placeholder="Search circulating units..."
                  className="w-full bg-white/[0.04] border border-white/10 rounded-full pl-9 pr-3.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all font-sans"
                />
              </div>

              {/* Grid / Table Toggle */}
              <div className="flex items-center p-1 rounded-full bg-white/[0.04] border border-white/10">
                <button
                  onClick={() => setCirculationViewMode('grid')}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    circulationViewMode === 'grid'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setCirculationViewMode('table')}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    circulationViewMode === 'table'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Table View"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* CSV Export Button */}
              <button
                onClick={handleExportCirculationCSV}
                className="px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Export Ledger as CSV"
              >
                <Download className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Circulation Content */}
          {filteredCirculationLoans.length === 0 ? (
            <div className="py-20 text-center rounded-2xl bg-white/[0.02] border border-white/10">
              <Boxes className="w-12 h-12 text-zinc-600 mx-auto stroke-[1.2] mb-3" />
              <div className="text-sm font-semibold text-white">No Circulating Records Found</div>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
                {circulationSearch
                  ? `No active loans matched your search query "${circulationSearch}".`
                  : 'There are no active loans matching the currently selected status filter.'}
              </p>
              {(circulationSearch || circulationFilter !== 'all') && (
                <button
                  onClick={() => {
                    setCirculationFilter('all');
                    setCirculationSearch('');
                  }}
                  className="mt-4 px-4 py-1.5 rounded-full text-xs font-medium bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/15 transition-all cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : circulationViewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCirculationLoans.map((loan) => {
                const invItem = getInventoryItem(loan.assetTag);
                const style = getCategoryStyle(invItem);
                const specChips = getSpecChips(invItem);

                return (
                  <div
                    key={loan.id}
                    onClick={() => setInspectedCirculationLoan(loan)}
                    className="group relative rounded-3xl border border-white/10 hover:border-[#c9b8a0]/50 transition-all duration-500 hover:shadow-[0_24px_60px_rgba(0,0,0,0.95)] flex flex-col justify-between cursor-pointer overflow-hidden min-h-[480px] bg-black/40"
                  >
                    {/* Full Image Box Background */}
                    <img
                      src={invItem?.image || '/images/hardware/raspberry-pi-5.jpg'}
                      alt={loan.nomenclature}
                      className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out z-0 opacity-80"
                      onError={(e) => {
                        e.target.src = '/images/hardware/raspberry-pi-5.jpg';
                      }}
                    />

                    {/* Ambient Gradient Scrim */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/40 to-black/95 pointer-events-none z-10" />

                    {/* Specular hairline top rim */}
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none rounded-t-3xl z-20" />

                    {/* Card Content */}
                    <div className="relative z-20 p-6 flex flex-col justify-between h-full min-h-[480px]">
                      {/* Top Bar: Category badge & Asset Tag */}
                      <div className="flex items-center justify-between text-xs">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${style.badgeBg} backdrop-blur-md shadow-lg tracking-wide`}>
                          {style.tag}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-sans font-medium text-zinc-300 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 shadow-lg">
                            {loan.assetTag}
                          </span>
                          <span className="text-[10px] font-sans text-zinc-400 bg-black/40 px-2 py-0.5 rounded-full border border-white/10">
                            {loan.id}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Area: Nomenclature, borrower details, due status, actions */}
                      <div className="space-y-3.5 pt-16">
                        <div className="space-y-1">
                          <h3 className="font-display text-lg font-bold text-white tracking-tight leading-snug group-hover:text-[#f5e6c8] transition-colors drop-shadow-md">
                            {loan.nomenclature}
                          </h3>
                          <p className="text-xs text-zinc-300 font-sans font-normal line-clamp-2 leading-relaxed drop-shadow-sm">
                            {invItem?.subSpecs || 'Institutional laboratory hardware active in student circulation.'}
                          </p>
                        </div>

                        {/* Tech Spec Chips */}
                        <div className="flex flex-wrap gap-1.5">
                          {specChips.map((chip, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[11px] text-zinc-200 font-sans font-medium shadow-sm"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>

                        {/* Borrower Custody Info & Depot */}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-zinc-200 font-sans font-medium text-[11px]">
                            <MapPin className="w-3 h-3 text-[#c9b8a0] flex-shrink-0" />
                            <span>{loan.locationCoordinates || 'Depot'}</span>
                          </div>
                          <span className="text-zinc-300 text-xs font-sans drop-shadow-sm">
                            {loan.borrowerName} • <span className="text-[#c9b8a0] font-semibold">{loan.borrowerPrn}</span>
                          </span>
                        </div>

                        {/* Card Footer */}
                        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                  loan.daysRemaining < 0
                                    ? 'bg-rose-400 animate-pulse'
                                    : loan.daysRemaining <= 3
                                    ? 'bg-amber-400 animate-pulse'
                                    : 'bg-emerald-400'
                                }`}
                              />
                              <span className={`text-xs font-semibold truncate ${
                                loan.daysRemaining < 0
                                  ? 'text-rose-400'
                                  : loan.daysRemaining <= 3
                                  ? 'text-amber-400'
                                  : 'text-white'
                              }`}>
                                {loan.daysRemaining < 0
                                  ? `${Math.abs(loan.daysRemaining)} Days Overdue`
                                  : `${loan.daysRemaining} Days Left`}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 mt-0.5 font-normal">
                              Due {formatFriendlyDate(loan.dueDate)}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setInspectedCirculationLoan(loan);
                              }}
                              className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white border border-white/10 transition-all cursor-pointer"
                              title="View Full Technical Specs"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTerminalMode('checkin');
                                setSelectedReturnLoan(loan);
                                setCheckinSearchQuery(loan.assetTag);
                              }}
                              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-zinc-200 text-black shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                              title="Direct Handover to Mode 2 Return Triage"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Process Return</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden p-1">
              <DataTable
                columns={circulationTableColumns}
                data={filteredCirculationLoans}
                emptyMessage="No circulating loans found matching the criteria."
              />
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TECHNICAL SPECIFICATIONS & CIRCULATION DOSSIER MODAL          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={!!inspectedCirculationLoan}
        onClose={() => setInspectedCirculationLoan(null)}
        title="Hardware Specification & Circulation Dossier"
        size="lg"
      >
        {inspectedCirculationLoan && (
          <div className="space-y-6">
            {/* Top Hero Banner */}
            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <img
                src={getInventoryItem(inspectedCirculationLoan.assetTag)?.image || '/images/hardware/raspberry-pi-5.jpg'}
                alt={inspectedCirculationLoan.nomenclature}
                className="w-24 h-24 object-contain rounded-xl bg-black/40 p-2 flex-shrink-0"
                onError={(e) => {
                  e.target.src = '/images/hardware/raspberry-pi-5.jpg';
                }}
              />
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-xs font-mono text-[#c9b8a0]">
                  Asset Tag: {inspectedCirculationLoan.assetTag} • Loan Ref: {inspectedCirculationLoan.id}
                </div>
                <h2 className="text-lg font-bold text-white font-display">
                  {inspectedCirculationLoan.nomenclature}
                </h2>
                <p className="text-xs text-zinc-400">
                  {getInventoryItem(inspectedCirculationLoan.assetTag)?.subSpecs || 'Certified institutional laboratory asset.'}
                </p>
              </div>
            </div>

            {/* Technical Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="text-[11px] text-zinc-500 font-sans">Custodian / Holder</div>
                <div className="text-xs font-semibold text-white mt-0.5">{inspectedCirculationLoan.borrowerName}</div>
                <div className="text-[10px] text-zinc-400">PRN: {inspectedCirculationLoan.borrowerPrn}</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="text-[11px] text-zinc-500 font-sans">Project / Course</div>
                <div className="text-xs font-semibold text-[#c9b8a0] mt-0.5">{inspectedCirculationLoan.projectId || 'General Project'}</div>
                <div className="text-[10px] text-zinc-400">{inspectedCirculationLoan.courseCode || 'Dept of Computing'}</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="text-[11px] text-zinc-500 font-sans">Depot Location</div>
                <div className="text-xs font-semibold text-white mt-0.5">{inspectedCirculationLoan.locationCoordinates || 'Depot Rack 1'}</div>
                <div className="text-[10px] text-zinc-400">Fixed Laboratory Bin</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="text-[11px] text-zinc-500 font-sans">Checkout Date</div>
                <div className="text-xs font-semibold text-white mt-0.5">{inspectedCirculationLoan.checkedOutDate}</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="text-[11px] text-zinc-500 font-sans">Scheduled Due Date</div>
                <div className="text-xs font-semibold text-white mt-0.5">{inspectedCirculationLoan.dueDate}</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="text-[11px] text-zinc-500 font-sans">Circulation Standing</div>
                <div className={`text-xs font-semibold mt-0.5 ${
                  inspectedCirculationLoan.daysRemaining < 0
                    ? 'text-rose-400'
                    : inspectedCirculationLoan.daysRemaining <= 3
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}>
                  {inspectedCirculationLoan.daysRemaining < 0
                    ? `${Math.abs(inspectedCirculationLoan.daysRemaining)} Days Overdue`
                    : `${inspectedCirculationLoan.daysRemaining} Days Remaining`}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setInspectedCirculationLoan(null)}
                className="px-4 py-2 rounded-full text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const targetLoan = inspectedCirculationLoan;
                  setInspectedCirculationLoan(null);
                  setTerminalMode('checkin');
                  setSelectedReturnLoan(targetLoan);
                  setCheckinSearchQuery(targetLoan.assetTag);
                }}
                className="px-5 py-2 rounded-full text-xs font-semibold bg-white hover:bg-zinc-200 text-black shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Initiate Return & Reset</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default DispatchDeskPage;
