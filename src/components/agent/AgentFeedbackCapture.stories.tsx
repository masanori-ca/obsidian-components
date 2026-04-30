import type { Meta, StoryObj } from '@storybook/react-vite';
import { AgentFeedbackCapture } from './AgentFeedbackCapture';

const meta: Meta<typeof AgentFeedbackCapture> = {
  title: 'Agent/AgentFeedbackCapture',
  component: AgentFeedbackCapture,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    action: {
      action_type: 'increase_aeration',
      target_variable: 'cstr6_qair',
      parameters: { increment_pct: 35 },
      priority: 'critical',
      reason: 'DO回復',
    },
    onFeedback: (feedback) => {
      console.log('Feedback:', feedback);
      alert(`Feedback: beneficial=${feedback.was_beneficial}, learn=${feedback.should_ai_learn}`);
    },
  },
};
