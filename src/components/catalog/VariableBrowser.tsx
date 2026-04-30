import { useState } from 'react';
import { motion } from 'framer-motion';

export interface CatalogVariable {
  id: string;
  symbol: string;
  name: string;
  nameJa?: string;
  unit?: string;
  discipline?: string;
  subDiscipline?: string;
  description?: string;
  aliases?: string[];
}

interface VariableBrowserProps {
  variables: CatalogVariable[];
  selectedId?: string | null;
  onSelect?: (variable: CatalogVariable) => void;
  isLoading?: boolean;
}

/**
 * Browsable list of PCK Catalog variables.
 * Shows symbol, name, unit, discipline with selection.
 */
export function VariableBrowser({ variables, selectedId, onSelect, isLoading = false }: VariableBrowserProps) {
  const [filter, setFilter] = useState('');

  const filtered = filter
    ? variables.filter((v) =>
        v.symbol.toLowerCase().includes(filter.toLowerCase()) ||
        v.name.toLowerCase().includes(filter.toLowerCase()) ||
        (v.nameJa ?? '').includes(filter),
      )
    : variables;

  return (
    <div className="obs-card overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--obs-border-primary)' }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold obs-text-primary">変数カタログ</h3>
          <span className="text-[10px] obs-text-muted">{filtered.length} / {variables.length}</span>
        </div>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="フィルタ..."
          className="w-full px-2.5 py-1.5 text-xs rounded-md obs-text-primary"
          style={{ backgroundColor: 'var(--obs-bg-tertiary)', border: '1px solid var(--obs-border-secondary)' }}
        />
      </div>

      {/* List */}
      <div className="max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <motion.div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full mx-auto" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
            <p className="text-xs obs-text-muted mt-2">読み込み中...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs obs-text-muted">該当する変数がありません</div>
        ) : (
          filtered.map((v, idx) => (
            <motion.button
              key={v.id}
              onClick={() => onSelect?.(v)}
              className="w-full text-left px-4 py-2.5 transition-colors"
              style={{
                backgroundColor: v.id === selectedId ? 'var(--obs-accent-bg)' : 'transparent',
                borderBottom: '1px solid var(--obs-border-subtle)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: Math.min(idx * 0.01, 0.3) }}
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <span className="text-xs font-mono font-bold" style={{ color: 'var(--obs-accent)' }}>{v.symbol}</span>
                  <span className="text-[11px] obs-text-secondary ml-2 truncate">{v.nameJa ?? v.name}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {v.unit && <span className="text-[9px] obs-text-muted px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--obs-bg-tertiary)' }}>{v.unit}</span>}
                  {v.discipline && <span className="text-[9px] obs-text-muted">{v.discipline}</span>}
                </div>
              </div>
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
}
