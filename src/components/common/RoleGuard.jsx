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
      <div className="h-full flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-zinc-900 border border-red-900/50 rounded-lg p-6 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-700/60 text-red-400 mx-auto flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-base font-bold text-zinc-100 tracking-tight">
              Access Boundary Violation (RBAC 403)
            </h2>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Institutional security protocol blocked route access.
            </p>
          </div>

          <div className="p-3 bg-zinc-950 rounded border border-zinc-800 text-left font-mono text-[11px] space-y-1">
            <div className="text-zinc-500">
              Active Role: <span className="text-zinc-200">{role}</span>
            </div>
            <div className="text-zinc-500">
              Target Route: <span className="text-zinc-300">{location.pathname}</span>
            </div>
            <div className="text-zinc-500">
              Required Clearance:{' '}
              <span className="text-amber-400 font-semibold">{allowedRoles.join(', ')}</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/workspace/inventory"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Master Inventory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
