import { motion } from 'framer-motion';

type StepStatus = 'pending' | 'active' | 'done' | 'error';

interface WorkflowStepProps {
  title: string;
  description?: string;
  status: StepStatus;
  duration?: string;
  isLast?: boolean;
}

const STATUS_CONFIG: Record<StepStatus, { icon: string; color: string; bg: string; border: string }> = {
  pending: { icon: '◇', color: 'var(--obs-text-muted)',      bg: 'transparent',                    border: 'var(--obs-border-primary)' },
  active:  { icon: '◆', color: 'var(--obs-accent-default)',  bg: 'var(--obs-accent-bg)',            border: 'var(--obs-accent-default)' },
  done:    { icon: '✓', color: 'var(--obs-status-success)',  bg: 'var(--obs-status-successBg)',     border: 'var(--obs-status-success)' },
  error:   { icon: '!', color: 'var(--obs-status-danger)',   bg: 'var(--obs-status-dangerBg)',      border: 'var(--obs-status-danger)' },
};

/**
 * Workflow step component matching Figma AI Agent page.
 * Diamond icon with pending/active/done/error states.
 */
export function WorkflowStep({ title, description, status, duration }: WorkflowStepProps) {
  const config = STATUS_CONFIG[status];

  return (
    <div>
      <motion.div
        className="flex items-center gap-3 px-4 py-3 rounded-lg"
        style={{
          backgroundColor: status === 'pending' ? 'transparent' : config.bg,
          borderLeft: `3px solid ${status === 'pending' ? 'var(--obs-border-subtle)' : config.border}`,
        }}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
      >
        {/* Diamond icon */}
        <span
          className="text-lg shrink-0"
          style={{ color: config.color }}
        >
          {config.icon === '✓' ? '◆' : config.icon}
          {status === 'done' && <span className="absolute text-[10px]">✓</span>}
        </span>

        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium" style={{ color: status === 'pending' ? 'var(--obs-text-secondary)' : 'var(--obs-text-primary)' }}>
            {title}
          </span>
          {description && (
            <p className="text-[11px]" style={{ color: 'var(--obs-text-tertiary)' }}>{description}</p>
          )}
        </div>

        {duration && (
          <span className="text-xs font-mono shrink-0" style={{ color: 'var(--obs-text-muted)' }}>{duration}</span>
        )}
      </motion.div>
    </div>
  );
}
