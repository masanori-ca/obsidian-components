import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AutopilotCycleResult, ActionRecommendation } from '@/lib/pck-client';
import { ZoneIndicator } from '@/components/alert/ZoneIndicator';
import type { Zone } from '@/components/alert/ZoneIndicator';
import { AgentApprovalDialog } from './AgentApprovalDialog';

type CyclePhase = 'idle' | 'monitor' | 'diagnose' | 'predict' | 'optimize' | 'control' | 'complete';

interface AutopilotCyclePanelProps {
  cycleResult: AutopilotCycleResult | null;
  currentPhase?: CyclePhase;
  isRunning?: boolean;
  onApprove?: (action: ActionRecommendation) => void;
  onReject?: (action: ActionRecommendation, reason: string) => void;
  onStartCycle?: () => void;
  onStopCycle?: () => void;
}

interface PhaseConfig {
  id: CyclePhase;
  label: string;
  description: string;
}

const PHASES: PhaseConfig[] = [
  { id: 'monitor',   label: 'Phase 1: Monitor',   description: 'ベースライン比較・ゾーン分類' },
  { id: 'diagnose',  label: 'Phase 1b: Diagnose',  description: '根本原因分析（Brain因果推論）' },
  { id: 'predict',   label: 'Phase 2: Predict',    description: '2h先予測（Simulator/Surrogate）' },
  { id: 'optimize',  label: 'Phase 3: Optimize',   description: '多目的最適化（座標降下法）' },
  { id: 'control',   label: 'Phase 4: Control',    description: '是正アクション実行（承認制御）' },
];

const PHASE_ORDER: CyclePhase[] = ['monitor', 'diagnose', 'predict', 'optimize', 'control'];

/**
 * Visualizes the Brain Autopilot 5-phase cycle.
 * Each phase shows its result and the operator can approve/reject at Phase 4 (Control).
 */
