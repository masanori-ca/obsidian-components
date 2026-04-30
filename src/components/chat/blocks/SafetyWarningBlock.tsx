import { motion } from 'framer-motion';
import type { CBFViolation } from '@/lib/pck-client';

interface SafetyWarningBlockProps {
  type: 'block' | 'warn' | 'info';
  title: string;
  message: string;
  violations?: CBFViolation[];
  source?: string;
}

const TYPE_STYLES: Record<string, { color: string; bg: string; border: string; icon: string }> = {
  block: { color: 'var(--obs-danger)', bg: 'var(--obs-danger-bg)', border: 'var(--obs-danger)', icon: '✗' },
  warn:  { color: 'var(--obs-warning)', bg: 'var(--obs-warning-bg)', border: 'var(--obs-warning)', icon: '!' },
  info:  { color: 'var(--obs-info)', bg: 'var(--obs-info-bg)', border: 'var(--obs-info)', icon: 'i' },
};

/**
 * Safety warning/block notification for chat messages.
 * Used when CBF violations or safety constraints are triggered.
 */
export function SafetyWarningBlock({ type, title, message, violations = [], source }: SafetyWarningBlockProps) {
  const style = TYPE_STYLES[type] ?? TYPE_STYLES.info;

  return (
    <motion.div
      className="rounded-lg overflow-hidden my-2"
      style={{ border: `1px solid ${style.border}44`, backgroundColor: style.bg }}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold"
            style={{ backgroundColor: `${style.border}22`, color: style.color }}
          >
            {style.icon}
          </span>
          <span className="text-[11px] font-semibold" style={{ color: style.color }}>{title}</span>
          {source && <span className="text-[8px] obs-text-muted ml-auto">{source}</span>}
        </div>
        <p className="text-[11px] obs-text-secondary ml-7">{message}</p>
      </div>

      {violations.length > 0 && (
        <div className="px-3 py-1.5" style={{ borderTop: `1px solid ${style.border}22` }}>
          {violations.map((v, i) => (
            <div key={i} className="flex items-center justify-between py-0.5 text-[10px]">
              <span className="font-mono obs-text-secondary">{v.variable}</span>
              <span className="font-mono" style={{ color: style.color }}>
                {v.actual?.toFixed(2)} {v.operator} {v.threshold?.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
