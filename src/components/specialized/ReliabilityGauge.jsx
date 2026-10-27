import React, { useMemo } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

export function ReliabilityGauge({ score = 94, size = 300, showDetails = true, interactive = false }) {
  const clampedScore = Math.max(0, Math.min(100, score));

  const { tier, badgeStyle, arcGradId, strokeGlow, message } = useMemo(() => {
    if (clampedScore >= 90) {
      return {
        tier: 'High Compliance Tier',
        badgeStyle: 'bg-[#c9b8a0]/15 text-[#f5e6c8] border-[#c9b8a0]/30',
        arcGradId: 'goldArcGradient',
        strokeGlow: 'rgba(201, 184, 160, 0.35)',
        message: 'Standard FIFO priority queue active. Automatic counter dispatch clearance without mentor intervention.',
      };
    }
    if (clampedScore >= 75) {
      return {
        tier: 'Standard Tier',
        badgeStyle: 'bg-white/[0.08] text-white border-white/20',
        arcGradId: 'whiteArcGradient',
        strokeGlow: 'rgba(255, 255, 255, 0.25)',
        message: 'Standard collegiate lending privileges. Hardware extensions subject to single-term cap verification.',
      };
    }
    return {
      tier: 'Restricted Status',
      badgeStyle: 'bg-white/[0.04] text-zinc-300 border-white/15',
      arcGradId: 'zincArcGradient',
      strokeGlow: 'rgba(201, 184, 160, 0.2)',
      message: 'Accountability threshold breached (< 75). Requires direct faculty supervisor endorsement before dispatch.',
    };
  }, [clampedScore]);

  const radius = 96;
  const strokeWidth = 10;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full relative select-none">
      {/* Ambient Radial Glow behind gauge */}
      <div
        className="absolute top-1/4 w-52 h-28 rounded-full blur-3xl pointer-events-none transition-all duration-700"
        style={{ backgroundColor: strokeGlow }}
      />

      <div className="relative flex items-center justify-center" style={{ width: size, height: size * 0.58 }}>
        <svg viewBox="0 0 220 125" className="w-full h-full overflow-visible">
          <defs>
            {/* Signature Brand Champagne Gold Arc Gradient */}
            <linearGradient id="goldArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a78b71" />
              <stop offset="50%" stopColor="#e2d2bc" />
              <stop offset="100%" stopColor="#f5e6c8" />
            </linearGradient>

            <linearGradient id="amberArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>

            <linearGradient id="roseArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9f1239" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>

            {/* Background Track Gradient */}
            <linearGradient id="gaugeTrack" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e1e24" />
              <stop offset="100%" stopColor="#141418" />
            </linearGradient>

            <filter id="gaugeSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={strokeGlow} />
            </filter>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 14 112 A 96 96 0 0 1 206 112"
            fill="none"
            stroke="url(#gaugeTrack)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Threshold Tick Indicators at 75% and 90% */}
          <line x1="154" y1="21" x2="159" y2="30" stroke="#3f3f46" strokeWidth="1.5" />
          <line x1="186" y1="48" x2="179" y2="55" stroke="#3f3f46" strokeWidth="1.5" />

          {/* Dynamic Active Score Arc */}
          <path
            d="M 14 112 A 96 96 0 0 1 206 112"
            fill="none"
            stroke={`url(#${arcGradId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter="url(#gaugeSoftGlow)"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Numerical Readout */}
        <div className="absolute bottom-0 flex flex-col items-center">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-sans font-bold tracking-tight text-white leading-none">
              {clampedScore}
            </span>
            <span className="text-xs font-sans font-medium text-zinc-500">/100</span>
          </div>

          <div className={`mt-2 px-3 py-0.5 rounded-full border text-[11px] font-sans font-semibold flex items-center gap-1.5 shadow-sm ${badgeStyle}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            <span>{tier}</span>
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="mt-5 text-center max-w-sm w-full space-y-3">
          {/* Refined Three-Tier Scale Indicator */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-white/[0.02] border border-white/5 text-[10px] font-sans">
            <div className={`py-1 rounded-xl text-center transition-colors ${clampedScore < 75 ? 'bg-white/[0.08] text-white font-semibold' : 'text-zinc-500'}`}>
              &lt; 75 Restricted
            </div>
            <div className={`py-1 rounded-xl text-center transition-colors ${clampedScore >= 75 && clampedScore < 90 ? 'bg-white/[0.08] text-white font-semibold' : 'text-zinc-500'}`}>
              75-89 Standard
            </div>
            <div className={`py-1 rounded-xl text-center transition-colors ${clampedScore >= 90 ? 'bg-[#c9b8a0]/20 text-[#f5e6c8] font-semibold' : 'text-zinc-500'}`}>
              90-100 Prime
            </div>
          </div>

          <p className="text-xs text-zinc-400 font-sans leading-relaxed px-2">
            {message}
          </p>
        </div>
      )}
    </div>
  );
}

export default ReliabilityGauge;
