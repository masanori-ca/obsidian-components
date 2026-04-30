import { useState } from 'react';

interface TagMapping {
  scadaTag: string;
  pckVariable: string;
  unit?: string;
  scaleFactor?: number;
  lastValue?: number;
}

interface TagMappingEditorProps {
  mappings: TagMapping[];
  onSave?: (mappings: TagMapping[]) => void;
  onAutoMap?: () => void;
}

/**
 * SCADA tag → PCK variable mapping editor.
 * Maps DataServer2/OPC-UA tags to PCK Catalog variables.
 */
export function TagMappingEditor({ mappings, onSave, onAutoMap }: TagMappingEditorProps) {
  const [filter, setFilter] = useState('');
  const filtered = filter
    ? mappings.filter((m) => m.scadaTag.toLowerCase().includes(filter.toLowerCase()) || m.pckVariable.toLowerCase().includes(filter.toLowerCase()))
    : mappings;

  return (
    <div className="obs-card overflow-hidden">
      <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--obs-border-primary)' }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold obs-text-primary">タグマッピング</h3>
          <div className="flex gap-2">
            {onAutoMap && (
              <button onClick={onAutoMap} className="text-[9px] px-2 py-1 rounded" style={{ backgroundColor: 'var(--obs-accent-bg)', color: 'var(--obs-accent)' }}>
                自動マッピング
              </button>
            )}
            {onSave && (
              <button onClick={() => onSave(mappings)} className="text-[9px] px-2 py-1 rounded" style={{ backgroundColor: 'var(--obs-success-bg)', color: 'var(--obs-success)' }}>
                保存
              </button>
            )}
          </div>
        </div>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="タグ/変数を検索..."
          className="w-full px-2.5 py-1.5 text-xs rounded-md obs-text-primary"
          style={{ backgroundColor: 'var(--obs-bg-tertiary)', border: '1px solid var(--obs-border-secondary)' }}
        />
      </div>

      {/* Header */}
      <div className="grid grid-cols-5 px-4 py-2 text-[8px] obs-text-muted uppercase" style={{ backgroundColor: 'var(--obs-bg-secondary)' }}>
        <span>SCADAタグ</span>
        <span>→</span>
        <span>PCK変数</span>
        <span className="text-center">倍率</span>
        <span className="text-right">最終値</span>
      </div>

      <div className="max-h-[350px] overflow-y-auto">
        {filtered.map((m) => (
          <div
            key={m.scadaTag}
            className="grid grid-cols-5 px-4 py-2 items-center"
            style={{ borderBottom: '1px solid var(--obs-border-subtle)' }}
          >
            <span className="text-[10px] font-mono obs-text-secondary truncate">{m.scadaTag}</span>
            <span className="text-[10px] obs-text-muted text-center">→</span>
            <span className="text-[10px] font-mono truncate" style={{ color: 'var(--obs-accent)' }}>{m.pckVariable}</span>
            <span className="text-[10px] font-mono obs-text-muted text-center">{m.scaleFactor ?? 1.0}</span>
            <span className="text-[10px] font-mono obs-text-tertiary text-right">
              {m.lastValue !== undefined ? m.lastValue.toFixed(2) : '—'}
              {m.unit && <span className="obs-text-muted ml-0.5">{m.unit}</span>}
            </span>
          </div>
        ))}
      </div>

      <div className="px-4 py-2 text-[9px] obs-text-muted" style={{ backgroundColor: 'var(--obs-bg-secondary)' }}>
        {mappings.length} マッピング定義
      </div>
    </div>
  );
}
