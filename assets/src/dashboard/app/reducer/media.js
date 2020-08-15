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
import { reshapePublisherLogo } from '../serializers';

export const ACTION_TYPES = {
  LOADING_MEDIA: 'loading_media',
  ADD_MEDIA_SUCCESS: 'add_media_success',
  ADD_MEDIA_FAILURE: 'add_media_failure',
  FETCH_MEDIA_SUCCESS: 'fetch_media_success',
  FETCH_MEDIA_FAILURE: 'fetch_media_failure',
};

export const defaultMediaState = {
  error: {},
  isLoading: false,
  uploadedMediaIds: [],
  publisherLogos: {},
};

function mediaReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.LOADING_MEDIA: {
      return {
        ...state,
        isLoading: true,
        uploadedMediaIds: [],
      };
    }

    case ACTION_TYPES.FETCH_MEDIA_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        // todo should this be map or reduce?
        publisherLogos: {
          ...state.publisherLogos,
          ...action.payload.reduce((acc, current) => {
            if (!current) {
              return acc;
            }
            acc[current.id] = reshapePublisherLogo(current);
            return acc;
          }, {}),
        },
      };
    }
    case ACTION_TYPES.ADD_MEDIA_FAILURE:
    case ACTION_TYPES.FETCH_MEDIA_FAILURE: {
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
        // todo should this be map or reduce?
        publisherLogos: {
          ...state.publisherLogos,
          ...action.payload.reduce((acc, current) => {
            if (!current) {
              return acc;
            }
            acc[current.id] = reshapePublisherLogo(current);
            return acc;
          }, {}),
        },
        uploadedMediaIds: action.payload.map(({ id }) => id),
      };
    }

    default:
      return state;
  }
}

export default mediaReducer;
