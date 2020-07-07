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
import { shallowEqual } from 'react-pure-render';

/**
 * Internal dependencies
 */
import { INITIAL_STATE } from '../types';
import providerReducer from './providerReducer.js';

// TODO(#2804): Use the configuration json to provide this list.
const providers = ['unsplash'];

function reducer(state = {}, { type, payload }) {
  const result = {};
  for (const provider of providers) {
    if (type == INITIAL_STATE || provider == payload?.provider) {
      result[provider] = providerReducer(state[provider], { type, payload });
    }
  }
  return !shallowEqual(result, state) ? result : state;
}

export default reducer;
