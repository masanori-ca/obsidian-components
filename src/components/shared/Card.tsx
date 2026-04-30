import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  headerRight?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const PADDING: Record<string, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
};

/**
 * Generic card/panel component matching Obsidian Design System.
 * Optional header with title/subtitle, body, and footer.
 */
export function Card({ title, subtitle, headerRight, children, footer, padding = 'md', className = '', onClick }: CardProps) {
  return (
    <div
      className={`rounded-xl overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        backgroundColor: 'var(--obs-bg-card)',
        border: '1px solid var(--obs-border-primary)',
        boxShadow: 'var(--obs-shadow-sm)',
      }}
      onClick={onClick}
    >
      {(title || headerRight) && (
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: '1px solid var(--obs-border-subtle)' }}
        >
          <div>
            {title && <h3 className="text-sm font-semibold obs-text-primary">{title}</h3>}
            {subtitle && <p className="text-[10px] obs-text-muted mt-0.5">{subtitle}</p>}
          </div>
          {headerRight && <div>{headerRight}</div>}
        </div>
      )}

      <div className={PADDING[padding]}>{children}</div>

      {footer && (
        <div
          className="px-4 py-2.5"
          style={{ borderTop: '1px solid var(--obs-border-subtle)', backgroundColor: 'var(--obs-bg-secondary)' }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
