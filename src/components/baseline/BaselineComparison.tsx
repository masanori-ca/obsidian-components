import { motion } from 'framer-motion';

interface ComparisonEntry {
  variable: string;
  valueA: number;
  valueB: number;
  unit?: string;
}

interface BaselineComparisonProps {
  versionA: string;
  versionB: string;
  entries: ComparisonEntry[];
  showOnlyDiffs?: boolean;
}

/**
 * Side-by-side comparison of two baseline versions.
 * Highlights significant differences.
 */
export function BaselineComparison({ versionA, versionB, entries, showOnlyDiffs = false }: BaselineComparisonProps) {
  const displayed = showOnlyDiffs
    ? entries.filter((e) => Math.abs(e.valueA - e.valueB) / Math.abs(e.valueA || 1) > 0.01)
    : entries;

  return (
    <div className="obs-card overflow-hidden">
      <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--obs-border-primary)' }}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold obs-text-primary">ベースライン比較</h3>
          <span className="text-[10px] obs-text-muted">{displayed.length}変数</span>
        </div>
      </div>

      {/* Header row */}
      <div className="grid grid-cols-4 px-4 py-2 text-[9px] obs-text-muted uppercase" style={{ backgroundColor: 'var(--obs-bg-secondary)' }}>
        <span>変数</span>
        <span className="text-right">{versionA}</span>
        <span className="text-right">{versionB}</span>
        <span className="text-right">差分</span>
      </div>

      <div className="max-h-[350px] overflow-y-auto">
        {displayed.map((entry, idx) => {
          const diff = entry.valueB - entry.valueA;
          const diffPct = entry.valueA !== 0 ? (diff / Math.abs(entry.valueA)) * 100 : 0;
          const isSignificant = Math.abs(diffPct) > 5;

          return (
            <motion.div
              key={entry.variable}
              className="grid grid-cols-4 px-4 py-2 items-center"
              style={{
                backgroundColor: isSignificant ? 'var(--obs-warning-bg)' : 'transparent',
                borderBottom: '1px solid var(--obs-border-subtle)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: Math.min(idx * 0.01, 0.2) }}
            >
              <span className="text-[11px] font-mono obs-text-primary truncate">{entry.variable}</span>
              <span className="text-[11px] font-mono obs-text-secondary text-right">{entry.valueA.toFixed(3)}</span>
              <span className="text-[11px] font-mono obs-text-secondary text-right">{entry.valueB.toFixed(3)}</span>
              <span className={`text-[11px] font-mono text-right font-bold ${
                Math.abs(diffPct) > 10 ? 'text-red-400' : Math.abs(diffPct) > 5 ? 'text-amber-400' : 'obs-text-muted'
              }`}>
                {diffPct > 0 ? '+' : ''}{diffPct.toFixed(1)}%
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
