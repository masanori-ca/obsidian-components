import { motion } from 'framer-motion';

type BrainIconType = 'brain' | 'causal' | 'equation' | 'compile' | 'grow' | 'whatif' | 'optimize' | 'autopilot' | 'proof';
type BrainIconState = 'idle' | 'active' | 'success' | 'error';

interface BrainServiceIconProps {
  type: BrainIconType;
  state?: BrainIconState;
  size?: number;
  className?: string;
}

const STATE_COLORS: Record<BrainIconState, { stroke: string; fill: string }> = {
  idle:    { stroke: '#71717a', fill: 'rgba(113,113,122,0.1)' },
  active:  { stroke: '#38bdf8', fill: 'rgba(56,189,248,0.1)' },
  success: { stroke: '#34d399', fill: 'rgba(52,211,153,0.1)' },
  error:   { stroke: '#f87171', fill: 'rgba(248,113,113,0.1)' },
};

/**
 * PCK Brain service concept icons.
 * Each icon represents a Brain capability with state-based animation.
 */
export function BrainServiceIcon({ type, state = 'idle', size = 32, className = '' }: BrainServiceIconProps) {
  const colors = STATE_COLORS[state];
  const isActive = state === 'active';

  const icons: Record<BrainIconType, JSX.Element> = {
    brain: (
      <g>
        {/* Brain shape */}
        <path d="M16,4 C8,4 4,10 4,16 C4,22 8,28 16,28 C24,28 28,22 28,16 C28,10 24,4 16,4" fill="none" stroke={colors.stroke} strokeWidth="1.5" />
        <path d="M16,4 C16,4 12,10 12,16 C12,22 16,28 16,28" fill="none" stroke={colors.stroke} strokeWidth="0.8" opacity={0.4} />
        <path d="M16,4 C16,4 20,10 20,16 C20,22 16,28 16,28" fill="none" stroke={colors.stroke} strokeWidth="0.8" opacity={0.4} />
        <line x1="6" y1="12" x2="26" y2="12" stroke={colors.stroke} strokeWidth="0.8" opacity={0.3} />
        <line x1="5" y1="20" x2="27" y2="20" stroke={colors.stroke} strokeWidth="0.8" opacity={0.3} />
        {isActive && <motion.circle cx="16" cy="16" r="3" fill={colors.stroke} opacity={0.3} animate={{ r: [3, 5, 3] }} transition={{ duration: 1.5, repeat: Infinity }} />}
      </g>
    ),
    causal: (
      <g>
        {/* Causal graph: nodes + directed edges */}
        <circle cx="8" cy="8" r="3" fill={colors.fill} stroke={colors.stroke} strokeWidth="1.2" />
        <circle cx="24" cy="8" r="3" fill={colors.fill} stroke={colors.stroke} strokeWidth="1.2" />
        <circle cx="16" cy="24" r="3" fill={colors.fill} stroke={colors.stroke} strokeWidth="1.2" />
        <line x1="10" y1="10" x2="14" y2="22" stroke={colors.stroke} strokeWidth="1" markerEnd="url(#arrow)" />
        <line x1="22" y1="10" x2="18" y2="22" stroke={colors.stroke} strokeWidth="1" markerEnd="url(#arrow)" />
        {isActive && <motion.circle cx="12" cy="16" r="1" fill={colors.stroke} animate={{ cx: [10, 14], cy: [10, 22] }} transition={{ duration: 0.8, repeat: Infinity }} />}
        <defs><marker id="arrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={colors.stroke} /></marker></defs>
      </g>
    ),
    equation: (
      <g>
        <text x="16" y="12" textAnchor="middle" fill={colors.stroke} fontSize="9" fontFamily="serif" fontStyle="italic">f(x)</text>
        <line x1="6" y1="16" x2="26" y2="16" stroke={colors.stroke} strokeWidth="1" opacity={0.4} />
        <text x="16" y="26" textAnchor="middle" fill={colors.stroke} fontSize="7" fontFamily="monospace" opacity={0.6}>=y</text>
        {isActive && <motion.rect x="5" y="5" width="22" height="22" rx="3" fill="none" stroke={colors.stroke} strokeWidth="0.8" animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 1, repeat: Infinity }} />}
      </g>
    ),
    compile: (
      <g>
        <rect x="4" y="4" width="10" height="8" rx="1" fill={colors.fill} stroke={colors.stroke} strokeWidth="1" />
        <rect x="18" y="4" width="10" height="8" rx="1" fill={colors.fill} stroke={colors.stroke} strokeWidth="1" />
        <rect x="4" y="20" width="10" height="8" rx="1" fill={colors.fill} stroke={colors.stroke} strokeWidth="1" />
        <rect x="18" y="20" width="24" height="8" rx="1" fill={colors.fill} stroke={colors.stroke} strokeWidth="1" />
        {isActive && <motion.path d="M14,8 L18,8 M14,24 L18,24 M9,12 L9,20 M23,12 L23,20" fill="none" stroke={colors.stroke} strokeWidth="1" animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 0.8, repeat: Infinity }} />}
      </g>
    ),
    grow: (
      <g>
        <circle cx="16" cy="20" r="4" fill={colors.fill} stroke={colors.stroke} strokeWidth="1.2" />
        <line x1="16" y1="16" x2="16" y2="6" stroke={colors.stroke} strokeWidth="1" />
        <line x1="16" y1="6" x2="10" y2="4" stroke={colors.stroke} strokeWidth="1" />
        <line x1="16" y1="6" x2="22" y2="4" stroke={colors.stroke} strokeWidth="1" />
        {isActive && <motion.circle cx="16" cy="6" r="2" fill={colors.stroke} opacity={0.4} animate={{ r: [1, 3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />}
      </g>
    ),
    whatif: (
      <g>
        <text x="16" y="14" textAnchor="middle" fill={colors.stroke} fontSize="11" fontFamily="serif" fontWeight="bold">?</text>
        <path d="M6,20 L12,18 L18,22 L24,16 L28,20" fill="none" stroke={colors.stroke} strokeWidth="1.2" />
        <path d="M6,20 L12,22 L18,18 L24,24 L28,20" fill="none" stroke={colors.stroke} strokeWidth="1" opacity={0.3} strokeDasharray="2 1" />
        {isActive && <motion.circle cx="24" cy="16" r="2" fill={colors.stroke} opacity={0.5} animate={{ cy: [16, 24, 16] }} transition={{ duration: 1, repeat: Infinity }} />}
      </g>
    ),
    optimize: (
      <g>
        <path d="M6,26 L12,20 L18,22 L22,12 L26,6" fill="none" stroke={colors.stroke} strokeWidth="1.5" />
        <circle cx="26" cy="6" r="2.5" fill={colors.stroke} opacity={0.5} />
        <text x="26" y="8" textAnchor="middle" fill="#09090b" fontSize="5" fontWeight="bold">*</text>
        {isActive && <motion.circle cx="6" cy="26" r="2" fill={colors.stroke} opacity={0.5} animate={{ cx: [6, 26], cy: [26, 6] }} transition={{ duration: 1.5, repeat: Infinity }} />}
      </g>
    ),
    autopilot: (
      <g>
        <circle cx="16" cy="16" r="10" fill="none" stroke={colors.stroke} strokeWidth="1.2" />
        <motion.g style={{ transformOrigin: '16px 16px' }} animate={isActive ? { rotate: 360 } : {}} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
          <line x1="16" y1="6" x2="16" y2="12" stroke={colors.stroke} strokeWidth="1.5" strokeLinecap="round" />
        </motion.g>
        <circle cx="16" cy="16" r="2" fill={colors.stroke} opacity={0.6} />
        <text x="16" y="30" textAnchor="middle" fill={colors.stroke} fontSize="5" opacity={0.5}>AUTO</text>
      </g>
    ),
    proof: (
      <g>
        <rect x="6" y="4" width="20" height="24" rx="2" fill="none" stroke={colors.stroke} strokeWidth="1.2" />
        <line x1="10" y1="10" x2="22" y2="10" stroke={colors.stroke} strokeWidth="0.8" opacity={0.4} />
        <line x1="10" y1="14" x2="22" y2="14" stroke={colors.stroke} strokeWidth="0.8" opacity={0.4} />
        <line x1="10" y1="18" x2="18" y2="18" stroke={colors.stroke} strokeWidth="0.8" opacity={0.4} />
        <circle cx="20" cy="22" r="3" fill={colors.fill} stroke={colors.stroke} strokeWidth="1" />
        <text x="20" y="24" textAnchor="middle" fill={colors.stroke} fontSize="5">✓</text>
        {isActive && <motion.rect x="6" y="4" width="20" height="24" rx="2" fill="none" stroke={colors.stroke} strokeWidth="0.5" animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 1, repeat: Infinity }} />}
      </g>
    ),
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 32 32" width={size} height={size}>
        {icons[type]}
      </svg>
    </div>
  );
}
