/**
 * SlideKpiGrid — Multiple KPI cards in a grid.
 */
import React from 'react';
import { SPACING } from '../tokens';
import { SlideKpiCard } from './SlideKpiCard';
import type { SlideColorScheme } from '../tokens';

interface KpiItem {
  value: string;
  label: string;
  description?: string;
  color?: string;
}

interface SlideKpiGridProps {
  items: KpiItem[];
  cols?: number;
  gap?: number;
  scheme?: SlideColorScheme;
}

export function SlideKpiGrid({ items, cols = 3, gap = SPACING.gap.md, scheme }: SlideKpiGridProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap,
    }}>
      {items.map((item, i) => (
        <SlideKpiCard key={i} {...item} scheme={scheme} />
      ))}
    </div>
  );
}
