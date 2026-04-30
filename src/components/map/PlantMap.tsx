import { useEffect, useRef, useState } from 'react';
import type { PlantMarkerData } from './PlantMapMarker';

interface PlantMapProps {
  plants: PlantMarkerData[];
  center?: [number, number];
  zoom?: number;
  selectedPlantId?: string | null;
  onPlantClick?: (plant: PlantMarkerData) => void;
  height?: string;
  className?: string;
}

const STATUS_COLORS: Record<string, string> = {
  online: '#34d399',
  warning: '#fbbf24',
  critical: '#f87171',
  offline: '#71717a',
};

/**
 * Plant map component using Leaflet.
 * Displays plant locations with status-colored circle markers.
 * Lazy-loads Leaflet to avoid SSR issues.
 */
export function PlantMap({
  plants,
  center = [36.0, 138.0],
  zoom = 6,
  selectedPlantId,
  onPlantClick,
  height = '400px',
  className = '',
}: PlantMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamic import to avoid SSR/build issues
    import('leaflet').then((L) => {
      // Import leaflet CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      const map = L.map(mapRef.current!, {
        center,
        zoom,
        zoomControl: true,
        attributionControl: false,
      });

      // Dark tile layer
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      L.tileLayer(
        isDark
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        { maxZoom: 19 },
      ).addTo(map);

      mapInstanceRef.current = map;
      setIsLoaded(true);
    });

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers when plants change
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    import('leaflet').then((L) => {
      const map = mapInstanceRef.current!;

      // Clear old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // Add new markers
      plants.forEach((plant) => {
        const color = STATUS_COLORS[plant.status ?? 'online'] ?? STATUS_COLORS.online;
        const isSelected = plant.id === selectedPlantId;

        const marker = L.circleMarker([plant.lat, plant.lng], {
          radius: isSelected ? 12 : 8,
          fillColor: color,
          color: isSelected ? '#38bdf8' : color,
          weight: isSelected ? 3 : 2,
          opacity: 1,
          fillOpacity: 0.6,
        }).addTo(map);

        // Tooltip
        marker.bindTooltip(
          `<div style="text-align:center;font-size:11px;">
            <strong>${plant.name}</strong><br/>
            <span style="color:${color}">${plant.status ?? 'online'}</span>
            ${plant.zone ? `<br/>Zone: ${plant.zone}` : ''}
          </div>`,
          { direction: 'top', offset: [0, -10] },
        );

        marker.on('click', () => {
          onPlantClick?.(plant);
        });

        markersRef.current.push(marker);
      });

      // Fit bounds if multiple plants
      if (plants.length > 1) {
        const bounds = L.latLngBounds(plants.map((p) => [p.lat, p.lng]));
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    });
  }, [plants, selectedPlantId, isLoaded, onPlantClick]);

  return (
    <div className={`rounded-xl overflow-hidden border obs-border-primary/50 ${className}`}>
      <div
        ref={mapRef}
        style={{ height, width: '100%', backgroundColor: 'var(--obs-bg-secondary, #18181b)' }}
      />
    </div>
  );
}
