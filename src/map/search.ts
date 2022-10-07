import FuzzySearch from 'fuzzy-search';

import { betterMapData } from './regions';
import { regions } from './regions';

const haystack = [
  ...betterMapData.flatMap((m) =>
    m.textItems.map((ti) => ({
      text: ti.title,
      position: ti.position,
    }))
  ),
  ...regions.map((r) => ({
    text: r.name,
    position: r.center,
  })),
];

export const searcher = new FuzzySearch(haystack, ['text'], {
  caseSensitive: false,
});
