import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const VARIANT_STYLES: Record<ButtonVariant, { base: string; style: Record<string, string> }> = {
  primary: {
    base: 'font-medium',
    style: {
      backgroundColor: 'var(--obs-accent-default)',
      color: 'var(--obs-text-inverse)',
      border: 'none',
    },
  },
  secondary: {
    base: 'font-medium',
    style: {
      backgroundColor: 'var(--obs-bg-tertiary)',
      color: 'var(--obs-text-primary)',
      border: '1px solid var(--obs-border-primary)',
    },
  },
  outline: {
    base: 'font-medium',
    style: {
      backgroundColor: 'transparent',
      color: 'var(--obs-accent-default)',
      border: '1px solid var(--obs-accent-default)',
    },
  },
  ghost: {
    base: 'font-medium',
    style: {
      backgroundColor: 'transparent',
      color: 'var(--obs-text-secondary)',
      border: '1px solid transparent',
    },
  },
  danger: {
    base: 'font-medium',
    style: {
      backgroundColor: 'var(--obs-status-dangerBg)',
      color: 'var(--obs-status-danger)',
      border: '1px solid var(--obs-status-danger)',
    },
  },
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-2.5 py-1 text-[11px] rounded-md gap-1',
  md: 'px-3.5 py-2 text-xs rounded-lg gap-1.5',
  lg: 'px-5 py-2.5 text-sm rounded-lg gap-2',
};

/**
 * Button component matching Obsidian Design System.
 * Variants: primary (emerald), secondary, outline, ghost, danger.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className = '',
  onClick,
  type = 'button',
}: ButtonProps) {
  const v = VARIANT_STYLES[variant];

  return (
    <motion.button
      className={`inline-flex items-center justify-center transition-opacity ${v.base} ${SIZE_CLASSES[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      style={{
        ...v.style,
        opacity: disabled || loading ? 0.4 : 1,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
      }}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      whileHover={!disabled && !loading ? { opacity: 0.85 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
    >
      {loading ? (
        <motion.span
          className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
        />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
      {iconRight && <span className="shrink-0">{iconRight}</span>}
    </motion.button>
  );
}
