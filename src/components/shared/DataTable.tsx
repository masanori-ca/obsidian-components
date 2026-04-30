import { useState } from 'react';
import { motion } from 'framer-motion';

interface Column<T> {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  rowKey: string;
  onRowClick?: (row: T) => void;
  selectedRowKey?: string | null;
  maxHeight?: string;
  isLoading?: boolean;
  emptyMessage?: string;
}

type SortDir = 'asc' | 'desc';

/**
 * Reusable data table with sorting, selection, and loading states.
 * Uses CSS variables for Day/Night theming.
 */
export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  onRowClick,
  selectedRowKey,
  maxHeight = '400px',
  isLoading = false,
  emptyMessage = 'データがありません',
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortedData = sortKey
    ? [...data].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        const cmp = String(aVal ?? '').localeCompare(String(bVal ?? ''), undefined, { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : data;

  return (
    <div className="obs-card overflow-hidden">
      <div className="overflow-x-auto" style={{ maxHeight }}>
        <table className="w-full text-xs">
          <thead>
            <tr style={{ backgroundColor: 'var(--obs-bg-secondary)' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-3 py-2.5 font-semibold obs-text-muted uppercase text-[9px] tracking-wider ${
                    col.sortable ? 'cursor-pointer select-none hover:obs-text-secondary' : ''
                  }`}
                  style={{
                    textAlign: col.align ?? 'left',
                    width: col.width,
                    borderBottom: '1px solid var(--obs-border-primary)',
                  }}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      <span className="text-[8px]">{sortDir === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center">
                  <motion.div
                    className="w-5 h-5 border-2 border-t-transparent rounded-full mx-auto"
                    style={{ borderColor: 'var(--obs-accent)' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center obs-text-muted">{emptyMessage}</td>
              </tr>
            ) : (
              sortedData.map((row, idx) => {
                const key = String(row[rowKey]);
                const isSelected = key === selectedRowKey;
                return (
                  <motion.tr
                    key={key}
                    onClick={() => onRowClick?.(row)}
                    className={onRowClick ? 'cursor-pointer' : ''}
                    style={{
                      backgroundColor: isSelected ? 'var(--obs-accent-bg)' : 'transparent',
                      borderBottom: '1px solid var(--obs-border-subtle)',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(idx * 0.01, 0.2) }}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-3 py-2 obs-text-secondary"
                        style={{ textAlign: col.align ?? 'left' }}
                      >
                        {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                      </td>
                    ))}
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
