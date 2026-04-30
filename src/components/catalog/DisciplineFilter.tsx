import { useState } from 'react';
import { motion } from 'framer-motion';

interface Discipline {
  id: string;
  name: string;
  nameJa: string;
  count: number;
}

interface DisciplineFilterProps {
  disciplines: Discipline[];
  selected: string[];
  onChange: (selected: string[]) => void;
  compact?: boolean;
}

const DISCIPLINE_COLORS: Record<string, string> = {
  water_treatment: '#38bdf8',
  chemical_engineering: '#a78bfa',
  mechanical_engineering: '#fb923c',
  electrical_engineering: '#fbbf24',
  environmental: '#34d399',
  biology: '#4ade80',
  thermodynamics: '#f87171',
  fluid_mechanics: '#38bdf8',
  default: '#71717a',
};

/**
 * Multi-select filter for PCK Catalog disciplines (18 disciplines).
 * Shows discipline names with variable counts.
 */
export function DisciplineFilter({ disciplines, selected, onChange, compact = false }: DisciplineFilterProps) {
  const [expanded, setExpanded] = useState(!compact);

  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id],
    );
  };

  const displayList = expanded ? disciplines : disciplines.slice(0, 6);

  return (
    <div className="obs-card p-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold obs-text-primary">学問分野</h4>
        {selected.length > 0 && (
          <button onClick={() => onChange([])} className="text-[10px] obs-text-muted hover:obs-text-secondary">
            クリア ({selected.length})
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {displayList.map((d, idx) => {
          const isSelected = selected.includes(d.id);
          const color = DISCIPLINE_COLORS[d.id] ?? DISCIPLINE_COLORS.default;

          return (
            <motion.button
              key={d.id}
              onClick={() => toggle(d.id)}
              className="px-2 py-1 rounded-md text-[11px] font-medium transition-colors"
              style={{
                backgroundColor: isSelected ? `${color}22` : 'var(--obs-bg-tertiary)',
                border: `1px solid ${isSelected ? `${color}66` : 'var(--obs-border-secondary)'}`,
                color: isSelected ? color : 'var(--obs-text-tertiary)',
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.02 }}
            >
              {d.nameJa || d.name}
              <span className="ml-1 opacity-60">{d.count}</span>
            </motion.button>
          );
        })}
      </div>

      {compact && disciplines.length > 6 && (
        <button onClick={() => setExpanded(!expanded)} className="text-[10px] obs-text-muted mt-2 hover:obs-text-secondary">
          {expanded ? '折りたたむ' : `+${disciplines.length - 6} more`}
        </button>
      )}
    </div>
  );
}
