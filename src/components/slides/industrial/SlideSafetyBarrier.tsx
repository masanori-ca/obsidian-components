/**
 * SlideSafetyBarrier — CBF 5-layer defense visualization.
 */
import React from 'react';
import { FONT, SPACING, COLOR_SCHEMES, type SlideColorScheme } from '../tokens';

interface BarrierLayer {
  id: string;
  label: string;
  color?: string;
}

interface SlideSafetyBarrierProps {
  layers?: BarrierLayer[];
  scheme?: SlideColorScheme;
}

const DEFAULT_LAYERS: BarrierLayer[] = [
  { id: 'L0', label: 'データ取込時' },
  { id: 'L1', label: '生成前 (CAP)' },
  { id: 'L2', label: '生成中 (Inject)' },
  { id: 'L3', label: '生成後 (Scan)' },
  { id: 'L4', label: 'セッション全体' },
];

export function SlideSafetyBarrier({
  layers = DEFAULT_LAYERS,
  scheme = COLOR_SCHEMES.default,
}: SlideSafetyBarrierProps) {
  return (
    <div style={{ display: 'flex', gap: SPACING.gap.xs }}>
      {layers.map((layer, i) => {
        const c = layer.color || scheme.accent[i % scheme.accent.length];
        return (
          <div key={layer.id} style={{
            flex: 1, textAlign: 'center',
            padding: `${SPACING.padding.sm}px 0`,
            background: `${c}15`,
            borderRadius: SPACING.radius.sm,
            borderTop: `3px solid ${c}`,
          }}>
            <div style={{
              fontSize: FONT.size.body,
              fontWeight: FONT.weight.bold,
              color: c,
            }}>
              {layer.id}
            </div>
            <div style={{
              fontSize: FONT.size.badge,
              color: scheme.textMuted,
            }}>
              {layer.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
