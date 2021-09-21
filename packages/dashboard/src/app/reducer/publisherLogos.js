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
  publisherLogos: {},
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
        publisherLogos: {
          ...state.publisherLogos,
          ...action.payload.publisherLogos
            .map(({ id, title, url, active }) => ({ id, title, url, active }))
            .reduce((acc, current) => {
              if (!current) {
                return acc;
              }

              acc[current.id] = current;

              return acc;
            }, {}),
        },
      };
    }

    case ACTION_TYPES.ADD_SUCCESS: {
      const newPublisherLogos = { ...state.publisherLogos };
      newPublisherLogos[action.payload.publisherLogo.id] = {
        id: action.payload.publisherLogo.id,
        title: action.payload.publisherLogo.title,
        url: action.payload.publisherLogo.url,
        active: action.payload.publisherLogo.active,
      };

      return {
        ...state,
        error: {},
        isLoading: false,
        settingSaved: true,
        publisherLogos: newPublisherLogos,
      };
    }

    case ACTION_TYPES.UPDATE_SUCCESS: {
      const newPublisherLogos = { ...state.publisherLogos };
      for (const id of Object.keys(newPublisherLogos)) {
        newPublisherLogos[id].active = false;
      }
      newPublisherLogos[action.payload.publisherLogo.id] = {
        id: action.payload.publisherLogo.id,
        title: action.payload.publisherLogo.title,
        url: action.payload.publisherLogo.url,
        active: action.payload.publisherLogo.active,
      };

      return {
        ...state,
        error: {},
        isLoading: false,
        settingSaved: true,
        publisherLogos: newPublisherLogos,
      };
    }

    case ACTION_TYPES.REMOVE_SUCCESS: {
      const wasDefault = state.publisherLogos[action.payload.id].active;

      const newPublisherLogos = { ...state.publisherLogos };
      delete newPublisherLogos[action.payload.id];

      // Mark first remaining logo as the new default one.
      const nextInLine = Object.keys(newPublisherLogos)[0];
      if (wasDefault && nextInLine) {
        newPublisherLogos[nextInLine].active = true;
      }

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
