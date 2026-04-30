import { motion, AnimatePresence } from 'framer-motion';
import type { ProofTrace } from '@/components/hooks/useChatSSE';

interface ProofTraceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  proofTrace: ProofTrace | null;
}

const STATUS_COLOR: Record<string, string> = {
  passed: 'text-emerald-400',
  blocked: 'text-red-400',
  warned: 'text-amber-400',
  OK: 'text-emerald-400',
};

const SEVERITY_COLOR: Record<string, { color: string; bg: string }> = {
  block: { color: 'text-red-400', bg: 'bg-red-400/10' },
  warn: { color: 'text-amber-400', bg: 'bg-amber-400/10' },
  info: { color: 'text-sky-400', bg: 'bg-sky-400/10' },
};

/**
 * Slide-out drawer showing Provenance of Thought (PoT).
 * Displays: data sources, judgments, constraints, CBF results, causal DAG path.
 */
export function ProofTraceDrawer({ isOpen, onClose, proofTrace }: ProofTraceDrawerProps) {
  if (!proofTrace) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-[400px] max-w-[90vw] obs-bg-primary border-l obs-border-primary z-50 overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold obs-text-primary">
                  Proof Trace (証跡)
                </h2>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-md obs-bg-secondary border obs-border-primary obs-text-tertiary hover:obs-text-primary flex items-center justify-center text-sm transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Data Sources */}
              <section className="mb-4">
                <h3 className="text-[11px] font-semibold obs-text-tertiary uppercase tracking-wider mb-2">
                  データソース
                </h3>
                <div className="space-y-1">
                  {Object.entries(proofTrace.sources).map(([variable, source]) => (
                    <div
                      key={variable}
                      className="flex items-center justify-between p-2 rounded-lg obs-bg-secondary border obs-border-secondary"
                    >
                      <span className="text-xs font-mono obs-text-secondary">{variable}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        source === 'PCK' ? 'bg-sky-400/15 text-sky-400' :
                        source === 'TK' ? 'bg-purple-400/15 text-purple-400' :
                        source === 'Surrogate' ? 'bg-amber-400/15 text-amber-400' :
                        'obs-bg-tertiary obs-text-tertiary'
                      }`}>
                        {source}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Judgments */}
              {proofTrace.judgments.length > 0 && (
                <section className="mb-4">
                  <h3 className="text-[11px] font-semibold obs-text-tertiary uppercase tracking-wider mb-2">
                    判定
                  </h3>
                  <div className="space-y-1">
                    {proofTrace.judgments.map((j, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg obs-bg-secondary border obs-border-secondary"
                      >
                        <span className={`text-xs font-bold ${STATUS_COLOR[j.status] ?? 'obs-text-tertiary'}`}>
                          {j.status}
                        </span>
                        <p className="text-[11px] obs-text-tertiary mt-0.5">{j.reason}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Constraints */}
              {proofTrace.constraints.length > 0 && (
                <section className="mb-4">
                  <h3 className="text-[11px] font-semibold obs-text-tertiary uppercase tracking-wider mb-2">
                    制約 ({proofTrace.constraints.length})
                  </h3>
                  <div className="space-y-1">
                    {proofTrace.constraints.map((c, idx) => {
                      const sev = SEVERITY_COLOR[c.severity ?? 'info'] ?? SEVERITY_COLOR.info;
                      return (
                        <div
                          key={idx}
                          className={`p-2 rounded-lg border obs-border-secondary ${c.violated ? sev.bg : 'obs-bg-secondary'}`}
                        >
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`text-[10px] font-bold ${c.violated ? sev.color : 'text-emerald-400'}`}>
                              {c.violated ? 'VIOLATED' : 'PASS'}
                            </span>
                            <span className="text-[10px] obs-text-muted">{c.label}</span>
                          </div>
                          <p className="text-[11px] obs-text-tertiary">{c.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* CBF Results */}
              {proofTrace.cbf.length > 0 && (
                <section className="mb-4">
                  <h3 className="text-[11px] font-semibold obs-text-tertiary uppercase tracking-wider mb-2">
                    CBF 安全バリア
                  </h3>
                  <div className="space-y-1">
                    {proofTrace.cbf.map((c, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded-lg border obs-border-secondary ${
                          c.status === 'blocked' ? 'bg-red-400/10' :
                          c.status === 'warned' ? 'bg-amber-400/10' :
                          'obs-bg-secondary'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-mono obs-text-secondary">{c.variable}</span>
                          <span className={`text-[10px] font-bold ${STATUS_COLOR[c.status] ?? 'obs-text-tertiary'}`}>
                            {c.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[11px] obs-text-tertiary">{c.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Causal DAG Path */}
              {proofTrace.dag.length > 0 && (
                <section>
                  <h3 className="text-[11px] font-semibold obs-text-tertiary uppercase tracking-wider mb-2">
                    因果パス
                  </h3>
                  <div className="flex flex-wrap items-center gap-1">
                    {proofTrace.dag.map((node, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        <span className="px-2 py-1 text-[11px] font-mono rounded-md obs-bg-secondary border obs-border-primary obs-text-secondary">
                          {node}
                        </span>
                        {idx < proofTrace.dag.length - 1 && (
                          <span className="obs-text-muted text-xs">→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
