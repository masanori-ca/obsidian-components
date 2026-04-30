import { motion } from 'framer-motion';

interface ClusterData {
  lat: number;
  lng: number;
  count: number;
  onlineCount: number;
  warningCount: number;
  criticalCount: number;
  region?: string;
}

interface PlantMapClusterProps {
  cluster: ClusterData;
  size?: number;
  onClick?: (cluster: ClusterData) => void;
}

/**
 * Cluster indicator for grouped plants on the map.
 * Shows total count with status breakdown ring.
 */
export function PlantMapCluster({ cluster, size = 48, onClick }: PlantMapClusterProps) {
  const total = cluster.count;
  const onlinePct = (cluster.onlineCount / total) * 100;
  const warningPct = (cluster.warningCount / total) * 100;
  const criticalPct = (cluster.criticalCount / total) * 100;

  const hasIssues = cluster.warningCount > 0 || cluster.criticalCount > 0;
  const r = (size - 6) / 2;
  const circumference = 2 * Math.PI * r;

  const segments = [
    { pct: onlinePct, color: '#34d399' },
    { pct: warningPct, color: '#fbbf24' },
    { pct: criticalPct, color: '#f87171' },
  ];

  let offset = 0;

  return (
    <motion.div
      className="relative cursor-pointer flex flex-col items-center"
      onClick={() => onClick?.(cluster)}
      whileHover={{ scale: 1.1 }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="var(--obs-bg-card, rgba(24,24,27,0.9))"
          stroke="var(--obs-border-primary, #3f3f46)"
          strokeWidth="1"
        />

        {/* Status ring segments */}
        {segments.map((seg, i) => {
          const dashLen = (seg.pct / 100) * circumference;
          const dashGap = circumference - dashLen;
          const currentOffset = offset;
          offset += dashLen;

          if (seg.pct === 0) return null;

          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth="3"
              strokeDasharray={`${dashLen} ${dashGap}`}
              strokeDashoffset={-currentOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
        })}

        {/* Count text */}
        <text
          x={size / 2}
          y={size / 2 + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--obs-text-primary, #fafafa)"
          fontSize={total >= 100 ? '10' : total >= 10 ? '12' : '14'}
          fontWeight="bold"
          fontFamily="monospace"
        >
          {total}
        </text>
      </svg>

      {/* Pulse for issues */}
      {hasIssues && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: '1px solid #fbbf24' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Region label */}
      {cluster.region && (
        <span
          className="text-[8px] font-medium mt-0.5"
          style={{ color: 'var(--obs-text-muted, #71717a)' }}
        >
          {cluster.region}
        </span>
      )}
    </motion.div>
  );
}
