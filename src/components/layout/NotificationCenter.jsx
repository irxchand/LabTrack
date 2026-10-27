import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLabData } from '../../context/LabDataContext';
import { useNotification } from '../../context/NotificationContext';
import {
  Bell,
  Check,
  CheckCheck,
  X,
  Inbox,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ShieldAlert,
  SlidersHorizontal,
  ExternalLink,
  Trash2,
} from 'lucide-react';

const READ_STORAGE_KEY = 'labtrack_read_notifications_v14';

export function NotificationCenter() {
  const navigate = useNavigate();
  const { currentUser, role } = useAuth();
  const { requisitions, activeLoans, defects } = useLabData();
  const { addToast } = useNotification();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread' | 'requisitions'
  const dropdownRef = useRef(null);

  // Stored set of read notification IDs
  const [readIds, setReadIds] = useState(() => {
    try {
      const saved = localStorage.getItem(READ_STORAGE_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Additional dynamic live notifications (e.g. from runtime events)
  const [runtimeNotifications, setRuntimeNotifications] = useState([]);

  // Save read set to localStorage
  const persistReadIds = (newSet) => {
    setReadIds(newSet);
    try {
      localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(Array.from(newSet)));
    } catch (e) {
      console.warn('Failed to save read notification IDs:', e);
    }
  };

  // Listen for real-time app notification events
  useEffect(() => {
    const handleNotificationEvent = (e) => {
      const detail = e.detail;
      if (!detail) return;
      const newNotif = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title: detail.title || 'Laboratory Event',
        message: detail.message || '',
        category: detail.category || 'requisitions',
        type: detail.type || 'info', // 'info' | 'success' | 'warning' | 'error'
        timestamp: new Date().toISOString(),
        link: detail.link || '/workspace/custody/requests',
        targetId: detail.targetId || null,
        metadata: detail.metadata || null,
      };

      setRuntimeNotifications((prev) => [newNotif, ...prev]);

      // Trigger instant toast popup as well!
      addToast({
        title: newNotif.title,
        message: newNotif.message,
        type: newNotif.type,
      });
    };

    window.addEventListener('labtrack-notification', handleNotificationEvent);
    return () => {
      window.removeEventListener('labtrack-notification', handleNotificationEvent);
    };
  }, [addToast]);

  // Close dropdown on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Format relative time helper
  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'Just now';
    try {
      const d = new Date(dateStr.replace(' ', 'T'));
      const diffMs = Date.now() - d.getTime();
      if (isNaN(diffMs)) return dateStr.split(' ')[0] || 'Recently';

      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  // Compute canonical notifications feed tailored to current user role
  const notifications = useMemo(() => {
    const list = [...runtimeNotifications];
    const isStudent = role === 'Student';
    const isFaculty = role === 'Faculty';
    const isAssistant = role === 'Lab Assistant';
    const isHoD = role === 'HoD / Admin';

    // 1. Ingest Requisitions based on role
    requisitions.forEach((req) => {
      const reqId = req.id || req.requestNumber;
      const compNames = (req.componentsRequested || [])
        .map((c) => `${c.nomenclature || 'Hardware Item'} (Qty: ${c.quantity || 1})`)
        .join(', ');
      const status = req.status || 'Pending Approval';
      const cleanStatus = status.toLowerCase();

      // STUDENT NOTIFICATIONS
      if (isStudent && (req.studentPrn === currentUser?.prn || req.borrowerPrn === currentUser?.prn)) {
        if (cleanStatus === 'rejected') {
          list.push({
            id: `req_rej_${reqId}`,
            title: `Requisition ${reqId} Declined`,
            message: req.supervisorNotes
              ? `Supervisor Feedback: "${req.supervisorNotes}"`
              : `Your request for ${compNames || 'hardware'} was declined by mentor.`,
            category: 'requisitions',
            type: 'error',
            status: 'Declined',
            timestamp: req.submittedDate || req.requestDate,
            link: '/workspace/custody/requests',
            targetId: reqId,
            itemDetails: compNames,
          });
        } else if (cleanStatus === 'faculty endorsed' || cleanStatus === 'approved') {
          list.push({
            id: `req_app_${reqId}`,
            title: `Requisition ${reqId} Endorsed`,
            message: `Faculty Mentor verified academic scope. Ready for Central Store dispatch.`,
            category: 'requisitions',
            type: 'success',
            status: 'Endorsed',
            timestamp: req.submittedDate || req.requestDate,
            link: '/workspace/custody/requests',
            targetId: reqId,
            itemDetails: compNames,
          });
        } else if (cleanStatus === 'ready for counter pickup' || cleanStatus === 'ready') {
          list.push({
            id: `req_rdy_${reqId}`,
            title: `Hardware Ready for Counter Pickup!`,
            message: `${compNames} staged at Department Counter 5CL-07. Present student ID to collect.`,
            category: 'requisitions',
            type: 'success',
            status: 'Ready for Pickup',
            timestamp: req.submittedDate || req.requestDate,
            link: '/workspace/custody/requests',
            targetId: reqId,
            itemDetails: compNames,
          });
        } else if (cleanStatus.includes('return') || cleanStatus.includes('restock')) {
          list.push({
            id: `req_ret_${reqId}`,
            title: `Requisition ${reqId} Completed & Restocked`,
            message: `${compNames || 'Hardware'} returned to depot and restocked. Custody cycle completed.`,
            category: 'requisitions',
            type: 'success',
            status: 'Returned & Restocked',
            timestamp: req.submittedDate || req.requestDate,
            link: '/workspace/custody/requests',
            targetId: reqId,
            itemDetails: compNames,
          });
        } else if (cleanStatus.includes('dispatch') || cleanStatus.includes('custody')) {
          list.push({
            id: `req_disp_${reqId}`,
            title: `Hardware Dispatched • In Your Custody`,
            message: `${compNames} collected from Counter Desk. Active custody logged.`,
            category: 'requisitions',
            type: 'info',
            status: 'Dispatched',
            timestamp: req.submittedDate || req.requestDate,
            link: '/workspace/custody/requests',
            targetId: reqId,
            itemDetails: compNames,
          });
        } else {
          list.push({
            id: `req_sub_${reqId}`,
            title: `Requisition ${reqId} Submitted`,
            message: `Proposal submitted for Faculty Mentor Review (${req.mentorName || 'Dr. Manoj Patil'}).`,
            category: 'requisitions',
            type: 'info',
            status: 'Pending Review',
            timestamp: req.submittedDate || req.requestDate,
            link: '/workspace/custody/requests',
            targetId: reqId,
            itemDetails: compNames,
          });
        }
      }

      // FACULTY NOTIFICATIONS
      if (isFaculty && (req.mentorId === currentUser?.prn || req.mentorName?.includes(currentUser?.name || 'Manoj Patil'))) {
        if (cleanStatus.includes('pending') || cleanStatus.includes('submitted') || cleanStatus === 'mentor review') {
          list.push({
            id: `fac_pending_${reqId}`,
            title: `Requisition ${reqId} Awaiting Your Review`,
            message: `${req.studentName || 'Student'} (${req.studentPrn || 'PRN'}) submitted ${compNames || 'hardware'} for project "${req.projectTitle || 'Curriculum Project'}".`,
            category: 'requisitions',
            type: 'warning',
            status: 'Action Required',
            timestamp: req.submittedDate || req.requestDate,
            link: '/workspace/operations/approvals',
            targetId: reqId,
            itemDetails: compNames,
          });
        }
      }

      // HOD NOTIFICATIONS
      if (isHoD) {
        if (cleanStatus.includes('endorsed')) {
          list.push({
            id: `hod_sanction_${reqId}`,
            title: `HoD Sanction Required: ${reqId}`,
            message: `Faculty Guide ${req.mentorName || 'Faculty'} endorsed ${compNames} for ${req.studentName} (${req.projectId}). Department sanction needed to release to Counter Desk.`,
            category: 'requisitions',
            type: 'warning',
            status: 'Sanction Required',
            timestamp: req.submittedDate || req.requestDate,
            link: '/workspace/operations/approvals',
            targetId: reqId,
            itemDetails: compNames,
          });
        } else if (cleanStatus === 'ready for counter pickup') {
          list.push({
            id: `hod_staged_${reqId}`,
            title: `Sanctioned & Staged: ${reqId}`,
            message: `${compNames} sanctioned and released to Counter Desk for student collection.`,
            category: 'requisitions',
            type: 'success',
            status: 'Sanctioned',
            timestamp: req.submittedDate || req.requestDate,
            link: '/workspace/operations/approvals',
            targetId: reqId,
            itemDetails: compNames,
          });
        } else if (cleanStatus === 'dispatched') {
          list.push({
            id: `hod_disp_${reqId}`,
            title: `Dispatched: ${reqId}`,
            message: `${compNames} successfully handed over to ${req.studentName} in active bench custody.`,
            category: 'requisitions',
            type: 'info',
            status: 'Dispatched',
            timestamp: req.submittedDate || req.requestDate,
            link: '/workspace/operations/approvals',
            targetId: reqId,
            itemDetails: compNames,
          });
        }
      }

      // LAB ASSISTANT NOTIFICATIONS
      if (isAssistant) {
        if (cleanStatus.includes('endorsed') || cleanStatus === 'ready for counter pickup') {
          list.push({
            id: `ast_dispatch_${reqId}`,
            title: cleanStatus === 'ready for counter pickup' ? `Ready for Handover: Requisition ${reqId}` : `Counter Staging Required: Requisition ${reqId}`,
            message: `Sanctioned for ${req.studentName || 'Student'} (${req.projectId || 'Project'}). Bind SIT serialized barcodes and prepare handover tray at Desk 2.`,
            category: 'requisitions',
            type: cleanStatus === 'ready for counter pickup' ? 'success' : 'info',
            status: cleanStatus === 'ready for counter pickup' ? 'Staged at Desk 2' : 'Counter Staging',
            timestamp: req.submittedDate || req.requestDate,
            link: '/workspace/operations/dispatch',
            targetId: reqId,
            itemDetails: compNames,
          });
        } else if (cleanStatus === 'dispatched') {
          list.push({
            id: `ast_dispatched_${reqId}`,
            title: `Handover Committed: ${reqId}`,
            message: `${compNames} checked out to PRN ${req.studentPrn}. Transaction committed into student custody.`,
            category: 'requisitions',
            type: 'success',
            status: 'Dispatched',
            timestamp: req.submittedDate || req.requestDate,
            link: '/workspace/operations/dispatch?mode=circulation',
            targetId: reqId,
            itemDetails: compNames,
          });
        }
      }
    });

    // 2. Ingest Active Loan Warnings (e.g. loans due in <= 3 days)
    if (isStudent) {
      activeLoans
        .filter((loan) => loan.borrowerPrn === currentUser?.prn)
        .forEach((loan) => {
          if (loan.daysRemaining <= 3) {
            list.push({
              id: `loan_due_${loan.id}`,
              title: loan.daysRemaining <= 0 ? `Loan Overdue Notice` : `Equipment Due Soon (${loan.daysRemaining}d remaining)`,
              message: `${loan.nomenclature || 'Asset'} [${loan.assetTag}] is due on ${loan.dueDate?.split(' ')[0] || 'soon'}. Please return to avoid reliability score deductions.`,
              category: 'loans',
              type: loan.daysRemaining <= 0 ? 'error' : 'warning',
              status: loan.daysRemaining <= 0 ? 'Overdue' : 'Due Soon',
              timestamp: loan.issueDate,
              link: '/workspace/custody/active',
              targetId: loan.id,
              itemDetails: `${loan.nomenclature} (${loan.assetTag})`,
            });
          }
        });
    }

    // Sort newest first
    return list.sort((a, b) => {
      const tA = new Date((a.timestamp || '').replace(' ', 'T')).getTime() || 0;
      const tB = new Date((b.timestamp || '').replace(' ', 'T')).getTime() || 0;
      return tB - tA;
    });
  }, [requisitions, activeLoans, currentUser, role, runtimeNotifications]);

  // Derived unread counts
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !readIds.has(n.id)).length;
  }, [notifications, readIds]);

  // Filtered list based on active tab
  const filteredNotifications = useMemo(() => {
    if (activeTab === 'unread') {
      return notifications.filter((n) => !readIds.has(n.id));
    }
    if (activeTab === 'requisitions') {
      return notifications.filter((n) => n.category === 'requisitions');
    }
    return notifications;
  }, [notifications, activeTab, readIds]);

  // Mark single notification as read
  const handleMarkAsRead = (id) => {
    const next = new Set(readIds);
    next.add(id);
    persistReadIds(next);
  };

  // Mark all currently visible notifications as read
  const handleMarkAllAsRead = () => {
    const next = new Set(readIds);
    notifications.forEach((n) => next.add(n.id));
    persistReadIds(next);
    addToast({
      title: 'Notifications Cleared',
      message: 'All notifications marked as read.',
      type: 'info',
    });
  };

  // Clear all notifications
  const handleClearAll = () => {
    const next = new Set(readIds);
    notifications.forEach((n) => next.add(n.id));
    persistReadIds(next);
    setRuntimeNotifications([]);
  };

  // Click on notification item
  const handleNotificationClick = (notif) => {
    handleMarkAsRead(notif.id);
    setIsOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  // Render contextual icon
  const getNotificationIcon = (notif) => {
    switch (notif.type) {
      case 'success':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm flex-shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case 'error':
        return (
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-sm flex-shrink-0">
            <XCircle className="w-4 h-4" />
          </div>
        );
      case 'warning':
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm flex-shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
        );
      case 'info':
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-sm flex-shrink-0">
            <Inbox className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ───────────────────────────────────────────────────────────── */}
      {/* BELL BUTTON IN TOP NAVBAR (Positioned where circled) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`relative p-2 rounded-full border transition-all duration-200 cursor-pointer ${
          isOpen
            ? 'bg-white/10 border-[#c9b8a0]/50 text-white shadow-[0_0_15px_rgba(201,184,160,0.25)]'
            : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-white'
        }`}
        title={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        aria-label="Open notifications center"
      >
        <Bell className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'scale-110 text-[#f5e6c8]' : 'text-[#c9b8a0]'}`} />

        {/* Dynamic Badge Counter */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-black text-[10px] font-extrabold flex items-center justify-center shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* LUXURY NOTIFICATIONS POPUP DROPDOWN PANEL */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2.5 w-[360px] sm:w-[410px] max-h-[540px] rounded-2xl bg-[#0c0d14]/95 backdrop-blur-2xl border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.85)] z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#a78b71]/30 to-[#f5e6c8]/10 border border-[#c9b8a0]/30 flex items-center justify-center text-[#f5e6c8]">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="font-semibold text-xs text-white tracking-tight flex items-center gap-2">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {unreadCount} new
                    </span>
                  )}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  className="px-2 py-1 rounded-lg text-[11px] font-medium text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors flex items-center gap-1 cursor-pointer"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-[#c9b8a0]" />
                  <span>Mark read</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                title="Close panel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Section Filter Tabs */}
          <div className="px-3 py-2 border-b border-white/5 flex items-center gap-1.5 bg-black/20">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('unread')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'unread'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('requisitions')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                activeTab === 'requisitions'
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              Requisitions
            </button>
          </div>

          {/* Scrollable Notification List */}
          <div className="flex-1 overflow-y-auto max-h-[380px] p-2 space-y-1.5 divide-y divide-white/[0.03]">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notif) => {
                const isRead = readIds.has(notif.id);
                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`group relative p-3 rounded-xl transition-all duration-150 cursor-pointer flex items-start gap-3 pt-3 ${
                      !isRead
                        ? 'bg-white/[0.04] hover:bg-white/[0.07] border border-white/10'
                        : 'hover:bg-white/[0.03] border border-transparent'
                    }`}
                  >
                    {/* Unread Accent Pill */}
                    {!isRead && (
                      <span className="absolute top-3.5 left-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                    )}

                    {/* Contextual Icon */}
                    <div className="pl-1 flex-shrink-0">
                      {getNotificationIcon(notif)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className={`text-xs font-semibold tracking-tight truncate ${!isRead ? 'text-white' : 'text-zinc-300'}`}>
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-zinc-500 whitespace-nowrap flex-shrink-0">
                          {formatTimeAgo(notif.timestamp)}
                        </span>
                      </div>

                      {notif.itemDetails && (
                        <div className="text-[11px] text-[#c9b8a0] font-medium line-clamp-1 mb-0.5">
                          {notif.itemDetails}
                        </div>
                      )}

                      <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>

                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className="inline-flex items-center gap-1 text-zinc-400 group-hover:text-[#f5e6c8] transition-colors">
                          <span>View record</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>

                        {!isRead && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notif.id);
                            }}
                            className="text-zinc-500 hover:text-zinc-300 px-1 py-0.5 rounded cursor-pointer"
                            title="Mark as read"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 px-6 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-zinc-500 mb-3">
                  <Sparkles className="w-5 h-5 text-[#c9b8a0]/60" />
                </div>
                <h4 className="text-xs font-semibold text-zinc-300 mb-1">All Caught Up</h4>
                <p className="text-[11px] text-zinc-500 max-w-[220px]">
                  {activeTab === 'unread'
                    ? 'No unread notifications to review.'
                    : 'You have no recent alerts or pending requisitions.'}
                </p>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-4 py-2.5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate(role === 'Faculty' ? '/workspace/operations/approvals' : '/workspace/custody/requests');
              }}
              className="text-[11px] font-medium text-[#c9b8a0] hover:text-[#f5e6c8] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>{role === 'Faculty' ? 'Open Approvals Desk' : 'Open Requisitions Feed'}</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 cursor-pointer"
                title="Clear all notifications"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;
