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
      <Search className="absolute left-3 w-4 h-4 text-zinc-500 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-14 py-1.5 bg-zinc-900 border border-zinc-700/80 rounded-md text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-colors font-sans"
      />
      <div className="absolute right-2 flex items-center gap-1.5">
        {internalValue ? (
          <button
            onClick={() => {
              setInternalValue('');
              onChange('');
              inputRef.current?.focus();
            }}
            className="p-1 text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 bg-zinc-800 border border-zinc-700 rounded select-none">
            /
          </kbd>
        )}
      </div>
    </div>
  );
}
