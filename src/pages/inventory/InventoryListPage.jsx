import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLabData } from '../../context/LabDataContext';
import { useAuth } from '../../context/AuthContext';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SearchInput } from '../../components/common/SearchInput';
import { Modal } from '../../components/common/Modal';
import {
  Boxes,
  Plus,
  ShoppingBag,
  Eye,
  BookmarkPlus,
  LayoutGrid,
  Table as TableIcon,
  MapPin,
  Cpu,
  Package,
  X,
  ExternalLink,
  Copy,
  Check,
  Clock,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Layers,
  CheckCircle2,
  SlidersHorizontal,
  Lock,
  Building2,
} from 'lucide-react';

export function InventoryListPage({ initialClassification = null }) {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    inventory,
    addToBasket,
    joinWaitlist,
    addNewInventoryItem,
    setIsBasketOpen,
    selectedDepartment,
    setSelectedDepartment,
    departments,
    userDepartment,
    getItemDeptStock,
  } = useLabData();
  const { role, permissions } = useAuth();
  const isStudent = role === 'Student';

  // Determine initial category from props or route
  const routeClassification = useMemo(() => {
    if (initialClassification) return initialClassification;
    if (location.pathname.includes('/assets')) return 'Asset';
    if (location.pathname.includes('/consumables') || location.pathname.includes('/components')) {
      return 'Consumable';
    }
    return 'all'; // Default to unified workstation showing all components
  }, [location.pathname, initialClassification]);

  const [selectedCategory, setSelectedCategory] = useState(routeClassification || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // Default to Cupertino Component Widgets Grid

  // Keep state in sync if URL route changes directly
  useEffect(() => {
    setSelectedCategory(routeClassification);
  }, [routeClassification]);

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'Asset') {
      navigate('/workspace/inventory/assets');
    } else if (cat === 'Consumable') {
      navigate('/workspace/inventory/consumables');
    } else {
      navigate('/workspace/inventory');
    }
  };

  // Slide-over preview inspector
  const [inspectedItem, setInspectedItem] = useState(null);
  const [copiedTag, setCopiedTag] = useState(null);
  const [selectedClass, setSelectedClass] = useState('ALL');

  // Modal for adding new inventory item
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemData, setNewItemData] = useState({
    assetTag: '',
    nomenclature: '',
    subSpecs: '',
    manufacturer: '',
    classification: 'Asset',
    category: 'Microcontrollers',
    labRoom: 'Lab 2 - IoT',
    coordinates: 'L2-CB1-R1',
    totalStock: 1,
    availableStock: 1,
    image: '/images/hardware/raspberry-pi-5.jpg',
    notes: '',
  });

  const handleCopyTag = (tag, e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 1500);
  };

  // Filtered items (respecting active department, category & component class)
  const filteredItems = useMemo(() => {
    return inventory.filter((item) => {
      if (selectedCategory && selectedCategory !== 'all' && item.classification !== selectedCategory) {
        return false;
      }
      if (selectedDepartment !== 'ALL') {
        const deptStock = getItemDeptStock(item, selectedDepartment);
        if (deptStock.total <= 0) {
          return false;
        }
      }
      if (selectedClass && selectedClass !== 'ALL') {
        const itemCat = (item.category || '').toLowerCase();
        const targetClass = selectedClass.toLowerCase();
        const match =
          itemCat === targetClass ||
          itemCat.startsWith(targetClass) ||
          targetClass.startsWith(itemCat) ||
          (targetClass.includes('microcontroller') && (itemCat.includes('microcontroller') || itemCat === 'mc')) ||
          (targetClass.includes('microprocessor') && (itemCat.includes('microprocessor') || itemCat.includes('compute')));
        if (!match) {
          return false;
        }
      }
      if (inStockOnly) {
        const checkStock = isStudent
          ? getItemDeptStock(item, userDepartment)
          : (selectedDepartment === 'ALL' ? { available: item.availableStock } : getItemDeptStock(item, selectedDepartment));
        if (checkStock.available <= 0) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.nomenclature.toLowerCase().includes(q) ||
          item.assetTag.toLowerCase().includes(q) ||
          item.sku?.toLowerCase().includes(q) ||
          item.manufacturer?.toLowerCase().includes(q) ||
          item.coordinates?.toLowerCase().includes(q) ||
          item.subSpecs?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [inventory, selectedCategory, selectedDepartment, selectedClass, inStockOnly, searchQuery, isStudent, userDepartment]);

  const assetItems = useMemo(
    () => filteredItems.filter((i) => i.classification === 'Asset'),
    [filteredItems]
  );
  const consumableItems = useMemo(
    () => filteredItems.filter((i) => i.classification === 'Consumable'),
    [filteredItems]
  );

  const assetsCount = useMemo(
    () => inventory.filter((i) => i.classification === 'Asset').length,
    [inventory]
  );
  const consumablesCount = useMemo(
    () => inventory.filter((i) => i.classification === 'Consumable').length,
    [inventory]
  );

  const handleAddNewItem = async (e) => {
    e.preventDefault();
    const item = {
      ...newItemData,
      id: newItemData.assetTag,
      sku: newItemData.assetTag,
      stockStatus: 'Available',
      queueDepth: 0,
      custodyHolder: null,
      dateAcquired: new Date().toISOString().substring(0, 10),
      custodyHistory: [],
    };
    await addNewInventoryItem(item);
    setIsAddModalOpen(false);
  };

  // Table Columns with Component Thumbnail
  const tableColumns = [
    {
      header: 'Identifier',
      accessor: 'assetTag',
      width: '140px',
      render: (row) => (
        <div className="flex items-center gap-1.5 font-sans text-xs">
          <span className="font-semibold text-[#c9b8a0]">{row.assetTag}</span>
          <button
            onClick={(e) => handleCopyTag(row.assetTag, e)}
            className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-white transition-opacity"
            title="Copy SKU / Tag"
          >
            {copiedTag === row.assetTag ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>
      ),
    },
    {
      header: 'Component',
      accessor: 'nomenclature',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl overflow-hidden bg-white/[0.04] border border-white/10 flex-shrink-0 flex items-center justify-center p-1">
            <img
              src={row.image || '/images/hardware/raspberry-pi-5.jpg'}
              alt={row.nomenclature}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.src = '/images/hardware/raspberry-pi-5.jpg';
              }}
            />
          </div>
          <div className="space-y-0.5">
            <div className="font-semibold text-white text-xs flex items-center gap-2">
              <span>{row.nomenclature}</span>
              <span className="text-[10px] font-sans text-zinc-400 font-normal">
                {row.manufacturer}
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 font-sans line-clamp-1">
              {row.subSpecs}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Classification',
      accessor: 'classification',
      width: '120px',
      render: (row) => <StatusBadge status={row.classification} type="classification" size="xs" />,
    },
    {
      header: 'Coordinates',
      accessor: 'coordinates',
      width: '130px',
      render: (row) => (
        <div className="inline-flex items-center gap-1 font-sans text-[11px] px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-zinc-300">
          <MapPin className="w-3 h-3 text-[#a78b71]" />
          <span>{row.coordinates}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'stockStatus',
      width: '120px',
      render: (row) => <StatusBadge status={row.stockStatus} type="stock" size="xs" />,
    },
    {
      header: 'Available',
      accessor: 'availableStock',
      width: '120px',
      align: 'center',
      render: (row) => {
        const stock = isStudent
          ? getItemDeptStock(row, userDepartment)
          : (selectedDepartment === 'ALL' ? { available: row.availableStock } : getItemDeptStock(row, selectedDepartment));
        return (
          <div className="flex flex-col items-center">
            <span className={`font-sans text-xs font-semibold ${stock.available > 0 ? 'text-white' : 'text-zinc-500'}`}>
              {stock.available} {row.classification === 'Consumable' ? 'Units' : 'Unit'}
            </span>
            {isStudent && (
              <span className="text-[10px] text-zinc-400">
                in {userDepartment} Labs
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: 'Action',
      width: '160px',
      align: 'right',
      render: (row) => {
        const studentStock = getItemDeptStock(row, userDepartment);
        const canIssue = !isStudent || studentStock.available > 0;
        return (
          <div
            className="flex items-center justify-end gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setInspectedItem(row)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              title="Inspect Component"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            {canIssue ? (
              <button
                onClick={() => addToBasket(row, 1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-[#e8d5b7] text-black font-inter text-[11px] font-bold transition-all shadow-sm cursor-pointer"
              >
                <ShoppingBag className="w-3 h-3" />
                <span>Requisition</span>
              </button>
            ) : (
              <button
                disabled
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-zinc-500 font-inter text-[10px] font-semibold cursor-not-allowed"
                title={`Restricted: Only available in ${studentStock.depts.join(', ') || 'other'} Dept labs`}
              >
                <Lock className="w-3 h-3 text-amber-400/80" />
                <span>{studentStock.depts.length > 0 ? `${studentStock.depts.join('/')} Only` : 'Out of Stock'}</span>
              </button>
            )}
          </div>
        );
      },
    },
  ];

  const getCategoryStyle = (item) => {
    const cat = (item.category || item.classification || '').toLowerCase();
    const nom = (item.nomenclature || '').toLowerCase();

    // 1. Microprocessors: Deep Indigo / Sapphire
    if (cat.includes('microprocessor') || cat.includes('ai edge') || cat.includes('sbc') || nom.includes('jetson') || nom.includes('raspberry') || nom.includes('imac') || nom.includes('rtx')) {
      return {
        badgeBg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
        pedestalGlow: 'bg-indigo-500/25',
        borderHover: 'hover:border-indigo-500/40',
        cardBg: 'from-[#121422]/90 via-[#0e0f18]/85 to-[#08090f]/95',
        tag: 'Microprocessor',
      };
    }

    // 2. Microcontrollers: Electric Sky / Cyan
    if (cat.includes('microcontroller') || cat === 'mc' || nom.includes('arduino') || nom.includes('esp32') || nom.includes('pico') || nom.includes('plc')) {
      return {
        badgeBg: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
        pedestalGlow: 'bg-sky-500/25',
        borderHover: 'hover:border-sky-500/40',
        cardBg: 'from-[#0e1622]/90 via-[#0a111a]/85 to-[#08090f]/95',
        tag: 'Microcontroller',
      };
    }

    // 3. Sensors: Warm Amber / Sunset Bronze
    if (cat.includes('sensor') || nom.includes('camera') || nom.includes('lidar') || nom.includes('imu') || nom.includes('bmp') || nom.includes('dht')) {
      return {
        badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        pedestalGlow: 'bg-amber-500/25',
        borderHover: 'hover:border-amber-500/40',
        cardBg: 'from-[#1a160e]/90 via-[#14100a]/85 to-[#08090f]/95',
        tag: 'Sensor',
      };
    }

    // 4. Motors & Actuators: Radiant Violet / Magenta
    if (cat.includes('motor') || nom.includes('robot') || nom.includes('arm') || nom.includes('turtlebot') || nom.includes('servo') || nom.includes('stepper') || nom.includes('driver')) {
      return {
        badgeBg: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
        pedestalGlow: 'bg-violet-500/25',
        borderHover: 'hover:border-violet-500/40',
        cardBg: 'from-[#191022]/90 via-[#130b1c]/85 to-[#08090f]/95',
        tag: 'Motor & Actuator',
      };
    }

    // 5. Communication Modules: Radiant Teal / Cyan
    if (cat.includes('communication') || nom.includes('gps') || nom.includes('nrf') || nom.includes('transceiver')) {
      return {
        badgeBg: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
        pedestalGlow: 'bg-teal-500/25',
        borderHover: 'hover:border-teal-500/40',
        cardBg: 'from-[#0e1a19]/90 via-[#0a1413]/85 to-[#08090f]/95',
        tag: 'Communication Module',
      };
    }

    // 6. Batteries: Crimson / Rose Amber
    if (cat.includes('batter') || nom.includes('lipo') || nom.includes('18650') || nom.includes('cell')) {
      return {
        badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
        pedestalGlow: 'bg-rose-500/25',
        borderHover: 'hover:border-rose-500/40',
        cardBg: 'from-[#1f0e12]/90 via-[#170a0d]/85 to-[#08090f]/95',
        tag: 'Battery',
      };
    }

    // 7. Misc & Instrumentation: Mint Emerald
    return {
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      pedestalGlow: 'bg-emerald-500/25',
      borderHover: 'hover:border-emerald-500/40',
      cardBg: 'from-[#0e1a16]/90 via-[#0a1411]/85 to-[#08090f]/95',
      tag: item.category || 'Misc',
    };
  };

  const getSpecChips = (item) => {
    const nom = (item.nomenclature || '').toLowerCase();
    const specs = (item.subSpecs || '');
    if (nom.includes('raspberry pi 5')) return ['Quad ARM A76', '8GB LPDDR4X', 'Dual 4Kp60'];
    if (nom.includes('jetson nano')) return ['128-core Maxwell GPU', '4GB LPDDR4', '40-pin GPIO'];
    if (nom.includes('arduino uno')) return ['ATmega328P', '14 Digital I/O', 'USB Type-B'];
    if (nom.includes('esp32')) return ['Dual-Core 240MHz', 'Wi-Fi & BLE 4.2', '4MB Flash'];
    if (nom.includes('oscilloscope')) return ['50MHz Bandwidth', '4 Channels', '1GSa/s'];
    if (nom.includes('oled')) return ['0.96" Monochrome', '128x64 Pixels', 'I2C Interface'];
    if (nom.includes('bmp280')) return ['Barometric & Temp', 'I2C / SPI Bus', 'High Accuracy'];
    if (nom.includes('mpu') || nom.includes('imu')) return ['6-Axis Gyro & Accel', 'Digital Motion', 'I2C Fast'];
    if (nom.includes('jumper')) return ['120-Pin Ribbon', 'Male-to-Female', '20cm Length'];
    if (nom.includes('breadboard')) return ['830 Tie-Points', 'Dual Power Rails', 'Nickel Plated'];
    if (nom.includes('resistor')) return ['600pcs Assorted', '1/4W Metal Film', '1% Precision'];

    if (specs) {
      return specs.split(',').slice(0, 3).map((s) => s.trim()).filter(Boolean);
    }
    return ['Certified Laboratory Grade', 'Standard Kit'];
  };

  const renderHardwareWidget = (item) => {
    const style = getCategoryStyle(item);
    const specChips = getSpecChips(item);

    return (
      <div
        key={item.id}
        onClick={() => setInspectedItem(item)}
        className="group relative rounded-3xl border border-white/10 hover:border-[#c9b8a0]/50 transition-all duration-500 hover:shadow-[0_24px_60px_rgba(0,0,0,0.95)] flex flex-col justify-between cursor-pointer overflow-hidden min-h-[500px]"
      >
        {/* Full Image Box Background - Picture fills 100% of the box edge-to-edge */}
        <img
          src={item.image || '/images/hardware/raspberry-pi-5.jpg'}
          alt={item.nomenclature}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out z-0"
          onError={(e) => {
            e.target.src = '/images/hardware/raspberry-pi-5.jpg';
          }}
        />

        {/* Ambient Gradient Scrim for crisp text contrast over picture */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/65 to-black/30 pointer-events-none z-10" />

        {/* Specular hairline top rim */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none rounded-t-3xl z-20" />

        {/* Details Layered Directly On Top of the Picture */}
        <div className="relative z-20 p-6 flex flex-col justify-between h-full min-h-[500px]">
          {/* Top Bar: Category & Tag Header */}
          <div className="flex items-center justify-between text-xs">
            <span className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${style.badgeBg} backdrop-blur-md shadow-lg tracking-wide`}>
              {style.tag}
            </span>
            <span className="text-[11px] font-sans font-medium text-zinc-300 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 shadow-lg">
              {item.assetTag}
            </span>
          </div>

          {/* Bottom Area: Hardware Details Overlaid on Picture */}
          <div className="space-y-3 mt-auto pt-6">
            {/* Product Title & Subtitle */}
            <div className="space-y-1">
              <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-tight leading-snug group-hover:text-[#f5e6c8] transition-colors drop-shadow-md">
                {item.nomenclature}
              </h3>
              <p className="text-xs text-zinc-300 font-sans font-normal line-clamp-2 leading-relaxed drop-shadow-sm">
                {item.subSpecs}
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

            {/* Location & Depot Strip */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-zinc-200 font-sans font-medium text-[11px]">
                <MapPin className="w-3 h-3 text-[#c9b8a0] flex-shrink-0" />
                <span>{item.coordinates}</span>
              </div>
              <span className="text-zinc-400 text-xs font-sans drop-shadow-sm">{item.labRoom}</span>
            </div>

            {/* Card Footer Actions with Departmental Governance */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              {(() => {
                const studentStock = getItemDeptStock(item, userDepartment);
                const viewStock = getItemDeptStock(item, selectedDepartment);
                const canIssue = !isStudent || studentStock.available > 0;

                return (
                  <>
                    <div className="flex flex-col text-xs">
                      {isStudent ? (
                        <>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${studentStock.available > 0 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                            <span className="text-xs text-white font-semibold">
                              {studentStock.available > 0 ? `${studentStock.available} Available` : 'Unavailable in Dept'}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-400">
                            in {userDepartment} Labs {studentStock.available <= 0 && studentStock.depts.length > 0 ? `(${studentStock.depts.join(', ')})` : ''}
                          </span>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${viewStock.available > 0 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                          <span className="text-xs text-white font-semibold">
                            {viewStock.available > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                          <span className="text-zinc-500">•</span>
                          <span className="text-[11px] text-zinc-300">
                            {viewStock.available} of {viewStock.total} available
                          </span>
                        </div>
                      )}
                    </div>

                    {canIssue ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToBasket(item, 1);
                        }}
                        className="px-4 py-2 rounded-full bg-white hover:bg-zinc-200 text-black font-semibold text-xs tracking-tight transition-all shadow-lg active:scale-95 flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Requisition</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        onClick={(e) => e.stopPropagation()}
                        className="px-3.5 py-2 rounded-full bg-white/[0.06] border border-white/10 text-zinc-400 font-medium text-[11px] tracking-tight flex items-center gap-1.5 cursor-not-allowed opacity-80 flex-shrink-0"
                        title={`Restricted: Students are enrolled in ${userDepartment} and can only requisition hardware from ${userDepartment} labs. This item is housed in ${studentStock.depts.join(', ')}.`}
                      >
                        <Lock className="w-3 h-3 text-amber-400/80" />
                        <span>{studentStock.depts.length > 0 ? `${studentStock.depts.join('/')} Dept Only` : `${userDepartment} Unavailable`}</span>
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 select-none font-sans max-w-7xl mx-auto">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER & WORKSPACE CONTEXT                             */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#c9b8a0]">
              {selectedDepartment === 'ALL' ? 'Central Hardware Depot' : `${selectedDepartment} Department Depot`}
            </span>
            {isStudent && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-medium">
                Enrolled: {userDepartment} Dept
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-[-0.025em] text-white mt-1 font-display">
            Hardware Workstation
          </h1>
          <p className="text-[13px] text-zinc-400 mt-1.5 max-w-xl font-normal leading-relaxed">
            {isStudent
              ? `Browse hardware inventory. Note: SIT policy strictly restricts student issues exclusively to ${userDepartment} department labs.`
              : 'Browse laboratory computing modules, developer boards, and prototyping stock across all academic departments.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {permissions.canAddInventory && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-full border border-white/10 hover:border-white/20 bg-white/[0.04] text-white text-[13px] font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#c9b8a0]" />
              <span>Register Hardware</span>
            </button>
          )}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. APPLE SEGMENTED CONTROL & FILTER TOOLBAR                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Segmented Category Filter */}
        <div className="inline-flex p-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => handleSelectCategory('all')}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-white text-black font-semibold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Items ({assetsCount + consumablesCount})
          </button>

          <button
            type="button"
            onClick={() => handleSelectCategory('Asset')}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
              selectedCategory === 'Asset'
                ? 'bg-white text-black font-semibold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Assets ({assetsCount})
          </button>

          <button
            type="button"
            onClick={() => handleSelectCategory('Consumable')}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
              selectedCategory === 'Consumable'
                ? 'bg-white text-black font-semibold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Consumables ({consumablesCount})
          </button>
        </div>

        {/* Right: Search, Lab filter, View Switcher */}
        <div className="flex items-center gap-3">
          <div className="w-64">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search components or specs..."
            />
          </div>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-white/[0.04] border border-white/10 rounded-full px-3.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-[#c9b8a0] transition-all cursor-pointer font-sans"
            aria-label="Filter by Component Class"
          >
            <option value="ALL" className="bg-[#0a0a0a]">All Classes</option>
            <option value="Sensors" className="bg-[#0a0a0a]">Sensors</option>
            <option value="Microcontrollers" className="bg-[#0a0a0a]">Microcontrollers (MC)</option>
            <option value="Microprocessors" className="bg-[#0a0a0a]">Microprocessors</option>
            <option value="Motors" className="bg-[#0a0a0a]">Motors</option>
            <option value="Communication Modules" className="bg-[#0a0a0a]">Communication Modules</option>
            <option value="Batteries" className="bg-[#0a0a0a]">Batteries</option>
            <option value="Misc" className="bg-[#0a0a0a]">Misc</option>
          </select>

          {/* View Switcher */}
          <div className="flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Widget Cards Grid"
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
              title="Dense Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. HARDWARE COMPONENTS GRID (Single Unified Apple-Grade Grid) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {viewMode === 'grid' ? (
        filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(renderHardwareWidget)}
          </div>
        ) : (
          <div className="text-center py-20 text-zinc-400 text-sm bg-white/[0.02] border border-white/[0.08] rounded-3xl backdrop-blur-xl">
            <Boxes className="w-8 h-8 text-zinc-500 mx-auto mb-3" />
            <p className="font-medium text-white">No components found</p>
            <p className="text-xs text-zinc-500 mt-1">Try adjusting your category filter or search keywords.</p>
          </div>
        )
      ) : (
        <DataTable
          columns={tableColumns}
          data={filteredItems}
          onRowClick={(row) => setInspectedItem(row)}
          pageSize={10}
          emptyMessage="No hardware found in this category."
        />
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. COMPONENT QUICK SPECS MODAL (Centered Apple Dialog)        */}
      {/* ───────────────────────────────────────────────────────────── */}
      {inspectedItem && (
        <Modal
          isOpen={!!inspectedItem}
          onClose={() => setInspectedItem(null)}
          title={inspectedItem.nomenclature}
          subtitle={`${inspectedItem.manufacturer} • ${inspectedItem.assetTag}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4 text-xs font-sans text-white">
            {/* Component Picture Container */}
            <div className="w-full h-56 sm:h-64 rounded-2xl bg-black/50 border border-white/10 overflow-hidden relative flex items-center justify-center">
              <img
                src={inspectedItem.image || '/images/hardware/raspberry-pi-5.jpg'}
                alt={inspectedItem.nomenclature}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.target.src = '/images/hardware/raspberry-pi-5.jpg';
                }}
              />
            </div>

            {/* Storage Bay & Stock Status */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#c9b8a0]" />
                <span className="font-semibold text-white">{inspectedItem.coordinates}</span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400">{inspectedItem.labRoom}</span>
              </div>
              <span className="text-zinc-300 font-medium">
                {inspectedItem.availableStock} of {inspectedItem.totalStock} in stock
              </span>
            </div>

            {/* Technical Sub-Specifications */}
            <div className="space-y-1.5">
              <div className="font-medium text-zinc-300">Technical Specifications</div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-zinc-300 leading-relaxed font-sans">
                {inspectedItem.subSpecs}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              <div className="text-xs text-zinc-400">
                {isStudent && (
                  (() => {
                    const studentStock = getItemDeptStock(inspectedItem, userDepartment);
                    if (studentStock.available <= 0) {
                      return (
                        <span className="text-amber-400 flex items-center gap-1 font-medium">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Restricted: Not housed in {userDepartment} labs</span>
                        </span>
                      );
                    }
                    return (
                      <span className="text-emerald-400 font-medium">
                        ✓ {studentStock.available} available in {userDepartment} labs
                      </span>
                    );
                  })()
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInspectedItem(null)}
                  className="px-4 py-2 rounded-full border border-white/10 text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Close
                </button>
                {(!isStudent || getItemDeptStock(inspectedItem, userDepartment).available > 0) ? (
                  <button
                    type="button"
                    onClick={() => {
                      addToBasket(inspectedItem, 1);
                      setInspectedItem(null);
                    }}
                    className="py-2.5 px-5 rounded-full bg-white hover:bg-[#f5e6c8] text-black font-semibold text-xs tracking-wide transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Requisition Kit</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="py-2 px-4 rounded-full bg-white/[0.06] border border-white/10 text-zinc-500 font-semibold text-xs flex items-center gap-2 cursor-not-allowed opacity-75"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Cross-Dept Prohibited</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 6. REGISTER NEW HARDWARE MODAL                                */}
      {/* ───────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register Hardware to Inventory"
        subtitle="Catalog serialized assets or bulk consumable components into the institutional database."
      >
        <form onSubmit={handleAddNewItem} className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-sans uppercase font-medium text-[#8a8f98] mb-1">
                Asset Tag / SKU <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={newItemData.assetTag}
                onChange={(e) => setNewItemData({ ...newItemData, assetTag: e.target.value })}
                placeholder="e.g. AT-ESP-0205"
                className="w-full px-2.5 py-1.5 bg-[#0a0b0e] border border-white/[0.1] rounded font-sans text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-sans uppercase font-medium text-[#8a8f98] mb-1">
                Manufacturer / Brand
              </label>
              <input
                type="text"
                value={newItemData.manufacturer}
                onChange={(e) => setNewItemData({ ...newItemData, manufacturer: e.target.value })}
                placeholder="e.g. Espressif Systems"
                className="w-full px-2.5 py-1.5 bg-[#0a0b0e] border border-white/[0.1] rounded text-white text-xs font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-sans uppercase font-medium text-[#8a8f98] mb-1">
              Component Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={newItemData.nomenclature}
              onChange={(e) => setNewItemData({ ...newItemData, nomenclature: e.target.value })}
              placeholder="e.g. ESP32-WROOM-32D DevBoard"
              className="w-full px-2.5 py-1.5 bg-[#0a0b0e] border border-white/[0.1] rounded text-white text-xs font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-sans uppercase font-medium text-[#8a8f98] mb-1">
                Classification
              </label>
              <select
                value={newItemData.classification}
                onChange={(e) => setNewItemData({ ...newItemData, classification: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-[#0a0b0e] border border-white/[0.1] rounded text-white text-xs font-sans"
              >
                <option value="Asset">Asset (Serialized)</option>
                <option value="Consumable">Consumable (Bulk)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-sans uppercase font-medium text-[#8a8f98] mb-1">
                Laboratory Location
              </label>
              <select
                value={newItemData.labRoom}
                onChange={(e) => setNewItemData({ ...newItemData, labRoom: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-[#0a0b0e] border border-white/[0.1] rounded text-white text-xs font-sans"
              >
                <option value="Lab 1 - AI">Lab 1 - AI</option>
                <option value="Lab 2 - IoT">Lab 2 - IoT</option>
                <option value="Lab 3 - Embedded">Lab 3 - Embedded</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-sans uppercase font-medium text-[#8a8f98] mb-1">
                Storage Coordinates
              </label>
              <input
                type="text"
                value={newItemData.coordinates}
                onChange={(e) => setNewItemData({ ...newItemData, coordinates: e.target.value })}
                placeholder="e.g. L2-CB1-R1"
                className="w-full px-2.5 py-1.5 bg-[#0a0b0e] border border-white/[0.1] rounded font-sans text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-sans uppercase font-medium text-[#8a8f98] mb-1">
                Available Stock Count
              </label>
              <input
                type="number"
                min="1"
                value={newItemData.availableStock}
                onChange={(e) =>
                  setNewItemData({
                    ...newItemData,
                    availableStock: parseInt(e.target.value) || 1,
                    totalStock: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full px-2.5 py-1.5 bg-[#0a0b0e] border border-white/[0.1] rounded font-sans text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-sans uppercase font-medium text-[#8a8f98] mb-1">
              Technical Sub-Specifications
            </label>
            <textarea
              rows="3"
              value={newItemData.subSpecs}
              onChange={(e) => setNewItemData({ ...newItemData, subSpecs: e.target.value })}
              placeholder="Processor clock, interface bus, pin count, operating voltages..."
              className="w-full px-2.5 py-1.5 bg-[#0a0b0e] border border-white/[0.1] rounded text-white font-sans text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.1]">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-full border border-white/10 text-zinc-400 hover:text-white text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-white hover:bg-[#e8d5b7] text-black font-bold text-xs transition-colors cursor-pointer"
            >
              Catalog Hardware
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default InventoryListPage;
