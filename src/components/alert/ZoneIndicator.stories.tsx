import type { Meta, StoryObj } from '@storybook/react-vite';
import { ZoneIndicator } from './ZoneIndicator';

const meta: Meta<typeof ZoneIndicator> = {
  title: 'Alert/ZoneIndicator',
  component: ZoneIndicator,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    zone: {
      control: 'select',
      options: ['N', 'W', 'WW', 'H', 'C'],
      description: 'PCK Alert 5段階ゾーン',
    },
    deviationPct: { control: { type: 'range', min: -50, max: 100, step: 0.5 } },
    compact: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: { zone: 'N', deviationPct: 2.3, variable: 'EffluentNH4' },
};

export const Watch: Story = {
  args: { zone: 'W', deviationPct: 7.8, variable: 'CSTR6_DO' },
};

export const Warning: Story = {
  args: { zone: 'WW', deviationPct: 15.2, variable: 'InfluentFlow' },
};

export const High: Story = {
  args: { zone: 'H', deviationPct: 35.0, variable: 'EffluentBOD' },
};

export const Critical: Story = {
  args: { zone: 'C', deviationPct: 67.5, variable: 'EffluentTN' },
};

export const CompactNormal: Story = {
  args: { zone: 'N', compact: true },
};

export const CompactCritical: Story = {
  args: { zone: 'C', compact: true },
};

export const AllZones: Story = {
  render: () => (
    <div className="space-y-3 w-[350px]">
      <ZoneIndicator zone="N" deviationPct={2.3} variable="EffluentNH4" />
      <ZoneIndicator zone="W" deviationPct={7.8} variable="CSTR6_DO" />
      <ZoneIndicator zone="WW" deviationPct={15.2} variable="InfluentFlow" />
      <ZoneIndicator zone="H" deviationPct={35.0} variable="EffluentBOD" />
      <ZoneIndicator zone="C" deviationPct={67.5} variable="EffluentTN" />
    </div>
  ),
};

export const CompactBadges: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <ZoneIndicator zone="N" compact />
      <ZoneIndicator zone="W" compact />
      <ZoneIndicator zone="WW" compact />
      <ZoneIndicator zone="H" compact />
      <ZoneIndicator zone="C" compact />
    </div>
  ),
};
