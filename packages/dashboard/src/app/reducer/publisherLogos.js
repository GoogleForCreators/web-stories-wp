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
  LOADING: 'loading',
  UPDATE_FAILURE: 'update_failure',
  UPDATE_SUCCESS: 'update_success',
  FETCH_FAILURE: 'fetch_failure',
  FETCH_SUCCESS: 'fetch_success',
  REMOVE_FAILURE: 'remove_failure',
  REMOVE_SUCCESS: 'remove_success',
  ADD_FAILURE: 'add_failure',
  ADD_SUCCESS: 'add_success',
};

export const defaultPublisherLogosState = {
  error: {},
  isLoading: false,
  publisherLogos: [],
  settingSaved: false,
};

function publisherLogoReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.LOADING: {
      return {
        ...state,
        isLoading: true,
        settingSaved: false,
      };
    }

    case ACTION_TYPES.ADD_FAILURE:
    case ACTION_TYPES.UPDATE_FAILURE:
    case ACTION_TYPES.REMOVE_FAILURE:
    case ACTION_TYPES.FETCH_FAILURE: {
      return {
        ...state,
        error: { ...action.payload, id: Date.now() },
        isLoading: false,
        settingSaved: false,
      };
    }

    case ACTION_TYPES.FETCH_SUCCESS: {
      return {
        ...state,
        error: {},
        isLoading: false,
        publisherLogos: [
          ...state.publisherLogos,
          ...action.payload.publisherLogos,
        ],
      };
    }

    case ACTION_TYPES.ADD_SUCCESS: {
      const newPublisherLogos = [
        ...state.publisherLogos,
        action.payload.publisherLogo,
      ];

      return {
        ...state,
        error: {},
        isLoading: false,
        settingSaved: true,
        publisherLogos: newPublisherLogos,
      };
    }

    case ACTION_TYPES.UPDATE_SUCCESS: {
      const newPublisherLogos = [...state.publisherLogos].map(
        (publisherLogo) => {
          publisherLogo.active =
            publisherLogo.id === action.payload.publisherLogo.id;
          return publisherLogo;
        }
      );

      return {
        ...state,
        error: {},
        isLoading: false,
        settingSaved: true,
        publisherLogos: newPublisherLogos,
      };
    }

    case ACTION_TYPES.REMOVE_SUCCESS: {
      const wasDefault = state.publisherLogos.some(
        ({ id, active }) => id === action.payload.id && active
      );

      const newPublisherLogos = [...state.publisherLogos]
        .filter(({ id }) => id !== action.payload.id)
        .map((publisherLogo, index) => {
          publisherLogo.active = wasDefault
            ? 0 === index
            : publisherLogo.active;
          return publisherLogo;
        });

      return {
        ...state,
        error: {},
        isLoading: false,
        settingSaved: true,
        publisherLogos: newPublisherLogos,
      };
    }

    default:
      return state;
  }
}

export default publisherLogoReducer;
