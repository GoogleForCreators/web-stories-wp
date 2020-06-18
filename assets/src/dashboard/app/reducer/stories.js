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
 * Internal dependencies
 */
import groupBy from '../../utils/groupBy';

export const ACTION_TYPES = {
  CREATING_STORY_FROM_TEMPLATE: 'creating_story_from_template',
  CREATE_STORY_FROM_TEMPLATE_SUCCESS: 'create_story_from_template_success',
  CREATE_STORY_FROM_TEMPLATE_FAILURE: 'create_story_from_template_failure',
  LOADING_STORIES: 'loading_stories',
  FETCH_STORIES_SUCCESS: 'fetch_stories_success',
  FETCH_STORIES_FAILURE: 'fetch_stories_failure',
  UPDATE_STORY: 'update_story',
  TRASH_STORY: 'trash_story',
  DUPLICATE_STORY: 'duplicate_story',
};

export const defaultStoriesState = {
  error: {},
  isLoading: false,
  stories: {},
  storiesOrderById: [],
  totalStoriesByStatus: {},
  totalPages: null,
};

function storyReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.LOADING_STORIES:
    case ACTION_TYPES.CREATING_STORY_FROM_TEMPLATE: {
      return {
        ...state,
        isLoading: action.payload,
      };
    }

    case ACTION_TYPES.CREATE_STORY_FROM_TEMPLATE_FAILURE:
    case ACTION_TYPES.FETCH_STORIES_FAILURE: {
      return {
        ...state,
        error: action.payload,
      };
    }

    case ACTION_TYPES.CREATE_STORY_FROM_TEMPLATE_SUCCESS: {
      return {
        ...state,
        error: {},
      };
    }

    case ACTION_TYPES.UPDATE_STORY:
      return {
        ...state,
        stories: {
          ...state.stories,
          [action.payload.id]: action.payload,
        },
      };

    case ACTION_TYPES.TRASH_STORY:
      return {
        ...state,
        storiesOrderById: state.storiesOrderById.filter(
          (id) => id !== action.payload.id
        ),
        totalStoriesByStatus: {
          ...state.totalStoriesByStatus,
          all: state.totalStoriesByStatus.all - 1,
          [action.payload.storyStatus]:
            state.totalStoriesByStatus[action.payload.storyStatus] - 1,
        },
        stories: Object.keys(state.stories).reduce((memo, storyId) => {
          if (parseInt(storyId) !== action.payload.id) {
            memo[storyId] = state.stories[storyId];
          }
          return memo;
        }, {}),
      };

    case ACTION_TYPES.DUPLICATE_STORY:
      return {
        ...state,
        storiesOrderById: [action.payload.id, ...state.storiesOrderById],
        totalStoriesByStatus: {
          ...state.totalStoriesByStatus,
          all: state.totalStoriesByStatus.all + 1,
          [action.payload.status]:
            state.totalStoriesByStatus[action.payload.status] + 1,
        },
        stories: {
          ...state.stories,
          [action.payload.id]: action.payload,
        },
      };

    case ACTION_TYPES.FETCH_STORIES_SUCCESS: {
      const fetchedStoriesById = action.payload.stories.map(({ id }) => id);

      const combinedStoryIds =
        action.payload.page === 1
          ? fetchedStoriesById
          : [...state.storiesOrderById, ...fetchedStoriesById];

      const uniqueStoryIds = [...new Set(combinedStoryIds)];

      return {
        ...state,
        error: {},
        storiesOrderById: uniqueStoryIds,
        stories: { ...state.stories, ...groupBy(action.payload.stories, 'id') },
        totalPages: action.payload.totalPages,
        totalStoriesByStatus: action.payload.totalStoriesByStatus,
        allPagesFetched: action.payload.page >= action.payload.totalPages,
      };
    }

    default:
      return state;
  }
}

export default storyReducer;
