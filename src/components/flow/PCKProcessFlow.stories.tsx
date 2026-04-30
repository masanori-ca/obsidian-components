import type { Meta, StoryObj } from '@storybook/react-vite';
import { PCKProcessFlow } from './PCKProcessFlow';

const meta: Meta<typeof PCKProcessFlow> = {
  title: 'Flow/PCKProcessFlow',
  component: PCKProcessFlow,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const kwssUnits = [
  { id: 'influent', label: '流入', type: 'influent' as const },
  { id: 'cstr2', label: 'CSTR2', type: 'reactor' as const },
  { id: 'cstr5', label: 'CSTR5', type: 'reactor' as const },
  { id: 'cstr6', label: 'CSTR6', type: 'reactor' as const },
  { id: 'cstr7', label: 'CSTR7', type: 'reactor' as const },
  { id: 'mbbr1', label: 'MBBR1', type: 'reactor' as const },
  { id: 'settler', label: '沈殿池', type: 'settler' as const },
  { id: 'effluent', label: '放流', type: 'effluent' as const },
];

const kwssConnections = [
  { from: 'influent', to: 'cstr2' },
  { from: 'cstr2', to: 'cstr5' },
  { from: 'cstr5', to: 'cstr6' },
  { from: 'cstr6', to: 'cstr7' },
  { from: 'cstr7', to: 'mbbr1' },
  { from: 'mbbr1', to: 'settler' },
  { from: 'settler', to: 'effluent' },
];

export const AllNormal: Story = {
  args: {
    units: kwssUnits,
    connections: kwssConnections,
    deviations: [
      { variable: 'influent_flow', baseline: 6664, actual: 6800, deviation_pct: 2.0, zone: 'N' },
      { variable: 'cstr6_DO', baseline: 8.0, actual: 7.8, deviation_pct: -2.5, zone: 'N' },
      { variable: 'effluent_NH4', baseline: 0.5, actual: 0.52, deviation_pct: 4.0, zone: 'N' },
    ],
  },
};

export const WithAnomalies: Story = {
  args: {
    units: kwssUnits,
    connections: kwssConnections,
    deviations: [
      { variable: 'influent_NH4', baseline: 80, actual: 120, deviation_pct: 50.0, zone: 'C' },
      { variable: 'cstr6_DO', baseline: 8.0, actual: 5.2, deviation_pct: -35.0, zone: 'H' },
      { variable: 'cstr7_NH4', baseline: 3.5, actual: 4.2, deviation_pct: 20.0, zone: 'WW' },
      { variable: 'effluent_NH4', baseline: 0.5, actual: 0.85, deviation_pct: 70.0, zone: 'C' },
    ],
  },
};

export const WithCausalTrace: Story = {
  args: {
    units: kwssUnits,
    connections: kwssConnections,
    deviations: [
      { variable: 'influent_NH4', baseline: 80, actual: 120, deviation_pct: 50.0, zone: 'C' },
      { variable: 'cstr6_DO', baseline: 8.0, actual: 5.2, deviation_pct: -35.0, zone: 'H' },
      { variable: 'effluent_NH4', baseline: 0.5, actual: 0.85, deviation_pct: 70.0, zone: 'C' },
    ],
    highlightPath: ['influent', 'cstr5', 'cstr6', 'cstr7', 'settler', 'effluent'],
    selectedUnit: 'cstr6',
  },
};
