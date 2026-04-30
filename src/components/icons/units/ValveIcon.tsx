import { motion } from 'framer-motion';
import type { UnitIconProps } from './types';
import { STATE_COLORS } from './types';
import { UnitIconWrapper } from './UnitIconWrapper';

/**
 * Valve icon. Open/closed state with flow animation.
 * Normal = open flowing, Stopped = closed, Blocked = forced closed.
 */
export function ValveIcon({ state = 'normal', ...props }: UnitIconProps & { label?: string }) {
  const colors = STATE_COLORS[state];
  const isOpen = state !== 'stopped' && state !== 'blocked';
  const speed = state === 'critical' ? 0.5 : state === 'warning' ? 1.2 : 0.8;

  return (
    <UnitIconWrapper state={state} {...props}>
      <svg viewBox="0 0 64 64" width="100%" height="100%">
        {/* Pipe */}
        <line x1="0" y1="32" x2="22" y2="32" stroke={colors.stroke} strokeWidth="3" opacity={0.4} />
        <line x1="42" y1="32" x2="64" y2="32" stroke={colors.stroke} strokeWidth="3" opacity={0.4} />

        {/* Valve body (bowtie shape) */}
        <path
          d="M22,20 L32,32 L22,44 Z"
          fill={isOpen ? colors.fill : colors.stroke}
          stroke={colors.stroke}
          strokeWidth="1.5"
          opacity={isOpen ? 0.6 : 0.8}
        />
        <path
          d="M42,20 L32,32 L42,44 Z"
          fill={isOpen ? colors.fill : colors.stroke}
          stroke={colors.stroke}
          strokeWidth="1.5"
          opacity={isOpen ? 0.6 : 0.8}
        />

        {/* Stem */}
        <line x1="32" y1="10" x2="32" y2="20" stroke={colors.stroke} strokeWidth="2" opacity={0.6} />

        {/* Handwheel */}
        <motion.g
          style={{ transformOrigin: '32px 10px' }}
          animate={isOpen ? { rotate: [0, 15, 0, -15, 0] } : {}}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <line x1="24" y1="10" x2="40" y2="10" stroke={colors.stroke} strokeWidth="2" strokeLinecap="round" opacity={0.5} />
          <circle cx="32" cy="10" r="2" fill={colors.stroke} opacity={0.4} />
        </motion.g>

        {/* Flow particles */}
        {isOpen && [0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cy="32"
            r={1.5}
            fill={colors.stroke}
            opacity={0.4}
            animate={{ cx: [10, 54] }}
            transition={{ duration: speed, repeat: Infinity, delay: i * (speed / 3) }}
          />
        ))}

        {/* Closed indicator */}
        {!isOpen && state !== 'blocked' && (
          <text x="32" y="58" textAnchor="middle" fill={colors.stroke} fontSize="7" opacity={0.6} fontFamily="monospace">
            CLOSED
          </text>
        )}
      </svg>
    </UnitIconWrapper>
  );
}
