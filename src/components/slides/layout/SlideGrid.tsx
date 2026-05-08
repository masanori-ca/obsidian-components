/**
 * SlideGrid — Grid layout for placing components.
 */
import React from 'react';
import { SPACING } from '../tokens';

interface SlideGridProps {
  cols: number;
  gap?: number;
  children: React.ReactNode;
}

export function SlideGrid({ cols, gap = SPACING.gap.md, children }: SlideGridProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap,
    }}>
      {children}
    </div>
  );
}
