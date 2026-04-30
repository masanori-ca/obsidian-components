import { motion } from 'framer-motion';
import type { CausalContextSummary } from '@/components/hooks/useChatSSE';

interface ComputeResultCardProps {
  context: CausalContextSummary;
  executionTimeMs?: number;
  onExpandTrace?: () => void;
}

/**
 * Stage 2 compute result summary card.
 * Shows what PCK computed: nodes, constraints, CBF, TK, What-If.
 */
export function ComputeResultCard({ context, executionTimeMs, onExpandTrace }: ComputeResultCardProps) {
  return (
    <motion.div
      className="rounded-lg overflow-hidden my-2"
      style={{ border: '1px solid var(--obs-border-secondary)', backgroundColor: 'var(--obs-bg-secondary)' }}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between px-3 py-1.5" style={{ borderBottom: '1px solid var(--obs-border-subtle)' }}>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--obs-success-bg)', color: 'var(--obs-success)' }}>
            PCK
          </span>
          <span className="text-[11px] font-medium obs-text-primary">因果計算結果</span>
        </div>
        {executionTimeMs && (
          <span className="text-[9px] font-mono obs-text-muted">{executionTimeMs}ms</span>
        )}
      </div>

      <div className="px-3 py-2 grid grid-cols-3 gap-2">
        <MetricCell label="ノード" value={context.nodes} />
        <MetricCell label="制約" value={context.constraints} warn={context.safety_violations > 0} />
        <MetricCell label="TK" value={context.tk_count} color="#a78bfa" />

        {context.safety_violations > 0 && (
          <MetricCell label="安全違反" value={context.safety_violations} color="var(--obs-danger)" />
        )}
        {context.cbf_blocks > 0 && (
          <MetricCell label="CBFブロック" value={context.cbf_blocks} color="var(--obs-danger)" />
        )}
        {context.has_what_if && (
          <MetricCell
            label="What-If"
            value={context.what_if_blocked ? 'BLOCKED' : 'OK'}
            color={context.what_if_blocked ? 'var(--obs-danger)' : 'var(--obs-success)'}
          />
        )}
      </div>

      {/* DAG path preview + expand */}
      <div className="px-3 py-1.5 flex items-center justify-between" style={{ borderTop: '1px solid var(--obs-border-subtle)', backgroundColor: 'var(--obs-bg-tertiary)' }}>
        <div className="flex items-center gap-1 text-[9px] font-mono obs-text-muted overflow-hidden">
          {context.dag_path.slice(0, 4).map((n, i) => (
            <span key={i}>
              {i > 0 && <span className="mx-0.5">→</span>}
              <span className="obs-text-tertiary">{n}</span>
            </span>
          ))}
          {context.dag_path.length > 4 && <span>... +{context.dag_path.length - 4}</span>}
        </div>
        {onExpandTrace && (
          <button onClick={onExpandTrace} className="text-[9px] font-medium" style={{ color: 'var(--obs-accent)' }}>
            証跡 →
          </button>
        )}
      </div>
    </motion.div>
  );
}

function MetricCell({ label, value, color, warn }: { label: string; value: number | string; color?: string; warn?: boolean }) {
  return (
    <div className="text-center p-1.5 rounded" style={{ backgroundColor: 'var(--obs-bg-tertiary)' }}>
      <div className="text-[8px] obs-text-muted uppercase">{label}</div>
      <div
        className="text-sm font-mono font-bold"
        style={{ color: warn ? 'var(--obs-danger)' : color ?? 'var(--obs-text-primary)' }}
      >
        {value}
      </div>
    </div>
  );
}
