import { useState } from 'react';

interface ThresholdEntry {
  variable: string;
  ll?: number;
  l?: number;
  h?: number;
  hh?: number;
  unit?: string;
  currentValue?: number;
}

interface ThresholdEditorProps {
  thresholds: ThresholdEntry[];
  onChange?: (variable: string, field: 'll' | 'l' | 'h' | 'hh', value: number) => void;
  onSave?: (thresholds: ThresholdEntry[]) => void;
}

/**
 * Per-variable threshold editor (LL/L/H/HH).
 * Highlights current value against thresholds.
 */
export function ThresholdEditor({ thresholds, onChange, onSave }: ThresholdEditorProps) {
  const [edited, setEdited] = useState<Set<string>>(new Set());

  const handleChange = (variable: string, field: 'll' | 'l' | 'h' | 'hh', value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setEdited((prev) => new Set(prev).add(variable));
      onChange?.(variable, field, num);
    }
  };

  const getValueStatus = (entry: ThresholdEntry): string => {
    if (entry.currentValue === undefined) return 'none';
    const v = entry.currentValue;
    if (entry.hh !== undefined && v >= entry.hh) return 'hh';
    if (entry.h !== undefined && v >= entry.h) return 'h';
    if (entry.ll !== undefined && v <= entry.ll) return 'll';
    if (entry.l !== undefined && v <= entry.l) return 'l';
    return 'normal';
  };

  const STATUS_COLORS: Record<string, string> = {
    hh: '#ef4444', h: '#fb923c', l: '#fbbf24', ll: '#ef4444', normal: 'var(--obs-success)', none: 'var(--obs-text-muted)',
  };

  return (
    <div className="obs-card overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--obs-border-primary)' }}>
        <h3 className="text-sm font-semibold obs-text-primary">閾値設定</h3>
        {edited.size > 0 && onSave && (
          <button
            onClick={() => { onSave(thresholds); setEdited(new Set()); }}
            className="text-[10px] px-2.5 py-1 rounded-md font-medium"
            style={{ backgroundColor: 'var(--obs-success-bg)', color: 'var(--obs-success)' }}
          >
            保存 ({edited.size})
          </button>
        )}
      </div>

      {/* Header */}
      <div className="grid grid-cols-7 px-4 py-2 text-[8px] obs-text-muted uppercase" style={{ backgroundColor: 'var(--obs-bg-secondary)' }}>
        <span className="col-span-2">変数</span>
        <span className="text-center">LL</span>
        <span className="text-center">L</span>
        <span className="text-center">現在値</span>
        <span className="text-center">H</span>
        <span className="text-center">HH</span>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {thresholds.map((entry) => {
          const status = getValueStatus(entry);
          return (
            <div
              key={entry.variable}
              className="grid grid-cols-7 px-4 py-2 items-center gap-1"
              style={{ borderBottom: '1px solid var(--obs-border-subtle)' }}
            >
              <div className="col-span-2">
                <span className="text-[11px] font-mono obs-text-primary">{entry.variable}</span>
                {entry.unit && <span className="text-[9px] obs-text-muted ml-1">{entry.unit}</span>}
              </div>
              {(['ll', 'l'] as const).map((f) => (
                <input
                  key={f}
                  type="number"
                  value={entry[f] ?? ''}
                  onChange={(e) => handleChange(entry.variable, f, e.target.value)}
                  className="w-full text-center text-[10px] font-mono px-1 py-1 rounded obs-text-primary"
                  style={{ backgroundColor: 'var(--obs-bg-tertiary)', border: `1px solid ${edited.has(entry.variable) ? 'var(--obs-warning)' : 'var(--obs-border-secondary)'}` }}
                  step="any"
                />
              ))}
              <div className="text-center text-[11px] font-mono font-bold" style={{ color: STATUS_COLORS[status] }}>
                {entry.currentValue?.toFixed(2) ?? '—'}
              </div>
              {(['h', 'hh'] as const).map((f) => (
                <input
                  key={f}
                  type="number"
                  value={entry[f] ?? ''}
                  onChange={(e) => handleChange(entry.variable, f, e.target.value)}
                  className="w-full text-center text-[10px] font-mono px-1 py-1 rounded obs-text-primary"
                  style={{ backgroundColor: 'var(--obs-bg-tertiary)', border: `1px solid ${edited.has(entry.variable) ? 'var(--obs-warning)' : 'var(--obs-border-secondary)'}` }}
                  step="any"
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
