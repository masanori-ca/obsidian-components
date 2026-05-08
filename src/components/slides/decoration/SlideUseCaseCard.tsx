/**
 * SlideUseCaseCard — Use case with colored header bar.
 */
import React from 'react';
import { FONT, SPACING, COLOR_SCHEMES, type SlideColorScheme } from '../tokens';

interface SlideUseCaseCardProps {
  title: string;
  description: string;
  color?: string;
  scheme?: SlideColorScheme;
}

export function SlideUseCaseCard({
  title, description, color, scheme = COLOR_SCHEMES.default,
}: SlideUseCaseCardProps) {
  const c = color || scheme.accent[0];
  return (
    <div>
      <div style={{
        background: c,
        color: '#FFFFFF',
        fontSize: FONT.size.body,
        fontWeight: FONT.weight.bold,
        padding: `${SPACING.padding.sm}px ${SPACING.padding.lg}px`,
        borderRadius: `${SPACING.radius.md}px ${SPACING.radius.md}px 0 0`,
        textAlign: 'center',
      }}>
        {title}
      </div>
      <div style={{
        background: scheme.cardBg,
        border: `1px solid ${scheme.border}`,
        borderTop: 'none',
        borderRadius: `0 0 ${SPACING.radius.md}px ${SPACING.radius.md}px`,
        padding: `${SPACING.padding.md}px ${SPACING.padding.lg}px`,
        fontSize: FONT.size.label,
        color: scheme.textMuted,
        lineHeight: FONT.lineHeight.normal,
      }}>
        {description}
      </div>
    </div>
  );
}
