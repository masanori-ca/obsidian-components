import { motion } from 'framer-motion';
import type { UnitIconProps } from './types';
import { STATE_COLORS } from './types';
import { UnitIconWrapper } from './UnitIconWrapper';

/**
 * Membrane (RO/MF/UF/MBBR) icon with filtration flow animation.
 * Particles approach membrane, clean water passes through.
 */
export function MembraneIcon({ state = 'normal', ...props }: UnitIconProps & { label?: string }) {
  const colors = STATE_COLORS[state];
  const isActive = state !== 'stopped' && state !== 'blocked';
  const speed = state === 'critical' ? 0.6 : state === 'warning' ? 1.5 : 1.0;

  return (
    <UnitIconWrapper state={state} {...props}>
      <svg viewBox="0 0 64 64" width="100%" height="100%">
        {/* Housing */}
        <rect x="8" y="12" width="48" height="40" rx="6" fill="none" stroke={colors.stroke} strokeWidth="1.5" opacity={0.6} />

        {/* Membrane elements (vertical lines) */}
        {[24, 32, 40].map((x) => (
          <line key={x} x1={x} y1="16" x2={x} y2="48" stroke={colors.stroke} strokeWidth="1" opacity={0.3} strokeDasharray="2 2" />
        ))}

        {/* Feed flow (left side particles) */}
        {isActive && [0, 1, 2].map((i) => (
          <motion.circle
            key={`feed-${i}`}
            cy={22 + i * 10}
            r={2}
            fill={colors.stroke}
            opacity={0.5}
            animate={{
              cx: [4, 22],
              opacity: [0.6, 0.2],
            }}
            transition={{
              duration: speed,
              repeat: Infinity,
              delay: i * 0.35,
            }}
          />
        ))}

        {/* Permeate flow (right side - clean, smaller) */}
        {isActive && [0, 1, 2].map((i) => (
          <motion.circle
            key={`perm-${i}`}
            cy={22 + i * 10}
            r={1}
            fill={colors.stroke}
            opacity={0.3}
            animate={{
              cx: [42, 60],
              opacity: [0.4, 0],
            }}
            transition={{
              duration: speed * 0.8,
              repeat: Infinity,
              delay: i * 0.35 + speed * 0.3,
            }}
          />
        ))}

        {/* Pressure indicator */}
        <motion.text
          x="16"
          y="34"
          fill={colors.stroke}
          opacity={0.5}
          fontSize="8"
          fontFamily="monospace"
          animate={isActive ? { opacity: [0.3, 0.6, 0.3] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          P
        </motion.text>

        {/* Inlet */}
        <line x1="0" y1="28" x2="8" y2="28" stroke={colors.stroke} strokeWidth="1.5" opacity={0.4} />
        {/* Permeate outlet */}
        <line x1="56" y1="28" x2="64" y2="28" stroke={colors.stroke} strokeWidth="1.5" opacity={0.4} />
        {/* Concentrate outlet */}
        <line x1="56" y1="40" x2="64" y2="40" stroke={colors.stroke} strokeWidth="1" opacity={0.25} />
      </svg>
    </UnitIconWrapper>
  );
}
