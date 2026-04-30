import { motion } from 'framer-motion';

type SafetyIconType = 'cbf-shield' | 'barrier-l1' | 'barrier-l2' | 'barrier-l3' | 'escalation';
type SafetyState = 'passed' | 'warned' | 'blocked' | 'idle';

interface SafetyIconProps {
  type: SafetyIconType;
  state?: SafetyState;
  size?: number;
  className?: string;
}

const SAFETY_COLORS: Record<SafetyState, { stroke: string; fill: string }> = {
  idle:    { stroke: '#71717a', fill: 'rgba(113,113,122,0.1)' },
  passed:  { stroke: '#34d399', fill: 'rgba(52,211,153,0.1)' },
  warned:  { stroke: '#fbbf24', fill: 'rgba(251,191,36,0.1)' },
  blocked: { stroke: '#ef4444', fill: 'rgba(239,68,68,0.15)' },
};

/**
 * CBF safety barrier icons.
 * Shield, L1/L2/L3 barriers, and escalation indicator.
 */
export function SafetyIcon({ type, state = 'idle', size = 32, className = '' }: SafetyIconProps) {
  const colors = SAFETY_COLORS[state];
  const isWarning = state === 'warned' || state === 'blocked';

  const icons: Record<SafetyIconType, JSX.Element> = {
    'cbf-shield': (
      <g>
        <path
          d="M16,2 L28,8 L28,18 C28,24 22,30 16,30 C10,30 4,24 4,18 L4,8 Z"
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth="1.5"
        />
        {state === 'passed' && <text x="16" y="20" textAnchor="middle" fill={colors.stroke} fontSize="12">✓</text>}
        {state === 'blocked' && <text x="16" y="20" textAnchor="middle" fill={colors.stroke} fontSize="12">✗</text>}
        {state === 'warned' && <text x="16" y="20" textAnchor="middle" fill={colors.stroke} fontSize="12">!</text>}
        {isWarning && <motion.path d="M16,2 L28,8 L28,18 C28,24 22,30 16,30 C10,30 4,24 4,18 L4,8 Z" fill="none" stroke={colors.stroke} strokeWidth="0.8" animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1, repeat: Infinity }} />}
      </g>
    ),
    'barrier-l1': (
      <g>
        <rect x="4" y="6" width="24" height="20" rx="3" fill={colors.fill} stroke={colors.stroke} strokeWidth="1.2" />
        <text x="16" y="14" textAnchor="middle" fill={colors.stroke} fontSize="7" fontWeight="bold">L1</text>
        <text x="16" y="22" textAnchor="middle" fill={colors.stroke} fontSize="5" opacity={0.6}>入力</text>
        {isWarning && <motion.rect x="4" y="6" width="24" height="20" rx="3" fill="none" stroke={colors.stroke} strokeWidth="0.8" animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 0.8, repeat: Infinity }} />}
      </g>
    ),
    'barrier-l2': (
      <g>
        <rect x="4" y="6" width="24" height="20" rx="3" fill={colors.fill} stroke={colors.stroke} strokeWidth="1.2" />
        <text x="16" y="14" textAnchor="middle" fill={colors.stroke} fontSize="7" fontWeight="bold">L2</text>
        <text x="16" y="22" textAnchor="middle" fill={colors.stroke} fontSize="5" opacity={0.6}>規制</text>
        {isWarning && <motion.rect x="4" y="6" width="24" height="20" rx="3" fill="none" stroke={colors.stroke} strokeWidth="0.8" animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 0.8, repeat: Infinity }} />}
      </g>
    ),
    'barrier-l3': (
      <g>
        <rect x="4" y="6" width="24" height="20" rx="3" fill={colors.fill} stroke={colors.stroke} strokeWidth="1.2" />
        <text x="16" y="14" textAnchor="middle" fill={colors.stroke} fontSize="7" fontWeight="bold">L3</text>
        <text x="16" y="22" textAnchor="middle" fill={colors.stroke} fontSize="5" opacity={0.6}>出力</text>
        {isWarning && <motion.rect x="4" y="6" width="24" height="20" rx="3" fill="none" stroke={colors.stroke} strokeWidth="0.8" animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 0.8, repeat: Infinity }} />}
      </g>
    ),
    'escalation': (
      <g>
        {/* 4-level staircase */}
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={4 + i * 6} y={22 - i * 6} width="6" height={6 + i * 6} rx="1"
            fill={i < 2 ? colors.fill : (state === 'blocked' ? 'rgba(239,68,68,0.2)' : colors.fill)}
            stroke={colors.stroke} strokeWidth="0.8" opacity={0.6 + i * 0.1}
          />
        ))}
        <text x="28" y="8" fill={colors.stroke} fontSize="6" fontWeight="bold" opacity={0.6}>L{state === 'blocked' ? '4' : state === 'warned' ? '2' : '1'}</text>
        {isWarning && <motion.rect x="2" y="2" width="28" height="28" rx="3" fill="none" stroke={colors.stroke} strokeWidth="0.5" animate={{ opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 1.2, repeat: Infinity }} />}
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
