import { motion } from 'framer-motion';
import type { UnitIconProps } from './types';
import { STATE_COLORS } from './types';
import type { ReactNode } from 'react';

interface UnitIconWrapperProps extends UnitIconProps {
  children: ReactNode;
  label?: string;
}

/**
 * Shared wrapper for all animated unit icons.
 * Handles state-based outer effects: glow, pulse, shake, blocked overlay.
 */
export function UnitIconWrapper({
  state = 'normal',
  size = 64,
  selected = false,
  className = '',
  onClick,
  children,
  label,
}: UnitIconWrapperProps) {
  const colors = STATE_COLORS[state];

  const shakeAnimation = state === 'critical'
    ? { x: [0, -2, 2, -2, 2, 0] }
    : state === 'high'
      ? { x: [0, -1, 1, 0] }
      : {};

  const shakeTransition = state === 'critical'
    ? { duration: 0.4, repeat: Infinity, repeatDelay: 1.5 }
    : state === 'high'
      ? { duration: 0.5, repeat: Infinity, repeatDelay: 3 }
      : {};

  return (
    <motion.div
      className={`relative inline-flex flex-col items-center gap-1 cursor-pointer ${className}`}
      onClick={onClick}
      animate={shakeAnimation}
      transition={shakeTransition}
    >
      {/* Glow ring */}
      {state !== 'normal' && state !== 'stopped' && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size + 12,
            height: size + 12,
            top: -6,
            left: '50%',
            transform: 'translateX(-50%)',
            boxShadow: `0 0 ${state === 'critical' ? 20 : 12}px ${colors.glow}`,
          }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{
            duration: state === 'critical' ? 0.8 : state === 'high' ? 1.2 : 2,
            repeat: Infinity,
          }}
        />
      )}

      {/* Selection ring */}
      {selected && (
        <motion.div
          className="absolute rounded-xl border-2 border-sky-400"
          style={{ width: size + 8, height: size + 8, top: -4, left: '50%', transform: 'translateX(-50%)' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Icon container */}
      <div
        className="relative rounded-xl border overflow-hidden"
        style={{
          width: size,
          height: size,
          borderColor: colors.stroke,
          backgroundColor: colors.fill,
        }}
      >
        {children}

        {/* Blocked overlay */}
        {state === 'blocked' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(239,68,68,0.25)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2.5" />
              <line x1="6" y1="6" x2="18" y2="18" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </motion.div>
        )}

        {/* Stopped overlay */}
        {state === 'stopped' && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="#71717a">
              <rect x="6" y="4" width="12" height="16" rx="2" />
            </svg>
          </div>
        )}
      </div>

      {/* Label */}
      {label && (
        <span
          className="text-[10px] font-medium"
          style={{ color: colors.stroke }}
        >
          {label}
        </span>
      )}
    </motion.div>
  );
}
