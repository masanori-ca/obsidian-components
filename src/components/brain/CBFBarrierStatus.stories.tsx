import type { Meta, StoryObj } from '@storybook/react-vite';
import { CBFBarrierStatus } from './CBFBarrierStatus';

const meta: Meta<typeof CBFBarrierStatus> = {
  title: 'Brain/CBFBarrierStatus',
  component: CBFBarrierStatus,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const AllPassed: Story = {
  args: {
    response: {
      passed: true,
      violations: [],
    },
  },
};

export const L2Violation: Story = {
  args: {
    response: {
      passed: false,
      violations: [
        {
          variable: 'EffluentTN',
          layer: 'L2',
          operator: '<=',
          threshold: 120,
          actual: 136,
          description: '日本排水基準 TN ≤ 120 mg/L を超過',
        },
      ],
    },
  },
};

export const MultipleViolations: Story = {
  args: {
    response: {
      passed: false,
      violations: [
        {
          variable: 'InfluentFlow',
          layer: 'L1',
          operator: '<=',
          threshold: 10000,
          actual: 12500,
          description: '設計容量を超過 (125%)',
        },
        {
          variable: 'EffluentBOD',
          layer: 'L2',
          operator: '<=',
          threshold: 20,
          actual: 22.5,
          description: 'BOD排水基準超過',
        },
        {
          variable: 'EffluentTN',
          layer: 'L2',
          operator: '<=',
          threshold: 120,
          actual: 136,
          description: 'TN排水基準超過',
        },
        {
          variable: 'trust_anxiety_pattern',
          layer: 'L3',
          operator: 'not_in',
          threshold: 0,
          actual: 1,
          description: '危険ゾーンパターン検知',
        },
      ],
    },
  },
};

export const CompactPassed: Story = {
  args: {
    response: { passed: true, violations: [] },
    compact: true,
  },
};

export const CompactBlocked: Story = {
  args: {
    response: {
      passed: false,
      violations: [
        { variable: 'EffluentTN', layer: 'L2', operator: '<=', threshold: 120, actual: 136 },
      ],
    },
    compact: true,
  },
};
