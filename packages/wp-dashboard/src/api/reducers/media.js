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

export const ACTION_TYPES = {
  LOADING_MEDIA: 'loading_media',
  ADD_MEDIA_SUCCESS: 'add_media_success',
  ADD_MEDIA_FAILURE: 'add_media_failure',
};

export const defaultMediaState = {
  error: {},
  isLoading: false,
  newlyCreatedMediaIds: [],
};

function mediaReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.LOADING_MEDIA: {
      return {
        ...state,
        isLoading: true,
        newlyCreatedMediaIds: [],
      };
    }

    case ACTION_TYPES.ADD_MEDIA_FAILURE: {
      return {
        ...state,
        error: { ...action.payload, id: Date.now() },
        isLoading: false,
      };
    }

    case ACTION_TYPES.ADD_MEDIA_SUCCESS: {
      return {
        ...state,
        error: {},
        isLoading: false,
        newlyCreatedMediaIds:
          action.payload.newlyCreatedMediaIds || state.newlyCreatedMediaIds,
      };
    }

    default:
      return state;
  }
}

export default mediaReducer;
