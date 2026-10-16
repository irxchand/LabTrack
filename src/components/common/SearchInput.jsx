import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search nomenclature, SKU, manufacturer, or coordinates (Press "/" to focus)...',
  className = '',
  debounceMs = 200,
}) {
  const [internalValue, setInternalValue] = useState(value || '');
  const inputRef = useRef(null);

  // Sync internal state with external value
  useEffect(() => {
    setInternalValue(value || '');
  }, [value]);

  // Debounced notification
  useEffect(() => {
    const handler = setTimeout(() => {
      if (internalValue !== value) {
        onChange(internalValue);
      }
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [internalValue, debounceMs, onChange, value]);

  // Keyboard shortcut: "/" to focus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        setInternalValue('');
        onChange('');
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onChange]);

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="absolute left-3.5 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-10 py-1.5 bg-white/[0.04] border border-white/10 rounded-full text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#c9b8a0] transition-all font-sans"
      />
      <div className="absolute right-3 flex items-center gap-1.5">
        {internalValue ? (
          <button
            onClick={() => {
              setInternalValue('');
              onChange('');
              inputRef.current?.focus();
            }}
            className="p-0.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Clear search"
          >
            <X className="w-3 h-3" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 bg-white/[0.04] border border-white/10 rounded-full select-none">
            /
          </kbd>
        )}
      </div>
    </div>
  );
}
