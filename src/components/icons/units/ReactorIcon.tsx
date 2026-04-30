import { motion } from 'framer-motion';
import type { UnitIconProps } from './types';
import { STATE_COLORS } from './types';
import { UnitIconWrapper } from './UnitIconWrapper';

/**
 * CSTR / Reactor icon with bubbling aeration animation.
 * Normal: bubbles rise. Warning: slow bubbles. Critical: frantic bubbles. Stopped: no bubbles.
 */
export function ReactorIcon({ state = 'normal', ...props }: UnitIconProps & { label?: string }) {
  const colors = STATE_COLORS[state];
  const isActive = state !== 'stopped' && state !== 'blocked';
  const speed = state === 'critical' ? 0.6 : state === 'high' ? 0.9 : state === 'warning' ? 1.8 : 1.2;

  return (
    <UnitIconWrapper state={state} {...props}>
      <svg viewBox="0 0 64 64" width="100%" height="100%">
        {/* Tank body */}
        <rect x="10" y="14" width="44" height="36" rx="4" fill="none" stroke={colors.stroke} strokeWidth="1.5" opacity={0.6} />

        {/* Water level */}
        <motion.rect
          x="12" y="20" width="40" rx="2"
          fill={colors.stroke}
          opacity={0.15}
          animate={isActive ? { height: [28, 26, 28] } : { height: 28 }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Bubbles */}
        {isActive && [0, 1, 2, 3, 4].map((i) => (
          <motion.circle
            key={i}
            cx={20 + i * 7}
            r={state === 'critical' ? 2.5 : 2}
            fill={colors.stroke}
            opacity={0.4}
            animate={{
              cy: [46, 22],
              opacity: [0.5, 0],
              r: [1.5, 3],
            }}
            transition={{
              duration: speed,
              repeat: Infinity,
              delay: i * (speed / 5),
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Agitator shaft */}
        <line x1="32" y1="8" x2="32" y2="24" stroke={colors.stroke} strokeWidth="1.5" opacity={0.5} />

        {/* Agitator blade */}
        <motion.g
          animate={isActive ? { rotate: 360 } : {}}
          transition={{ duration: speed * 2, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '32px 24px' }}
        >
          <line x1="24" y1="24" x2="40" y2="24" stroke={colors.stroke} strokeWidth="2" strokeLinecap="round" />
        </motion.g>

        {/* Inlet/Outlet pipes */}
        <line x1="2" y1="24" x2="10" y2="24" stroke={colors.stroke} strokeWidth="1.5" opacity={0.4} />
        <line x1="54" y1="40" x2="62" y2="40" stroke={colors.stroke} strokeWidth="1.5" opacity={0.4} />
      </svg>
    </UnitIconWrapper>
  );
}
