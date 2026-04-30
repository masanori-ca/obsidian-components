import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: number | string;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md';
  fullWidth?: boolean;
}

/**
 * Tab navigation component matching Obsidian Design System.
 * Variants: default (bordered), pills (filled), underline.
 */
export function Tabs({ tabs, activeId, onChange, variant = 'default', size = 'md', fullWidth = false }: TabsProps) {
  const sizeClass = size === 'sm' ? 'text-[10px] py-1.5 px-2.5' : 'text-xs py-2 px-3.5';

  return (
    <div
      className={`flex ${fullWidth ? 'w-full' : 'inline-flex'} ${variant === 'underline' ? '' : 'gap-1'}`}
      style={{
        backgroundColor: variant === 'default' ? 'var(--obs-bg-secondary)' : 'transparent',
        borderRadius: variant === 'underline' ? 0 : '8px',
        padding: variant === 'underline' ? 0 : '3px',
        borderBottom: variant === 'underline' ? '1px solid var(--obs-border-primary)' : 'none',
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onChange(tab.id)}
            disabled={tab.disabled}
            className={`relative flex items-center gap-1.5 font-medium transition-colors disabled:opacity-30 ${sizeClass} ${fullWidth ? 'flex-1 justify-center' : ''}`}
            style={{
              borderRadius: variant === 'underline' ? 0 : '6px',
              backgroundColor: isActive && variant !== 'underline' ? 'var(--obs-bg-card)' : 'transparent',
              color: isActive ? 'var(--obs-accent-default)' : 'var(--obs-text-tertiary)',
              boxShadow: isActive && variant === 'default' ? 'var(--obs-shadow-sm)' : 'none',
            }}
          >
            {tab.icon && <span className="w-3.5 h-3.5">{tab.icon}</span>}
            {tab.label}
            {tab.badge !== undefined && (
              <span
                className="text-[8px] font-bold px-1 py-0.5 rounded-full"
                style={{ backgroundColor: 'var(--obs-accent-bg)', color: 'var(--obs-accent-default)' }}
              >
                {tab.badge}
              </span>
            )}
            {isActive && variant === 'underline' && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: 'var(--obs-accent-default)' }}
                layoutId="tab-underline"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
