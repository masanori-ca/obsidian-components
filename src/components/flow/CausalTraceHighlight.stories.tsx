import type { Meta, StoryObj } from '@storybook/react-vite';
import { CausalTraceHighlight } from './CausalTraceHighlight';

const meta: Meta<typeof CausalTraceHighlight> = {
  title: 'Flow/CausalTraceHighlight',
  component: CausalTraceHighlight,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const WaterTreatmentTrace: Story = {
  args: {
    tracePath: ['InfluentNH4', 'cstr5_NH4', 'cstr6_DO', 'cstr6_NH4', 'cstr7_NH4', 'EffluentNH4'],
    rootCause: 'InfluentNH4',
    affectedVariable: 'EffluentNH4',
  },
};

export const ShortTrace: Story = {
  args: {
    tracePath: ['joint_efficiency', 'shell_thickness_required', 'mawp'],
    rootCause: 'joint_efficiency',
    affectedVariable: 'mawp',
  },
};

export const LongTrace: Story = {
  args: {
    tracePath: [
      'InfluentFlow', 'InfluentNH4', 'InfluentCOD',
      'cstr2_MLSS', 'cstr5_DO', 'cstr6_DO', 'cstr6_NH4',
      'cstr7_NH4', 'mbbr1_BOD', 'settler_SS', 'EffluentTN',
    ],
    rootCause: 'InfluentFlow',
    affectedVariable: 'EffluentTN',
  },
};
