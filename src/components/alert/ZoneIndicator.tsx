import { motion } from 'framer-motion';

export type Zone = 'N' | 'W' | 'WW' | 'H' | 'C';

interface ZoneIndicatorProps {
  zone: Zone;
  deviationPct?: number;
  variable?: string;
  compact?: boolean;
}

const ZONE_CONFIG: Record<Zone, { label: string; labelJa: string; color: string; bg: string; border: string; bgVar: string; pulse: boolean }> = {
  N:  { label: 'NORMAL',   labelJa: '正常',   color: 'var(--obs-zone-n)',  bg: 'var(--obs-zone-n-bg)',  border: 'var(--obs-zone-n)',  bgVar: 'bg-emerald-400', pulse: false },
  W:  { label: 'WATCH',    labelJa: '注視',   color: 'var(--obs-zone-w)',  bg: 'var(--obs-zone-w-bg)',  border: 'var(--obs-zone-w)',  bgVar: 'bg-sky-400',     pulse: false },
  WW: { label: 'WARNING',  labelJa: '警告',   color: 'var(--obs-zone-ww)', bg: 'var(--obs-zone-ww-bg)', border: 'var(--obs-zone-ww)', bgVar: 'bg-amber-400',   pulse: true },
  H:  { label: 'HIGH',     labelJa: '高警告', color: 'var(--obs-zone-h)',  bg: 'var(--obs-zone-h-bg)',  border: 'var(--obs-zone-h)',  bgVar: 'bg-orange-400',  pulse: true },
  C:  { label: 'CRITICAL', labelJa: '危険',   color: 'var(--obs-zone-c)',  bg: 'var(--obs-zone-c-bg)',  border: 'var(--obs-zone-c)',  bgVar: 'bg-red-400',     pulse: true },
};

const ZONE_ORDER: Zone[] = ['N', 'W', 'WW', 'H', 'C'];

/**
 * 5-level zone indicator matching PCK Alert Service zones.
 * N(<5%) → W(5-10%) → WW(10-20%) → H(20-50%) → C(>50%)
 */
export function ZoneIndicator({ zone, deviationPct, variable, compact = false }: ZoneIndicatorProps) {
  const config = ZONE_CONFIG[zone];

  if (compact) {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border"
        style={{ color: config.color, backgroundColor: config.bg, borderColor: `${config.border}44` }}
      >
        {config.pulse && (
          <motion.span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: config.color }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        {config.label}
      </span>
    );
  }

  return (
    <div className="rounded-xl border p-4" style={{ borderColor: `${config.border}44`, backgroundColor: config.bg }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {config.pulse && (
            <motion.span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: config.color }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
          <span className="text-sm font-semibold" style={{ color: config.color }}>
            {config.label}
          </span>
          <span className="text-xs obs-text-tertiary">
            {config.labelJa}
          </span>
        </div>
        {deviationPct !== undefined && (
          <span className="text-lg font-mono font-bold" style={{ color: config.color }}>
            {deviationPct > 0 ? '+' : ''}{deviationPct.toFixed(1)}%
          </span>
        )}
      </div>

      {variable && (
        <div className="text-xs obs-text-tertiary mb-3">
          対象: <span className="font-medium obs-text-secondary">{variable}</span>
        </div>
      )}

      {/* Zone bar */}
      <div className="flex gap-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--obs-bg-tertiary)' }}>
        {ZONE_ORDER.map((z) => {
          const isActive = ZONE_ORDER.indexOf(z) <= ZONE_ORDER.indexOf(zone);
          const zConfig = ZONE_CONFIG[z];
          return (
            <motion.div
              key={z}
              className="flex-1 rounded-full"
              style={{ backgroundColor: isActive ? zConfig.color : 'var(--obs-border-primary)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isActive ? 1 : 0.3 }}
              transition={{ duration: 0.3, delay: ZONE_ORDER.indexOf(z) * 0.1 }}
            />
          );
        })}
      </div>
      <div className="flex justify-between mt-1 text-[10px] obs-text-muted">
        <span>&lt;5%</span>
        <span>5-10%</span>
        <span>10-20%</span>
        <span>20-50%</span>
        <span>&gt;50%</span>
      </div>
    </div>
  );
}
