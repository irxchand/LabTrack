import React, { useState, useRef } from 'react';
import { Cpu, Zap, Radio, ArrowUpRight, ShieldCheck } from 'lucide-react';

const FEATURED_HARDWARE = [
  {
    id: 'jetson-agx',
    title: 'NVIDIA Jetson AGX Orin',
    classification: 'High-Performance Edge AI',
    specs: '275 TOPS • 64GB LPDDR5 • 2048-core Ampere GPU',
    image: '/images/hardware/jetson-orin.jpg',
    labRoom: 'Lab 1 - AI • Room 402',
    icon: Cpu,
    custodyProtocol: 'FIFO Reservation • Faculty Sign-off',
  },
  {
    id: 'rtx-4090',
    title: 'Workstation RTX 4090 GPU Node',
    classification: 'Deep Learning Acceleration',
    specs: '24GB GDDR6X • 16,384 CUDA Cores • DLSS 3 / FP8',
    image: '/images/hardware/rtx-4090.jpg',
    labRoom: 'Lab 1 - AI • Compute Bay',
    icon: Zap,
    custodyProtocol: 'Project Group Exclusive • Dual Guide Approval',
  },
  {
    id: 'rpi-5',
    title: 'Raspberry Pi 5 Host Node',
    classification: 'Edge Telemetry & Control',
    specs: 'Quad Cortex-A76 @ 2.4GHz • 8GB RAM • Dual 4K HDMI',
    image: '/images/hardware/raspberry-pi-5.jpg',
    labRoom: 'Lab 2 - IoT • Room 305',
    icon: Radio,
    custodyProtocol: 'Direct Requisition • Instant Counter Issue',
  },
];

function TiltCard({ item, index }) {
  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.35,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-3xl p-px transition-all duration-300 ease-out [perspective:1000px] group"
    >
      {/* 3D Rotating Glass Frame */}
      <div
        className="relative h-full w-full rounded-3xl overflow-hidden bg-[#0c0d12]/90 border border-white/10 backdrop-blur-2xl p-6 sm:p-7 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6)] group-hover:border-white/20 transition-all duration-200"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.02, 1.02, 1.02)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Dynamic Cursor Glare Sheen */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(245,230,200,${glare.opacity}) 0%, transparent 65%)`,
          }}
        />

        {/* Top Metadata Header */}
        <div className="flex items-center justify-between mb-5 [transform:translateZ(25px)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#c9b8a0]">
              <item.icon className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c9b8a0]">
              {item.classification}
            </span>
          </div>

          <span className="text-[10px] font-sans text-zinc-400 bg-white/[0.03] px-2 py-0.5 rounded-full border border-white/5">
            {item.labRoom}
          </span>
        </div>

        {/* High-Resolution Hardware Visual Canvas */}
        <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden mb-6 bg-[#08090b] border border-white/5 flex items-center justify-center [transform:translateZ(35px)] shadow-inner">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-transparent to-black/20" />
        </div>

        {/* Component Title & Specs */}
        <div className="[transform:translateZ(30px)]">
          <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-[#f5e6c8] transition-colors">
            {item.title}
          </h3>
          <p className="text-xs text-zinc-400 font-sans mt-1.5 leading-relaxed">
            {item.specs}
          </p>

          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c9b8a0]" />
              <span className="text-[11px]">{item.custodyProtocol}</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-white/10 transition-all">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroFeatureGrid() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs text-[#c9b8a0] mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c9b8a0] shadow-[0_0_8px_#c9b8a0]" />
          <span>FLAGSHIP HARDWARE DEPOT</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-[#c9b8a0]">
          Precision Silicon for Groundbreaking Research.
        </h2>
        <p className="mt-4 text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
          Every component in the AIML Laboratory is cataloged, calibrated, and managed under strict chain-of-custody protocols.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {FEATURED_HARDWARE.map((item, index) => (
          <TiltCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}

export default HeroFeatureGrid;
