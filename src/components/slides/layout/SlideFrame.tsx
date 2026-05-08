/**
 * SlideFrame — Root container for every slide.
 * Provides 1920x1080 canvas, accent bar, footer, and content padding.
 */
import React from 'react';
import { SLIDE, FONT, ACCENT_BAR, COLOR_SCHEMES, type SlideColorScheme } from '../tokens';

interface SlideFrameProps {
  scheme?: SlideColorScheme;
  brand?: keyof typeof COLOR_SCHEMES;
  accentGradient?: boolean;
  footer?: string;
  children: React.ReactNode;
}

export function SlideFrame({
  scheme,
  brand = 'default',
  accentGradient = true,
  footer,
  children,
}: SlideFrameProps) {
  const s = scheme || COLOR_SCHEMES[brand] || COLOR_SCHEMES.default;
  const accentBg = accentGradient
    ? `linear-gradient(90deg, ${s.accent[0]}, ${s.accent[1]}, ${s.accent[0]})`
    : s.accent[0];

  return (
    <div style={{
      width: SLIDE.width,
      height: SLIDE.height,
      background: s.bg,
      fontFamily: FONT.family.primary,
      color: s.text,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: ACCENT_BAR.height,
        background: accentBg,
      }} />

      {/* Content area */}
      <div style={{
        position: 'absolute',
        top: SLIDE.padding.top,
        left: SLIDE.padding.left,
        width: SLIDE.contentWidth,
        height: SLIDE.contentHeight,
      }}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: `6px ${SLIDE.padding.left}px`,
          fontSize: FONT.size.footer,
          color: s.textLight,
          borderTop: `1px solid ${s.divider}`,
        }}>
          {footer}
        </div>
      )}
    </div>
  );
}
