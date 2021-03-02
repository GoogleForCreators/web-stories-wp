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

/**
 * Internal dependencies
 */
import DEFAULT_STATE from './default';

/**
 * Store reducer.
 *
 * @param {Object} state Current state for the data store.
 * @param {Object} action Action object for manipulating state.
 * @return {Object} New Manipulated state for the store.
 */
function reducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case 'SET_SETTINGS':
      return {
        ...state,
        settings: action.settings,
      };

    case 'TOGGLE_MODAL':
      return {
        ...state,
        modalOpen: action.modalOpen,
      };

    case 'SET_EDITOR':
      return {
        ...state,
        editor: action.editor,
      };

    case 'SET_CURRENT_VIEW':
      return {
        ...state,
        currentView: action.currentView,
      };

    case 'SET_VIEW_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          [action.view]: action.settings,
        },
      };

    default:
      return state;
  }
}

export default reducer;
