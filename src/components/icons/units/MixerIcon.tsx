import { motion } from 'framer-motion';
import type { UnitIconProps } from './types';
import { STATE_COLORS } from './types';
import { UnitIconWrapper } from './UnitIconWrapper';

/**
 * Mixer / Agitator icon with rotating paddle animation.
 */
export function MixerIcon({ state = 'normal', ...props }: UnitIconProps & { label?: string }) {
  const colors = STATE_COLORS[state];
  const isActive = state !== 'stopped' && state !== 'blocked';
  const rpm = state === 'critical' ? 0.3 : state === 'high' ? 0.5 : state === 'warning' ? 1.0 : 0.7;

  return (
    <UnitIconWrapper state={state} {...props}>
      <svg viewBox="0 0 64 64" width="100%" height="100%">
        {/* Tank */}
        <rect x="10" y="18" width="44" height="34" rx="4" fill="none" stroke={colors.stroke} strokeWidth="1.5" opacity={0.5} />

        {/* Liquid */}
        <rect x="12" y="24" width="40" height="26" rx="2" fill={colors.stroke} opacity={0.1} />

        {/* Motor housing */}
        <rect x="26" y="4" width="12" height="10" rx="3" fill={colors.stroke} opacity={0.3} />

        {/* Shaft */}
        <line x1="32" y1="14" x2="32" y2="38" stroke={colors.stroke} strokeWidth="2" opacity={0.5} />

        {/* Paddles (rotating) */}
        <motion.g
          style={{ transformOrigin: '32px 38px' }}
          animate={isActive ? { rotate: 360 } : {}}
          transition={{ duration: rpm, repeat: Infinity, ease: 'linear' }}
        >
          {/* 4 paddles */}
          <rect x="18" y="36" width="12" height="4" rx="1" fill={colors.stroke} opacity={0.6} />
          <rect x="34" y="36" width="12" height="4" rx="1" fill={colors.stroke} opacity={0.6} />
          <rect x="30" y="26" width="4" height="12" rx="1" fill={colors.stroke} opacity={0.4} />
          <rect x="30" y="40" width="4" height="12" rx="1" fill={colors.stroke} opacity={0.4} />
        </motion.g>

        {/* Vortex lines */}
        {isActive && (
          <motion.g
            animate={{ opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: rpm * 2, repeat: Infinity }}
          >
            <circle cx="32" cy="38" r="8" fill="none" stroke={colors.stroke} strokeWidth="0.5" opacity={0.2} />
            <circle cx="32" cy="38" r="14" fill="none" stroke={colors.stroke} strokeWidth="0.5" opacity={0.15} />
          </motion.g>
        )}

        {/* Inlet */}
        <line x1="0" y1="30" x2="10" y2="30" stroke={colors.stroke} strokeWidth="1.5" opacity={0.4} />
        {/* Outlet */}
        <line x1="54" y1="44" x2="64" y2="44" stroke={colors.stroke} strokeWidth="1.5" opacity={0.4} />
      </svg>
    </UnitIconWrapper>
  );
}
