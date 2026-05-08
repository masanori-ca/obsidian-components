/**
 * SlideTitle — Title area at the top of a slide.
 */
import React from 'react';
import { FONT, ACCENT_BAR, COLOR_SCHEMES, type SlideColorScheme } from '../tokens';

interface SlideTitleProps {
  title: string;
  subtitle?: string;
  scheme?: SlideColorScheme;
}

export function SlideTitle({ title, subtitle, scheme = COLOR_SCHEMES.default }: SlideTitleProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        fontSize: FONT.size.slideTitle,
        fontWeight: FONT.weight.bold,
        color: scheme.text,
        lineHeight: FONT.lineHeight.tight,
      }}>
        {title}
      </div>
      <div style={{
        width: ACCENT_BAR.sectionWidth,
        height: ACCENT_BAR.sectionHeight,
        background: scheme.accent[0],
        marginTop: 6,
      }} />
      {subtitle && (
        <div style={{
          fontSize: FONT.size.caption,
          color: scheme.accent[0],
          marginTop: 6,
        }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}
