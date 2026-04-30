import { motion } from 'framer-motion';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent' | 'muted';
type BadgeSize = 'sm' | 'md' | 'lg';

interface NumberBadgeProps {
  value: number | string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  pulse?: boolean;
  className?: string;
}

const VARIANT_STYLES: Record<BadgeVariant, { color: string; bg: string; border: string }> = {
  default: { color: 'var(--obs-text-primary)',       bg: 'var(--obs-bg-tertiary)',         border: 'var(--obs-border-primary)' },
  success: { color: 'var(--obs-status-success)',      bg: 'var(--obs-status-successBg)',    border: 'var(--obs-status-success)' },
  warning: { color: 'var(--obs-status-warning)',      bg: 'var(--obs-status-warningBg)',    border: 'var(--obs-status-warning)' },
  danger:  { color: 'var(--obs-status-danger)',       bg: 'var(--obs-status-dangerBg)',     border: 'var(--obs-status-danger)' },
  info:    { color: 'var(--obs-status-info)',          bg: 'var(--obs-status-infoBg)',       border: 'var(--obs-status-info)' },
  accent:  { color: 'var(--obs-accent-default)',      bg: 'var(--obs-accent-bg)',           border: 'var(--obs-accent-default)' },
  muted:   { color: 'var(--obs-text-muted)',          bg: 'var(--obs-bg-secondary)',        border: 'var(--obs-border-secondary)' },
};

const SIZE_STYLES: Record<BadgeSize, { min: string; height: string; fontSize: string; padding: string }> = {
  sm: { min: '24px', height: '24px', fontSize: '10px', padding: '0 6px' },
  md: { min: '32px', height: '32px', fontSize: '13px', padding: '0 8px' },
  lg: { min: '44px', height: '44px', fontSize: '18px', padding: '0 12px' },
};

/**
 * Numeric badge matching Figma "42" badge variants.
 * Supports all status colors and sizes.
 */
export function NumberBadge({ value, variant = 'default', size = 'md', pulse = false, className = '' }: NumberBadgeProps) {
  const v = VARIANT_STYLES[variant];
  const s = SIZE_STYLES[size];

  return (
    <motion.span
      className={`inline-flex items-center justify-center rounded-lg font-mono font-bold ${className}`}
      style={{
        minWidth: s.min,
        height: s.height,
        fontSize: s.fontSize,
        padding: s.padding,
        color: v.color,
        backgroundColor: v.bg,
        border: `1px solid ${v.border}44`,
      }}
      animate={pulse ? { opacity: [1, 0.6, 1] } : {}}
      transition={pulse ? { duration: 1.5, repeat: Infinity } : {}}
    >
      {value}
    </motion.span>
  );
}
