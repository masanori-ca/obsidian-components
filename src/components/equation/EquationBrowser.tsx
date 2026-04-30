import { useState } from 'react';
import { motion } from 'framer-motion';

export interface CatalogEquation {
  id: string;
  name: string;
  expression: string;
  inputVars: string[];
  outputVar: string;
  domain?: string;
  source?: string;
  description?: string;
}

interface EquationBrowserProps {
  equations: CatalogEquation[];
  selectedId?: string | null;
  onSelect?: (equation: CatalogEquation) => void;
  isLoading?: boolean;
}

/**
 * Browsable list of PCK Equation Registry formulas (315+).
 */
export function EquationBrowser({ equations, selectedId, onSelect, isLoading = false }: EquationBrowserProps) {
  const [filter, setFilter] = useState('');

  const filtered = filter
    ? equations.filter((eq) =>
        eq.name.toLowerCase().includes(filter.toLowerCase()) ||
        eq.expression.toLowerCase().includes(filter.toLowerCase()) ||
        eq.outputVar.toLowerCase().includes(filter.toLowerCase()),
      )
    : equations;

  return (
    <div className="obs-card overflow-hidden">
      <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--obs-border-primary)' }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold obs-text-primary">方程式レジストリ</h3>
          <span className="text-[10px] obs-text-muted">{filtered.length} / {equations.length}</span>
        </div>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="方程式を検索..."
          className="w-full px-2.5 py-1.5 text-xs rounded-md obs-text-primary"
          style={{ backgroundColor: 'var(--obs-bg-tertiary)', border: '1px solid var(--obs-border-secondary)' }}
        />
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <motion.div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full mx-auto" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
          </div>
        ) : filtered.map((eq, idx) => (
          <motion.button
            key={eq.id}
            onClick={() => onSelect?.(eq)}
            className="w-full text-left px-4 py-3 transition-colors"
            style={{
              backgroundColor: eq.id === selectedId ? 'rgba(167,139,250,0.08)' : 'transparent',
              borderBottom: '1px solid var(--obs-border-subtle)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: Math.min(idx * 0.01, 0.3) }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium obs-text-primary">{eq.name}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: 'rgba(167,139,250,0.1)', color: '#a78bfa' }}>
                → {eq.outputVar}
              </span>
            </div>
            <div className="text-[10px] font-mono obs-text-tertiary truncate">{eq.expression}</div>
            <div className="flex gap-1 mt-1">
              {eq.inputVars.slice(0, 4).map((v) => (
                <span key={v} className="text-[8px] obs-text-muted px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--obs-bg-tertiary)' }}>{v}</span>
              ))}
              {eq.inputVars.length > 4 && <span className="text-[8px] obs-text-muted">+{eq.inputVars.length - 4}</span>}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
