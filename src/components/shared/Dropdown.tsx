import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

interface DropdownOption {
  value: string;
  label: string;
  icon?: ReactNode;
  description?: string;
  disabled?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

/**
 * Dropdown/Select component matching Obsidian Design System.
 */
export function Dropdown({ options, value, onChange, placeholder = '選択...', label, disabled = false, fullWidth = true }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className={`relative ${fullWidth ? 'w-full' : 'inline-block'}`}>
      {label && (
        <label className="text-[11px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--obs-text-tertiary)' }}>
          {label}
        </label>
      )}

      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors disabled:opacity-40"
        style={{
          backgroundColor: 'var(--obs-bg-tertiary)',
          border: `1px solid ${isOpen ? 'var(--obs-accent-default)' : 'var(--obs-border-primary)'}`,
          color: selected ? 'var(--obs-text-primary)' : 'var(--obs-text-muted)',
        }}
      >
        <div className="flex items-center gap-2 truncate">
          {selected?.icon && <span className="shrink-0">{selected.icon}</span>}
          <span className="truncate">{selected?.label ?? placeholder}</span>
        </div>
        <span className="text-[10px] obs-text-muted ml-2">▼</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-1 rounded-lg overflow-hidden z-40"
            style={{
              backgroundColor: 'var(--obs-bg-card)',
              border: '1px solid var(--obs-border-primary)',
              boxShadow: 'var(--obs-shadow-lg)',
            }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            <div className="max-h-[200px] overflow-y-auto py-1">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setIsOpen(false); }}
                  disabled={opt.disabled}
                  className="w-full text-left px-3 py-2 text-xs transition-colors disabled:opacity-30"
                  style={{
                    backgroundColor: opt.value === value ? 'var(--obs-accent-bg)' : 'transparent',
                    color: opt.value === value ? 'var(--obs-accent-default)' : 'var(--obs-text-secondary)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                    <div>
                      <div className="font-medium">{opt.label}</div>
                      {opt.description && <div className="text-[10px] obs-text-muted">{opt.description}</div>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
