import { motion } from 'framer-motion';
import type { QuickCause } from '@/lib/pck-client';

interface QuickCausePanelProps {
  causes: QuickCause[];
  isLoading?: boolean;
}

/**
 * Displays surrogate sensitivity analysis results.
 * Shows which variables, when reset to baseline, would most improve the situation.
 * Data comes from Alert evaluate → surrogate quick cause estimation.
 */
export function QuickCausePanel({ causes, isLoading = false }: QuickCausePanelProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border obs-border-primary obs-bg-card p-4">
        <h3 className="text-sm font-semibold obs-text-primary mb-3">
          即時原因推定
        </h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded-lg obs-bg-secondary animate-pulse" />
          ))}
        </div>
        <p className="text-[10px] obs-text-muted mt-2">サロゲートモデルで感度分析中...</p>
      </div>
    );
  }

  if (causes.length === 0) {
    return (
      <div className="rounded-xl border obs-border-primary obs-bg-card p-4">
        <h3 className="text-sm font-semibold obs-text-primary mb-2">
          即時原因推定
        </h3>
        <p className="text-xs obs-text-muted">重大な偏差変数がありません。</p>
      </div>
    );
  }

  const sorted = [...causes].sort((a, b) => b.if_reset_to_baseline - a.if_reset_to_baseline);
  const maxImprovement = sorted[0]?.if_reset_to_baseline ?? 1;

  return (
    <div className="rounded-xl border obs-border-primary obs-bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold obs-text-primary">
          即時原因推定
        </h3>
        <span className="text-[10px] obs-text-muted px-2 py-0.5 rounded obs-bg-secondary border obs-border-primary">
          Surrogate感度分析
        </span>
      </div>

      <p className="text-[11px] obs-text-muted mb-3">
        各変数をベースラインに戻した場合の改善率推定
      </p>

      <div className="space-y-2">
        {sorted.map((cause, idx) => {
          const barWidth = maxImprovement > 0
            ? (cause.if_reset_to_baseline / maxImprovement) * 100
            : 0;

          return (
            <motion.div
              key={cause.cause_variable}
              className="p-2.5 rounded-lg obs-bg-secondary border obs-border-secondary"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                    idx === 0
                      ? 'bg-amber-400/20 text-amber-400'
                      : 'obs-bg-tertiary obs-text-tertiary'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="text-xs font-medium obs-text-primary">
                    {cause.cause_variable}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] obs-text-muted">
                    偏差 {cause.deviation_pct > 0 ? '+' : ''}{cause.deviation_pct.toFixed(1)}%
                  </span>
                  <span className={`text-xs font-mono font-bold ${
                    cause.if_reset_to_baseline > 30
                      ? 'text-emerald-400'
                      : cause.if_reset_to_baseline > 10
                        ? 'text-amber-400'
                        : 'obs-text-tertiary'
                  }`}>
                    -{cause.if_reset_to_baseline.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Improvement bar */}
              <div className="h-1.5 rounded-full obs-bg-tertiary overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    cause.if_reset_to_baseline > 30
                      ? 'bg-emerald-400'
                      : cause.if_reset_to_baseline > 10
                        ? 'bg-amber-400'
                        : 'bg-zinc-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ duration: 0.5, delay: idx * 0.08 + 0.2 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {sorted.length > 0 && (
        <div className="mt-3 p-2 rounded-lg bg-emerald-400/5 border border-emerald-400/20">
          <p className="text-[11px] text-emerald-400">
            最大改善: <span className="font-bold">{sorted[0].cause_variable}</span> をベースラインに戻すと
            <span className="font-mono font-bold"> -{sorted[0].if_reset_to_baseline.toFixed(1)}%</span> 改善見込み
          </p>
        </div>
      )}
    </div>
  );
}
