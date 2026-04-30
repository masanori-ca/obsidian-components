import type { Meta, StoryObj } from '@storybook/react-vite';
import { AutopilotCyclePanel } from './AutopilotCyclePanel';

const meta: Meta<typeof AutopilotCyclePanel> = {
  title: 'Agent/AutopilotCyclePanel',
  component: AutopilotCyclePanel,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  args: {
    cycleResult: null,
    currentPhase: 'idle',
    isRunning: false,
  },
};

export const Monitoring: Story = {
  args: {
    currentPhase: 'monitor',
    isRunning: true,
    cycleResult: null,
  },
};

export const CompletedNormal: Story = {
  args: {
    currentPhase: 'complete',
    isRunning: true,
    cycleResult: {
      cycle_id: 'cycle-abc123',
      timestamp: '2026-04-30T14:30:00Z',
      elapsed_ms: 1250,
      overall_zone: 'N',
      deviations: [
        { variable: 'EffluentNH4', baseline: 0.5, actual: 0.52, deviation_pct: 4.0, zone: 'N' as const },
        { variable: 'CSTR6_DO', baseline: 8.0, actual: 7.8, deviation_pct: -2.5, zone: 'N' as const },
      ],
      critical_count: 0,
      warning_count: 0,
      diagnoses: {},
      predictions: {},
      early_warnings: [],
      top_scenario: undefined,
      actions: [],
    },
  },
};

export const CompletedWithActions: Story = {
  args: {
    currentPhase: 'complete',
    isRunning: true,
    cycleResult: {
      cycle_id: 'cycle-def456',
      timestamp: '2026-04-30T14:35:00Z',
      elapsed_ms: 3420,
      overall_zone: 'WW',
      deviations: [
        { variable: 'EffluentNH4', baseline: 0.5, actual: 0.85, deviation_pct: 70.0, zone: 'C' as const },
        { variable: 'CSTR6_DO', baseline: 8.0, actual: 5.2, deviation_pct: -35.0, zone: 'H' as const },
        { variable: 'InfluentFlow', baseline: 6664, actual: 7100, deviation_pct: 6.5, zone: 'W' as const },
      ],
      critical_count: 1,
      warning_count: 1,
      diagnoses: { root_cause: 'InfluentNH4 shock load' },
      predictions: { trend: 'increasing' },
      early_warnings: [{ variable: 'EffluentTN', message: '2h後に基準超過予測' }],
      top_scenario: { name: 'aeration_boost', improvement_pct: 45 },
      scenarios_evaluated: 12,
      actions: [
        {
          action_type: 'increase_aeration',
          target_variable: 'cstr6_qair',
          parameters: { increment_pct: 35 },
          priority: 'critical' as const,
          reason: 'DO回復のため曝気量増加',
        },
        {
          action_type: 'adjust_recirculation',
          target_variable: 'recirculation_rate',
          parameters: { target: 200 },
          priority: 'high' as const,
          reason: '内部循環量を増加して脱窒促進',
        },
      ],
    },
  },
};
