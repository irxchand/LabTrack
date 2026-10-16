import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLabData } from '../../context/LabDataContext';
import { CommandPalette } from '../common/CommandPalette';
import {
  ShoppingBag,
  ChevronDown,
  Search,
  Sparkles,
  Check,
  LogOut,
  Radio,
} from 'lucide-react';

export function TopHeader() {
  const navigate = useNavigate();
  const { currentUser, role, switchRole, logout } = useAuth();
  const { basket, setIsBasketOpen } = useLabData();
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

  return (
    <>
      <header className="h-16 bg-[#0a0a0a]/90 backdrop-blur-[10px] border-b border-white/10 px-6 flex items-center justify-between z-40 relative">
        {/* Left: Brand & Institutional Context */}
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/workspace')}
          >
            <span className="font-playfair text-xl font-bold italic text-white tracking-tight">
              LabTrack
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#a78b71] shadow-[0_0_8px_#a78b71]" />
          </div>

          <div className="h-3.5 w-px bg-white/10 hidden md:block" />

          <div className="hidden md:flex items-center gap-2 text-xs font-inter text-zinc-400">
            <span>DEPT:</span>
            <span className="text-zinc-200 font-medium">Artificial Intelligence & Machine Learning</span>
          </div>

          <div className="h-3.5 w-px bg-white/10 hidden lg:block" />

          {/* Identity Tag (PRN / Staff ID) */}
          <div className="hidden lg:flex items-center font-mono text-xs text-[#c9b8a0]">
            {role === 'Student' && <span>PRN: {currentUser?.prn || '202401048'}</span>}
            {role === 'Faculty' && <span>FACULTY: Dr. A. Dalvi</span>}
            {role === 'Lab Assistant' && <span>STAFF ID: LA-04</span>}
            {role === 'HoD / Admin' && <span>AUDITOR: HOD-AIML-001</span>}
          </div>
        </div>

        {/* Center: Command Palette Trigger */}
        <div className="flex-1 max-w-md mx-4 hidden sm:block">
          <button
            onClick={() => setIsCommandOpen(true)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-zinc-400 hover:text-white transition-neural group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#a78b71] transition-colors" />
              <span>Search hardware, PRNs, or type a command...</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[10px] text-zinc-500">
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-300">⌘K</span>
            </div>
          </button>
        </div>

        {/* Right: Quick Role Switcher, Basket */}
        <div className="flex items-center gap-3">

          {/* Requisition Basket Shortcut */}
          <button
            onClick={() => setIsBasketOpen(true)}
            className="relative p-2 rounded-full glass-neural hover:border-[#a78b71]/50 text-white transition-neural"
            title="Open Requisition Basket"
          >
            <ShoppingBag className="w-4 h-4 text-[#c9b8a0]" />
            {basket.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#a78b71] text-black text-[10px] font-bold flex items-center justify-center">
                {basket.length}
              </span>
            )}
          </button>

          <div className="h-3.5 w-px bg-white/10" />

          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-neural hover:border-[#a78b71]/40 text-xs font-inter text-white transition-neural"
            >
              <span className="w-2 h-2 rounded-full bg-[#a78b71] animate-pulse" />
              <span className="text-zinc-400 text-[11px] uppercase tracking-wider">Role:</span>
              <span className="font-semibold text-white">{role}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {isRoleDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsRoleDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-72 glass-neural central-glow rounded-2xl py-2 z-50 overflow-hidden border border-white/15 bg-[#0a0a0a]">
                  <div className="px-4 py-2 text-[10px] font-inter uppercase tracking-widest text-[#c9b8a0] border-b border-white/10 flex items-center justify-between">
                    <span>Institutional Persona</span>
                    <span className="text-[#a78b71]">1-Click Switch</span>
                  </div>

                  <div className="p-1.5 space-y-1">
                    {demoRoles.map((item) => (
                      <button
                        key={item.role}
                        onClick={() => {
                          switchRole(item.role);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-neural ${
                          role === item.role
                            ? 'bg-[#a78b71]/20 text-white font-medium border border-[#a78b71]/30'
                            : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="font-semibold text-white flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#a78b71]" />
                            {item.label}
                          </div>
                          <div className="text-[11px] font-mono text-zinc-500 truncate mt-0.5">
                            {item.name} • {item.badge}
                          </div>
                        </div>
                        {role === item.role && (
                          <Check className="w-4 h-4 text-[#a78b71] flex-shrink-0 ml-2" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="px-3 py-2 border-t border-white/10 mt-1">
                    <button
                      onClick={() => {
                        logout();
                        navigate('/login');
                      }}
                      className="w-full text-left px-2 py-1.5 text-xs text-rose-400 hover:text-rose-300 font-inter flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log out to Persona Select</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />
    </>
  );
}

export default TopHeader;
