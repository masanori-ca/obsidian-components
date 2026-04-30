import { motion } from 'framer-motion';

type LogStatus = 'info' | 'success' | 'warning' | 'error';

interface LogEntry {
  date: string;
  time: string;
  status: LogStatus;
  description: string;
}

interface SystemLogProps {
  title?: string;
  entries: LogEntry[];
  maxRows?: number;
}

const STATUS_COLORS: Record<LogStatus, string> = {
  info:    'var(--obs-status-info)',
  success: 'var(--obs-status-success)',
  warning: 'var(--obs-status-warning)',
  error:   'var(--obs-status-danger)',
};

/**
 * System log table matching Figma AI Agent design.
 * Date / Time / Status / Description columns.
 */
export function SystemLog({ title = 'System log', entries, maxRows = 10 }: SystemLogProps) {
  return (
    <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--obs-bg-card)', border: '1px solid var(--obs-border-primary)' }}>
      <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: '1px solid var(--obs-border-subtle)' }}>
        <span className="text-xs obs-text-muted">◷</span>
        <span className="text-xs font-medium obs-text-primary">{title}</span>
      </div>

      {/* Header */}
      <div className="grid grid-cols-[80px_70px_70px_1fr] px-4 py-1.5 text-[10px] obs-text-muted uppercase" style={{ backgroundColor: 'var(--obs-bg-secondary)' }}>
        <span>Date</span>
        <span>Time</span>
        <span>Status</span>
        <span>Description</span>
      </div>

      {/* Rows */}
      <div className="max-h-[300px] overflow-y-auto">
        {entries.slice(0, maxRows).map((entry, idx) => (
          <motion.div
            key={idx}
            className="grid grid-cols-[80px_70px_70px_1fr] px-4 py-2 text-xs items-center"
            style={{ borderBottom: '1px solid var(--obs-border-subtle)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: idx * 0.03 }}
          >
            <span className="obs-text-secondary">{entry.date}</span>
            <span className="font-mono obs-text-secondary">{entry.time}</span>
            <span className="font-medium" style={{ color: STATUS_COLORS[entry.status] }}>{entry.status}</span>
            <span className="obs-text-primary truncate">{entry.description}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
