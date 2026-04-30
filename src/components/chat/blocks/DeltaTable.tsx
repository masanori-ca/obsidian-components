import { motion } from 'framer-motion';
import type { WhatIfDelta } from '@/lib/pck-client';

interface DeltaTableProps {
  title?: string;
  overrides: Record<string, number>;
  deltas: Record<string, WhatIfDelta>;
  cbfPassed?: boolean;
  maxRows?: number;
}

/**
 * What-If delta comparison table for chat messages.
 * Shows before → after with color-coded change percentages.
 */
export function DeltaTable({ title = 'What-If 影響分析', overrides, deltas, cbfPassed, maxRows = 8 }: DeltaTableProps) {
  const sorted = Object.entries(deltas)
    .sort(([, a], [, b]) => Math.abs(b.delta_pct) - Math.abs(a.delta_pct))
    .slice(0, maxRows);

  return (
    <motion.div
      className="rounded-lg overflow-hidden my-2"
      style={{ border: '1px solid var(--obs-border-secondary)', backgroundColor: 'var(--obs-bg-secondary)' }}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5" style={{ borderBottom: '1px solid var(--obs-border-subtle)' }}>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--obs-accent-bg)', color: 'var(--obs-accent)' }}>
            W-I
          </span>
          <span className="text-[11px] font-medium obs-text-primary">{title}</span>
        </div>
        {cbfPassed !== undefined && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{
            backgroundColor: cbfPassed ? 'var(--obs-success-bg)' : 'var(--obs-danger-bg)',
            color: cbfPassed ? 'var(--obs-success)' : 'var(--obs-danger)',
          }}>
            CBF {cbfPassed ? 'PASS' : 'BLOCK'}
          </span>
        )}
      </div>

      {/* Overrides */}
      <div className="px-3 py-1.5 flex flex-wrap gap-1" style={{ borderBottom: '1px solid var(--obs-border-subtle)', backgroundColor: 'var(--obs-accent-bg)' }}>
        <span className="text-[9px] obs-text-muted">変更:</span>
        {Object.entries(overrides).map(([k, v]) => (
          <span key={k} className="text-[9px] font-mono" style={{ color: 'var(--obs-accent)' }}>
            {k}={v}
          </span>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[10px]">
          <thead>
            <tr style={{ backgroundColor: 'var(--obs-bg-tertiary)' }}>
              <th className="px-3 py-1.5 text-left font-semibold obs-text-muted">変数</th>
              <th className="px-2 py-1.5 text-right font-semibold obs-text-muted">Before</th>
              <th className="px-2 py-1.5 text-right font-semibold obs-text-muted">After</th>
              <th className="px-3 py-1.5 text-right font-semibold obs-text-muted">変化</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(([variable, delta], idx) => {
              const absPct = Math.abs(delta.delta_pct);
              const color = absPct > 20 ? 'var(--obs-danger)' : absPct > 5 ? 'var(--obs-warning)' : 'var(--obs-text-muted)';

              return (
                <motion.tr
                  key={variable}
                  style={{ borderBottom: '1px solid var(--obs-border-subtle)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <td className="px-3 py-1.5 font-mono obs-text-secondary">{variable}</td>
                  <td className="px-2 py-1.5 text-right font-mono obs-text-muted">{delta.baseline.toFixed(2)}</td>
                  <td className="px-2 py-1.5 text-right font-mono obs-text-secondary">{delta.what_if.toFixed(2)}</td>
                  <td className="px-3 py-1.5 text-right font-mono font-bold" style={{ color }}>
                    {delta.delta_pct > 0 ? '+' : ''}{delta.delta_pct.toFixed(1)}%
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {Object.keys(deltas).length > maxRows && (
        <div className="px-3 py-1 text-[9px] obs-text-muted text-center" style={{ backgroundColor: 'var(--obs-bg-tertiary)' }}>
          +{Object.keys(deltas).length - maxRows} more variables
        </div>
      )}
    </motion.div>
  );
}
