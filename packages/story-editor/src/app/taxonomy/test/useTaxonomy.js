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
jest.mock('../../history', () => ({
  __esModule: true,
  useHistory: () => ({
    actions: { clearHistory: () => {} },
  }),
}));

function createTaxonomy(slug, overrides) {
  return {
    slug,
    restBase: `${slug}s`,
    restPath: 'someUrl',
    ...overrides,
  };
}

let autoIncrementId;

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
    actions: {
      getTaxonomyTerm: () => mockResponse([]),
      createTaxonomyTerm: (_taxonomyEndpoint, { name, parent }) =>
        mockResponse(
          createTermFromName(createTaxonomy('fake restpoint response'), name, {
            parent,
          })
        ),
      getTaxonomies: () => mockResponse({}),
      ...useAPIPartial,
    },
  }));
  useStory.mockImplementation(() => ({
    updateStory: () => {},
    isStoryLoaded: true,
    terms: [],
    ...useStoryPartial,
  }));

  const render = renderHook(() => useTaxonomy(), { wrapper: TaxonomyProvider });
  await receiveQueuedMockedResponses();
  return render;
}

describe('TaxonomyProvider', () => {
  beforeAll(() => {
    autoIncrementId = 0;
  });

  it('should fetch taxonomies on mount if taxonomies present on story', async () => {
    const sampleTaxonomy = createTaxonomy('sample');
    const getTaxonomiesMock = jest.fn(() => mockResponse([sampleTaxonomy]));

    const { result } = await setup({
      useAPIPartial: { getTaxonomies: getTaxonomiesMock },
    });

    expect(getTaxonomiesMock).toHaveBeenCalledOnce();
    expect(result.current.state.taxonomies).toStrictEqual([sampleTaxonomy]);
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
    });

    act(() => {
      result.current.actions.addSearchResultsToCache({
        taxonomy: sampleTaxonomy,
        args: {
          search: 'term',
          per_page: 20,
        },
      });
    });

    expect(getTaxonomyTermMock).toHaveBeenCalledWith('someUrl', {
      search: 'term',
      per_page: 20,
    });

    await receiveQueuedMockedResponses();

    expect(result.current.state.termCache).toStrictEqual([term1, term2]);
  });
});
