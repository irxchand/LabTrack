import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLabData } from '../../context/LabDataContext';
import {
  Boxes,
  Cpu,
  Package,
  Clock,
  Inbox,
  BookmarkCheck,
  ShieldCheck,
  FileText,
  FolderGit2,
  CheckSquare,
  Terminal,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Lock,
  Sparkles,
} from 'lucide-react';

export function NavigationRail() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { role } = useAuth();
  const { inventory, activeLoans, requisitions, reservations, defects } = useLabData();

  const navSections = [
    {
      title: 'HARDWARE WORKSPACE',
      items: [
        {
          label: 'Hardware Depot',
          to: '/workspace/inventory',
          icon: Boxes,
          exact: true,
          count: inventory.length,
        },
        {
          label: 'Assets (Serialized)',
          to: '/workspace/inventory/assets',
          icon: Cpu,
          count: inventory.filter((i) => i.classification === 'Asset').length,
        },
        {
          label: 'Consumables & Stock',
          to: '/workspace/inventory/consumables',
          icon: Package,
          count: inventory.filter((i) => i.classification === 'Consumable').length,
        },
      ],
    },
    {
      title: 'CIRCULATION',
      items: [
        {
          label: 'Active Loans',
          to: '/workspace/custody/active',
          icon: Clock,
          count: activeLoans.length,
        },
        {
          label: 'Requisitions',
          to: '/workspace/custody/requests',
          icon: Inbox,
          count: requisitions.length,
        },
        {
          label: 'FIFO Queue',
          to: '/workspace/custody/reservations',
          icon: BookmarkCheck,
          count: reservations.length,
        },
      ],
    },
    {
      title: 'ACCOUNTABILITY',
      items: [
        {
          label: 'Reliability Desk',
          to: '/workspace/accountability/reliability',
          icon: ShieldCheck,
        },
        {
          label: 'Audit Trail',
          to: '/workspace/accountability/audit-log',
          icon: FileText,
          requiredRoles: ['Lab Assistant', 'HoD / Admin'],
        },
      ],
    },
    {
      title: 'ACADEMICS',
      items: [
        {
          label: 'Project Profiles',
          to: '/workspace/projects/overview',
          icon: FolderGit2,
        },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        {
          label: 'Faculty Approvals',
          to: '/workspace/operations/approvals',
          icon: CheckSquare,
          requiredRoles: ['Faculty', 'HoD / Admin'],
        },
        {
          label: 'Dispatch Terminal',
          to: '/workspace/operations/dispatch',
          icon: Terminal,
          requiredRoles: ['Lab Assistant', 'HoD / Admin'],
        },
        {
          label: 'Defect Triage',
          to: '/workspace/operations/defects',
          icon: Wrench,
          count: defects.length,
          requiredRoles: ['Faculty', 'Lab Assistant', 'HoD / Admin'],
        },
      ],
    },
  ];

  return (
    <aside
      className={`h-[calc(100vh-4rem)] bg-[#0a0a0a] border-r border-white/10 flex flex-col justify-between transition-all duration-300 z-30 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {navSections.map((section) => {
          // Filter items based on user role
          const visibleItems = section.items.filter((item) => {
            if (!item.requiredRoles) return true;
            return item.requiredRoles.includes(role);
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 text-[10px] font-inter uppercase tracking-[0.2em] font-semibold text-zinc-500 mb-1.5">
                  {section.title}
                </div>
              )}

              {section.items.map((item) => {
                const Icon = item.icon;
                const isRestricted =
                  item.requiredRoles && !item.requiredRoles.includes(role);

                if (isRestricted) {
                  return (
                    <div
                      key={item.label}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-600 cursor-not-allowed opacity-50 ${
                        isCollapsed ? 'justify-center' : ''
                      }`}
                      title={`Restricted: Requires ${item.requiredRoles?.join(' or ')}`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {!isCollapsed && (
                        <div className="flex-1 flex items-center justify-between truncate">
                          <span className="truncate">{item.label}</span>
                          <Lock className="w-3 h-3 text-zinc-600" />
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    end={item.exact}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-inter transition-neural group relative ${
                        isActive
                          ? 'bg-[#a78b71]/15 text-[#e8d5b7] font-semibold border border-[#a78b71]/30 shadow-sm'
                          : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                      } ${isCollapsed ? 'justify-center' : ''}`
                    }
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110" />
                    {!isCollapsed && (
                      <div className="flex-1 flex items-center justify-between truncate">
                        <span className="truncate">{item.label}</span>
                        {item.count !== undefined && item.count > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-sans font-bold bg-white/10 text-zinc-300">
                            {item.count}
                          </span>
                        )}
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-inter uppercase font-bold tracking-wider bg-[#a78b71] text-black">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Footer: Node Status & Collapse Toggle */}
      <div className="p-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-500">
        {!isCollapsed && (
          <div className="flex items-center gap-2 text-[11px] font-sans">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-400 font-medium">Node L2-A Cluster</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors ${
            isCollapsed ? 'w-full flex justify-center' : ''
          }`}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}

export default NavigationRail;
