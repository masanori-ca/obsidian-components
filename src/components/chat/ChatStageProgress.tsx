import { motion } from 'framer-motion';
import type { ChatStage, CausalContextSummary } from '@/components/hooks/useChatSSE';

interface ChatStageProgressProps {
  stage: ChatStage;
  causalContext?: CausalContextSummary | null;
}

interface StageStep {
  id: ChatStage;
  label: string;
  sublabel: string;
  icon: string;
}

const STAGES: StageStep[] = [
  { id: 'extracting', label: 'Extract',  sublabel: 'LLM変数抽出', icon: '1' },
  { id: 'computing',  label: 'Compute',  sublabel: 'PCK因果計算', icon: '2' },
  { id: 'rendering',  label: 'Render',   sublabel: '回答生成',     icon: '3' },
];

const STAGE_ORDER: ChatStage[] = ['extracting', 'computing', 'rendering', 'done'];

/**
 * 3-stage progress indicator for ProTwin2 pipeline.
 * Extract (Haiku) → Compute (Code) → Render (Sonnet)
 * Shows causal context summary after Compute stage.
 */
export function ChatStageProgress({ stage, causalContext }: ChatStageProgressProps) {
  if (stage === 'idle' || stage === 'done') return null;

  const currentIdx = STAGE_ORDER.indexOf(stage);

  return (
    <motion.div
      className="px-4 py-2.5"
      style={{ backgroundColor: 'var(--obs-bg-secondary)', borderBottom: '1px solid var(--obs-border-subtle)' }}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
    >
      {/* 3-step progress bar */}
      <div className="flex items-center gap-1 mb-2">
        {STAGES.map((s, idx) => {
          const stageIdx = STAGE_ORDER.indexOf(s.id);
          const isDone = currentIdx > stageIdx;
          const isActive = currentIdx === stageIdx;
          const isPending = currentIdx < stageIdx;

          return (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex items-center gap-1.5 flex-1">
                {/* Step dot */}
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                  style={{
                    backgroundColor: isDone ? 'var(--obs-success-bg)' : isActive ? 'var(--obs-accent-bg)' : 'var(--obs-bg-tertiary)',
                    color: isDone ? 'var(--obs-success)' : isActive ? 'var(--obs-accent)' : 'var(--obs-text-muted)',
                    border: `1.5px solid ${isDone ? 'var(--obs-success)' : isActive ? 'var(--obs-accent)' : 'var(--obs-border-primary)'}`,
                  }}
                >
                  {isDone ? '✓' : s.icon}
                </div>

                <div className="min-w-0">
                  <div className="text-[10px] font-semibold" style={{ color: isActive ? 'var(--obs-accent)' : isDone ? 'var(--obs-text-secondary)' : 'var(--obs-text-muted)' }}>
                    {s.label}
                  </div>
                  {isActive && (
                    <motion.div
                      className="text-[8px]"
                      style={{ color: 'var(--obs-text-muted)' }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      {s.sublabel}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Connector */}
              {idx < STAGES.length - 1 && (
                <div
                  className="h-px flex-1 mx-1"
                  style={{ backgroundColor: isDone ? 'var(--obs-success)' : isPending ? 'var(--obs-border-primary)' : 'var(--obs-accent)' }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Causal context summary card (shown after Compute) */}
      {causalContext && (stage === 'rendering' || stage === 'computing') && (
        <motion.div
          className="flex items-center gap-3 px-2.5 py-1.5 rounded-md text-[9px]"
          style={{ backgroundColor: 'var(--obs-bg-tertiary)', border: '1px solid var(--obs-border-subtle)' }}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span style={{ color: 'var(--obs-accent)' }}>
            {causalContext.nodes} nodes
          </span>
          <span style={{ color: 'var(--obs-text-muted)' }}>
            {causalContext.constraints} constraints
          </span>
          {causalContext.safety_violations > 0 && (
            <span style={{ color: 'var(--obs-danger)' }}>
              {causalContext.safety_violations} safety violations
            </span>
          )}
          {causalContext.cbf_blocks > 0 && (
            <span style={{ color: 'var(--obs-danger)' }}>
              {causalContext.cbf_blocks} CBF blocks
            </span>
          )}
          {causalContext.tk_count > 0 && (
            <span style={{ color: '#a78bfa' }}>
              {causalContext.tk_count} TK
            </span>
          )}
          {causalContext.has_what_if && (
            <span style={{ color: causalContext.what_if_blocked ? 'var(--obs-danger)' : 'var(--obs-success)' }}>
              What-If: {causalContext.what_if_blocked ? 'BLOCKED' : 'OK'}
            </span>
          )}
          <span className="ml-auto" style={{ color: 'var(--obs-text-muted)' }}>
            DAG: {causalContext.dag_path.length} nodes
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
