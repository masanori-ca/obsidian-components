import { motion } from 'framer-motion';

export interface BaselineVersion {
  id: string;
  version: number;
  createdAt: string;
  source: 'simulator' | 'manual' | 'calibration';
  variableCount: number;
  isActive: boolean;
  notes?: string;
}

interface BaselineVersionListProps {
  versions: BaselineVersion[];
  onActivate?: (version: BaselineVersion) => void;
  onCompare?: (versionA: BaselineVersion, versionB: BaselineVersion) => void;
}

/**
 * Baseline version management list.
 * Shows version history with activate/compare actions.
 */
export function BaselineVersionList({ versions, onActivate, onCompare }: BaselineVersionListProps) {
  const SOURCE_LABELS: Record<string, { label: string; color: string }> = {
    simulator:   { label: 'シミュレータ', color: '#38bdf8' },
    manual:      { label: '手動', color: '#fbbf24' },
    calibration: { label: 'キャリブレーション', color: '#34d399' },
  };

  return (
    <div className="obs-card overflow-hidden">
      <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--obs-border-primary)' }}>
        <h3 className="text-sm font-semibold obs-text-primary">ベースラインバージョン</h3>
      </div>

      <div className="max-h-[350px] overflow-y-auto">
        {versions.map((v, idx) => {
          const src = SOURCE_LABELS[v.source] ?? SOURCE_LABELS.manual;
          return (
            <motion.div
              key={v.id}
              className="px-4 py-3 transition-colors"
              style={{
                backgroundColor: v.isActive ? 'var(--obs-success-bg)' : 'transparent',
                borderBottom: '1px solid var(--obs-border-subtle)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.03 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold obs-text-primary">v{v.version}</span>
                  {v.isActive && (
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--obs-success-bg)', color: 'var(--obs-success)' }}>
                      ACTIVE
                    </span>
                  )}
                  <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: `${src.color}15`, color: src.color }}>
                    {src.label}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {!v.isActive && onActivate && (
                    <button onClick={() => onActivate(v)} className="text-[9px] px-2 py-0.5 rounded" style={{ color: 'var(--obs-success)', backgroundColor: 'var(--obs-success-bg)' }}>
                      有効化
                    </button>
                  )}
                  {onCompare && idx > 0 && (
                    <button onClick={() => onCompare(versions[idx - 1], v)} className="text-[9px] px-2 py-0.5 rounded" style={{ color: 'var(--obs-accent)', backgroundColor: 'var(--obs-accent-bg)' }}>
                      比較
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 mt-1 text-[10px] obs-text-muted">
                <span>{v.variableCount}変数</span>
                <span>{v.createdAt}</span>
                {v.notes && <span className="obs-text-tertiary truncate">{v.notes}</span>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
