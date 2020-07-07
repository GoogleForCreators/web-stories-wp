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
  // The page token of the last loaded page, or undefined if at the first page
  // or no pages have been loaded.
  pageToken: undefined,
  // The page token of the next page, or undefined if at the last page or no
  // pages have been loaded.
  nextPageToken: undefined,
  hasMore: true,
  totalPages: 1,
  isMediaLoading: false,
  isMediaLoaded: false,
};

function reducer(state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case types.FETCH_MEDIA_START: {
      return {
        ...state,
        isMediaLoaded: false,
        isMediaLoading: true,
      };
    }

    case types.FETCH_MEDIA_SUCCESS: {
      const { media, nextPageToken, totalPages } = payload;
      return {
        ...state,
        media: [...state.media, ...media],
        nextPageToken,
        totalPages,
        hasMore: Boolean(nextPageToken),
        isMediaLoaded: true,
        isMediaLoading: false,
      };
    }

    case types.FETCH_MEDIA_ERROR: {
      return {
        ...state,
        isMediaLoaded: true,
        isMediaLoading: false,
      };
    }

    case types.SET_NEXT_PAGE: {
      if (!state.nextPageToken) {
        return state;
      }
      return {
        ...state,
        // Updating pageToken state will trigger the media fetch useEffect()
        // side effect to load the next page.
        pageToken: state.nextPageToken,
      };
    }

    case types.UPDATE_MEDIA_ELEMENT: {
      const { id, ...properties } = payload;

      const mediaIndex = state.media.findIndex((media) => media.id === id);
      if (mediaIndex === -1) {
        return state;
      }

      const updatedMediaElement = {
        ...state.media[mediaIndex],
        ...properties,
      };

      const newMedia = [
        ...state.media.slice(0, mediaIndex),
        updatedMediaElement,
        ...state.media.slice(mediaIndex + 1),
      ];

      return {
        ...state,
        media: newMedia,
      };
    }

    case types.DELETE_MEDIA_ELEMENT: {
      const { id } = payload;
      return {
        ...state,
        media: state.media.filter((media) => media.id !== id),
      };
    }

    default:
      return state;
  }
}

export default reducer;
