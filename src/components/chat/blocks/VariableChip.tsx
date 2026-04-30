import { motion } from 'framer-motion';

interface VariableChipProps {
  symbol: string;
  value?: number;
  unit?: string;
  baseline?: number;
  source?: 'PCK' | 'TK' | 'Surrogate' | 'PDS';
  onClick?: () => void;
}

const SOURCE_STYLES: Record<string, { bg: string; color: string }> = {
  PCK:       { bg: 'rgba(56,189,248,0.12)', color: '#38bdf8' },
  TK:        { bg: 'rgba(167,139,250,0.12)', color: '#a78bfa' },
  Surrogate: { bg: 'rgba(251,191,36,0.12)', color: '#fbbf24' },
  PDS:       { bg: 'rgba(52,211,153,0.12)', color: '#34d399' },
};

/**
 * Inline variable chip for embedding within chat text.
 * Shows symbol, current value, unit, and optional deviation from baseline.
 */
export function VariableChip({ symbol, value, unit, baseline, source, onClick }: VariableChipProps) {
  const deviationPct = value !== undefined && baseline
    ? ((value - baseline) / Math.abs(baseline)) * 100
    : null;

  const srcStyle = source ? SOURCE_STYLES[source] ?? SOURCE_STYLES.PCK : null;

  return (
    <motion.button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] align-middle transition-colors"
      style={{
        backgroundColor: srcStyle?.bg ?? 'var(--obs-bg-tertiary)',
        border: `1px solid ${srcStyle ? `${srcStyle.color}33` : 'var(--obs-border-subtle)'}`,
      }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Source dot */}
      {srcStyle && (
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: srcStyle.color }} />
      )}

      {/* Symbol */}
      <span className="font-mono font-bold" style={{ color: srcStyle?.color ?? 'var(--obs-accent)' }}>
        {symbol}
      </span>

      {/* Value */}
      {value !== undefined && (
        <span className="font-mono obs-text-secondary">
          {value.toFixed(value < 1 ? 3 : value < 100 ? 2 : 1)}
        </span>
      )}

      {/* Unit */}
      {unit && <span className="obs-text-muted">{unit}</span>}

      {/* Deviation */}
      {deviationPct !== null && Math.abs(deviationPct) > 1 && (
        <span
          className="font-mono font-bold"
          style={{
            color: Math.abs(deviationPct) > 20 ? 'var(--obs-danger)' :
                   Math.abs(deviationPct) > 5 ? 'var(--obs-warning)' : 'var(--obs-text-muted)',
          }}
        >
          {deviationPct > 0 ? '+' : ''}{deviationPct.toFixed(1)}%
        </span>
      )}
    </motion.button>
  );
}
