import type { LatLngExpression } from 'leaflet';
import mapData from './mapData.json';
import roadData from './roads.json';

const mapBounds = [
  [-228, 0],
  [-28, 256],
];

const mapWidth = mapBounds[1][1] - mapBounds[0][1];
const mapOrigin = { x: 128, y: -128 };
const regionWidth = mapWidth / 6.06;
const regionHeight = (regionWidth * Math.sqrt(3)) / 2;

export const regions = [
  { id: 3, name: 'Deadlands', center: [mapOrigin.y, mapOrigin.x] },
  {
    id: 4,
    name: 'Callahans Passage',
    center: [mapOrigin.y + regionHeight, mapOrigin.x],
  },
  {
    id: 5,
    name: 'Marban Hollow',
    center: [
      mapOrigin.y + 0.5 * regionHeight,
      mapOrigin.x + 0.75 * regionWidth,
    ],
  },
  {
    id: 6,
    name: 'Umbral Wildwood',
    center: [mapOrigin.y - regionHeight, mapOrigin.x],
  },
  {
    id: 7,
    name: 'The Moors',
    center: [
      mapOrigin.y + 1.5 * regionHeight,
      mapOrigin.x - 0.75 * regionWidth,
    ],
  },
  {
    id: 8,
    name: 'The Heartlands',
    center: [
      mapOrigin.y - 1.5 * regionHeight,
      mapOrigin.x - 0.75 * regionWidth,
    ],
  },
  {
    id: 9,
    name: 'Loch Mór',
    center: [
      mapOrigin.y - 0.5 * regionHeight,
      mapOrigin.x - 0.75 * regionWidth,
    ],
  },
  {
    id: 10,
    name: 'The Linn of Mercy',
    center: [
      mapOrigin.y + 0.5 * regionHeight,
      mapOrigin.x - 0.75 * regionWidth,
    ],
  },
  {
    id: 11,
    name: 'Reaching Trail',
    center: [mapOrigin.y + 2 * regionHeight, mapOrigin.x],
  },
  {
    id: 12,
    name: 'Stonecradle',
    center: [mapOrigin.y + regionHeight, mapOrigin.x - 1.5 * regionWidth],
  },
  {
    id: 13,
    name: 'Farranac Coast',
    center: [mapOrigin.y, mapOrigin.x - 1.5 * regionWidth],
  },
  {
    id: 14,
    name: 'Westgate',
    center: [mapOrigin.y - regionHeight, mapOrigin.x - 1.5 * regionWidth],
  },
  {
    id: 15,
    name: "Fisherman's Row",
    center: [
      mapOrigin.y - 0.5 * regionHeight,
      mapOrigin.x - 2.25 * regionWidth,
    ],
  },
  {
    id: 16,
    name: 'The Oarbreaker Isles',
    center: [
      mapOrigin.y + 0.5 * regionHeight,
      mapOrigin.x - 2.25 * regionWidth,
    ],
  },
  {
    id: 17,
    name: 'Great March',
    center: [mapOrigin.y - 2 * regionHeight, mapOrigin.x],
  },
  {
    id: 18,
    name: 'Tempest Island',
    center: [
      mapOrigin.y - 0.5 * regionHeight,
      mapOrigin.x + 2.25 * regionWidth,
    ],
  },
  {
    id: 19,
    name: 'Godcrofts',
    center: [
      mapOrigin.y + 0.5 * regionHeight,
      mapOrigin.x + 2.25 * regionWidth,
    ],
  },
  {
    id: 20,
    name: 'Endless Shore',
    center: [mapOrigin.y, mapOrigin.x + 1.5 * regionWidth],
  },
  {
    id: 21,
    name: "Allod's Bight",
    center: [mapOrigin.y - regionHeight, mapOrigin.x + 1.5 * regionWidth],
  },
  {
    id: 22,
    name: 'Weathered Expanse',
    center: [mapOrigin.y + regionHeight, mapOrigin.x + 1.5 * regionWidth],
  },
  {
    id: 23,
    name: 'The Drowned Vale',
    center: [
      mapOrigin.y - 0.5 * regionHeight,
      mapOrigin.x + 0.75 * regionWidth,
    ],
  },
  {
    id: 24,
    name: 'Shackled Chasm',
    center: [
      mapOrigin.y - 1.5 * regionHeight,
      mapOrigin.x + 0.75 * regionWidth,
    ],
  },
  {
    id: 25,
    name: 'Viper Pit',
    center: [
      mapOrigin.y + 1.5 * regionHeight,
      mapOrigin.x + 0.75 * regionWidth,
    ],
  },
  {
    id: 29,
    name: 'Nevish Line',
    center: [
      mapOrigin.y + 1.5 * regionHeight,
      mapOrigin.x - 2.25 * regionWidth,
    ],
  },
  {
    id: 30,
    name: 'Acrithia',
    center: [
      mapOrigin.y - 2.5 * regionHeight,
      mapOrigin.x + 0.75 * regionWidth,
    ],
  },
  {
    id: 31,
    name: 'Red River',
    center: [
      mapOrigin.y - 2.5 * regionHeight,
      mapOrigin.x - 0.75 * regionWidth,
    ],
  },
  {
    id: 32,
    name: "Callum's Cape",
    center: [mapOrigin.y + 2 * regionHeight, mapOrigin.x - 1.5 * regionWidth],
  },
  {
    id: 33,
    name: 'Speaking Woods',
    center: [
      mapOrigin.y + 2.5 * regionHeight,
      mapOrigin.x - 0.75 * regionWidth,
    ],
  },
  {
    id: 34,
    name: 'Basin Sionnach',
    center: [mapOrigin.y + 3 * regionHeight, mapOrigin.x],
  },
  {
    id: 35,
    name: 'Howl County',
    center: [
      mapOrigin.y + 2.5 * regionHeight,
      mapOrigin.x + 0.75 * regionWidth,
    ],
  },
  {
    id: 36,
    name: 'Clanshead Valley',
    center: [mapOrigin.y + 2 * regionHeight, mapOrigin.x + 1.5 * regionWidth],
  },
  {
    id: 37,
    name: 'Morgens Crossing',
    center: [
      mapOrigin.y + 1.5 * regionHeight,
      mapOrigin.x + 2.25 * regionWidth,
    ],
  },
  {
    id: 38,
    name: 'The Fingers',
    center: [
      mapOrigin.y - 1.5 * regionHeight,
      mapOrigin.x + 2.25 * regionWidth,
    ],
  },
  {
    id: 39,
    name: 'Terminus',
    center: [mapOrigin.y - 2 * regionHeight, mapOrigin.x + 1.5 * regionWidth],
  },
  {
    id: 40,
    name: 'Kalokai',
    center: [mapOrigin.y - 3 * regionHeight, mapOrigin.x],
  },
  {
    id: 41,
    name: 'Ash Fields',
    center: [mapOrigin.y - 2 * regionHeight, mapOrigin.x - 1.5 * regionWidth],
  },
  {
    id: 42,
    name: 'Origin',
    center: [
      mapOrigin.y - 1.5 * regionHeight,
      mapOrigin.x - 2.25 * regionWidth,
    ],
  },
];

