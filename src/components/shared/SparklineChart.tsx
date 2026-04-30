import { motion } from 'framer-motion';

interface SparklineChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showDot?: boolean;
  showArea?: boolean;
  warningThreshold?: number;
  criticalThreshold?: number;
  className?: string;
}

/**
 * Compact sparkline chart for trend visualization.
 * Shows threshold lines and animated drawing.
 */
export function SparklineChart({
  data,
  width = 120,
  height = 40,
  color = 'var(--obs-accent)',
  showDot = true,
  showArea = true,
  warningThreshold,
  criticalThreshold,
  className = '',
}: SparklineChartProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 4;
  const w = width - padding * 2;
  const h = height - padding * 2;

  const points = data.map((v, i) => ({
    x: padding + (i / (data.length - 1)) * w,
    y: padding + h - ((v - min) / range) * h,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x},${height - padding} L ${padding},${height - padding} Z`;
  const lastPoint = points[points.length - 1];

  const thresholdY = (threshold: number) => padding + h - ((threshold - min) / range) * h;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className={className}>
      {/* Area fill */}
      {showArea && (
        <motion.path
          d={areaPath}
          fill={color}
          opacity={0.08}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.08 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Warning threshold */}
      {warningThreshold !== undefined && warningThreshold >= min && warningThreshold <= max && (
        <line
          x1={padding} y1={thresholdY(warningThreshold)}
          x2={width - padding} y2={thresholdY(warningThreshold)}
          stroke="var(--obs-warning)" strokeWidth="0.5" strokeDasharray="3 2" opacity={0.5}
        />
      )}

      {/* Critical threshold */}
      {criticalThreshold !== undefined && criticalThreshold >= min && criticalThreshold <= max && (
        <line
          x1={padding} y1={thresholdY(criticalThreshold)}
          x2={width - padding} y2={thresholdY(criticalThreshold)}
          stroke="var(--obs-danger)" strokeWidth="0.5" strokeDasharray="3 2" opacity={0.5}
        />
      )}

      {/* Line */}
      <motion.path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      {/* Current value dot */}
      {showDot && lastPoint && (
        <motion.circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r={2.5}
          fill={color}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8 }}
        />
      )}
    </svg>
  );
}
