import { motion } from 'framer-motion';
import type { CBFVerifyResponse, CBFViolation } from '@/lib/pck-client';

interface CBFBarrierStatusProps {
  response: CBFVerifyResponse;
  compact?: boolean;
}

interface LayerStatus {
  layer: string;
  label: string;
  description: string;
  passed: boolean;
  violations: CBFViolation[];
}

/**
 * Displays CBF 3-layer safety barrier status.
 * L1 (Input) / L2 (Regulation) / L3 (Output)
 */
export function CBFBarrierStatus({ response, compact = false }: CBFBarrierStatusProps) {
  const layers: LayerStatus[] = [
    {
      layer: 'L1',
      label: '入力バリア',
      description: '物理的限界チェック',
      passed: !response.violations.some((v) => v.layer === 'L1' || v.layer === 'input'),
      violations: response.violations.filter((v) => v.layer === 'L1' || v.layer === 'input'),
    },
    {
      layer: 'L2',
      label: '規制バリア',
      description: '法令・規格基準チェック',
      passed: !response.violations.some((v) => v.layer === 'L2' || v.layer === 'regulation'),
      violations: response.violations.filter((v) => v.layer === 'L2' || v.layer === 'regulation'),
    },
    {
      layer: 'L3',
      label: '出力バリア',
      description: 'マイニング危険ゾーン検知',
      passed: !response.violations.some((v) => v.layer === 'L3' || v.layer === 'output'),
      violations: response.violations.filter((v) => v.layer === 'L3' || v.layer === 'output'),
    },
  ];

  // Violations without explicit layer
  const unclassified = response.violations.filter(
    (v) => !['L1', 'L2', 'L3', 'input', 'regulation', 'output'].includes(v.layer),
  );
  if (unclassified.length > 0) {
    const anyFailed = unclassified.length > 0;
    layers.push({
      layer: 'Other',
      label: 'その他',
      description: '未分類の制約',
      passed: !anyFailed,
      violations: unclassified,
    });
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-2 p-2.5 rounded-lg border ${
        response.passed
          ? 'bg-emerald-400/5 border-emerald-400/20'
          : 'bg-red-400/5 border-red-400/20'
      }`}>
        <span className={`text-xs font-bold ${response.passed ? 'text-emerald-400' : 'text-red-400'}`}>
          CBF: {response.passed ? 'PASS' : 'BLOCK'}
        </span>
        <div className="flex gap-1.5">
          {layers.slice(0, 3).map((l) => (
            <span
              key={l.layer}
              className={`text-[10px] font-medium ${l.passed ? 'text-emerald-400' : 'text-red-400'}`}
            >
              {l.layer}{l.passed ? '✓' : '✗'}
            </span>
          ))}
        </div>
        {!response.passed && (
          <span className="text-[10px] text-red-400 ml-auto">
            {response.violations.length}件の違反
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border obs-border-primary obs-bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold obs-text-primary">CBF 安全バリア</h3>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
          response.passed
            ? 'bg-emerald-400/15 text-emerald-400 border-emerald-400/30'
            : 'bg-red-400/15 text-red-400 border-red-400/30'
        }`}>
          {response.passed ? 'ALL PASS' : 'BLOCKED'}
        </span>
      </div>

      {/* 3-layer visualization */}
      <div className="space-y-2">
        {layers.map((layer, idx) => (
          <motion.div
            key={layer.layer}
            className={`p-3 rounded-lg border ${
              layer.passed
                ? 'obs-bg-secondary obs-border-secondary'
                : 'bg-red-400/5 border-red-400/20'
            }`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                  layer.passed
                    ? 'bg-emerald-400/20 text-emerald-400'
                    : 'bg-red-400/20 text-red-400'
                }`}>
                  {layer.passed ? '✓' : '✗'}
                </span>
                <div>
                  <span className="text-xs font-semibold obs-text-secondary">
                    {layer.layer}: {layer.label}
                  </span>
                  <p className="text-[10px] obs-text-muted">{layer.description}</p>
                </div>
              </div>
            </div>

            {/* Violations */}
            {layer.violations.length > 0 && (
              <div className="mt-2 ml-8 space-y-1">
                {layer.violations.map((v, i) => (
                  <div key={i} className="p-1.5 rounded bg-red-400/5 border border-red-400/10">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-red-300">{v.variable}</span>
                      <span className="text-[10px] text-red-400">
                        {v.actual?.toFixed(2)} {v.operator} {v.threshold?.toFixed(2)}
                      </span>
                    </div>
                    {v.description && (
                      <p className="text-[9px] text-red-400/70 mt-0.5">{v.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
