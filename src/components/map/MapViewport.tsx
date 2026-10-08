import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useOperationalStore } from '../../stores/operationalStore';
import { INCIDENT_CENTER, OPERATIONAL_BUILDINGS_GEOJSON } from '../../data/demoIncidentData';
import { MapCameraMode } from '../../types/vyro';

// High-performance public map styles
const MAP_STYLES = {
  TACTICAL_DARK: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  STREET_VECTOR: 'https://demotiles.maplibre.org/style.json',
  SATELLITE: {
    version: 8,
    sources: {
      'esri-satellite': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      }
    },
    layers: [
      {
        id: 'satellite-layer',
        type: 'raster',
        source: 'esri-satellite',
        minzoom: 0,
        maxzoom: 19
      }
    ]
  }
};

export const MapViewport: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const {
    cases,
    rescueTeams,
    medicalTeams,
    hospitals,
    shelters,
    hazardZones,
    commsNodes,
    activeRoute,
    cameraMode,
    layerVisibility,
    flyToTarget,
    selectEntity,
    openBuildingModal,
    selectedEntity,
    activeDisaster
  } = useOperationalStore();

  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES.TACTICAL_DARK as any,
      center: INCIDENT_CENTER,
      zoom: 15.2,
      pitch: 62,
      bearing: -22,
      antialias: true,
      maxPitch: 82
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
    map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

    map.on('load', () => {
      setMapLoaded(true);

      // Add 3D Extruded Building Layer from Carto / OpenMapTiles if available
      try {
        const layers = map.getStyle().layers;
        let labelLayerId: string | undefined;
        if (layers) {
          for (let i = 0; i < layers.length; i++) {
            if (layers[i].type === 'symbol' && (layers[i].layout as any)?.['text-field']) {
              labelLayerId = layers[i].id;
              break;
            }
          }
        }

        // Add 3D Buildings from vector source if present
        if (map.getSource('carto') || map.getSource('openmaptiles')) {
          map.addLayer(
            {
              id: '3d-city-buildings',
              source: map.getSource('carto') ? 'carto' : 'openmaptiles',
              'source-layer': 'building',
              filter: ['==', 'extrude', 'true'],
              type: 'fill-extrusion',
              minzoom: 14,
              paint: {
                'fill-extrusion-color': '#182234',
                'fill-extrusion-height': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  14,
                  0,
                  15.05,
                  ['get', 'render_height']
                ],
                'fill-extrusion-base': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  14,
                  0,
                  15.05,
                  ['get', 'render_min_height']
                ],
                'fill-extrusion-opacity': 0.75
              }
            },
            labelLayerId
          );
        }
      } catch (e) {
        console.log('Generic 3D building layer check:', e);
      }

      // Add High-Fidelity Operational 3D Buildings
      map.addSource('operational-buildings', {
        type: 'geojson',
        data: OPERATIONAL_BUILDINGS_GEOJSON as any
      });

      map.addLayer({
        id: 'operational-buildings-extrusion',
        type: 'fill-extrusion',
        source: 'operational-buildings',
        paint: {
          'fill-extrusion-color': ['get', 'color'],
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.85
        }
      });

      // Click on 3D Building opens deep inspection
      map.on('click', 'operational-buildings-extrusion', (e) => {
        if (e.features && e.features[0]) {
          const props = e.features[0].properties;
          if (props?.type === 'SHELTER') {
            openBuildingModal('SHELTER-01', 'SHELTER');
          } else if (props?.type === 'HOSPITAL') {
            openBuildingModal('HOSPITAL-01', 'HOSPITAL');
          }
        }
      });

      // Cursor pointer on hover over operational 3D buildings
      map.on('mouseenter', 'operational-buildings-extrusion', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'operational-buildings-extrusion', () => {
        map.getCanvas().style.cursor = '';
      });

      // Add Hazard Flood Zone Layers
      map.addSource('hazard-zones-src', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: hazardZones.map((hz) => ({
            type: 'Feature',
            properties: { id: hz.id, name: hz.name, severity: hz.severity },
            geometry: {
              type: 'Polygon',
              coordinates: [hz.coordinates]
            }
          }))
        }
      });

      map.addLayer({
        id: 'hazard-fill',
        type: 'fill',
        source: 'hazard-zones-src',
        paint: {
          'fill-color': '#dc2626',
          'fill-opacity': 0.28
        }
      });

      map.addLayer({
        id: 'hazard-outline',
        type: 'line',
        source: 'hazard-zones-src',
        paint: {
          'line-color': '#ef4444',
          'line-width': 2.5,
          'line-dasharray': [3, 2]
        }
      });

      // Add Route Source & Layers
      map.addSource('active-route-src', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      // Route Casing
      map.addLayer({
        id: 'route-glow-layer',
        type: 'line',
        source: 'active-route-src',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#0284c7',
          'line-width': 8,
          'line-opacity': 0.4
        }
      });

      // Route Core
      map.addLayer({
        id: 'route-core-layer',
        type: 'line',
        source: 'active-route-src',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#38bdf8',
          'line-width': 4,
          'line-opacity': 0.95
        }
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Hazard Layer Visibility
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const visibility = layerVisibility.hazards ? 'visible' : 'none';
    if (map.getLayer('hazard-fill')) map.setLayoutProperty('hazard-fill', 'visibility', visibility);
    if (map.getLayer('hazard-outline')) map.setLayoutProperty('hazard-outline', 'visibility', visibility);
  }, [layerVisibility.hazards, mapLoaded]);

  // Update Hazard Zones GeoJSON and styling based on activeDisaster
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const src = map.getSource('hazard-zones-src') as maplibregl.GeoJSONSource | undefined;
    if (!src) return;

    const matching = hazardZones.filter((hz) => hz.type === activeDisaster);
    const toRender = matching.length > 0 ? matching : hazardZones.filter((h) => h.type === 'FLOOD');

    src.setData({
      type: 'FeatureCollection',
      features: toRender.map((hz) => ({
        type: 'Feature',
        properties: { id: hz.id, name: hz.name, severity: hz.severity },
        geometry: {
          type: 'Polygon',
          coordinates: [hz.coordinates]
        }
      }))
    });

    const disasterColors: Record<string, string> = {
      FLOOD: '#dc2626',
      FIRE: '#ea580c',
      CYCLONE: '#7c3aed',
      EARTHQUAKE: '#d97706',
      TSUNAMI: '#0284c7',
      LANDSLIDE: '#b45309'
    };
    const color = disasterColors[activeDisaster] || '#dc2626';
    if (map.getLayer('hazard-fill')) map.setPaintProperty('hazard-fill', 'fill-color', color);
    if (map.getLayer('hazard-outline')) map.setPaintProperty('hazard-outline', 'line-color', color);
  }, [activeDisaster, hazardZones, mapLoaded]);

  // Update 3D Building Visibility
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const visibility = layerVisibility.buildings3d ? 'visible' : 'none';
    if (map.getLayer('operational-buildings-extrusion')) {
      map.setLayoutProperty('operational-buildings-extrusion', 'visibility', visibility);
    }
    if (map.getLayer('3d-city-buildings')) {
      map.setLayoutProperty('3d-city-buildings', 'visibility', visibility);
    }
  }, [layerVisibility.buildings3d, mapLoaded]);

  // Update Active Route Geometry
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const src = map.getSource('active-route-src') as maplibregl.GeoJSONSource | undefined;
    if (!src) return;

    if (activeRoute && layerVisibility.routes) {
      src.setData({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { risk: activeRoute.risk },
            geometry: {
              type: 'LineString',
              coordinates: activeRoute.geometry
            }
          }
        ]
      });

      // Adapt route color if high risk
      const routeColor = activeRoute.risk === 'HIGH' ? '#f59e0b' : '#38bdf8';
      const glowColor = activeRoute.risk === 'HIGH' ? '#b45309' : '#0284c7';
      map.setPaintProperty('route-core-layer', 'line-color', routeColor);
      map.setPaintProperty('route-glow-layer', 'line-color', glowColor);
    } else {
      src.setData({
        type: 'FeatureCollection',
        features: []
      });
    }
  }, [activeRoute, layerVisibility.routes, mapLoaded]);

  // Handle Camera Mode Changes (2D / 3D / Satellite)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (cameraMode === '2D') {
      map.easeTo({ pitch: 0, bearing: 0, duration: 1000 });
    } else if (cameraMode === '3D') {
      map.easeTo({ pitch: 62, bearing: -22, duration: 1000 });
    } else if (cameraMode === 'SATELLITE') {
      // Set satellite raster basemap
      map.setStyle(MAP_STYLES.SATELLITE as any);
      setMapLoaded(false);
      map.once('load', () => setMapLoaded(true));
    } else if (cameraMode === 'TERRAIN') {
      map.easeTo({ pitch: 75, bearing: -35, zoom: 15.6, duration: 1200 });
    }
  }, [cameraMode]);

  // Handle FlyTo Targets
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !flyToTarget) return;

    map.flyTo({
      center: flyToTarget.coordinates,
      zoom: flyToTarget.zoom ?? 16.8,
      pitch: flyToTarget.pitch ?? 62,
      bearing: flyToTarget.bearing ?? -25,
      duration: flyToTarget.duration ?? 1800,
      essential: true
    });
  }, [flyToTarget]);

  // Render Tactical Markers for All Operational Entities
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Clean up old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // 1. Victims Markers
    if (layerVisibility.victims) {
      cases.forEach((victim) => {
        const el = document.createElement('div');
        el.className = 'cursor-pointer group relative';

        const isSelected = selectedEntity?.type === 'VICTIM' && selectedEntity?.id === victim.id;
        const isCritical = victim.priority === 'CRITICAL';
        const colorClass = isCritical
          ? 'bg-rose-500 shadow-rose-500/50'
          : victim.priority === 'CHAIN_BREAK'
          ? 'bg-amber-500 shadow-amber-500/50'
          : 'bg-emerald-500 shadow-emerald-500/50';

        el.innerHTML = `
          <div class="flex flex-col items-center">
            ${isCritical ? `
              <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-gradient-to-t from-rose-500 via-rose-400 to-transparent pointer-events-none"></div>
              <div class="absolute -top-12 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-rose-400 animate-ping pointer-events-none"></div>
              <div class="absolute -top-1 w-7 h-7 rounded-full bg-rose-500/30 animate-ping"></div>
            ` : victim.priority === 'CHAIN_BREAK' ? `
              <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-gradient-to-t from-amber-500 via-amber-400 to-transparent pointer-events-none"></div>
              <div class="absolute -top-12 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-400 animate-ping pointer-events-none"></div>
              <div class="absolute -top-1 w-7 h-7 rounded-full bg-amber-500/30 animate-ping"></div>
            ` : ''}
            <div class="relative flex items-center justify-center w-7 h-7 rounded-full text-white font-bold text-xs shadow-lg border-2 ${
              isSelected ? 'border-white scale-125 ring-2 ring-cyan-400' : 'border-slate-900'
            } ${colorClass} transition-transform duration-200">
              <span>!</span>
            </div>
            <div class="mt-1 px-1.5 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[10px] font-mono text-slate-200 whitespace-nowrap shadow backdrop-blur-sm pointer-events-none">
              ${victim.id.replace('VY-2026-', '#')}
            </div>
          </div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          selectEntity('VICTIM', victim.id);
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat(victim.coordinates)
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // 2. Rescue Teams Markers
    if (layerVisibility.rescueTeams) {
      rescueTeams.forEach((team) => {
        const el = document.createElement('div');
        el.className = 'cursor-pointer group relative';
        const isSelected = selectedEntity?.type === 'TEAM' && selectedEntity?.id === team.id;

        el.innerHTML = `
          <div class="flex flex-col items-center">
            <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-sky-500 shadow-lg shadow-sky-500/40 text-white font-bold text-xs border-2 ${
              isSelected ? 'border-white scale-125 ring-2 ring-sky-400' : 'border-slate-900'
            } transition-transform duration-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <div class="mt-1 px-1.5 py-0.5 rounded bg-sky-950/90 border border-sky-600/60 text-[10px] font-mono text-sky-200 whitespace-nowrap shadow pointer-events-none">
              ${team.callsign}
            </div>
          </div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          selectEntity('TEAM', team.id);
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat(team.coordinates)
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // 3. Hospitals Markers
    if (layerVisibility.hospitals) {
      hospitals.forEach((hosp) => {
        const el = document.createElement('div');
        el.className = 'cursor-pointer group relative';
        const isSelected = selectedEntity?.type === 'HOSPITAL' && selectedEntity?.id === hosp.id;

        el.innerHTML = `
          <div class="flex flex-col items-center">
            <div class="relative flex items-center justify-center w-7 h-7 rounded-md bg-emerald-600 shadow-lg text-white font-bold text-xs border-2 ${
              isSelected ? 'border-white scale-125' : 'border-slate-900'
            } transition-transform">
              <span class="text-sm">+</span>
            </div>
            <div class="mt-1 px-1.5 py-0.5 rounded bg-emerald-950/90 border border-emerald-600/50 text-[10px] font-mono text-emerald-200 whitespace-nowrap shadow pointer-events-none">
              ${hosp.name.split(' ')[0]} [${hosp.availableBeds} beds]
            </div>
          </div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          selectEntity('HOSPITAL', hosp.id);
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat(hosp.coordinates)
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // 4. Shelters Markers
    if (layerVisibility.shelters) {
      shelters.forEach((shelter) => {
        const el = document.createElement('div');
        el.className = 'cursor-pointer group relative';
        const isSelected = selectedEntity?.type === 'SHELTER' && selectedEntity?.id === shelter.id;
        const available = shelter.capacity - shelter.currentOccupancy;

        el.innerHTML = `
          <div class="flex flex-col items-center">
            <div class="relative flex items-center justify-center w-7 h-7 rounded-md bg-purple-600 shadow-lg text-white font-bold text-xs border-2 ${
              isSelected ? 'border-white scale-125' : 'border-slate-900'
            } transition-transform">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            </div>
            <div class="mt-1 px-1.5 py-0.5 rounded bg-purple-950/90 border border-purple-600/50 text-[10px] font-mono text-purple-200 whitespace-nowrap shadow pointer-events-none">
              ${shelter.name.split(' ')[0]} [${available} free]
            </div>
          </div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          selectEntity('SHELTER', shelter.id);
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat(shelter.coordinates)
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // 5. Comms Nodes
    if (layerVisibility.communication) {
      commsNodes.forEach((node) => {
        const el = document.createElement('div');
        el.className = 'cursor-pointer group relative';

        el.innerHTML = `
          <div class="flex flex-col items-center opacity-80 hover:opacity-100">
            <div class="w-4 h-4 rounded-full bg-cyan-400 border border-slate-950 flex items-center justify-center">
              <div class="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
            </div>
            <div class="text-[9px] font-mono text-cyan-300 bg-slate-950/80 px-1 py-0.2 rounded mt-0.5">
              ${node.name.split(' ')[0]}
            </div>
          </div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          selectEntity('NODE', node.id);
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat(node.coordinates)
          .addTo(map);

        markersRef.current.push(marker);
      });
    }
  }, [
    cases,
    rescueTeams,
    hospitals,
    shelters,
    commsNodes,
    layerVisibility,
    selectedEntity,
    mapLoaded
  ]);

  return (
    <div className="relative w-full h-full bg-[#080c14] overflow-hidden select-none">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
