import { motion } from 'framer-motion';

interface DonutGaugeProps {
  value: number;
  max?: number;
  label?: string;
  unit?: string;
  size?: number;
  thickness?: number;
  color?: string;
  warningThreshold?: number;
  criticalThreshold?: number;
}

/**
 * Donut/ring gauge matching Figma's circular progress indicators.
 * Shows percentage with color thresholds.
 */
export function DonutGauge({
  value,
  max = 100,
  label,
  unit = '%',
  size = 80,
  thickness = 6,
  color,
  warningThreshold,
  criticalThreshold,
}: DonutGaugeProps) {
  const pct = Math.min(Math.max(value / max, 0), 1);
  const r = (size - thickness * 2) / 2;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = circumference * (1 - pct);

  const autoColor = (() => {
    if (criticalThreshold !== undefined && value >= criticalThreshold) return 'var(--obs-status-danger)';
    if (warningThreshold !== undefined && value >= warningThreshold) return 'var(--obs-status-warning)';
    return 'var(--obs-accent-default)';
  })();

  const displayColor = color ?? autoColor;

  return (
    <div className="inline-flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--obs-border-primary)"
            strokeWidth={thickness}
          />

          {/* Value ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={displayColor}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={circumference}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-mono font-bold"
            style={{
              fontSize: `${size * 0.22}px`,
              color: displayColor,
              lineHeight: 1,
            }}
          >
            {Math.round(value)}
          </span>
          {unit && (
            <span
              className="font-mono"
              style={{
                fontSize: `${size * 0.12}px`,
                color: 'var(--obs-text-muted)',
              }}
            >
              {unit}
            </span>
          )}
        </div>
      </div>

      {label && (
        <span
          className="text-[10px] font-medium mt-1"
          style={{ color: 'var(--obs-text-secondary)' }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
