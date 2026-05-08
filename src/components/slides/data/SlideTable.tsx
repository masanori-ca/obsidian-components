/**
 * SlideTable — Styled data table.
 */
import React from 'react';
import { FONT, SPACING, COLOR_SCHEMES, type SlideColorScheme } from '../tokens';

interface SlideTableProps {
  headers: string[];
  rows: string[][];
  striped?: boolean;
  scheme?: SlideColorScheme;
}

export function SlideTable({ headers, rows, striped = true, scheme = COLOR_SCHEMES.default }: SlideTableProps) {
  return (
    <table style={{
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: FONT.size.caption,
      fontFamily: FONT.family.primary,
    }}>
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} style={{
              textAlign: 'left',
              padding: `${SPACING.padding.sm}px ${SPACING.padding.md}px`,
              fontSize: FONT.size.label,
              fontWeight: FONT.weight.semibold,
              color: scheme.textMuted,
              letterSpacing: FONT.letterSpacing.label,
              borderBottom: `2px solid ${scheme.accent[0]}`,
            }}>
              {h.toUpperCase()}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} style={{
            background: striped && ri % 2 === 1 ? scheme.divider : 'transparent',
          }}>
            {row.map((cell, ci) => (
              <td key={ci} style={{
                padding: `${SPACING.padding.sm}px ${SPACING.padding.md}px`,
                color: scheme.text,
                borderBottom: `1px solid ${scheme.divider}`,
              }}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
