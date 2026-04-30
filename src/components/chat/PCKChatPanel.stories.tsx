import type { Meta, StoryObj } from '@storybook/react-vite';
import { PCKChatPanel } from './PCKChatPanel';
import { PCKTenantProvider } from '@/components/providers/PCKTenantProvider';

const meta: Meta<typeof PCKChatPanel> = {
  title: 'Chat/PCKChatPanel',
  component: PCKChatPanel,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <PCKTenantProvider baseUrl="http://localhost:8080" tenant="kurita">
        <div className="w-[480px]">
          <Story />
        </div>
      </PCKTenantProvider>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    equipmentId: 'KWSS-01',
  },
};

export const WithSession: Story = {
  args: {
    equipmentId: 'C-1602',
    sessionId: 'session-demo-001',
    defaultPersonaId: 'persona-twin',
  },
};
