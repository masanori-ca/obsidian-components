/**
 * SlideKpiCard — Large number KPI display.
 */
import React from 'react';
import { FONT, SPACING, SHADOW, COLOR_SCHEMES, type SlideColorScheme } from '../tokens';

interface SlideKpiCardProps {
  value: string;
  label: string;
  description?: string;
  color?: string;
  scheme?: SlideColorScheme;
}

export function SlideKpiCard({
  value, label, description, color, scheme = COLOR_SCHEMES.default,
}: SlideKpiCardProps) {
  const c = color || scheme.accent[0];
  return (
    <div style={{
      background: scheme.cardBg,
      borderRadius: SPACING.radius.lg,
      padding: `${SPACING.padding.lg}px ${SPACING.padding.xl}px`,
      boxShadow: SHADOW.medium,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 3, background: c,
      }} />
      <div style={{
        fontSize: FONT.size.label,
        fontWeight: FONT.weight.semibold,
        color: scheme.textMuted,
        letterSpacing: FONT.letterSpacing.label,
        marginBottom: 4,
      }}>
        {label.toUpperCase()}
      </div>
      <div style={{
        fontSize: FONT.size.kpiLarge,
        fontWeight: FONT.weight.bold,
        color: c,
        lineHeight: FONT.lineHeight.tight,
      }}>
        {value}
      </div>
      {description && (
        <div style={{
          fontSize: FONT.size.badge,
          color: scheme.textMuted,
          marginTop: 4,
        }}>
          {description}
        </div>
      )}
    </div>
  );
}
