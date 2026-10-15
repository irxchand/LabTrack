import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLabData } from '../../context/LabDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  ArrowLeft,
  MapPin,
  Cpu,
  ShoppingBag,
  BookmarkPlus,
  ExternalLink,
  ShieldAlert,
  Clock,
  History,
  FileCode,
  Tag,
  Building,
} from 'lucide-react';

export function AssetDetailPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { inventory, addToBasket, joinWaitlist } = useLabData();

  const item = inventory.find((i) => i.id === itemId || i.assetTag === itemId);

  if (!item) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-lg font-bold text-zinc-200">Asset Record Not Found</h2>
        <p className="text-xs font-mono text-zinc-500">
          Hardware identifier "{itemId}" does not match any entry in active collegiate datastore.
        </p>
        <Link
          to="/workspace/inventory"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-800 text-xs font-mono text-zinc-200 rounded hover:bg-zinc-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Back & Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div className="space-y-1">
          <Link
            to="/workspace/inventory"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Master Inventory
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
              {item.nomenclature}
            </h1>
            <StatusBadge status={item.stockStatus} type="stock" size="md" />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400">
            <span className="text-blue-400 font-semibold">{item.assetTag}</span>
            <span>•</span>
            <span>SKU: {item.sku}</span>
            <span>•</span>
            <span>{item.manufacturer}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          {item.stockStatus === 'Available' ? (
            <button
              onClick={() => addToBasket(item, 1)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-medium rounded shadow-sm transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Requisition Asset
            </button>
          ) : item.stockStatus === 'Allocated' ? (
            <button
              onClick={() => joinWaitlist(item)}
              className="flex items-center gap-1.5 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-amber-400 border border-zinc-700 font-mono text-xs rounded transition-colors"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              Join FIFO Backlog Queue (Pos #{item.queueDepth + 1})
            </button>
          ) : (
            <span className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 font-mono text-xs text-rose-400 rounded">
              Locked for Maintenance
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: Specifications, Storage Map & Custody Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Technical Dossier */}
        <div className="lg:col-span-2 space-y-6">
          {/* Technical Specifications */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold border-b border-zinc-800/80 pb-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              Technical Sub-Specifications & Silicon Architecture
            </div>

            <div className="text-xs text-zinc-300 font-mono leading-relaxed bg-zinc-950 p-3.5 rounded border border-zinc-800/80">
              {item.subSpecs}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 bg-zinc-950/60 rounded border border-zinc-800">
                <div className="text-zinc-500 text-[10px] uppercase">Tracking Model</div>
                <div className="text-zinc-200 font-semibold mt-0.5">{item.classification}</div>
              </div>
              <div className="p-3 bg-zinc-950/60 rounded border border-zinc-800">
                <div className="text-zinc-500 text-[10px] uppercase">Category Class</div>
                <div className="text-zinc-200 font-semibold mt-0.5">{item.category}</div>
              </div>
              <div className="p-3 bg-zinc-950/60 rounded border border-zinc-800">
                <div className="text-zinc-500 text-[10px] uppercase">Acquisition Date</div>
                <div className="text-zinc-200 font-semibold mt-0.5">{item.dateAcquired || '2024-02-15'}</div>
              </div>
            </div>

            {item.datasheetUrl && (
              <div className="pt-2">
                <a
                  href={item.datasheetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-400 hover:text-blue-300 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Manufacturer Hardware Reference Datasheet
                </a>
              </div>
            )}
          </div>

          {/* Custody History & Audit Trail */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold border-b border-zinc-800/80 pb-2">
              <History className="w-4 h-4 text-emerald-400" />
              Institutional Custody & Circulation Log
            </div>

            {item.custodyHistory && item.custodyHistory.length > 0 ? (
              <div className="divide-y divide-zinc-800/80 text-xs font-mono">
                {item.custodyHistory.map((log) => (
                  <div key={log.id} className="py-2.5 flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-200">{log.event}</span>
                        <span className="text-zinc-500">•</span>
                        <span className="text-blue-400">PRN: {log.prn}</span>
                      </div>
                      <div className="text-zinc-400">{log.notes}</div>
                    </div>
                    <div className="text-right flex-shrink-0 text-zinc-500 text-[11px]">
                      <div>{log.date}</div>
                      <div className="text-emerald-400">{log.condition}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs font-mono text-zinc-500 py-3 text-center">
                No past circulation incidents logged for this inventory unit.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Physical Coordinates & Active Custodian */}
        <div className="space-y-6">
          {/* Storage Coordinate Visualizer */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold border-b border-zinc-800/80 pb-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              Physical Laboratory Coordinates
            </div>

            <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 text-center space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                Storage Coordinate Index
              </div>
              <div className="text-3xl font-mono font-bold text-blue-400 tracking-wider">
                {item.coordinates}
              </div>
              <div className="text-xs font-mono text-zinc-300">
                {item.labRoom}
              </div>
            </div>

            <div className="space-y-1.5 text-xs font-mono text-zinc-400">
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-500">Facility / Wing:</span>
                <span className="text-zinc-200">Building 4 (Engineering)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-500">Laboratory Room:</span>
                <span className="text-zinc-200">{item.labRoom}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-500">Cabinet / Bay:</span>
                <span className="text-zinc-200">CB-04 (ESD Shielded)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">Shelf & Bin:</span>
                <span className="text-zinc-200">Row 2, Bin A</span>
              </div>
            </div>
          </div>

          {/* Active Custody Status */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold border-b border-zinc-800/80 pb-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Current Custody Holder
            </div>

            {item.custodyHolder ? (
              <div className="p-3 bg-zinc-950 rounded border border-zinc-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Borrower:</span>
                  <span className="text-zinc-200 font-semibold">{item.custodyHolder.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">PRN:</span>
                  <span className="text-blue-400">{item.custodyHolder.prn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Project Team:</span>
                  <span className="text-zinc-300">{item.custodyHolder.projectId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Course Code:</span>
                  <span className="text-zinc-300">{item.custodyHolder.courseCode}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-zinc-800 text-amber-400 font-semibold">
                  <span>Scheduled Due:</span>
                  <span>{item.custodyHolder.dueDate}</span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded text-center text-xs font-mono text-emerald-400">
                Unit currently resting in assigned physical bin coordinates. Ready for immediate requisition.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
