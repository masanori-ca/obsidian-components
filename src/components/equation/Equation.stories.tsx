import type { Meta, StoryObj } from '@storybook/react-vite';
import { EquationBrowser } from './EquationBrowser';
import { EquationDetail } from './EquationDetail';
import { DependencyGraph } from './DependencyGraph';
import { useState } from 'react';

const meta: Meta = { title: 'Equation', parameters: { layout: 'centered' }, tags: ['autodocs'] };
export default meta;

const sampleEqs = [
  { id: 'eq1', name: 'Monod Kinetics', expression: 'r = r_max * S / (K_s + S)', inputVars: ['r_max', 'S', 'K_s'], outputVar: 'r', domain: 'water_treatment', source: 'PCK' },
  { id: 'eq2', name: 'NH4 Mass Balance', expression: 'NH4_out = NH4_in * (1 - eta)', inputVars: ['NH4_in', 'eta'], outputVar: 'NH4_out', domain: 'water_treatment' },
  { id: 'eq3', name: 'ASME UG-27 Shell', expression: 't = P*R / (S*E - 0.6*P) + CA', inputVars: ['P', 'R', 'S', 'E', 'CA'], outputVar: 't_required', domain: 'pressure_vessels', source: 'ASME' },
  { id: 'eq4', name: 'Bernoulli Equation', expression: 'P1/rho + v1²/2 + gz1 = P2/rho + v2²/2 + gz2', inputVars: ['P1', 'v1', 'z1', 'rho'], outputVar: 'P2', domain: 'fluid_mechanics' },
];

export const Browser: StoryObj = {
  render: () => {
    const [sel, setSel] = useState<string | null>(null);
    return <div className="w-[400px]"><EquationBrowser equations={sampleEqs} selectedId={sel} onSelect={(e) => setSel(e.id)} /></div>;
  },
};

export const Detail: StoryObj = {
  render: () => (
    <div className="w-[350px]">
      <EquationDetail equation={sampleEqs[0]} inputValues={{ r_max: 0.5, S: 80, K_s: 10 }} computedOutput={0.4444} />
    </div>
  ),
};

export const Dependencies: StoryObj = {
  render: () => (
    <div className="w-[600px]">
      <DependencyGraph
        nodes={[
          { id: 'NH4_in', label: 'NH4_in', type: 'input', level: 0 },
          { id: 'r_max', label: 'r_max', type: 'input', level: 0 },
          { id: 'K_s', label: 'K_s', type: 'input', level: 0 },
          { id: 'monod', label: 'Monod', type: 'equation', level: 1 },
          { id: 'mass_bal', label: 'MassBalance', type: 'equation', level: 2 },
          { id: 'NH4_out', label: 'NH4_out', type: 'output', level: 3 },
        ]}
        edges={[
          { from: 'NH4_in', to: 'mass_bal' },
          { from: 'r_max', to: 'monod' },
          { from: 'K_s', to: 'monod' },
          { from: 'monod', to: 'mass_bal' },
          { from: 'mass_bal', to: 'NH4_out' },
        ]}
      />
    </div>
  ),
};
