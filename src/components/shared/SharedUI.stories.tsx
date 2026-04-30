import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Card } from './Card';
import { ToastContainer, useToast } from './Toast';
import { Tabs } from './Tabs';
import { Toggle } from './Toggle';
import { Dropdown } from './Dropdown';
import { DataTable } from './DataTable';
import { ConfirmDialog } from './ConfirmDialog';
import { LoadingOverlay } from './LoadingOverlay';
import { SensorGauge } from './SensorGauge';
import { Button } from './Button';

const meta: Meta = {
  title: 'Shared/UI Components',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

export const SidebarNav: StoryObj = {
  render: () => {
    const [active, setActive] = useState('dashboard');
    return (
      <div style={{ height: 400 }}>
        <Sidebar
          activeId={active}
          onSelect={setActive}
          header={<div className="text-sm font-bold" style={{ color: 'var(--obs-accent-default)' }}>Obsidian</div>}
          items={[
            { id: 'dashboard', label: 'ダッシュボード', badge: 3 },
            { id: 'plants', label: 'プラント一覧' },
            { id: 'alerts', label: 'アラート', badge: 12 },
            { id: 'brain', label: 'Brain', children: [
              { id: 'whatif', label: 'What-If' },
              { id: 'optimize', label: '最適化' },
              { id: 'autopilot', label: 'Autopilot' },
            ]},
            { id: 'catalog', label: 'カタログ' },
            { id: 'settings', label: '設定' },
          ]}
          footer={<div className="text-[10px]" style={{ color: 'var(--obs-text-muted)' }}>v0.1.0</div>}
        />
      </div>
    );
  },
};

export const Cards: StoryObj = {
  render: () => (
    <div className="w-[350px] space-y-3">
      <Card title="センサー状態" subtitle="リアルタイム">
        <div className="flex gap-3">
          <SensorGauge value={7.2} min={0} max={14} label="pH" size={80} />
          <SensorGauge value={2.1} min={0} max={5} label="DO" unit="mg/L" size={80} />
        </div>
      </Card>
      <Card title="アクション" headerRight={<Button size="sm" variant="outline">全表示</Button>}>
        <p className="text-xs obs-text-secondary">是正アクション3件があります</p>
      </Card>
      <Card padding="none">
        <div className="p-4 text-xs obs-text-secondary">パディングなしカード</div>
      </Card>
    </div>
  ),
};

export const Toasts: StoryObj = {
  render: () => {
    const { toasts, addToast, dismissToast } = useToast();
    return (
      <div className="space-y-2">
        <div className="flex gap-2">
          <Button size="sm" onClick={() => addToast({ type: 'success', title: '保存完了', message: '設定が保存されました' })}>Success</Button>
          <Button size="sm" variant="secondary" onClick={() => addToast({ type: 'warning', title: '警告', message: 'DO値が低下しています' })}>Warning</Button>
          <Button size="sm" variant="danger" onClick={() => addToast({ type: 'error', title: 'エラー', message: 'Modbus接続に失敗' })}>Error</Button>
          <Button size="sm" variant="outline" onClick={() => addToast({ type: 'info', title: '情報', message: 'Brain再コンパイル完了' })}>Info</Button>
        </div>
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </div>
    );
  },
};

export const TabVariants: StoryObj = {
  render: () => {
    const [tab1, setTab1] = useState('overview');
    const [tab2, setTab2] = useState('overview');
    const [tab3, setTab3] = useState('overview');
    const tabs = [
      { id: 'overview', label: '概要' },
      { id: 'sensors', label: 'センサー', badge: 12 },
      { id: 'alerts', label: 'アラート', badge: 3 },
      { id: 'history', label: '履歴' },
    ];
    return (
      <div className="w-[400px] space-y-4">
        <div><div className="text-[10px] obs-text-muted mb-1">Default</div><Tabs tabs={tabs} activeId={tab1} onChange={setTab1} /></div>
        <div><div className="text-[10px] obs-text-muted mb-1">Pills</div><Tabs tabs={tabs} activeId={tab2} onChange={setTab2} variant="pills" /></div>
        <div><div className="text-[10px] obs-text-muted mb-1">Underline</div><Tabs tabs={tabs} activeId={tab3} onChange={setTab3} variant="underline" /></div>
      </div>
    );
  },
};

export const Toggles: StoryObj = {
  render: () => {
    const [a, setA] = useState(true);
    const [b, setB] = useState(false);
    const [c, setC] = useState(true);
    return (
      <div className="space-y-3">
        <Toggle checked={a} onChange={setA} label="自律運転モード" description="AIエージェントによる自動制御" />
        <Toggle checked={b} onChange={setB} label="アラート通知" description="メール通知を有効化" />
        <Toggle checked={c} onChange={setC} label="データログ" size="sm" />
        <Toggle checked={false} onChange={() => {}} label="無効" disabled />
      </div>
    );
  },
};

export const Dropdowns: StoryObj = {
  render: () => {
    const [v, setV] = useState('');
    return (
      <div className="w-[300px] space-y-3">
        <Dropdown
          label="プロトコル"
          placeholder="選択してください"
          value={v}
          onChange={setV}
          options={[
            { value: 'modbus', label: 'Modbus TCP', description: 'ポート502' },
            { value: 'opcua', label: 'OPC-UA', description: 'ポート4840' },
            { value: 'mqtt', label: 'MQTT', description: 'ポート1883' },
            { value: 'ds2', label: 'DataServer2', description: 'ポート8015' },
          ]}
        />
      </div>
    );
  },
};

export const DataTableExample: StoryObj = {
  render: () => (
    <div className="w-[500px]">
      <DataTable
        columns={[
          { key: 'variable', label: '変数', sortable: true },
          { key: 'value', label: '値', align: 'right', sortable: true, render: (v) => <span className="font-mono">{String(v)}</span> },
          { key: 'unit', label: '単位', align: 'center' },
          { key: 'zone', label: 'ゾーン', align: 'center', render: (v) => <span style={{ color: v === 'N' ? 'var(--obs-zone-n)' : v === 'C' ? 'var(--obs-zone-c)' : 'var(--obs-zone-ww)' }}>{String(v)}</span> },
        ]}
        data={[
          { variable: 'EffluentNH4', value: 0.52, unit: 'mg/L', zone: 'N' },
          { variable: 'CSTR6_DO', value: 5.2, unit: 'mg/L', zone: 'WW' },
          { variable: 'InfluentFlow', value: 7100, unit: 'm³/d', zone: 'N' },
          { variable: 'EffluentTN', value: 136, unit: 'mg/L', zone: 'C' },
          { variable: 'MLSS', value: 3200, unit: 'mg/L', zone: 'N' },
        ]}
        rowKey="variable"
      />
    </div>
  ),
};

export const ConfirmDialogExample: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)} variant="danger">削除</Button>
        <ConfirmDialog
          isOpen={open}
          title="ベースラインを削除しますか？"
          message="この操作は取り消せません。関連するアラート履歴も削除されます。"
          variant="danger"
          confirmLabel="削除する"
          onConfirm={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </div>
    );
  },
};

export const LoadingStates: StoryObj = {
  render: () => (
    <div className="flex gap-8">
      <div className="relative w-[150px] h-[100px] rounded-lg" style={{ backgroundColor: 'var(--obs-bg-card)', border: '1px solid var(--obs-border-primary)' }}>
        <LoadingOverlay isLoading variant="spinner" message="読み込み中" />
      </div>
      <div className="relative w-[150px] h-[100px] rounded-lg" style={{ backgroundColor: 'var(--obs-bg-card)', border: '1px solid var(--obs-border-primary)' }}>
        <LoadingOverlay isLoading variant="dots" />
      </div>
      <div className="relative w-[150px] h-[100px] rounded-lg" style={{ backgroundColor: 'var(--obs-bg-card)', border: '1px solid var(--obs-border-primary)' }}>
        <LoadingOverlay isLoading variant="bar" message="計算中" />
      </div>
    </div>
  ),
};
