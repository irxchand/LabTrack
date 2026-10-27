import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLabData, getItemDeptStock } from '../../context/LabDataContext';
import {
  ShoppingBag,
  LogOut,
  Cpu,
  Clock,
  Inbox,
  FolderGit2,
  CheckSquare,
  Send,
  Wrench,
  FileText,
  BookmarkCheck,
  ChevronDown,
  Check,
} from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';

export function TopHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, role, logout, switchRole } = useAuth();
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
    selectedDepartment,
    setSelectedDepartment,
    departments,
    userDepartment,
    selectedFacility,
    setSelectedFacility,
    facilities,
  } = useLabData();

  const [isLabDropdownOpen, setIsLabDropdownOpen] = useState(false);
  const labDropdownRef = useRef(null);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const getUserInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  // Outside click listener for lab dropdown & user menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (labDropdownRef.current && !labDropdownRef.current.contains(e.target)) {
        setIsLabDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsLabDropdownOpen(false);
        setIsUserMenuOpen(false);
      }
    };
    if (isLabDropdownOpen || isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLabDropdownOpen, isUserMenuOpen]);



  // Dynamic macOS Toolbar items tailored to active role
  const getMainNavItems = () => {
    switch (role) {
      case 'Faculty':
        return [
          {
            label: 'Workstation',
            to: '/workspace/inventory',
            icon: Cpu,
            count: inventory.filter((item) => getItemDeptStock(item, selectedDepartment || userDepartment || 'AIML').total > 0).length,
            isActive: (pathname) => pathname.includes('/inventory') || pathname === '/workspace',
          },
          {
            label: 'Approvals',
            to: '/workspace/operations/approvals',
            icon: CheckSquare,
            count: requisitions.filter((r) => r.status === 'Pending' || r.status === 'Submitted' || r.status === 'Pending Approval').length,
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
            count: inventory.filter((item) => getItemDeptStock(item, selectedDepartment || userDepartment || 'AIML').total > 0).length,
            isActive: (pathname) => pathname.includes('/inventory') || pathname === '/workspace',
          },
          {
            label: 'Dispatch Desk',
            to: '/workspace/operations/dispatch',
            icon: Send,
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
            count: inventory.filter((item) => getItemDeptStock(item, selectedDepartment || userDepartment || 'AIML').total > 0).length,
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
            icon: Send,
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
      default: {
        // Student Primary macOS Toolbar Flow: Projects -> Workstation -> Requisitions -> Waitlist -> My Bench
        const studentLoans = activeLoans.filter(
          (loan) => loan.borrowerPrn === currentUser?.prn
        );
        const studentRequisitions = requisitions.filter(
          (req) => req.borrowerPrn === currentUser?.prn || req.studentPrn === currentUser?.prn || req.submittedBy === currentUser?.name
        );
        const studentProjects = projects.filter(
          (p) => p.teamLeaderPrn === currentUser?.prn || p.members?.some((m) => m.prn === currentUser?.prn) || (currentUser?.projectId && p.id === currentUser?.projectId)
        );
        const studentReservations = reservations.filter(
          (res) =>
            res.requestorPrn === currentUser?.prn ||
            res.studentPrn === currentUser?.prn ||
            res.borrowerPrn === currentUser?.prn
        );

        return [
          {
            label: 'Projects',
            to: '/workspace/projects',
            icon: FolderGit2,
            count: studentProjects.length,
            isActive: (pathname) => pathname.includes('/projects'),
          },
          {
            label: 'Workstation',
            to: '/workspace/inventory',
            icon: Cpu,
            count: inventory.filter((item) => getItemDeptStock(item, userDepartment).total > 0).length,
            isActive: (pathname) => pathname.includes('/inventory') || pathname === '/workspace',
          },
          {
            label: 'Requisitions',
            to: '/workspace/custody/requests',
            icon: Inbox,
            count: studentRequisitions.length,
            isActive: (pathname) => pathname.includes('/custody/requests'),
          },
          {
            label: 'Waitlist',
            to: '/workspace/custody/reservations',
            icon: BookmarkCheck,
            count: studentReservations.length,
            isActive: (pathname) => pathname.includes('/custody/reservations'),
          },
          {
            label: 'My Bench',
            to: '/workspace/custody/active',
            icon: Clock,
            count: studentLoans.length,
            isActive: (pathname) => pathname.includes('/custody/active') || pathname.includes('/custody/bench'),
          },
        ];
      }
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
            onClick={() => navigate('/hero')}
            title="LabTrack Flagship Showcase"
          >
            <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f5e6c8] to-[#c9b8a0] leading-none">
              LabTrack
            </span>
          </div>

          <div className="h-3.5 w-px bg-white/10 hidden sm:block" />

          {/* Institutional Department Selector (Clickable Dropdown for All Roles) */}
          <div className="relative hidden sm:block" ref={labDropdownRef}>
            <button
              type="button"
              onClick={() => setIsLabDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#c9b8a0]/40 transition-all cursor-pointer group shadow-sm select-none"
              title="Switch Engineering Department Facility"
              aria-expanded={isLabDropdownOpen}
              aria-haspopup="true"
            >
              <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-zinc-300 group-hover:text-white transition-colors">
                {selectedDepartment} DEPT
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9b8a0]" />
              <ChevronDown
                className={`w-3 h-3 text-zinc-400 group-hover:text-zinc-200 transition-transform duration-200 ${
                  isLabDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

                {/* Dropdown Menu */}
                {isLabDropdownOpen && (
                  <div
                    className="absolute left-0 top-full mt-2 w-80 rounded-2xl bg-[#0c0d12]/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                    role="menu"
                  >
                    <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between">
                      <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.15em] text-zinc-400">
                        DEPARTMENT FACILITY
                      </span>
                      <span className="text-[9px] font-sans text-zinc-400">
                        SIT Pune • 2026
                      </span>
                    </div>
                    <div className="p-1 space-y-1">
                      {(departments || []).map((dept) => {
                        const isSelected = selectedDepartment === dept.code;
                        return (
                          <button
                            key={dept.id}
                            type="button"
                            onClick={() => {
                              setSelectedDepartment(dept.code);
                              setIsLabDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-sans transition-all flex items-start justify-between group cursor-pointer ${
                              isSelected
                                ? 'bg-white/[0.08] text-white border border-white/10 shadow-sm'
                                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                            }`}
                            role="menuitem"
                          >
                            <div className="flex flex-col pr-2">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`font-semibold text-xs tracking-wide ${
                                    isSelected ? 'text-[#f5e6c8]' : 'text-zinc-200 group-hover:text-white'
                                  }`}
                                >
                                  {dept.name}
                                </span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/5">
                                  {dept.floor}
                                </span>
                              </div>
                              <span className="text-[10px] text-zinc-400 font-normal mt-0.5 leading-snug">
                                {dept.subTitle}
                              </span>
                            </div>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-[#c9b8a0] mt-0.5 flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  active
                    ? 'bg-gradient-to-b from-white to-zinc-200 text-black font-semibold shadow-[0_2px_12px_rgba(255,255,255,0.25)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
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

        {/* Right: Requisition Basket, User Identity, Direct Logout */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          {/* Notification Center Trigger & Popup Panel */}
          <NotificationCenter />

          {/* Requisition Basket Shortcut (Student borrower persona only) */}
          {role === 'Student' && (
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
          )}

          <div className="h-3.5 w-px bg-white/10 hidden sm:block" />

          {/* Current User Identity & Quick Switcher */}
          <div className="relative hidden lg:block" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#a78b71]/40 transition-all backdrop-blur-md shadow-sm cursor-pointer group select-none"
              title="Click to peek or switch between accounts"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#a78b71]/35 to-[#e8d5b7]/20 border border-[#c9b8a0]/30 flex items-center justify-center text-[10px] font-semibold text-[#f5e6c8] tracking-tight select-none">
                {getUserInitials(currentUser?.name || role)}
              </div>
              <span className="font-medium text-white/90 text-xs tracking-tight">
                {currentUser?.name || role}
              </span>
              <span className="text-[10px] font-medium text-[#c9b8a0] bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/10">
                {role}
              </span>
              <ChevronDown className={`w-3 h-3 text-zinc-400 group-hover:text-white transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-[#0c0d12]/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#c9b8a0]">
                    Peek Into Accounts
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Instantly view workspace from any persona
                  </p>
                </div>

                <div className="space-y-1">
                  {[
                    { roleName: 'Student', name: 'Ishaan Chand', prn: '25070126076', desc: 'SE Lead • AIML Bench' },
                    { roleName: 'Faculty', name: 'Dr. Manoj Patil', prn: 'T100460', desc: 'Faculty Supervisor Desk' },
                    { roleName: 'Lab Assistant', name: 'Ramesh Patil', prn: 'N10001', desc: 'Counter Desk 2 • Dispatch' },
                    { roleName: 'HoD / Admin', name: 'Dr. Sumit Kumar', prn: 'T100101', desc: 'Department Executive' },
                  ].map((p) => {
                    const isCurrent = (currentUser?.prn === p.prn) || (role === p.roleName && !currentUser?.prn);
                    return (
                      <button
                        key={p.roleName}
                        type="button"
                        onClick={() => {
                          switchRole(p.roleName);
                          setIsUserMenuOpen(false);
                          if (p.roleName === 'Student') navigate('/workspace/projects');
                          else if (p.roleName === 'Faculty') navigate('/workspace/operations/approvals');
                          else if (p.roleName === 'Lab Assistant') navigate('/workspace/operations/dispatch');
                          else if (p.roleName === 'HoD / Admin') navigate('/workspace/operations/approvals');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                          isCurrent
                            ? 'bg-white/10 text-white font-semibold border border-[#c9b8a0]/40'
                            : 'text-zinc-300 hover:bg-white/[0.05] hover:text-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-white">{p.name}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/[0.06] text-[#c9b8a0]">
                              {p.roleName}
                            </span>
                          </div>
                          <div className="text-[10px] text-zinc-400 mt-0.5">{p.desc}</div>
                        </div>
                        {isCurrent && <Check className="w-4 h-4 text-[#c9b8a0] flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Direct Logout Action */}
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/10 hover:border-white/20 text-xs font-sans text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm group"
            title="Log out of LabTrack"
          >
            <LogOut className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
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
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 cursor-pointer ${
                active
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white bg-white/[0.04]'
              }`}
            >
              <span className="whitespace-nowrap">{item.label}</span>
              {typeof item.count === 'number' && (
                <span className="text-[10px] opacity-75">({item.count})</span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}

export default TopHeader;
