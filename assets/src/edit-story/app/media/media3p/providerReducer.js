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
import paginationReducer, {
  INITIAL_STATE as COMMON_INITIAL_STATE,
} from '../pagination/reducer';

import categoriesReducer, {
  INITIAL_STATE as CATEGORIES_INITIAL_STATE,
} from './categories/reducer';

const INITIAL_STATE = {
  ...COMMON_INITIAL_STATE,
  categories: CATEGORIES_INITIAL_STATE,
};

/**
 * State reducer for a single 3p media provider.
 *
 * By the time this reducer is called, the provider discriminator will already
 * be evaluated, so the provider-specific `state` passed here will always
 * correspond to the `payload.provider` value.
 *
 * @param {Object} state The state to reduce
 * @param {Object} obj An object with the type and payload
 * @param {string} obj.type A constant that identifies the reducer action
 * @param {Object} obj.payload The details of the action, specific to the action
 * @return {Object} The new state
 */
function providerReducer(state = INITIAL_STATE, { type, payload }) {
  return {
    ...paginationReducer(state, { type, payload }),
    categories: categoriesReducer(state.categories, { type, payload }),
  };
}

export default providerReducer;
