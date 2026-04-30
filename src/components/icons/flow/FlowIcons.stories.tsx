import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlowArrow } from './FlowArrow';
import { PipeConnector } from './PipeConnector';

const meta: Meta = {
  title: 'Icons/FlowIcons',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

export const Arrows: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <FlowArrow direction="right" state="active" size={60} label="active" />
        <FlowArrow direction="right" state="normal" size={60} label="normal" />
        <FlowArrow direction="right" state="warning" size={60} label="warning" />
        <FlowArrow direction="right" state="critical" size={60} label="critical" />
        <FlowArrow direction="right" state="blocked" size={60} label="blocked" />
        <FlowArrow direction="right" state="inactive" size={60} label="inactive" />
      </div>
      <div className="flex items-center gap-4">
        <FlowArrow direction="right" size={60} animated />
        <FlowArrow direction="down" size={60} animated />
        <FlowArrow direction="left" size={60} animated />
        <FlowArrow direction="up" size={60} animated />
      </div>
    </div>
  ),
};

export const Pipes: StoryObj = {
  render: () => (
    <div className="flex items-center gap-4">
      <PipeConnector type="straight" state="active" size={40} animated />
      <PipeConnector type="elbow" state="active" size={40} animated />
      <PipeConnector type="tee" state="normal" size={40} />
      <PipeConnector type="cross" state="warning" size={40} />
      <PipeConnector type="straight" state="blocked" size={40} />
    </div>
  ),
};
