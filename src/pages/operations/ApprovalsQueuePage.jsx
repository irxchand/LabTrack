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
  Package,
  History,
  Building,
  UserCheck,
  Lock,
} from 'lucide-react';
import { isRequisitionMentoredByUser } from '../../utils/facultyAuth';

export function ApprovalsQueuePage() {
  const navigate = useNavigate();
  const { requisitions, inventory, activeLoans, projects, approveRequisition, rejectRequisition, getItemDeptStock } = useLabData();
  const { currentUser } = useAuth();

  const isHoD = currentUser?.role === 'HoD / Admin';
  const isFaculty = currentUser?.role === 'Faculty';

  // Determine HoD department scoping based on authoritative roster
  // Dr. Sumit Kumar (T100101) -> AIML
  // Dr. Sonali Kothari (T100102 / T100201) -> CSE
  // Dr. Arunkumar Bongale (T100103 / T100301) -> RA
  const hodDepartment = useMemo(() => {
    const prn = String(currentUser?.prn || '').trim();
    const name = String(currentUser?.name || '').toLowerCase();
    const dept = String(currentUser?.department || '').toUpperCase();

    if (prn === 'T100101' || name.includes('sumit') || dept.includes('AIML') || dept.includes('AI &')) {
      return 'AIML';
    }
    if (prn === 'T100102' || prn === 'T100201' || name.includes('sonali') || dept.includes('CSE') || dept.includes('COMPUTER SCIENCE')) {
      return 'CSE';
    }
    if (prn === 'T100103' || prn === 'T100301' || name.includes('arunkumar') || dept.includes('RA') || dept.includes('ROBOTICS')) {
      return 'RA';
    }
    return 'AIML';
  }, [currentUser]);

  const approverName = currentUser?.name || (isHoD ? 'Dr. Sumit Kumar (HoD)' : 'Dr. Meenakshi Sharma');

  // MODAL STATES
  const [rejectModalReq, setRejectModalReq] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const [modifyModalReq, setModifyModalReq] = useState(null);
  const [modifiedQuantities, setModifiedQuantities] = useState({});

  const [endorseModalReq, setEndorseModalReq] = useState(null);
  const [authorizedLocation, setAuthorizedLocation] = useState('Room 5CL-07 Bench Only');
  const [authorizedTerm, setAuthorizedTerm] = useState('14-Day Sprint');
  const [customEndorsementNotes, setCustomEndorsementNotes] = useState('');

  const [overrideModalReq, setOverrideModalReq] = useState(null);
  const [overrideReason, setOverrideReason] = useState('');

  const [approveModalReq, setApproveModalReq] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState('');

  const [timelineModalReq, setTimelineModalReq] = useState(null);
  const [isBatchApproving, setIsBatchApproving] = useState(false);

  // VIEW & FILTER CONTROLS
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved' | 'all'
  
  // HoD Department Scoping: Defaults to the HoD's enrolled department
  const [selectedDeptFilter, setSelectedDeptFilter] = useState(isHoD ? hodDepartment : 'ALL');
  const [selectedFacultyFilter, setSelectedFacultyFilter] = useState('ALL');
  const [capitalFilter, setCapitalFilter] = useState('ALL'); // 'ALL' | 'TIER3_4'

  // Faculty Mentorship Scope Tab: 'mentored' | 'audit'
  const [facultyScopeTab, setFacultyScopeTab] = useState('mentored');

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

  // Hardware item photography resolver
  const getItemImage = (item) => {
    if (!item) return '/images/hardware/raspberry-pi-5.jpg';
    if (item.image) return item.image;

    const match = inventory?.find(
      (i) =>
        i.id === item.itemId ||
        i.assetTag === item.itemId ||
        (i.nomenclature && item.nomenclature && (
          i.nomenclature.toLowerCase().includes(item.nomenclature.toLowerCase()) ||
          item.nomenclature.toLowerCase().includes(i.nomenclature.toLowerCase())
        ))
    );
    if (match?.image) return match.image;

    const nom = (item.nomenclature || item.name || '').toLowerCase();
    if (nom.includes('dht11') || nom.includes('dht')) return '/images/hardware/dht11-sensor.jpg';
    if (nom.includes('ultrasonic') || nom.includes('hcsr04') || nom.includes('sonar')) return '/images/hardware/hcsr04-ultrasonic.jpg';
    if (nom.includes('pir') || nom.includes('motion')) return '/images/hardware/pir-motion-sensor.jpg';
    if (nom.includes('ir ') || nom.includes('infrared') || nom.includes('obstacle') || nom.includes('tcrt')) return '/images/hardware/ir-sensor-module.jpg';
    if (nom.includes('piezo')) return '/images/hardware/piezo-sensor.jpg';
    if (nom.includes('mpu') || nom.includes('imu') || nom.includes('gyro') || nom.includes('accelerometer')) return '/images/hardware/mpu6050-sensor.jpg';
    if (nom.includes('bmp280') || nom.includes('pressure') || nom.includes('barometric')) return '/images/hardware/bmp280-sensor.jpg';
    if (nom.includes('multimeter')) return '/images/hardware/digital-multimeter.jpg';
    if (nom.includes('servo') || nom.includes('sg90') || nom.includes('mg996')) return '/images/hardware/sg90-servo.jpg';
    if (nom.includes('stepper') || nom.includes('nema')) return '/images/hardware/nema17-stepper.jpg';
    if (nom.includes('l298n') || nom.includes('motor driver')) return '/images/hardware/l298n-motor-driver.jpg';
    if (nom.includes('relay')) return '/images/hardware/relay-module.jpg';
    if (nom.includes('lcd') || nom.includes('1602') || nom.includes('16x2')) return '/images/hardware/lcd-1602.jpg';
    if (nom.includes('oled')) return '/images/hardware/oled-display.jpg';
    if (nom.includes('9v')) return '/images/hardware/9v-battery.jpg';
    if (nom.includes('18650')) return '/images/hardware/18650-battery.jpg';
    if (nom.includes('orin') || nom.includes('jetson')) return '/images/hardware/jetson-nano.jpg';
    if (nom.includes('realsense') || nom.includes('camera') || nom.includes('depth')) return '/images/hardware/realsense-camera.jpg';
    if (nom.includes('flir') || nom.includes('thermal') || nom.includes('lepton')) return '/images/hardware/thermal-camera.jpg';
    if (nom.includes('turtlebot') || nom.includes('robot')) return '/images/hardware/turtlebot-robot.jpg';
    if (nom.includes('arm') || nom.includes('dobot') || nom.includes('kinova')) return '/images/hardware/robotic-arm.jpg';
    if (nom.includes('raspberry') || nom.includes('pico') || nom.includes('pi')) return '/images/hardware/raspberry-pi-5.jpg';
    if (nom.includes('oscilloscope') || nom.includes('rigol')) return '/images/hardware/oscilloscope.jpg';
    if (nom.includes('arduino') || nom.includes('uno')) return '/images/hardware/arduino-uno-r3.jpg';
    if (nom.includes('esp32')) return '/images/hardware/esp32-wroom.jpg';
    if (nom.includes('breadboard')) return '/images/hardware/breadboard-830.jpg';
    if (nom.includes('jumper') || nom.includes('wire')) return '/images/hardware/jumper-wires.jpg';
    if (nom.includes('resistor')) return '/images/hardware/resistors-pack.jpg';
    return '/images/hardware/raspberry-pi-5.jpg';
  };

  // Resolve Capital Tier of a Requisition (Tier 3 Advanced / Tier 4 High Value)
  const getRequisitionCapitalTier = (req) => {
    if (!req || !req.componentsRequested) return null;
    let highestTier = null;

    req.componentsRequested.forEach((comp) => {
      const match = inventory?.find(
        (i) =>
          i.id === comp.itemId ||
          i.assetTag === comp.itemId ||
          (i.nomenclature && comp.nomenclature && i.nomenclature.toLowerCase().includes(comp.nomenclature.toLowerCase()))
      );

      const costTier = match?.costTier || '';
      const nom = (comp.nomenclature || '').toLowerCase();

      if (
        costTier.includes('Tier 4') ||
        costTier.includes('High Value') ||
        nom.includes('rtx 4090') ||
        nom.includes('turtlebot 4') ||
        nom.includes('kinova') ||
        nom.includes('ouster') ||
        nom.includes('imac')
      ) {
        highestTier = 'Tier 4 High Value';
      } else if (
        !highestTier &&
        (costTier.includes('Tier 3') ||
          costTier.includes('Advanced') ||
          nom.includes('orin') ||
          nom.includes('realsense') ||
          nom.includes('flir') ||
          nom.includes('dobot') ||
          nom.includes('siemens') ||
          nom.includes('s7-1200'))
      ) {
        highestTier = 'Tier 3 Advanced';
      }
    });

    return highestTier;
  };

  // Normalize Department string of a requisition
  const getReqDepartmentCode = (req) => {
    if (!req) return 'AIML';
    const dept = (req.department || '').toUpperCase();
    if (dept.includes('AIML') || dept.includes('AI &') || dept.includes('ARTIFICIAL INTELLIGENCE')) return 'AIML';
    if (dept.includes('CSE') || dept.includes('COMPUTER SCIENCE')) return 'CSE';
    if (dept.includes('RA') || dept.includes('ROBOTICS') || dept.includes('AUTOMATION')) return 'RA';

    // Fallback: look up in project
    const proj = projects?.find((p) => p.id === req.projectId);
    if (proj?.department) {
      const pDept = proj.department.toUpperCase();
      if (pDept.includes('AIML')) return 'AIML';
      if (pDept.includes('CSE')) return 'CSE';
      if (pDept.includes('RA')) return 'RA';
    }
    return 'AIML';
  };

  // Check if current user is mentor of requisition
  const isMentorMatch = (req) => {
    return isRequisitionMentoredByUser(req, currentUser, projects);
  };

  // Distinct faculty mentors across active requisitions
  const facultyMentors = useMemo(() => {
    const list = [];
    requisitions.forEach((r) => {
      const m = r.mentorName;
      if (m && !list.includes(m)) {
        list.push(m);
      }
    });
    return list;
  }, [requisitions]);

  // Master Scoped Pool:
  // Faculty is strictly one department (AIML). HoD is department executive (AIML).
  const scopedRequisitions = useMemo(() => {
    const userDept = isHoD ? hodDepartment : 'AIML';
    let pool = requisitions.filter((r) => getReqDepartmentCode(r) === userDept);

    if (isHoD) {
      if (selectedFacultyFilter !== 'ALL') {
        pool = pool.filter((r) => r.mentorName === selectedFacultyFilter);
      }
      return pool;
    }

    if (isFaculty) {
      if (facultyScopeTab === 'mentored') {
        return pool.filter(isMentorMatch);
      } else {
        // Read-only department audit view: requisitions not mentored by this professor in the department
        return pool.filter((r) => !isMentorMatch(r));
      }
    }

    return pool;
  }, [requisitions, isHoD, isFaculty, hodDepartment, selectedFacultyFilter, facultyScopeTab, isMentorMatch]);

  // Pending vs Past approvals
  const pendingRequisitions = useMemo(() => {
    return scopedRequisitions.filter((r) => {
      const s = (r.status || '').toLowerCase().trim();
      if (s.includes('returned') || s.includes('restock') || s.includes('rejected') || s.includes('dispatched')) {
        return false;
      }
      if (isHoD) {
        // For HoD: Items awaiting initial executive review OR faculty endorsed items awaiting departmental sanction!
        return (
          s === 'submitted' ||
          s === 'pending approval' ||
          s === 'pending' ||
          s === 'faculty endorsed' ||
          s.includes('endorsed') ||
          s === 'under review' ||
          s === 'mentor review' ||
          s === 'hod review'
        );
      }
      return (
        s === 'submitted' ||
        s === 'pending approval' ||
        s === 'pending' ||
        s === 'mentor_review' ||
        s === 'mentor review' ||
        s === 'under review' ||
        s === 'faculty mentor review' ||
        (!s.includes('approved') && !s.includes('endorsed') && !s.includes('pickup') && !s.includes('dispatched') && !s.includes('rejected') && !s.includes('completed') && !s.includes('returned'))
      );
    });
  }, [scopedRequisitions, isHoD]);

  const pastApprovedRequisitions = useMemo(() => {
    return scopedRequisitions.filter((r) => {
      const s = (r.status || '').toLowerCase().trim();
      if (isHoD) {
        // For HoD: items that have passed HoD sanction (ready for pickup, staged, dispatched, or returned)
        return (
          s === 'ready for counter pickup' ||
          s === 'dispatched' ||
          s.includes('returned') ||
          s.includes('restock') ||
          s === 'completed' ||
          r.timeline?.some((t) => (t.step?.toLowerCase().includes('hod') || t.stage?.toLowerCase().includes('hod')) && t.completed) ||
          Boolean(r.hodSanctionedBy)
        );
      }
      return (
        s === 'approved' ||
        s === 'faculty endorsed' ||
        s === 'ready for counter pickup' ||
        s === 'dispatched' ||
        s.includes('returned') ||
        s.includes('restock') ||
        s === 'completed' ||
        r.timeline?.some((t) => t.step?.includes('Endorsed') || (t.stage?.includes('Review') && t.completed)) ||
        Boolean(r.approvedBy)
      );
    });
  }, [scopedRequisitions, isHoD]);

  const activeRequisitionPool = useMemo(() => {
    if (activeTab === 'pending') return pendingRequisitions;
    if (activeTab === 'approved') return pastApprovedRequisitions;
    return scopedRequisitions;
  }, [activeTab, pendingRequisitions, pastApprovedRequisitions, scopedRequisitions]);

  // Count Tier 3/4 capital requisitions in active pool
  const tier3And4Count = useMemo(() => {
    return activeRequisitionPool.filter((r) => Boolean(getRequisitionCapitalTier(r))).length;
  }, [activeRequisitionPool]);

  // Filter by Real-time search and Capital filter, sorted newest first
  const filteredRequisitions = useMemo(() => {
    let pool = activeRequisitionPool;
    if (capitalFilter === 'TIER3_4') {
      pool = pool.filter((r) => Boolean(getRequisitionCapitalTier(r)));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      pool = pool.filter(
        (r) =>
          r.studentName?.toLowerCase().includes(q) ||
          r.submittedBy?.toLowerCase().includes(q) ||
          r.studentPrn?.toLowerCase().includes(q) ||
          r.borrowerPrn?.toLowerCase().includes(q) ||
          r.projectId?.toLowerCase().includes(q) ||
          r.id?.toLowerCase().includes(q) ||
          r.requestNumber?.toLowerCase().includes(q) ||
          r.technicalPurpose?.toLowerCase().includes(q) ||
          r.purposeDescription?.toLowerCase().includes(q) ||
          r.mentorName?.toLowerCase().includes(q) ||
          r.componentsRequested?.some((c) => c.nomenclature?.toLowerCase().includes(q))
      );
    }

    // Always sort descending by date and request ID so the latest submission is immediately at the top
    return [...pool].sort((a, b) => {
      const dateA = new Date((a.requestDate || a.submittedDate || '2000-01-01').replace(' ', 'T')).getTime();
      const dateB = new Date((b.requestDate || b.submittedDate || '2000-01-01').replace(' ', 'T')).getTime();
      if (!isNaN(dateA) && !isNaN(dateB) && Math.abs(dateB - dateA) > 1000) {
        return dateB - dateA;
      }
      const numA = parseInt(String(a.id || a.requestNumber || '').replace(/\D/g, ''), 10) || 0;
      const numB = parseInt(String(b.id || b.requestNumber || '').replace(/\D/g, ''), 10) || 0;
      return numB - numA;
    });
  }, [activeRequisitionPool, capitalFilter, searchQuery]);

  // Live component bench stock lookup (strictly department-scoped)
  const getComponentStock = (comp, req) => {
    const match = inventory?.find(
      (i) =>
        i.id === comp.itemId ||
        i.assetTag === comp.itemId ||
        (i.nomenclature && comp.nomenclature && (
          i.nomenclature.toLowerCase().includes(comp.nomenclature.toLowerCase()) ||
          comp.nomenclature.toLowerCase().includes(i.nomenclature.toLowerCase())
        ))
    );
    if (!match) return { inStock: true, count: 4, coordinates: 'Central Depot' };
    const deptCode = req ? getReqDepartmentCode(req) : (isHoD ? hodDepartment : 'AIML');
    const deptStock = getItemDeptStock ? getItemDeptStock(match, deptCode) : { available: match.availableStock ?? 0 };
    const count = deptStock.available ?? match.availableStock ?? 0;
    return {
      inStock: count > 0,
      count,
      coordinates: match.coordinates || match.labRoom || 'Central Depot',
    };
  };

  // Live stock shortage checker
  const checkRequisitionStockShortage = (req) => {
    if (!req?.componentsRequested?.length) return { hasShortage: false, item: null };
    for (const comp of req.componentsRequested) {
      const stock = getComponentStock(comp, req);
      if (stock.count < (comp.quantity || 1)) {
        return {
          hasShortage: true,
          item: comp.nomenclature,
          requested: comp.quantity || 1,
          available: stock.count,
        };
      }
    }
    return { hasShortage: false, item: null };
  };

  const handleOpenModify = (req) => {
    setModifyModalReq(req);
    const initialQty = {};
    req.componentsRequested?.forEach((c, idx) => {
      initialQty[idx] = c.quantity || 1;
    });
    setModifiedQuantities(initialQty);
  };

  const handleSaveModifiedQuantities = (e) => {
    e.preventDefault();
    if (!modifyModalReq) return;
    const reqId = modifyModalReq.id || modifyModalReq.requestNumber;
    const updatedComponents = modifyModalReq.componentsRequested.map((c, idx) => {
      const stock = getComponentStock(c);
      const chosen = Number(modifiedQuantities[idx] ?? c.quantity);
      const safeQty = Math.max(1, Math.min(chosen, stock.count > 0 ? stock.count : 1));
      return {
        ...c,
        quantity: safeQty,
      };
    });

    setRequisitions((prev) =>
      prev.map((r) =>
        r.id === reqId || r.requestNumber === reqId
          ? { ...r, componentsRequested: updatedComponents }
          : r
      )
    );
    setModifyModalReq(null);
  };

  // Handlers for approval actions
  const handleOpenApproveModal = (req, preset = null) => {
    setApproveModalReq(req);
    const statusLower = String(req.status || '').toLowerCase().trim();
    const isFacultyEndorsed = statusLower.includes('endorsed');
    if (preset) {
      setApprovalNotes(preset);
    } else if (isHoD) {
      setApprovalNotes(isFacultyEndorsed ? 'Department allocation sanctioned by HoD. Passed to Counter Desk.' : 'Executive sanction endorsed by HoD for capstone coursework.');
    } else {
      setApprovalNotes('Approved by faculty mentor for departmental coursework milestones.');
    }
  };

  const handleConfirmApprovalWithNotes = async (e) => {
    e.preventDefault();
    if (!approveModalReq) return;
    const reqId = approveModalReq.id || approveModalReq.requestNumber;
    const finalNote = approvalNotes.trim()
      ? `${approvalNotes.trim()} — Endorsed by ${approverName}.`
      : `Approved by ${approverName} for departmental coursework milestones.`;
    setApproveModalReq(null);
    try {
      await approveRequisition(reqId, finalNote);
    } catch (err) {
      console.error('Failed to approve requisition with notes:', err);
    }
  };

  const handleQuickApprove = async (id, preset = null) => {
    try {
      const note = preset
        ? `${preset} — Endorsed by ${approverName}.`
        : `Approved by ${approverName} for departmental coursework milestones.`;
      await approveRequisition(id, note);
    } catch (err) {
      console.error('Failed to quick-approve requisition:', err);
    }
  };

  const handleOpenEndorseWithCaveat = (req) => {
    setEndorseModalReq(req);
    setAuthorizedLocation(`Room ${req.department?.includes('AIML') ? '5CL-07' : req.department?.includes('CSE') ? '4CL-07' : '6RA-02'} Bench Only`);
    setAuthorizedTerm('14-Day Sprint');
    setCustomEndorsementNotes('Coursework validated. In-lab supervision required.');
  };

  const handleConfirmEndorseWithCaveat = async (e) => {
    e.preventDefault();
    if (!endorseModalReq) return;
    const reqId = endorseModalReq.id || endorseModalReq.requestNumber;
    const combinedNotes = `[Caveat Endorsement] Location: ${authorizedLocation} • Cap: ${authorizedTerm} • Conditions: ${customEndorsementNotes} (${approverName})`;
    setEndorseModalReq(null);
    try {
      await approveRequisition(reqId, combinedNotes);
    } catch (err) {
      console.error('Failed to endorse with caveat:', err);
    }
  };

  const handleOpenInstitutionalOverride = (req) => {
    setOverrideModalReq(req);
    setOverrideReason('Head of Department capital sign-off: Authorized under Capstone Research Grant 2026.');
  };

  const handleConfirmInstitutionalOverride = async (e) => {
    e.preventDefault();
    if (!overrideModalReq) return;
    const reqId = overrideModalReq.id || overrideModalReq.requestNumber;
    const note = `[Institutional HoD Override] ${overrideReason} — Authorized by ${approverName}`;
    setOverrideModalReq(null);
    try {
      await approveRequisition(reqId, note);
    } catch (err) {
      console.error('Failed institutional override:', err);
    }
  };

  const handleBatchEndorseCompliant = async () => {
    const compliant = filteredRequisitions.filter((r) => (r.teamReliabilityScore || 90) >= 75);
    if (!compliant.length) return;
    setIsBatchApproving(true);
    try {
      for (const req of compliant) {
        await approveRequisition(
          req.id,
          `Batch endorsement: ${approverName} verified compliant curriculum proposal.`
        );
      }
    } finally {
      setIsBatchApproving(false);
    }
  };

  const handleOpenReject = (req) => {
    setRejectModalReq(req);
    setRejectReason('');
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectModalReq) return;
    const reqId = rejectModalReq.id;
    const reason = rejectReason;
    setRejectModalReq(null);
    await rejectRequisition(reqId, reason, approverName);
  };


  // Compact Table Columns
  const columns = [
    {
      header: 'Request Date & ID',
      accessor: 'id',
      width: '150px',
      render: (row) => (
        <div className="font-sans text-xs">
          <div className="font-semibold text-white tracking-wide">{row.id || row.requestNumber}</div>
          <div className="text-zinc-500 text-[11px] mt-0.5">{formatFriendlyDate(row.requestDate || row.submittedDate)}</div>
        </div>
      ),
    },
    {
      header: 'Student Team & Department',
      accessor: 'studentName',
      width: '210px',
      render: (row) => {
        const studentName = row.studentName || row.submittedBy;
        const studentPrn = row.studentPrn || row.borrowerPrn;
        const deptCode = getReqDepartmentCode(row);
        const isMyMentored = isMentorMatch(row);

        return (
          <div className="font-sans text-xs space-y-1">
            <div className="text-white font-medium">{studentName}</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[#c9b8a0] border border-white/10 text-[11px] font-medium">
                {row.projectId}
              </span>
              <span className="text-zinc-400 text-[11px] font-semibold">{deptCode}</span>
            </div>
            <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
              <span>Mentor:</span>
              <span className="text-zinc-300 font-medium">{row.mentorName}</span>
              {isMyMentored && (
                <span className="ml-auto text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 font-medium border border-emerald-500/25">
                  Mentored
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      header: 'Capital Asset Tier',
      accessor: 'capitalTier',
      width: '160px',
      render: (row) => {
        const capitalTier = getRequisitionCapitalTier(row);
        if (capitalTier === 'Tier 4 High Value') {
          return (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1 w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>Tier 4 High Value</span>
            </span>
          );
        }
        if (capitalTier === 'Tier 3 Advanced') {
          return (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1 w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Tier 3 Advanced</span>
            </span>
          );
        }
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] text-zinc-400 bg-white/[0.03] border border-white/10">
            Standard Tier 1/2
          </span>
        );
      },
    },
    {
      header: 'Requested Components',
      accessor: 'technicalPurpose',
      render: (row) => (
        <div className="space-y-1.5 font-sans text-xs">
          <div className="flex flex-wrap gap-1.5">
            {row.componentsRequested?.map((c, i) => (
              <span key={i} className="px-2 py-0.5 rounded-lg bg-white/[0.04] text-zinc-200 border border-white/10 text-[11px]">
                {c.quantity}x {c.nomenclature}
              </span>
            ))}
          </div>
          <p className="text-zinc-400 text-xs italic line-clamp-1">
            "{row.technicalPurpose || row.purposeDescription}"
          </p>
        </div>
      ),
    },
    {
      header: 'Supervisor Review Controls',
      width: '280px',
      align: 'right',
      render: (row) => {
        const statusLower = String(row.status || '').toLowerCase().trim();
        const isFacultyEndorsed = statusLower.includes('endorsed');
        const isPending = isHoD
          ? (statusLower === 'submitted' || statusLower === 'pending approval' || statusLower === 'pending' || isFacultyEndorsed || statusLower.includes('review'))
          : (statusLower === 'submitted' || statusLower === 'pending approval' || statusLower === 'pending' || statusLower.includes('review'));
        const isMyMentored = isMentorMatch(row);
        const canAct = isHoD || (isFaculty && isMyMentored) || !isFaculty;

        if (!isPending) {
          return (
            <div className="flex items-center justify-end gap-2 font-sans text-xs">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                {row.status === 'Ready for Counter Pickup' ? 'Sanctioned / Staged' : row.status === 'Dispatched' ? 'Dispatched' : 'Approved'}
              </span>
              <button
                type="button"
                onClick={() => setTimelineModalReq(row)}
                className="px-2.5 py-1 rounded-full text-[11px] bg-white/[0.04] text-zinc-300 hover:text-white border border-white/10"
              >
                Audit Log
              </button>
            </div>
          );
        }

        if (!canAct) {
          return (
            <div className="flex items-center justify-end gap-1.5 text-xs text-zinc-500 font-sans">
              <Lock className="w-3.5 h-3.5 text-zinc-500" />
              <span>Mentored by {row.mentorName || 'Faculty'} (Audit Only)</span>
            </div>
          );
        }

        const shortage = checkRequisitionStockShortage(row);

        return (
          <div className="flex items-center justify-end gap-1.5 font-sans text-xs">
            {shortage.hasShortage && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>Shortage: Req {shortage.requested} / Avail {shortage.available}</span>
              </span>
            )}
            <button
              onClick={() => handleOpenModify(row)}
              className="p-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border border-white/10 cursor-pointer"
              title="Adjust Quantity"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleOpenReject(row)}
              className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/25 text-[11px] cursor-pointer"
            >
              Reject
            </button>
            <button
              disabled={shortage.hasShortage}
              onClick={() => !shortage.hasShortage && handleQuickApprove(row.id, isFacultyEndorsed ? 'Department allocation sanctioned by HoD. Passed to Counter Desk.' : null)}
              className={`px-3.5 py-1 rounded-full font-semibold text-[11px] shadow-sm flex items-center gap-1 ${
                shortage.hasShortage
                  ? 'bg-zinc-800 text-zinc-500 border border-white/5 cursor-not-allowed opacity-60'
                  : 'bg-white hover:bg-neutral-200 text-black cursor-pointer'
              }`}
              title={shortage.hasShortage ? `Cannot approve: Requested ${shortage.requested} exceeds available stock (${shortage.available}). Adjust quantity first.` : 'Approve Requisition'}
            >
              <Check className="w-3 h-3 stroke-[2.5]" />
              <span>{shortage.hasShortage ? 'Blocked: Stock Shortage' : isHoD ? (isFacultyEndorsed ? 'Sanction & Pass to Counter' : 'Executive Endorse') : 'Approve'}</span>
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER & TELEMETRY STRIP                               */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white font-display">
              {isHoD ? 'Executive Approvals Desk' : 'Faculty Supervisor Review Desk'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[11px] text-[#c9b8a0] font-sans font-medium">
              {pendingRequisitions.length} pending
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            {isHoD
              ? `Department Executive Suite: ${hodDepartment} Department Overseer (${approverName}) • Tier 3/4 Capital Controls.`
              : `Academic Authorization: review technical rationale and endorse laboratory hardware allocations for mentored capstones.`}
          </p>
        </div>

        {/* View Mode & Queue Tabs */}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Pending Review ({pendingRequisitions.length})
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'approved'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Past Approvals ({pastApprovedRequisitions.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All ({scopedRequisitions.length})
            </button>
          </div>

          {/* Grid / Table Switcher */}
          <div className="flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full text-xs transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
              }`}
              title="Cupertino Dossier Cards"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-full text-xs transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
              }`}
              title="Compact Ledger Table"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. ROLE-BASED DEPARTMENT & CAPITAL FILTER STRIP               */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        {/* Real-time Search & Batch Pass Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student, PRN, project group, component..."
              className="w-full pl-10 pr-4 py-2 bg-white/[0.03] border border-white/10 rounded-full font-sans text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/30"
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

          {/* Tier 3/4 Capital Sign-Offs Quick Toggle Pill */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setCapitalFilter(capitalFilter === 'TIER3_4' ? 'ALL' : 'TIER3_4')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                capitalFilter === 'TIER3_4'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 text-black font-bold shadow-md'
                  : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:border-amber-500/60'
              }`}
              title="Filter Tier 3 Advanced and Tier 4 High-Value capital assets requiring executive authorization"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Tier 3/4 Capital Sign-Offs</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                capitalFilter === 'TIER3_4' ? 'bg-black/20 text-black' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {tier3And4Count}
              </span>
            </button>

            {/* Fast-Pass Quick Batch Endorsement Button */}
            {activeTab === 'pending' && filteredRequisitions.length > 1 && (
              <button
                type="button"
                onClick={handleBatchEndorseCompliant}
                disabled={isBatchApproving}
                className="px-4 py-1.5 rounded-full bg-white hover:bg-neutral-200 text-black font-semibold text-xs shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>
                  {isBatchApproving
                    ? 'Endorsing...'
                    : `Fast-Pass Compliant (${filteredRequisitions.filter((r) => (r.teamReliabilityScore || 90) >= 75).length})`}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* ─── DEPARTMENT SCOPING & FACULTY WINGS ─── */}
        {/* ─── HOD CONTROLS: FACULTY WINGS (NO DEPT QUEUE) ─── */}
        {isHoD && (
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#c9b8a0] mr-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#a78b71]" />
              <span>Faculty Wing:</span>
            </span>
            <button
              type="button"
              onClick={() => setSelectedFacultyFilter('ALL')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedFacultyFilter === 'ALL'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'bg-white/[0.03] text-zinc-400 hover:text-white'
              }`}
            >
              All Wings
            </button>
            {facultyMentors.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setSelectedFacultyFilter(m)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  selectedFacultyFilter === m
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'bg-white/[0.03] text-zinc-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        )}

        {/* ─── FACULTY CONTROLS: MENTORED TEAMS VS AUDIT VIEW (ONE DEPT ONLY) ─── */}
        {isFaculty && (
          <div className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-white/[0.02] border border-white/10 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#c9b8a0] flex items-center gap-1.5 mr-2">
                <UserCheck className="w-3.5 h-3.5 text-[#a78b71]" />
                <span>Faculty Authorization Scope:</span>
              </span>
              <button
                type="button"
                onClick={() => setFacultyScopeTab('mentored')}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  facultyScopeTab === 'mentored'
                    ? 'bg-white text-black shadow-sm'
                    : 'bg-white/[0.04] text-zinc-400 border border-white/10 hover:text-white'
                }`}
              >
                My Mentored Teams ({requisitions.filter((r) => getReqDepartmentCode(r) === 'AIML' && isMentorMatch(r)).length})
              </button>
              <button
                type="button"
                onClick={() => setFacultyScopeTab('audit')}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  facultyScopeTab === 'audit'
                    ? 'bg-white text-black shadow-sm'
                    : 'bg-white/[0.04] text-zinc-400 border border-white/10 hover:text-white'
                }`}
              >
                <Lock className="w-3 h-3" />
                <span>Department Audit (Read-Only) ({requisitions.filter((r) => getReqDepartmentCode(r) === 'AIML' && !isMentorMatch(r)).length})</span>
              </button>
            </div>
            <div className="text-[11px] text-zinc-400">
              Department: <span className="text-white font-medium">AIML</span> • Mentor Wing: <span className="text-white font-medium">{currentUser?.name || 'Dr. Manoj Patil'}</span>
            </div>
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
              const capitalTier = getRequisitionCapitalTier(req);
              const deptCode = getReqDepartmentCode(req);
              const statusLower = String(req.status || '').toLowerCase().trim();
              const isFacultyEndorsed = statusLower.includes('endorsed');
              const isPending = isHoD
                ? (statusLower === 'submitted' || statusLower === 'pending approval' || statusLower === 'pending' || isFacultyEndorsed || statusLower.includes('review'))
                : (statusLower === 'submitted' || statusLower === 'pending approval' || statusLower === 'pending' || statusLower.includes('review'));
              const isMyMentored = isMentorMatch(req);
              const canAct = isHoD || (isFaculty && isMyMentored) || !isFaculty;

              const studentName = req.studentName || req.submittedBy;
              const studentPrn = req.studentPrn || req.borrowerPrn;
              const reqId = req.id || req.requestNumber;

              return (
                <div
                  key={reqId}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-all p-5 space-y-4 font-sans backdrop-blur-sm shadow-sm"
                >
                  {/* Row 1: Header Dossier with Compliance & Capital Tier */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-semibold text-white tracking-wide text-sm">{reqId}</span>
                      <span className="text-zinc-500">•</span>
                      <span className="text-white font-medium text-xs">{studentName}</span>
                      <span className="text-zinc-500 text-xs">({studentPrn})</span>
                      <span className="px-2 py-0.5 rounded-md bg-white/[0.05] text-[#c9b8a0] border border-white/10 text-[11px] font-medium">
                        {req.projectId}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px] font-semibold">
                        {deptCode} Dept
                      </span>

                      {/* Prominent Faculty Endorsement & Capital Tier Badges */}
                      {isFacultyEndorsed && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1 shadow-sm">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Stage 2 • Faculty Endorsed • Awaiting HoD Sanction</span>
                        </span>
                      )}
                      {capitalTier === 'Tier 4 High Value' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 text-[11px] font-bold flex items-center gap-1 shadow-sm">
                          <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                          <span>Tier 4 High Value Capital</span>
                        </span>
                      )}
                      {capitalTier === 'Tier 3 Advanced' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1 shadow-sm">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                          <span>Tier 3 Advanced Asset</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-400">
                        Mentor: <span className="text-zinc-200 font-medium">{req.mentorName}</span>
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          (req.teamReliabilityScore || 90) >= 75
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {req.teamReliabilityScore || 95}/100 Integrity
                      </span>
                      <span className="text-xs text-zinc-500 font-sans">
                        {formatFriendlyDate(req.requestDate || req.submittedDate)}
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Requested Hardware Items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {req.componentsRequested?.map((comp, idx) => {
                      const stock = getComponentStock(comp, req);
                      const image = getItemImage(comp);
                      const isShortage = stock.count < comp.quantity;

                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-center gap-3 hover:border-white/20 transition-all"
                        >
                          <div className="w-11 h-11 rounded-lg bg-black/60 border border-white/10 p-1 flex items-center justify-center flex-shrink-0">
                            <img
                              src={image}
                              alt={comp.nomenclature}
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => {
                                e.target.src = '/images/hardware/raspberry-pi-5.jpg';
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-medium text-white truncate" title={comp.nomenclature}>
                              {comp.nomenclature}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                              <span className="font-semibold text-[#f5e6c8]">Qty {comp.quantity}</span>
                              <span className="text-zinc-600">•</span>
                              <span className={isShortage ? 'text-amber-400 font-medium' : 'text-zinc-400'}>
                                {stock.count > 0 ? `${stock.count} bench stock` : 'Awaiting restock'}
                              </span>
                            </div>
                            <div className="text-[10px] text-zinc-500 truncate mt-0.5">
                              Location: {stock.coordinates}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Row 3: Stated Technical Purpose & Faculty Endorsement Note */}
                  <div className="space-y-2">
                    {(req.technicalPurpose || req.purposeDescription) && (
                      <p className="text-xs text-zinc-300 font-sans leading-relaxed line-clamp-2 px-1">
                        <span className="text-zinc-500 font-medium">Academic Rationale: </span>
                        {(req.technicalPurpose || req.purposeDescription).replace(/^\[Faculty Endorsement\]\s*/, '')}
                      </p>
                    )}

                    {req.supervisorNotes && isFacultyEndorsed && (
                      <div className="px-3.5 py-2 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-200 text-xs font-sans flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <span className="font-semibold text-emerald-300">Faculty Guide Endorsement ({req.mentorName || 'Faculty'}): </span>
                          <span className="italic">"{req.supervisorNotes}"</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Row 4: Action Command Bar */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-3 flex-wrap">
                    {isPending ? (
                      canAct ? (
                        <>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {((isHoD && isFacultyEndorsed)
                              ? ['Curriculum Sanctioned', 'Tier 3/4 Authorized', 'Pass to Counter Desk']
                              : ['Curriculum Validated', 'Capstone Milestone', 'Sprint Authorized']
                            ).map((preset) => (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => handleOpenApproveModal(req, preset)}
                                className="px-2.5 py-1 rounded-full text-[11px] font-sans text-zinc-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all cursor-pointer"
                              >
                                {preset}
                              </button>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => handleOpenModify(req)}
                              className="px-3 py-1.5 rounded-full text-xs font-medium text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors cursor-pointer"
                              title="Decrease or adjust authorized component count"
                            >
                              Adjust Qty
                            </button>

                            <button
                              onClick={() => handleOpenEndorseWithCaveat(req)}
                              className="px-3 py-1.5 rounded-full text-xs font-medium text-[#c9b8a0] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors cursor-pointer flex items-center gap-1"
                              title="Endorse with specific bench or room restrictions"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Approve with Caveat</span>
                            </button>

                            {isHoD && capitalTier && (
                              <button
                                onClick={() => handleOpenInstitutionalOverride(req)}
                                className="px-3 py-1.5 rounded-full text-xs font-semibold text-amber-300 hover:text-black bg-amber-500/10 hover:bg-amber-400 border border-amber-500/30 transition-all cursor-pointer flex items-center gap-1"
                                title="Executive institutional sign-off bypassing standard policy constraints"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Institutional Override</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleOpenReject(req)}
                              className="px-3 py-1.5 rounded-full text-xs font-medium text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors cursor-pointer"
                            >
                              Reject
                            </button>

                            {(() => {
                              const shortage = checkRequisitionStockShortage(req);
                              return (
                                <button
                                  disabled={shortage.hasShortage}
                                  onClick={() => !shortage.hasShortage && handleOpenApproveModal(req, isFacultyEndorsed ? 'Department allocation sanctioned by HoD. Passed to Counter Desk.' : null)}
                                  className={`px-4 py-1.5 rounded-full font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5 ${
                                    shortage.hasShortage
                                      ? 'bg-zinc-800 text-zinc-500 border border-white/5 cursor-not-allowed opacity-60'
                                      : 'bg-white hover:bg-[#f5e6c8] text-black cursor-pointer active:scale-95'
                                  }`}
                                  title={shortage.hasShortage ? `Cannot approve: Requested ${shortage.requested} exceeds available stock (${shortage.available}). Use 'Adjust Qty' to reduce quantity.` : 'Approve with Custom Notes'}
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span>{shortage.hasShortage ? 'Blocked: Stock Shortage' : isHoD ? (isFacultyEndorsed ? 'Sanction & Notes' : 'Endorse & Notes') : 'Approve with Notes'}</span>
                                </button>
                              );
                            })()}
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-between w-full text-xs text-zinc-500 font-sans">
                          <span className="flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-zinc-500" />
                            <span>Read-Only Audit Mode: Requisition mentored under <strong>{req.mentorName}</strong>'s faculty wing.</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setTimelineModalReq(req)}
                            className="px-3 py-1 rounded-full text-xs bg-white/[0.04] text-zinc-300 hover:text-white border border-white/10"
                          >
                            Inspect Audit Trail
                          </button>
                        </div>
                      )
                    ) : (
                      <>
                        <span className="text-xs text-zinc-400">
                          {req.status === 'Dispatched'
                            ? 'Active in student custody'
                            : req.status === 'Ready for Counter Pickup'
                            ? 'Ready at counter desk for pickup'
                            : req.status === 'Rejected'
                            ? 'Requisition rejected with recorded academic rationale'
                            : 'Approved and sent to counter desk for physical staging'}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setTimelineModalReq(req)}
                            className="px-3 py-1.5 rounded-full text-xs text-zinc-300 hover:text-white bg-white/[0.04] border border-white/10 cursor-pointer"
                          >
                            View Audit Trail
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate(`/workspace/projects/${req.projectId}`)}
                            className="p-1.5 rounded-full bg-white/[0.04] text-zinc-300 hover:text-white border border-white/10"
                            title="Open Project Dossier"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center rounded-2xl border border-white/10 bg-white/[0.01]">
              <CheckSquare className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
              <div className="text-sm font-medium text-white">Requisition Queue Clear</div>
              <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
                {isHoD
                  ? `No hardware requisitions currently pending authorization for ${selectedDeptFilter === 'ALL' ? 'any engineering department' : `${selectedDeptFilter} Department`}.`
                  : `No student capstone requisitions currently pending under your mentorship wing (${currentUser?.name || 'Faculty'}).`}
              </p>
              {isFaculty && facultyScopeTab === 'mentored' && (
                <div className="flex items-center justify-center gap-2 mt-3.5 flex-wrap">
                  {scopedRequisitions.length > 0 && activeTab !== 'all' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('all')}
                      className="px-4 py-1.5 rounded-full bg-white text-black text-xs font-semibold shadow-sm hover:bg-neutral-200 transition-all cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <span>View All ({scopedRequisitions.length}) Mentored Requisitions</span>
                    </button>
                  )}
                  {requisitions.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setFacultyScopeTab('audit')}
                      className="px-4 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-zinc-200 hover:text-white text-xs font-semibold border border-white/15 transition-all cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5 text-[#c9b8a0]" />
                      <span>View All {requisitions.length} Requisitions in Department Audit (Read-Only)</span>
                    </button>
                  )}
                </div>
              )}
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
          pageSize={10}
          emptyMessage="No hardware requisitions currently match your filter criteria."
        />
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 1: REJECT REQUISITION                                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={!!rejectModalReq}
        onClose={() => setRejectModalReq(null)}
        title={`Reject Requisition: ${rejectModalReq?.id || rejectModalReq?.requestNumber}`}
        subtitle={`Requester: ${rejectModalReq?.studentName || rejectModalReq?.submittedBy} • Project: ${rejectModalReq?.projectId}`}
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
              placeholder="e.g. Scope exceeding approved capstone milestones; please consult with faculty mentor during office hours."
              className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-500/50"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setRejectModalReq(null)}
              className="px-4 py-2 rounded-full border border-white/10 text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md"
            >
              Record Rejection
            </button>
          </div>
        </form>
      </Modal>


      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 3: APPROVE WITH CAVEAT / RESTRICTIONS                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={!!endorseModalReq}
        onClose={() => setEndorseModalReq(null)}
        title={`Approve with Caveat: ${endorseModalReq?.id || endorseModalReq?.requestNumber}`}
        subtitle="Attach laboratory location bounds, loan period caps, or technical supervision conditions."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleConfirmEndorseWithCaveat} className="space-y-4 text-xs font-sans text-zinc-300">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1 font-semibold">
              Authorized Physical Location
            </label>
            <input
              type="text"
              value={authorizedLocation}
              onChange={(e) => setAuthorizedLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white font-sans text-xs focus:outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1 font-semibold">
              Authorized Sprint Term
            </label>
            <select
              value={authorizedTerm}
              onChange={(e) => setAuthorizedTerm(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#141417] border border-white/10 rounded-xl text-white font-sans text-xs focus:outline-none focus:border-white/30"
            >
              <option value="7-Day Micro Sprint">7-Day Micro Sprint</option>
              <option value="14-Day Sprint">14-Day Sprint (Standard)</option>
              <option value="21-Day Capstone Milestone">21-Day Capstone Milestone</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1 font-semibold">
              Handling Caveats & Supervision Instructions
            </label>
            <textarea
              rows={3}
              value={customEndorsementNotes}
              onChange={(e) => setCustomEndorsementNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white font-sans text-xs focus:outline-none focus:border-white/30"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setEndorseModalReq(null)}
              className="px-4 py-2 rounded-full border border-white/10 text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-md"
            >
              Commit Caveat Endorsement
            </button>
          </div>
        </form>
      </Modal>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL: ADJUST QUANTITIES (STOCK RESOLUTION)                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={!!modifyModalReq}
        onClose={() => setModifyModalReq(null)}
        title={`Adjust Authorized Quantities: ${modifyModalReq?.id || modifyModalReq?.requestNumber}`}
        subtitle={`Align request with available depot inventory for ${modifyModalReq?.studentName || modifyModalReq?.submittedBy}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveModifiedQuantities} className="space-y-4 text-xs font-sans text-zinc-300">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 space-y-1">
            <div className="font-semibold text-xs flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Inventory Allocation Adjustment</span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              Adjust the approved quantity for each requested component to match available lab bench stock before giving supervisory sanction.
            </p>
          </div>

          <div className="space-y-3">
            {modifyModalReq?.componentsRequested?.map((comp, idx) => {
              const stock = getComponentStock(comp);
              const isShortage = stock.count < (modifiedQuantities[idx] ?? comp.quantity);

              return (
                <div key={idx} className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white text-xs">{comp.nomenclature}</span>
                    <span className={`text-[11px] font-semibold ${isShortage ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {stock.count} in stock
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <label className="text-zinc-400 text-xs">Approved Quantity:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max={stock.count > 0 ? stock.count : 1}
                        value={modifiedQuantities[idx] ?? comp.quantity}
                        onChange={(e) =>
                          setModifiedQuantities({
                            ...modifiedQuantities,
                            [idx]: Number(e.target.value),
                          })
                        }
                        className="w-20 px-2.5 py-1.5 bg-[#141417] border border-white/15 rounded-lg text-white font-semibold text-xs text-center focus:outline-none focus:border-[#c9b8a0]"
                      />
                      {stock.count > 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            setModifiedQuantities({
                              ...modifiedQuantities,
                              [idx]: stock.count,
                            })
                          }
                          className="px-2 py-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-[10px] text-zinc-300 border border-white/10 cursor-pointer"
                        >
                          Set to Max ({stock.count})
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setModifyModalReq(null)}
              className="px-4 py-2 rounded-full border border-white/10 text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-md cursor-pointer"
            >
              Save Quantities
            </button>
          </div>
        </form>
      </Modal>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 4: HOD INSTITUTIONAL OVERRIDE                           */}
      {/* ───────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={!!overrideModalReq}
        onClose={() => setOverrideModalReq(null)}
        title={`Institutional HoD Override: ${overrideModalReq?.id || overrideModalReq?.requestNumber}`}
        subtitle={`Executive Authorization for ${getRequisitionCapitalTier(overrideModalReq) || 'Capital Hardware'}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleConfirmInstitutionalOverride} className="space-y-4 text-xs font-sans text-zinc-300">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 space-y-1">
            <div className="font-semibold text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Head of Department Executive Sign-Off</span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              This action overrides student quota limits, high-value asset restrictions, and issues formal departmental authorization for capital equipment.
            </p>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1 font-semibold">
              Administrative Override Rationale <span className="text-amber-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              placeholder="e.g. Authorized by Head of Department under Capstone Special Research Grant 2026."
              className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white font-sans text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setOverrideModalReq(null)}
              className="px-4 py-2 rounded-full border border-white/10 text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold shadow-md"
            >
              Commit Executive Override
            </button>
          </div>
        </form>
      </Modal>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 5: AUDIT TRAIL MODAL                                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={!!timelineModalReq}
        onClose={() => setTimelineModalReq(null)}
        title={`Audit Trail: ${timelineModalReq?.id || timelineModalReq?.requestNumber}`}
        subtitle={`Project: ${timelineModalReq?.projectId} • Lead: ${timelineModalReq?.studentName || timelineModalReq?.submittedBy}`}
        maxWidth="max-w-lg"
      >
        <div className="space-y-4 text-xs font-sans text-zinc-300">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block mb-1">
              Purpose & Technical Scope
            </span>
            <p className="text-zinc-200 text-xs italic">
              "{timelineModalReq?.technicalPurpose || timelineModalReq?.purposeDescription}"
            </p>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block mb-2">
              Progression Steps
            </span>
            <div className="relative pl-6 space-y-3.5 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
              {timelineModalReq?.timeline?.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full border ${
                    step.completed || step.actor ? 'bg-emerald-400 border-emerald-500' : 'bg-zinc-700 border-zinc-600'
                  }`} />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{step.stage || step.step}</span>
                    <span className="text-[11px] text-zinc-500">{step.timestamp || 'Pending'}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Actor: <span className="text-zinc-300">{step.actor || 'Pending review'}</span>
                  </div>
                  {step.note && (
                    <div className="text-[11px] text-emerald-300/90 mt-0.5 italic">
                      "{step.note}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setTimelineModalReq(null)}
              className="px-4 py-2 rounded-full border border-white/10 text-xs text-zinc-400 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL: FACULTY / HOD APPROVAL & SUPERVISOR NOTES               */}
      {/* ───────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={!!approveModalReq}
        onClose={() => setApproveModalReq(null)}
        title={isHoD ? `HoD Department Sanction: ${approveModalReq?.id || approveModalReq?.requestNumber}` : `Faculty Supervisor Endorsement: ${approveModalReq?.id || approveModalReq?.requestNumber}`}
        subtitle={`Academic authorization for ${approveModalReq?.studentName || approveModalReq?.submittedBy} (${approveModalReq?.studentPrn || approveModalReq?.borrowerPrn}) • ${approveModalReq?.projectId}`}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleConfirmApprovalWithNotes} className="space-y-4 text-xs font-sans text-zinc-300">
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 space-y-1">
            <div className="font-semibold text-xs flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{isHoD ? 'Department Allocation Sanction' : 'Curriculum Endorsement'}</span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              {isHoD
                ? 'Review hardware allocation and append departmental sanction remarks before forwarding kit to the Counter Dispatch Desk.'
                : 'Review academic rationale and record supervisory notes or project milestone conditions for this requisition.'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-1 text-zinc-400">
            <div className="text-white font-medium text-xs">
              Project: {approveModalReq?.projectId}
            </div>
            <div className="text-[11px]">
              Components: {approveModalReq?.componentsRequested?.map((c) => `${c.quantity}x ${c.nomenclature}`).join(', ')}
            </div>
            {approveModalReq?.technicalPurpose && (
              <div className="text-[11px] text-zinc-500 italic mt-1">
                Rationale: "{approveModalReq.technicalPurpose}"
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
                {isHoD ? 'HoD Department Notes & Directives' : 'Faculty Mentor Notes & Feedback'} <span className="text-emerald-400">*</span>
              </label>
              <span className="text-[10px] text-zinc-500">Recorded into official audit trail</span>
            </div>

            {/* Quick Note Presets */}
            <div className="flex items-center gap-1.5 flex-wrap mb-2">
              {(isHoD
                ? [
                    'Department allocation sanctioned by HoD. Passed to Counter Desk.',
                    'Authorized under Capstone Research Grant 2026.',
                    'Approved for departmental coursework milestones.',
                  ]
                : [
                    'Approved for departmental coursework milestones.',
                    'Curriculum proposal and technical scope verified.',
                    'Capstone sprint authorized. Lab supervision required.',
                  ]
              ).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setApprovalNotes(preset)}
                  className="px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[10px] text-zinc-300 hover:text-white transition-all cursor-pointer truncate max-w-[220px]"
                  title={preset}
                >
                  {preset}
                </button>
              ))}
            </div>

            <textarea
              required
              rows={3}
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
              placeholder={isHoD ? 'Enter departmental allocation notes, bench permissions, or pickup directives...' : 'Enter mentor remarks, milestone verification, or usage conditions...'}
              className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white font-sans text-xs focus:outline-none focus:border-emerald-400 leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setApproveModalReq(null)}
              className="px-4 py-2 rounded-full border border-white/10 text-xs text-zinc-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isHoD ? 'Sanction & Release Order' : 'Endorse Requisition'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ApprovalsQueuePage;
