import type { CatalogEquation } from './EquationBrowser';

interface EquationDetailProps {
  equation: CatalogEquation;
  inputValues?: Record<string, number>;
  computedOutput?: number;
}

/**
 * Detail view for a single PCK equation.
 * Shows expression, input/output vars, computed value.
 */
export function EquationDetail({ equation, inputValues = {}, computedOutput }: EquationDetailProps) {
  return (
    <div className="obs-card p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold obs-text-primary">{equation.name}</h3>
        {equation.description && <p className="text-[11px] obs-text-tertiary mt-0.5">{equation.description}</p>}
        {equation.source && <span className="text-[9px] obs-text-muted">出典: {equation.source}</span>}
      </div>

      {/* Formula display */}
      <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--obs-bg-secondary)', border: '1px solid var(--obs-border-secondary)' }}>
        <div className="text-[9px] obs-text-muted uppercase mb-1">数式</div>
        <div className="text-sm font-mono obs-text-primary break-all">{equation.expression}</div>
      </div>

      {/* Input variables */}
      <div>
        <div className="text-[9px] obs-text-muted uppercase mb-1.5">入力変数 ({equation.inputVars.length})</div>
        <div className="space-y-1">
          {equation.inputVars.map((v) => (
            <div key={v} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: 'var(--obs-bg-secondary)' }}>
              <span className="text-xs font-mono" style={{ color: 'var(--obs-accent)' }}>{v}</span>
              {inputValues[v] !== undefined && (
                <span className="text-xs font-mono obs-text-primary">{inputValues[v].toFixed(3)}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Output */}
      <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)' }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[9px] uppercase" style={{ color: '#a78bfa' }}>出力</div>
            <span className="text-xs font-mono font-bold" style={{ color: '#a78bfa' }}>{equation.outputVar}</span>
          </div>
          {computedOutput !== undefined && (
            <span className="text-lg font-mono font-bold" style={{ color: '#a78bfa' }}>
              {computedOutput.toFixed(4)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
