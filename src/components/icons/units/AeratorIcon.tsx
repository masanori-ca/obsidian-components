import { motion } from 'framer-motion';
import type { UnitIconProps } from './types';
import { STATE_COLORS } from './types';
import { UnitIconWrapper } from './UnitIconWrapper';

/**
 * Aerator / Blower icon with rising bubble stream animation.
 * Dense bubble stream from diffuser at bottom.
 */
export function AeratorIcon({ state = 'normal', ...props }: UnitIconProps & { label?: string }) {
  const colors = STATE_COLORS[state];
  const isActive = state !== 'stopped' && state !== 'blocked';
  const speed = state === 'critical' ? 0.5 : state === 'warning' ? 1.5 : 0.9;

  const bubbles = [
    { cx: 22, delay: 0, size: 2 },
    { cx: 28, delay: 0.15, size: 2.5 },
    { cx: 32, delay: 0.3, size: 3 },
    { cx: 36, delay: 0.1, size: 2 },
    { cx: 42, delay: 0.25, size: 2.5 },
    { cx: 25, delay: 0.4, size: 1.5 },
    { cx: 39, delay: 0.35, size: 1.5 },
  ];

  return (
    <UnitIconWrapper state={state} {...props}>
      <svg viewBox="0 0 64 64" width="100%" height="100%">
        {/* Diffuser bar at bottom */}
        <rect x="18" y="48" width="28" height="4" rx="2" fill={colors.stroke} opacity={0.4} />

        {/* Diffuser holes */}
        {[22, 28, 34, 40].map((x) => (
          <circle key={x} cx={x} cy="50" r="1" fill={colors.stroke} opacity={0.6} />
        ))}

        {/* Rising bubbles */}
        {isActive && bubbles.map((b, i) => (
          <motion.circle
            key={i}
            cx={b.cx}
            r={b.size}
            fill={colors.stroke}
            animate={{
              cy: [48, 10],
              opacity: [0.5, 0],
              r: [b.size, b.size * 1.8],
            }}
            transition={{
              duration: speed,
              repeat: Infinity,
              delay: b.delay,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Air supply pipe */}
        <line x1="32" y1="52" x2="32" y2="62" stroke={colors.stroke} strokeWidth="1.5" opacity={0.3} />

        {/* Fan/blower symbol at top */}
        <motion.g
          style={{ transformOrigin: '32px 8px' }}
          animate={isActive ? { rotate: 360 } : {}}
          transition={{ duration: speed * 1.5, repeat: Infinity, ease: 'linear' }}
        >
          <circle cx="32" cy="8" r="5" fill="none" stroke={colors.stroke} strokeWidth="1" opacity={0.3} />
          <line x1="29" y1="5" x2="35" y2="11" stroke={colors.stroke} strokeWidth="1" opacity={0.4} />
          <line x1="35" y1="5" x2="29" y2="11" stroke={colors.stroke} strokeWidth="1" opacity={0.4} />
        </motion.g>
      </svg>
    </UnitIconWrapper>
  );
}
