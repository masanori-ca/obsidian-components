import type { Meta, StoryObj } from '@storybook/react-vite';
import { EscalationTimeline } from './EscalationTimeline';

const meta: Meta<typeof EscalationTimeline> = {
  title: 'Alert/EscalationTimeline',
  component: EscalationTimeline,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Level1: Story = {
  args: {
    severity: {
      current_level: 1,
      previous_level: 1,
      consecutive_violations: 1,
      consecutive_compliant: 0,
      escalated: false,
    },
  },
};

export const Level2_BrainEvaluation: Story = {
  args: {
    severity: {
      current_level: 2,
      previous_level: 1,
      consecutive_violations: 4,
      consecutive_compliant: 0,
      escalated: true,
    },
  },
};

export const Level3_CausalAnalysis: Story = {
  args: {
    severity: {
      current_level: 3,
      previous_level: 2,
      consecutive_violations: 8,
      consecutive_compliant: 0,
      escalated: true,
    },
  },
};

export const Level4_Simulation: Story = {
  args: {
    severity: {
      current_level: 4,
      previous_level: 3,
      consecutive_violations: 12,
      consecutive_compliant: 0,
      escalated: true,
    },
  },
};

export const Recovering: Story = {
  args: {
    severity: {
      current_level: 2,
      previous_level: 3,
      consecutive_violations: 0,
      consecutive_compliant: 3,
      escalated: false,
    },
  },
};
