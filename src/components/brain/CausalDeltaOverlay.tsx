import { motion } from 'framer-motion';
import type { WhatIfDelta } from '@/lib/pck-client';

interface UnitPosition {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface CausalDeltaOverlayProps {
  units: UnitPosition[];
  deltas: Record<string, WhatIfDelta>;
  overrides: Record<string, number>;
  width?: number;
  height?: number;
}

/**
 * Overlays What-If delta values onto a process flow diagram.
 * Each unit shows its most impacted variable with change percentage.
 */
export function CausalDeltaOverlay({
  units,
  deltas,
  overrides,
  width = 800,
  height = 200,
}: CausalDeltaOverlayProps) {
  // Match deltas to units by prefix (e.g., cstr6_DO → cstr6)
  const unitDeltas = units.map((unit) => {
    const matching = Object.entries(deltas).filter(([key]) =>
      key.toLowerCase().startsWith(unit.id.toLowerCase()) ||
      key.toLowerCase().includes(unit.id.toLowerCase())
    );

    const topDelta = matching.sort(
      ([, a], [, b]) => Math.abs(b.delta_pct) - Math.abs(a.delta_pct)
    )[0];

    const isOverridden = Object.keys(overrides).some((k) =>
      k.toLowerCase().startsWith(unit.id.toLowerCase())
    );

    return { unit, topDelta, isOverridden, matchCount: matching.length };
  });

  return (
    <div className="rounded-xl border obs-border-primary obs-bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold obs-text-primary">因果影響マップ</h3>
        <div className="flex items-center gap-3 text-[10px] obs-text-muted">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-400" /> 変更点
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> 影響あり
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-zinc-600" /> 影響なし
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height: `${height}px` }}>
        {/* Connection lines */}
        {units.map((unit, idx) => {
          if (idx === 0) return null;
          const prev = units[idx - 1];
          return (
            <line
              key={`line-${idx}`}
              x1={prev.x + 40}
              y1={prev.y + 20}
              x2={unit.x}
              y2={unit.y + 20}
              stroke="#3f3f46"
              strokeWidth={1.5}
              strokeDasharray="4 2"
            />
          );
        })}

        {/* Units */}
        {unitDeltas.map(({ unit, topDelta, isOverridden, matchCount }, idx) => {
          const deltaPct = topDelta ? topDelta[1].delta_pct : 0;
          const absChange = Math.abs(deltaPct);
          const hasImpact = absChange > 0.1;

          const fillColor = isOverridden
            ? 'rgba(56,189,248,0.15)'
            : hasImpact
              ? absChange > 20
                ? 'rgba(248,113,113,0.15)'
                : 'rgba(251,191,36,0.15)'
              : 'rgba(63,63,70,0.3)';

          const borderColor = isOverridden
            ? 'rgba(56,189,248,0.5)'
            : hasImpact
              ? absChange > 20
                ? 'rgba(248,113,113,0.5)'
                : 'rgba(251,191,36,0.5)'
              : 'rgba(63,63,70,0.5)';

          return (
            <g key={unit.id}>
              <motion.rect
                x={unit.x}
                y={unit.y}
                width={80}
                height={40}
                rx={8}
                fill={fillColor}
                stroke={borderColor}
                strokeWidth={1.5}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.08 }}
              />
              <text
                x={unit.x + 40}
                y={unit.y + 16}
                textAnchor="middle"
                className="text-[10px] fill-zinc-300 font-medium"
              >
                {unit.label}
              </text>

              {/* Delta badge */}
              {hasImpact && topDelta && (
                <g>
                  <rect
                    x={unit.x + 10}
                    y={unit.y + 24}
                    width={60}
                    height={14}
                    rx={3}
                    fill="rgba(0,0,0,0.5)"
                  />
                  <text
                    x={unit.x + 40}
                    y={unit.y + 34}
                    textAnchor="middle"
                    className={`text-[9px] font-mono font-bold ${
                      absChange > 20 ? 'fill-red-400' : 'fill-amber-400'
                    }`}
                  >
                    {deltaPct > 0 ? '+' : ''}{deltaPct.toFixed(1)}%
                  </text>
                </g>
              )}

              {/* Override indicator */}
              {isOverridden && (
                <circle cx={unit.x + 72} cy={unit.y + 8} r={4} fill="#38bdf8" />
              )}

              {/* Match count */}
              {matchCount > 1 && (
                <text
                  x={unit.x + 40}
                  y={unit.y + 54}
                  textAnchor="middle"
                  className="text-[8px] fill-zinc-600"
                >
                  {matchCount} vars
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
