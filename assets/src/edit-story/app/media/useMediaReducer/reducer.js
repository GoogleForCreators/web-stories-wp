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
import * as types from './types';

export const INITIAL_STATE = {
  media: [],
  mediaType: '',
  searchTerm: '',
  isMediaLoading: false,
  isMediaLoaded: false,
};

function reducer(state, { type, payload }) {
  switch (type) {
    case types.FETCH_MEDIA_START: {
      return {
        ...state,
        isMediaLoaded: false,
        isMediaLoading: true,
      };
    }

    case types.FETCH_MEDIA_SUCCESS: {
      const { media, mediaType, searchTerm } = payload;
      if (mediaType === state.mediaType && searchTerm === state.searchTerm) {
        return {
          ...state,
          media,
          isMediaLoaded: true,
          isMediaLoading: false,
        };
      }
      return state;
    }

    case types.FETCH_MEDIA_ERROR: {
      return {
        ...state,
        media: [],
        isMediaLoaded: true,
        isMediaLoading: false,
      };
    }

    case types.RESET_FILTERS: {
      return {
        ...state,
        searchTerm: '',
        mediaType: '',
      };
    }

    case types.SET_SEARCH_TERM: {
      const { searchTerm } = payload;
      return {
        ...state,
        searchTerm,
      };
    }

    case types.SET_MEDIA_TYPE: {
      const { mediaType } = payload;
      return {
        ...state,
        mediaType,
      };
    }

    default:
      throw new Error(`Unknown media reducer action: ${type}`);
  }
}

export default reducer;
