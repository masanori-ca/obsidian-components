import { motion } from 'framer-motion';

interface CausalPathInlineProps {
  path: string[];
  rootCause?: string;
  impactedVariable?: string;
  onNodeClick?: (nodeId: string) => void;
}

/**
 * Compact inline causal path for chat messages.
 * Root cause highlighted in amber, impacted variable in red.
 */
export function CausalPathInline({ path, rootCause, impactedVariable, onNodeClick }: CausalPathInlineProps) {
  if (path.length === 0) return null;

  return (
    <motion.div
      className="flex items-center gap-0.5 flex-wrap my-1.5 px-2 py-1.5 rounded-md"
      style={{ backgroundColor: 'var(--obs-bg-tertiary)', border: '1px solid var(--obs-border-subtle)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <span className="text-[8px] obs-text-muted mr-1">因果:</span>
      {path.map((node, idx) => {
        const isRoot = node === rootCause;
        const isImpacted = node === impactedVariable;

        return (
          <span key={`${node}-${idx}`} className="inline-flex items-center gap-0.5">
            <button
              onClick={() => onNodeClick?.(node)}
              className="text-[9px] font-mono px-1 py-0.5 rounded transition-colors"
              style={{
                color: isRoot ? 'var(--obs-warning)' : isImpacted ? 'var(--obs-danger)' : 'var(--obs-text-tertiary)',
                fontWeight: isRoot || isImpacted ? 700 : 400,
                backgroundColor: isRoot ? 'var(--obs-warning-bg)' : isImpacted ? 'var(--obs-danger-bg)' : 'transparent',
              }}
            >
              {node}
            </button>
            {idx < path.length - 1 && (
              <span className="text-[8px] obs-text-muted">→</span>
            )}
          </span>
        );
      })}
    </motion.div>
  );
}
