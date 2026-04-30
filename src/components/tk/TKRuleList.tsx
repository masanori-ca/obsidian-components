import { useState } from 'react';
import { motion } from 'framer-motion';

export interface TKRule {
  id: string;
  condition: string;
  action: string;
  confidence: number;
  contributor?: string;
  tags?: string[];
  relatedNodes?: string[];
  source?: 'expert' | 'sensor_pattern' | 'llm_inference' | 'legal';
}

interface TKRuleListProps {
  rules: TKRule[];
  selectedId?: string | null;
  onSelect?: (rule: TKRule) => void;
  onEdit?: (rule: TKRule) => void;
}

const SOURCE_LABELS: Record<string, { label: string; color: string }> = {
  expert:         { label: '専門家', color: '#34d399' },
  sensor_pattern: { label: 'パターン', color: '#38bdf8' },
  llm_inference:  { label: 'LLM推論', color: '#a78bfa' },
  legal:          { label: '法令', color: '#fbbf24' },
};

/**
 * List of TK (Tacit Knowledge) rules.
 * Shows condition → action with confidence, tags, and source.
 */
export function TKRuleList({ rules, selectedId, onSelect, onEdit }: TKRuleListProps) {
  const [filter, setFilter] = useState('');

  const filtered = filter
    ? rules.filter((r) =>
        r.condition.toLowerCase().includes(filter.toLowerCase()) ||
        r.action.toLowerCase().includes(filter.toLowerCase()),
      )
    : rules;

  return (
    <div className="obs-card overflow-hidden">
      <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--obs-border-primary)' }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold obs-text-primary">暗黙知ルール</h3>
          <span className="text-[10px] obs-text-muted">{filtered.length}件</span>
        </div>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="ルールを検索..."
          className="w-full px-2.5 py-1.5 text-xs rounded-md obs-text-primary"
          style={{ backgroundColor: 'var(--obs-bg-tertiary)', border: '1px solid var(--obs-border-secondary)' }}
        />
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {filtered.map((rule, idx) => {
          const src = SOURCE_LABELS[rule.source ?? 'expert'] ?? SOURCE_LABELS.expert;
          return (
            <motion.div
              key={rule.id}
              onClick={() => onSelect?.(rule)}
              className="px-4 py-3 cursor-pointer transition-colors"
              style={{
                backgroundColor: rule.id === selectedId ? 'rgba(251,191,36,0.06)' : 'transparent',
                borderBottom: '1px solid var(--obs-border-subtle)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: Math.min(idx * 0.02, 0.3) }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] obs-text-secondary mb-0.5">
                    <span className="obs-text-muted">IF </span>
                    <span className="font-medium">{rule.condition}</span>
                  </div>
                  <div className="text-[11px] obs-text-primary">
                    <span className="obs-text-muted">THEN </span>
                    <span className="font-medium">{rule.action}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: `${src.color}15`, color: src.color }}>
                    {src.label}
                  </span>
                  <span className="text-[10px] font-mono obs-text-muted">{(rule.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-1.5">
                {rule.contributor && <span className="text-[9px] obs-text-muted">by {rule.contributor}</span>}
                {rule.tags && rule.tags.slice(0, 3).map((t) => (
                  <span key={t} className="text-[8px] obs-text-muted px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--obs-bg-tertiary)' }}>{t}</span>
                ))}
                {onEdit && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(rule); }}
                    className="text-[9px] ml-auto" style={{ color: 'var(--obs-accent)' }}
                  >
                    編集
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
