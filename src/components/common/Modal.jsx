import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-2xl' }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog Surface */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${maxWidth} bg-[#111215]/95 border border-white/15 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.85)] z-10 overflow-hidden transform transition-all backdrop-blur-2xl text-white`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight font-display">{title}</h3>
            {subtitle && <p className="text-xs text-zinc-400 mt-0.5 font-normal">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-white/10 hover:border-white/25 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
