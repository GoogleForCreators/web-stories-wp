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
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { useAPI } from '../../api';
import { useStory } from '../../story';
import cleanForSlug from '../../../utils/cleanForSlug';
import { TaxonomyProvider, useTaxonomy } from '..';

jest.mock('../../story', () => ({
  __esModule: true,
  useStory: jest.fn(),
}));
jest.mock('../../api', () => ({
  __esModule: true,
  useAPI: jest.fn(),
}));

function createTaxonomyFromName(taxonomy, name, overrides) {
  return {
    id: uuidv4(),
    name,
    slug: cleanForSlug(name),
    taxonomy: taxonomy.slug,
    ...overrides,
  };
}

function setup({ useStoryPartial = {}, useAPIPartial = {} }) {
  useAPI.mockImplementation(() => ({
    getTaxonomyTerm: jest.fn(() => new Promise().resolve([])),
    createTaxonomyTerm: jest.fn((taxonomy, name) =>
      new Promise().resolve(createTaxonomyFromName(taxonomy, name))
    ),
    getTaxonomies: jest.fn(() => new Promise().resolve({})),
    ...useAPIPartial,
  }));
  useStory.mockImplementation(() => ({
    updateStory: () => {},
    isStoryLoaded: true,
    terms: [],
    hasTaxonomies: true,
    ...useStoryPartial,
  }));

  return renderHook(() => useTaxonomy(), { wrapper: TaxonomyProvider });
}

describe('useTaxonomy', () => {
  describe('fetching taxonomies', async () => {
    it('should fetch taxonomies on mount if taxonomies present on story', () => {
      const sampleTaxonomy = { slug: 'sample' };
      const getTaxonomiesMock = jest.fn(() =>
        new Promise().resolve({
          sampleTaxonomy,
        })
      );
      const updateStoryMock = jest.fn();

      const { rerender } = setup({
        useAPIPartial: { getTaxonomies: getTaxonomiesMock },
        useStoryPartial: { hasTaxonomies: true, updateStory: updateStoryMock },
      });
      // force effects to run
      // act(() => rerender());

      expect(getTaxonomiesMock).toHaveBeenCalledWith();
      await act(async () => await new Promise().resolve());
      expect(updateStoryMock).toHaveBeenCalledWith([sampleTaxonomy]);
      expect(1).toBe(3);
    });
  });

  it('does something', () => {
    useAPI();
    expect(useAPI).toHaveBeenCalledWith();
  });
});
