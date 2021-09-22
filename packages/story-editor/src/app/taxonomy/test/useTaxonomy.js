/*
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * External dependencies
 */
import { renderHook, act } from '@testing-library/react-hooks';

/**
 * Internal dependencies
 */
import { useAPI } from '../../api';
import { useStory } from '../../story';
import cleanForSlug from '../../../utils/cleanForSlug';
import { TaxonomyProvider, useTaxonomy } from '..';

function mockResponse(...args) {
  return new Promise((r) => r(...args));
}

async function receiveQueuedMockedResponses() {
  // flush promise queue and resulting react updates
  await act(async () => {
    await new Promise((r) => r());
  });
}

jest.mock('../../story', () => ({
  __esModule: true,
  useStory: jest.fn(),
}));
jest.mock('../../api', () => ({
  __esModule: true,
  useAPI: jest.fn(),
}));

function createTaxonomy(slug, overrides) {
  return {
    slug,
    restBase: `${slug}s`,
    _links: {
      'wp:items': [{ href: 'someUrl' }],
    },
    ...overrides,
  };
}

let autoIncrementId = 0;
function createTermFromName(taxonomy, name, overrides) {
  return {
    id: autoIncrementId++,
    name,
    slug: cleanForSlug(name),
    taxonomy: taxonomy.slug,
    ...overrides,
  };
}

async function setup({ useStoryPartial = {}, useAPIPartial = {} }) {
  useAPI.mockImplementation(() => ({
    getTaxonomyTerm: () => mockResponse([]),
    createTaxonomyTerm: (_taxonomyEndpoint, { name, parent }) =>
      mockResponse(
        createTermFromName(createTaxonomy('fake restpoint response'), name, {
          parent,
        })
      ),
    getTaxonomies: () => mockResponse({}),
    ...useAPIPartial,
  }));
  useStory.mockImplementation(() => ({
    updateStory: () => {},
    isStoryLoaded: true,
    terms: [],
    hasTaxonomies: true,
    ...useStoryPartial,
  }));

  const render = renderHook(() => useTaxonomy(), { wrapper: TaxonomyProvider });
  await receiveQueuedMockedResponses();
  return render;
}

describe('TaxonomyProvider', () => {
  it('should fetch taxonomies on mount if taxonomies present on story', async () => {
    const sampleTaxonomy = createTaxonomy('sample');
    const getTaxonomiesMock = jest.fn(() => mockResponse([sampleTaxonomy]));

    const { result } = await setup({
      useAPIPartial: { getTaxonomies: getTaxonomiesMock },
      useStoryPartial: { hasTaxonomies: true },
    });

    expect(getTaxonomiesMock).toHaveBeenCalledTimes(1);
    expect(result.current.state.taxonomies).toStrictEqual([sampleTaxonomy]);
  });

  it('populates initial termCache and selected slugs with story terms', async () => {
    const taxonomy1 = createTaxonomy('taxonomy_1');
    const taxonomy2 = createTaxonomy('taxonomy_2');
    const taxonomiesResponse = [taxonomy1, taxonomy2];

    const taxonomy1Term1 = createTermFromName(taxonomy1, 'term1');
    const taxonomy1Term2 = createTermFromName(taxonomy1, 'term2');
    const taxonomy2Term1 = createTermFromName(taxonomy2, 'term1');
    const terms = [[taxonomy1Term1, taxonomy1Term2], [taxonomy2Term1]];

    const { result } = await setup({
      useAPIPartial: {
        getTaxonomies: () => mockResponse(taxonomiesResponse),
      },
      useStoryPartial: { terms, isStoryLoaded: true },
    });

    const { termCache, selectedSlugs, taxonomies } = result.current.state;
    expect(taxonomies).toHaveLength(2);
    expect(termCache).toStrictEqual({
      [taxonomy1.restBase]: {
        [taxonomy1Term1.slug]: taxonomy1Term1,
        [taxonomy1Term2.slug]: taxonomy1Term2,
      },
      [taxonomy2.restBase]: {
        [taxonomy2Term1.slug]: taxonomy2Term1,
      },
    });
    expect(selectedSlugs).toStrictEqual({
      [taxonomy1.restBase]: [taxonomy1Term1.slug, taxonomy1Term2.slug],
      [taxonomy2.restBase]: [taxonomy2Term1.slug],
    });
  });

  it('syncs selected slugs with story', async () => {
    const updateStoryMock = jest.fn();
    const sampleTaxonomy = createTaxonomy('sample');
    const taxonomiesResponse = [sampleTaxonomy];

    const { result } = await setup({
      useAPIPartial: {
        getTaxonomies: () => mockResponse(taxonomiesResponse),
      },
      useStoryPartial: {
        isStoryLoaded: true,
        updateStory: updateStoryMock,
        terms: [[]],
      },
    });

    // Update the terms
    act(() => {
      result.current.actions.setSelectedTaxonomySlugs(sampleTaxonomy, [
        'term1',
        'term2',
      ]);
    });

    // initially the slugs should be selected, but they won't have been
    // returned from the backend yet, so they shouldn't appear on the story
    // until we get them
    expect(result.current.state.selectedSlugs).toStrictEqual({
      [sampleTaxonomy.restBase]: ['term1', 'term2'],
    });
    expect(updateStoryMock).toHaveBeenCalledWith({
      properties: {
        terms: {
          [sampleTaxonomy.restBase]: [],
        },
      },
    });

    // Components are responsible for sending create term requests
    act(() => {
      // reset autoIncrementId so we know what the mocked
      // response will generate.
      autoIncrementId = 0;
      result.current.actions.createTerm(sampleTaxonomy, 'term1');
      result.current.actions.createTerm(sampleTaxonomy, 'term2');
    });

    await receiveQueuedMockedResponses();

    // Once we get responses from the backend, the cache should
    // be populated with the new terms and we should be able to
    // now associate the terms with the story
    expect(result.current.state.selectedSlugs).toStrictEqual({
      [sampleTaxonomy.restBase]: ['term1', 'term2'],
    });
    expect(updateStoryMock).toHaveBeenCalledWith({
      properties: {
        terms: {
          [sampleTaxonomy.restBase]: [0, 1],
        },
      },
    });
  });

  it('populates the terms cache when addSearchResultsToCache(..args) called', async () => {
    const sampleTaxonomy = createTaxonomy('sample');
    const taxonomiesResponse = { sampleTaxonomy };
    const term1 = createTermFromName(sampleTaxonomy, 'term1');
    const term2 = createTermFromName(sampleTaxonomy, 'term2');
    const getTaxonomyTermMock = jest.fn(() => mockResponse([term1, term2]));

    const { result } = await setup({
      useAPIPartial: {
        getTaxonomies: () => mockResponse(taxonomiesResponse),
        getTaxonomyTerm: getTaxonomyTermMock,
      },
      useStoryPartial: {
        isStoryLoaded: true,
      },
    });

    act(() => {
      result.current.actions.addSearchResultsToCache(sampleTaxonomy, {
        name: 'term',
      });
    });

    expect(getTaxonomyTermMock).toHaveBeenCalledWith('someUrl', {
      per_page: 20,
      search: 'term',
    });

    await receiveQueuedMockedResponses();

    expect(result.current.state.termCache).toStrictEqual({
      [sampleTaxonomy.restBase]: {
        [term1.slug]: term1,
        [term2.slug]: term2,
      },
    });
  });
});
