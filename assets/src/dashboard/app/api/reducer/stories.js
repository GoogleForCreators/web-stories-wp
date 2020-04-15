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
import groupBy from '../../../utils/groupBy';

// TODO make these actions
export const ACTION_TYPES = {
  ADD_STORIES: 'add_stories',
  STORY_COUNT_DATA: 'story_count_data',
};

function storyReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.STORY_COUNT_DATA:
      return {
        ...state,
        totalStories: action.payload.totalStories,
        totalPages: action.payload.totalPages,
      };
    case ACTION_TYPES.ADD_STORIES:
      return {
        ...state,
        stories: { ...state.stories, ...groupBy(action.payload, 'id') },
        // TODO this needs to keep its order otherwise things get funky on load
      };
    default:
      return state;
  }
}

export default storyReducer;
