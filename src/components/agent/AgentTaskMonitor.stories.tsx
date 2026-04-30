import type { Meta, StoryObj } from '@storybook/react-vite';
import { AgentTaskMonitor } from './AgentTaskMonitor';

const meta: Meta<typeof AgentTaskMonitor> = {
  title: 'Agent/AgentTaskMonitor',
  component: AgentTaskMonitor,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Connected: Story = {
  args: {
    wsStatus: 'connected',
    tasks: [
      { task_id: 'task-001-abc', status: 'completed', agent_name: 'Brain Evaluator', description: 'Chain evaluate for site KWSS-01', started_at: '14:30:00', completed_at: '14:30:02' },
      { task_id: 'task-002-def', status: 'working', agent_name: 'Surrogate Predictor', description: '2h forecast for effluent quality' },
      { task_id: 'task-003-ghi', status: 'submitted', agent_name: 'Action Resolver', description: 'Determine remediation actions' },
    ],
  },
};

export const Disconnected: Story = {
  args: {
    wsStatus: 'disconnected',
    tasks: [],
    onReconnect: () => alert('Reconnecting...'),
  },
};

export const WithError: Story = {
  args: {
    wsStatus: 'error',
    tasks: [
      { task_id: 'task-fail-001', status: 'failed', agent_name: 'Optimizer', description: 'Coordinate descent failed: timeout' },
    ],
    onReconnect: () => alert('Reconnecting...'),
  },
};

export const Empty: Story = {
  args: {
    wsStatus: 'connected',
    tasks: [],
  },
};
