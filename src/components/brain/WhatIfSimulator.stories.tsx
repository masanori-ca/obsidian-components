import type { Meta, StoryObj } from '@storybook/react-vite';
import { WhatIfSimulator } from './WhatIfSimulator';
import { PCKTenantProvider } from '@/components/providers/PCKTenantProvider';

const meta: Meta<typeof WhatIfSimulator> = {
  title: 'Brain/WhatIfSimulator',
  component: WhatIfSimulator,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <PCKTenantProvider baseUrl="http://localhost:8080" tenant="kurita">
        <div className="w-[420px]">
          <Story />
        </div>
      </PCKTenantProvider>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const WaterTreatment: Story = {
  args: {
    siteId: 'site-kwss-01',
    baseState: {
      cstr6_qair: 1296,
      cstr7_qair: 3600,
      cstr10_qair: 4752,
      InfluentFlow: 6664.8,
      InfluentNH4: 80,
    },
    editableParams: [
      { variable: 'cstr6_qair', label: 'CSTR6 曝気量', baseline: 1296, unit: 'm³/d', min: 300, max: 3000 },
      { variable: 'cstr7_qair', label: 'CSTR7 曝気量', baseline: 3600, unit: 'm³/d', min: 500, max: 7000 },
      { variable: 'cstr10_qair', label: 'CSTR10 曝気量', baseline: 4752, unit: 'm³/d', min: 1000, max: 10000 },
      { variable: 'InfluentNH4', label: '流入NH4', baseline: 80, unit: 'mg/L', min: 20, max: 200 },
    ],
  },
};
