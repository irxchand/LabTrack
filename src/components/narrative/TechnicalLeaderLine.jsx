import React from 'react';

/**
 * Animated SVG Technical Leader Line connecting 2D DOM annotations
 * to spatial 3D points on the canvas, inspired by Oryzo's `.o-dashline` design.
 */
export function TechnicalLeaderLine({
  startX = 0,
  startY = 0,
  endX = 100,
  endY = 100,
  label = '',
  coordinate = '',
  className = '',
}) {
  const midX = startX + (endX - startX) * 0.5;

  return (
    <div className={`pointer-events-none relative ${className}`}>
      <svg
        className="w-full h-full overflow-visible"
        style={{ filter: 'drop-shadow(0 0 4px rgba(200, 150, 62, 0.2))' }}
      >
        {/* Origin Reticle Dot */}
        <circle cx={startX} cy={startY} r="3" fill="#c8963e" />
        <circle cx={startX} cy={startY} r="6" fill="none" stroke="#c8963e" strokeWidth="1" opacity="0.6" />

        {/* Orthogonal Dashed Leader Line */}
        <path
          d={`M ${startX} ${startY} L ${midX} ${startY} L ${endX} ${endY}`}
          fill="none"
          stroke="#c8963e"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.8"
        />

        {/* Destination Reticle Anchor */}
        <circle cx={endX} cy={endY} r="3" fill="#10b981" />
      </svg>

      {/* Spatial Tag Pill */}
      {(label || coordinate) && (
        <div
          className="absolute z-10 px-2 py-0.5 rounded bg-black/80 border border-white/10 backdrop-blur text-[10px] font-mono-tech flex items-center space-x-1.5"
          style={{ left: `${endX + 8}px`, top: `${endY - 12}px` }}
        >
          {coordinate && <span className="text-[#c8963e]">{coordinate}</span>}
          {label && <span className="text-zinc-300">{label}</span>}
        </div>
      )}
    </div>
  );
}
