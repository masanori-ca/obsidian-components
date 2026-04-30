import type { Meta, StoryObj } from '@storybook/react-vite';
import { PCKChatMessage } from './PCKChatMessage';

const meta: Meta<typeof PCKChatMessage> = {
  title: 'Chat/PCKChatMessage',
  component: PCKChatMessage,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const UserMessage: Story = {
  args: {
    role: 'user',
    content: '曝気量を50%削減したらどうなりますか？',
    timestamp: '14:32',
  },
};

export const AssistantMessage: Story = {
  args: {
    role: 'assistant',
    content: 'PCKエンジンの計算結果によると、CSTR6のDOが8.25→4.13 mg/Lに低下し、放流水NH4が0.009→0.011 mg/Lに上昇します。CBF安全バリアはPASSです。',
    firedNodes: ['cstr6_DO', 'EffluentNH4', 'cstr6_qair'],
    proofTrace: {
      sources: { cstr6_DO: 'PCK', EffluentNH4: 'PCK' },
      judgments: [{ status: 'OK', reason: 'All constraints satisfied' }],
      constraints: [],
      cbf: [{ variable: 'EffluentNH4', status: 'passed', description: 'Within safe range' }],
      dag: ['cstr6_qair', 'cstr6_DO', 'EffluentNH4'],
    },
    onShowProofTrace: () => alert('Proof Trace drawer opened'),
    timestamp: '14:32',
  },
};

export const StreamingMessage: Story = {
  args: {
    role: 'assistant',
    content: 'PCKエンジンが計算しています...',
    isStreaming: true,
    firedNodes: ['cstr6_DO'],
  },
};

export const Conversation: Story = {
  render: () => (
    <div className="w-[400px] space-y-3">
      <PCKChatMessage
        role="user"
        content="CSTR6の現在の状態を教えてください"
        timestamp="14:30"
      />
      <PCKChatMessage
        role="assistant"
        content="CSTR6の現在の状態です。DO: 8.25 mg/L（正常）、NH4: 7.07 mg/L、MLSS: 3200 mg/L。全パラメータが正常範囲内です。"
        firedNodes={['cstr6_DO', 'cstr6_NH4', 'MLSS']}
        timestamp="14:30"
      />
      <PCKChatMessage
        role="user"
        content="曝気量を30%削減したら？"
        timestamp="14:31"
      />
      <PCKChatMessage
        role="assistant"
        content="What-If分析の結果、DO: 8.25→5.78 mg/L (-30%)、NH4: 7.07→8.48 mg/L (+20%)。CBF: PASS。排水基準内で省エネ可能です。"
        firedNodes={['cstr6_qair', 'cstr6_DO', 'cstr6_NH4']}
        timestamp="14:31"
      />
    </div>
  ),
};
