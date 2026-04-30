import type { Meta, StoryObj } from '@storybook/react-vite';
import { BrainServiceIcon } from './BrainServiceIcon';

const meta: Meta<typeof BrainServiceIcon> = {
  title: 'Icons/BrainServiceIcons',
  component: BrainServiceIcon,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

const ALL_TYPES = ['brain', 'causal', 'equation', 'compile', 'grow', 'whatif', 'optimize', 'autopilot', 'proof'] as const;

export const AllIcons: StoryObj = {
  render: () => (
    <div className="space-y-4">
      {(['idle', 'active', 'success', 'error'] as const).map((state) => (
        <div key={state} className="flex items-center gap-3">
          <span className="text-[10px] text-zinc-500 w-12">{state}</span>
          {ALL_TYPES.map((type) => (
            <div key={type} className="flex flex-col items-center gap-1">
              <BrainServiceIcon type={type} state={state} size={36} />
              <span className="text-[8px] text-zinc-600">{type}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};
