import type { Meta, StoryObj } from '@storybook/react-vite';
import { SensorGauge } from './SensorGauge';
import { SparklineChart } from './SparklineChart';
import { StatusBadge } from './StatusBadge';

const meta: Meta = {
  title: 'Design System/Tokens',
  parameters: { layout: 'padded' },
};
export default meta;

const ColorSwatch = ({ name, cssVar }: { name: string; cssVar: string }) => (
  <div className="flex items-center gap-2">
    <div className="w-10 h-10 rounded-lg border" style={{ backgroundColor: `var(${cssVar})`, borderColor: 'var(--obs-border-primary)' }} />
    <div>
      <div className="text-[10px] font-mono obs-text-primary">{name}</div>
      <div className="text-[9px] font-mono obs-text-muted">{cssVar}</div>
    </div>
  </div>
);

export const ColorPalette: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold obs-text-primary">Color Palette</h2>

      <div>
        <h3 className="text-xs font-semibold obs-text-secondary mb-2 uppercase">Background</h3>
        <div className="grid grid-cols-5 gap-3">
          <ColorSwatch name="Primary" cssVar="--obs-bg-primary" />
          <ColorSwatch name="Secondary" cssVar="--obs-bg-secondary" />
          <ColorSwatch name="Tertiary" cssVar="--obs-bg-tertiary" />
          <ColorSwatch name="Card" cssVar="--obs-bg-card" />
          <ColorSwatch name="Overlay" cssVar="--obs-bg-overlay" />
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold obs-text-secondary mb-2 uppercase">Text</h3>
        <div className="grid grid-cols-5 gap-3">
          <ColorSwatch name="Primary" cssVar="--obs-text-primary" />
          <ColorSwatch name="Secondary" cssVar="--obs-text-secondary" />
          <ColorSwatch name="Tertiary" cssVar="--obs-text-tertiary" />
          <ColorSwatch name="Muted" cssVar="--obs-text-muted" />
          <ColorSwatch name="Inverse" cssVar="--obs-text-inverse" />
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold obs-text-secondary mb-2 uppercase">Status</h3>
        <div className="grid grid-cols-4 gap-3">
          <ColorSwatch name="Success" cssVar="--obs-status-success" />
          <ColorSwatch name="Warning" cssVar="--obs-status-warning" />
          <ColorSwatch name="Danger" cssVar="--obs-status-danger" />
          <ColorSwatch name="Info" cssVar="--obs-status-info" />
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold obs-text-secondary mb-2 uppercase">Zone</h3>
        <div className="grid grid-cols-5 gap-3">
          <ColorSwatch name="Normal" cssVar="--obs-zone-n" />
          <ColorSwatch name="Watch" cssVar="--obs-zone-w" />
          <ColorSwatch name="Warning" cssVar="--obs-zone-ww" />
          <ColorSwatch name="High" cssVar="--obs-zone-h" />
          <ColorSwatch name="Critical" cssVar="--obs-zone-c" />
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold obs-text-secondary mb-2 uppercase">Accent</h3>
        <div className="grid grid-cols-3 gap-3">
          <ColorSwatch name="Default" cssVar="--obs-accent-default" />
          <ColorSwatch name="Hover" cssVar="--obs-accent-hover" />
          <ColorSwatch name="Background" cssVar="--obs-accent-bg" />
        </div>
      </div>
    </div>
  ),
};

export const Typography: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold obs-text-primary">Typography</h2>
      <div className="space-y-3" style={{ fontFamily: 'var(--obs-fontFamilies-sans)' }}>
        <div style={{ fontSize: 'var(--obs-fontSize-2xl)', fontWeight: 'var(--obs-fontWeight-bold)' }} className="obs-text-primary">H1 — Heading 1 (24px Bold)</div>
        <div style={{ fontSize: 'var(--obs-fontSize-xl)', fontWeight: 'var(--obs-fontWeight-semibold)' }} className="obs-text-primary">H2 — Heading 2 (20px Semibold)</div>
        <div style={{ fontSize: 'var(--obs-fontSize-lg)', fontWeight: 'var(--obs-fontWeight-semibold)' }} className="obs-text-primary">H3 — Heading 3 (16px Semibold)</div>
        <div style={{ fontSize: 'var(--obs-fontSize-base)', fontWeight: 'var(--obs-fontWeight-medium)' }} className="obs-text-primary">H4 — Heading 4 (14px Medium)</div>
        <div style={{ fontSize: 'var(--obs-fontSize-sm)', fontWeight: 'var(--obs-fontWeight-medium)' }} className="obs-text-secondary">H5 — Heading 5 (12px Medium)</div>
        <div style={{ fontSize: 'var(--obs-fontSize-xs)', fontWeight: 'var(--obs-fontWeight-medium)' }} className="obs-text-tertiary">H6 — Heading 6 (10px Medium)</div>
      </div>
      <div className="space-y-2 mt-4">
        <div className="text-sm obs-text-primary">Body — Regular text (14px Normal)</div>
        <div className="text-xs obs-text-secondary">Small — Secondary text (12px Normal)</div>
        <div className="text-[10px] obs-text-tertiary">Caption — Tertiary text (10px Normal)</div>
        <div className="text-xs font-mono obs-text-primary" style={{ fontFamily: 'var(--obs-fontFamilies-mono)' }}>Monospace — Code/values (12px Mono)</div>
      </div>
    </div>
  ),
};

