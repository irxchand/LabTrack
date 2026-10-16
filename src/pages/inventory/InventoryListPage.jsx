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
} from 'lucide-react';

export function InventoryListPage({ initialClassification = null }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { inventory, addToBasket, joinWaitlist, addNewInventoryItem, setIsBasketOpen } = useLabData();
  const { role, permissions } = useAuth();

  // Determine initial category from props or route
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
  const [selectedLab, setSelectedLab] = useState('All Labs');
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

  // Modal for adding new inventory item
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemData, setNewItemData] = useState({
    assetTag: '',
    nomenclature: '',
    subSpecs: '',
    manufacturer: '',
    classification: 'Asset',
    category: 'Microcontrollers & SBCs',
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

  // Filtered items (all 10 hardware items)
  const filteredItems = useMemo(() => {
    return inventory.filter((item) => {
      if (selectedCategory && selectedCategory !== 'all' && item.classification !== selectedCategory) {
        return false;
      }
      if (selectedLab !== 'All Labs' && item.labRoom !== selectedLab) {
        return false;
      }
      if (inStockOnly && item.stockStatus !== 'Available') {
        return false;
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
  }, [inventory, selectedCategory, selectedLab, inStockOnly, searchQuery]);

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
        <div className="flex items-center gap-1.5 font-mono text-xs">
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
              <span className="text-[10px] font-mono text-zinc-500 font-normal">
                {row.manufacturer}
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono line-clamp-1">
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
        <div className="inline-flex items-center gap-1 font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-zinc-300">
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
      width: '100px',
      align: 'center',
      render: (row) => (
        <span className="font-mono text-xs text-white font-semibold">
          {row.availableStock} {row.classification === 'Consumable' ? 'Units' : 'Unit'}
        </span>
      ),
    },
    {
      header: 'Action',
      width: '140px',
      align: 'right',
      render: (row) => (
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
          <button
            onClick={() => addToBasket(row, 1)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-[#e8d5b7] text-black font-inter text-[11px] font-bold transition-all shadow-sm cursor-pointer"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>Requisition</span>
          </button>
        </div>
      ),
    },
  ];

  const getCategoryStyle = (item) => {
    const cat = (item.category || item.classification || '').toLowerCase();
    const nom = (item.nomenclature || '').toLowerCase();

    // 1. SBC & AI Edge: Deep Indigo / Electric Sapphire
    if (cat.includes('ai edge') || cat.includes('sbc') || nom.includes('jetson') || nom.includes('raspberry')) {
      return {
        badgeBg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
        pedestalGlow: 'bg-indigo-500/25',
        borderHover: 'hover:border-indigo-500/40',
        cardBg: 'from-[#121422]/90 via-[#0e0f18]/85 to-[#08090f]/95',
        tag: 'AI Compute & Edge',
      };
    }

    // 2. Microcontrollers: Electric Sky / Cyan
    if (cat.includes('microcontroller') || nom.includes('arduino') || nom.includes('esp32')) {
      return {
        badgeBg: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
        pedestalGlow: 'bg-sky-500/25',
        borderHover: 'hover:border-sky-500/40',
        cardBg: 'from-[#0e1622]/90 via-[#0a111a]/85 to-[#08090f]/95',
        tag: 'Microcontroller',
      };
    }

    // 3. Sensors & Modules: Warm Amber / Sunset Bronze
    if (cat.includes('sensor') || nom.includes('sensor') || nom.includes('imu') || nom.includes('oled') || nom.includes('bmp')) {
      return {
        badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        pedestalGlow: 'bg-amber-500/25',
        borderHover: 'hover:border-amber-500/40',
        cardBg: 'from-[#1a160e]/90 via-[#14100a]/85 to-[#08090f]/95',
        tag: 'Sensor & Module',
      };
    }

    // 4. Test Equipment / Oscilloscope: Radiant Purple / Violet
    if (cat.includes('instrument') || nom.includes('oscilloscope') || nom.includes('analyzer')) {
      return {
        badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
        pedestalGlow: 'bg-purple-500/25',
        borderHover: 'hover:border-purple-500/40',
        cardBg: 'from-[#191022]/90 via-[#130b1c]/85 to-[#08090f]/95',
        tag: 'Test Instrument',
      };
    }

    // 5. Consumables / Prototyping: Mint Emerald
    return {
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      pedestalGlow: 'bg-emerald-500/25',
      borderHover: 'hover:border-emerald-500/40',
      cardBg: 'from-[#0e1a16]/90 via-[#0a1411]/85 to-[#08090f]/95',
      tag: item.category || 'Consumable & Dev',
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
    if (nom.includes('mpu-6050')) return ['6-Axis Gyro & Accel', 'Digital Motion', 'I2C Fast'];
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
        className={`group relative rounded-3xl bg-gradient-to-b ${style.cardBg} border border-white/10 ${style.borderHover} p-7 transition-all duration-300 hover:shadow-[0_24px_60px_rgba(0,0,0,0.85)] flex flex-col justify-between cursor-pointer backdrop-blur-2xl overflow-hidden`}
      >
        {/* Specular hairline top rim */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none rounded-t-3xl" />

        <div>
          {/* Category & Tag Header */}
          <div className="flex items-center justify-between text-xs mb-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${style.badgeBg} shadow-sm tracking-wide`}>
              {style.tag}
            </span>
            <span className="text-[11px] font-mono font-medium text-zinc-400 bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-white/10">
              {item.assetTag}
            </span>
          </div>

          {/* Product Hero Image (Clean Showroom Floating Stage with Colored Ambient Glow) */}
          <div className="relative w-full h-52 sm:h-56 flex items-center justify-center my-3 overflow-hidden">
            {/* Showroom Ambient Light Pedestal Glow under hardware */}
            <div className={`absolute bottom-3 w-40 h-10 rounded-full ${style.pedestalGlow} blur-2xl pointer-events-none transition-all duration-500 group-hover:scale-125 opacity-70`} />

            <img
              src={item.image || '/images/hardware/raspberry-pi-5.jpg'}
              alt={item.nomenclature}
              className="max-h-full max-w-full object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.95)] group-hover:scale-[1.04] transition-transform duration-500 ease-out z-10"
              onError={(e) => {
                e.target.src = '/images/hardware/raspberry-pi-5.jpg';
              }}
            />
          </div>

          {/* Product Title & Subtitle */}
          <div className="space-y-1.5 mt-2">
            <h3 className="text-[17px] font-semibold text-white tracking-[-0.015em] leading-snug group-hover:text-white transition-colors">
              {item.nomenclature}
            </h3>
            <p className="text-[13px] text-zinc-400 font-normal line-clamp-2 leading-relaxed">
              {item.subSpecs}
            </p>
          </div>

          {/* Technical Spec Chips (Dense, Professional Engineering Highlights) */}
          <div className="flex flex-wrap gap-1.5 pt-3">
            {specChips.map((chip, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-md bg-white/[0.04] border border-white/5 text-[11px] text-zinc-300 font-sans font-medium"
              >
                {chip}
              </span>
            ))}
          </div>

          {/* Location & Depot Strip */}
          <div className="mt-3.5 flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 text-zinc-300 font-mono font-medium text-[11px]">
              <MapPin className="w-3 h-3 text-[#c9b8a0] flex-shrink-0" />
              <span>{item.coordinates}</span>
            </div>
            <span className="text-zinc-500 text-[12px]">{item.labRoom}</span>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] flex-shrink-0" />
              <span className="text-[12px] text-white font-medium">
                In Stock
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-[11px] text-zinc-400 font-normal">
                {item.availableStock} of {item.totalStock} available
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              addToBasket(item, 1);
            }}
            className="px-4 py-2 rounded-full bg-white hover:bg-zinc-200 text-black font-semibold text-[13px] tracking-tight transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Requisition</span>
          </button>
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
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#c9b8a0]">
            AIML Hardware Depot
          </span>
          <h1 className="text-3xl font-bold tracking-[-0.025em] text-white mt-1 font-display">
            Hardware Workstation
          </h1>
          <p className="text-[13px] text-zinc-400 mt-1.5 max-w-xl font-normal leading-relaxed">
            Browse laboratory computing modules, developer boards, and prototyping stock. Stage components directly into your requisition kit.
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
            value={selectedLab}
            onChange={(e) => setSelectedLab(e.target.value)}
            className="bg-white/[0.04] border border-white/10 rounded-full px-3.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-[#c9b8a0] transition-all cursor-pointer"
          >
            <option value="All Labs" className="bg-[#0a0a0a]">All Labs</option>
            <option value="Lab 1 - AI" className="bg-[#0a0a0a]">Lab 1 - AI</option>
            <option value="Lab 2 - IoT" className="bg-[#0a0a0a]">Lab 2 - IoT</option>
            <option value="Lab 3 - Embedded" className="bg-[#0a0a0a]">Lab 3 - Embedded</option>
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
            <div className="w-full h-48 rounded-2xl bg-black/50 border border-white/10 p-3 flex items-center justify-center overflow-hidden">
              <img
                src={inspectedItem.image || '/images/hardware/raspberry-pi-5.jpg'}
                alt={inspectedItem.nomenclature}
                className="h-full object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
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
            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setInspectedItem(null)}
                className="px-4 py-2.5 rounded-full border border-white/10 text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Close
              </button>
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
              <label className="block text-[10px] font-mono uppercase text-[#8a8f98] mb-1">
                Asset Tag / SKU <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={newItemData.assetTag}
                onChange={(e) => setNewItemData({ ...newItemData, assetTag: e.target.value })}
                placeholder="e.g. AT-ESP-0205"
                className="w-full px-2.5 py-1.5 bg-[#0a0b0e] border border-white/[0.1] rounded font-mono text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-[#8a8f98] mb-1">
                Manufacturer / Brand
              </label>
              <input
                type="text"
                value={newItemData.manufacturer}
                onChange={(e) => setNewItemData({ ...newItemData, manufacturer: e.target.value })}
                placeholder="e.g. Espressif Systems"
                className="w-full px-2.5 py-1.5 bg-[#0a0b0e] border border-white/[0.1] rounded text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-[#8a8f98] mb-1">
              Component Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={newItemData.nomenclature}
              onChange={(e) => setNewItemData({ ...newItemData, nomenclature: e.target.value })}
              placeholder="e.g. ESP32-WROOM-32D DevBoard"
              className="w-full px-2.5 py-1.5 bg-[#0a0b0e] border border-white/[0.1] rounded text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#8a8f98] mb-1">
                Classification
              </label>
              <select
                value={newItemData.classification}
                onChange={(e) => setNewItemData({ ...newItemData, classification: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-[#0a0b0e] border border-white/[0.1] rounded text-white"
              >
                <option value="Asset">Asset (Serialized)</option>
                <option value="Consumable">Consumable (Bulk)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-[#8a8f98] mb-1">
                Laboratory Location
              </label>
              <select
                value={newItemData.labRoom}
                onChange={(e) => setNewItemData({ ...newItemData, labRoom: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-[#0a0b0e] border border-white/[0.1] rounded text-white"
              >
                <option value="Lab 1 - AI">Lab 1 - AI</option>
                <option value="Lab 2 - IoT">Lab 2 - IoT</option>
                <option value="Lab 3 - Embedded">Lab 3 - Embedded</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#8a8f98] mb-1">
                Storage Coordinates
              </label>
              <input
                type="text"
                value={newItemData.coordinates}
                onChange={(e) => setNewItemData({ ...newItemData, coordinates: e.target.value })}
                placeholder="e.g. L2-CB1-R1"
                className="w-full px-2.5 py-1.5 bg-[#0a0b0e] border border-white/[0.1] rounded font-mono text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-[#8a8f98] mb-1">
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
                className="w-full px-2.5 py-1.5 bg-[#0a0b0e] border border-white/[0.1] rounded font-mono text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-[#8a8f98] mb-1">
              Technical Sub-Specifications
            </label>
            <textarea
              rows="3"
              value={newItemData.subSpecs}
              onChange={(e) => setNewItemData({ ...newItemData, subSpecs: e.target.value })}
              placeholder="Processor clock, interface bus, pin count, operating voltages..."
              className="w-full px-2.5 py-1.5 bg-[#0a0b0e] border border-white/[0.1] rounded text-white font-mono text-[11px]"
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
