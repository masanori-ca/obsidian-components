import { motion } from 'framer-motion';
import type { Zone } from '@/components/alert/ZoneIndicator';

interface UnitVariable {
  symbol: string;
  value: number;
  unit?: string;
  zone?: Zone;
}

interface UnitStatusCardProps {
  unitId: string;
  unitLabel: string;
  unitType?: 'reactor' | 'settler' | 'membrane' | 'pump' | 'aerator' | 'tank';
  zone: Zone;
  variables: UnitVariable[];
  onUnitClick?: () => void;
}

const ZONE_STYLES: Record<Zone, { color: string; bg: string; border: string }> = {
  N:  { color: 'var(--obs-zone-n)',  bg: 'var(--obs-zone-n-bg)',  border: 'var(--obs-zone-n)' },
  W:  { color: 'var(--obs-zone-w)',  bg: 'var(--obs-zone-w-bg)',  border: 'var(--obs-zone-w)' },
  WW: { color: 'var(--obs-zone-ww)', bg: 'var(--obs-zone-ww-bg)', border: 'var(--obs-zone-ww)' },
  H:  { color: 'var(--obs-zone-h)',  bg: 'var(--obs-zone-h-bg)',  border: 'var(--obs-zone-h)' },
  C:  { color: 'var(--obs-zone-c)',  bg: 'var(--obs-zone-c-bg)',  border: 'var(--obs-zone-c)' },
};

/**
 * Unit status card for inline display in chat messages.
 * Shows unit icon placeholder, zone, and key variable values.
 */
export function UnitStatusCard({ unitId, unitLabel, zone, variables, onUnitClick }: UnitStatusCardProps) {
  const zs = ZONE_STYLES[zone];

  return (
    <motion.div
      className="rounded-lg overflow-hidden my-2 cursor-pointer"
      style={{ border: `1px solid ${zs.border}33`, backgroundColor: zs.bg }}
      onClick={onUnitClick}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center gap-3 px-3 py-2">
        {/* Unit identity */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold"
            style={{ backgroundColor: `${zs.border}22`, color: zs.color, border: `1px solid ${zs.border}44` }}
          >
            {unitId.slice(0, 3).toUpperCase()}
          </div>
          <div>
            <div className="text-xs font-semibold obs-text-primary">{unitLabel}</div>
            <span
              className="text-[8px] font-bold px-1 py-0.5 rounded"
              style={{ backgroundColor: `${zs.border}22`, color: zs.color }}
            >
              {zone}
            </span>
          </div>
        </div>

        {/* Key variables */}
        <div className="flex-1 flex flex-wrap gap-x-3 gap-y-1 justify-end">
          {variables.map((v) => {
            const vZone = v.zone ?? 'N';
            const vColor = ZONE_STYLES[vZone].color;
            return (
              <div key={v.symbol} className="text-right">
                <div className="text-[8px] obs-text-muted">{v.symbol}</div>
                <div className="text-[11px] font-mono font-bold" style={{ color: vColor }}>
                  {v.value.toFixed(v.value < 1 ? 3 : 1)}
                  {v.unit && <span className="text-[8px] obs-text-muted ml-0.5">{v.unit}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
