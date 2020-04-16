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
  UPDATE_STORIES: 'update_stories',
  UPDATE_TOTAL_STORIES_PAGES: 'update_total_stories_pages',
  UPDATE_TOTAL_STORIES_COUNT: 'update_total_stories_count',
};

function storyReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.CLEAR_STORIES_ORDER: {
      return {
        ...state,
        storiesOrderById: [],
      };
    }
    case ACTION_TYPES.UPDATE_STORIES:
      let uniqueStoryIds = [
        ...state.storiesOrderById,
        ...action.payload.map(({ id }) => id),
      ];
      uniqueStoryIds = uniqueStoryIds.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });

      return {
        ...state,
        storiesOrderById: uniqueStoryIds,
        stories: { ...state.stories, ...groupBy(action.payload, 'id') },
      };
    case ACTION_TYPES.UPDATE_TOTAL_STORIES_COUNT:
      return {
        ...state,
        totalStories: action.payload,
      };
    case ACTION_TYPES.UPDATE_TOTAL_STORIES_PAGES:
      return {
        ...state,
        totalPages: action.payload,
      };

    default:
      return state;
  }
}

export default storyReducer;
