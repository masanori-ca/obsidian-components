import type { Meta, StoryObj } from '@storybook/react-vite';
import { SafetyIcon } from './SafetyIcons';

const meta: Meta<typeof SafetyIcon> = {
  title: 'Icons/SafetyIcons',
  component: SafetyIcon,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

export const AllIcons: StoryObj = {
  render: () => (
    <div className="space-y-4">
      {(['idle', 'passed', 'warned', 'blocked'] as const).map((state) => (
        <div key={state} className="flex items-center gap-4">
          <span className="text-[10px] text-zinc-500 w-14">{state}</span>
          <SafetyIcon type="cbf-shield" state={state} size={40} />
          <SafetyIcon type="barrier-l1" state={state} size={40} />
          <SafetyIcon type="barrier-l2" state={state} size={40} />
          <SafetyIcon type="barrier-l3" state={state} size={40} />
          <SafetyIcon type="escalation" state={state} size={40} />
        </div>
      ))}
    </div>
  ),
};
