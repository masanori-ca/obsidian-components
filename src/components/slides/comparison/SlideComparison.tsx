/**
 * SlideComparison — Side-by-side comparison blocks.
 */
import React from 'react';
import { FONT, SPACING, SHADOW, COLOR_SCHEMES, type SlideColorScheme } from '../tokens';

interface ComparisonSide {
  title: string;
  items: { icon: string; text: string }[];
  color: string;
}

interface SlideComparisonProps {
  left: ComparisonSide;
  right: ComparisonSide;
  gap?: number;
  scheme?: SlideColorScheme;
}

function Block({ data, scheme }: { data: ComparisonSide; scheme: SlideColorScheme }) {
  return (
    <div style={{
      flex: 1,
      background: scheme.cardBg,
      borderRadius: SPACING.radius.lg,
      padding: `${SPACING.padding.lg}px ${SPACING.padding.xl}px`,
      boxShadow: SHADOW.deep,
      borderLeft: `4px solid ${data.color}`,
    }}>
      <div style={{
        fontSize: FONT.size.componentTitle,
        fontWeight: FONT.weight.bold,
        color: data.color,
        marginBottom: 10,
      }}>
        {data.title}
      </div>
      {data.items.map((item, i) => (
        <div key={i} style={{
          fontSize: FONT.size.caption,
          color: item.icon === '✓' ? scheme.text : scheme.textMuted,
          marginBottom: 6,
          display: 'flex',
          gap: 6,
        }}>
          <span style={{
            color: item.icon === '✓' ? scheme.success : scheme.danger,
            fontWeight: FONT.weight.bold,
            flexShrink: 0,
          }}>
            {item.icon}
          </span>
          {item.text}
        </div>
      ))}
    </div>
  );
}

export function SlideComparison({ left, right, gap = SPACING.gap.lg, scheme = COLOR_SCHEMES.default }: SlideComparisonProps) {
  return (
    <div style={{ display: 'flex', gap }}>
      <Block data={left} scheme={scheme} />
      <Block data={right} scheme={scheme} />
    </div>
  );
}
