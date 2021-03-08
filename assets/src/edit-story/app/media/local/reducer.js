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
import * as commonTypes from '../pagination/types';
import commonReducer, {
  INITIAL_STATE as COMMON_INITIAL_STATE,
} from '../pagination/reducer';
import * as types from './types';

const INITIAL_STATE = {
  ...COMMON_INITIAL_STATE,
  processing: [],
  processed: [],
  mediaType: '',
  searchTerm: '',
};

/**
 * @typedef {import('./typedefs').LocalMediaReducerState} LocalMediaReducerState
 */

/**
 * The reducer for locally uploaded media.
 *
 * For pagination actions, the `payload.provider` discriminator must be
 * assigned to 'local', which is passed from the local media action dispatchers
 * at {@link ./actions}.
 *
 * @param {LocalMediaReducerState} state The state to reduce
 * @param {Object} obj An object with the type and payload
 * @param {string} obj.type A constant that identifies the reducer action
 * @param {Object} obj.payload The details of the action, specific to the action
 * @return {LocalMediaReducerState} The new state
 */
function reducer(state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case commonTypes.FETCH_MEDIA_SUCCESS: {
      const { provider, mediaType, searchTerm } = payload;
      if (
        provider === 'local' &&
        mediaType === state.mediaType &&
        searchTerm === state.searchTerm
      ) {
        return commonReducer(state, { type, payload });
      }
      return state;
    }

    case types.LOCAL_MEDIA_RESET_FILTERS: {
      return {
        ...INITIAL_STATE,
        processing: [...state.processing],
        processed: [...state.processed],
      };
    }

    case types.LOCAL_MEDIA_SET_SEARCH_TERM: {
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

    case types.LOCAL_MEDIA_SET_MEDIA_TYPE: {
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

    case types.LOCAL_MEDIA_SET_MEDIA: {
      const { media } = payload;

      return {
        ...state,
        media,
      };
    }

    case types.LOCAL_MEDIA_ADD_PROCESSING: {
      const { id } = payload;
      if (!id || state.processing.includes(id)) {
        return state;
      }
      return {
        ...state,
        processing: [...state.processing, id],
      };
    }

    case types.LOCAL_MEDIA_REMOVE_PROCESSING: {
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

    default:
      if (payload?.provider == 'local') {
        return commonReducer(state, { type, payload });
      }
      return state;
  }
}

export default reducer;
