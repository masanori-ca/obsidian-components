import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ActionRecommendation, ActionResolveResponse } from '@/lib/pck-client';

interface ActionResolvePanelProps {
  response: ActionResolveResponse;
  onExecute?: (action: ActionRecommendation) => void;
  onDismiss?: (action: ActionRecommendation) => void;
}

const PRIORITY_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  critical: { label: '緊急',   color: 'text-red-400',    bg: 'bg-red-400/15',    border: 'border-red-400/30' },
  high:     { label: '高',     color: 'text-orange-400', bg: 'bg-orange-400/15', border: 'border-orange-400/30' },
  medium:   { label: '中',     color: 'text-amber-400',  bg: 'bg-amber-400/15',  border: 'border-amber-400/30' },
  low:      { label: '低',     color: 'text-sky-400',    bg: 'bg-sky-400/15',    border: 'border-sky-400/30' },
};

/**
 * Displays recommended remediation actions from PCK Action Service.
 * Allows operator to execute or dismiss each action.
 */
export function ActionResolvePanel({ response, onExecute, onDismiss }: ActionResolvePanelProps) {
  const [executedIds, setExecutedIds] = useState<Set<string>>(new Set());
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const handleExecute = (action: ActionRecommendation) => {
    const id = `${action.action_type}_${action.target_variable}`;
    setExecutedIds((prev) => new Set(prev).add(id));
    onExecute?.(action);
  };

  const handleDismiss = (action: ActionRecommendation) => {
    const id = `${action.action_type}_${action.target_variable}`;
    setDismissedIds((prev) => new Set(prev).add(id));
    onDismiss?.(action);
  };

  if (response.actions.length === 0) {
    return (
      <div className="rounded-xl border obs-border-primary obs-bg-card p-4">
        <h3 className="text-sm font-semibold obs-text-primary mb-2">
          是正アクション
        </h3>
        <p className="text-xs obs-text-muted">{response.message || 'アクション推奨なし'}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border obs-border-primary obs-bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold obs-text-primary">
          是正アクション
        </h3>
        <span className="text-[10px] obs-text-muted">
          {response.actions.length}件の推奨
        </span>
      </div>

      {response.message && (
        <p className="text-[11px] obs-text-tertiary mb-3 p-2 rounded obs-bg-secondary border obs-border-secondary">
          {response.message}
        </p>
      )}

      <div className="space-y-2">
        <AnimatePresence>
          {response.actions.map((action, idx) => {
            const id = `${action.action_type}_${action.target_variable}`;
            const isExecuted = executedIds.has(id);
            const isDismissed = dismissedIds.has(id);
            const priorityConfig = PRIORITY_CONFIG[action.priority] ?? PRIORITY_CONFIG.medium;

            if (isDismissed) return null;

            return (
              <motion.div
                key={id}
                className={`p-3 rounded-lg border transition-colors ${
                  isExecuted
                    ? 'bg-emerald-400/5 border-emerald-400/20'
                    : `obs-bg-secondary ${priorityConfig.border}`
                }`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${priorityConfig.bg} ${priorityConfig.color}`}>
                        {priorityConfig.label}
                      </span>
                      <span className="text-xs font-medium obs-text-primary truncate">
                        {action.action_type}
                      </span>
                    </div>
                    <p className="text-[11px] obs-text-tertiary">
                      {action.reason}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] obs-text-muted">
                        対象: <span className="obs-text-tertiary">{action.target_variable}</span>
                      </span>
                      {Object.keys(action.parameters).length > 0 && (
                        <span className="text-[10px] obs-text-muted">
                          {Object.entries(action.parameters)
                            .map(([k, v]) => `${k}=${v}`)
                            .join(', ')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  {!isExecuted && (
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => handleExecute(action)}
                        className="px-2.5 py-1 text-[11px] font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 rounded-md hover:bg-emerald-400/20 transition-colors"
                      >
                        実行
                      </button>
                      <button
                        onClick={() => handleDismiss(action)}
                        className="px-2.5 py-1 text-[11px] font-medium obs-text-muted obs-bg-secondary border obs-border-primary rounded-md hover:obs-bg-tertiary transition-colors"
                      >
                        却下
                      </button>
                    </div>
                  )}
                  {isExecuted && (
                    <span className="text-[10px] text-emerald-400 font-medium px-2 py-1">
                      実行済み
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Scenarios */}
      {response.scenarios.length > 0 && (
        <div className="mt-3 pt-3 border-t obs-border-secondary">
          <p className="text-[10px] obs-text-muted mb-2">シナリオマッチ:</p>
          <div className="space-y-1">
            {response.scenarios.map((scenario, idx) => (
              <div key={idx} className="text-[11px] obs-text-tertiary p-1.5 rounded obs-bg-secondary">
                {String(scenario.name ?? scenario.scenario_name ?? `Scenario ${idx + 1}`)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
