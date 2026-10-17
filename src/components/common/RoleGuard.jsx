import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export function RoleGuard({ allowedRoles, children }) {
  const { role, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // HoD / Admin always has global administrative access
  if (role === 'HoD / Admin') {
    return children;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="h-full min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#111215]/95 border border-white/10 rounded-3xl p-8 text-center space-y-4 shadow-2xl backdrop-blur-xl text-white">
          <div className="w-14 h-14 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.2)]">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Access Boundary Violation (RBAC 403)
            </h2>
            <p className="text-xs text-zinc-400 mt-1 font-sans">
              Institutional security protocol blocked route access.
            </p>
          </div>

          <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/10 text-left font-sans text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-zinc-500">Active Role:</span>
              <span className="text-white font-medium">{role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Target Route:</span>
              <span className="text-zinc-300 font-medium">{location.pathname}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-white/5">
              <span className="text-zinc-500">Required Clearance:</span>
              <span className="text-[#f5e6c8] font-semibold">{allowedRoles.join(', ')}</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/workspace/inventory"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#f5e6c8] text-xs font-semibold text-black transition-all shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Workstation</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export default RoleGuard;
