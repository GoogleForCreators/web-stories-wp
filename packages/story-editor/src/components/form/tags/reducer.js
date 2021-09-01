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
function formatTag(tag) {
  return tag.replace(/( +)/g, ' ').trim();
}

function uniquesOnly(arr) {
  return [...new Set(arr)];
}

export const ACTIONS = {
  UPDATE_VALUE: 'updateValue',
  SUBMIT_VALUE: 'submitValue',
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.UPDATE_VALUE: {
      const values = action.payload.split(',');
      const newTags = values
        .slice(0, -1)
        .map(formatTag)
        .filter((tag) => tag.length);
      const value = values[values.length - 1];
      return {
        value,
        tags: uniquesOnly([...state.tags, ...newTags]),
      };
    }
    case ACTIONS.SUBMIT_VALUE: {
      return {
        value: '',
        tags: uniquesOnly([...state.tags, formatTag(state.value)]),
      };
    }
    case ACTIONS.REMOVE_TAG: {
      const removedTagIndex = state.tags.findIndex(
        (tag) => tag === action.payload
      );
      return {
        ...state,
        tags: [
          ...state.tags.slice(0, removedTagIndex),
          ...state.tags.slice(removedTagIndex + 1),
        ],
      };
    }
    default:
      return state;
  }
}

export default reducer;
