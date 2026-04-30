import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReactorIcon } from './ReactorIcon';
import { SettlerIcon } from './SettlerIcon';
import { MembraneIcon } from './MembraneIcon';
import { PumpIcon } from './PumpIcon';
import { AeratorIcon } from './AeratorIcon';
import { TankIcon } from './TankIcon';
import type { UnitState } from './types';

const meta: Meta = {
  title: 'Icons/UnitIcons',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['normal', 'stopped', 'warning', 'high', 'critical', 'blocked'],
    },
    size: { control: { type: 'range', min: 48, max: 120, step: 8 } },
    selected: { control: 'boolean' },
  },
};
export default meta;

// Individual icons with controls
export const Reactor: StoryObj = {
  args: { state: 'normal', size: 80, label: 'CSTR6' },
  render: (args) => <ReactorIcon {...args} />,
};

export const Settler: StoryObj = {
  args: { state: 'normal', size: 80, label: '沈殿池' },
  render: (args) => <SettlerIcon {...args} />,
};

export const Membrane: StoryObj = {
  args: { state: 'normal', size: 80, label: 'RO膜' },
  render: (args) => <MembraneIcon {...args} />,
};

export const Pump: StoryObj = {
  args: { state: 'normal', size: 80, label: 'ポンプ' },
  render: (args) => <PumpIcon {...args} />,
};

export const Aerator: StoryObj = {
  args: { state: 'normal', size: 80, label: '曝気' },
  render: (args) => <AeratorIcon {...args} />,
};

export const Tank: StoryObj = {
  args: { state: 'normal', size: 80, label: '貯槽' },
  render: (args) => <TankIcon {...args} />,
};

// All units in all states
const ALL_STATES: UnitState[] = ['normal', 'stopped', 'warning', 'high', 'critical', 'blocked'];

export const AllUnitsAllStates: StoryObj = {
  render: () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="grid grid-cols-7 gap-2 text-center">
        <div className="text-[10px] text-zinc-500" />
        {ALL_STATES.map((s) => (
          <div key={s} className="text-[10px] text-zinc-400 font-medium uppercase">{s}</div>
        ))}
      </div>

      {/* Reactor row */}
      <div className="grid grid-cols-7 gap-2 items-center">
        <div className="text-xs text-zinc-400">Reactor</div>
        {ALL_STATES.map((s) => (
          <ReactorIcon key={s} state={s} size={64} label={s} />
        ))}
      </div>

      {/* Settler row */}
      <div className="grid grid-cols-7 gap-2 items-center">
        <div className="text-xs text-zinc-400">Settler</div>
        {ALL_STATES.map((s) => (
          <SettlerIcon key={s} state={s} size={64} label={s} />
        ))}
      </div>

      {/* Membrane row */}
      <div className="grid grid-cols-7 gap-2 items-center">
        <div className="text-xs text-zinc-400">Membrane</div>
        {ALL_STATES.map((s) => (
          <MembraneIcon key={s} state={s} size={64} label={s} />
        ))}
      </div>

      {/* Pump row */}
      <div className="grid grid-cols-7 gap-2 items-center">
        <div className="text-xs text-zinc-400">Pump</div>
        {ALL_STATES.map((s) => (
          <PumpIcon key={s} state={s} size={64} label={s} />
        ))}
      </div>

      {/* Aerator row */}
      <div className="grid grid-cols-7 gap-2 items-center">
        <div className="text-xs text-zinc-400">Aerator</div>
        {ALL_STATES.map((s) => (
          <AeratorIcon key={s} state={s} size={64} label={s} />
        ))}
      </div>

      {/* Tank row */}
      <div className="grid grid-cols-7 gap-2 items-center">
        <div className="text-xs text-zinc-400">Tank</div>
        {ALL_STATES.map((s) => (
          <TankIcon key={s} state={s} size={64} label={s} />
        ))}
      </div>
    </div>
  ),
};

// Process flow composition
export const ProcessFlowComposition: StoryObj = {
  render: () => (
    <div className="flex items-center gap-3">
      <TankIcon state="normal" size={72} label="流入" />
      <span className="text-zinc-600">→</span>
      <PumpIcon state="normal" size={72} label="送水P" />
      <span className="text-zinc-600">→</span>
      <ReactorIcon state="warning" size={72} label="CSTR6" />
      <span className="text-zinc-600">→</span>
      <AeratorIcon state="high" size={72} label="曝気" />
      <span className="text-zinc-600">→</span>
      <MembraneIcon state="normal" size={72} label="MBBR" />
      <span className="text-zinc-600">→</span>
      <SettlerIcon state="normal" size={72} label="沈殿池" />
      <span className="text-zinc-600">→</span>
      <TankIcon state="normal" size={72} label="放流" />
    </div>
  ),
};

// Size comparison
export const SizeComparison: StoryObj = {
  render: () => (
    <div className="flex items-end gap-4">
      <ReactorIcon state="normal" size={48} label="48px" />
      <ReactorIcon state="normal" size={64} label="64px" />
      <ReactorIcon state="normal" size={80} label="80px" />
      <ReactorIcon state="normal" size={96} label="96px" />
      <ReactorIcon state="normal" size={120} label="120px" />
    </div>
  ),
};
