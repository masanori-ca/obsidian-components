import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActionResolvePanel } from './ActionResolvePanel';

const meta: Meta<typeof ActionResolvePanel> = {
  title: 'Alert/ActionResolvePanel',
  component: ActionResolvePanel,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const MultipleActions: Story = {
  args: {
    response: {
      message: 'CSTR6のDO低下に伴うNH4上昇に対する是正アクション',
      actions: [
        {
          action_type: 'increase_aeration',
          target_variable: 'cstr6_qair',
          parameters: { increment_pct: 35 },
          priority: 'critical',
          reason: 'DO低下による硝化能力低下を回復',
        },
        {
          action_type: 'adjust_mlss',
          target_variable: 'MLSS',
          parameters: { target: 3500 },
          priority: 'high',
          reason: '汚泥濃度を適正化して処理効率を改善',
        },
        {
          action_type: 'monitor_influent',
          target_variable: 'InfluentNH4',
          parameters: {},
          priority: 'medium',
          reason: '流入水質の変動を継続監視',
        },
      ],
      scenarios: [
        { name: 'ショック負荷対応シナリオ' },
      ],
    },
  },
};

export const SingleAction: Story = {
  args: {
    response: {
      message: '軽微な偏差に対する推奨アクション',
      actions: [
        {
          action_type: 'adjust_chlorine',
          target_variable: 'PostChlorine',
          parameters: { target_mg_l: 0.5 },
          priority: 'low',
          reason: '残留塩素が基準下限に近い',
        },
      ],
      scenarios: [],
    },
  },
};

export const NoActions: Story = {
  args: {
    response: {
      message: '現在アクション推奨はありません。全パラメータ正常範囲内です。',
      actions: [],
      scenarios: [],
    },
  },
};
