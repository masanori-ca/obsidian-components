import { SparklineChart } from '@/components/shared/SparklineChart';

interface InlineChartProps {
  label: string;
  data: number[];
  unit?: string;
  warningThreshold?: number;
  criticalThreshold?: number;
  color?: string;
}

/**
 * Inline trend chart for chat messages.
 * Wraps SparklineChart with label and current value display.
 */
export function InlineChart({ label, data, unit, warningThreshold, criticalThreshold, color = 'var(--obs-accent)' }: InlineChartProps) {
  if (data.length < 2) return null;

  const current = data[data.length - 1];
  const previous = data[data.length - 2];
  const trend = current > previous ? 'up' : current < previous ? 'down' : 'stable';
  const trendSymbol = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';

  return (
    <div
      className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg my-1"
      style={{ backgroundColor: 'var(--obs-bg-secondary)', border: '1px solid var(--obs-border-subtle)' }}
    >
      <div className="text-right shrink-0">
        <div className="text-[8px] obs-text-muted">{label}</div>
        <div className="text-[11px] font-mono font-bold obs-text-primary">
          {current.toFixed(current < 1 ? 3 : 1)}
          {unit && <span className="text-[8px] obs-text-muted ml-0.5">{unit}</span>}
          <span className="ml-1 text-[9px]" style={{
            color: trend === 'up' ? 'var(--obs-danger)' : trend === 'down' ? 'var(--obs-success)' : 'var(--obs-text-muted)',
          }}>
            {trendSymbol}
          </span>
        </div>
      </div>

      <SparklineChart
        data={data}
        width={100}
        height={28}
        color={color}
        warningThreshold={warningThreshold}
        criticalThreshold={criticalThreshold}
        showArea={false}
      />
    </div>
  );
}
