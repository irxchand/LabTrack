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
  QrCode,
  Scan,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export function DispatchDeskPage() {
  const [searchParams] = useSearchParams();
  const urlMode = searchParams.get('mode');
  const urlAssetTag = searchParams.get('assetTag');

  const {
    inventory,
    requisitions,
    activeLoans,
    assets = [],
    resolveBarcode,
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
  const [assignedBarcodes, setAssignedBarcodes] = useState({});
  const [dueDateDays, setDueDateDays] = useState('14');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(null);

  // CHECKIN & BARCODE SCANNER STATE
  const [scannedBarcode, setScannedBarcode] = useState(urlAssetTag || '');
  const [resolvedScanResult, setResolvedScanResult] = useState(null);
  const [selectedReturnLoan, setSelectedReturnLoan] = useState(null);
  const [returnSuccess, setReturnSuccess] = useState(null);
  const [showBarcodeMatrix, setShowBarcodeMatrix] = useState(false);
  const [matrixDeptFilter, setMatrixDeptFilter] = useState('ALL');

  // CIRCULATION REGISTRY (MODE 3) STATE
  const [circulationFilter, setCirculationFilter] = useState('all');
  const [circulationSearch, setCirculationSearch] = useState('');
  const [circulationViewMode, setCirculationViewMode] = useState('table');

  // Sync from URL params
  useEffect(() => {
    if (urlMode === 'checkin') setTerminalMode('checkin');
    else if (urlMode === 'circulation') setTerminalMode('circulation');
    if (urlAssetTag) {
      setScannedBarcode(urlAssetTag);
    }
  }, [urlMode, urlAssetTag]);

  // Handle Barcode Scan / Search
  useEffect(() => {
    if (!scannedBarcode.trim()) {
      setResolvedScanResult(null);
      return;
    }
    const resolved = resolveBarcode ? resolveBarcode(scannedBarcode) : null;
    if (resolved) {
      setResolvedScanResult(resolved);
      if (resolved.activeLoan) {
        setSelectedReturnLoan(resolved.activeLoan);
      }
    } else {
      // Check direct active loan match
      const loanMatch = activeLoans.find(
        (l) => l.assetTag?.toLowerCase() === scannedBarcode.trim().toLowerCase()
      );
      if (loanMatch) {
        setSelectedReturnLoan(loanMatch);
      }
    }
  }, [scannedBarcode, resolveBarcode, activeLoans]);

  // Friendly date helper
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

  // Requisitions ready for physical counter handover
  const approvedRequisitions = useMemo(() => {
    return requisitions.filter(
      (r) =>
        r.status === 'Approved' ||
        r.status === 'Faculty Endorsed' ||
        r.status === 'Ready for Counter Pickup' ||
        r.status === 'Pending Approval'
    );
  }, [requisitions]);

  const filteredRequisitionsForDispatch = useMemo(() => {
    if (!dispatchSearchPrn.trim()) return approvedRequisitions;
    const q = dispatchSearchPrn.toLowerCase();
    return approvedRequisitions.filter(
      (r) =>
        (r.studentPrn && r.studentPrn.toLowerCase().includes(q)) ||
        (r.borrowerPrn && r.borrowerPrn.toLowerCase().includes(q)) ||
        (r.studentName && r.studentName.toLowerCase().includes(q)) ||
        (r.submittedBy && r.submittedBy.toLowerCase().includes(q)) ||
        (r.projectId && r.projectId.toLowerCase().includes(q)) ||
        (r.id && r.id.toLowerCase().includes(q)) ||
        (r.requestNumber && r.requestNumber.toLowerCase().includes(q))
    );
  }, [approvedRequisitions, dispatchSearchPrn]);

  // Available physical serialized assets from the 36 master assets
  const availablePhysicalAssets = useMemo(() => {
    return assets.filter((a) => a.state === 'AVAILABLE' || a.state === 'Available');
  }, [assets]);

  // Find physical asset options for a requested component
  const getAvailableAssetsForComponent = (comp) => {
    const nom = (comp.nomenclature || '').toLowerCase();
    const itemId = comp.itemId || '';

    return availablePhysicalAssets.filter((a) => {
      if (a.itemId && itemId && a.itemId === itemId) return true;
      if (a.nomenclature && nom && (
        a.nomenclature.toLowerCase().includes(nom) ||
        nom.includes(a.nomenclature.toLowerCase())
      )) return true;
      return false;
    });
  };

  // Initialize assigned barcodes when requisition is selected
  useEffect(() => {
    if (selectedRequisition?.componentsRequested?.length) {
      const initial = {};
      selectedRequisition.componentsRequested.forEach((comp, idx) => {
        const availableOptions = getAvailableAssetsForComponent(comp);
        if (availableOptions.length > 0) {
          initial[idx] = availableOptions[0].barcode;
        } else {
          // Fallback to item ID or generic placeholder tag
          initial[idx] = comp.itemId || `SIT-DEPOT-${idx + 1}`;
        }
      });
      setAssignedBarcodes(initial);
    } else {
      setAssignedBarcodes({});
    }
  }, [selectedRequisition, assets]);

  // Filter active loans for check-in
  const filteredReturnLoans = useMemo(() => {
    if (!scannedBarcode.trim()) return activeLoans;
    const q = scannedBarcode.toLowerCase().trim();
    return activeLoans.filter((loan) => {
      return (
        loan.assetTag?.toLowerCase().includes(q) ||
        loan.borrowerPrn?.toLowerCase().includes(q) ||
        loan.borrowerName?.toLowerCase().includes(q) ||
        loan.nomenclature?.toLowerCase().includes(q) ||
        loan.id?.toLowerCase().includes(q)
      );
    });
  }, [activeLoans, scannedBarcode]);

  // 36 Physical Assets filtered for Barcode Matrix Drawer
  const filteredMatrixAssets = useMemo(() => {
    if (matrixDeptFilter === 'ALL') return assets;
    return assets.filter((a) => a.department === matrixDeptFilter);
  }, [assets, matrixDeptFilter]);

  // Circulation statistics
  const circulationStats = useMemo(() => {
    const total = activeLoans.length;
    const imminent = activeLoans.filter((l) => l.status === 'Imminent').length;
    const overdue = activeLoans.filter((l) => l.status === 'Overdue').length;
    const normal = activeLoans.filter((l) => l.status === 'Normal').length;
    return { total, imminent, overdue, normal };
  }, [activeLoans]);

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
    const headers = ['Loan ID', 'Physical Barcode', 'Nomenclature', 'Borrower Name', 'Borrower PRN', 'Project ID', 'Course Code', 'Checked Out Date', 'Due Date', 'Status', 'Days Remaining', 'Depot Location'];
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
      `"${l.locationCoordinates || 'Central Counter'}"`,
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

  // Dispatch Handover Execution
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
        : [{ nomenclature: 'Laboratory Hardware', quantity: 1, itemId: 'ITEM-01' }];

      for (let i = 0; i < components.length; i++) {
        const comp = components[i];
        const assignedTag = assignedBarcodes[i] || comp.itemId || `SIT-DEPOT-${i + 1}`;

        await executeDispatch({
          requisitionId: selectedRequisition.id || selectedRequisition.requestNumber,
          assetTag: assignedTag,
          itemId: comp.itemId,
          nomenclature: comp.nomenclature,
          studentPrn: selectedRequisition.studentPrn || selectedRequisition.borrowerPrn,
          studentName: selectedRequisition.studentName || selectedRequisition.submittedBy,
          projectId: selectedRequisition.projectId,
          courseCode: selectedRequisition.courseCode || 'AIML-CAPSTONE-2026',
          dueDate: formattedDueDate,
          coordinates: 'Counter Desk Staging Tray',
        });
        dispatchedTags.push(assignedTag);
      }

      setDispatchSuccess({
        assetTags: dispatchedTags.join(', '),
        borrowerName: selectedRequisition.studentName || selectedRequisition.submittedBy,
        borrowerPrn: selectedRequisition.studentPrn || selectedRequisition.borrowerPrn,
      });

      setSelectedRequisition(null);
      setAssignedBarcodes({});
      setTimeout(() => setDispatchSuccess(null), 5000);
    } finally {
      setIsDispatching(false);
    }
  };

  // Return Inspection Completion
  const handleCompleteInspection = async (result) => {
    if (!selectedReturnLoan) return;
    const loanRef = selectedReturnLoan;

    const returnType = result.mode || result.returnType || 'clean';
    const checklist = result.checklist || {
      physicalIntegrity: true,
      powerTest: true,
      accessoriesPresent: true,
    };

    const defectDetails = returnType === 'defect' ? {
      severity: result.severity || 'Moderate',
      defectCategory: result.defectCategory || 'Physical Verification Failure',
      conditionSummary: result.conditionSummary || result.description || 'Hardware failed return physical diagnostic',
    } : null;

    const success = await executeReturn(loanRef.id, checklist, returnType, defectDetails);
    if (success) {
      setReturnSuccess({
        assetTag: loanRef.assetTag,
        nomenclature: loanRef.nomenclature,
        returnType,
        borrowerName: loanRef.borrowerName,
        borrowerPrn: loanRef.borrowerPrn,
      });
      setSelectedReturnLoan(null);
      setScannedBarcode('');
      setTimeout(() => setReturnSuccess(null), 5000);
    }
  };

  // Circulation Columns for Table View
  const circulationColumns = [
    {
      header: 'Physical SIT Barcode',
      accessor: 'assetTag',
      width: '180px',
      render: (row) => (
        <div className="font-sans text-xs">
          <div className="font-mono font-bold text-[#c9b8a0]">{row.assetTag}</div>
          <div className="text-zinc-500 text-[11px] mt-0.5">{row.id}</div>
        </div>
      ),
    },
    {
      header: 'Hardware Nomenclature',
      accessor: 'nomenclature',
      render: (row) => (
        <div className="font-sans text-xs">
          <div className="text-white font-medium">{row.nomenclature}</div>
          <div className="text-zinc-400 text-[11px] mt-0.5">{row.projectId} • {row.courseCode}</div>
        </div>
      ),
    },
    {
      header: 'Borrower PRN & Student',
      accessor: 'borrowerName',
      width: '180px',
      render: (row) => (
        <div className="font-sans text-xs">
          <div className="text-white font-medium">{row.borrowerName}</div>
          <div className="text-zinc-400 text-[11px]">{row.borrowerPrn}</div>
        </div>
      ),
    },
    {
      header: 'Due Date & Status',
      accessor: 'dueDate',
      width: '160px',
      render: (row) => (
        <div className="font-sans text-xs space-y-1">
          <div className="text-zinc-300 font-medium">{formatFriendlyDate(row.dueDate)}</div>
          <StatusBadge status={row.status} size="xs" />
        </div>
      ),
    },
    {
      header: 'Actions',
      width: '140px',
      align: 'right',
      render: (row) => (
        <button
          onClick={() => {
            setSelectedReturnLoan(row);
            setTerminalMode('checkin');
          }}
          className="px-3 py-1.5 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Intake</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER & OPERATIONAL MODE SWITCHER                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.04] text-[10px] font-sans uppercase tracking-wider text-[#c9b8a0] mb-2 border border-white/10">
            <Sparkles className="w-3 h-3 text-[#a78b71]" />
            <span>OPERATIONAL COUNTER TERMINAL • SENIOR STAFF DESK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white flex items-center gap-2.5 font-display">
            <Terminal className="w-6 h-6 text-[#a78b71]" />
            Lab Assistant Dispatch & Return Terminal
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Authenticated Staff: <span className="text-white font-medium">{currentUser?.name || 'Ramesh Patil (N10001)'}</span> • 36 Physical SIT Barcodes Bound • Invariant: <code className="text-[#f5e6c8]">good + bad = total</code>.
          </p>
        </div>

        {/* 3-Mode Segmented Switcher */}
        <div className="flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1 self-start sm:self-auto">
          <button
            onClick={() => setTerminalMode('dispatch')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              terminalMode === 'dispatch'
                ? 'bg-white text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Dispatch Desk ({approvedRequisitions.length})</span>
          </button>

          <button
            onClick={() => setTerminalMode('checkin')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              terminalMode === 'checkin'
                ? 'bg-white text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Barcode Intake ({activeLoans.length})</span>
          </button>

          <button
            onClick={() => setTerminalMode('circulation')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              terminalMode === 'circulation'
                ? 'bg-white text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Circulation Ledger ({activeLoans.length})</span>
          </button>
        </div>
      </div>

      {/* Success Toasts */}
      {dispatchSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="font-semibold text-white">Physical Handover Committed</div>
            <div>
              Dispatched <strong>{dispatchSuccess.assetTags}</strong> to {dispatchSuccess.borrowerName} ({dispatchSuccess.borrowerPrn}). Custody updated.
            </div>
          </div>
        </div>
      )}

      {returnSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="font-semibold text-white">
              {returnSuccess.returnType === 'clean' ? 'Certified Clean Return Restocked' : 'Defect Logged on Intake'}
            </div>
            <div>
              Asset <strong>{returnSuccess.assetTag}</strong> returned by {returnSuccess.borrowerName} ({returnSuccess.borrowerPrn}). Stock balance updated.
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. PHYSICAL BARCODE SCANNER STATION (Persistent across desk)   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Scan className="w-4 h-4 text-[#a78b71]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#c9b8a0]">
              Physical SIT Barcode Scanner
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowBarcodeMatrix(!showBarcodeMatrix)}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <QrCode className="w-3.5 h-3.5 text-[#c9b8a0]" />
            <span>{showBarcodeMatrix ? 'Hide SIT Barcodes Matrix' : 'Browse All 36 SIT Barcodes'}</span>
          </button>
        </div>

        {/* Live Scanner Input Bar */}
        <div className="relative">
          <input
            type="text"
            value={scannedBarcode}
            onChange={(e) => setScannedBarcode(e.target.value)}
            placeholder="Scan optical barcode or type SIT tag (e.g., SIT-AIML-5CL07-0043, SIT-CSE-4CL07-0083, SIT-RA-6RA02-0143)..."
            className="w-full pl-10 pr-20 py-2.5 bg-white/[0.03] border border-white/15 rounded-xl font-mono text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#a78b71] transition-all"
          />
          <Scan className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
          {scannedBarcode && (
            <button
              onClick={() => {
                setScannedBarcode('');
                setResolvedScanResult(null);
                setSelectedReturnLoan(null);
              }}
              className="absolute right-3 top-2.5 text-xs text-zinc-500 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Sample SIT Barcodes Chips */}
        <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-zinc-500">
          <span className="font-semibold text-zinc-400">Quick Test Barcodes:</span>
          {[
            { tag: 'SIT-AIML-5CL07-0043', label: 'AIML Jetson Nano (In Use)' },
            { tag: 'SIT-CSE-4CL07-0083', label: 'CSE RPi 5 (In Use)' },
            { tag: 'SIT-RA-6RA02-0143', label: 'RA TurtleBot 3 (In Use)' },
            { tag: 'SIT-AIML-5CL07-0041', label: 'AIML Jetson Nano (Available)' },
            { tag: 'SIT-CSE-4CL07-0046', label: 'CSE Jetson (Defective)' },
          ].map((sample) => (
            <button
              key={sample.tag}
              type="button"
              onClick={() => {
                setScannedBarcode(sample.tag);
                setTerminalMode('checkin');
              }}
              className="px-2 py-0.5 rounded-md bg-white/[0.04] text-zinc-300 hover:text-white border border-white/10 hover:border-white/25 font-mono cursor-pointer transition-colors"
            >
              {sample.tag} ({sample.label})
            </button>
          ))}
        </div>

        {/* Resolved Barcode Inspection Card */}
        {resolvedScanResult && (
          <div className="p-4 rounded-xl bg-white/[0.03] border border-[#c9b8a0]/30 space-y-2 mt-3 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-[#f5e6c8] text-sm">{resolvedScanResult.barcode}</span>
                <span className="text-zinc-500">•</span>
                <span className="text-white font-medium text-xs">{resolvedScanResult.nomenclature}</span>
                <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[#c9b8a0] text-[10px] font-mono">
                  Default ID: {resolvedScanResult.defaultId || 'N/A'}
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-[10px] font-semibold">
                  {resolvedScanResult.department} Dept ({resolvedScanResult.labId})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                    resolvedScanResult.state === 'AVAILABLE'
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      : resolvedScanResult.state === 'IN_USE'
                      ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                      : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                  }`}
                >
                  {resolvedScanResult.state}
                </span>

                {resolvedScanResult.activeLoan && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedReturnLoan(resolvedScanResult.activeLoan);
                      setTerminalMode('checkin');
                    }}
                    className="px-3 py-1 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Intake This Asset</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-zinc-400 pt-1">
              <div>Serial: <span className="text-zinc-200 font-mono">{resolvedScanResult.serialNumber || 'OEM-SIT'}</span></div>
              <div>Bill No: <span className="text-zinc-200">{resolvedScanResult.billNumber || 'CPR/2024'}</span></div>
              <div>Cost Tier: <span className="text-zinc-200">{resolvedScanResult.costTier}</span></div>
              <div>
                Custody: <span className="text-zinc-200">{resolvedScanResult.custodyHolderPrn || 'Central Depot'}</span>
              </div>
            </div>
          </div>
        )}

        {/* 36 Physical SIT Barcodes Matrix Drawer */}
        {showBarcodeMatrix && (
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 mt-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-white">
                All 36 Master SIT Physical Barcodes
              </span>
              <div className="flex items-center gap-1.5">
                {['ALL', 'AIML', 'CSE', 'RA'].map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => setMatrixDeptFilter(dept)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                      matrixDeptFilter === dept
                        ? 'bg-white text-black font-semibold'
                        : 'bg-white/[0.04] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {dept} ({dept === 'ALL' ? assets.length : assets.filter((a) => a.department === dept).length})
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-60 overflow-y-auto pr-1">
              {filteredMatrixAssets.map((asset) => (
                <button
                  key={asset.barcode}
                  type="button"
                  onClick={() => {
                    setScannedBarcode(asset.barcode);
                    setTerminalMode('checkin');
                  }}
                  className="p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 hover:border-[#c9b8a0]/50 text-left transition-all cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-[#c9b8a0] truncate">{asset.barcode}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                        asset.state === 'AVAILABLE'
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : asset.state === 'IN_USE'
                          ? 'text-blue-400 bg-blue-500/10'
                          : 'text-rose-400 bg-rose-500/10'
                      }`}
                    >
                      {asset.state}
                    </span>
                  </div>
                  <div className="text-white text-xs truncate" title={asset.nomenclature}>
                    {asset.nomenclature}
                  </div>
                  <div className="text-[10px] text-zinc-500 flex items-center justify-between">
                    <span>{asset.department} ({asset.labId})</span>
                    <span>{asset.defaultId}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. MODE 1: DISPATCH DESK (Multi-Kit Staging & Handover)       */}
      {/* ───────────────────────────────────────────────────────────── */}
      {terminalMode === 'dispatch' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Requisition Queue */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#c9b8a0]">
                Approved Requisitions Awaiting Dispatch
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {filteredRequisitionsForDispatch.length} ready
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={dispatchSearchPrn}
                onChange={(e) => setDispatchSearchPrn(e.target.value)}
                placeholder="Filter by student PRN, project, or name..."
                className="w-full px-3.5 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30"
              />
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-zinc-500" />
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredRequisitionsForDispatch.length > 0 ? (
                filteredRequisitionsForDispatch.map((req) => {
                  const isSelected = selectedRequisition?.id === req.id || selectedRequisition?.requestNumber === req.requestNumber;
                  const studentName = req.studentName || req.submittedBy;
                  const studentPrn = req.studentPrn || req.borrowerPrn;
                  const reqId = req.id || req.requestNumber;

                  return (
                    <button
                      key={reqId}
                      type="button"
                      onClick={() => setSelectedRequisition(req)}
                      className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-white/[0.08] border-[#c9b8a0] shadow-md'
                          : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">{studentName}</span>
                        <span className="font-mono text-[#c9b8a0] text-[11px]">{reqId}</span>
                      </div>
                      <div className="text-[11px] text-zinc-400 flex items-center gap-2">
                        <span>PRN: {studentPrn}</span>
                        <span>•</span>
                        <span className="text-zinc-300 font-medium">{req.projectId}</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {req.componentsRequested?.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/5 text-[10px] text-zinc-300">
                            {c.quantity}x {c.nomenclature}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-zinc-500 rounded-xl border border-white/10 bg-white/[0.01]">
                  No approved requisitions currently pending counter staging.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Physical Kit Staging & Handover Console */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-semibold uppercase tracking-wider text-white">
                  Physical Hardware Kit Handover
                </span>
                {selectedRequisition && (
                  <span className="text-xs text-[#c9b8a0] font-mono">
                    {selectedRequisition.id || selectedRequisition.requestNumber}
                  </span>
                )}
              </div>

              {selectedRequisition ? (
                <form onSubmit={handleExecuteDispatch} className="space-y-4 text-xs">
                  {/* Requester Dossier */}
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                    <div className="text-white font-medium">
                      {selectedRequisition.studentName || selectedRequisition.submittedBy} ({selectedRequisition.studentPrn || selectedRequisition.borrowerPrn})
                    </div>
                    <div className="text-zinc-400 text-[11px]">
                      Project: {selectedRequisition.projectId} • {selectedRequisition.department}
                    </div>
                  </div>

                  {/* Components and Physical Barcode Allocators */}
                  <div className="space-y-3">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#c9b8a0]">
                      Bind Physical Serialized Assets (36 SIT Barcodes)
                    </label>

                    {selectedRequisition.componentsRequested?.map((comp, idx) => {
                      const availableOptions = getAvailableAssetsForComponent(comp);

                      return (
                        <div key={idx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium text-xs">
                              {comp.quantity}x {comp.nomenclature}
                            </span>
                            <span className="text-[11px] text-zinc-500">
                              {availableOptions.length} physical units in stock
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="text-zinc-400 text-[11px] shrink-0">Assigned SIT Tag:</label>
                            {availableOptions.length > 0 ? (
                              <select
                                value={assignedBarcodes[idx] || availableOptions[0].barcode}
                                onChange={(e) =>
                                  setAssignedBarcodes({
                                    ...assignedBarcodes,
                                    [idx]: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-1.5 bg-[#141417] border border-white/15 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-white/30"
                              >
                                {availableOptions.map((opt) => (
                                  <option key={opt.barcode} value={opt.barcode}>
                                    {opt.barcode} ({opt.defaultId} • {opt.department} • Bill {opt.billNumber})
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                value={assignedBarcodes[idx] || comp.itemId}
                                onChange={(e) =>
                                  setAssignedBarcodes({
                                    ...assignedBarcodes,
                                    [idx]: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-1.5 bg-[#141417] border border-white/15 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-white/30"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Due Date Term */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                      Authorized Custody Term
                    </label>
                    <select
                      value={dueDateDays}
                      onChange={(e) => setDueDateDays(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#141417] border border-white/15 rounded-xl text-white text-xs focus:outline-none"
                    >
                      <option value="7">7 Days (Rapid Coursework)</option>
                      <option value="14">14 Days (Standard Academic Sprint)</option>
                      <option value="21">21 Days (Extended Capstone)</option>
                    </select>
                  </div>

                  <div className="flex justify-end pt-3 border-t border-white/10">
                    <button
                      type="submit"
                      disabled={isDispatching}
                      className="px-6 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>{isDispatching ? 'Committing Handover...' : 'Execute Counter Handover'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-12 text-center text-xs text-zinc-500">
                  Select an approved student requisition from the left queue to begin physical kit staging and barcode binding.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. MODE 2: CHECKIN & RETURN INSPECTION                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      {terminalMode === 'checkin' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Active Loans Intake List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#c9b8a0]">
                Active Loans in Circulation
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {filteredReturnLoans.length} active
              </span>
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredReturnLoans.length > 0 ? (
                filteredReturnLoans.map((loan) => {
                  const isSelected = selectedReturnLoan?.id === loan.id;
                  return (
                    <button
                      key={loan.id}
                      type="button"
                      onClick={() => setSelectedReturnLoan(loan)}
                      className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-white/[0.08] border-[#c9b8a0] shadow-md'
                          : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-[#c9b8a0]">{loan.assetTag}</span>
                        <StatusBadge status={loan.status} size="xs" />
                      </div>
                      <div className="text-white text-xs font-medium">{loan.nomenclature}</div>
                      <div className="text-[11px] text-zinc-400 flex items-center justify-between">
                        <span>Borrower: {loan.borrowerName}</span>
                        <span>Due: {formatFriendlyDate(loan.dueDate)}</span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-zinc-500 rounded-xl border border-white/10 bg-white/[0.01]">
                  No active loans currently match your scanned barcode or query.
                </div>
              )}
            </div>
          </div>

          {/* Inspection Form Console */}
          <div className="lg:col-span-7">
            {selectedReturnLoan ? (
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white">
                    Return Intake & Physical Condition Inspection
                  </span>
                  <span className="text-xs text-[#c9b8a0] font-mono">
                    {selectedReturnLoan.assetTag}
                  </span>
                </div>

                <InspectionForm
                  loan={selectedReturnLoan}
                  onComplete={handleCompleteInspection}
                  onCancel={() => setSelectedReturnLoan(null)}
                />
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl border border-white/10 bg-white/[0.01] space-y-3">
                <Scan className="w-8 h-8 text-zinc-600 mx-auto" />
                <div className="text-sm font-medium text-white">No Loan Selected for Intake</div>
                <p className="text-xs text-zinc-500 max-w-md mx-auto">
                  Scan a physical SIT barcode in the scanner bar above, or click an active loan card from the left queue to launch the condition verification checklist.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. MODE 3: CIRCULATION LEDGER & EXPORT                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      {terminalMode === 'circulation' && (
        <div className="space-y-4">
          {/* Circulation Telemetry Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mr-2">
                Filter Status:
              </span>
              {[
                { id: 'all', label: `All (${circulationStats.total})` },
                { id: 'Normal', label: `Normal (${circulationStats.normal})` },
                { id: 'Imminent', label: `Imminent (${circulationStats.imminent})` },
                { id: 'Overdue', label: `Overdue (${circulationStats.overdue})` },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setCirculationFilter(pill.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    circulationFilter === pill.id
                      ? 'bg-white text-black font-semibold'
                      : 'bg-white/[0.04] text-zinc-400 hover:text-white'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={circulationSearch}
                  onChange={(e) => setCirculationSearch(e.target.value)}
                  placeholder="Search ledger..."
                  className="px-3.5 py-1.5 bg-white/[0.03] border border-white/10 rounded-full text-xs text-white placeholder:text-zinc-600 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleExportCirculationCSV}
                className="px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <DataTable
            columns={circulationColumns}
            data={filteredCirculationLoans}
            pageSize={10}
            emptyMessage="No active hardware loans currently registered in circulation."
          />
        </div>
      )}
    </div>
  );
}

export default DispatchDeskPage;
