import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Bell,
  X,
} from 'lucide-react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, message, type = 'info', duration = 4500 }) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast = { id, title, message, type };

    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-[#c9b8a0] flex-shrink-0" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-zinc-300 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-[#c9b8a0] flex-shrink-0" />;
      case 'info':
      default:
        return <Bell className="w-4 h-4 text-[#c9b8a0] flex-shrink-0" />;
    }
  };

  return (
    <NotificationContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Luxury Toast Render Overlay */}
      <div className="fixed top-20 right-5 z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-2xl transition-all duration-300 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-4 ${
              toast.type === 'success'
                ? 'bg-[#141416]/95 border-[#c9b8a0]/35 text-[#f5e6c8]'
                : toast.type === 'error'
                ? 'bg-[#141416]/95 border-white/20 text-white'
                : toast.type === 'warning'
                ? 'bg-[#141416]/95 border-[#c9b8a0]/35 text-[#f5e6c8]'
                : 'bg-[#0c0d14]/95 border-white/15 text-zinc-100'
            }`}
          >
            <div className="mt-0.5">{getToastIcon(toast.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="font-semibold text-xs tracking-tight text-white">
                  {toast.title || (toast.type === 'error' ? 'System Alert' : 'Notification')}
                </span>
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="text-zinc-400 hover:text-white p-0.5 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                  title="Dismiss notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {toast.message && (
                <div className="text-xs font-normal text-zinc-300 leading-relaxed">
                  {toast.message}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
