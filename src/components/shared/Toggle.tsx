import { motion } from 'framer-motion';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

/**
 * Toggle/Switch component matching Obsidian Design System.
 */
export function Toggle({ checked, onChange, label, description, disabled = false, size = 'md' }: ToggleProps) {
  const w = size === 'sm' ? 32 : 40;
  const h = size === 'sm' ? 18 : 22;
  const dot = size === 'sm' ? 14 : 18;

  return (
    <label
      className={`inline-flex items-start gap-2.5 ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        className="relative shrink-0 rounded-full transition-colors"
        style={{
          width: w,
          height: h,
          backgroundColor: checked ? 'var(--obs-accent-default)' : 'var(--obs-bg-tertiary)',
          border: `1px solid ${checked ? 'var(--obs-accent-default)' : 'var(--obs-border-primary)'}`,
        }}
      >
        <motion.div
          className="absolute top-0.5 rounded-full"
          style={{
            width: dot,
            height: dot,
            backgroundColor: checked ? 'var(--obs-text-inverse)' : 'var(--obs-text-muted)',
          }}
          animate={{ left: checked ? w - dot - 3 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
      {(label || description) && (
        <div>
          {label && <div className="text-xs font-medium obs-text-primary">{label}</div>}
          {description && <div className="text-[10px] obs-text-muted mt-0.5">{description}</div>}
        </div>
      )}
    </label>
  );
}
