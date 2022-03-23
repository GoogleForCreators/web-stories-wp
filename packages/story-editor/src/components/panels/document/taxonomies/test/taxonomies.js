/*
 * Copyright 2020 Google LLC
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
import { screen } from '@testing-library/react';
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import TaxonomyContext from '../../../../../app/taxonomy/context';
import TaxonomiesPanel from '../taxonomies';
import { StoryContext } from '../../../../../app/story';

function arrange({ taxonomies, isCapable }) {
  const storyContextValue = {
    state: {
      capabilities: taxonomies.reduce((acc, curr) => {
        acc[`assign-${curr.slug}`] = isCapable;
        acc[`create-${curr.slug}`] = isCapable;
        return acc;
      }, {}),
    },
  };

  const taxonomyContextValue = {
    state: {
      taxonomies,
    },
    actions: {
      createTerm: jest.fn(),
      addSearchResultsToCache: jest.fn(() => new Promise((res) => res([]))),
      setSelectedTaxonomySlugs: jest.fn(),
    },
  };

  return renderWithTheme(
    <StoryContext.Provider value={storyContextValue}>
      <TaxonomyContext.Provider value={taxonomyContextValue}>
        <TaxonomiesPanel />
      </TaxonomyContext.Provider>
    </StoryContext.Provider>
  );
}

describe('TaxonomiesPanel', () => {
  beforeAll(() => {
    localStorage.setItem(
      'web_stories_ui_panel_settings:taxonomies',
      JSON.stringify({ isCollapsed: false })
    );
  });

  afterAll(() => {
    localStorage.clear();
  });

  it('should not render Taxonomies Panel if there are no taxonomies', () => {
    arrange({ taxonomies: [], isCapable: true });
    const element = screen.queryByRole('button', {
      name: 'Taxonomies',
    });
    expect(element).not.toBeInTheDocument();
  });

  it('should not render Taxonomies Panel if there are no visible or assignable taxonomies', () => {
    arrange({
      taxonomies: [
        {
          slug: 'web_story_tag',
          restBase: 'web_story_tag',
          name: 'Tags',
          labels: {},
          hierarchical: false,
        },
        {
          slug: 'web_story_category',
          restBase: 'web_story_category',
          name: 'Categories',
          labels: { notFound: '' },
          hierarchical: false,
        },
      ],
      isCapable: false,
    });
    const element = screen.queryByRole('button', {
      name: 'Taxonomies',
    });
    expect(element).not.toBeInTheDocument();
  });

  it('should render Taxonomies Panel', async () => {
    arrange({
      taxonomies: [
        {
          slug: 'web_story_tag',
          restBase: 'web_story_tag',
          name: 'Tags',
          labels: {},
          hierarchical: false,
          visibility: {
            show_ui: true,
          },
        },
        {
          slug: 'web_story_category',
          restBase: 'web_story_category',
          name: 'Categories',
          labels: {
            searchItems: 'Story Categories',
            addNewItem: 'Add New',
            notFound: '',
          },
          hierarchical: true,
          visibility: {
            show_ui: true,
          },
        },
      ],
      isCapable: true,
    });
    const element = await screen.findByRole('button', {
      name: 'Taxonomies',
    });
    expect(element).toBeInTheDocument();
  });
});
