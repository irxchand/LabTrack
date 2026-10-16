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
      {/* Radial dot grid overlay */}
      <div className="absolute inset-0 bg-dots pointer-events-none z-0 opacity-40" />

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
