export type UnitState = 'normal' | 'stopped' | 'warning' | 'high' | 'critical' | 'blocked';

export interface UnitIconProps {
  state?: UnitState;
  size?: number;
  selected?: boolean;
  className?: string;
  onClick?: () => void;
}

export const STATE_COLORS: Record<UnitState, { stroke: string; fill: string; glow: string }> = {
  normal:   { stroke: '#34d399', fill: 'rgba(52,211,153,0.08)',  glow: 'rgba(52,211,153,0.3)' },
  stopped:  { stroke: '#71717a', fill: 'rgba(113,113,122,0.08)', glow: 'rgba(113,113,122,0.2)' },
  warning:  { stroke: '#fbbf24', fill: 'rgba(251,191,36,0.08)',  glow: 'rgba(251,191,36,0.3)' },
  high:     { stroke: '#fb923c', fill: 'rgba(251,146,60,0.08)',  glow: 'rgba(251,146,60,0.4)' },
  critical: { stroke: '#f87171', fill: 'rgba(248,113,113,0.08)', glow: 'rgba(248,113,113,0.5)' },
  blocked:  { stroke: '#ef4444', fill: 'rgba(239,68,68,0.12)',   glow: 'rgba(239,68,68,0.5)' },
};
