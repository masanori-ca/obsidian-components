import type { Meta, StoryObj } from '@storybook/react-vite';
import { AgentDecisionFlow } from './AgentDecisionFlow';

const meta: Meta<typeof AgentDecisionFlow> = {
  title: 'Agent/AgentDecisionFlow',
  component: AgentDecisionFlow,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Inactive: Story = {
  args: { cycleResult: null },
};

export const AllNormal: Story = {
  args: {
    cycleResult: {
      cycle_id: 'c1',
      timestamp: '2026-04-30T14:30:00Z',
      elapsed_ms: 800,
      overall_zone: 'N',
      deviations: [],
      critical_count: 0,
      warning_count: 0,
    },
  },
};

export const ActionRequired: Story = {
  args: {
    cycleResult: {
      cycle_id: 'c2',
      timestamp: '2026-04-30T14:35:00Z',
      elapsed_ms: 2500,
      overall_zone: 'H',
      deviations: [
        { variable: 'DO', baseline: 8, actual: 4, deviation_pct: -50, zone: 'C' as const },
      ],
      critical_count: 1,
      warning_count: 0,
      diagnoses: { root: 'aeration_failure' },
      top_scenario: { name: 'boost' },
      actions: [
        { action_type: 'increase_aeration', target_variable: 'qair', parameters: {}, priority: 'critical' as const, reason: 'DO low' },
      ],
    },
  },
};

export const CompactMode: Story = {
  args: {
    cycleResult: {
      cycle_id: 'c3',
      timestamp: '2026-04-30T14:40:00Z',
      elapsed_ms: 1200,
      overall_zone: 'W',
      deviations: [],
      critical_count: 0,
      warning_count: 1,
    },
    compact: true,
  },
};
