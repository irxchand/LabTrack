import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLabData } from '../../context/LabDataContext';
import { CommandPalette } from '../common/CommandPalette';
import {
  ShoppingBag,
  Search,
  LogOut,
  Cpu,
  Clock,
  Inbox,
  FolderGit2,
  CheckSquare,
  Terminal,
  Wrench,
  FileText,
  ShieldCheck,
  BookmarkCheck,
} from 'lucide-react';

export function TopHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, role, logout } = useAuth();
  const {
    basket,
    setIsBasketOpen,
    inventory,
    activeLoans,
    requisitions,
    projects,
    defects,
    reservations,
    auditLogs,
  } = useLabData();
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);



  // Dynamic macOS Toolbar items tailored to active role
  const getMainNavItems = () => {
    switch (role) {
      case 'Faculty':
        return [
          {
            label: 'Workstation',
            to: '/workspace/inventory',
            icon: Cpu,
            count: inventory.length,
            isActive: (pathname) => pathname.includes('/inventory') || pathname === '/workspace',
          },
          {
            label: 'Approvals',
            to: '/workspace/operations/approvals',
            icon: CheckSquare,
            count: requisitions.filter((r) => r.status === 'Pending' || r.status === 'Submitted').length,
            isActive: (pathname) => pathname.includes('/operations/approvals'),
          },
          {
            label: 'Projects',
            to: '/workspace/projects',
            icon: FolderGit2,
            count: projects.length,
            isActive: (pathname) => pathname.includes('/projects'),
          },
          {
            label: 'Defects',
            to: '/workspace/operations/defects',
            icon: Wrench,
            count: defects.length,
            isActive: (pathname) => pathname.includes('/operations/defects'),
          },
        ];

      case 'Lab Assistant':
        return [
          {
            label: 'Workstation',
            to: '/workspace/inventory',
            icon: Cpu,
            count: inventory.length,
            isActive: (pathname) => pathname.includes('/inventory') || pathname === '/workspace',
          },
          {
            label: 'Dispatch Desk',
            to: '/workspace/operations/dispatch',
            icon: Terminal,
            count: requisitions.filter((r) => r.status === 'Ready for Counter Pickup' || r.status === 'Faculty Endorsed').length,
            isActive: (pathname) => pathname.includes('/operations/dispatch'),
          },
          {
            label: 'Active Loans',
            to: '/workspace/custody/active',
            icon: Clock,
            count: activeLoans.length,
            isActive: (pathname) => pathname.includes('/custody/active') || pathname.includes('/custody/bench'),
          },
          {
            label: 'Defect Bench',
            to: '/workspace/operations/defects',
            icon: Wrench,
            count: defects.length,
            isActive: (pathname) => pathname.includes('/operations/defects'),
          },
          {
            label: 'Audit Log',
            to: '/workspace/accountability/audit-log',
            icon: FileText,
            count: auditLogs.length,
            isActive: (pathname) => pathname.includes('/accountability/audit-log'),
          },
        ];

      case 'HoD / Admin':
        return [
          {
            label: 'Workstation',
            to: '/workspace/inventory',
            icon: Cpu,
            count: inventory.length,
            isActive: (pathname) => pathname.includes('/inventory') || pathname === '/workspace',
          },
          {
            label: 'Approvals',
            to: '/workspace/operations/approvals',
            icon: CheckSquare,
            count: requisitions.filter((r) => r.status === 'Pending' || r.status === 'Submitted').length,
            isActive: (pathname) => pathname.includes('/operations/approvals'),
          },
          {
            label: 'Dispatch Desk',
            to: '/workspace/operations/dispatch',
            icon: Terminal,
            isActive: (pathname) => pathname.includes('/operations/dispatch'),
          },
          {
            label: 'Projects',
            to: '/workspace/projects',
            icon: FolderGit2,
            count: projects.length,
            isActive: (pathname) => pathname.includes('/projects'),
          },
          {
            label: 'Defect Bench',
            to: '/workspace/operations/defects',
            icon: Wrench,
            count: defects.length,
            isActive: (pathname) => pathname.includes('/operations/defects'),
          },
          {
            label: 'Audit Log',
            to: '/workspace/accountability/audit-log',
            icon: FileText,
            count: auditLogs.length,
            isActive: (pathname) => pathname.includes('/accountability/audit-log'),
          },
        ];

      case 'Student':
      default:
        // Student Primary macOS Toolbar: Workstation, My Bench, Requisitions, Waitlist, Projects, Reputation
        return [
          {
            label: 'Workstation',
            to: '/workspace/inventory',
            icon: Cpu,
            count: inventory.length,
            isActive: (pathname) => pathname.includes('/inventory') || pathname === '/workspace',
          },
          {
            label: 'My Bench',
            to: '/workspace/custody/active',
            icon: Clock,
            count: activeLoans.length,
            isActive: (pathname) => pathname.includes('/custody/active') || pathname.includes('/custody/bench'),
          },
          {
            label: 'Requisitions',
            to: '/workspace/custody/requests',
            icon: Inbox,
            count: requisitions.length,
            isActive: (pathname) => pathname.includes('/custody/requests'),
          },
          {
            label: 'Waitlist',
            to: '/workspace/custody/reservations',
            icon: BookmarkCheck,
            count: reservations.length,
            isActive: (pathname) => pathname.includes('/custody/reservations'),
          },
          {
            label: 'Projects',
            to: '/workspace/projects',
            icon: FolderGit2,
            count: projects.length,
            isActive: (pathname) => pathname.includes('/projects'),
          },
          {
            label: 'Reputation',
            to: '/workspace/accountability/reliability',
            icon: ShieldCheck,
            isActive: (pathname) => pathname.includes('/accountability/reliability'),
          },
        ];
    }
  };

  const mainNavItems = getMainNavItems();

  return (
    <>
      <header className="h-16 bg-[#08090d]/80 backdrop-blur-2xl border-b border-white/10 px-3 sm:px-5 flex items-center justify-between z-40 relative shadow-[0_4px_30px_rgba(0,0,0,0.4)] gap-3">
        {/* Left: Brand & Minimal Lab ID */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => navigate('/workspace/inventory')}
            title="Hardware Depot Overview"
          >
            <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f5e6c8] to-[#c9b8a0] leading-none">
              LabTrack
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9b8a0] shadow-[0_0_10px_#c9b8a0]" />
          </div>

          <div className="h-3.5 w-px bg-white/10 hidden xl:block" />

          <div className="hidden xl:flex items-center gap-1.5 text-xs text-zinc-400">
            <span className="text-zinc-400 text-[10px] font-semibold tracking-[0.18em] uppercase">AIML LAB</span>
          </div>
        </div>

        {/* Center: Apple macOS Segmented Navigation Bar */}
        <nav className="hidden lg:flex items-center p-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] overflow-x-auto no-scrollbar max-w-fit flex-shrink-0">
          {mainNavItems.map((item) => {
            const active = item.isActive(location.pathname);
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.to)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  active
                    ? 'bg-gradient-to-b from-white to-zinc-200 text-black font-semibold shadow-[0_2px_12px_rgba(255,255,255,0.25)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <item.icon className={`w-3.5 h-3.5 flex-shrink-0 ${active ? 'text-black' : 'text-zinc-400'}`} />
                <span className="whitespace-nowrap">{item.label}</span>
                {typeof item.count === 'number' && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-sans font-semibold leading-none ${
                      active
                        ? 'bg-black/10 text-black font-bold'
                        : 'bg-white/10 text-zinc-300'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Search, Requisition Basket, Persona Switcher */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          {/* Quick Search Trigger */}
          <button
            type="button"
            onClick={() => setIsCommandOpen(true)}
            className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-400 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            title="Search hardware or commands (⌘K)"
          >
            <Search className="w-4 h-4 text-zinc-400" />
            <span className="hidden xl:inline text-[10px] font-mono text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
              ⌘K
            </span>
          </button>

          {/* Requisition Basket Shortcut */}
          <button
            type="button"
            onClick={() => setIsBasketOpen(true)}
            className="relative p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white transition-all cursor-pointer"
            title="Open Requisition Kit"
          >
            <ShoppingBag className="w-4 h-4 text-[#c9b8a0]" />
            {basket.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#f5e6c8] text-black text-[10px] font-bold flex items-center justify-center shadow-sm">
                {basket.length}
              </span>
            )}
          </button>

          {/* Student Reputation / Repo Score Quick Badge */}
          {role === 'Student' && (
            <button
              type="button"
              onClick={() => navigate('/workspace/accountability/reliability')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-[#c9b8a0]/15 border border-white/10 hover:border-[#c9b8a0]/40 text-xs transition-all cursor-pointer shadow-sm group"
              title="View Reputation & Reliability Score Dossier"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#c9b8a0] group-hover:scale-110 transition-transform" />
              <span className="text-zinc-400 text-[11px] hidden lg:inline">Score:</span>
              <span className="font-bold text-[#f5e6c8] text-xs">
                {currentUser?.reliabilityScore || 94}%
              </span>
            </button>
          )}

          <div className="h-3.5 w-px bg-white/10 hidden sm:block" />

          {/* Current User Identity (Read-only) */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-xs font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9b8a0]" />
            <span className="font-medium text-zinc-200">{currentUser?.name || role}</span>
            <span className="text-[10px] text-zinc-500">({role})</span>
          </div>

          {/* Direct Logout Action */}
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 text-xs font-sans text-zinc-300 hover:text-rose-300 transition-all cursor-pointer shadow-sm group"
            title="Log out of LabTrack"
          >
            <LogOut className="w-3.5 h-3.5 text-zinc-400 group-hover:text-rose-400 transition-colors" />
            <span className="font-medium text-xs">Log out</span>
          </button>
        </div>
      </header>

      {/* Mobile Sub-Bar */}
      <div className="lg:hidden flex items-center px-4 py-2 border-b border-white/10 bg-[#0a0a0c] overflow-x-auto no-scrollbar gap-2">
        {mainNavItems.map((item) => {
          const active = item.isActive(location.pathname);
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => navigate(item.to)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 cursor-pointer ${
                active
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white bg-white/[0.04]'
              }`}
            >
              <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="whitespace-nowrap">{item.label}</span>
              {typeof item.count === 'number' && (
                <span className="text-[10px] opacity-75">({item.count})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />
    </>
  );
}

export default TopHeader;
