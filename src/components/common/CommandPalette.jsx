import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLabData } from '../../context/LabDataContext';
import {
  Search,
  Cpu,
  Boxes,
  Clock,
  Inbox,
  BookmarkCheck,
  ShieldCheck,
  FileText,
  CheckSquare,
  Terminal,
  Wrench,
  UserCheck,
  ShoppingBag,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export function CommandPalette({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { role, switchRole } = useAuth();
  const { inventory, setIsBasketOpen } = useLabData();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Command items
  const navigationActions = [
    { id: 'nav-inv', label: 'Go to Master Inventory Registry', icon: Boxes, category: 'Navigation', shortcut: 'G I', run: () => navigate('/workspace/inventory') },
    { id: 'nav-assets', label: 'Go to Serialized Assets (MCUs & Test Gear)', icon: Cpu, category: 'Navigation', shortcut: 'G A', run: () => navigate('/workspace/inventory/assets') },
    { id: 'nav-loans', label: 'Go to Active Loans & Custody', icon: Clock, category: 'Navigation', shortcut: 'G L', run: () => navigate('/workspace/custody/active') },
    { id: 'nav-reqs', label: 'Go to Pending Requisitions & Status', icon: Inbox, category: 'Navigation', shortcut: 'G R', run: () => navigate('/workspace/custody/requests') },
    { id: 'nav-fifo', label: 'Go to FIFO Reservation Waitlist', icon: BookmarkCheck, category: 'Navigation', shortcut: 'G Q', run: () => navigate('/workspace/custody/reservations') },
    { id: 'nav-rel', label: 'Go to Accountability & Reliability Scorecard', icon: ShieldCheck, category: 'Navigation', shortcut: 'G S', run: () => navigate('/workspace/accountability/reliability') },
    { id: 'nav-audit', label: 'Go to Immutable Audit Log', icon: FileText, category: 'Navigation', run: () => navigate('/workspace/accountability/audit-log') },
    { id: 'nav-approvals', label: 'Go to Faculty Supervisor Review Desk', icon: CheckSquare, category: 'Navigation', run: () => navigate('/workspace/operations/approvals') },
    { id: 'nav-dispatch', label: 'Go to Lab Assistant Dispatch Terminal', icon: Terminal, category: 'Navigation', run: () => navigate('/workspace/operations/dispatch') },
    { id: 'nav-defects', label: 'Go to Defect Triage & Repair Bench', icon: Wrench, category: 'Navigation', run: () => navigate('/workspace/operations/defects') },
  ];

  const roleActions = [
    { id: 'role-student', label: 'Switch Role to Student (Aryan Sharma • 202401048)', icon: UserCheck, category: 'Role Switcher', run: () => switchRole('Student') },
    { id: 'role-faculty', label: 'Switch Role to Faculty Mentor (Prof. Sneha Kulkarni)', icon: UserCheck, category: 'Role Switcher', run: () => switchRole('Faculty') },
    { id: 'role-assistant', label: 'Switch Role to Lab Assistant (Ramesh Patil)', icon: UserCheck, category: 'Role Switcher', run: () => switchRole('Lab Assistant') },
    { id: 'role-admin', label: 'Switch Role to HoD / Admin (Dr. K. V. Ramanathan)', icon: UserCheck, category: 'Role Switcher', run: () => switchRole('HoD / Admin') },
  ];

  const quickActions = [
    { id: 'act-basket', label: 'Open Requisition Basket Drawer', icon: ShoppingBag, category: 'Actions', shortcut: 'B', run: () => setIsBasketOpen(true) },
  ];

  // Asset search items
  const assetItems = inventory.map((item) => ({
    id: `asset-${item.id}`,
    label: `${item.nomenclature} (${item.assetTag})`,
    sub: `${item.coordinates} • ${item.stockStatus} • ${item.manufacturer}`,
    icon: Cpu,
    category: 'Hardware Assets',
    run: () => navigate(`/workspace/inventory/${item.id}`),
  }));

  const allItems = [...quickActions, ...navigationActions, ...roleActions, ...assetItems];

  const filteredItems = query.trim()
    ? allItems.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()) ||
          (item.sub && item.sub.toLowerCase().includes(query.toLowerCase()))
      )
    : allItems.slice(0, 16);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].run();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredItems, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Spotlight Window */}
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/15 rounded-3xl central-glow shadow-2xl overflow-hidden z-10 flex flex-col max-h-[580px]">
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-white/10 bg-white/[0.02]">
          <Search className="w-5 h-5 text-[#a78b71] mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search hardware inventory..."
            className="w-full bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none font-inter"
          />
          <div className="flex items-center gap-1.5 ml-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-zinc-400">ESC</span>
          </div>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-white/[0.04]">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs font-inter text-zinc-500">
              No commands or hardware items match "{query}".
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.run();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-2xl cursor-pointer transition-neural ${
                    isSelected
                      ? 'bg-[#a78b71]/15 text-white border border-[#a78b71]/30 shadow-sm'
                      : 'text-zinc-400 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-xl transition-neural ${
                        isSelected
                          ? 'bg-[#a78b71] text-black shadow-sm'
                          : 'bg-white/[0.06] text-zinc-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate font-inter">
                        {item.label}
                      </div>
                      {item.sub && (
                        <div className="text-[11px] font-mono text-zinc-500 truncate mt-0.5">
                          {item.sub}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    <span className="text-[10px] font-inter uppercase tracking-wider text-zinc-500">
                      {item.category}
                    </span>
                    {item.shortcut && (
                      <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-zinc-300">{item.shortcut}</span>
                    )}
                    {isSelected && (
                      <ArrowRight className="w-3.5 h-3.5 text-[#a78b71]" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="px-5 py-3 border-t border-white/10 bg-white/[0.01] flex items-center justify-between text-[11px] font-inter text-zinc-500">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono mr-1">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono mr-1">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono mr-1">↵</kbd> to select
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[#c9b8a0]">
            <Sparkles className="w-3 h-3 text-[#a78b71]" />
            <span>LabTrack Command Matrix</span>
          </div>
        </div>
      </div>
    </div>
  );
}
