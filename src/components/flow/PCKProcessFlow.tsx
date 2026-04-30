import { motion } from 'framer-motion';
import type { DeviationResult } from '@/lib/pck-client';
import type { Zone } from '@/components/alert/ZoneIndicator';

export interface FlowUnit {
  id: string;
  label: string;
  type?: 'influent' | 'reactor' | 'settler' | 'membrane' | 'effluent' | 'generic';
}

export interface FlowConnection {
  from: string;
  to: string;
}

interface PCKProcessFlowProps {
  units: FlowUnit[];
  connections: FlowConnection[];
  deviations?: DeviationResult[];
  selectedUnit?: string | null;
  highlightPath?: string[];
  onUnitClick?: (unitId: string) => void;
}

const ZONE_COLORS: Record<Zone, { fill: string; stroke: string; text: string }> = {
  N:  { fill: 'rgba(52,211,153,0.12)', stroke: 'rgba(52,211,153,0.5)',  text: '#34d399' },
  W:  { fill: 'rgba(56,189,248,0.12)', stroke: 'rgba(56,189,248,0.5)',  text: '#38bdf8' },
  WW: { fill: 'rgba(251,191,36,0.12)', stroke: 'rgba(251,191,36,0.5)',  text: '#fbbf24' },
  H:  { fill: 'rgba(251,146,60,0.12)', stroke: 'rgba(251,146,60,0.5)',  text: '#fb923c' },
  C:  { fill: 'rgba(248,113,113,0.12)',stroke: 'rgba(248,113,113,0.5)', text: '#f87171' },
};

const UNIT_WIDTH = 100;
const UNIT_HEIGHT = 50;
const GAP = 30;

/**
 * Process flow topology from PCK Flow Service.
 * Shows units as nodes with zone-colored status.
 * Supports causal trace path highlighting.
 */
export function PCKProcessFlow({
  units,
  connections,
  deviations = [],
  selectedUnit,
  highlightPath = [],
  onUnitClick,
}: PCKProcessFlowProps) {
  const totalWidth = units.length * (UNIT_WIDTH + GAP) - GAP + 40;
  const svgHeight = 120;

  const getUnitZone = (unitId: string): Zone => {
    // Find worst zone among variables matching this unit
    const matching = deviations.filter((d) =>
      d.variable.toLowerCase().includes(unitId.toLowerCase())
    );
    if (matching.length === 0) return 'N';
    const zoneOrder: Zone[] = ['N', 'W', 'WW', 'H', 'C'];
    return matching.reduce((worst, d) => {
      const idx = zoneOrder.indexOf(d.zone as Zone);
      const worstIdx = zoneOrder.indexOf(worst);
      return idx > worstIdx ? d.zone as Zone : worst;
    }, 'N' as Zone);
  };

  return (
    <div className="rounded-xl border obs-border-primary obs-bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold obs-text-primary">プロセスフロー</h3>
        {highlightPath.length > 0 && (
          <span className="text-[10px] text-amber-400 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
            因果追跡パス表示中
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${totalWidth} ${svgHeight}`} className="w-full min-w-[600px]" style={{ height: `${svgHeight}px` }}>
          {/* Connections */}
          {connections.map((conn, idx) => {
            const fromIdx = units.findIndex((u) => u.id === conn.from);
            const toIdx = units.findIndex((u) => u.id === conn.to);
            if (fromIdx === -1 || toIdx === -1) return null;

            const x1 = 20 + fromIdx * (UNIT_WIDTH + GAP) + UNIT_WIDTH;
            const x2 = 20 + toIdx * (UNIT_WIDTH + GAP);
            const y = svgHeight / 2;
            const isHighlighted = highlightPath.includes(conn.from) && highlightPath.includes(conn.to);

            return (
              <g key={`conn-${idx}`}>
                <line
                  x1={x1} y1={y} x2={x2} y2={y}
                  stroke={isHighlighted ? '#fbbf24' : '#3f3f46'}
                  strokeWidth={isHighlighted ? 2.5 : 1.5}
                  strokeDasharray={isHighlighted ? undefined : '4 3'}
                />
                {/* Arrow */}
                <polygon
                  points={`${x2 - 6},${y - 4} ${x2},${y} ${x2 - 6},${y + 4}`}
                  fill={isHighlighted ? '#fbbf24' : '#3f3f46'}
                />
              </g>
            );
          })}

          {/* Units */}
          {units.map((unit, idx) => {
            const x = 20 + idx * (UNIT_WIDTH + GAP);
            const y = svgHeight / 2 - UNIT_HEIGHT / 2;
            const zone = getUnitZone(unit.id);
            const colors = ZONE_COLORS[zone];
            const isSelected = selectedUnit === unit.id;
            const isOnPath = highlightPath.includes(unit.id);

            return (
              <g
                key={unit.id}
                onClick={() => onUnitClick?.(unit.id)}
                className="cursor-pointer"
              >
                <motion.rect
                  x={x} y={y}
                  width={UNIT_WIDTH}
                  height={UNIT_HEIGHT}
                  rx={10}
                  fill={colors.fill}
                  stroke={isSelected ? '#38bdf8' : isOnPath ? '#fbbf24' : colors.stroke}
                  strokeWidth={isSelected || isOnPath ? 2.5 : 1.5}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.06 }}
                />

                {/* Label */}
                <text
                  x={x + UNIT_WIDTH / 2}
                  y={y + 20}
                  textAnchor="middle"
                  fill={colors.text}
                  className="text-[10px] font-semibold"
                >
                  {unit.label}
                </text>

                {/* Zone badge */}
                {zone !== 'N' && (
                  <g>
                    <rect
                      x={x + UNIT_WIDTH / 2 - 12}
                      y={y + 30}
                      width={24}
                      height={12}
                      rx={3}
                      fill="rgba(0,0,0,0.5)"
                    />
                    <text
                      x={x + UNIT_WIDTH / 2}
                      y={y + 39}
                      textAnchor="middle"
                      fill={colors.text}
                      className="text-[8px] font-bold"
                    >
                      {zone}
                    </text>
                  </g>
                )}

                {/* Causal path indicator */}
                {isOnPath && (
                  <motion.circle
                    cx={x + UNIT_WIDTH - 5}
                    cy={y + 5}
                    r={4}
                    fill="#fbbf24"
                    animate={{ r: [3, 5, 3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
