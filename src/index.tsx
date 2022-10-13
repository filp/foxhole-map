import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { CRS, DivIcon, type LatLng, type LatLngExpression } from 'leaflet';
import {
  MapContainer,
  TileLayer,
  Polygon,
  LayerGroup,
  Marker,
  useMap,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import { Combobox } from '@headlessui/react';
import cn from 'classnames';
import useLocalStorage from 'use-local-storage';
import { v4 as uuidV4 } from 'uuid';

import { betterMapData, regionBorders, regions } from './map/regions';
import { searcher } from './map/search';
import { CodeIcon } from './icons';

const element = document.getElementById('app');

if (!element) {
  throw new Error('invariant: root element should be present');
}

const inputBaseKlass =
  'bg-stone-900 text-stone-200 w-full p-4 text-lg outline-none rounded border border-stone-700 shadow-inner';

const useZoomLevel = () => {
  const map = useMap();
  const [zoomLevel, setZoomLevel] = useState(map.getZoom());

  useMapEvents({
    zoom: () => setZoomLevel(map.getZoom()),
  });

  return [zoomLevel, setZoomLevel];
};

type UserMarkerMap = {
  [markerId: string]: {
    name: string;
    position: LatLng;
  };
};

const useUserMarkers = () => useLocalStorage<UserMarkerMap>('userMarkers', {});

const RegionBorders = () => (
  <LayerGroup>
    {regionBorders.map((borders, i) => (
      <Polygon
        positions={borders}
        key={i}
        pathOptions={{ color: 'black', opacity: 0.1, fillOpacity: 0 }}
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
  const [zoomLevel] = useZoomLevel();

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
                  iconAnchor: [95, 12],
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
  className,
}: React.PropsWithChildren<{
  onClick: () => void;
  className?: string;
}>) => (
  <button
    className={cn(
      'bg-stone-700 flex-1 text-white px-3 py-2 shadow-sm rounded border border-stone-600 hover:border-stone-500 hover:bg-stone-600 hover:shadow-lg',
      className || ''
    )}
    onClick={onClick}
  >
    {children}
  </button>
);

const LocationSearch = ({
  onFlyToLocation,
}: {
  onFlyToLocation: (coords: number[]) => void;
}) => {
  const [query, setQuery] = useState<string>();

  const filteredLocations =
    !query || query === '' ? [] : searcher.search(query).slice(0, 5);

  const inputKlass = cn(inputBaseKlass, {
    // Highlight the input if no results are available:
    'border-red-800': query && query !== '' && filteredLocations.length === 0,
  });

  return (
    <div>
      <Combobox onChange={(coords: number[]) => onFlyToLocation(coords)}>
        <Combobox.Input
          placeholder="Find location"
          onChange={(event) => setQuery(event.target.value)}
          className={inputKlass}
        />
        <Combobox.Options className="absolute bg-stone-800 shadow-sm rounded border border-stone-600 mt-1">
          {filteredLocations.map((location) => (
            <Combobox.Option
              key={location.text}
              value={location.position}
              className="text-stone-400 ui-active:text-white px-2 py-1"
            >
              {location.text}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox>
    </div>
  );
};

const MapGeneralEvents = () => {
  const map = useMap();
  useMapEvents({
    // Update the url to reflect the new position:
    moveend: () => {
      const center = map.getCenter();
      const newUrl = new URL(window.location.toString());

      // If we're centering the map, just remove all location params
      // from the url (if any):
      if (center.lat === -128 && center.lng === 128 && map.getZoom() === 2) {
        newUrl.searchParams.delete('lat');
        newUrl.searchParams.delete('lng');
        newUrl.searchParams.delete('z');

        window.history.replaceState(null, '', newUrl);
      } else {
        // Otherwise, update the history state with the new params:
        newUrl.searchParams.set('lat', center.lat.toString());
        newUrl.searchParams.set('lng', center.lng.toString());
        newUrl.searchParams.set('z', map.getZoom().toString());

        window.history.replaceState(null, '', newUrl.toString());
      }
    },
  });

  return null;
};

const UserMarkers = ({ userMarkers }: { userMarkers: UserMarkerMap }) => {
  const markers = Object.keys(userMarkers).map((markerId) => {
    const marker = userMarkers[markerId];

    return (
      <Marker key={markerId} position={marker.position} title={marker.name}>
        <Popup>{marker.name}</Popup>
      </Marker>
    );
  });

  return <LayerGroup>{markers}</LayerGroup>;
};

const UtilityPanel = ({
  onAddUserMarker,
}: {
  onAddUserMarker: (userMarker: UserMarkerMap[string]) => void;
}) => {
  const map = useMap();
  const markerNameRef = useRef<HTMLInputElement>(null);
  const [isWaitingForMarker, setIsWaitingForMarker] = useState(false);

  useMapEvents({
    click: (event) => {
      if (!isWaitingForMarker) return;
      onAddUserMarker({
        name: markerNameRef.current!.value || 'Unnamed Marker',
        position: event.latlng,
      });

      setIsWaitingForMarker(false);
    },
  });

  return (
    <div className="bg-stone-800 min-w-[380px] text-slate-100 p-4 absolute right-4 top-4 shadow-lg border border-stone-700 z-[999] flex flex-col gap-4">
      <div className="flex flex-row gap-1 items-center justify-items-stretch">
        <UtilityButton onClick={() => map.flyTo([-128, 128], map.getZoom())}>
          Center Map
        </UtilityButton>
        <UtilityButton onClick={() => map.flyTo([-128, 128], 2)}>
          Reset Map
        </UtilityButton>
      </div>
      <LocationSearch
        onFlyToLocation={(coords) => {
          map.flyTo(coords as LatLngExpression, 5);
        }}
      />
      <div className="border-t border-stone-600 pt-4">
        <input
          type="text"
          ref={markerNameRef}
          className={cn(inputBaseKlass, 'block mb-2')}
          placeholder="Marker name"
        />
        <UtilityButton
          onClick={() => {
            setIsWaitingForMarker(!isWaitingForMarker);
          }}
          className={cn({
            'border-red-600 bg-red-900': isWaitingForMarker,
          })}
        >
          {isWaitingForMarker ? 'Cancel' : 'Create marker'}
        </UtilityButton>
      </div>
      <div className="text-sm">
        <p>
          <a
            target="_blank"
            href="https://github.com/filp/foxhole-map"
            className="flex flex-row items-center gap-1"
          >
            <CodeIcon /> Contribute to foxhole-map on GitHub
          </a>
        </p>
      </div>
    </div>
  );
};

const App = () => {
  const [userMarkers, setUserMarkers] = useUserMarkers();
  const url = new URL(window.location.toString());

  const lat = url.searchParams.has('lat')
    ? parseInt(url.searchParams.get('lat')!)
    : -128;

  const lng = url.searchParams.has('lng')
    ? parseInt(url.searchParams.get('lng')!)
    : 128;

  const zoom = url.searchParams.has('z')
    ? parseInt(url.searchParams.get('z')!)
    : 2;

  return (
    <div className="w-screen h-screen">
      <MapContainer
        className="w-screen h-screen bg-stone-800"
        crs={CRS.Simple}
        center={[lat, lng]}
        zoom={zoom}
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
        <UtilityPanel
          onAddUserMarker={(newMarker) => {
            setUserMarkers({
              ...userMarkers,
              [uuidV4()]: newMarker,
            });
          }}
        />
        <MapGeneralEvents />
        <UserMarkers userMarkers={userMarkers} />
      </MapContainer>
    </div>
  );
};

const root = ReactDOM.createRoot(element);
root.render(<App />);
