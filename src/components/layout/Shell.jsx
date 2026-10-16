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
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0a0a0a] text-white font-inter relative">
      {/* Subtle ambient specular atmosphere */}
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-[#1f1f28]/25 via-transparent to-transparent pointer-events-none z-0" />

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
