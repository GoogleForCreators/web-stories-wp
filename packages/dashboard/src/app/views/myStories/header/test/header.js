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
import { fireEvent, waitFor, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import {
  STORY_SORT_OPTIONS,
  VIEW_STYLE,
  STORY_STATUS,
} from '../../../../../constants';
import LayoutProvider from '../../../../../components/layout/provider';
import { renderWithProviders } from '../../../../../testUtils';
import Header from '..';
import useStoryFilters from '../../filters/useStoryFilters';

jest.mock('../../filters/useStoryFilters', () => ({
  ...jest.requireActual('../../filters/useStoryFilters'),
  __esModule: true,
  default: jest.fn(),
}));

const mockUseStoryFilters = useStoryFilters;

const fakeStories = [
  {
    id: 1,
    status: 'publish',
    title: 'Story A',
    pages: [{ id: '10' }],
    bottomTargetAction: 'https://example.com',
    editStoryLink: () => {},
  },
  {
    id: 2,
    status: 'draft',
    title: 'Story B',
    pages: [{ id: '20' }],
    bottomTargetAction: 'https://example.com',
    editStoryLink: () => {},
  },
  {
    id: 3,
    status: 'publish',
    title: 'Story C',
    pages: [{ id: '30' }],
    bottomTargetAction: 'https://example.com',
    editStoryLink: () => {},
  },
];

jest.mock('../../../../api/useApi', () => {
  const getTaxonomies = () => {
    return Promise.resolve([]);
  };
  const getTaxonomyTerms = () => {
    return Promise.resolve([]);
  };
  return {
    __esModule: true,
    default: function useApi() {
      return {
        getTaxonomies,
        getTaxonomyTerms,
      };
    },
  };
});

const updateSort = jest.fn();
const updateFilter = jest.fn();

const mockFilterState = {
  filters: [
    {
      key: 'status',
      filterId: STORY_STATUS.ALL,
    },
  ],
  filtersObject: {},
  sortObject: {
    orderby: STORY_SORT_OPTIONS.DATE_CREATED,
  },
  registerFilters: () => {},
  updateFilter,
  updateSort,
};

describe('Dashboard <Header />', function () {
  beforeEach(() => {
    mockUseStoryFilters.mockImplementation(() => mockFilterState);
  });

  it('should have results label that says "Viewing all stories" on initial page view', function () {
    renderWithProviders(
      <LayoutProvider>
        <Header
          stories={fakeStories}
          totalStoriesByStatus={{
            all: 19,
            draft: 9,
            [STORY_STATUS.PUBLISH]: 10,
          }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
          initialPageReady
        />
      </LayoutProvider>
    );
    expect(screen.getByText('Viewing all stories')).toBeInTheDocument();
  });

  it('should have results label that says "Viewing drafts" when filter is set to drafts', function () {
    mockUseStoryFilters.mockImplementation(() => ({
      ...mockFilterState,
      filters: [{ key: 'status', filterId: STORY_STATUS.DRAFT }],
    }));
    renderWithProviders(
      <LayoutProvider>
        <Header
          stories={fakeStories}
          totalStoriesByStatus={{
            all: 19,
            draft: 9,
            [STORY_STATUS.PUBLISH]: 10,
          }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
          initialPageReady
        />
      </LayoutProvider>
    );
    expect(screen.getByText('Viewing drafts')).toBeInTheDocument();
  });

  it('should have 3 toggle buttons, one for each status that say how many items belong to that status', function () {
    renderWithProviders(
      <LayoutProvider>
        <Header
          stories={fakeStories}
          totalStoriesByStatus={{
            all: 19,
            [STORY_STATUS.DRAFT]: 9,
            [STORY_STATUS.PUBLISH]: 10,
            [STORY_STATUS.FUTURE]: 10,
          }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
          initialPageReady
        />
      </LayoutProvider>
    );

    const allStoriesButton = screen.getByRole('button', {
      name: /Filter stories by All Stories/,
    });

    const draftsButton = screen.getByRole('button', {
      name: /Filter stories by Drafts/,
    });
    const publishedButton = screen.getByRole('button', {
      name: /Filter stories by Published/,
    });

    const scheduledButton = screen.getByRole('button', {
      name: /Filter stories by Scheduled/,
    });

    expect(allStoriesButton).toHaveTextContent('All Stories19');
    expect(draftsButton).toHaveTextContent('Drafts9');
    expect(publishedButton).toHaveTextContent('Published10');
    expect(scheduledButton).toHaveTextContent('Scheduled10');

    expect(screen.queryByText('Private')).not.toBeInTheDocument();
  });

  it('should show the private tab only when there are private stories.', function () {
    renderWithProviders(
      <LayoutProvider>
        <Header
          stories={fakeStories}
          sort={{ value: STORY_SORT_OPTIONS.NAME, set: jest.fn() }}
          totalStoriesByStatus={{
            all: 19,
            draft: 9,
            private: 2,
            [STORY_STATUS.PUBLISH]: 10,
          }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
          initialPageReady
        />
      </LayoutProvider>
    );

    const allStoriesButton = screen.getByRole('button', {
      name: /Filter stories by All Stories/,
    });

    const draftsButton = screen.getByRole('button', {
      name: /Filter stories by Drafts/,
    });
    const publishedButton = screen.getByRole('button', {
      name: /Filter stories by Published/,
    });
    const privateButton = screen.getByRole('button', {
      name: /Filter stories by Private/,
    });

    expect(allStoriesButton).toHaveTextContent('All Stories19');
    expect(draftsButton).toHaveTextContent('Drafts9');
    expect(publishedButton).toHaveTextContent('Published10');
    expect(privateButton).toHaveTextContent('Private2');
  });

  it('should not show the private tab even if there are private stories when the user does not have permission.', function () {
    renderWithProviders(
      <LayoutProvider>
        <Header
          stories={fakeStories}
          sort={{ value: STORY_SORT_OPTIONS.NAME, set: jest.fn() }}
          totalStoriesByStatus={{
            all: 19,
            draft: 9,
            [STORY_STATUS.PUBLISH]: 10,
          }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
          initialPageReady
        />
      </LayoutProvider>
    );
    const allStoriesButton = screen.getByRole('button', {
      name: /Filter stories by All Stories/,
    });

    const draftsButton = screen.getByRole('button', {
      name: /Filter stories by Drafts/,
    });
    const publishedButton = screen.getByRole('button', {
      name: /Filter stories by Published/,
    });
    expect(allStoriesButton).toHaveTextContent('All Stories19');
    expect(draftsButton).toHaveTextContent('Drafts9');
    expect(publishedButton).toHaveTextContent('Published10');
    expect(screen.queryByText('Private')).not.toBeInTheDocument();
  });

  it('should call the set keyword function when new text is searched', async function () {
    renderWithProviders(
      <LayoutProvider>
        <Header
          stories={fakeStories}
          sort={{ value: STORY_SORT_OPTIONS.NAME, set: jest.fn() }}
          totalStoriesByStatus={{
            all: 19,
            draft: 9,
            [STORY_STATUS.PUBLISH]: 10,
          }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
          initialPageReady
        />
      </LayoutProvider>
    );
    fireEvent.change(screen.getByPlaceholderText('Search Stories'), {
      target: { value: 'Hermione Granger' },
    });
    await waitFor(() => {
      expect(updateFilter).toHaveBeenCalledWith('search', {
        filterId: 'Hermione Granger',
      });
    });
  });

  it('should call the set sort function when a new sort is selected', async function () {
    renderWithProviders(
      <LayoutProvider>
        <Header
          stories={fakeStories}
          totalStoriesByStatus={{
            all: 19,
            draft: 9,
            [STORY_STATUS.PUBLISH]: 10,
          }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
          initialPageReady
        />
      </LayoutProvider>
    );
    fireEvent.click(screen.getByLabelText('Choose sort option for display'));
    fireEvent.click(screen.getByText('Last Modified'));

    await waitFor(() => {
      expect(updateSort).toHaveBeenCalledWith({ orderby: 'modified' });
    });
  });
});
