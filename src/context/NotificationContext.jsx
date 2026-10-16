import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, message, type = 'info', duration = 4000 }) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast = { id, title, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Toast Render Overlay */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-md border shadow-2xl backdrop-blur-md transition-all text-sm flex flex-col gap-0.5 ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-700/60 text-emerald-100'
                : toast.type === 'error'
                ? 'bg-red-950/90 border-red-700/60 text-red-100'
                : toast.type === 'warning'
                ? 'bg-amber-950/90 border-amber-700/60 text-amber-100'
                : 'bg-zinc-900/90 border-zinc-700/60 text-zinc-100'
            }`}
          >
            <div className="flex items-center justify-between font-semibold tracking-tight text-xs uppercase opacity-90">
              <span>{toast.title || (toast.type === 'error' ? 'System Error' : 'System Event')}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-xs opacity-60 hover:opacity-100 px-1 font-mono"
              >
                ✕
              </button>
            </div>
            <div className="text-xs font-normal opacity-90 mt-0.5 leading-relaxed">{toast.message}</div>
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
