import React from 'react';

export function StatusBadge({ status, type = 'stock', size = 'sm', className = '' }) {
  if (!status) return null;

  let colorClasses = 'bg-white/[0.05] text-zinc-300 border-white/10';
  let dotColor = 'bg-zinc-400';

  // Stock Status
  if (type === 'stock') {
    switch (status) {
      case 'Available':
        colorClasses = 'bg-white/[0.06] text-zinc-200 border-white/15';
        dotColor = 'bg-[#c9b8a0]';
        break;
      case 'Allocated':
        colorClasses = 'bg-white/[0.04] text-zinc-400 border-white/10';
        dotColor = 'bg-zinc-500';
        break;
      case 'Low Stock':
        colorClasses = 'bg-amber-500/10 text-amber-300 border-amber-500/25';
        dotColor = 'bg-amber-400';
        break;
      case 'Maintenance':
        colorClasses = 'bg-rose-500/10 text-rose-300 border-rose-500/25';
        dotColor = 'bg-rose-400';
        break;
      default:
        break;
    }
  }

  // Classification (Asset, Component, Consumable)
  if (type === 'classification') {
    switch (status) {
      case 'Asset':
        colorClasses = 'bg-white/[0.06] text-zinc-200 border-white/10';
        dotColor = 'bg-[#c9b8a0]';
        break;
      case 'Component':
      case 'Consumable':
        colorClasses = 'bg-white/[0.04] text-zinc-400 border-white/10';
        dotColor = 'bg-zinc-500';
        break;
      default:
        break;
    }
  }

  // Due Date Status
  if (type === 'due') {
    switch (status) {
      case 'Normal':
        colorClasses = 'bg-white/[0.06] text-zinc-300 border-white/10';
        dotColor = 'bg-[#c9b8a0]';
        break;
      case 'Imminent':
        colorClasses = 'bg-amber-500/10 text-amber-300 border-amber-500/30';
        dotColor = 'bg-amber-400';
        break;
      case 'Overdue':
        colorClasses = 'bg-red-500/15 text-red-300 border-red-500/40';
        dotColor = 'bg-red-400';
        break;
      default:
        break;
    }
  }

  // Requisition Status
  if (type === 'requisition') {
    switch (status) {
      case 'Submitted':
        colorClasses = 'bg-white/[0.04] text-zinc-400 border-white/10';
        dotColor = 'bg-zinc-500';
        break;
      case 'Faculty Endorsed':
        colorClasses = 'bg-white/[0.08] text-zinc-200 border-white/15';
        dotColor = 'bg-[#c9b8a0]';
        break;
      case 'Ready for Counter Pickup':
        colorClasses = 'bg-[#c9b8a0]/15 text-[#f5e6c8] border-[#c9b8a0]/30';
        dotColor = 'bg-[#c9b8a0]';
        break;
      case 'Dispatched':
        colorClasses = 'bg-white/[0.06] text-zinc-300 border-white/10';
        dotColor = 'bg-zinc-400';
        break;
      case 'Rejected':
        colorClasses = 'bg-rose-500/15 text-rose-300 border-rose-500/30';
        dotColor = 'bg-rose-400';
        break;
      default:
        break;
    }
  }

  // Defect Severity
  if (type === 'severity') {
    switch (status) {
      case 'Minor':
        colorClasses = 'bg-white/[0.05] text-zinc-300 border-white/10';
        dotColor = 'bg-zinc-400';
        break;
      case 'Moderate':
        colorClasses = 'bg-amber-500/10 text-amber-300 border-amber-500/25';
        dotColor = 'bg-amber-400';
        break;
      case 'Critical / Bricked':
        colorClasses = 'bg-red-500/15 text-red-300 border-red-500/35';
        dotColor = 'bg-red-400';
        break;
      default:
        break;
    }
  }

  const sizeClasses =
    size === 'xs'
      ? 'px-2 py-0.5 text-[11px]'
      : size === 'md'
      ? 'px-3 py-1 text-xs'
      : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-sans font-medium border ${sizeClasses} ${colorClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{status}</span>
    </span>
  );
}

export default StatusBadge;