export const SpacingAndRadius: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold obs-text-primary">Spacing</h2>
      <div className="flex items-end gap-3">
        {[2, 4, 8, 12, 16, 20, 24, 32].map((px) => (
          <div key={px} className="flex flex-col items-center gap-1">
            <div style={{ width: `${px}px`, height: `${px}px`, backgroundColor: 'var(--obs-accent-default)', borderRadius: '2px' }} />
            <span className="text-[9px] font-mono obs-text-muted">{px}</span>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold obs-text-primary mt-6">Border Radius</h2>
      <div className="flex items-center gap-3">
        {[4, 6, 8, 12, 16, 9999].map((r) => (
          <div key={r} className="flex flex-col items-center gap-1">
            <div style={{ width: '40px', height: '40px', borderRadius: `${r}px`, border: '2px solid var(--obs-accent-default)', backgroundColor: 'var(--obs-accent-bg)' }} />
            <span className="text-[9px] font-mono obs-text-muted">{r === 9999 ? 'full' : `${r}px`}</span>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold obs-text-primary mt-6">Shadows</h2>
      <div className="flex items-center gap-4">
        {['sm', 'md', 'lg'].map((s) => (
          <div key={s} className="flex flex-col items-center gap-1">
            <div className="w-16 h-16 rounded-lg" style={{ backgroundColor: 'var(--obs-bg-card)', boxShadow: `var(--obs-shadow-${s})`, border: '1px solid var(--obs-border-primary)' }} />
            <span className="text-[9px] font-mono obs-text-muted">{s}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const StatusBadges: StoryObj = {
  render: () => (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold obs-text-primary">Status Badges</h2>
      <div className="flex gap-2 flex-wrap">
        <StatusBadge status="online" />
        <StatusBadge status="offline" />
        <StatusBadge status="warning" />
        <StatusBadge status="critical" />
        <StatusBadge status="maintenance" />
        <StatusBadge status="connecting" />
        <StatusBadge status="success" />
        <StatusBadge status="error" />
      </div>
      <div className="flex gap-2">
        <StatusBadge status="online" size="md" />
        <StatusBadge status="warning" size="md" />
        <StatusBadge status="critical" size="md" />
      </div>
    </div>
  ),
};

export const GaugesAndCharts: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold obs-text-primary">Gauges</h2>
      <div className="flex gap-4">
        <SensorGauge value={7.2} min={0} max={14} label="pH" unit="" warningThreshold={9} criticalThreshold={10} />
        <SensorGauge value={2.1} min={0} max={5} label="DO" unit="mg/L" warningThreshold={1.5} criticalThreshold={1.0} inverse />
        <SensorGauge value={0.72} min={0} max={1.2} label="RO圧" unit="MPa" warningThreshold={0.85} criticalThreshold={0.95} />
      </div>

      <h2 className="text-lg font-semibold obs-text-primary mt-4">Sparklines</h2>
      <div className="flex gap-4">
        <SparklineChart data={[10, 12, 11, 14, 13, 15, 14, 16, 15, 17]} color="var(--obs-accent-default)" />
        <SparklineChart data={[20, 18, 22, 19, 25, 23, 28, 26, 30, 28]} color="var(--obs-status-warning)" warningThreshold={25} />
        <SparklineChart data={[5, 8, 6, 9, 7, 12, 10, 15, 13, 18]} color="var(--obs-status-danger)" criticalThreshold={15} />
      </div>
    </div>
  ),
};
