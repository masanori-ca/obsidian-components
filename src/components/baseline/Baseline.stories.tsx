import type { Meta, StoryObj } from '@storybook/react-vite';
import { BaselineVersionList } from './BaselineVersionList';
import { BaselineComparison } from './BaselineComparison';
import { ThresholdEditor } from './ThresholdEditor';

const meta: Meta = { title: 'Baseline', parameters: { layout: 'centered' }, tags: ['autodocs'] };
export default meta;

export const Versions: StoryObj = {
  render: () => (
    <div className="w-[400px]">
      <BaselineVersionList versions={[
        { id: '1', version: 5, createdAt: '2026-04-30 14:00', source: 'simulator', variableCount: 262, isActive: true, notes: 'SUMO定常状態' },
        { id: '2', version: 4, createdAt: '2026-04-28 10:00', source: 'calibration', variableCount: 262, isActive: false },
        { id: '3', version: 3, createdAt: '2026-04-20 09:00', source: 'manual', variableCount: 240, isActive: false, notes: '手動キャリブレーション' },
      ]} />
    </div>
  ),
};

export const Comparison: StoryObj = {
  render: () => (
    <div className="w-[450px]">
      <BaselineComparison versionA="v4" versionB="v5" entries={[
        { variable: 'EffluentNH4', valueA: 0.5, valueB: 0.52, unit: 'mg/L' },
        { variable: 'CSTR6_DO', valueA: 8.0, valueB: 8.25, unit: 'mg/L' },
        { variable: 'InfluentFlow', valueA: 6664, valueB: 6664.8, unit: 'm³/d' },
        { variable: 'MLSS', valueA: 3000, valueB: 3200, unit: 'mg/L' },
        { variable: 'cstr6_qair', valueA: 1200, valueB: 1296, unit: 'm³/d' },
      ]} />
    </div>
  ),
};

export const Thresholds: StoryObj = {
  render: () => (
    <div className="w-[550px]">
      <ThresholdEditor thresholds={[
        { variable: 'EffluentNH4', ll: 0, l: 0.1, h: 2.0, hh: 5.0, unit: 'mg/L', currentValue: 0.52 },
        { variable: 'CSTR6_DO', ll: 0.5, l: 1.0, h: 6.0, hh: 8.0, unit: 'mg/L', currentValue: 5.2 },
        { variable: 'InfluentFlow', ll: 2000, l: 4000, h: 8000, hh: 10000, unit: 'm³/d', currentValue: 7100 },
        { variable: 'EffluentTN', ll: 0, l: 20, h: 100, hh: 120, unit: 'mg/L', currentValue: 136 },
      ]} />
    </div>
  ),
};
