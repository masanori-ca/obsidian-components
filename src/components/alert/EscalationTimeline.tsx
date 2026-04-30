import { motion } from 'framer-motion';
import type { EscalationSeverity } from '@/lib/pck-client';

interface EscalationTimelineProps {
  severity: EscalationSeverity;
  onReset?: () => void;
}

interface LevelConfig {
  level: number;
  label: string;
  description: string;
  threshold: string;
  color: string;
  bg: string;
  border: string;
}

const LEVELS: LevelConfig[] = [
  {
    level: 1,
    label: 'L1: Zone Detection',
    description: 'ベースラインからの偏差検知',
    threshold: '初回検知',
    color: 'text-sky-400',
    bg: 'bg-sky-400/15',
    border: 'border-sky-400/40',
  },
  {
    level: 2,
    label: 'L2: Brain Evaluation',
    description: 'Brain因果推論による診断',
    threshold: '3回連続違反',
    color: 'text-amber-400',
    bg: 'bg-amber-400/15',
    border: 'border-amber-400/40',
  },
  {
    level: 3,
    label: 'L3: Causal Analysis',
    description: '因果グラフ探索で根本原因特定',
    threshold: '6回連続違反',
    color: 'text-orange-400',
    bg: 'bg-orange-400/15',
    border: 'border-orange-400/40',
  },
  {
    level: 4,
    label: 'L4: Simulation',
    description: 'シミュレータ検証 + What-If',
    threshold: '10回連続違反',
    color: 'text-red-400',
    bg: 'bg-red-400/15',
    border: 'border-red-400/40',
  },
];

/**
 * Visualizes the 4-level escalation state machine from PCK Alert Service.
 * L1→L2(3x)→L3(6x)→L4(10x), recovery after 5 consecutive normals.
 */
export function EscalationTimeline({ severity, onReset }: EscalationTimelineProps) {
  const currentLevel = severity.current_level;
  const escalated = severity.escalated;

  return (
    <div className="rounded-xl border obs-border-primary obs-bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold obs-text-primary">
          エスカレーション状態
        </h3>
        {escalated && (
          <motion.span
            className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ESCALATED
          </motion.span>
        )}
      </div>

      {/* Level progression */}
      <div className="space-y-2">
        {LEVELS.map((lvl, idx) => {
          const isActive = currentLevel >= lvl.level;
          const isCurrent = currentLevel === lvl.level;

          return (
            <motion.div
              key={lvl.level}
              className={`relative flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                isCurrent
                  ? `${lvl.bg} ${lvl.border}`
                  : isActive
                    ? `obs-bg-secondary obs-border-secondary`
                    : 'obs-bg-card obs-border-secondary'
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              {/* Connector line */}
              {idx < LEVELS.length - 1 && (
                <div className={`absolute left-[1.35rem] top-[2.75rem] w-px h-[calc(100%-1rem)] ${
                  isActive ? lvl.color.replace('text-', 'bg-') : 'obs-bg-tertiary'
                }`} />
              )}

              {/* Circle indicator */}
              <div className={`relative z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                isCurrent
                  ? `${lvl.border} ${lvl.bg}`
                  : isActive
                    ? 'obs-border-primary obs-bg-tertiary'
                    : 'obs-border-primary obs-bg-primary'
              }`}>
                {isCurrent && (
                  <motion.div
                    className={`w-2 h-2 rounded-full ${lvl.color.replace('text-', 'bg-')}`}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                {isActive && !isCurrent && (
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${isCurrent ? lvl.color : isActive ? 'obs-text-tertiary' : 'obs-text-muted'}`}>
                    {lvl.label}
                  </span>
                  <span className={`text-[10px] ${isCurrent ? 'obs-text-tertiary' : 'obs-text-muted'}`}>
                    {lvl.threshold}
                  </span>
                </div>
                <p className={`text-[11px] mt-0.5 ${isCurrent ? 'obs-text-tertiary' : 'obs-text-muted'}`}>
                  {lvl.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="p-2 rounded-lg obs-bg-secondary border obs-border-secondary">
          <div className="text-[10px] obs-text-muted">連続違反</div>
          <div className={`text-lg font-mono font-bold ${severity.consecutive_violations > 0 ? 'text-red-400' : 'obs-text-tertiary'}`}>
            {severity.consecutive_violations}
          </div>
        </div>
        <div className="p-2 rounded-lg obs-bg-secondary border obs-border-secondary">
          <div className="text-[10px] obs-text-muted">連続正常</div>
          <div className={`text-lg font-mono font-bold ${severity.consecutive_compliant >= 5 ? 'text-emerald-400' : 'obs-text-tertiary'}`}>
            {severity.consecutive_compliant}
            <span className="text-[10px] obs-text-muted font-normal ml-1">/5で復帰</span>
          </div>
        </div>
      </div>

      {/* Reset button */}
      {onReset && currentLevel > 1 && (
        <button
          onClick={onReset}
          className="mt-3 w-full py-1.5 text-xs font-medium obs-text-tertiary border obs-border-primary rounded-lg hover:obs-bg-secondary transition-colors"
        >
          L1にリセット
        </button>
      )}
    </div>
  );
}
