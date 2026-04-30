import { motion } from 'framer-motion';
import type { UnitIconProps } from './types';
import { STATE_COLORS } from './types';
import { UnitIconWrapper } from './UnitIconWrapper';

/**
 * Pump icon with rotating impeller animation.
 * Speed varies by state. Stopped = no rotation.
 */
export function PumpIcon({ state = 'normal', ...props }: UnitIconProps & { label?: string }) {
  const colors = STATE_COLORS[state];
  const isActive = state !== 'stopped' && state !== 'blocked';
  const rpm = state === 'critical' ? 0.4 : state === 'high' ? 0.6 : state === 'warning' ? 1.2 : 0.8;

  // Pre-calculate blade endpoints
  const blades = [0, 60, 120, 180, 240, 300].map((angle) => ({
    angle,
    x2: 32 + 12 * Math.cos((angle * Math.PI) / 180),
    y2: 32 + 12 * Math.sin((angle * Math.PI) / 180),
  }));

  return (
    <UnitIconWrapper state={state} {...props}>
      <svg viewBox="0 0 64 64" width="100%" height="100%">
        {/* Pump casing (circle) */}
        <circle cx="32" cy="32" r="18" fill="none" stroke={colors.stroke} strokeWidth="1.5" opacity={0.6} />

        {/* Impeller - using CSS rotation for reliability */}
        <g style={{ transformOrigin: '32px 32px', transformBox: 'fill-box' }}>
          <motion.g
            animate={isActive ? { rotate: [0, 360] } : { rotate: 0 }}
            transition={isActive ? { duration: rpm, repeat: Infinity, ease: 'linear', repeatType: 'loop' } : {}}
            style={{ originX: '32px', originY: '32px' }}
          >
            {blades.map((b) => (
              <line
                key={b.angle}
                x1="32"
                y1="32"
                x2={b.x2}
                y2={b.y2}
                stroke={colors.stroke}
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity={0.7}
              />
            ))}
            <circle cx="32" cy="32" r="4" fill={colors.stroke} opacity={0.5} />
          </motion.g>
        </g>

        {/* Flow particles through pump */}
        {isActive && [0, 1, 2].map((i) => (
          <motion.circle
            key={`flow-${i}`}
            r={1.5}
            fill={colors.stroke}
            opacity={0.4}
            animate={{
              cx: [4, 32, 32, 56],
              cy: [32, 32, 8, 8],
            }}
            transition={{
              duration: rpm * 1.5,
              repeat: Infinity,
              delay: i * (rpm / 3),
              ease: 'linear',
            }}
          />
        ))}

        {/* Inlet (horizontal left) */}
        <line x1="0" y1="32" x2="14" y2="32" stroke={colors.stroke} strokeWidth="2" opacity={0.4} />

        {/* Outlet (vertical top + horizontal right) */}
        <line x1="32" y1="14" x2="32" y2="4" stroke={colors.stroke} strokeWidth="2" opacity={0.4} />
        <line x1="32" y1="4" x2="60" y2="4" stroke={colors.stroke} strokeWidth="2" opacity={0.4} />

        {/* Pressure indicator pulse */}
        {isActive && (
          <motion.circle
            cx="52"
            cy="4"
            r="3"
            fill="none"
            stroke={colors.stroke}
            strokeWidth="0.8"
            animate={{ r: [3, 6, 3], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: rpm, repeat: Infinity }}
          />
        )}
      </svg>
    </UnitIconWrapper>
  );
}
