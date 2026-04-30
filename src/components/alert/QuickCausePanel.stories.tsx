import type { Meta, StoryObj } from '@storybook/react-vite';
import { QuickCausePanel } from './QuickCausePanel';

const meta: Meta<typeof QuickCausePanel> = {
  title: 'Alert/QuickCausePanel',
  component: QuickCausePanel,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const MultipleCauses: Story = {
  args: {
    causes: [
      { cause_variable: 'cstr6_qair', deviation_pct: -22.5, if_reset_to_baseline: 45.2 },
      { cause_variable: 'InfluentNH4', deviation_pct: 40.0, if_reset_to_baseline: 28.7 },
      { cause_variable: 'cstr7_DO', deviation_pct: -18.3, if_reset_to_baseline: 12.1 },
      { cause_variable: 'MLSS', deviation_pct: 8.5, if_reset_to_baseline: 5.3 },
    ],
  },
};

export const SingleCause: Story = {
  args: {
    causes: [
      { cause_variable: 'cstr6_qair', deviation_pct: -50.0, if_reset_to_baseline: 72.0 },
    ],
  },
};

export const Loading: Story = {
  args: {
    causes: [],
    isLoading: true,
  },
};

export const NoCauses: Story = {
  args: {
    causes: [],
  },
};
