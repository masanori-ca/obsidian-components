import { motion } from 'framer-motion';

interface FormulaBlockProps {
  name: string;
  expression: string;
  inputVars?: Array<{ symbol: string; value?: number; unit?: string }>;
  outputVar?: { symbol: string; value?: number; unit?: string };
  source?: string;
  onVariableClick?: (symbol: string) => void;
}

/**
 * Rich formula display block for chat messages.
 * Shows equation name, rendered expression, and I/O variables with values.
 */
export function FormulaBlock({ name, expression, inputVars = [], outputVar, source, onVariableClick }: FormulaBlockProps) {
  return (
    <motion.div
      className="rounded-lg overflow-hidden my-2"
      style={{ border: '1px solid rgba(167,139,250,0.2)', backgroundColor: 'rgba(167,139,250,0.04)' }}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5" style={{ borderBottom: '1px solid rgba(167,139,250,0.1)' }}>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(167,139,250,0.15)', color: '#a78bfa' }}>
            EQ
          </span>
          <span className="text-[11px] font-medium" style={{ color: '#a78bfa' }}>{name}</span>
        </div>
        {source && <span className="text-[8px] obs-text-muted">{source}</span>}
      </div>

      {/* Expression */}
      <div className="px-3 py-2.5">
        <div className="text-sm font-mono obs-text-primary tracking-wide break-all leading-relaxed">
          {expression}
        </div>
      </div>

      {/* Variables */}
      {(inputVars.length > 0 || outputVar) && (
        <div className="px-3 py-2" style={{ borderTop: '1px solid rgba(167,139,250,0.1)', backgroundColor: 'rgba(167,139,250,0.02)' }}>
          <div className="flex flex-wrap gap-1.5">
            {inputVars.map((v) => (
              <button
                key={v.symbol}
                onClick={() => onVariableClick?.(v.symbol)}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] transition-colors"
                style={{ backgroundColor: 'var(--obs-bg-tertiary)', border: '1px solid var(--obs-border-subtle)' }}
              >
                <span className="font-mono font-medium" style={{ color: 'var(--obs-accent)' }}>{v.symbol}</span>
                {v.value !== undefined && (
                  <span className="obs-text-secondary font-mono">= {v.value.toFixed(2)}</span>
                )}
                {v.unit && <span className="obs-text-muted">{v.unit}</span>}
              </button>
            ))}
            {outputVar && (
              <>
                <span className="text-[10px] obs-text-muted self-center">→</span>
                <span
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold"
                  style={{ backgroundColor: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', color: '#a78bfa' }}
                >
                  <span className="font-mono">{outputVar.symbol}</span>
                  {outputVar.value !== undefined && (
                    <span className="font-mono">= {outputVar.value.toFixed(4)}</span>
                  )}
                  {outputVar.unit && <span className="opacity-70">{outputVar.unit}</span>}
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
