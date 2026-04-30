import type { Meta, StoryObj } from '@storybook/react-vite';
import { TKRuleList } from './TKRuleList';
import { TKRuleEditor } from './TKRuleEditor';
import { useState } from 'react';

const meta: Meta = { title: 'TK (Tacit Knowledge)', parameters: { layout: 'centered' }, tags: ['autodocs'] };
export default meta;

const sampleRules = [
  { id: '1', condition: '冬季(水温15℃以下) かつ SVI > 150', action: 'MLSS目標値を+500 mg/L上げる', confidence: 0.85, contributor: '田中主任', tags: ['winter', 'sludge'], source: 'expert' as const },
  { id: '2', condition: 'DO < 1.5 mg/L が3時間継続', action: '曝気量を段階的に20%増加', confidence: 0.92, contributor: 'センサーパターン', tags: ['aeration', 'DO'], source: 'sensor_pattern' as const },
  { id: '3', condition: '排水基準TN > 120 mg/L', action: '内部循環量を50%増加', confidence: 0.95, tags: ['regulation', 'TN'], source: 'legal' as const },
  { id: '4', condition: 'SVI正常 かつ SS高', action: '分散汚泥を疑い、BOD負荷履歴を確認', confidence: 0.78, tags: ['diagnosis'], source: 'llm_inference' as const },
];

export const RuleList: StoryObj = {
  render: () => {
    const [sel, setSel] = useState<string | null>(null);
    return <div className="w-[400px]"><TKRuleList rules={sampleRules} selectedId={sel} onSelect={(r) => setSel(r.id)} /></div>;
  },
};

export const Editor: StoryObj = {
  render: () => (
    <div className="w-[380px]">
      <TKRuleEditor
        rule={sampleRules[0]}
        onSave={(r) => console.log('Save:', r)}
        onCancel={() => console.log('Cancel')}
      />
    </div>
  ),
};

export const NewRule: StoryObj = {
  render: () => (
    <div className="w-[380px]">
      <TKRuleEditor onSave={(r) => console.log('New:', r)} onCancel={() => console.log('Cancel')} />
    </div>
  ),
};
