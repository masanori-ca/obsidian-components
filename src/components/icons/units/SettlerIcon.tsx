import { motion } from 'framer-motion';
import type { UnitIconProps } from './types';
import { STATE_COLORS } from './types';
import { UnitIconWrapper } from './UnitIconWrapper';

/**
 * Settler / Clarifier icon with particle settling animation.
 * Particles drift downward and accumulate at the bottom.
 */
export function SettlerIcon({ state = 'normal', ...props }: UnitIconProps & { label?: string }) {
  const colors = STATE_COLORS[state];
  const isActive = state !== 'stopped' && state !== 'blocked';
  const speed = state === 'critical' ? 0.8 : state === 'warning' ? 2.5 : 1.8;

  return (
    <UnitIconWrapper state={state} {...props}>
      <svg viewBox="0 0 64 64" width="100%" height="100%">
        {/* Trapezoidal tank */}
        <path
          d="M8,16 L56,16 L48,52 L16,52 Z"
          fill="none"
          stroke={colors.stroke}
          strokeWidth="1.5"
          opacity={0.6}
        />

        {/* Water fill */}
        <path
          d="M9,18 L55,18 L47.5,50 L16.5,50 Z"
          fill={colors.stroke}
          opacity={0.1}
        />

        {/* Settling particles */}
        {isActive && [0, 1, 2, 3, 4, 5].map((i) => (
          <motion.circle
            key={i}
            cx={20 + i * 5 + (i % 2) * 3}
            r={1.5}
            fill={colors.stroke}
            opacity={0.5}
            animate={{
              cy: [20, 46],
              opacity: [0.6, 0.15],
              cx: [20 + i * 5, 24 + i * 3],
            }}
            transition={{
              duration: speed,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'easeIn',
            }}
          />
        ))}

        {/* Sludge layer */}
        <motion.path
          d="M17,48 Q32,44 47,48 L47.5,50 L16.5,50 Z"
          fill={colors.stroke}
          animate={isActive ? { opacity: [0.2, 0.35, 0.2] } : { opacity: 0.2 }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Overflow weir */}
        <line x1="54" y1="20" x2="62" y2="20" stroke={colors.stroke} strokeWidth="1.5" opacity={0.4} />

        {/* Sludge drain */}
        <line x1="32" y1="52" x2="32" y2="60" stroke={colors.stroke} strokeWidth="1.5" opacity={0.4} />
      </svg>
    </UnitIconWrapper>
  );
}
