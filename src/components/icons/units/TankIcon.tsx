import { motion } from 'framer-motion';
import type { UnitIconProps } from './types';
import { STATE_COLORS } from './types';
import { UnitIconWrapper } from './UnitIconWrapper';

/**
 * Storage tank icon with liquid level animation.
 * Level gently oscillates. Warning states show level changes.
 */
export function TankIcon({ state = 'normal', ...props }: UnitIconProps & { label?: string }) {
  const colors = STATE_COLORS[state];
  const isActive = state !== 'stopped' && state !== 'blocked';
  const levelBase = state === 'critical' ? 18 : state === 'high' ? 14 : 22;

  return (
    <UnitIconWrapper state={state} {...props}>
      <svg viewBox="0 0 64 64" width="100%" height="100%">
        {/* Tank body */}
        <path
          d="M14,10 L14,48 Q14,54 20,54 L44,54 Q50,54 50,48 L50,10"
          fill="none"
          stroke={colors.stroke}
          strokeWidth="1.5"
          opacity={0.6}
        />

        {/* Tank top (dome) */}
        <path
          d="M14,10 Q14,4 32,4 Q50,4 50,10"
          fill="none"
          stroke={colors.stroke}
          strokeWidth="1.5"
          opacity={0.6}
        />

        {/* Liquid fill */}
        <motion.rect
          x="15"
          width="34"
          rx="1"
          fill={colors.stroke}
          opacity={0.15}
          animate={isActive
            ? { y: [levelBase, levelBase - 2, levelBase], height: [54 - levelBase, 56 - levelBase, 54 - levelBase] }
            : { y: levelBase, height: 54 - levelBase }
          }
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Liquid surface wave */}
        {isActive && (
          <motion.path
            d={`M15,${levelBase} Q24,${levelBase - 2} 32,${levelBase} Q40,${levelBase + 2} 49,${levelBase}`}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="1"
            opacity={0.4}
            animate={{
              d: [
                `M15,${levelBase} Q24,${levelBase - 2} 32,${levelBase} Q40,${levelBase + 2} 49,${levelBase}`,
                `M15,${levelBase} Q24,${levelBase + 2} 32,${levelBase} Q40,${levelBase - 2} 49,${levelBase}`,
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Level indicator marks */}
        {[20, 30, 40].map((y) => (
          <line key={y} x1="50" y1={y} x2="54" y2={y} stroke={colors.stroke} strokeWidth="0.8" opacity={0.25} />
        ))}

        {/* Inlet pipe */}
        <line x1="0" y1="20" x2="14" y2="20" stroke={colors.stroke} strokeWidth="1.5" opacity={0.4} />
        {/* Outlet pipe */}
        <line x1="50" y1="46" x2="64" y2="46" stroke={colors.stroke} strokeWidth="1.5" opacity={0.4} />
      </svg>
    </UnitIconWrapper>
  );
}
