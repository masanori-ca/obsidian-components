import { motion } from 'framer-motion';
import type { ProofTrace } from '@/components/hooks/useChatSSE';

interface InlineProofPreviewProps {
  proofTrace: ProofTrace;
  onExpand?: () => void;
}

/**
 * Compact inline proof trace preview shown below assistant messages.
 * Shows data sources + CBF status + DAG path in a single line.
 * Click to expand full ProofTraceDrawer.
 */
export function InlineProofPreview({ proofTrace, onExpand }: InlineProofPreviewProps) {
  const sourceTypes = new Set(Object.values(proofTrace.sources));
  const cbfPassed = proofTrace.cbf.every((c) => c.status === 'passed');
  const hasViolations = proofTrace.constraints.some((c) => c.violated);

  return (
    <motion.button
      onClick={onExpand}
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[9px] w-full text-left transition-colors"
      style={{
        backgroundColor: 'var(--obs-bg-secondary)',
        border: '1px solid var(--obs-border-subtle)',
      }}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ backgroundColor: 'var(--obs-bg-tertiary)' }}
    >
      {/* Sources */}
      <div className="flex items-center gap-1">
        {Array.from(sourceTypes).map((src) => (
          <span
            key={src}
            className="px-1 py-0.5 rounded font-bold"
            style={{
              fontSize: '8px',
              backgroundColor:
                src === 'PCK' ? 'rgba(56,189,248,0.15)' :
                src === 'TK' ? 'rgba(167,139,250,0.15)' :
                src === 'Surrogate' ? 'rgba(251,191,36,0.15)' :
                'var(--obs-bg-tertiary)',
              color:
                src === 'PCK' ? '#38bdf8' :
                src === 'TK' ? '#a78bfa' :
                src === 'Surrogate' ? '#fbbf24' :
                'var(--obs-text-muted)',
            }}
          >
            {src}
          </span>
        ))}
      </div>

      <span style={{ color: 'var(--obs-border-primary)' }}>|</span>

      {/* CBF */}
      <span style={{ color: cbfPassed ? 'var(--obs-success)' : 'var(--obs-danger)' }}>
        CBF {cbfPassed ? '✓' : '✗'}
      </span>

      {/* Violations */}
      {hasViolations && (
        <span style={{ color: 'var(--obs-warning)' }}>
          {proofTrace.constraints.filter((c) => c.violated).length} violated
        </span>
      )}

      <span style={{ color: 'var(--obs-border-primary)' }}>|</span>

      {/* DAG preview */}
      <span style={{ color: 'var(--obs-text-muted)' }}>
        {proofTrace.dag.slice(0, 3).join(' → ')}
        {proofTrace.dag.length > 3 && ` +${proofTrace.dag.length - 3}`}
      </span>

      {/* Expand indicator */}
      <span className="ml-auto" style={{ color: 'var(--obs-accent)' }}>
        詳細 →
      </span>
    </motion.button>
  );
}
