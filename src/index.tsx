import React from 'react';
import ReactDOM from 'react-dom/client';
import { CRS, DivIcon, type LatLngExpression } from 'leaflet';
import {
  MapContainer,
  TileLayer,
  Polygon,
  LayerGroup,
  Marker,
} from 'react-leaflet';

import { regionBorders, regions } from './map/regions';

const element = document.getElementById('app');

if (!element) {
  throw new Error('invariant: root element should be present');
}

const RegionBorders = () => (
  <LayerGroup>
    {regionBorders.map((borders, i) => (
      <Polygon
        positions={borders}
        key={i}
        pathOptions={{ color: 'black', opacity: 0.1 }}
      />
    ))}
  </LayerGroup>
);

const RegionTitles = () => (
  <LayerGroup>
    {regions.map((region) => (
      <Marker
        position={region.center as LatLngExpression}
        key={region.id}
        title={region.name}
        icon={
          new DivIcon({
            iconSize: [150, 20],
            iconAnchor: [75, 15],
            html: `<span>${region.name}</span>`,
          })
        }
      ></Marker>
    ))}
  </LayerGroup>
);

const App = () => (
  <MapContainer
    className="w-screen h-screen bg-slate-800"
    crs={CRS.Simple}
    center={[-128, 128]}
    zoom={2}
    minZoom={2}
    maxZoom={5}
    maxBounds={[
      [-256, -50],
      [0, 306],
    ]}
    maxBoundsViscosity={1.0}
    scrollWheelZoom={true}
  >
    <TileLayer url="https://raw.githubusercontent.com/Kastow/Foxhole-Map-Tiles/master/Tiles/{z}/{z}_{x}_{y}.png" />
    <RegionBorders />
    <RegionTitles />
  </MapContainer>
);

const root = ReactDOM.createRoot(element);
root.render(<App />);
