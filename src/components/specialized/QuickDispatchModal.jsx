import React, { useState } from 'react';
import { X, ScanLine, Search, CheckCircle2, ArrowDownLeft, ArrowUpRight, AlertCircle } from 'lucide-react';
import { useLabData } from '../../context/LabDataContext';

export function QuickDispatchModal({ isOpen, onClose }) {
  const { activeLoans, inventory } = useLabData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [condition, setCondition] = useState('Pristine');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Filter inventory and loans based on search
  const filteredAssets = (inventory || []).filter(
    (item) =>
      item.assetTag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nomenclature?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.coordinates?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckout = (asset) => {
    setSelectedAsset(asset);
    setSuccessMsg(`Asset ${asset.assetTag} checked out to current session student.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#0c0e14] border border-white/10 rounded-xl shadow-2xl p-6 z-10 font-mono-tech text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded bg-[#c8963e]/15 border border-[#c8963e]/30 text-[#c8963e]">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight uppercase">
                Custodian Counter Dispatch Terminal
              </h2>
              <p className="text-xs text-zinc-400">
                Single-Click PRN & Hardware Asset Tag Verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="py-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Scan Barcode or Type Asset Tag (e.g. RIG-8840, STM32, OSC-DIGITAL)..."
              className="w-full pl-9 pr-4 py-2.5 bg-black/60 border border-white/15 rounded-lg text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#c8963e]"
              autoFocus
            />
          </div>
        </div>

        {/* Feedback Alert */}
        {successMsg && (
          <div className="p-3 mb-4 rounded bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-400 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Matching Assets List */}
        <div className="max-h-72 overflow-y-auto divide-y divide-white/5 space-y-2 pr-1">
          {filteredAssets.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              No matching hardware assets found.
            </div>
          ) : (
            filteredAssets.slice(0, 6).map((asset) => (
              <div
                key={asset.id}
                className="pt-2 flex items-center justify-between text-xs hover:bg-white/5 p-2 rounded transition"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[#c8963e]">{asset.assetTag}</span>
                    <span className="text-zinc-300 font-semibold">{asset.nomenclature}</span>
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    Location: {asset.coordinates} • Status: {asset.status}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCheckout(asset)}
                    className="px-3 py-1.5 rounded bg-white/10 hover:bg-[#c8963e] hover:text-black transition text-xs font-semibold flex items-center space-x-1"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Issue</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-500">
          <span>Active Scanner Status: NIST Standard 1D/2D Reader Engaged</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-zinc-800 text-zinc-300 hover:text-white transition"
          >
            Close Terminal
          </button>
        </div>
      </div>
    </div>
  );
}
