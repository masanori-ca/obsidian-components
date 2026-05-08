/**
 * SlideTimeline — Horizontal timeline with milestone dots.
 */
import React from 'react';
import { FONT, SPACING, SHADOW, LAYOUT, COLOR_SCHEMES, type SlideColorScheme } from '../tokens';

interface TimelinePoint {
  label: string;
  sublabel?: string;
  color?: string;
}

interface SlideTimelineProps {
  points: TimelinePoint[];
  scheme?: SlideColorScheme;
}

export function SlideTimeline({ points, scheme = COLOR_SCHEMES.default }: SlideTimelineProps) {
  const dotSize = LAYOUT.timelineDot;
  return (
    <div style={{ position: 'relative', padding: '0 20px' }}>
      {/* Line */}
      <div style={{
        position: 'absolute',
        top: dotSize / 2,
        left: 40,
        right: 40,
        height: 2,
        background: scheme.border,
      }} />
      {/* Points */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        position: 'relative',
      }}>
        {points.map((pt, i) => {
          const c = pt.color || scheme.accent[i % scheme.accent.length];
          return (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                width: dotSize,
                height: dotSize,
                borderRadius: '50%',
                background: c,
                margin: '0 auto 6px',
                boxShadow: SHADOW.glow(c),
              }} />
              <div style={{
                fontSize: FONT.size.caption,
                fontWeight: FONT.weight.semibold,
                color: scheme.text,
              }}>
                {pt.label}
              </div>
              {pt.sublabel && (
                <div style={{
                  fontSize: FONT.size.badge,
                  color: scheme.textMuted,
                }}>
                  {pt.sublabel}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
