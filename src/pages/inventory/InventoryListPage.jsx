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
  const routeClassification = useMemo(() => {
    if (initialClassification) return initialClassification;
    if (location.pathname.includes('/assets')) return 'Asset';
    if (location.pathname.includes('/consumables') || location.pathname.includes('/components')) {
      return 'Consumable';
    }
    return null; // Null triggers the two-option chooser gateway
  }, [location.pathname, initialClassification]);

  const [selectedCategory, setSelectedCategory] = useState(routeClassification);
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

  // Filtered items (strictly respecting 5 items per category)
  const filteredItems = useMemo(() => {
    return inventory.filter((item) => {
      if (selectedCategory && item.classification !== selectedCategory) {
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

  return (
    <div className="space-y-6 select-none font-sans max-w-7xl mx-auto">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER & CATEGORY SWITCHER                             */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>Hardware Workspace</span>
            </h1>
            {selectedCategory && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#a78b71]/20 border border-[#a78b71]/40 text-[#f5e6c8] text-xs font-mono font-medium">
                {selectedCategory === 'Asset' ? 'Assets Depot' : 'Consumables Depot'}
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 mt-1 font-normal">
            Choose a section to view catalog inventory, check lab bench coordinates, or initiate requisitions.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {permissions.canAddInventory && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-full glass-neural hover:border-[#a78b71]/50 text-white font-inter text-xs font-semibold flex items-center gap-1.5 transition-neural cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#a78b71]" />
              <span>Register Hardware</span>
            </button>
          )}

          <button
            onClick={() => setIsBasketOpen(true)}
            className="px-5 py-2 rounded-full bg-white hover:bg-[#e8d5b7] text-black font-inter text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Requisitions</span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. SECTION CHOOSER PORTAL (When no category is picked)        */}
      {/* ───────────────────────────────────────────────────────────── */}
      {!selectedCategory ? (
        <div className="space-y-6 pt-2">
          <div className="text-center max-w-lg mx-auto mb-8">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#c9b8a0]">
              Hardware Directory
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              Select Workspace Section
            </h2>
            <p className="text-xs text-zinc-400 mt-2">
              Choose between serialized durable assets or modular consumable prototyping stock.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* OPTION 1: ASSETS */}
            <div
              onClick={() => handleSelectCategory('Asset')}
              className="group relative rounded-3xl p-8 bg-white/[0.02] hover:bg-white/[0.04] border border-white/15 hover:border-[#c9b8a0]/60 transition-all duration-300 cursor-pointer shadow-[0_20px_60px_rgba(0,0,0,0.7)] flex flex-col justify-between overflow-hidden"
            >
              {/* Top ambient highlight */}
              <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-[#c9b8a0]/15 blur-[70px] pointer-events-none group-hover:bg-[#c9b8a0]/25 transition-all" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs font-mono text-[#f5e6c8] flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#c9b8a0]" />
                    <span>{assetsCount} Serialized Units</span>
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-[#f5e6c8] transition-colors">
                  Assets
                </h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  High-value capital computing boards, AI accelerators, microcontrollers, and laboratory digital storage oscilloscopes.
                </p>

                {/* Visual Preview Grid */}
                <div className="grid grid-cols-3 gap-3 my-6">
                  {[
                    { name: 'Raspberry Pi 5', img: '/images/hardware/raspberry-pi-5.jpg' },
                    { name: 'Jetson Nano', img: '/images/hardware/jetson-nano.jpg' },
                    { name: 'Oscilloscope', img: '/images/hardware/oscilloscope.jpg' },
                  ].map((p) => (
                    <div
                      key={p.name}
                      className="aspect-square rounded-2xl bg-black/40 border border-white/10 p-2 flex flex-col items-center justify-center text-center overflow-hidden"
                    >
                      <img
                        src={p.img}
                        alt={p.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = '/images/hardware/raspberry-pi-5.jpg';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-mono text-[11px]">
                  Includes: Raspberry Pi 5, Arduino, Jetson Nano, ESP32, Scope
                </span>
                <span className="font-semibold text-[#f5e6c8] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Browse Assets →
                </span>
              </div>
            </div>

            {/* OPTION 2: CONSUMABLES */}
            <div
              onClick={() => handleSelectCategory('Consumable')}
              className="group relative rounded-3xl p-8 bg-white/[0.02] hover:bg-white/[0.04] border border-white/15 hover:border-[#c9b8a0]/60 transition-all duration-300 cursor-pointer shadow-[0_20px_60px_rgba(0,0,0,0.7)] flex flex-col justify-between overflow-hidden"
            >
              {/* Top ambient highlight */}
              <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-[#c9b8a0]/15 blur-[70px] pointer-events-none group-hover:bg-[#c9b8a0]/25 transition-all" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs font-sans text-[#f5e6c8] flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-[#c9b8a0]" />
                    <span>{consumablesCount} Component Lines</span>
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-[#f5e6c8] transition-colors">
                  Consumables
                </h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Modular sensor breakouts, I2C OLED displays, solderless breadboards, DuPont jumper ribbon cables, and passive metal film resistors.
                </p>

                {/* Visual Preview Grid */}
                <div className="grid grid-cols-3 gap-3 my-6">
                  {[
                    { name: 'OLED Display', img: '/images/hardware/oled-display.jpg' },
                    { name: 'BMP280 Sensor', img: '/images/hardware/bmp280-sensor.jpg' },
                    { name: '830 Breadboard', img: '/images/hardware/breadboard-830.jpg' },
                  ].map((p) => (
                    <div
                      key={p.name}
                      className="aspect-square rounded-2xl bg-black/40 border border-white/10 p-2 flex flex-col items-center justify-center text-center overflow-hidden"
                    >
                      <img
                        src={p.img}
                        alt={p.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = '/images/hardware/oled-display.jpg';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-sans text-xs">
                  OLED Displays, BMP280, Breadboards, Cables, Resistors
                </span>
                <span className="font-semibold text-[#f5e6c8] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Browse Consumables →
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ───────────────────────────────────────────────────────────── */
        /* 3. SECTION CATALOG VIEW (Assets or Consumables with Widgets)   */
        /* ───────────────────────────────────────────────────────────── */
        <div className="space-y-6">
          {/* Apple View Header & Filter Surface */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 glass-neural p-3.5 rounded-2xl border border-white/10">
            {/* Left: Return to Sections & Category Title */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSelectCategory(null)}
                className="px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-xs text-zinc-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer group"
                title="Return to Section Selection"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>All Sections</span>
              </button>

              <div className="h-4 w-px bg-white/10" />

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white tracking-tight">
                  {selectedCategory === 'Asset' ? 'Serialized Assets' : 'Consumables & Components'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-xs font-mono text-zinc-400 border border-white/5">
                  {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>

            {/* Right: Search, Lab filter, View Switcher */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-64">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Filter by name or SKU..."
                />
              </div>

              <select
                value={selectedLab}
                onChange={(e) => setSelectedLab(e.target.value)}
                className="bg-white/[0.04] border border-white/10 rounded-full px-3.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-[#a78b71] transition-all cursor-pointer"
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
                      ? 'bg-[#a78b71] text-black font-bold'
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
                      ? 'bg-[#a78b71] text-black font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Dense Table View"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────── */}
          {/* 4. COMPONENT WIDGET GRID (Each widget has picture & name)  */}
          {/* ───────────────────────────────────────────────────────── */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setInspectedItem(item)}
                  className="group relative rounded-3xl bg-white/[0.025] hover:bg-white/[0.05] border border-white/10 hover:border-[#c9b8a0]/60 p-4 transition-all duration-300 hover:shadow-[0_20px_45px_rgba(0,0,0,0.7)] flex flex-col justify-between cursor-pointer backdrop-blur-xl"
                >
                  <div>
                    {/* Component Picture Container */}
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-b from-[#18181b] to-[#0c0c0e] border border-white/10 mb-4 flex items-center justify-center p-3">
                      <img
                        src={item.image || '/images/hardware/raspberry-pi-5.jpg'}
                        alt={item.nomenclature}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                        onError={(e) => {
                          e.target.src = '/images/hardware/raspberry-pi-5.jpg';
                        }}
                      />

                      {/* Stock Status Badge Floating */}
                      <div className="absolute top-2.5 left-2.5">
                        <StatusBadge status={item.stockStatus} type="stock" size="xs" />
                      </div>

                      {/* Tag Chip Floating */}
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#c9b8a0]">
                        {item.assetTag}
                      </div>
                    </div>

                    {/* Component Name */}
                    <div>
                      <h3 className="text-sm font-semibold text-white tracking-tight group-hover:text-[#f5e6c8] transition-colors line-clamp-1">
                        {item.nomenclature}
                      </h3>
                      <p className="text-xs text-zinc-400 font-mono line-clamp-2 mt-1 leading-relaxed">
                        {item.subSpecs}
                      </p>
                    </div>

                    {/* Physical Location Coordinates */}
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-mono text-zinc-300 bg-white/[0.03] px-2.5 py-1 rounded-xl border border-white/5 w-fit">
                      <MapPin className="w-3.5 h-3.5 text-[#a78b71] flex-shrink-0" />
                      <span className="text-[#c9b8a0] font-semibold">{item.coordinates}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-[11px] text-zinc-400 truncate">{item.labRoom}</span>
                    </div>
                  </div>

                  {/* Requisition Button */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToBasket(item, 1);
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-[#e8d5b7] text-black font-inter text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Requisition</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectedItem(item);
                      }}
                      className="p-2 rounded-xl border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      title="Inspect Specs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <DataTable
              columns={tableColumns}
              data={filteredItems}
              onRowClick={(row) => setInspectedItem(row)}
              pageSize={10}
              emptyMessage="No hardware found in this category."
            />
          )}
        </div>
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
