import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

export function DataTable({
  columns,
  data,
  keyField = 'id',
  onRowClick,
  pageSize = 15,
  emptyMessage = 'No matching records found in institutional database.',
  isLoading = false,
  className = '',
}) {
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (columnKey) => {
    if (sortKey === columnKey) {
      if (sortOrder === 'asc') setSortOrder('desc');
      else {
        setSortKey(null);
        setSortOrder('asc');
      }
    } else {
      setSortKey(columnKey);
      setSortOrder('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }

      return sortOrder === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [data, sortKey, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  return (
    <div className={`w-full border border-white/10 rounded-2xl overflow-hidden glass-neural shadow-2xl ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02] text-zinc-400 font-inter uppercase text-[10px] tracking-wider select-none">
              {columns.map((col) => {
                const isSorted = sortKey === col.accessor;
                const canSort = col.sortable !== false && col.accessor;

                return (
                  <th
                    key={col.header}
                    onClick={() => canSort && handleSort(col.accessor)}
                    className={`px-4 py-3 font-semibold ${
                      canSort ? 'cursor-pointer hover:text-white hover:bg-white/[0.03]' : ''
                    } ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                    style={col.width ? { width: col.width } : {}}
                  >
                    <div
                      className={`inline-flex items-center gap-1.5 ${
                        col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'
                      }`}
                    >
                      <span>{col.header}</span>
                      {canSort && (
                        <span className="text-zinc-500">
                          {isSorted ? (
                            sortOrder === 'asc' ? (
                              <ChevronUp className="w-3.5 h-3.5 text-[#a78b71]" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-[#a78b71]" />
                            )
                          ) : (
                            <ChevronsUpDown className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-14 text-center text-zinc-400 font-mono text-xs">
                  <div className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#a78b71] animate-ping" />
                    Querying institutional relational datastore...
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-14 text-center text-[#62666d] font-mono text-xs">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr
                  key={row[keyField] || index}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`linear-row transition-all group ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.header}
                      className={`px-4 py-3 text-[#d1d5db] ${
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                      }`}
                    >
                      {col.render ? col.render(row) : row[col.accessor] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Status Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.08] bg-[#0a0b0e] text-xs text-[#8a8f98] font-mono">
        <div>
          Showing {sortedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} -{' '}
          {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} records
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] disabled:opacity-30 disabled:pointer-events-none text-[#d1d5db] transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] disabled:opacity-30 disabled:pointer-events-none text-[#d1d5db] transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
