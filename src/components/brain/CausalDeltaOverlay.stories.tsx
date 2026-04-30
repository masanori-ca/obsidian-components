import type { Meta, StoryObj } from '@storybook/react-vite';
import { CausalDeltaOverlay } from './CausalDeltaOverlay';

const meta: Meta<typeof CausalDeltaOverlay> = {
  title: 'Brain/CausalDeltaOverlay',
  component: CausalDeltaOverlay,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const waterUnits = [
  { id: 'influent', label: '流入', x: 20, y: 60 },
  { id: 'cstr2', label: 'CSTR2', x: 130, y: 60 },
  { id: 'cstr5', label: 'CSTR5', x: 240, y: 60 },
  { id: 'cstr6', label: 'CSTR6', x: 350, y: 60 },
  { id: 'cstr7', label: 'CSTR7', x: 460, y: 60 },
  { id: 'settler', label: '沈殿池', x: 570, y: 60 },
  { id: 'effluent', label: '放流', x: 680, y: 60 },
];

export const AerationReduction: Story = {
  args: {
    units: waterUnits,
    overrides: { cstr6_qair: 648 },
    deltas: {
      cstr6_DO: { baseline: 8.25, what_if: 4.13, delta: -4.12, delta_pct: -50.0 },
      cstr6_NH4: { baseline: 7.07, what_if: 8.24, delta: 1.17, delta_pct: 16.6 },
      cstr7_NH4: { baseline: 3.5, what_if: 4.08, delta: 0.58, delta_pct: 16.6 },
      settler_SS: { baseline: 12, what_if: 13.2, delta: 1.2, delta_pct: 10.0 },
      effluent_NH4: { baseline: 0.009, what_if: 0.011, delta: 0.002, delta_pct: 16.6 },
    },
    width: 800,
    height: 160,
  },
};

export const NoImpact: Story = {
  args: {
    units: waterUnits,
    overrides: {},
    deltas: {},
    width: 800,
    height: 160,
  },
};
