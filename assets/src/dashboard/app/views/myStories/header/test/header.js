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
import { fireEvent, waitFor } from '@testing-library/react';

/**
 * Internal dependencies
 */
import {
  STORY_SORT_OPTIONS,
  VIEW_STYLE,
  STORY_STATUS,
  STORY_STATUSES,
} from '../../../../../constants';
import LayoutProvider from '../../../../../components/layout/provider';
import { renderWithProviders } from '../../../../../testUtils';
import Header from '../';

const fakeStories = [
  {
    id: 1,
    status: 'publish',
    title: 'Story A',
    pages: [{ id: '10' }],
    centerTargetAction: () => {},
    bottomTargetAction: () => {},
    editStoryLink: () => {},
  },
  {
    id: 2,
    status: 'draft',
    title: 'Story B',
    pages: [{ id: '20' }],
    centerTargetAction: () => {},
    bottomTargetAction: () => {},
    editStoryLink: () => {},
  },
  {
    id: 3,
    status: 'publish',
    title: 'Story C',
    pages: [{ id: '30' }],
    centerTargetAction: () => {},
    bottomTargetAction: () => {},
    editStoryLink: () => {},
  },
];

describe('My Stories <Header />', function () {
  it('should have results label that says "Viewing all stories" on initial page view', function () {
    const { getByText } = renderWithProviders(
      <LayoutProvider>
        <Header
          filter={STORY_STATUSES[0]}
          stories={fakeStories}
          search={{ keyword: '', setKeyword: jest.fn() }}
          sort={{ value: STORY_SORT_OPTIONS.NAME, set: jest.fn() }}
          totalStoriesByStatus={{
            all: 19,
            draft: 9,
            [STORY_STATUS.PUBLISHED_AND_FUTURE]: 10,
          }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
          wpListURL="fakeurltoWordPressList.com"
        />
      </LayoutProvider>
    );
    expect(getByText('Viewing all stories')).toBeInTheDocument();
  });

  it('should render with the correct count label and search keyword.', function () {
    const { getByPlaceholderText, getByText } = renderWithProviders(
      <LayoutProvider>
        <Header
          filter={STORY_STATUSES[0]}
          stories={fakeStories}
          search={{ keyword: 'Harry Potter', setKeyword: jest.fn() }}
          sort={{ value: STORY_SORT_OPTIONS.NAME, set: jest.fn() }}
          totalStoriesByStatus={{
            all: 19,
            draft: 9,
            [STORY_STATUS.PUBLISHED_AND_FUTURE]: 10,
          }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
          wpListURL="fakeurltoWordPressList.com"
        />
      </LayoutProvider>
    );
    expect(getByPlaceholderText('Search Stories')).toHaveValue('Harry Potter');
    expect(getByText('19 results')).toBeInTheDocument();
  });

  it('should have results label that says "Viewing drafts" when filter is set to drafts', function () {
    const { getByText } = renderWithProviders(
      <LayoutProvider>
        <Header
          filter={{ status: 'DRAFT', value: STORY_STATUS.DRAFT }}
          stories={fakeStories}
          search={{ keyword: '', setKeyword: jest.fn() }}
          sort={{ value: STORY_SORT_OPTIONS.NAME, set: jest.fn() }}
          totalStoriesByStatus={{
            all: 19,
            draft: 9,
            [STORY_STATUS.PUBLISHED_AND_FUTURE]: 10,
          }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
          wpListURL="fakeurltoWordPressList.com"
        />
      </LayoutProvider>
    );
    expect(getByText('Viewing drafts')).toBeInTheDocument();
  });

  it('should have 3 toggle buttons, one for each status that say how many items belong to that status', function () {
    const { getByText, queryByText } = renderWithProviders(
      <LayoutProvider>
        <Header
          filter={STORY_STATUSES[0]}
          stories={fakeStories}
          search={{ keyword: '', setKeyword: jest.fn() }}
          sort={{ value: STORY_SORT_OPTIONS.NAME, set: jest.fn() }}
          totalStoriesByStatus={{
            all: 19,
            draft: 9,
            [STORY_STATUS.PUBLISHED_AND_FUTURE]: 10,
          }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
          wpListURL="fakeurltoWordPressList.com"
        />
      </LayoutProvider>
    );
    expect(getByText('All Stories (19)')).toBeInTheDocument();
    expect(getByText('Drafts (9)')).toBeInTheDocument();
    expect(getByText('Published (10)')).toBeInTheDocument();
    expect(queryByText('Private')).not.toBeInTheDocument();
  });

  it('should show the private tab only when there are private stories.', function () {
    const { getByText } = renderWithProviders(
      <LayoutProvider>
        <Header
          filter={STORY_STATUSES[0]}
          stories={fakeStories}
          search={{ keyword: '', setKeyword: jest.fn() }}
          sort={{ value: STORY_SORT_OPTIONS.NAME, set: jest.fn() }}
          totalStoriesByStatus={{
            all: 19,
            draft: 9,
            private: 2,
            [STORY_STATUS.PUBLISHED_AND_FUTURE]: 10,
          }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
          wpListURL="fakeurltoWordPressList.com"
        />
      </LayoutProvider>
    );
    expect(getByText('All Stories (19)')).toBeInTheDocument();
    expect(getByText('Drafts (9)')).toBeInTheDocument();
    expect(getByText('Published (10)')).toBeInTheDocument();
    expect(getByText('Private (2)')).toBeInTheDocument();
  });

  it('should not show the private tab even if there are private stories when the user does not have permission.', function () {
    const { getByText, queryByText } = renderWithProviders(
      <LayoutProvider>
        <Header
          filter={STORY_STATUSES[0]}
          stories={fakeStories}
          search={{ keyword: '', setKeyword: jest.fn() }}
          sort={{ value: STORY_SORT_OPTIONS.NAME, set: jest.fn() }}
          totalStoriesByStatus={{
            all: 19,
            draft: 9,
            private: 2,
            [STORY_STATUS.PUBLISHED_AND_FUTURE]: 10,
          }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
          wpListURL="fakeurltoWordPressList.com"
        />
      </LayoutProvider>,
      {
        config: {
          capabilities: { canReadPrivatePosts: false },
        },
      }
    );
    expect(getByText('All Stories (19)')).toBeInTheDocument();
    expect(getByText('Drafts (9)')).toBeInTheDocument();
    expect(getByText('Published (10)')).toBeInTheDocument();
    expect(queryByText('Private')).not.toBeInTheDocument();
  });

  it('should call the set keyword function when new text is searched', async function () {
    const setKeywordFn = jest.fn();
    const { getByPlaceholderText } = renderWithProviders(
      <LayoutProvider>
        <Header
          filter={STORY_STATUSES[0]}
          stories={fakeStories}
          search={{ keyword: 'Harry Potter', setKeyword: setKeywordFn }}
          sort={{ value: STORY_SORT_OPTIONS.NAME, set: jest.fn() }}
          totalStoriesByStatus={{
            all: 19,
            draft: 9,
            [STORY_STATUS.PUBLISHED_AND_FUTURE]: 10,
          }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
          wpListURL="fakeurltoWordPressList.com"
        />
      </LayoutProvider>
    );
    fireEvent.change(getByPlaceholderText('Search Stories'), {
      target: { value: 'Hermione Granger' },
    });
    await waitFor(() => {
      expect(setKeywordFn).toHaveBeenCalledWith('Hermione Granger');
    });
  });

  it('should call the set sort function when a new sort is selected', async function () {
    const setSortFn = jest.fn();
    const { getAllByText, getByText } = renderWithProviders(
      <LayoutProvider>
        <Header
          filter={STORY_STATUSES[0]}
          stories={fakeStories}
          search={{ keyword: 'Harry Potter', setKeyword: jest.fn() }}
          sort={{ value: STORY_SORT_OPTIONS.CREATED_BY, set: setSortFn }}
          totalStoriesByStatus={{
            all: 19,
            draft: 9,
            [STORY_STATUS.PUBLISHED_AND_FUTURE]: 10,
          }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300 },
          }}
          wpListURL="fakeurltoWordPressList.com"
        />
      </LayoutProvider>
    );
    fireEvent.click(getAllByText('Created by')[0].parentElement);
    fireEvent.click(getByText('Last modified'));

    await waitFor(() => {
      expect(setSortFn).toHaveBeenCalledWith('modified');
    });
  });
});
