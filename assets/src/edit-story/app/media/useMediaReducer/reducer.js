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

/* eslint complexity: ["error", { "max": 30 }] */

/**
 * Internal dependencies
 */
import * as types from './types';

export const INITIAL_STATE = {
  media: [],
  processing: [],
  processed: [],
  pagingNum: 1,
  totalPages: 1,
  hasMore: true,
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
      const { media, mediaType, searchTerm, pagingNum, totalPages } = payload;
      if (mediaType === state.mediaType && searchTerm === state.searchTerm) {
        const hasMore = pagingNum < totalPages;
        return {
          ...state,
          media: [...state.media, ...media],
          pagingNum,
          totalPages,
          hasMore,
          isMediaLoaded: true,
          isMediaLoading: false,
        };
      }
      return state;
    }

    case types.FETCH_MEDIA_ERROR: {
      return {
        ...state,
        isMediaLoaded: true,
        isMediaLoading: false,
      };
    }

    case types.RESET_FILTERS: {
      return {
        ...INITIAL_STATE,
        processing: [...state.processing],
        processed: [...state.processed],
      };
    }

    case types.SET_SEARCH_TERM: {
      const { searchTerm } = payload;
      if (searchTerm === state.searchTerm) {
        return state;
      }
      return {
        ...INITIAL_STATE,
        processing: [...state.processing],
        processed: [...state.processed],
        mediaType: state.mediaType,
        searchTerm,
      };
    }

    case types.SET_MEDIA_TYPE: {
      const { mediaType } = payload;
      if (mediaType === state.mediaType) {
        return state;
      }
      return {
        ...INITIAL_STATE,
        media: state.media.filter(({ local }) => local), // This filter allows remove temporary file returned on upload
        processing: [...state.processing],
        processed: [...state.processed],
        searchTerm: state.searchTerm,
        mediaType,
      };
    }

    case types.SET_NEXT_PAGE: {
      return {
        ...state,
        pagingNum: state.pagingNum + 1,
      };
    }

    case types.SET_MEDIA: {
      const { media } = payload;

      return {
        ...state,
        media,
      };
    }

    case types.ADD_PROCESSING: {
      const { id } = payload;
      if (!id || state.processing.includes(id)) {
        return state;
      }
      return {
        ...state,
        processing: [...state.processing, id],
      };
    }

    case types.REMOVE_PROCESSING: {
      const { id } = payload;
      if (!id || !state.processing.includes(id)) {
        return state;
      }
      const currentProcessing = [...state.processing];
      const processing = currentProcessing.filter((e) => e !== id);

      return {
        ...state,
        processing,
        processed: [...state.processed, id],
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
      throw new Error(`Unknown media reducer action: ${type}`);
  }
}

export default reducer;
