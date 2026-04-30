import type { Meta, StoryObj } from '@storybook/react-vite';
import { AgentApprovalDialog } from './AgentApprovalDialog';

const meta: Meta<typeof AgentApprovalDialog> = {
  title: 'Agent/AgentApprovalDialog',
  component: AgentApprovalDialog,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const CriticalAction: Story = {
  args: {
    action: {
      action_type: 'increase_aeration',
      target_variable: 'cstr6_qair',
      parameters: { increment_pct: 35 },
      priority: 'critical',
      reason: 'DO低下による硝化能力低下を回復するため、CSTR6の曝気量を35%増加',
    },
    cbfPassed: true,
    proofSummary: 'Monod式、質量収支式、TK#1247 (冬季DO設定ルール) に基づく推奨',
    onApprove: () => alert('承認されました'),
    onReject: (reason) => alert(`却下: ${reason}`),
    onClose: () => {},
  },
};

export const CBFBlocked: Story = {
  args: {
    action: {
      action_type: 'reduce_aeration',
      target_variable: 'cstr6_qair',
      parameters: { reduction_pct: 80 },
      priority: 'high',
      reason: '省エネのため曝気量を80%削減',
    },
    cbfPassed: false,
    proofSummary: 'CBF L2 規制バリア: 放流水NH4がJES排水基準を超過する予測',
    onApprove: () => {},
    onReject: (reason) => alert(`却下: ${reason}`),
    onClose: () => {},
  },
};
