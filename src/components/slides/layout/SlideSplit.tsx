/**
 * SlideSplit — Two-column layout with configurable ratio.
 */
import React from 'react';
import { SPACING } from '../tokens';

interface SlideSplitProps {
  left: React.ReactNode;
  right: React.ReactNode;
  /** Left column ratio (e.g. 0.6 = 60% left, 40% right) */
  ratio?: number;
  gap?: number;
}

export function SlideSplit({ left, right, ratio = 0.5, gap = SPACING.gap.xl }: SlideSplitProps) {
  return (
    <div style={{ display: 'flex', gap }}>
      <div style={{ flex: ratio }}>{left}</div>
      <div style={{ flex: 1 - ratio }}>{right}</div>
    </div>
  );
}
