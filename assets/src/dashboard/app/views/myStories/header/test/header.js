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
import Header from '..';

const fakeStories = [
  {
    id: 1,
    status: 'publish',
    title: 'Story A',
    pages: [{ id: '10' }],
    centerTargetAction: () => {},
    bottomTargetAction: 'https://example.com',
    editStoryLink: () => {},
  },
  {
    id: 2,
    status: 'draft',
    title: 'Story B',
    pages: [{ id: '20' }],
    centerTargetAction: () => {},
    bottomTargetAction: 'https://example.com',
    editStoryLink: () => {},
  },
  {
    id: 3,
    status: 'publish',
    title: 'Story C',
    pages: [{ id: '30' }],
    centerTargetAction: () => {},
    bottomTargetAction: 'https://example.com',
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
          search={{
            keyword: 'Harry Potter',
            setKeyword: jest.fn(),
          }}
          sort={{ value: STORY_SORT_OPTIONS.NAME, set: jest.fn() }}
          totalStoriesByStatus={{
            all: 19,
            draft: 9,
            future: 5,
            publish: 5,
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
    expect(
      getByText((_, node) => node.textContent === '19 results')
    ).toBeInTheDocument();
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
    const { queryByText, getByRole } = renderWithProviders(
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

    const allStoriesButton = getByRole('button', {
      name: /Filter stories by All Stories/,
    });

    const draftsButton = getByRole('button', {
      name: /Filter stories by Drafts/,
    });
    const publishedButton = getByRole('button', {
      name: /Filter stories by Published/,
    });

    expect(allStoriesButton).toHaveTextContent('All Stories19');
    expect(draftsButton).toHaveTextContent('Drafts9');
    expect(publishedButton).toHaveTextContent('Published10');

    expect(queryByText('Private')).not.toBeInTheDocument();
  });

  it('should show the private tab only when there are private stories.', function () {
    const { getByRole } = renderWithProviders(
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

    const allStoriesButton = getByRole('button', {
      name: /Filter stories by All Stories/,
    });

    const draftsButton = getByRole('button', {
      name: /Filter stories by Drafts/,
    });
    const publishedButton = getByRole('button', {
      name: /Filter stories by Published/,
    });
    const privateButton = getByRole('button', {
      name: /Filter stories by Private/,
    });

    expect(allStoriesButton).toHaveTextContent('All Stories19');
    expect(draftsButton).toHaveTextContent('Drafts9');
    expect(publishedButton).toHaveTextContent('Published10');
    expect(privateButton).toHaveTextContent('Private2');
  });

  it('should not show the private tab even if there are private stories when the user does not have permission.', function () {
    const { getByRole, queryByText } = renderWithProviders(
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
    const allStoriesButton = getByRole('button', {
      name: /Filter stories by All Stories/,
    });

    const draftsButton = getByRole('button', {
      name: /Filter stories by Drafts/,
    });
    const publishedButton = getByRole('button', {
      name: /Filter stories by Published/,
    });
    expect(allStoriesButton).toHaveTextContent('All Stories19');
    expect(draftsButton).toHaveTextContent('Drafts9');
    expect(publishedButton).toHaveTextContent('Published10');
    expect(queryByText('Private')).not.toBeInTheDocument();
  });

  it('should call the set keyword function when new text is searched', async function () {
    const setKeywordFn = jest.fn();
    const { getByPlaceholderText } = renderWithProviders(
      <LayoutProvider>
        <Header
          filter={STORY_STATUSES[0]}
          stories={fakeStories}
          search={{
            keyword: 'Harry Potter',
            setKeyword: setKeywordFn,
          }}
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
    const { getByLabelText, getByText } = renderWithProviders(
      <LayoutProvider>
        <Header
          filter={STORY_STATUSES[0]}
          stories={fakeStories}
          search={{
            keyword: 'Harry Potter',
            setKeyword: jest.fn(),
          }}
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
    fireEvent.click(getByLabelText('Choose sort option for display'));
    fireEvent.click(getByText('Last modified'));

    await waitFor(() => {
      expect(setSortFn).toHaveBeenCalledWith('modified');
    });
  });
});
