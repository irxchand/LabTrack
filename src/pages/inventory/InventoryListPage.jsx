import React, { useState, useMemo } from 'react';
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
  Layers,
  Package,
  X,
  ExternalLink,
  Copy,
  Check,
  Building,
  Clock,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';

export function InventoryListPage({ initialClassification = null }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { inventory, addToBasket, joinWaitlist, addNewInventoryItem, setIsBasketOpen } = useLabData();
  const { role, permissions } = useAuth();

  const routeClassification = useMemo(() => {
    if (initialClassification) return initialClassification;
    if (location.pathname.includes('/assets')) return 'Asset';
    if (location.pathname.includes('/components')) return 'Component';
    if (location.pathname.includes('/consumables')) return 'Consumable';
    return 'All';
  }, [location.pathname, initialClassification]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(routeClassification);
  const [selectedLab, setSelectedLab] = useState('All Labs');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Slide-over preview inspector (Linear / Supabase style)
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
    notes: '',
  });

  const handleCopyTag = (tag, e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 1500);
  };

  // Filter logic
  const filteredItems = useMemo(() => {
    return inventory.filter((item) => {
      if (selectedCategory !== 'All' && item.classification !== selectedCategory) {
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

  const tableColumns = [
    {
      header: 'Identifier',
      accessor: 'assetTag',
      width: '150px',
      render: (row) => (
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="font-semibold text-[#c9b8a0] hover:underline cursor-pointer">
            {row.assetTag}
          </span>
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
      header: 'Hardware Nomenclature',
      accessor: 'nomenclature',
      render: (row) => (
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
      ),
    },
    {
      header: 'Class',
      accessor: 'classification',
      width: '120px',
      render: (row) => <StatusBadge status={row.classification} type="classification" size="xs" />,
    },
    {
      header: 'Bay Coordinates',
      accessor: 'coordinates',
      width: '140px',
      render: (row) => {
        const parts = row.coordinates.split('-');
        return (
          <div className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-zinc-300">
            <MapPin className="w-3 h-3 text-[#a78b71]" />
            <span>{parts.join(' › ')}</span>
          </div>
        );
      },
    },
    {
      header: 'Status',
      accessor: 'stockStatus',
      width: '130px',
      render: (row) => <StatusBadge status={row.stockStatus} type="stock" size="xs" />,
    },
    {
      header: 'Backlog',
      accessor: 'queueDepth',
      width: '100px',
      align: 'center',
      render: (row) => (
        <span className="font-mono text-xs text-[#8a8f98]">
          {row.queueDepth > 0 ? (
            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
              {row.queueDepth} Teams
            </span>
          ) : (
            '—'
          )}
        </span>
      ),
    },
    {
      header: 'Actions',
      width: '160px',
      align: 'right',
      render: (row) => (
        <div
          className="flex items-center justify-end gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setInspectedItem(row)}
            className="p-1 rounded-md text-[#8a8f98] hover:text-white hover:bg-white/[0.08] transition-colors"
            title="Inspect Hardware Panel"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {row.stockStatus === 'Available' ? (
            <button
              onClick={() => addToBasket(row, 1)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#a78b71] hover:bg-[#c9b8a0] text-black font-inter text-[11px] font-bold transition-all shadow-sm"
              title="Add to Requisition Basket"
            >
              <ShoppingBag className="w-3 h-3" />
              Requisition
            </button>
          ) : row.stockStatus === 'Allocated' ? (
            <button
              onClick={() => joinWaitlist(row)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-amber-400 border border-amber-500/30 font-inter text-[11px] transition-colors"
              title="Join FIFO waitlist queue"
            >
              <BookmarkPlus className="w-3 h-3" />
              Queue
            </button>
          ) : (
            <span className="text-[10px] font-mono text-zinc-500 px-2 py-1">Locked</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-playfair font-bold italic tracking-tight text-white flex items-center gap-3">
              <Boxes className="w-6 h-6 text-[#a78b71]" />
              Master Inventory Registry
            </h1>
            <span className="px-2.5 py-0.5 rounded-full glass-neural text-zinc-400 font-mono text-[11px]">
              {filteredItems.length} records
            </span>
          </div>
          <p className="text-xs font-inter text-zinc-400 mt-1">
            Single pane of glass for hardware discovery, coordinates, and stock verification across institutional labs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {permissions.canAddInventory && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-full glass-neural hover:border-[#a78b71]/50 text-white font-inter text-xs font-semibold flex items-center gap-1.5 transition-neural"
            >
              <Plus className="w-3.5 h-3.5 text-[#a78b71]" />
              Catalog Hardware
            </button>
          )}

          <button
            onClick={() => setIsBasketOpen(true)}
            className="px-5 py-2 rounded-full bg-white hover:bg-[#e8d5b7] text-black font-inter text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-neural shadow-md"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            New Requisition
          </button>
        </div>
      </div>

      {/* Modern Filter Surface */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center glass-neural p-3 rounded-2xl border border-white/10">
        {/* Search Input (5 cols) */}
        <div className="md:col-span-5">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search SKU, nomenclature, manufacturer, or coordinates (Press '/' to focus)..."
          />
        </div>

        {/* Category Pills (3 cols) */}
        <div className="md:col-span-3 flex items-center gap-1 overflow-x-auto text-xs font-mono">
          {[
            { label: 'All Items', val: 'All' },
            { label: 'Assets', val: 'Asset' },
            { label: 'Components', val: 'Component' },
            { label: 'Consumables', val: 'Consumable' },
          ].map((cat) => (
            <button
              key={cat.val}
              onClick={() => setSelectedCategory(cat.val)}
              className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap text-[11px] ${
                selectedCategory === cat.val
                  ? 'bg-white/[0.08] text-white font-semibold border border-white/[0.14] shadow-xs'
                  : 'text-[#8a8f98] hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Lab Room Dropdown (2 cols) */}
        <div className="md:col-span-2">
          <select
            value={selectedLab}
            onChange={(e) => setSelectedLab(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/10 rounded-full px-3.5 py-2 text-xs font-inter text-zinc-300 focus:outline-none focus:border-[#a78b71] transition-neural"
          >
            <option value="All Labs" className="bg-[#0a0a0a]">All Laboratories</option>
            <option value="Lab 1 - AI" className="bg-[#0a0a0a]">Lab 1 - AI</option>
            <option value="Lab 2 - IoT" className="bg-[#0a0a0a]">Lab 2 - IoT</option>
            <option value="Lab 3 - Embedded" className="bg-[#0a0a0a]">Lab 3 - Embedded</option>
          </select>
        </div>

        {/* In Stock & View Mode (2 cols) */}
        <div className="md:col-span-2 flex items-center justify-between sm:justify-end gap-3 text-xs font-inter">
          <label className="flex items-center gap-2 text-zinc-400 hover:text-white cursor-pointer select-none text-[11px]">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={() => setInStockOnly(!inStockOnly)}
              className="rounded border-white/20 bg-white/5 text-[#a78b71] focus:ring-0 accent-[#a78b71]"
            />
            In Stock
          </label>

          <div className="flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-full transition-neural ${
                viewMode === 'table' ? 'bg-[#a78b71] text-black' : 'text-zinc-500 hover:text-white'
              }`}
              title="Dense Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full transition-neural ${
                viewMode === 'grid' ? 'bg-[#a78b71] text-black' : 'text-zinc-500 hover:text-white'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main View: Table vs Grid */}
      {viewMode === 'table' ? (
        <DataTable
          columns={tableColumns}
          data={filteredItems}
          onRowClick={(row) => setInspectedItem(row)}
          pageSize={12}
          emptyMessage="No hardware matches query filters in institutional registry."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setInspectedItem(item)}
              className="glass-neural rounded-2xl p-5 cursor-pointer space-y-3 hover:border-[#a78b71]/50 transition-neural"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-xs font-bold text-[#c9b8a0]">{item.assetTag}</span>
                <StatusBadge status={item.stockStatus} type="stock" size="xs" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white line-clamp-1">{item.nomenclature}</h3>
                <p className="text-xs text-zinc-400 font-mono line-clamp-2 mt-1">{item.subSpecs}</p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-400">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <MapPin className="w-3 h-3 text-[#a78b71]" />
                  <span>{item.coordinates}</span>
                </div>
                <StatusBadge status={item.classification} type="classification" size="xs" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Linear-Style Slide-Over Detail Inspector */}
      {inspectedItem && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setInspectedItem(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-[#0a0a0a] border-l border-white/15 shadow-2xl flex flex-col">
              {/* Inspector Header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-[#c9b8a0] font-bold">{inspectedItem.assetTag}</span>
                  <span className="text-zinc-600">•</span>
                  <StatusBadge status={inspectedItem.stockStatus} type="stock" size="xs" />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/workspace/inventory/${inspectedItem.id}`)}
                    className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                    title="Open Full Dossier"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setInspectedItem(null)}
                    className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Inspector Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-playfair font-normal italic text-white">
                    {inspectedItem.nomenclature}
                  </h2>
                  <div className="text-xs font-mono text-zinc-400 mt-1">
                    {inspectedItem.manufacturer} • SKU: {inspectedItem.sku}
                  </div>
                </div>

                {/* Physical Coordinates Chip Card */}
                <div className="p-5 rounded-2xl glass-neural border border-white/10 space-y-2">
                  <div className="text-[10px] font-inter uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#a78b71]" />
                    Storage Coordinates & Facility Location
                  </div>
                  <div className="text-2xl font-mono font-bold text-[#c9b8a0]">
                    {inspectedItem.coordinates}
                  </div>
                  <div className="text-xs font-inter text-zinc-400">
                    {inspectedItem.labRoom} • Building 4 (Electronics & Computing)
                  </div>
                </div>

                {/* Technical Specs */}
                <div className="space-y-2">
                  <div className="text-[10px] font-inter uppercase tracking-wider text-zinc-400 font-semibold">
                    Technical Sub-Specifications
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 font-mono text-xs text-zinc-300 leading-relaxed">
                    {inspectedItem.subSpecs}
                  </div>
                </div>

                {/* Custody Status */}
                <div className="p-5 rounded-2xl glass-neural border border-white/10 space-y-3 text-xs font-inter">
                  <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Custody & Allocation Status
                  </div>

                  {inspectedItem.custodyHolder ? (
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Current Borrower:</span>
                        <span className="text-white font-semibold">{inspectedItem.custodyHolder.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">PRN:</span>
                        <span className="text-[#c9b8a0]">{inspectedItem.custodyHolder.prn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Due Date:</span>
                        <span className="text-amber-400 font-bold">{inspectedItem.custodyHolder.dueDate}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-emerald-400 text-xs">
                      Resting in assigned tray coordinates. Available for immediate checkout.
                    </div>
                  )}
                </div>
              </div>

              {/* Inspector Footer Actions */}
              <div className="p-5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between gap-3">
                <button
                  onClick={() => navigate(`/workspace/inventory/${inspectedItem.id}`)}
                  className="px-4 py-2.5 rounded-full border border-white/10 text-xs text-zinc-300 hover:text-white transition-neural flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Full Dossier
                </button>

                {inspectedItem.stockStatus === 'Available' ? (
                  <button
                    onClick={() => {
                      addToBasket(inspectedItem, 1);
                      setInspectedItem(null);
                    }}
                    className="flex-1 py-2.5 rounded-full bg-white hover:bg-[#e8d5b7] text-black font-inter text-xs font-bold uppercase tracking-wider transition-neural flex items-center justify-center gap-2 shadow-md"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Requisition Item
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      joinWaitlist(inspectedItem);
                      setInspectedItem(null);
                    }}
                    className="flex-1 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-amber-400 border border-amber-500/30 font-inter text-xs font-semibold flex items-center justify-center gap-1.5 transition-neural"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    Join FIFO Waitlist
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Catalog New Hardware Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Hardware to Institutional Inventory"
        subtitle="Registers physical or serialized stock into relational database with storage coordinates."
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
              Hardware Nomenclature (Full Name) <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={newItemData.nomenclature}
              onChange={(e) => setNewItemData({ ...newItemData, nomenclature: e.target.value })}
              placeholder="e.g. ESP32-S3-DevKitC-1 N8R8"
              className="w-full px-2.5 py-1.5 bg-[#0a0b0e] border border-white/[0.1] rounded text-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-[#8a8f98] mb-1">
              Technical Sub-Specifications & Pinout Details
            </label>
            <textarea
              rows={2}
              value={newItemData.subSpecs}
              onChange={(e) => setNewItemData({ ...newItemData, subSpecs: e.target.value })}
              placeholder="e.g. Xtensa 32-bit LX7 dual-core @ 240MHz, 8MB Flash, 8MB PSRAM, USB-OTG"
              className="w-full px-2.5 py-1.5 bg-[#0a0b0e] border border-white/[0.1] rounded text-white font-mono text-xs"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#8a8f98] mb-1">
                Classification
              </label>
              <select
                value={newItemData.classification}
                onChange={(e) => setNewItemData({ ...newItemData, classification: e.target.value })}
                className="w-full bg-[#0a0b0e] border border-white/[0.1] rounded px-2 py-1.5 text-white"
              >
                <option value="Asset">Serialized Asset</option>
                <option value="Component">Bulk Component</option>
                <option value="Consumable">Consumable</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-[#8a8f98] mb-1">
                Laboratory Room
              </label>
              <select
                value={newItemData.labRoom}
                onChange={(e) => setNewItemData({ ...newItemData, labRoom: e.target.value })}
                className="w-full bg-[#0a0b0e] border border-white/[0.1] rounded px-2 py-1.5 text-white"
              >
                <option value="Lab 1 - AI">Lab 1 - AI</option>
                <option value="Lab 2 - IoT">Lab 2 - IoT</option>
                <option value="Lab 3 - Embedded">Lab 3 - Embedded</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-[#8a8f98] mb-1">
                Coordinates (Room-Cab-Row)
              </label>
              <input
                type="text"
                value={newItemData.coordinates}
                onChange={(e) => setNewItemData({ ...newItemData, coordinates: e.target.value })}
                placeholder="L2-CB3-R2"
                className="w-full px-2.5 py-1.5 bg-[#0a0b0e] border border-white/[0.1] rounded font-mono text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-full border border-white/10 text-xs text-zinc-400 hover:text-white transition-neural"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-white hover:bg-[#e8d5b7] text-black font-inter text-xs font-bold uppercase tracking-wider transition-neural shadow-md"
            >
              Commit to Registry
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
