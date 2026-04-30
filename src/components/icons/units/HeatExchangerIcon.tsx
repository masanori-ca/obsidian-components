import { motion } from 'framer-motion';
import type { UnitIconProps } from './types';
import { STATE_COLORS } from './types';
import { UnitIconWrapper } from './UnitIconWrapper';

/**
 * Heat exchanger icon with flowing hot/cold streams animation.
 */
export function HeatExchangerIcon({ state = 'normal', ...props }: UnitIconProps & { label?: string }) {
  const colors = STATE_COLORS[state];
  const isActive = state !== 'stopped' && state !== 'blocked';
  const speed = state === 'critical' ? 0.5 : state === 'warning' ? 1.5 : 0.9;

  return (
    <UnitIconWrapper state={state} {...props}>
      <svg viewBox="0 0 64 64" width="100%" height="100%">
        {/* Shell */}
        <rect x="12" y="14" width="40" height="36" rx="4" fill="none" stroke={colors.stroke} strokeWidth="1.5" opacity={0.6} />

        {/* Tube bundle (zigzag) */}
        <path
          d="M16,22 L48,22 L48,28 L16,28 L16,34 L48,34 L48,40 L16,40"
          fill="none"
          stroke={colors.stroke}
          strokeWidth="1"
          opacity={0.3}
        />

        {/* Hot stream flow (top) */}
        {isActive && [0, 1, 2].map((i) => (
          <motion.circle
            key={`hot-${i}`}
            cy="22"
            r={1.5}
            fill="#fb923c"
            opacity={0.6}
            animate={{ cx: [14, 50] }}
            transition={{ duration: speed, repeat: Infinity, delay: i * (speed / 3) }}
          />
        ))}

        {/* Cold stream flow (bottom, reverse) */}
        {isActive && [0, 1, 2].map((i) => (
          <motion.circle
            key={`cold-${i}`}
            cy="40"
            r={1.5}
            fill="#38bdf8"
            opacity={0.6}
            animate={{ cx: [50, 14] }}
            transition={{ duration: speed, repeat: Infinity, delay: i * (speed / 3) }}
          />
        ))}

        {/* Temperature labels */}
        <text x="8" y="12" fill="#fb923c" opacity={0.5} fontSize="7" fontFamily="monospace">H</text>
        <text x="52" y="54" fill="#38bdf8" opacity={0.5} fontSize="7" fontFamily="monospace">C</text>

        {/* Inlet/Outlet */}
        <line x1="0" y1="22" x2="12" y2="22" stroke="#fb923c" strokeWidth="1.5" opacity={0.3} />
        <line x1="52" y1="22" x2="64" y2="22" stroke="#fb923c" strokeWidth="1.5" opacity={0.3} />
        <line x1="52" y1="40" x2="64" y2="40" stroke="#38bdf8" strokeWidth="1.5" opacity={0.3} />
        <line x1="0" y1="40" x2="12" y2="40" stroke="#38bdf8" strokeWidth="1.5" opacity={0.3} />
      </svg>
    </UnitIconWrapper>
  );
}
