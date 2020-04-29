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
  LOADING_STORIES: 'loading_stories',
  FETCH_STORIES_SUCCESS: 'fetch_stories_success',
  FETCH_STORIES_FAILURE: 'fetch_stories_failure',
  UPDATE_STORY: 'update_story',
};

export const defaultStoriesState = {
  isError: false,
  isLoading: false,
  stories: {},
  storiesOrderById: [],
  totalStories: null,
  totalPages: null,
};

function storyReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.LOADING_STORIES: {
      return {
        ...state,
        isLoading: action.payload,
      };
    }
    case ACTION_TYPES.FETCH_STORIES_FAILURE:
      return {
        ...state,
        isError: action.payload,
      };

    case ACTION_TYPES.UPDATE_STORY:
      return {
        ...state,
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

      // we want to make sure that pagination is kept intact regardless of page number.
      // we are using infinite scroll, not traditional pagination.
      // this means we need to append our new stories to the bottom of our already existing stories.
      // when we combine existing stories with the new ones we need to make sure we're not duplicating anything.
      const uniqueStoryIds = combinedStoryIds.filter(
        (storyId, index, storyIdsArray) => {
          return storyIdsArray.indexOf(storyId) === index;
        }
      );

      return {
        ...state,
        isError: false,
        storiesOrderById: uniqueStoryIds,
        stories: { ...state.stories, ...groupBy(action.payload.stories, 'id') },
        totalPages: action.payload.totalPages,
        totalStories: action.payload.totalStories,
        allPagesFetched: action.payload.page >= action.payload.totalPages,
      };
    }

    default:
      return state;
  }
}

export default storyReducer;
