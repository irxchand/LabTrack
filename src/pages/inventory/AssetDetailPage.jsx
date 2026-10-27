import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLabData } from '../../context/LabDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  ArrowLeft,
  MapPin,
  Cpu,
  ShoppingBag,
  BookmarkPlus,
  ExternalLink,
  History,
  Clock,
  Layers,
  ShieldCheck } from 'lucide-react';

export function AssetDetailPage() {
  const { itemId } = useParams();
  const { inventory, addToBasket, joinWaitlist } = useLabData();

  const item = inventory.find((i) => i.id === itemId || i.assetTag === itemId);

  const getItemImage = (hardware) => {
    if (hardware.image) return hardware.image;
    const nom = (hardware.nomenclature || '').toLowerCase();
    if (nom.includes('raspberry') || nom.includes('pi 5')) return '/images/hardware/raspberry-pi-5.jpg';
    if (nom.includes('jetson')) return '/images/hardware/jetson-nano.jpg';
    if (nom.includes('esp32')) return '/images/hardware/esp32-wroom.jpg';
    if (nom.includes('breadboard')) return '/images/hardware/breadboard-830.jpg';
    if (nom.includes('mpu') || nom.includes('imu') || nom.includes('gyro') || nom.includes('accelerometer')) return '/images/hardware/mpu6050-sensor.jpg';
    if (nom.includes('sensor') || nom.includes('bmp')) return '/images/hardware/bmp280-sensor.jpg';
    if (nom.includes('resistor')) return '/images/hardware/resistors-pack.jpg';
    return '/images/hardware/raspberry-pi-5.jpg';
  };

  if (!item) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto p-8 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
        <h2 className="font-display text-xl font-semibold text-white">Asset Record Not Found</h2>
        <p className="text-xs font-sans text-zinc-400 leading-relaxed">
          Hardware identifier "{itemId}" does not match any entry in active collegiate datastore.
        </p>
        <Link
          to="/workspace/inventory"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#f5e6c8] text-black font-semibold text-xs transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Workstation</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <Link
            to="/workspace/inventory"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-sans text-zinc-300 hover:text-white transition-all mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Hardware Workstation</span>
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white mt-1">
              {item.nomenclature}
            </h1>
            <StatusBadge status={item.stockStatus} type="stock" size="md" />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-sans text-zinc-400 mt-1.5">
            <span className="text-[#c9b8a0] font-semibold">{item.assetTag}</span>
            <span className="text-zinc-600">•</span>
            <span>SKU: {item.sku}</span>
            <span className="text-zinc-600">•</span>
            <span>{item.manufacturer}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {item.stockStatus === 'Available' ? (
            <button
              onClick={() => addToBasket(item, 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#c9b8a0] via-[#e2d2bc] to-[#f5e6c8] hover:opacity-95 text-black font-semibold text-xs tracking-wide transition-all shadow-[0_0_15px_rgba(201,184,160,0.3)] cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add to Requisition Kit</span>
            </button>
          ) : item.stockStatus === 'Allocated' ? (
            <button
              onClick={() => joinWaitlist(item)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-[#f5e6c8] border border-[#c9b8a0]/30 font-semibold text-xs transition-colors cursor-pointer"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-[#c9b8a0]" />
              <span>Join FIFO Backlog Queue (Pos #{item.queueDepth + 1})</span>
            </button>
          ) : (
            <span className="px-4 py-2 rounded-full bg-white/[0.06] border border-white/15 font-sans text-xs text-zinc-300 font-medium">
              Locked for Maintenance
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: Specifications, Storage Map & Custody Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Technical Dossier */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hardware Photo Pedestal */}
          <div className="p-2 bg-gradient-to-b from-[#141417]/95 to-[#0c0c0e]/95 border border-white/10 rounded-3xl backdrop-blur-xl shadow-lg flex items-center justify-center h-72 sm:h-80 overflow-hidden relative">
            <div className="absolute inset-0 bg-radial from-[#c9b8a0]/10 via-transparent to-transparent pointer-events-none" />
            <img
              src={getItemImage(item)}
              alt={item.nomenclature}
              className="w-full h-full object-cover object-center rounded-2xl z-10"
              onError={(e) => {
                e.target.src = '/images/hardware/raspberry-pi-5.jpg';
              }}
            />
          </div>

          {/* Technical Specifications */}
          <div className="p-6 bg-gradient-to-b from-[#141417]/95 to-[#0c0c0e]/95 border border-white/10 rounded-3xl space-y-4 backdrop-blur-xl shadow-lg">
            <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-[#c9b8a0] font-semibold border-b border-white/10 pb-3">
              <Cpu className="w-4 h-4 text-[#c9b8a0]" />
              Technical Sub-Specifications & Silicon Architecture
            </div>

            <div className="text-xs text-zinc-300 font-sans leading-relaxed bg-white/[0.02] p-4 rounded-2xl border border-white/5">
              {item.subSpecs}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-sans">
              <div className="p-3.5 bg-white/[0.02] rounded-2xl border border-white/5">
                <div className="text-zinc-500 text-[10px] uppercase font-semibold">Tracking Model</div>
                <div className="text-white font-semibold mt-0.5">{item.classification}</div>
              </div>
              <div className="p-3.5 bg-white/[0.02] rounded-2xl border border-white/5">
                <div className="text-zinc-500 text-[10px] uppercase font-semibold">Category Class</div>
                <div className="text-white font-semibold mt-0.5">{item.category}</div>
              </div>
              <div className="p-3.5 bg-white/[0.02] rounded-2xl border border-white/5">
                <div className="text-zinc-500 text-[10px] uppercase font-semibold">Availability</div>
                <div className="text-[#f5e6c8] font-semibold mt-0.5">{item.availableStock} of {item.totalStock} Units</div>
              </div>
            </div>

            {item.datasheetUrl && (
              <div className="pt-2">
                <a
                  href={item.datasheetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-sans text-[#c9b8a0] hover:text-[#f5e6c8] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Manufacturer Hardware Reference Datasheet</span>
                </a>
              </div>
            )}
          </div>

          {/* Custody History & Audit Trail */}
          <div className="p-6 bg-gradient-to-b from-[#141417]/95 to-[#0c0c0e]/95 border border-white/10 rounded-3xl space-y-4 backdrop-blur-xl shadow-lg">
            <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-[#c9b8a0] font-semibold border-b border-white/10 pb-3">
              <History className="w-4 h-4 text-[#c9b8a0]" />
              Institutional Custody & Circulation Log
            </div>

            {item.custodyHistory && item.custodyHistory.length > 0 ? (
              <div className="divide-y divide-white/5 text-xs font-sans">
                {item.custodyHistory.map((log) => (
                  <div key={log.id} className="py-3 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{log.event}</span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-zinc-400">PRN: {log.prn}</span>
                      </div>
                      <div className="text-zinc-400">{log.notes}</div>
                    </div>
                    <div className="text-right flex-shrink-0 text-zinc-500 text-[11px]">
                      <div>{log.date}</div>
                      <div className="text-[#c9b8a0] font-medium mt-0.5">{log.condition}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs font-sans text-zinc-500 py-4 text-center">
                No past circulation incidents logged for this inventory unit.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Physical Coordinates & Active Custodian */}
        <div className="space-y-6">
          {/* Storage Coordinate Visualizer */}
          <div className="p-6 bg-gradient-to-b from-[#141417]/95 to-[#0c0c0e]/95 border border-white/10 rounded-3xl space-y-4 backdrop-blur-xl shadow-lg">
            <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-[#c9b8a0] font-semibold border-b border-white/10 pb-3">
              <MapPin className="w-4 h-4 text-[#c9b8a0]" />
              Physical Laboratory Coordinates
            </div>

            <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 text-center space-y-2">
              <div className="text-[10px] font-sans uppercase tracking-widest text-zinc-500 font-semibold">
                Storage Coordinate Index
              </div>
              <div className="text-3xl font-display font-bold text-white tracking-wider">
                {item.coordinates}
              </div>
              <div className="text-xs font-sans text-zinc-400">
                {item.labRoom}
              </div>
            </div>

            <div className="space-y-2 text-xs font-sans text-zinc-400">
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-zinc-500">Facility / Wing:</span>
                <span className="text-zinc-200">Building 4 (Engineering)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-zinc-500">Laboratory Room:</span>
                <span className="text-zinc-200">{item.labRoom}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-zinc-500">Cabinet / Bay:</span>
                <span className="text-zinc-200">CB-04 (ESD Shielded)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-zinc-500">Shelf & Bin:</span>
                <span className="text-zinc-200">Row 2, Bin A</span>
              </div>
            </div>
          </div>

          {/* Active Custody Status */}
          <div className="p-6 bg-gradient-to-b from-[#141417]/95 to-[#0c0c0e]/95 border border-white/10 rounded-3xl space-y-4 backdrop-blur-xl shadow-lg">
            <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-[#c9b8a0] font-semibold border-b border-white/10 pb-3">
              <Clock className="w-4 h-4 text-[#c9b8a0]" />
              Current Custody Holder
            </div>

            {item.custodyHolder ? (
              <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 space-y-2.5 text-xs font-sans">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Borrower:</span>
                  <span className="text-white font-semibold">{item.custodyHolder.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">PRN:</span>
                  <span className="text-zinc-300 font-medium">{item.custodyHolder.prn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Project Team:</span>
                  <span className="text-[#c9b8a0] font-medium">{item.custodyHolder.projectId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Course Code:</span>
                  <span className="text-zinc-300">{item.custodyHolder.courseCode}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/5 text-[#f5e6c8] font-semibold">
                  <span>Scheduled Due:</span>
                  <span>{item.custodyHolder.dueDate}</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-[#c9b8a0]/15 border border-[#c9b8a0]/30 rounded-2xl text-center text-xs font-sans text-[#f5e6c8]">
                Unit currently resting in assigned physical bin coordinates. Ready for immediate requisition.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetDetailPage;
