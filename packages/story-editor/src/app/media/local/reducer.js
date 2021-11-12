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
import { FETCH_MEDIA_SUCCESS } from '../pagination/types';
import { INITIAL_STATE } from './constants';
import * as types from './types';
import * as reducers from './reducers';

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
    case FETCH_MEDIA_SUCCESS: {
      return reducers.fetchMedia(state, { type, payload });
    }

    case types.LOCAL_MEDIA_RESET_FILTERS: {
      return reducers.resetFilters(state);
    }

    case types.LOCAL_MEDIA_SET_SEARCH_TERM: {
      return reducers.setSearchTerm(state, payload);
    }

    case types.LOCAL_MEDIA_SET_MEDIA_TYPE: {
      return reducers.setMediaType(state, payload);
    }

    case types.LOCAL_MEDIA_SET_MEDIA: {
      return reducers.setMedia(state, payload);
    }

    case types.LOCAL_MEDIA_PREPEND_MEDIA: {
      return reducers.prependMedia(state, payload);
    }

    case types.LOCAL_MEDIA_ADD_POSTER_PROCESSING: {
      return reducers.addPosterProcessing(state, payload);
    }

    case types.LOCAL_MEDIA_REMOVE_POSTER_PROCESSING: {
      return reducers.removePosterProcessing(state, payload);
    }

    case types.LOCAL_MEDIA_ADD_AUDIO_PROCESSING: {
      return reducers.addAudioProcessing(state, payload);
    }

    case types.LOCAL_MEDIA_REMOVE_AUDIO_PROCESSING: {
      return reducers.removeAudioProcessing(state, payload);
    }

    default:
      return reducers.setupState(state, { type, payload });
  }
}

export default reducer;
