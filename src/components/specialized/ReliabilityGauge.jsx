import React, { useMemo, useState } from 'react';
import { ShieldCheck, AlertTriangle, Sparkles, CheckCircle2, Sliders } from 'lucide-react';

export function ReliabilityGauge({ score = 94, size = 280, showDetails = true, interactive = false }) {
  const [interactiveScore, setInteractiveScore] = useState(score);
  const activeScore = interactive ? interactiveScore : score;
  const clampedScore = Math.max(0, Math.min(100, activeScore));

  const { tier, color, strokeColor, glowColor, message } = useMemo(() => {
    if (clampedScore >= 90) {
      return {
        tier: 'High Compliance',
        color: 'text-[#3ecf8e]',
        strokeColor: '#3ecf8e',
        glowColor: 'rgba(62, 207, 142, 0.4)',
        message: 'Standard FIFO priority queue active. Automatic dispatch clearance permitted without mentor intervention.',
      };
    }
    if (clampedScore >= 75) {
      return {
        tier: 'Satisfactory Compliance',
        color: 'text-amber-400',
        strokeColor: '#f59e0b',
        glowColor: 'rgba(245, 158, 11, 0.4)',
        message: 'Normal lending privileges. Hardware extension requests subject to single-term limit verification.',
      };
    }
    return {
      tier: 'Flagged (Restricted)',
      color: 'text-rose-400',
      strokeColor: '#f43f5e',
      glowColor: 'rgba(244, 63, 94, 0.4)',
      message: 'Restricted threshold breached (< 75). Triggers mandatory faculty mentor manual confirmation before dispatch.',
    };
  }, [clampedScore]);

  const radius = 94;
  const strokeWidth = 14;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 linear-card relative overflow-hidden group">
      {/* Background ambient glow matching current tier */}
      <div
        className="absolute top-0 w-64 h-32 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: strokeColor }}
      />

      <div className="relative flex items-center justify-center" style={{ width: size, height: size * 0.62 }}>
        <svg
          viewBox="0 0 220 130"
          className="w-full h-full overflow-visible"
        >
          <defs>
            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={strokeColor} floodOpacity="0.5" />
            </filter>
            <linearGradient id="trackGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22242c" />
              <stop offset="100%" stopColor="#1a1c22" />
            </linearGradient>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 16 114 A 94 94 0 0 1 204 114"
            fill="none"
            stroke="url(#trackGrad)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Tick Marks: 75% and 90% Thresholds */}
          <line
            x1="152"
            y1="24"
            x2="157"
            y2="34"
            stroke="#6b7080"
            strokeWidth="2"
            strokeDasharray="2,2"
          />
          <line
            x1="184"
            y1="52"
            x2="176"
            y2="60"
            stroke="#6b7080"
            strokeWidth="2"
            strokeDasharray="2,2"
          />

          {/* Dynamic Active Arc */}
          <path
            d="M 16 114 A 94 94 0 0 1 204 114"
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter="url(#gaugeGlow)"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Numerical Readout */}
        <div className="absolute bottom-1 flex flex-col items-center">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-white">
              {clampedScore}
            </span>
            <span className="text-xs font-sans font-semibold text-zinc-400">/100</span>
          </div>
          <div className={`text-[11px] font-sans font-bold uppercase tracking-wider mt-1 ${color} flex items-center gap-1.5`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {tier}
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 text-center max-w-sm w-full">
          <div className="flex items-center justify-between text-[11px] font-sans text-zinc-400 border-t border-white/[0.08] pt-3 px-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> &lt;75 Flagged
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> 75-89 Satis.
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#3ecf8e]" /> 90-100 High
            </span>
          </div>
          <p className="text-xs text-zinc-300 mt-2.5 leading-relaxed font-sans px-1">
            {message}
          </p>

          {/* Interactive slider for reviewers / defense evaluation */}
          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center gap-3 text-xs font-sans text-zinc-400">
            <Sliders className="w-3.5 h-3.5 text-[#c9b8a0]" />
            <span className="text-[10px] uppercase font-semibold">Simulate Score:</span>
            <input
              type="range"
              min="40"
              max="100"
              value={activeScore}
              onChange={(e) => setInteractiveScore(Number(e.target.value))}
              className="flex-1 accent-[#c9b8a0] cursor-pointer"
            />
            <span className="font-bold text-white w-7 text-right">{activeScore}</span>
          </div>
        </div>
      )}
    </div>
  );
}
