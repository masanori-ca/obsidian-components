import { motion } from 'framer-motion';
import type { UnitIconProps } from './types';
import { STATE_COLORS } from './types';
import { UnitIconWrapper } from './UnitIconWrapper';

interface InfluentEffluentIconProps extends UnitIconProps {
  label?: string;
  variant?: 'influent' | 'effluent';
}

/**
 * Influent (inflow) / Effluent (outflow) terminal icon.
 * Influent: arrow flowing in. Effluent: arrow flowing out.
 */
export function InfluentEffluentIcon({ state = 'normal', variant = 'influent', ...props }: InfluentEffluentIconProps) {
  const colors = STATE_COLORS[state];
  const isActive = state !== 'stopped' && state !== 'blocked';
  const speed = state === 'critical' ? 0.5 : state === 'warning' ? 1.3 : 0.8;
  const isInfluent = variant === 'influent';

  return (
    <UnitIconWrapper state={state} {...props}>
      <svg viewBox="0 0 64 64" width="100%" height="100%">
        {/* Pipe */}
        <rect
          x={isInfluent ? 28 : 4}
          y="22"
          width="32"
          height="20"
          rx="4"
          fill="none"
          stroke={colors.stroke}
          strokeWidth="1.5"
          opacity={0.5}
        />

        {/* Water in pipe */}
        <rect
          x={isInfluent ? 30 : 6}
          y="24"
          width="28"
          height="16"
          rx="2"
          fill={colors.stroke}
          opacity={0.1}
        />

        {/* Arrow */}
        {isInfluent ? (
          <motion.g
            animate={isActive ? { x: [0, 4, 0] } : {}}
            transition={{ duration: speed, repeat: Infinity }}
          >
            <polygon points="8,32 22,22 22,28 28,28 28,36 22,36 22,42" fill={colors.stroke} opacity={0.5} />
          </motion.g>
        ) : (
          <motion.g
            animate={isActive ? { x: [0, 4, 0] } : {}}
            transition={{ duration: speed, repeat: Infinity }}
          >
            <polygon points="56,32 42,22 42,28 36,28 36,36 42,36 42,42" fill={colors.stroke} opacity={0.5} />
          </motion.g>
        )}

        {/* Flow particles */}
        {isActive && [0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cy="32"
            r={1.5}
            fill={colors.stroke}
            opacity={0.4}
            animate={isInfluent
              ? { cx: [2, 58] }
              : { cx: [6, 62] }
            }
            transition={{ duration: speed * 1.2, repeat: Infinity, delay: i * (speed / 3) }}
          />
        ))}

        {/* Label */}
        <text x="32" y="58" textAnchor="middle" fill={colors.stroke} fontSize="7" opacity={0.5} fontFamily="monospace">
          {isInfluent ? 'IN' : 'OUT'}
        </text>
      </svg>
    </UnitIconWrapper>
  );
}
