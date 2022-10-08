import FuzzySearch from 'fuzzy-search';

import uniqBy from 'lodash.uniqby';
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

export const searcher = new FuzzySearch(uniqBy(haystack, 'text'), ['text'], {
  caseSensitive: false,
  sort: true,
});
