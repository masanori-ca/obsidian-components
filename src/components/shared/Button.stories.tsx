import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
import { NumberBadge } from './NumberBadge';
import { DonutGauge } from './DonutGauge';
import { Input } from './Input';
import { ZoneDistributionBar } from './ZoneDistributionBar';

const meta: Meta<typeof Button> = {
  title: 'Shared/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { children: 'Primary', variant: 'primary' } };
export const Secondary: Story = { args: { children: 'Secondary', variant: 'secondary' } };
export const Outline: Story = { args: { children: 'Outline', variant: 'outline' } };
export const Ghost: Story = { args: { children: 'Ghost', variant: 'ghost' } };
export const Danger: Story = { args: { children: 'Danger', variant: 'danger' } };
export const Loading: Story = { args: { children: 'Loading...', loading: true } };

export const AllVariants: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <Button variant="primary" size="sm">Small</Button>
        <Button variant="primary" size="md">Medium</Button>
        <Button variant="primary" size="lg">Large</Button>
      </div>
      <div className="flex gap-2 items-center">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </div>
      <div className="flex gap-2 items-center">
        <Button variant="primary" disabled>Disabled</Button>
        <Button variant="primary" loading>Loading</Button>
      </div>
    </div>
  ),
};

export const InputField: StoryObj = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <Input label="Username" placeholder="Enter username" />
      <Input label="Email" description="We'll never share your email" placeholder="name@example.com" />
      <Input label="Password" type="password" error="Password must be at least 8 characters" />
    </div>
  ),
};

export const NumberBadges: StoryObj = {
  render: () => (
    <div className="space-y-3">
      <div className="flex gap-2">
        <NumberBadge value={42} variant="default" />
        <NumberBadge value={42} variant="success" />
        <NumberBadge value={42} variant="warning" />
        <NumberBadge value={42} variant="danger" />
        <NumberBadge value={42} variant="info" />
        <NumberBadge value={42} variant="accent" />
        <NumberBadge value={42} variant="muted" />
      </div>
      <div className="flex gap-2">
        <NumberBadge value={42} variant="default" size="sm" />
        <NumberBadge value={42} variant="success" size="sm" />
        <NumberBadge value={42} variant="warning" size="sm" />
        <NumberBadge value={42} variant="danger" size="sm" />
        <NumberBadge value={42} variant="info" size="sm" />
        <NumberBadge value={42} variant="accent" size="sm" />
        <NumberBadge value={42} variant="muted" size="sm" />
      </div>
      <div className="flex gap-2">
        <NumberBadge value={42} variant="default" size="lg" />
        <NumberBadge value={42} variant="success" size="lg" />
        <NumberBadge value={42} variant="warning" size="lg" />
        <NumberBadge value={42} variant="danger" size="lg" />
      </div>
    </div>
  ),
};

export const DonutGauges: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <div className="flex gap-4">
        <DonutGauge value={75} label="稼働率" />
        <DonutGauge value={92} label="処理効率" />
        <DonutGauge value={45} label="エネルギー" warningThreshold={60} criticalThreshold={80} />
        <DonutGauge value={88} label="水質" criticalThreshold={95} />
      </div>
      <div className="flex gap-4">
        <DonutGauge value={75} label="Small" size={60} thickness={4} />
        <DonutGauge value={75} label="Medium" size={80} />
        <DonutGauge value={75} label="Large" size={100} thickness={8} />
        <DonutGauge value={75} label="XL" size={120} thickness={10} />
      </div>
      <div className="flex gap-3">
        <DonutGauge value={75} size={48} thickness={4} color="var(--obs-zone-n)" />
        <DonutGauge value={75} size={48} thickness={4} color="var(--obs-zone-w)" />
        <DonutGauge value={75} size={48} thickness={4} color="var(--obs-zone-ww)" />
        <DonutGauge value={75} size={48} thickness={4} color="var(--obs-zone-h)" />
        <DonutGauge value={75} size={48} thickness={4} color="var(--obs-zone-c)" />
        <DonutGauge value={75} size={48} thickness={4} color="var(--obs-status-info)" />
        <DonutGauge value={75} size={48} thickness={4} color="#a78bfa" />
      </div>
    </div>
  ),
};

export const ZoneDistribution: StoryObj = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <ZoneDistributionBar
        segments={[
          { zone: 'N', count: 180 },
          { zone: 'W', count: 45 },
          { zone: 'WW', count: 20 },
          { zone: 'H', count: 10 },
          { zone: 'C', count: 5 },
        ]}
        showLabels
        showCounts
      />
      <ZoneDistributionBar
        segments={[
          { zone: 'N', count: 250 },
          { zone: 'W', count: 10 },
        ]}
        height={6}
      />
      <ZoneDistributionBar
        segments={[
          { zone: 'N', count: 50 },
          { zone: 'WW', count: 80 },
          { zone: 'H', count: 60 },
          { zone: 'C', count: 40 },
        ]}
        height={12}
        showLabels
        showCounts
      />
    </div>
  ),
};
