import type { Meta, StoryObj } from '@storybook/react-vite';
import { DeviceConnectionPanel } from './DeviceConnectionPanel';
import { TagMappingEditor } from './TagMappingEditor';
import { LiveDataIndicator } from './LiveDataIndicator';

const meta: Meta = { title: 'Device', parameters: { layout: 'centered' }, tags: ['autodocs'] };
export default meta;

export const Connections: StoryObj = {
  render: () => (
    <div className="w-[450px]">
      <DeviceConnectionPanel connections={[
        { id: '1', name: 'KWSS Modbus', protocol: 'modbus', host: '192.168.1.10', port: 502, status: 'connected', latency: 12, tagCount: 48, lastSeen: '14:30:05' },
        { id: '2', name: 'OPC-UA Server', protocol: 'opcua', host: '192.168.1.20', port: 4840, status: 'disconnected', tagCount: 120 },
        { id: '3', name: 'MQTT Broker', protocol: 'mqtt', host: 'broker.local', port: 1883, status: 'error', lastSeen: '14:25:00' },
        { id: '4', name: 'DataServer2', protocol: 'dataserver2', host: '10.0.0.5', port: 8015, status: 'connecting' },
      ]} />
    </div>
  ),
};

export const TagMapping: StoryObj = {
  render: () => (
    <div className="w-[500px]">
      <TagMappingEditor mappings={[
        { scadaTag: 'AI_001', pckVariable: 'InfluentFlow', unit: 'm³/d', scaleFactor: 1.0, lastValue: 6664.8 },
        { scadaTag: 'AI_002', pckVariable: 'InfluentNH4', unit: 'mg/L', scaleFactor: 1.0, lastValue: 80.2 },
        { scadaTag: 'AI_010', pckVariable: 'CSTR6_DO', unit: 'mg/L', scaleFactor: 1.0, lastValue: 5.2 },
        { scadaTag: 'AI_015', pckVariable: 'EffluentNH4', unit: 'mg/L', scaleFactor: 0.001, lastValue: 0.52 },
        { scadaTag: 'AI_020', pckVariable: 'RO_Pressure', unit: 'MPa', scaleFactor: 0.1, lastValue: 0.72 },
      ]} />
    </div>
  ),
};

export const LiveIndicators: StoryObj = {
  render: () => (
    <div className="space-y-2">
      <LiveDataIndicator isReceiving quality="good" samplesPerSecond={10} lastTimestamp="14:30:05" />
      <LiveDataIndicator isReceiving quality="uncertain" samplesPerSecond={3} />
      <LiveDataIndicator isReceiving={false} />
    </div>
  ),
};