export const regionBorders = regions.map(
  (region) =>
    [
      [region.center[0], region.center[1] - regionWidth / 2],
      [region.center[0] + regionHeight / 2, region.center[1] - regionWidth / 4],
      [region.center[0] + regionHeight / 2, region.center[1] + regionWidth / 4],
      [region.center[0], region.center[1] + regionWidth / 2],
      [region.center[0] - regionHeight / 2, region.center[1] + regionWidth / 4],
      [region.center[0] - regionHeight / 2, region.center[1] - regionWidth / 4],
    ] as LatLngExpression[]
);

const convertRegionCoords = (regionId: number, x: number, y: number) => {
  const region = regions.find((x) => x.id === regionId);

  if (!region) {
    throw new Error(`invariant: invalid region id ${regionId}`);
  }

  const xC = region.center[0] - regionWidth / 2 + regionWidth * x;
  const yC = region.center[1] + regionHeight / 2 - regionHeight * y;

  return [xC, yC];
};

// TODO: commit this to json file:
export const betterMapData = mapData.map((md) => ({
  id: md.regionId,
  textItems: md.mapTextItems.map((ti) => ({
    title: ti.text,
    type: ti.mapMarkerType,
    position: convertRegionCoords(md.regionId, ti.x, ti.y),
  })),
}));

// TODO: commit this to json file:
export const rawRoadData = roadData.map((p) => [
  -140 + p[1] * -0.12,
  107 + p[0] * 0.12,
]);

console.log(rawRoadData);
