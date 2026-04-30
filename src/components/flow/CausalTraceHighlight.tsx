import { motion } from 'framer-motion';

interface CausalTraceHighlightProps {
  tracePath: string[];
  rootCause?: string;
  affectedVariable?: string;
  onNodeClick?: (nodeId: string) => void;
}

/**
 * Shows the upstream causal trace path as a horizontal chain.
 * From root cause → intermediate nodes → affected variable.
 */
export function CausalTraceHighlight({
  tracePath,
  rootCause,
  affectedVariable,
  onNodeClick,
}: CausalTraceHighlightProps) {
  if (tracePath.length === 0) return null;

  return (
    <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-amber-400">上流因果追跡</h3>
        <span className="text-[10px] obs-text-muted">{tracePath.length} ノード</span>
      </div>

      {rootCause && affectedVariable && (
        <p className="text-[11px] obs-text-tertiary mb-3">
          <span className="text-amber-400 font-medium">{rootCause}</span>
          {' → ... → '}
          <span className="text-red-400 font-medium">{affectedVariable}</span>
        </p>
      )}

      {/* Trace chain */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {tracePath.map((node, idx) => {
          const isRoot = node === rootCause || idx === 0;
          const isAffected = node === affectedVariable || idx === tracePath.length - 1;

          return (
            <div key={`${node}-${idx}`} className="flex items-center gap-1 shrink-0">
              <motion.button
                onClick={() => onNodeClick?.(node)}
                className={`px-2.5 py-1.5 rounded-md text-[11px] font-mono border transition-colors ${
                  isRoot
                    ? 'bg-amber-400/15 border-amber-400/40 text-amber-400 font-bold'
                    : isAffected
                      ? 'bg-red-400/15 border-red-400/40 text-red-400 font-bold'
                      : 'obs-bg-secondary obs-border-secondary obs-text-tertiary hover:obs-bg-tertiary'
                }`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                {node}
              </motion.button>
              {idx < tracePath.length - 1 && (
                <motion.span
                  className="text-amber-400/60 text-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.08 + 0.04 }}
                >
                  →
                </motion.span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
