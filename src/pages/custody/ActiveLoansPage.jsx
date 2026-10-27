import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Wrench,
  RotateCcw,
} from 'lucide-react';

export function ActiveLoansPage() {
  const navigate = useNavigate();
  const { activeLoans, requisitions, inventory, requestExtension, reportDefect } = useLabData();
  const { currentUser, role } = useAuth();

  const [selectedLoan, setSelectedLoan] = useState(null);
  const [inspectedLoan, setInspectedLoan] = useState(null);
  const [defectLoan, setDefectLoan] = useState(null);
  const [defectCategory, setDefectCategory] = useState('Component Fault');
  const [defectSeverity, setDefectSeverity] = useState('Moderate');
  const [defectDescription, setDefectDescription] = useState('');
  const [isSubmittingDefect, setIsSubmittingDefect] = useState(false);
  const [extensionDays, setExtensionDays] = useState('7');
  const [extensionReason, setExtensionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // Default to Apple Hardware Stage Cards

  const isStaff = useMemo(() => {
    return (
      role === 'Lab Assistant' ||
      role === 'HoD / Admin' ||
      currentUser?.role?.toLowerCase().includes('assistant') ||
      currentUser?.role?.toLowerCase().includes('admin') ||
      currentUser?.role?.toLowerCase().includes('technician')
    );
  }, [role, currentUser]);

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

  // Returned requisitions for the current user/project
  const userReturnedRequisitions = useMemo(() => {
    return (requisitions || []).filter(
      (r) =>
        (r.studentPrn === currentUser?.prn ||
         r.borrowerPrn === currentUser?.prn ||
         r.requesterPrn === currentUser?.prn ||
         r.submittedBy === currentUser?.name ||
         r.studentName === currentUser?.name ||
         (role === 'Student' && (r.studentPrn === '25070126076' || r.borrowerPrn === '25070126076'))) &&
        (r.status === 'Returned' || r.status === 'Returned & Restocked')
    );
  }, [requisitions, currentUser, role]);

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
  const getInventoryItem = (assetTag, nomenclature) => {
    let item = inventory.find((i) => i.assetTag === assetTag || i.id === assetTag);
    if (!item && nomenclature) {
      item = inventory.find((i) => i.nomenclature?.toLowerCase() === nomenclature?.toLowerCase());
      if (!item) {
        const nom = nomenclature.toLowerCase();
        if (nom.includes('jetson') || nom.includes('orin') || nom.includes('nano')) {
          item = inventory.find((i) => i.id?.includes('JET') || i.nomenclature?.toLowerCase().includes('jetson'));
        } else if (nom.includes('raspberry') || nom.includes('rpi')) {
          item = inventory.find((i) => i.id?.includes('RPI') || i.nomenclature?.toLowerCase().includes('raspberry'));
        }
      }
    }
    return item || {};
  };

  const resolveHardwareImage = (itemOrNom) => {
    const nom = (typeof itemOrNom === 'string' ? itemOrNom : itemOrNom?.nomenclature || '').toLowerCase();
    if (nom.includes('jetson') || nom.includes('orin')) return '/images/hardware/jetson-nano.jpg';
    if (nom.includes('raspberry') || nom.includes('rpi')) return '/images/hardware/raspberry-pi-5.jpg';
    if (nom.includes('esp32')) return '/images/hardware/esp32-wroom.jpg';
    if (nom.includes('arduino') || nom.includes('uno')) return '/images/hardware/arduino-uno-r3.jpg';
    if (nom.includes('oscilloscope') || nom.includes('rigol')) return '/images/hardware/oscilloscope.jpg';
    if (nom.includes('realsense')) return '/images/hardware/realsense-camera.jpg';
    if (nom.includes('thermal') || nom.includes('flir')) return '/images/hardware/thermal-camera.jpg';
    if (nom.includes('turtlebot')) return '/images/hardware/turtlebot-robot.jpg';
    if (nom.includes('dobot') || nom.includes('kinova') || nom.includes('arm')) return '/images/hardware/robotic-arm.jpg';
    if (nom.includes('multimeter')) return '/images/hardware/digital-multimeter.jpg';
    if (nom.includes('breadboard')) return '/images/hardware/breadboard-830.jpg';
    if (nom.includes('jumper')) return '/images/hardware/jumper-wires.jpg';
    if (nom.includes('relay')) return '/images/hardware/relay-module.jpg';
    if (nom.includes('oled')) return '/images/hardware/oled-display.jpg';
    if (nom.includes('lcd')) return '/images/hardware/lcd-1602.jpg';
    if (nom.includes('servo')) return '/images/hardware/sg90-servo.jpg';
    if (nom.includes('stepper')) return '/images/hardware/nema17-stepper.jpg';
    if (nom.includes('driver')) return '/images/hardware/l298n-motor-driver.jpg';
    if (nom.includes('battery') || nom.includes('lipo')) return '/images/hardware/18650-battery.jpg';
    if (nom.includes('ultrasonic') || nom.includes('hc-sr04')) return '/images/hardware/hcsr04-ultrasonic.jpg';
    if (nom.includes('dht11') || nom.includes('temperature')) return '/images/hardware/dht11-sensor.jpg';
    if (nom.includes('pir')) return '/images/hardware/pir-motion-sensor.jpg';
    if (nom.includes('ir ') || nom.includes('infrared')) return '/images/hardware/ir-sensor-module.jpg';
    if (nom.includes('bmp280')) return '/images/hardware/bmp280-sensor.jpg';
    if (nom.includes('mpu6050') || nom.includes('imu')) return '/images/hardware/mpu6050-sensor.jpg';
    if (nom.includes('piezo')) return '/images/hardware/piezo-sensor.jpg';
    return '/images/hardware/raspberry-pi-5.jpg';
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
          <div className="text-zinc-500 text-[11px] font-sans">{row.borrowerPrn} • {row.courseCode}</div>
        </div>
      ),
    },
    {
      header: 'Issued Date',
      accessor: 'checkedOutDate',
      width: '130px',
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
      width: '180px',
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
            {isStaff ? (
              <button
                onClick={() =>
                  navigate(
                    `/workspace/operations/dispatch?mode=checkin&assetTag=${encodeURIComponent(row.assetTag)}`
                  )
                }
                className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer transition-all"
                title="Intake & process return inspection at counter"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Intake Return</span>
              </button>
            ) : (
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
            )}
          </div>
        );
      },
    },
  ];

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

  // Render Cupertino Product Staging Card for Issued Hardware
  const renderHardwareCard = (loan) => {
    const invItem = getInventoryItem(loan.assetTag, loan.nomenclature);
    const cardImage = invItem?.image || resolveHardwareImage(loan.nomenclature);
    const isBorrower = loan.borrowerPrn === currentUser?.prn;
    const isExtensionDisabled = userHasOverdue && isBorrower;
    const style = getCategoryStyle(invItem);
    const specChips = getSpecChips(invItem);

    return (
      <div
        key={loan.id}
        onClick={() => setInspectedLoan(loan)}
        className="group relative rounded-3xl border border-white/10 hover:border-[#c9b8a0]/50 transition-all duration-500 hover:shadow-[0_24px_60px_rgba(0,0,0,0.95)] flex flex-col justify-between cursor-pointer overflow-hidden min-h-[500px]"
      >
        {/* Full Image Box Background - Picture fills 100% of the box edge-to-edge */}
        <img
          src={cardImage}
          alt={loan.nomenclature}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out z-0"
          onError={(e) => {
            e.target.src = resolveHardwareImage(loan.nomenclature);
          }}
        />

        {/* Ambient Gradient Scrim for crisp text contrast over picture */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/95 pointer-events-none z-10" />

        {/* Specular hairline top rim */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none rounded-t-3xl z-20" />

        {/* Details Layered Directly On Top of the Picture */}
        <div className="relative z-20 p-6 flex flex-col justify-between h-full min-h-[500px]">
          {/* Top Bar: Category & Tag Header */}
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

          {/* Bottom Area: Hardware Details Overlaid on Picture */}
          <div className="space-y-3.5 pt-20">
            {/* Product Title & Subtitle */}
            <div className="space-y-1">
              <h3 className="font-display text-lg font-bold text-white tracking-tight leading-snug group-hover:text-[#f5e6c8] transition-colors drop-shadow-md">
                {loan.nomenclature}
              </h3>
              <p className="text-xs text-zinc-300 font-sans font-normal line-clamp-2 leading-relaxed drop-shadow-sm">
                {invItem?.subSpecs || 'Institutional lab hardware unit issued for project development.'}
              </p>
            </div>

            {/* Technical Spec Chips */}
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

            {/* Origin Depot & Custody Strip */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-zinc-200 font-sans font-medium text-[11px]">
                <MapPin className="w-3 h-3 text-[#c9b8a0] flex-shrink-0" />
                <span>{loan.locationCoordinates}</span>
              </div>
              <span className="text-zinc-400 text-xs font-sans drop-shadow-sm">
                Held by {loan.borrowerName?.split(' ')[0]} ({loan.borrowerPrn})
              </span>
            </div>

            {/* Card Footer: Deadline Status & Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      loan.daysRemaining < 0
                        ? 'bg-rose-400'
                        : loan.daysRemaining <= 3
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                  />
                  <span className="text-xs font-semibold text-white truncate">
                    {loan.daysRemaining < 0
                      ? `${Math.abs(loan.daysRemaining)} ${Math.abs(loan.daysRemaining) === 1 ? 'day' : 'days'} overdue`
                      : `${loan.daysRemaining} ${loan.daysRemaining === 1 ? 'day' : 'days'} remaining`}
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
                    setDefectLoan(loan);
                  }}
                  className="px-3 py-2 rounded-full text-xs font-medium bg-white/[0.06] hover:bg-rose-500/15 text-zinc-300 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                  title="Report a defect or issue with this hardware unit"
                >
                  <Wrench className="w-3.5 h-3.5 text-zinc-400 group-hover:text-rose-300" />
                  <span>Report Fault</span>
                </button>

                {isStaff ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(
                        `/workspace/operations/dispatch?mode=checkin&assetTag=${encodeURIComponent(loan.assetTag)}`
                      );
                    }}
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 flex-shrink-0"
                    title="Intake return and inspect hardware condition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Intake Return</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenExtension(loan);
                    }}
                    disabled={isExtensionDisabled}
                    className={`px-4 py-2 rounded-full text-xs font-semibold tracking-tight transition-all shadow-lg active:scale-95 flex-shrink-0 cursor-pointer ${
                      isExtensionDisabled
                        ? 'bg-white/[0.06] text-zinc-500 border border-white/10 cursor-not-allowed'
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
                )}
              </div>
          </div>
        </div>
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
          <span className="text-[11px] font-sans text-zinc-400 font-medium hidden sm:inline">
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
      {filteredLoans.length === 0 ? (
        userReturnedRequisitions.length > 0 ? (
          <div className="text-center py-16 px-6 text-zinc-400 text-sm bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-emerald-500/20 rounded-3xl backdrop-blur-xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3.5 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="font-semibold text-white text-base">Bench Clean • Hardware Returned & Restocked</p>
            <p className="text-xs text-zinc-400 mt-1.5 max-w-md mx-auto leading-relaxed">
              All previously requisitioned hardware units have been inspected, restocked at Lab 1 Counter (Desk 2), and cleared from your active custody.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/workspace/custody/requisitions?status=Returned')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <span>View Return Receipts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/workspace/workstation')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-zinc-200 text-black text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <span>Workstation Catalog</span>
              </button>
            </div>
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
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLoans.map(renderHardwareCard)}
        </div>
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
                <div className="font-sans text-zinc-400 text-xs mt-0.5">
                  {selectedLoan.assetTag} • {selectedLoan.id}
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span className="text-zinc-500">Current Due:</span>
                  <span className="text-amber-400 font-sans font-medium">
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
              <span className="font-sans font-semibold text-[#f5e6c8] text-sm">
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
            const invItem = getInventoryItem(inspectedLoan.assetTag, inspectedLoan.nomenclature);
            const modalImage = invItem?.image || resolveHardwareImage(inspectedLoan.nomenclature);
            return (
              <div className="space-y-4 text-xs font-sans text-white">
                <div className="w-full h-48 rounded-2xl bg-black/50 border border-white/10 p-3 flex items-center justify-center overflow-hidden">
                  <img
                    src={modalImage}
                    alt={inspectedLoan.nomenclature}
                    className="h-full object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
                    onError={(e) => {
                      e.target.src = resolveHardwareImage(inspectedLoan.nomenclature);
                    }}
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Origin Lab Room:</span>
                    <span className="font-sans text-white font-medium">
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
                    <span className="font-sans text-zinc-300">
                      {inspectedLoan.checkedOutDate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Scheduled Due:</span>
                    <span className="font-sans text-[#f5e6c8] font-semibold">
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

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 7. STUDENT DEFECT / FAULT REPORTING MODAL                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      {defectLoan && (
        <Modal
          isOpen={!!defectLoan}
          onClose={() => setDefectLoan(null)}
          title="Report Hardware Fault"
          subtitle={`Unit: ${defectLoan.nomenclature} • Asset Tag: ${defectLoan.assetTag}`}
          maxWidth="max-w-lg"
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmittingDefect(true);
              try {
                await reportDefect({
                  assetTag: defectLoan.assetTag,
                  nomenclature: defectLoan.nomenclature,
                  projectId: defectLoan.projectId,
                  severity: defectSeverity,
                  defectCategory,
                  description: defectDescription,
                });
                setDefectLoan(null);
                setDefectDescription('');
              } finally {
                setIsSubmittingDefect(false);
              }
            }}
            className="space-y-4 text-xs font-sans"
          >
            <div className="p-3.5 bg-amber-500/[0.08] border border-amber-500/20 rounded-2xl text-amber-200 text-xs leading-relaxed flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                Reporting a hardware fault alerts the lab technician bench. If approved for return/swap, bring this physical unit to Counter Desk 1 for inspection without incurring a personal penalty.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium block">Issue Classification</label>
              <select
                value={defectCategory}
                onChange={(e) => setDefectCategory(e.target.value)}
                className="w-full bg-[#141417] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#c9b8a0]/50"
              >
                <option value="Component Fault">Component Fault / GPIO Failure</option>
                <option value="Physical Damage">Physical Damage / Broken Pin / Cable</option>
                <option value="Power Failure">Overheating / Power Supply Short</option>
                <option value="Sensor Drift">Sensor Reading Drift / Calibration Error</option>
                <option value="Firmware Issue">Firmware Bricked / Unresponsive</option>
                <option value="Other">Other Bench Anomaly</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium block">Severity Level</label>
              <div className="grid grid-cols-3 gap-2">
                {['Minor', 'Moderate', 'Critical'].map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setDefectSeverity(sev)}
                    className={`py-2 rounded-xl border text-center font-semibold text-xs transition-all cursor-pointer ${
                      defectSeverity === sev
                        ? 'bg-white text-black border-white shadow-sm'
                        : 'bg-white/[0.03] text-zinc-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium block">Detailed Description of Defect</label>
              <textarea
                required
                value={defectDescription}
                onChange={(e) => setDefectDescription(e.target.value)}
                rows={3}
                placeholder="Describe what occurred (e.g. pin 4 not outputting 3.3V, OLED display glass cracked during breadboard insertion)..."
                className="w-full bg-[#141417] border border-white/10 rounded-xl p-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#c9b8a0]/50 text-xs leading-relaxed"
              />
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDefectLoan(null)}
                className="px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 font-semibold text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingDefect || !defectDescription.trim()}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-90 text-white font-semibold text-xs transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmittingDefect ? 'Submitting Ticket...' : 'Submit Fault Report'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default ActiveLoansPage;
