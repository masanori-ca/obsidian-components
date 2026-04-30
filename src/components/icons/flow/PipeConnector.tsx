import { motion } from 'framer-motion';

type PipeType = 'straight' | 'elbow' | 'tee' | 'cross';
type PipeState = 'normal' | 'active' | 'warning' | 'blocked';

interface PipeConnectorProps {
  type?: PipeType;
  state?: PipeState;
  size?: number;
  rotation?: number;
  animated?: boolean;
  className?: string;
}

const PIPE_COLORS: Record<PipeState, string> = {
  normal:  '#52525b',
  active:  '#34d399',
  warning: '#fbbf24',
  blocked: '#ef4444',
};

/**
 * Pipe connector elements for building process flow diagrams.
 * Supports straight, elbow (90°), tee (T-junction), and cross connections.
 */
export function PipeConnector({
  type = 'straight',
  state = 'normal',
  size = 32,
  rotation = 0,
  animated = false,
  className = '',
}: PipeConnectorProps) {
  const color = PIPE_COLORS[state];
  const isFlowing = animated && state !== 'blocked';

  const paths: Record<PipeType, string> = {
    straight: 'M0,16 L32,16',
    elbow:    'M0,16 L16,16 L16,32',
    tee:      'M0,16 L32,16 M16,16 L16,32',
    cross:    'M0,16 L32,16 M16,0 L16,32',
  };

  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <path
          d={paths[type]}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Junction dot */}
        {(type === 'tee' || type === 'cross' || type === 'elbow') && (
          <circle cx="16" cy="16" r="2.5" fill={color} opacity={0.5} />
        )}

        {/* Flow particle */}
        {isFlowing && (
          <motion.circle
            r={1.5}
            fill={color}
            opacity={0.6}
            animate={
              type === 'straight'
                ? { cx: [4, 28], cy: [16, 16] }
                : type === 'elbow'
                  ? { cx: [4, 16, 16], cy: [16, 16, 28] }
                  : { cx: [4, 28], cy: [16, 16] }
            }
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </svg>
    </div>
  );
}
