import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

/**
 * Form input matching Obsidian Design System.
 * Supports label, description, error state, and icon prefix.
 */
export function Input({
  label,
  description,
  error,
  icon,
  fullWidth = true,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className={`${fullWidth ? 'w-full' : 'inline-flex flex-col'}`}>
      {label && (
        <label
          className="text-[11px] font-semibold uppercase tracking-wider mb-1"
          style={{ color: 'var(--obs-text-tertiary)' }}
        >
          {label}
        </label>
      )}
      {description && (
        <p className="text-[10px] mb-1.5" style={{ color: 'var(--obs-text-muted)' }}>
          {description}
        </p>
      )}
      <div className="relative">
        {icon && (
          <span
            className="absolute left-2.5 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--obs-text-muted)' }}
          >
            {icon}
          </span>
        )}
        <input
          className={`w-full px-3 py-2 text-sm rounded-lg transition-colors focus:outline-none ${icon ? 'pl-8' : ''} ${className}`}
          style={{
            backgroundColor: 'var(--obs-bg-tertiary)',
            border: `1px solid ${error ? 'var(--obs-status-danger)' : 'var(--obs-border-primary)'}`,
            color: 'var(--obs-text-primary)',
          }}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[10px] mt-1" style={{ color: 'var(--obs-status-danger)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
