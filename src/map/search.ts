import FuzzySearch from 'fuzzy-search';

import uniqBy from 'lodash.uniqby';
import { betterMapData } from './regions';
import { regions } from './regions';

const replaceDiacritics = (input: string) =>
  input.replace('á', 'a').replace('ó', 'o').replace('í', 'i').replace('ý', 'y');

const haystack = [
  ...betterMapData.flatMap((m) =>
    m.textItems.map((ti) => ({
      text: replaceDiacritics(ti.title),
      position: ti.position,
    }))
  ),
  ...regions.map((r) => ({
    text: replaceDiacritics(r.name),
    position: r.center,
  })),
];

export const searcher = new FuzzySearch(uniqBy(haystack, 'text'), ['text'], {
  caseSensitive: false,
  sort: true,
});
