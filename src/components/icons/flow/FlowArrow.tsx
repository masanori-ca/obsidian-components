import { motion } from 'framer-motion';

type ArrowDirection = 'right' | 'left' | 'up' | 'down';
type ArrowState = 'normal' | 'active' | 'warning' | 'critical' | 'blocked' | 'inactive';

interface FlowArrowProps {
  direction?: ArrowDirection;
  state?: ArrowState;
  size?: number;
  animated?: boolean;
  label?: string;
  className?: string;
}

const ARROW_COLORS: Record<ArrowState, { stroke: string; particle: string }> = {
  normal:   { stroke: '#52525b', particle: '#34d399' },
  active:   { stroke: '#34d399', particle: '#34d399' },
  warning:  { stroke: '#fbbf24', particle: '#fbbf24' },
  critical: { stroke: '#f87171', particle: '#f87171' },
  blocked:  { stroke: '#ef4444', particle: '#ef4444' },
  inactive: { stroke: '#3f3f46', particle: '#3f3f46' },
};

const ROTATION: Record<ArrowDirection, number> = {
  right: 0,
  down: 90,
  left: 180,
  up: 270,
};

/**
 * Animated flow arrow for connecting process units.
 * Shows flow direction with animated particles.
 */
export function FlowArrow({
  direction = 'right',
  state = 'normal',
  size = 40,
  animated = true,
  label,
  className = '',
}: FlowArrowProps) {
  const colors = ARROW_COLORS[state];
  const isFlowing = animated && state !== 'blocked' && state !== 'inactive';
  const speed = state === 'critical' ? 0.4 : state === 'warning' ? 0.8 : 0.6;

  return (
    <div className={`inline-flex flex-col items-center gap-0.5 ${className}`}>
      <svg
        viewBox="0 0 48 24"
        width={size}
        height={size * 0.5}
        style={{ transform: `rotate(${ROTATION[direction]}deg)` }}
      >
        {/* Pipe line */}
        <line x1="4" y1="12" x2="36" y2="12" stroke={colors.stroke} strokeWidth="2" strokeLinecap="round" />

        {/* Arrow head */}
        <polygon
          points="34,6 44,12 34,18"
          fill={colors.stroke}
          opacity={0.8}
        />

        {/* Blocked X */}
        {state === 'blocked' && (
          <g>
            <line x1="18" y1="6" x2="28" y2="18" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="28" y1="6" x2="18" y2="18" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {/* Flow particles */}
        {isFlowing && [0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cy="12"
            r={1.5}
            fill={colors.particle}
            opacity={0.6}
            animate={{ cx: [6, 38] }}
            transition={{
              duration: speed,
              repeat: Infinity,
              delay: i * (speed / 3),
              ease: 'linear',
            }}
          />
        ))}
      </svg>

      {label && (
        <span className="text-[8px] text-zinc-500">{label}</span>
      )}
    </div>
  );
}
