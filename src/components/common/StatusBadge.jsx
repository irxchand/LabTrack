import React from 'react';

export function StatusBadge({ status, type = 'stock', size = 'sm', className = '' }) {
  if (!status) return null;

  let colorClasses = 'bg-white/[0.05] text-[#9da1ad] border-white/[0.1]';
  let dotColor = 'bg-[#9da1ad]';

  // Stock Status
  if (type === 'stock') {
    switch (status) {
      case 'Available':
        colorClasses = 'bg-[#3ecf8e]/10 text-[#3ecf8e] border-[#3ecf8e]/25';
        dotColor = 'bg-[#3ecf8e] shadow-[0_0_8px_rgba(62,207,142,0.8)]';
        break;
      case 'Allocated':
        colorClasses = 'bg-[#a78b71]/15 text-[#e8d5b7] border-[#a78b71]/30';
        dotColor = 'bg-[#a78b71] shadow-[0_0_8px_rgba(167,139,113,0.8)]';
        break;
      case 'Low Stock':
        colorClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/25';
        dotColor = 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]';
        break;
      case 'Maintenance':
        colorClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/25';
        dotColor = 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]';
        break;
    }
  }

  // Classification (Asset, Component, Consumable)
  if (type === 'classification') {
    switch (status) {
      case 'Asset':
        colorClasses = 'bg-[#a78b71]/15 text-[#c9b8a0] border-[#a78b71]/30';
        dotColor = 'bg-[#a78b71]';
        break;
      case 'Component':
        colorClasses = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25';
        dotColor = 'bg-cyan-400';
        break;
      case 'Consumable':
        colorClasses = 'bg-white/[0.06] text-[#9da1ad] border-white/[0.12]';
        dotColor = 'bg-[#6b7080]';
        break;
    }
  }

  // Due Date Status
  if (type === 'due') {
    switch (status) {
      case 'Normal':
        colorClasses = 'bg-[#3ecf8e]/10 text-[#3ecf8e] border-[#3ecf8e]/25';
        dotColor = 'bg-[#3ecf8e]';
        break;
      case 'Imminent':
        colorClasses = 'bg-amber-500/15 text-amber-300 border-amber-500/40 animate-pulse';
        dotColor = 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.9)]';
        break;
      case 'Overdue':
        colorClasses = 'bg-red-500/20 text-red-400 border-red-500/50 font-bold';
        dotColor = 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]';
        break;
    }
  }

  // Requisition Status
  if (type === 'requisition') {
    switch (status) {
      case 'Submitted':
        colorClasses = 'bg-white/[0.06] text-[#9da1ad] border-white/[0.12]';
        dotColor = 'bg-[#9da1ad]';
        break;
      case 'Faculty Endorsed':
        colorClasses = 'bg-[#5e6ad2]/15 text-[#9fa7fc] border-[#5e6ad2]/35';
        dotColor = 'bg-[#5e6ad2]';
        break;
      case 'Ready for Counter Pickup':
        colorClasses = 'bg-cyan-500/15 text-cyan-300 border-cyan-500/35 font-medium';
        dotColor = 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]';
        break;
      case 'Dispatched':
        colorClasses = 'bg-[#3ecf8e]/12 text-[#3ecf8e] border-[#3ecf8e]/30';
        dotColor = 'bg-[#3ecf8e]';
        break;
      case 'Rejected':
        colorClasses = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
        dotColor = 'bg-rose-400';
        break;
    }
  }

  // Defect Severity
  if (type === 'severity') {
    switch (status) {
      case 'Minor':
        colorClasses = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/25';
        dotColor = 'bg-yellow-400';
        break;
      case 'Moderate':
        colorClasses = 'bg-orange-500/15 text-orange-400 border-orange-500/30';
        dotColor = 'bg-orange-400';
        break;
      case 'Critical / Bricked':
        colorClasses = 'bg-red-500/20 text-red-400 border-red-500/40 font-bold';
        dotColor = 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.9)]';
        break;
    }
  }

  const sizeClasses =
    size === 'xs'
      ? 'px-1.5 py-0.5 text-[10px]'
      : size === 'md'
      ? 'px-2.5 py-1 text-xs'
      : 'px-2 py-0.5 text-[11px]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono font-medium border tracking-tight uppercase ${sizeClasses} ${colorClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{status}</span>
    </span>
  );
}
