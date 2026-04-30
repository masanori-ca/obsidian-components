import { motion } from 'framer-motion';
import type { AutopilotCycleResult } from '@/lib/pck-client';
import { ZoneIndicator, type Zone } from '@/components/alert/ZoneIndicator';

interface AgentDecisionFlowProps {
  cycleResult: AutopilotCycleResult | null;
  compact?: boolean;
}

interface FlowNode {
  id: string;
  label: string;
  sublabel: string;
  status: 'inactive' | 'active' | 'pass' | 'fail';
}

/**
 * Visual flow diagram: Sense → Diagnose → Decide → Act → Learn.
 * Maps to Brain Autopilot 5-phase cycle.
 */
export function AgentDecisionFlow({ cycleResult, compact = false }: AgentDecisionFlowProps) {
  const hasResult = !!cycleResult;
  const zone = (cycleResult?.overall_zone ?? 'N') as Zone;
  const needsAction = zone !== 'N' && zone !== 'W';

  const nodes: FlowNode[] = [
    {
      id: 'sense',
      label: 'Sense',
      sublabel: hasResult ? `${cycleResult.deviations.length}変数監視` : '待機中',
      status: hasResult ? 'pass' : 'inactive',
    },
    {
      id: 'diagnose',
      label: 'Diagnose',
      sublabel: hasResult
        ? (cycleResult.diagnoses && Object.keys(cycleResult.diagnoses).length > 0
          ? '原因特定済み'
          : '異常なし')
        : '待機中',
      status: hasResult ? (needsAction ? 'active' : 'pass') : 'inactive',
    },
    {
      id: 'decide',
      label: 'Decide',
      sublabel: hasResult
        ? (cycleResult.top_scenario ? 'シナリオ選定済み' : '対応不要')
        : '待機中',
      status: hasResult ? (cycleResult.top_scenario ? 'active' : 'pass') : 'inactive',
    },
    {
      id: 'act',
      label: 'Act',
      sublabel: hasResult
        ? (cycleResult.actions && cycleResult.actions.length > 0
          ? `${cycleResult.actions.length}件のアクション`
          : '実行なし')
        : '待機中',
      status: hasResult
        ? (cycleResult.actions && cycleResult.actions.length > 0 ? 'active' : 'pass')
        : 'inactive',
    },
    {
      id: 'learn',
      label: 'Learn',
      sublabel: 'フィードバック待ち',
      status: hasResult ? 'pass' : 'inactive',
    },
  ];

  const statusColor: Record<string, { dot: string; text: string; line: string }> = {
    inactive: { dot: 'obs-bg-tertiary', text: 'obs-text-muted', line: 'obs-bg-tertiary' },
    active:   { dot: 'bg-sky-400',  text: 'text-sky-400',  line: 'bg-sky-400/50' },
    pass:     { dot: 'bg-emerald-400', text: 'obs-text-secondary', line: 'bg-emerald-400/30' },
    fail:     { dot: 'bg-red-400',  text: 'text-red-400',  line: 'bg-red-400/50' },
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {nodes.map((node, idx) => {
          const colors = statusColor[node.status];
          return (
            <div key={node.id} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${colors.dot}`} title={node.label} />
              {idx < nodes.length - 1 && (
                <div className={`w-3 h-px ${colors.line}`} />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="rounded-xl border obs-border-primary obs-bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold obs-text-primary">判断フロー</h3>
        {hasResult && <ZoneIndicator zone={zone} compact />}
      </div>

      <div className="flex items-start justify-between">
        {nodes.map((node, idx) => {
          const colors = statusColor[node.status];
          return (
            <div key={node.id} className="flex items-start flex-1">
              <div className="flex flex-col items-center flex-1">
                <motion.div
                  className={`w-8 h-8 rounded-full ${colors.dot} flex items-center justify-center`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: node.status === 'active' ? [1, 1.1, 1] : 1 }}
                  transition={node.status === 'active' ? { duration: 1.5, repeat: Infinity } : {}}
                >
                  <span className="text-[10px] font-bold obs-text-inverse">
                    {node.status === 'pass' ? '✓' : node.status === 'fail' ? '✗' : (idx + 1)}
                  </span>
                </motion.div>
                <span className={`text-[10px] font-semibold mt-1.5 ${colors.text}`}>
                  {node.label}
                </span>
                <span className="text-[9px] obs-text-muted text-center mt-0.5 max-w-[70px]">
                  {node.sublabel}
                </span>
              </div>
              {idx < nodes.length - 1 && (
                <div className={`h-px flex-1 mt-4 ${colors.line}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
