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
/**
 * Internal dependencies
 */
import { renderWithProviders } from '../../../../../testUtils';
import {
  STORY_SORT_OPTIONS,
  SORT_DIRECTION,
  VIEW_STYLE,
  STORY_STATUS,
} from '../../../../../constants';
import StoriesView from '../storiesView';
import { noop } from '../../../../../utils';

const fakeStories = [
  {
    id: 1,
    status: 'publish',
    title: 'Story A',
    pages: [{ id: '10', elements: [] }],
    bottomTargetAction: 'https://example.com',
    link: 'https://example.com',
    editStoryLink: 'https://example.com',
    previewLink: 'https://example.com',
    featuredMediaUrl: 'http://localhost:9876/__static__/featured-media-1.png',
    capabilities: {
      hasEditAction: true,
      hasDeleteAction: true,
    },
  },
  {
    id: 2,
    status: 'draft',
    title: 'Story B',
    pages: [{ id: '20', elements: [] }],
    bottomTargetAction: 'https://example.com',
    link: 'https://example.com',
    editStoryLink: 'https://example.com',
    previewLink: 'https://example.com',
    featuredMediaUrl: 'http://localhost:9876/__static__/featured-media-2.png',
    capabilities: {
      hasEditAction: true,
      hasDeleteAction: true,
    },
  },
  {
    id: 3,
    status: 'publish',
    title: 'Story C',
    pages: [{ id: '30', elements: [] }],
    bottomTargetAction: 'https://example.com',
    link: 'https://example.com',
    editStoryLink: 'https://example.com',
    previewLink: 'https://example.com',
    featuredMediaUrl: 'http://localhost:9876/__static__/featured-media-3.png',
    locked: true,
    lockUser: {
      name: 'Batgirl',
      id: 898978979879,
    },
    capabilities: {
      hasEditAction: true,
      hasDeleteAction: true,
    },
  },
];

describe('Dashboard <StoriesView />', function () {
  it(`should render stories as a grid when view is ${VIEW_STYLE.GRID}`, function () {
    renderWithProviders(
      <StoriesView
        filterValue={STORY_STATUS.ALL}
        sort={{
          value: STORY_SORT_OPTIONS.NAME,
          direction: SORT_DIRECTION.ASC,
          set: noop,
          setDirection: noop,
        }}
        storyActions={{
          duplicateStory: jest.fn,
          trashStory: jest.fn,
          updateStory: jest.fn,
        }}
        stories={fakeStories}
        view={{
          style: VIEW_STYLE.GRID,
          pageSize: {
            width: 210,
            height: 316,
          },
        }}
      />,
      {}
    );

    expect(screen.getAllByTestId(/^story-grid-item/)).toHaveLength(
      fakeStories.length
    );
  });

  describe('Loading stories', () => {
    it('should be able to hide the grid while the stories are loading', () => {
      renderWithProviders(
        <StoriesView
          filterValue={STORY_STATUS.ALL}
          sort={{
            value: STORY_SORT_OPTIONS.NAME,
            direction: SORT_DIRECTION.ASC,
            set: noop,
            setDirection: noop,
          }}
          storyActions={{
            duplicateStory: jest.fn,
            trashStory: jest.fn,
            updateStory: jest.fn,
          }}
          stories={fakeStories}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: {
              width: 210,
              height: 316,
            },
          }}
          loading={{
            isLoading: true,
            showStoriesWhileLoading: { current: false },
          }}
        />,
        {}
      );

      expect(screen.queryByTestId(/^story-grid-item/)).not.toBeInTheDocument();
    });

    it('should be able to show the grid while stories are loading', () => {
      renderWithProviders(
        <StoriesView
          filterValue={STORY_STATUS.ALL}
          sort={{
            value: STORY_SORT_OPTIONS.NAME,
            direction: SORT_DIRECTION.ASC,
            set: noop,
            setDirection: noop,
          }}
          storyActions={{
            duplicateStory: jest.fn,
            trashStory: jest.fn,
            updateStory: jest.fn,
          }}
          stories={fakeStories}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: {
              width: 210,
              height: 316,
            },
          }}
          loading={{
            isLoading: true,
            showStoriesWhileLoading: { current: true },
          }}
        />,
        {}
      );

      expect(screen.queryAllByTestId(/^story-grid-item/)).toHaveLength(
        fakeStories.length
      );
    });

    it('should hide stories in the list view when stories are loading', () => {
      renderWithProviders(
        <StoriesView
          filterValue={STORY_STATUS.ALL}
          sort={{
            value: STORY_SORT_OPTIONS.NAME,
            direction: SORT_DIRECTION.ASC,
            set: noop,
            setDirection: noop,
          }}
          storyActions={{
            duplicateStory: jest.fn,
            trashStory: jest.fn,
            updateStory: jest.fn,
          }}
          stories={fakeStories}
          view={{
            style: VIEW_STYLE.LIST,
            pageSize: {
              width: 210,
              height: 316,
            },
          }}
          loading={{
            isLoading: true,
            showStoriesWhileLoading: { current: false },
          }}
        />,
        {}
      );

      expect(screen.queryByTestId(/^story-list-item/)).not.toBeInTheDocument();
    });

    it('should be able to show the list while stories are loading', () => {
      renderWithProviders(
        <StoriesView
          filterValue={STORY_STATUS.ALL}
          sort={{
            value: STORY_SORT_OPTIONS.NAME,
            direction: SORT_DIRECTION.ASC,
            set: noop,
            setDirection: noop,
          }}
          storyActions={{
            duplicateStory: jest.fn,
            trashStory: jest.fn,
            updateStory: jest.fn,
          }}
          stories={fakeStories}
          view={{
            style: VIEW_STYLE.LIST,
            pageSize: {
              width: 210,
              height: 316,
            },
          }}
          loading={{
            isLoading: true,
            showStoriesWhileLoading: { current: true },
          }}
        />,
        {}
      );

      expect(screen.queryAllByTestId(/^story-list-item/)).toHaveLength(
        fakeStories.length
      );
    });
  });

  describe('Locked story', () => {
    it('should show a lock icon and helpful tooltip and aria text in list view when a story is being edited by another user', function () {
      renderWithProviders(
        <StoriesView
          filterValue={STORY_STATUS.ALL}
          sort={{
            value: STORY_SORT_OPTIONS.NAME,
            direction: SORT_DIRECTION.ASC,
            set: noop,
            setDirection: noop,
          }}
          storyActions={{
            duplicateStory: jest.fn,
            trashStory: jest.fn,
            updateStory: jest.fn,
          }}
          stories={fakeStories}
          view={{
            style: VIEW_STYLE.LIST,
            pageSize: {
              width: 210,
              height: 316,
            },
          }}
        />,
        {
          features: {
            enablePostLocking: true,
          },
        },
        {}
      );

      expect(screen.getAllByTestId(/^story-list-item/)).toHaveLength(
        fakeStories.length
      );

      const lockedStoryTitle = screen.getByText('Story C');
      expect(lockedStoryTitle).toContainHTML(
        `${fakeStories[2].title} (locked by ${fakeStories[2].lockUser.name})`
      );
    });
  });
});
