import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { CRS, DivIcon, type LatLngExpression } from 'leaflet';
import {
  MapContainer,
  TileLayer,
  Polygon,
  LayerGroup,
  Marker,
  useMap,
  Popup,
} from 'react-leaflet';

import { betterMapData, regionBorders, regions } from './map/regions';

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
            html: `<span class="text-base">${region.name}</span>`,
          })
        }
      ></Marker>
    ))}
  </LayerGroup>
);

const StaticMapData = () => {
  const map = useMap();
  const [zoomLevel, setZoomLevel] = useState(map.getZoom());

  useEffect(() => {
    map.on('zoom', () => {
      setZoomLevel(map.getZoom());
    });
  }, []);

  if (zoomLevel < 5) {
    return null;
  }

  return (
    <>
      {betterMapData.map((region) => (
        <LayerGroup key={region.id}>
          {region.textItems.map((ti, x) => (
            <Marker
              key={`${region.id}/${ti.title}/${x}`}
              position={ti.position as LatLngExpression}
              title={ti.title}
              icon={
                new DivIcon({
                  iconSize: [150, 20],
                  iconAnchor: [75, 15],
                  html: `<span class="text-sm">${ti.title}</span>`,
                })
              }
            >
              <Popup>HELLLO {ti.title}</Popup>
            </Marker>
          ))}
        </LayerGroup>
      ))}
    </>
  );
};

const UtilityButton = ({
  onClick,
  children,
}: React.PropsWithChildren<{
  onClick: () => void;
}>) => (
  <button
    className="bg-stone-700 flex-1 text-white px-3 py-2 shadow-sm rounded border border-stone-600 hover:border-stone-500 hover:bg-stone-600 hover:shadow-lg"
    onClick={onClick}
  >
    {children}
  </button>
);

const UtilityPanel = () => {
  const map = useMap();

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
  };

  return (
    <div className="bg-stone-800 min-w-[320px] text-slate-100 p-4 absolute right-4 top-4 shadow-lg border border-stone-700 z-[999] flex flex-col gap-2">
      <div className="flex flex-row gap-1 items-center justify-items-stretch">
        <UtilityButton onClick={() => map.flyTo([-128, 128], map.getZoom())}>
          Center Map
        </UtilityButton>
        <UtilityButton onClick={() => map.flyTo([-128, 128], 2)}>
          Reset Map
        </UtilityButton>
      </div>
      <div>
        <input
          type="text"
          tabIndex={1}
          className="bg-stone-900 text-stone-200 w-full p-4 text-lg outline-none rounded border border-stone-700 shadow-inner"
          placeholder="Find location..."
          onChange={onSearchChange}
        />
      </div>
    </div>
  );
};

const App = () => (
  <div className="w-screen h-screen">
    <MapContainer
      className="w-screen h-screen bg-stone-800"
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
      <StaticMapData />
      <UtilityPanel />
    </MapContainer>
  </div>
);

const root = ReactDOM.createRoot(element);
root.render(<App />);
