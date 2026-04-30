import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlantMap } from './PlantMap';
import { PlantMapCluster } from './PlantMapCluster';
import type { PlantMarkerData } from './PlantMapMarker';

const meta: Meta<typeof PlantMap> = {
  title: 'Map/PlantMap',
  component: PlantMap,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const demoPlants: PlantMarkerData[] = [
  { id: 'p1', name: '東京水再生センター', lat: 35.68, lng: 139.76, status: 'online', zone: 'N' },
  { id: 'p2', name: '大阪浄水場', lat: 34.69, lng: 135.50, status: 'warning', zone: 'WW' },
  { id: 'p3', name: '名古屋処理場', lat: 35.18, lng: 136.91, status: 'online', zone: 'N' },
  { id: 'p4', name: '福岡浄化センター', lat: 33.59, lng: 130.40, status: 'critical', zone: 'C' },
  { id: 'p5', name: '札幌水処理', lat: 43.06, lng: 141.35, status: 'online', zone: 'N' },
  { id: 'p6', name: '仙台浄水場', lat: 38.27, lng: 140.87, status: 'offline' },
];

export const JapanOverview: Story = {
  args: {
    plants: demoPlants,
    center: [36.5, 138.0],
    zoom: 5,
    height: '500px',
  },
};

export const WithSelection: Story = {
  args: {
    plants: demoPlants,
    selectedPlantId: 'p4',
    center: [36.5, 138.0],
    zoom: 5,
    height: '500px',
  },
};

export const SinglePlant: Story = {
  args: {
    plants: [demoPlants[0]],
    center: [35.68, 139.76],
    zoom: 12,
    height: '400px',
  },
};

export const ClusterIndicator: StoryObj = {
  render: () => (
    <div className="p-8 flex gap-6">
      <PlantMapCluster
        cluster={{ lat: 35, lng: 139, count: 12, onlineCount: 9, warningCount: 2, criticalCount: 1, region: '関東' }}
      />
      <PlantMapCluster
        cluster={{ lat: 34, lng: 135, count: 5, onlineCount: 5, warningCount: 0, criticalCount: 0, region: '関西' }}
      />
      <PlantMapCluster
        cluster={{ lat: 33, lng: 130, count: 3, onlineCount: 1, warningCount: 1, criticalCount: 1, region: '九州' }}
      />
    </div>
  ),
};
