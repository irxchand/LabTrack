import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLabData } from '../../context/LabDataContext';
import { CommandPalette } from '../common/CommandPalette';
import {
  ShoppingBag,
  ChevronDown,
  Search,
  Check,
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
} from 'lucide-react';

export function TopHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, role, switchRole, logout } = useAuth();
  const { basket, setIsBasketOpen, inventory, activeLoans, requisitions, projects, defects } = useLabData();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

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

  const demoRoles = [
    {
      role: 'Student',
      label: 'Student (Requester)',
      name: 'Rahul Sharma',
      badge: '202401048 • DCDS-SY-AIML',
    },
    {
      role: 'Faculty',
      label: 'Faculty Mentor',
      name: 'Dr. Anjali Dalvi',
      badge: 'FAC-AI-019 • Dept of AIML',
    },
    {
      role: 'Lab Assistant',
      label: 'Lab Assistant',
      name: 'Ramesh Patil',
      badge: 'STAFF-LA-04 • Depot Lab 02',
    },
    {
      role: 'HoD / Admin',
      label: 'Department Auditor',
      name: 'Dr. K. V. Ramanathan',
      badge: 'HOD-AIML-001 • Executive Audit',
    },
  ];

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
            count: requisitions.filter((r) => r.status === 'Pending').length,
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
            isActive: (pathname) => pathname.includes('/operations/dispatch'),
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
            count: requisitions.filter((r) => r.status === 'Pending').length,
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
            label: 'Audit Log',
            to: '/workspace/accountability/audit-log',
            icon: FileText,
            isActive: (pathname) => pathname.includes('/accountability/audit-log'),
          },
        ];

      case 'Student':
      default:
        // Student Primary macOS Toolbar: Workstation, My Bench, Requisitions, and Projects (Option B)
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
      <header className="h-16 bg-[#08090d]/80 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-6 flex items-center justify-between z-40 relative shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        {/* Left: Brand & Minimal Lab ID */}
        <div className="flex items-center gap-3.5 flex-shrink-0">
          <div
            className="flex items-center space-x-2.5 cursor-pointer group"
            onClick={() => navigate('/workspace/inventory')}
            title="Hardware Depot Overview"
          >
            <span className="font-display text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f5e6c8] to-[#c9b8a0] leading-none">
              LabTrack
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9b8a0] shadow-[0_0_10px_#c9b8a0]" />
          </div>

          <div className="h-3.5 w-px bg-white/10 hidden lg:block" />

          <div className="hidden lg:flex items-center gap-2 text-xs text-zinc-400">
            <span className="text-zinc-400 text-[11px] font-semibold tracking-[0.18em] uppercase">AIML LAB</span>
          </div>
        </div>

        {/* Center: Apple macOS Segmented Navigation Bar */}
        <nav className="hidden md:flex items-center p-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]">
          {mainNavItems.map((item) => {
            const active = item.isActive(location.pathname);
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.to)}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  active
                    ? 'bg-gradient-to-b from-white to-zinc-200 text-black font-semibold shadow-[0_2px_12px_rgba(255,255,255,0.25)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <item.icon className={`w-3.5 h-3.5 ${active ? 'text-black' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
                {typeof item.count === 'number' && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[11px] font-sans font-semibold leading-none ${
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

          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-inter text-white transition-all cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9b8a0]" />
              <span className="text-zinc-400 text-[11px] hidden sm:inline">Role:</span>
              <span className="font-medium text-white">{role}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {isRoleDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsRoleDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-72 glass-neural rounded-2xl py-2 z-50 overflow-hidden border border-white/15 bg-[#0e0e11] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                  <div className="px-4 py-2 text-[10px] font-inter uppercase tracking-widest text-[#c9b8a0] border-b border-white/10 flex items-center justify-between">
                    <span>Institutional Persona</span>
                    <span className="text-zinc-500">1-Click Switch</span>
                  </div>

                  <div className="p-1.5 space-y-1">
                    {demoRoles.map((item) => (
                      <button
                        key={item.role}
                        type="button"
                        onClick={() => {
                          switchRole(item.role);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                          role === item.role
                            ? 'bg-[#c9b8a0]/15 text-white font-medium border border-[#c9b8a0]/30'
                            : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="font-semibold text-white flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c9b8a0]" />
                            {item.label}
                          </div>
                          <div className="text-[11px] font-sans text-zinc-400 truncate mt-0.5">
                            {item.name} • {item.badge}
                          </div>
                        </div>
                        {role === item.role && (
                          <Check className="w-4 h-4 text-[#c9b8a0] flex-shrink-0 ml-2" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="px-3 py-2 border-t border-white/10 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        navigate('/login');
                      }}
                      className="w-full text-left px-2 py-1.5 text-xs text-rose-400 hover:text-rose-300 font-inter flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Sub-Bar */}
      <div className="md:hidden flex items-center px-4 py-2 border-b border-white/10 bg-[#0a0a0c] overflow-x-auto no-scrollbar gap-2">
        {mainNavItems.map((item) => {
          const active = item.isActive(location.pathname);
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => navigate(item.to)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                active
                  ? 'bg-white text-black font-semibold'
                  : 'text-zinc-400 hover:text-white bg-white/[0.04]'
              }`}
            >
              <item.icon className="w-3 h-3" />
              <span>{item.label}</span>
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
