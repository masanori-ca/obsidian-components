import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ProofTraceDrawer } from './ProofTraceDrawer';
import type { ProofTrace } from '@/components/hooks/useChatSSE';

const meta: Meta<typeof ProofTraceDrawer> = {
  title: 'Chat/ProofTraceDrawer',
  component: ProofTraceDrawer,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const sampleTrace: ProofTrace = {
  sources: {
    shell_thickness_required: 'PCK',
    joint_efficiency: 'PDS',
    mawp: 'PCK',
    corrosion_allowance: 'TK',
    surrogate_stress: 'Surrogate',
  },
  judgments: [
    { status: 'OK', reason: 'All constraints satisfied' },
  ],
  constraints: [
    { label: '[JGC:安全制約]', violated: false, description: 'Amine service requires PWHT', severity: 'info' },
    { label: '[ASME:UG-27]', violated: false, description: 'Shell thickness meets minimum requirement', severity: 'info' },
    { label: '[JGC:失敗事例]', violated: true, description: 'Similar vessel failed due to SCC in amine service', severity: 'warn' },
  ],
  cbf: [
    { variable: 'joint_efficiency', status: 'passed', description: 'Value 1.0 within range' },
    { variable: 'mawp', status: 'passed', description: 'MAWP 150 kPa within design limit' },
    { variable: 'corrosion_rate', status: 'warned', description: 'Approaching upper bound of 0.3 mm/yr' },
  ],
  dag: ['max_design_pressure', 'shell_diameter', 'joint_efficiency', 'shell_thickness_required', 'mawp', 'hydrotest_pressure'],
};

const InteractiveStory = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="p-8">
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-sky-500 text-white rounded-lg"
      >
        証跡を開く
      </button>
      <ProofTraceDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        proofTrace={sampleTrace}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <InteractiveStory />,
};
