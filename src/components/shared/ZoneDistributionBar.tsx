import { motion } from 'framer-motion';
import type { Zone } from '@/components/alert/ZoneIndicator';

interface ZoneSegment {
  zone: Zone;
  count: number;
}

interface ZoneDistributionBarProps {
  segments: ZoneSegment[];
  height?: number;
  showLabels?: boolean;
  showCounts?: boolean;
  className?: string;
}

const ZONE_COLORS: Record<Zone, string> = {
  N:  'var(--obs-zone-n)',
  W:  'var(--obs-zone-w)',
  WW: 'var(--obs-zone-ww)',
  H:  'var(--obs-zone-h)',
  C:  'var(--obs-zone-c)',
};

/**
 * Horizontal stacked bar showing zone distribution.
 * Matches Figma's status distribution bar design.
 */
export function ZoneDistributionBar({ segments, height = 8, showLabels = false, showCounts = false, className = '' }: ZoneDistributionBarProps) {
  const total = segments.reduce((sum, s) => sum + s.count, 0);
  if (total === 0) return null;

  return (
    <div className={className}>
      {/* Bar */}
      <div
        className="flex rounded-full overflow-hidden"
        style={{ height: `${height}px`, backgroundColor: 'var(--obs-bg-tertiary)' }}
      >
        {segments.map((seg, idx) => {
          const pct = (seg.count / total) * 100;
          if (pct === 0) return null;

          return (
            <motion.div
              key={seg.zone}
              style={{ backgroundColor: ZONE_COLORS[seg.zone], width: `${pct}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            />
          );
        })}
      </div>

      {/* Labels */}
      {(showLabels || showCounts) && (
        <div className="flex justify-between mt-1">
          {segments.map((seg) => {
            const pct = (seg.count / total) * 100;
            if (pct === 0) return null;

            return (
              <div key={seg.zone} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ZONE_COLORS[seg.zone] }} />
                {showLabels && <span className="text-[9px]" style={{ color: ZONE_COLORS[seg.zone] }}>{seg.zone}</span>}
                {showCounts && <span className="text-[9px] font-mono" style={{ color: 'var(--obs-text-muted)' }}>{seg.count}</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
