import type { Meta, StoryObj } from '@storybook/react-vite';
import { PCKTenantProvider } from '@/components/providers/PCKTenantProvider';
import { VariableBrowser } from './VariableBrowser';
import { VariableDetail } from './VariableDetail';
import { DisciplineFilter } from './DisciplineFilter';
import { KnowledgeGraph } from './KnowledgeGraph';
import { VariableSearchBar } from './VariableSearchBar';
import { useState } from 'react';

const meta: Meta = { title: 'Catalog', parameters: { layout: 'centered' }, tags: ['autodocs'] };
export default meta;

const sampleVars = [
  { id: '1', symbol: 'EffluentNH4', name: 'Effluent Ammonium', nameJa: '放流水NH4', unit: 'mg/L', discipline: 'water_treatment' },
  { id: '2', symbol: 'CSTR6_DO', name: 'CSTR6 Dissolved Oxygen', nameJa: 'CSTR6溶存酸素', unit: 'mg/L', discipline: 'water_treatment' },
  { id: '3', symbol: 'InfluentFlow', name: 'Influent Flow Rate', nameJa: '流入水流量', unit: 'm³/d', discipline: 'fluid_mechanics' },
  { id: '4', symbol: 'MLSS', name: 'Mixed Liquor Suspended Solids', nameJa: '活性汚泥浮遊物質', unit: 'mg/L', discipline: 'biology' },
  { id: '5', symbol: 'shell_thickness', name: 'Shell Thickness Required', unit: 'mm', discipline: 'mechanical_engineering' },
  { id: '6', symbol: 'MAWP', name: 'Maximum Allowable Working Pressure', unit: 'kPa', discipline: 'mechanical_engineering' },
];

export const Browser: StoryObj = {
  render: () => {
    const [sel, setSel] = useState<string | null>(null);
    return (
      <div className="w-[350px]">
        <VariableBrowser variables={sampleVars} selectedId={sel} onSelect={(v) => setSel(v.id)} />
      </div>
    );
  },
};

export const Detail: StoryObj = {
  render: () => (
    <div className="w-[350px]">
      <VariableDetail
        variable={sampleVars[0]}
        currentValue={0.52}
        baselineValue={0.5}
        relatedEquations={[
          { id: 'eq1', name: 'NH4 Mass Balance', expression: 'NH4_out = NH4_in * (1 - removal_rate)' },
          { id: 'eq2', name: 'Monod Kinetics', expression: 'r = r_max * S / (K_s + S)' },
        ]}
      />
    </div>
  ),
};

export const Disciplines: StoryObj = {
  render: () => {
    const [sel, setSel] = useState<string[]>([]);
    return (
      <div className="w-[400px]">
        <DisciplineFilter
          disciplines={[
            { id: 'water_treatment', name: 'Water Treatment', nameJa: '水処理', count: 262 },
            { id: 'chemical_engineering', name: 'Chemical Engineering', nameJa: '化学工学', count: 145 },
            { id: 'mechanical_engineering', name: 'Mechanical Engineering', nameJa: '機械工学', count: 89 },
            { id: 'biology', name: 'Biology', nameJa: '生物学', count: 78 },
            { id: 'fluid_mechanics', name: 'Fluid Mechanics', nameJa: '流体力学', count: 56 },
            { id: 'thermodynamics', name: 'Thermodynamics', nameJa: '熱力学', count: 42 },
            { id: 'environmental', name: 'Environmental', nameJa: '環境工学', count: 38 },
            { id: 'electrical_engineering', name: 'Electrical', nameJa: '電気工学', count: 25 },
          ]}
          selected={sel}
          onChange={setSel}
        />
      </div>
    );
  },
};

export const Graph: StoryObj = {
  render: () => (
    <div className="w-[500px]">
      <KnowledgeGraph
        nodes={[
          { id: 'InfluentNH4', label: 'InfluentNH4', type: 'variable', x: 80, y: 80 },
          { id: 'monod', label: 'Monod', type: 'equation', x: 200, y: 60 },
          { id: 'CSTR6_DO', label: 'CSTR6_DO', type: 'variable', x: 320, y: 80 },
          { id: 'mass_balance', label: 'MassBalance', type: 'equation', x: 440, y: 60 },
          { id: 'EffluentNH4', label: 'EffluentNH4', type: 'variable', x: 540, y: 80 },
          { id: 'tk_winter', label: 'WinterRule', type: 'tk', x: 200, y: 180 },
          { id: 'cbf_tn', label: 'TN≤120', type: 'cbf', x: 440, y: 180 },
        ]}
        edges={[
          { from: 'InfluentNH4', to: 'monod', type: 'input' },
          { from: 'monod', to: 'CSTR6_DO', type: 'output' },
          { from: 'CSTR6_DO', to: 'mass_balance', type: 'input' },
          { from: 'mass_balance', to: 'EffluentNH4', type: 'output' },
          { from: 'tk_winter', to: 'CSTR6_DO', type: 'causal' },
          { from: 'cbf_tn', to: 'EffluentNH4', type: 'constraint' },
        ]}
        width={620}
        height={240}
      />
    </div>
  ),
};

export const SearchBar: StoryObj = {
  decorators: [(Story) => <PCKTenantProvider><div className="w-[350px]"><Story /></div></PCKTenantProvider>],
  render: () => {
    return <VariableSearchBar onSelect={(v) => console.log('Selected:', v)} />;
  },
};
