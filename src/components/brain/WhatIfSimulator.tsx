import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePCKClient } from '@/components/hooks/usePCKClient';
import type { WhatIfResponse, WhatIfDelta } from '@/lib/pck-client';
import { CBFBarrierStatus } from './CBFBarrierStatus';

interface WhatIfParam {
  variable: string;
  label?: string;
  baseline: number;
  unit?: string;
  min?: number;
  max?: number;
}

interface WhatIfSimulatorProps {
  siteId: string;
  baseState: Record<string, number>;
  editableParams: WhatIfParam[];
  onResult?: (result: WhatIfResponse) => void;
}

/**
 * Interactive What-If simulator panel.
 * User adjusts parameters → POST /brain/chain/what-if → shows deltas + CBF.
 */
export function WhatIfSimulator({ siteId, baseState, editableParams, onResult }: WhatIfSimulatorProps) {
  const client = usePCKClient();
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [result, setResult] = useState<WhatIfResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleParamChange = (variable: string, value: number) => {
    setOverrides((prev) => ({ ...prev, [variable]: value }));
  };

  const handleReset = () => {
    setOverrides({});
    setResult(null);
    setError(null);
  };

  const handleSimulate = useCallback(async () => {
    if (Object.keys(overrides).length === 0) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await client.whatIf(siteId, baseState, overrides);
      setResult(res);
      onResult?.(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'What-If simulation failed');
    } finally {
      setIsLoading(false);
    }
  }, [client, siteId, baseState, overrides, onResult]);

  const hasOverrides = Object.keys(overrides).length > 0;

  return (
    <div className="rounded-xl border obs-border-primary obs-bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b obs-border-primary obs-bg-secondary">
        <h3 className="text-sm font-semibold obs-text-primary">What-If Simulator</h3>
        <div className="flex items-center gap-2">
          {hasOverrides && (
            <button
              onClick={handleReset}
              className="text-[10px] obs-text-muted hover:obs-text-secondary transition-colors"
            >
              リセット
            </button>
          )}
          <button
            onClick={handleSimulate}
            disabled={!hasOverrides || isLoading}
            className="px-3 py-1 text-[11px] font-medium text-sky-400 bg-sky-400/10 border border-sky-400/30 rounded-md hover:bg-sky-400/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isLoading ? '計算中...' : 'シミュレーション実行'}
          </button>
        </div>
      </div>

      {/* Parameter sliders */}
      <div className="p-4 space-y-3">
        <p className="text-[11px] obs-text-muted mb-2">パラメータを変更して影響を確認</p>
        {editableParams.map((param) => {
          const current = overrides[param.variable] ?? param.baseline;
          const changePct = ((current - param.baseline) / Math.abs(param.baseline || 1)) * 100;
          const hasChanged = param.variable in overrides;

          return (
            <div key={param.variable} className={`p-2.5 rounded-lg border transition-colors ${
              hasChanged ? 'bg-sky-400/5 border-sky-400/20' : 'obs-bg-secondary obs-border-secondary'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium obs-text-secondary">
                  {param.label ?? param.variable}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono obs-text-tertiary">
                    {current.toFixed(1)} {param.unit ?? ''}
                  </span>
                  {hasChanged && (
                    <span className={`text-[10px] font-mono font-bold ${
                      changePct > 0 ? 'text-amber-400' : 'text-sky-400'
                    }`}>
                      {changePct > 0 ? '+' : ''}{changePct.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
              <input
                type="range"
                min={param.min ?? param.baseline * 0.1}
                max={param.max ?? param.baseline * 2}
                step={(param.max ?? param.baseline * 2) / 200}
                value={current}
                onChange={(e) => handleParamChange(param.variable, parseFloat(e.target.value))}
                className="w-full h-1.5 obs-bg-tertiary rounded-full appearance-none cursor-pointer accent-sky-400"
              />
              <div className="flex justify-between text-[9px] obs-text-muted mt-0.5">
                <span>{(param.min ?? param.baseline * 0.1).toFixed(0)}</span>
                <span className="obs-text-muted">baseline: {param.baseline.toFixed(1)}</span>
                <span>{(param.max ?? param.baseline * 2).toFixed(0)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 mb-3 p-2 rounded-lg bg-red-400/10 border border-red-400/20 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            className="border-t obs-border-primary"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold obs-text-secondary">影響分析</h4>
                <span className="text-[10px] obs-text-muted">
                  {result.deltas_count}変数に影響
                </span>
              </div>

              {/* Top deltas */}
              <div className="space-y-1.5">
                {Object.entries(result.deltas)
                  .sort(([, a], [, b]) => Math.abs(b.delta_pct) - Math.abs(a.delta_pct))
                  .slice(0, 8)
                  .map(([variable, delta]: [string, WhatIfDelta]) => (
                    <DeltaRow key={variable} variable={variable} delta={delta} />
                  ))}
              </div>

              {/* CBF */}
              {result.cbf && (
                <CBFBarrierStatus response={result.cbf} compact />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DeltaRow({ variable, delta }: { variable: string; delta: WhatIfDelta }) {
  const isIncrease = delta.delta > 0;
  return (
    <div className="flex items-center justify-between p-2 rounded-lg obs-bg-secondary border obs-border-secondary">
      <span className="text-[11px] font-mono obs-text-secondary truncate mr-2">{variable}</span>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[10px] obs-text-muted">
          {delta.baseline.toFixed(2)} → {delta.what_if.toFixed(2)}
        </span>
        <span className={`text-xs font-mono font-bold min-w-[50px] text-right ${
          Math.abs(delta.delta_pct) > 20 ? (isIncrease ? 'text-red-400' : 'text-sky-400') :
          Math.abs(delta.delta_pct) > 5 ? 'text-amber-400' : 'obs-text-tertiary'
        }`}>
          {isIncrease ? '+' : ''}{delta.delta_pct.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
