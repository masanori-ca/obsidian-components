/**
 * SlideFlowPipeline — Horizontal process pipeline with numbered nodes.
 */
import React from 'react';
import { FONT, SPACING, SHADOW, COLOR_SCHEMES, type SlideColorScheme } from '../tokens';

interface FlowStep {
  number: string;
  title: string;
  description?: string;
  color?: string;
  port?: string;
}

interface SlideFlowPipelineProps {
  steps: FlowStep[];
  curved?: boolean;
  scheme?: SlideColorScheme;
}

export function SlideFlowPipeline({ steps, curved, scheme = COLOR_SCHEMES.default }: SlideFlowPipelineProps) {
  return (
    <div style={{ position: 'relative' }}>
      {/* Connector line */}
      {curved ? (
        <svg width="100%" height="140" style={{ position: 'absolute', top: 0, left: 0 }}>
          <path
            d={`M 30 70 ${steps.map((_, i) => {
              const x = 30 + (i / (steps.length - 1)) * (100 * steps.length - 60);
              const y = 70 + Math.sin((i / (steps.length - 1)) * Math.PI * 2) * 25;
              return `${i === 0 ? 'C' : ','} ${x} ${y}`;
            }).join(' ')}`}
            stroke={scheme.border}
            strokeWidth="2"
            fill="none"
            strokeDasharray="6 4"
          />
        </svg>
      ) : (
        <div style={{
          position: 'absolute', top: 24, left: 30, right: 30,
          height: 2, background: scheme.border,
        }} />
      )}

      {/* Nodes */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        position: 'relative', zIndex: 1,
      }}>
        {steps.map((step, i) => {
          const c = step.color || scheme.accent[i % scheme.accent.length];
          return (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              width: `${100 / steps.length}%`,
            }}>
              {/* Circle */}
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: `linear-gradient(135deg, ${c}, ${c}cc)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: SHADOW.glow(c),
                color: '#FFFFFF',
                fontSize: FONT.size.body,
                fontWeight: FONT.weight.bold,
              }}>
                {step.number}
              </div>
              {/* Title */}
              <div style={{
                fontSize: FONT.size.body,
                fontWeight: FONT.weight.bold,
                color: scheme.text,
                marginTop: 8,
                textAlign: 'center',
              }}>
                {step.title}
              </div>
              {/* Description */}
              {step.description && (
                <div style={{
                  fontSize: FONT.size.label,
                  color: scheme.textMuted,
                  marginTop: 2,
                  textAlign: 'center',
                  lineHeight: FONT.lineHeight.normal,
                }}>
                  {step.description}
                </div>
              )}
              {/* Port badge */}
              {step.port && (
                <div style={{
                  fontSize: FONT.size.micro,
                  fontFamily: FONT.family.data,
                  color: scheme.textLight,
                  background: scheme.divider,
                  borderRadius: SPACING.radius.pill,
                  padding: '1px 6px',
                  marginTop: 3,
                }}>
                  {step.port}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
