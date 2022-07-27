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
 * External dependencies
 */
import { shallowEqual } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { INITIAL_STATE as INITIAL_STATE_ACTION } from '../types';
import * as types from './types';
import providerReducer from './providerReducer.js';
import { PROVIDERS } from './providerConfiguration';

/**
 * @typedef {import('./typedefs').Media3pReducerState} Media3pReducerState
 */

const INITIAL_STATE = {
  selectedProvider: undefined,
  searchTerm: '',
};

/**
 * State reducer for all 3p media providers (Unsplash, Coverr etc).
 *
 * For actions that are provider specific, the `payload.provider` attribute
 * is used as the provider discriminator ('unsplash', 'coverr', etc).
 *
 * @param {Media3pReducerState} state The state to reduce
 * @param {Object} obj An object with the type and payload
 * @param {string} obj.type A constant that identifies the reducer action
 * @param {Object} obj.payload The details of the action, specific to the action
 * @return {Media3pReducerState} The new state
 */
function reduceProviderStates(state, { type, payload }) {
  const result = { ...state };
  for (const provider of Object.keys(PROVIDERS)) {
    if (
      type === INITIAL_STATE_ACTION ||
      !payload?.provider ||
      provider === payload?.provider
    ) {
      result[provider] = providerReducer(state[provider], { type, payload });
    }
  }
  return !shallowEqual(result, state) ? result : state;
}

/**
 * State reducer for 3rd party media state.
 *
 * @param {import('./typedefs').Media3pReducerState} state The state to reduce
 * @param {Object} obj An object with the type and payload
 * @param {string} obj.type A constant that identifies the reducer action
 * @param {Object} obj.payload The details of the action, specific to the action
 * @return {import('./typedefs').Media3pReducerState} The new state
 */
function reducer(state = INITIAL_STATE, { type, payload }) {
  state = reduceProviderStates(state, { type, payload });

  switch (type) {
    case types.MEDIA3P_SET_SELECTED_PROVIDER: {
      return {
        ...state,
        selectedProvider: payload.provider,
      };
    }
    case types.MEDIA3P_SET_SEARCH_TERM: {
      return {
        ...state,
        searchTerm: payload.searchTerm,
      };
    }
    default:
      return state;
  }
}

export default reducer;
