import { motion } from 'framer-motion';
import type { Zone } from '@/components/alert/ZoneIndicator';

export interface PlantMarkerData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  zone?: Zone;
  status?: 'online' | 'warning' | 'critical' | 'offline';
  tenantId?: string;
  siteCount?: number;
}

interface PlantMapMarkerProps {
  plant: PlantMarkerData;
  selected?: boolean;
  size?: number;
  onClick?: (plant: PlantMarkerData) => void;
}

const STATUS_CONFIG: Record<string, { color: string; pulse: boolean; label: string }> = {
  online:   { color: '#34d399', pulse: false, label: '稼働中' },
  warning:  { color: '#fbbf24', pulse: true,  label: '警告' },
  critical: { color: '#f87171', pulse: true,  label: '異常' },
  offline:  { color: '#71717a', pulse: false, label: 'オフライン' },
};

/**
 * Standalone plant marker component (used as Leaflet DivIcon content).
 * Shows plant status with animated pulse for warning/critical states.
 */
export function PlantMapMarker({ plant, selected = false, size = 40, onClick }: PlantMapMarkerProps) {
  const status = plant.status ?? 'online';
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.online;

  return (
    <div
      className="relative cursor-pointer"
      style={{ width: size, height: size + 16 }}
      onClick={() => onClick?.(plant)}
    >
      {/* Pulse ring */}
      {config.pulse && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size + 8,
            height: size + 8,
            top: -4,
            left: -4,
            border: `2px solid ${config.color}`,
            opacity: 0.4,
          }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Selection ring */}
      {selected && (
        <motion.div
          className="absolute rounded-full border-2 border-sky-400"
          style={{ width: size + 6, height: size + 6, top: -3, left: -3 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Marker body */}
      <div
        className="rounded-full flex items-center justify-center shadow-lg"
        style={{
          width: size,
          height: size,
          backgroundColor: `${config.color}22`,
          border: `2px solid ${config.color}`,
        }}
      >
        {/* Plant icon */}
        <svg viewBox="0 0 24 24" width={size * 0.5} height={size * 0.5}>
          <path
            d="M12,3 L20,8 L20,20 L4,20 L4,8 Z"
            fill="none"
            stroke={config.color}
            strokeWidth="1.5"
          />
          <rect x="9" y="13" width="6" height="7" rx="1" fill={config.color} opacity={0.3} />
          <line x1="12" y1="8" x2="12" y2="12" stroke={config.color} strokeWidth="1" opacity={0.5} />
        </svg>
      </div>

      {/* Label */}
      <div
        className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded text-center"
        style={{
          top: size + 2,
          fontSize: '9px',
          fontWeight: 600,
          color: config.color,
          backgroundColor: 'var(--obs-bg-card, rgba(24,24,27,0.9))',
          border: `1px solid ${config.color}44`,
        }}
      >
        {plant.name}
      </div>
    </div>
  );
}
