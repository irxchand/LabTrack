import React from 'react';

/**
 * StatusBadge
 * Apple Cupertino-grade status badge.
 * Enforces the strict 3-color palette: Champagne Gold (#c9b8a0), Pure White (#ffffff), and Obsidian Black (#0a0a0c).
 * Zero AI tropes, zero rainbow colors.
 */
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
        colorClasses = 'bg-[#c9b8a0]/15 text-[#f5e6c8] border-[#c9b8a0]/30';
        dotColor = 'bg-[#c9b8a0]';
        break;
      case 'Maintenance':
        colorClasses = 'bg-white/[0.06] text-zinc-300 border-white/15';
        dotColor = 'bg-white/60';
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
        colorClasses = 'bg-[#c9b8a0]/15 text-[#f5e6c8] border-[#c9b8a0]/30';
        dotColor = 'bg-[#c9b8a0]';
        break;
      case 'Overdue':
        colorClasses = 'bg-white/[0.08] text-white border-white/20';
        dotColor = 'bg-white';
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
      case 'Returned':
      case 'Returned & Restocked':
        colorClasses = 'bg-[#c9b8a0]/15 text-[#f5e6c8] border-[#c9b8a0]/30';
        dotColor = 'bg-[#c9b8a0]';
        break;
      case 'Rejected':
        colorClasses = 'bg-white/[0.04] text-zinc-400 border-white/15';
        dotColor = 'bg-zinc-500';
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
        colorClasses = 'bg-[#c9b8a0]/15 text-[#f5e6c8] border-[#c9b8a0]/30';
        dotColor = 'bg-[#c9b8a0]';
        break;
      case 'Critical / Bricked':
        colorClasses = 'bg-[#c9b8a0]/25 text-[#f5e6c8] border-[#c9b8a0]/40 font-semibold';
        dotColor = 'bg-[#f5e6c8]';
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
      className={`inline-flex items-center gap-1.5 rounded-full border font-sans font-medium tracking-tight backdrop-blur-md transition-all ${colorClasses} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
      <span>{status}</span>
    </span>
  );
}

export default StatusBadge;
