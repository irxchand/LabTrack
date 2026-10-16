import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { TopHeader } from './TopHeader';
import { NavigationRail } from './NavigationRail';
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

      {/* Top Header */}
      <TopHeader />

      {/* Main Workspace Frame */}
      <div className="flex flex-1 overflow-hidden z-10 relative">
        {/* Collapsible Left Rail */}
        <NavigationRail />

        {/* Primary Content View Surface */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Global Slide-Out Requisition Drawer */}
      <RequisitionDrawer />
    </div>
  );
}