export function AutopilotCyclePanel({
  cycleResult,
  currentPhase = 'idle',
  isRunning = false,
  onApprove,
  onReject,
  onStartCycle,
  onStopCycle,
}: AutopilotCyclePanelProps) {
  const [approvalTarget, setApprovalTarget] = useState<ActionRecommendation | null>(null);

  const getPhaseStatus = useCallback((phaseId: CyclePhase): 'pending' | 'active' | 'done' | 'skipped' => {
    if (currentPhase === 'idle' || currentPhase === 'complete') {
      return cycleResult ? 'done' : 'pending';
    }
    const currentIdx = PHASE_ORDER.indexOf(currentPhase);
    const phaseIdx = PHASE_ORDER.indexOf(phaseId);
    if (phaseIdx < currentIdx) return 'done';
    if (phaseIdx === currentIdx) return 'active';
    return 'pending';
  }, [currentPhase, cycleResult]);

  const overallZone = (cycleResult?.overall_zone ?? 'N') as Zone;

  return (
    <div className="rounded-xl border obs-border-primary obs-bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b obs-border-primary obs-bg-secondary">
        <div className="flex items-center gap-2">
          <motion.div
            className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400' : 'bg-zinc-600'}`}
            animate={isRunning ? { opacity: [1, 0.3, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <h3 className="text-sm font-semibold obs-text-primary">Autopilot Cycle</h3>
        </div>
        <div className="flex items-center gap-2">
          {cycleResult && (
            <ZoneIndicator zone={overallZone} compact />
          )}
          {isRunning ? (
            <button
              onClick={onStopCycle}
              className="px-2.5 py-1 text-[11px] font-medium text-red-400 bg-red-400/10 border border-red-400/30 rounded-md hover:bg-red-400/20 transition-colors"
            >
              停止
            </button>
          ) : (
            <button
              onClick={onStartCycle}
              className="px-2.5 py-1 text-[11px] font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 rounded-md hover:bg-emerald-400/20 transition-colors"
            >
              サイクル開始
            </button>
          )}
        </div>
      </div>

      {/* Phase list */}
      <div className="p-4 space-y-2">
        {PHASES.map((phase, idx) => {
          const status = getPhaseStatus(phase.id);

          return (
            <motion.div
              key={phase.id}
              className={`relative p-3 rounded-lg border transition-colors ${
                status === 'active'
                  ? 'bg-sky-400/5 border-sky-400/30'
                  : status === 'done'
                    ? 'obs-bg-secondary obs-border-secondary'
                    : 'obs-bg-card obs-border-secondary'
              }`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex items-center gap-3">
                {/* Status icon */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                  status === 'done'
                    ? 'bg-emerald-400/20 text-emerald-400'
                    : status === 'active'
                      ? 'bg-sky-400/20 text-sky-400'
                      : 'obs-bg-secondary obs-text-muted'
                }`}>
                  {status === 'done' ? '✓' : status === 'active' ? '▶' : (idx + 1)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${
                      status === 'active' ? 'text-sky-400' :
                      status === 'done' ? 'obs-text-secondary' : 'obs-text-muted'
                    }`}>
                      {phase.label}
                    </span>
                    {status === 'active' && (
                      <motion.span
                        className="text-[10px] text-sky-400"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        実行中
                      </motion.span>
                    )}
                  </div>
                  <p className={`text-[11px] ${status === 'active' ? 'obs-text-tertiary' : 'obs-text-muted'}`}>
                    {phase.description}
                  </p>
                </div>
              </div>

              {/* Phase-specific results */}
              <AnimatePresence>
                {status === 'done' && cycleResult && (
                  <motion.div
                    className="mt-2 ml-9"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    {phase.id === 'monitor' && (
                      <div className="text-[11px] obs-text-tertiary space-y-0.5">
                        <div>重大: <span className="text-red-400 font-mono">{cycleResult.critical_count}</span> 警告: <span className="text-amber-400 font-mono">{cycleResult.warning_count}</span></div>
                        {cycleResult.deviations.slice(0, 3).map((d) => (
                          <div key={d.variable} className="flex items-center gap-2">
                            <ZoneIndicator zone={d.zone as Zone} compact />
                            <span className="font-mono">{d.variable}</span>
                            <span className="obs-text-muted">{d.deviation_pct > 0 ? '+' : ''}{d.deviation_pct.toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {phase.id === 'diagnose' && cycleResult.diagnoses && (
                      <div className="text-[11px] obs-text-tertiary">
                        {JSON.stringify(cycleResult.diagnoses).length > 2
                          ? <span>根本原因分析完了</span>
                          : <span className="obs-text-muted">診断スキップ（正常範囲）</span>
                        }
                      </div>
                    )}

                    {phase.id === 'predict' && cycleResult.predictions && (
                      <div className="text-[11px] obs-text-tertiary">
                        {cycleResult.early_warnings && cycleResult.early_warnings.length > 0
                          ? <span className="text-amber-400">早期警告: {cycleResult.early_warnings.length}件</span>
                          : <span>予測完了 — 早期警告なし</span>
                        }
                      </div>
                    )}

                    {phase.id === 'optimize' && (
                      <div className="text-[11px] obs-text-tertiary">
                        {cycleResult.top_scenario
                          ? <span>最適シナリオ発見（{cycleResult.scenarios_evaluated ?? 0}件評価）</span>
                          : <span className="obs-text-muted">最適化スキップ</span>
                        }
                      </div>
                    )}

                    {phase.id === 'control' && cycleResult.actions && (
                      <div className="space-y-1">
                        {cycleResult.actions.map((action, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-[11px] obs-text-tertiary">
                              {action.action_type}: {action.target_variable}
                            </span>
                            {onApprove && (
                              <button
                                onClick={() => setApprovalTarget(action)}
                                className="px-2 py-0.5 text-[10px] font-medium text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded hover:bg-amber-400/20 transition-colors"
                              >
                                承認確認
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Cycle metadata */}
      {cycleResult && (
        <div className="px-4 py-2 border-t obs-border-secondary obs-bg-secondary flex items-center justify-between text-[10px] obs-text-muted">
          <span>Cycle: {cycleResult.cycle_id?.slice(0, 8)}</span>
          <span>{cycleResult.elapsed_ms}ms</span>
          <span>{cycleResult.timestamp}</span>
        </div>
      )}

      {/* Approval Dialog */}
      {approvalTarget && (
        <AgentApprovalDialog
          action={approvalTarget}
          cbfPassed={true}
          onApprove={() => {
            onApprove?.(approvalTarget);
            setApprovalTarget(null);
          }}
          onReject={(reason) => {
            onReject?.(approvalTarget, reason);
            setApprovalTarget(null);
          }}
          onClose={() => setApprovalTarget(null)}
        />
      )}
    </div>
  );
}
