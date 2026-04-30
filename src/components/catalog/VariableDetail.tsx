import type { CatalogVariable } from './VariableBrowser';

interface VariableDetailProps {
  variable: CatalogVariable;
  relatedEquations?: Array<{ id: string; name: string; expression: string }>;
  currentValue?: number;
  baselineValue?: number;
}

/**
 * Detail view for a single PCK Catalog variable.
 * Shows all metadata, related equations, and current/baseline values.
 */
export function VariableDetail({ variable, relatedEquations = [], currentValue, baselineValue }: VariableDetailProps) {
  const deviationPct = currentValue !== undefined && baselineValue
    ? ((currentValue - baselineValue) / Math.abs(baselineValue)) * 100
    : null;

  return (
    <div className="obs-card p-4 space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg font-mono font-bold" style={{ color: 'var(--obs-accent)' }}>{variable.symbol}</span>
          {variable.unit && (
            <span className="text-xs obs-text-muted px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--obs-bg-tertiary)' }}>{variable.unit}</span>
          )}
        </div>
        <h3 className="text-sm font-medium obs-text-primary">{variable.nameJa ?? variable.name}</h3>
        {variable.name !== variable.nameJa && variable.nameJa && (
          <p className="text-[11px] obs-text-tertiary">{variable.name}</p>
        )}
      </div>

      {/* Description */}
      {variable.description && (
        <p className="text-xs obs-text-secondary">{variable.description}</p>
      )}

      {/* Metadata grid */}
      <div className="grid grid-cols-2 gap-2">
        {variable.discipline && (
          <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--obs-bg-secondary)' }}>
            <div className="text-[9px] obs-text-muted uppercase">分野</div>
            <div className="text-xs obs-text-primary font-medium">{variable.discipline}</div>
          </div>
        )}
        {variable.subDiscipline && (
          <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--obs-bg-secondary)' }}>
            <div className="text-[9px] obs-text-muted uppercase">サブ分野</div>
            <div className="text-xs obs-text-primary font-medium">{variable.subDiscipline}</div>
          </div>
        )}
        {currentValue !== undefined && (
          <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--obs-bg-secondary)' }}>
            <div className="text-[9px] obs-text-muted uppercase">現在値</div>
            <div className="text-xs font-mono font-bold obs-text-primary">
              {currentValue.toFixed(3)} {variable.unit ?? ''}
            </div>
          </div>
        )}
        {baselineValue !== undefined && (
          <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--obs-bg-secondary)' }}>
            <div className="text-[9px] obs-text-muted uppercase">ベースライン</div>
            <div className="text-xs font-mono obs-text-primary">
              {baselineValue.toFixed(3)} {variable.unit ?? ''}
              {deviationPct !== null && (
                <span className={`ml-1 text-[10px] ${Math.abs(deviationPct) > 10 ? 'text-red-400' : Math.abs(deviationPct) > 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  ({deviationPct > 0 ? '+' : ''}{deviationPct.toFixed(1)}%)
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Aliases */}
      {variable.aliases && variable.aliases.length > 0 && (
        <div>
          <div className="text-[9px] obs-text-muted uppercase mb-1">別名</div>
          <div className="flex flex-wrap gap-1">
            {variable.aliases.map((a) => (
              <span key={a} className="text-[10px] obs-text-tertiary px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--obs-bg-tertiary)' }}>{a}</span>
            ))}
          </div>
        </div>
      )}

      {/* Related equations */}
      {relatedEquations.length > 0 && (
        <div>
          <div className="text-[9px] obs-text-muted uppercase mb-1">関連方程式 ({relatedEquations.length})</div>
          <div className="space-y-1">
            {relatedEquations.map((eq) => (
              <div key={eq.id} className="p-2 rounded-lg text-[11px]" style={{ backgroundColor: 'var(--obs-bg-secondary)' }}>
                <span className="font-medium obs-text-primary">{eq.name}</span>
                <div className="font-mono text-[10px] obs-text-tertiary mt-0.5 truncate">{eq.expression}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
