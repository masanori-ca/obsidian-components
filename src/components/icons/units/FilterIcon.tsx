import { motion } from 'framer-motion';
import type { UnitIconProps } from './types';
import { STATE_COLORS } from './types';
import { UnitIconWrapper } from './UnitIconWrapper';

/**
 * Filter icon with particles being trapped and clean flow passing through.
 */
export function FilterIcon({ state = 'normal', ...props }: UnitIconProps & { label?: string }) {
  const colors = STATE_COLORS[state];
  const isActive = state !== 'stopped' && state !== 'blocked';
  const speed = state === 'critical' ? 0.6 : state === 'warning' ? 1.5 : 1.0;

  return (
    <UnitIconWrapper state={state} {...props}>
      <svg viewBox="0 0 64 64" width="100%" height="100%">
        {/* Funnel shape */}
        <path
          d="M10,12 L54,12 L38,36 L38,52 L26,52 L26,36 Z"
          fill="none"
          stroke={colors.stroke}
          strokeWidth="1.5"
          opacity={0.6}
        />

        {/* Filter mesh lines */}
        <line x1="18" y1="24" x2="46" y2="24" stroke={colors.stroke} strokeWidth="0.8" opacity={0.25} strokeDasharray="2 1.5" />
        <line x1="22" y1="28" x2="42" y2="28" stroke={colors.stroke} strokeWidth="0.8" opacity={0.25} strokeDasharray="2 1.5" />

        {/* Dirty particles entering */}
        {isActive && [0, 1, 2, 3].map((i) => (
          <motion.circle
            key={`dirty-${i}`}
            cx={20 + i * 8}
            r={2}
            fill={colors.stroke}
            opacity={0.5}
            animate={{
              cy: [8, 22],
              opacity: [0.6, 0.1],
            }}
            transition={{ duration: speed, repeat: Infinity, delay: i * 0.25 }}
          />
        ))}

        {/* Clean particles exiting */}
        {isActive && [0, 1].map((i) => (
          <motion.circle
            key={`clean-${i}`}
            cx={30 + i * 4}
            r={1}
            fill={colors.stroke}
            opacity={0.3}
            animate={{
              cy: [38, 56],
              opacity: [0.4, 0],
            }}
            transition={{ duration: speed * 0.7, repeat: Infinity, delay: i * 0.3 + speed * 0.4 }}
          />
        ))}

        {/* Outlet */}
        <line x1="32" y1="52" x2="32" y2="62" stroke={colors.stroke} strokeWidth="1.5" opacity={0.4} />
      </svg>
    </UnitIconWrapper>
  );
}
