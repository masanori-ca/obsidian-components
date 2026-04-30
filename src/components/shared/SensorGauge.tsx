import { motion } from 'framer-motion';

interface SensorGaugeProps {
  value: number;
  min: number;
  max: number;
  label: string;
  unit?: string;
  warningThreshold?: number;
  criticalThreshold?: number;
  size?: number;
  inverse?: boolean;
}

/**
 * Radial gauge for sensor values.
 * Color transitions from green → yellow → red based on thresholds.
 */
export function SensorGauge({
  value,
  min,
  max,
  label,
  unit = '',
  warningThreshold,
  criticalThreshold,
  size = 120,
  inverse = false,
}: SensorGaugeProps) {
  const range = max - min;
  const pct = Math.min(Math.max((value - min) / range, 0), 1);
  const angle = pct * 240 - 120; // -120° to +120° arc

  const getColor = (): string => {
    if (criticalThreshold !== undefined) {
      const critPct = (criticalThreshold - min) / range;
      if (inverse ? pct < critPct : pct > critPct) return 'var(--obs-danger)';
    }
    if (warningThreshold !== undefined) {
      const warnPct = (warningThreshold - min) / range;
      if (inverse ? pct < warnPct : pct > warnPct) return 'var(--obs-warning)';
    }
    return 'var(--obs-success)';
  };

  const color = getColor();
  const r = (size - 20) / 2;
  const cx = size / 2;
  const cy = size / 2 + 8;

  // Arc path calculation
  const startAngle = -120;
  const endAngle = angle;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const startX = cx + r * Math.cos(toRad(startAngle + 90));
  const startY = cy - r * Math.sin(toRad(startAngle + 90));
  const endX = cx + r * Math.cos(toRad(endAngle + 90));
  const endY = cy - r * Math.sin(toRad(endAngle + 90));
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return (
    <div className="inline-flex flex-col items-center" style={{ width: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        {/* Background arc */}
        <path
          d={`M ${cx + r * Math.cos(toRad(-120 + 90))},${cy - r * Math.sin(toRad(-120 + 90))} A ${r},${r} 0 1,1 ${cx + r * Math.cos(toRad(120 + 90))},${cy - r * Math.sin(toRad(120 + 90))}`}
          fill="none"
          stroke="var(--obs-border-primary)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Value arc */}
        <motion.path
          d={`M ${startX},${startY} A ${r},${r} 0 ${largeArc},1 ${endX},${endY}`}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {/* Needle */}
        <motion.line
          x1={cx}
          y1={cy}
          x2={endX}
          y2={endY}
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity={0.6}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.5 }}
        />

        {/* Center dot */}
        <circle cx={cx} cy={cy} r="3" fill={color} />

        {/* Value text */}
        <text x={cx} y={cy - 10} textAnchor="middle" fill="var(--obs-text-primary)" fontSize={size > 100 ? '14' : '11'} fontWeight="bold" fontFamily="monospace">
          {value.toFixed(value < 10 ? 2 : 1)}
        </text>
        <text x={cx} y={cy + 4} textAnchor="middle" fill="var(--obs-text-muted)" fontSize="8">
          {unit}
        </text>

        {/* Min/Max labels */}
        <text x={cx - r + 5} y={cy + 20} fill="var(--obs-text-muted)" fontSize="7" textAnchor="start">{min}</text>
        <text x={cx + r - 5} y={cy + 20} fill="var(--obs-text-muted)" fontSize="7" textAnchor="end">{max}</text>
      </svg>

      <span className="text-[10px] font-medium obs-text-secondary -mt-1">{label}</span>
    </div>
  );
}
