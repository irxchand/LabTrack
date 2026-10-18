import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLabData } from '../../context/LabDataContext';
import {
  Search,
  Cpu,
  ArrowRight,
  Plus,
  MapPin,
  Sparkles,
} from 'lucide-react';

export function CommandPalette({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { inventory, addToBasket } = useLabData();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Reliable hardware image resolution
  const getItemImage = (item) => {
    if (item?.image) return item.image;
    const nom = (item?.nomenclature || '').toLowerCase();
    if (nom.includes('oled') || nom.includes('display')) return '/images/hardware/oled-display.jpg';
    if (nom.includes('jetson') || nom.includes('orin') || nom.includes('nano')) return '/images/hardware/jetson-nano.jpg';
    if (nom.includes('arduino') || nom.includes('uno')) return '/images/hardware/arduino-uno-r3.jpg';
    if (nom.includes('esp32') || nom.includes('micro') || nom.includes('mcu')) return '/images/hardware/esp32-wroom.jpg';
    if (nom.includes('oscilloscope') || nom.includes('rigol')) return '/images/hardware/oscilloscope.jpg';
    if (nom.includes('jumper') || nom.includes('wire') || nom.includes('ribbon')) return '/images/hardware/jumper-wires.jpg';
    if (nom.includes('breadboard')) return '/images/hardware/breadboard-830.jpg';
    if (nom.includes('mpu') || nom.includes('imu') || nom.includes('gyro') || nom.includes('accelerometer')) return '/images/hardware/mpu6050-sensor.jpg';
    if (nom.includes('sensor') || nom.includes('bmp')) return '/images/hardware/bmp280-sensor.jpg';
    if (nom.includes('resistor')) return '/images/hardware/resistors-pack.jpg';
    return '/images/hardware/raspberry-pi-5.jpg';
  };

  // Pure hardware catalog search (Zero route-dumping, zero role switching)
  const filteredItems = query.trim()
    ? inventory.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.nomenclature?.toLowerCase().includes(q) ||
          item.assetTag?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q) ||
          item.classification?.toLowerCase().includes(q) ||
          item.coordinates?.toLowerCase().includes(q) ||
          item.manufacturer?.toLowerCase().includes(q) ||
          item.subSpecs?.toLowerCase().includes(q)
        );
      })
    : inventory.slice(0, 8); // Top featured depot items when empty

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          navigate(`/workspace/inventory/${filteredItems[selectedIndex].id}`);
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredItems, onClose, navigate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Spotlight Window */}
      <div className="relative w-full max-w-2xl bg-[#0c0d11] border border-white/15 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden z-10 flex flex-col max-h-[620px]">
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-white/10 bg-white/[0.02]">
          <Search className="w-5 h-5 text-[#c9b8a0] mr-3.5 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search chips, sensors, dev boards, bin coordinates, or asset tags..."
            className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none font-sans"
          />
          <div className="flex items-center gap-1.5 ml-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-zinc-400">ESC</span>
          </div>
        </div>

        {/* Section Header */}
        <div className="px-5 py-2.5 bg-white/[0.015] border-b border-white/5 flex items-center justify-between text-[11px] font-sans text-zinc-400">
          <span>{query.trim() ? `Search Results (${filteredItems.length})` : 'Featured Hardware Inventory'}</span>
          <span className="text-[#c9b8a0] font-medium">AIML Hardware Depot</span>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2.5 divide-y divide-white/[0.04] space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-14 text-center text-xs font-sans text-zinc-400 space-y-1">
              <p className="text-white font-semibold">No hardware found matching "{query}"</p>
              <p className="text-zinc-500">Try searching by chip model (e.g. ESP32), sensor (e.g. BMP280), or asset tag.</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const inStock = (item.availableStock ?? 1) > 0;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    navigate(`/workspace/inventory/${item.id}`);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#c9b8a0]/15 text-white border border-[#c9b8a0]/30 shadow-md'
                      : 'text-zinc-300 hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  {/* Left: Thumbnail & Nomenclature */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/60 border border-white/10 flex-shrink-0 relative shadow-sm">
                      <img
                        src={getItemImage(item)}
                        alt={item.nomenclature}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          e.target.src = '/images/hardware/raspberry-pi-5.jpg';
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate font-sans group-hover:text-[#f5e6c8]">
                          {item.nomenclature}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-medium bg-black/60 border border-white/10 text-[#c9b8a0] flex-shrink-0">
                          {item.assetTag}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-sans text-zinc-400 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#c9b8a0]" />
                          <span>{item.coordinates}</span>
                        </span>
                        <span>•</span>
                        <span className={inStock ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                          {inStock
                            ? `${item.availableStock || 1} of ${item.totalStock || 1} available`
                            : 'All Units Loaned (Join Waitlist)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Quick CTA & Category */}
                  <div className="flex items-center gap-2.5 flex-shrink-0 ml-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-sans font-medium uppercase tracking-wider bg-white/[0.04] border border-white/5 text-zinc-400 hidden sm:inline">
                      {item.classification || item.category}
                    </span>

                    {inStock && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToBasket(item, 1);
                        }}
                        className="px-3 py-1.5 rounded-full bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-all shadow-sm active:scale-95 flex items-center gap-1 cursor-pointer"
                        title="Add to Requisition Basket"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Requisition</span>
                      </button>
                    )}

                    {isSelected && (
                      <ArrowRight className="w-4 h-4 text-[#c9b8a0]" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="px-5 py-3 border-t border-white/10 bg-white/[0.015] flex items-center justify-between text-[11px] font-sans text-zinc-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono mr-1 text-zinc-300">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono mr-1 text-zinc-300">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono mr-1 text-zinc-300">↵</kbd> to inspect
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[#c9b8a0]">
            <Sparkles className="w-3.5 h-3.5 text-[#c9b8a0]" />
            <span className="font-medium text-xs">Hardware Catalog Spotlight</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
