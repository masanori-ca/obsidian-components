import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormulaBlock } from './FormulaBlock';
import { DeltaTable } from './DeltaTable';
import { VariableChip } from './VariableChip';
import { UnitStatusCard } from './UnitStatusCard';
import { SafetyWarningBlock } from './SafetyWarningBlock';
import { ComputeResultCard } from './ComputeResultCard';
import { OptimizeResultCard } from './OptimizeResultCard';
import { CausalPathInline } from './CausalPathInline';
import { TKRuleCard } from './TKRuleCard';
import { InlineChart } from './InlineChart';

const meta: Meta = { title: 'Chat/Content Blocks', parameters: { layout: 'centered' }, tags: ['autodocs'] };
export default meta;

export const Formula: StoryObj = {
  render: () => (
    <div className="w-[400px]">
      <FormulaBlock
        name="Monod Kinetics"
        expression="r = r_max × S / (K_s + S)"
        source="PCK Equation Registry"
        inputVars={[
          { symbol: 'r_max', value: 0.5, unit: 'd⁻¹' },
          { symbol: 'S', value: 80, unit: 'mg/L' },
          { symbol: 'K_s', value: 10, unit: 'mg/L' },
        ]}
        outputVar={{ symbol: 'r', value: 0.444, unit: 'd⁻¹' }}
      />
    </div>
  ),
};

export const WhatIfDelta: StoryObj = {
  render: () => (
    <div className="w-[400px]">
      <DeltaTable
        overrides={{ cstr6_qair: 648 }}
        deltas={{
          CSTR6_DO: { baseline: 8.25, what_if: 4.13, delta: -4.12, delta_pct: -50.0 },
          EffluentNH4: { baseline: 0.009, what_if: 0.011, delta: 0.002, delta_pct: 16.6 },
          CSTR6_NH4: { baseline: 7.07, what_if: 8.24, delta: 1.17, delta_pct: 16.6 },
        }}
        cbfPassed={true}
      />
    </div>
  ),
};

export const Variables: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <VariableChip symbol="CSTR6_DO" value={8.25} unit="mg/L" source="PCK" />
      <VariableChip symbol="EffluentNH4" value={0.011} unit="mg/L" baseline={0.009} source="PCK" />
      <VariableChip symbol="WinterRule" source="TK" />
      <VariableChip symbol="stress_pred" value={145.2} unit="MPa" source="Surrogate" />
    </div>
  ),
};

export const UnitStatus: StoryObj = {
  render: () => (
    <div className="w-[400px] space-y-2">
      <UnitStatusCard unitId="cstr6" unitLabel="CSTR6 反応槽" zone="H" variables={[
        { symbol: 'DO', value: 5.2, unit: 'mg/L', zone: 'H' },
        { symbol: 'NH4', value: 8.24, unit: 'mg/L', zone: 'WW' },
        { symbol: 'MLSS', value: 3200, unit: 'mg/L', zone: 'N' },
      ]} />
      <UnitStatusCard unitId="settler" unitLabel="沈殿池" zone="N" variables={[
        { symbol: 'SS', value: 12.3, unit: 'mg/L', zone: 'N' },
        { symbol: 'SVI', value: 95, zone: 'N' },
      ]} />
    </div>
  ),
};

export const SafetyWarnings: StoryObj = {
  render: () => (
    <div className="w-[400px] space-y-2">
      <SafetyWarningBlock type="block" title="CBF L2: 排水基準超過" message="TN=136 mg/L が日本排水基準(120 mg/L)を超過しています。" violations={[
        { variable: 'EffluentTN', layer: 'L2', operator: '<=', threshold: 120, actual: 136 },
      ]} source="CBF Service" />
      <SafetyWarningBlock type="warn" title="TK: 冬季運転注意" message="水温15℃以下では硝化速度が低下します。DO設定を+0.5 mg/L上げることを推奨。" source="TK#1247" />
      <SafetyWarningBlock type="info" title="計算完了" message="全262変数の因果伝播が完了しました。" />
    </div>
  ),
};

export const ComputeResult: StoryObj = {
  render: () => (
    <div className="w-[400px]">
      <ComputeResultCard context={{
        nodes: 5,
        constraints: 8,
        safety_violations: 1,
        cbf_blocks: 0,
        tk_count: 3,
        has_what_if: true,
        what_if_blocked: false,
        dag_path: ['InfluentNH4', 'cstr6_DO', 'cstr6_NH4', 'EffluentNH4', 'EffluentTN'],
      }} executionTimeMs={1250} />
    </div>
  ),
};

export const OptimizeResult: StoryObj = {
  render: () => (
    <div className="w-[400px]">
      <OptimizeResultCard
        targetMet
        targetDescription="EffluentNH4 ≤ 2.0 mg/L + エネルギー最小化"
        energyReductionPct={65}
        scenariosEvaluated={12}
        cbfPassed
        params={[
          { variable: 'cstr6_qair', baseline: 1296, optimized: 549, unit: 'm³/d' },
          { variable: 'cstr7_qair', baseline: 3600, optimized: 500, unit: 'm³/d' },
          { variable: 'cstr10_qair', baseline: 4752, optimized: 2626, unit: 'm³/d' },
        ]}
      />
    </div>
  ),
};

export const CausalPath: StoryObj = {
  render: () => (
    <div className="w-[400px]">
      <CausalPathInline
        path={['InfluentNH4', 'cstr5_NH4', 'cstr6_DO', 'cstr6_NH4', 'EffluentNH4']}
        rootCause="InfluentNH4"
        impactedVariable="EffluentNH4"
      />
    </div>
  ),
};

export const TKRule: StoryObj = {
  render: () => (
    <div className="w-[400px] space-y-2">
      <TKRuleCard condition="冬季(水温15℃以下) かつ SVI > 150" action="MLSS目標値を+500 mg/L上げる" confidence={0.85} contributor="田中主任" source="expert" />
      <TKRuleCard condition="排水基準TN > 120 mg/L" action="曝気量を20%増加" confidence={0.95} source="legal" />
    </div>
  ),
};

export const Charts: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <InlineChart label="DO" data={[8.2, 8.0, 7.5, 6.8, 5.9, 5.2, 4.8, 4.5]} unit="mg/L" warningThreshold={6} criticalThreshold={4} />
      <InlineChart label="NH4" data={[0.5, 0.52, 0.55, 0.6, 0.7, 0.85, 1.1, 1.4]} unit="mg/L" criticalThreshold={2} color="var(--obs-status-warning)" />
      <InlineChart label="Flow" data={[6600, 6700, 6650, 6800, 7000, 7100, 6900, 6850]} unit="m³/d" />
    </div>
  ),
};
