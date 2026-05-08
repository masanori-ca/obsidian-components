/**
 * SlideSection — Section with title and content.
 */
import React from 'react';
import { FONT, COLOR_SCHEMES, type SlideColorScheme } from '../tokens';

interface SlideSectionProps {
  title: string;
  scheme?: SlideColorScheme;
  children: React.ReactNode;
}

export function SlideSection({ title, scheme = COLOR_SCHEMES.default, children }: SlideSectionProps) {
  return (
    <div>
      <div style={{
        fontSize: FONT.size.componentTitle,
        fontWeight: FONT.weight.bold,
        color: scheme.text,
        marginBottom: 10,
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}
