import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { TopHeader } from './TopHeader';
import { RequisitionDrawer } from '../specialized/RequisitionDrawer';

export function Shell() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#08090d] text-white font-sans relative selection:bg-indigo-500/30 selection:text-white">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* Multi-Stop Ambient Atmospheric Lighting Pools (Linear / Google) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. Top Aurora Light Pool (Deep Indigo & Sapphire) */}
      <div
        className="pointer-events-none fixed -top-48 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] opacity-45 blur-[140px] rounded-full z-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.4), rgba(59, 130, 246, 0.22), rgba(14, 165, 233, 0.08), transparent 70%)',
        }}
      />
      {/* 2. Secondary Warm Champagne / Amber Halo on upper right */}
      <div
        className="pointer-events-none fixed top-24 -right-40 w-[650px] h-[500px] opacity-25 blur-[130px] rounded-full z-0"
        style={{
          background: 'radial-gradient(circle, rgba(245, 230, 200, 0.35), rgba(201, 184, 160, 0.15), transparent 70%)',
        }}
      />
      {/* 3. Bottom Cyan / Emerald Subsurface Refraction on lower left */}
      <div
        className="pointer-events-none fixed -bottom-40 -left-20 w-[700px] h-[500px] opacity-20 blur-[150px] rounded-full z-0"
        style={{
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.28), rgba(6, 182, 212, 0.12), transparent 70%)',
        }}
      />

      {/* Top Header with Integrated macOS Main Bar */}
      <TopHeader />

      {/* Primary Content View Surface - Full Width Apple Luxury */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 py-6 z-10 relative">
        <div className="max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>

      {/* Global Slide-Out Requisition Drawer */}
      <RequisitionDrawer />
    </div>
  );
}

export default Shell;
