import { motion } from 'framer-motion';

type StatusType = 'online' | 'offline' | 'warning' | 'critical' | 'maintenance' | 'connecting' | 'success' | 'error';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  pulse?: boolean;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<StatusType, { label: string; color: string; bg: string; border: string; defaultPulse: boolean }> = {
  online:      { label: '稼働中',     color: 'var(--obs-success)',  bg: 'var(--obs-success-bg)',  border: 'var(--obs-success)',  defaultPulse: false },
  offline:     { label: 'オフライン', color: 'var(--obs-text-muted)', bg: 'var(--obs-bg-tertiary)', border: 'var(--obs-text-muted)', defaultPulse: false },
  warning:     { label: '警告',       color: 'var(--obs-warning)',  bg: 'var(--obs-warning-bg)',  border: 'var(--obs-warning)',  defaultPulse: true },
  critical:    { label: '異常',       color: 'var(--obs-danger)',   bg: 'var(--obs-danger-bg)',   border: 'var(--obs-danger)',   defaultPulse: true },
  maintenance: { label: 'メンテ',     color: 'var(--obs-info)',     bg: 'var(--obs-info-bg)',     border: 'var(--obs-info)',     defaultPulse: false },
  connecting:  { label: '接続中',     color: 'var(--obs-warning)',  bg: 'var(--obs-warning-bg)',  border: 'var(--obs-warning)',  defaultPulse: true },
  success:     { label: '成功',       color: 'var(--obs-success)',  bg: 'var(--obs-success-bg)',  border: 'var(--obs-success)',  defaultPulse: false },
  error:       { label: 'エラー',     color: 'var(--obs-danger)',   bg: 'var(--obs-danger-bg)',   border: 'var(--obs-danger)',   defaultPulse: true },
};

/**
 * Reusable status badge with animated pulse for active states.
 */
export function StatusBadge({ status, label, pulse, size = 'sm' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.offline;
  const shouldPulse = pulse ?? config.defaultPulse;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
      style={{ color: config.color, backgroundColor: config.bg, borderColor: `${config.border}44` }}
    >
      {shouldPulse ? (
        <motion.span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: config.color }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      ) : (
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.color }} />
      )}
      {label ?? config.label}
    </span>
  );
}
