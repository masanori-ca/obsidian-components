import { motion } from 'framer-motion';

interface OptimizedParam {
  variable: string;
  baseline: number;
  optimized: number;
  unit?: string;
}

interface OptimizeResultCardProps {
  params: OptimizedParam[];
  targetMet: boolean;
  targetDescription?: string;
  energyReductionPct?: number;
  scenariosEvaluated?: number;
  cbfPassed?: boolean;
}

/**
 * Optimization result card for chat messages.
 * Shows parameter changes with reduction rates and energy savings.
 */
export function OptimizeResultCard({ params, targetMet, targetDescription, energyReductionPct, scenariosEvaluated, cbfPassed }: OptimizeResultCardProps) {
  return (
    <motion.div
      className="rounded-lg overflow-hidden my-2"
      style={{
        border: `1px solid ${targetMet ? 'var(--obs-success)' : 'var(--obs-warning)'}33`,
        backgroundColor: targetMet ? 'var(--obs-success-bg)' : 'var(--obs-warning-bg)',
      }}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5" style={{ borderBottom: '1px solid var(--obs-border-subtle)' }}>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--obs-success-bg)', color: 'var(--obs-success)' }}>
            OPT
          </span>
          <span className="text-[11px] font-medium obs-text-primary">最適化結果</span>
        </div>
        <div className="flex items-center gap-1.5">
          {cbfPassed !== undefined && (
            <span className="text-[8px] font-bold px-1 py-0.5 rounded" style={{
              color: cbfPassed ? 'var(--obs-success)' : 'var(--obs-danger)',
              backgroundColor: cbfPassed ? 'var(--obs-success-bg)' : 'var(--obs-danger-bg)',
            }}>
              CBF {cbfPassed ? '✓' : '✗'}
            </span>
          )}
          <span className="text-[8px] font-bold px-1 py-0.5 rounded" style={{
            color: targetMet ? 'var(--obs-success)' : 'var(--obs-warning)',
            backgroundColor: targetMet ? 'var(--obs-success-bg)' : 'var(--obs-warning-bg)',
          }}>
            {targetMet ? '目標達成' : '目標未達'}
          </span>
        </div>
      </div>

      {targetDescription && (
        <div className="px-3 py-1.5 text-[10px] obs-text-tertiary" style={{ borderBottom: '1px solid var(--obs-border-subtle)' }}>
          目標: {targetDescription}
        </div>
      )}

      {/* Parameter changes */}
      <div className="px-3 py-2 space-y-1.5">
        {params.map((p, idx) => {
          const reductionPct = ((p.optimized - p.baseline) / Math.abs(p.baseline)) * 100;
          const isReduction = reductionPct < 0;

          return (
            <motion.div
              key={p.variable}
              className="flex items-center justify-between py-1"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <span className="text-[10px] font-mono obs-text-secondary">{p.variable}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono obs-text-muted">{p.baseline.toFixed(0)}</span>
                <span className="text-[9px] obs-text-muted">→</span>
                <span className="text-[10px] font-mono font-bold obs-text-primary">{p.optimized.toFixed(0)}</span>
                <span className={`text-[10px] font-mono font-bold min-w-[48px] text-right`} style={{
                  color: isReduction ? 'var(--obs-success)' : 'var(--obs-warning)',
                }}>
                  {reductionPct > 0 ? '+' : ''}{reductionPct.toFixed(0)}%
                </span>
                {p.unit && <span className="text-[8px] obs-text-muted w-8">{p.unit}</span>}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer: energy + scenarios */}
      <div className="px-3 py-1.5 flex items-center justify-between" style={{ borderTop: '1px solid var(--obs-border-subtle)', backgroundColor: 'var(--obs-bg-tertiary)' }}>
        {energyReductionPct !== undefined && (
          <div className="flex items-center gap-1">
            <span className="text-[9px] obs-text-muted">省エネ:</span>
            <span className="text-[11px] font-mono font-bold" style={{ color: 'var(--obs-success)' }}>
              -{energyReductionPct.toFixed(0)}%
            </span>
          </div>
        )}
        {scenariosEvaluated !== undefined && (
          <span className="text-[9px] obs-text-muted">{scenariosEvaluated}シナリオ評価</span>
        )}
      </div>
    </motion.div>
  );
}
