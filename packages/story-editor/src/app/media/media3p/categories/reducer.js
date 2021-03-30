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
import * as media3pTypes from '../types';
import * as types from './types';

/**
 * @typedef {import('./typedefs').CategoriesReducerState} CategoriesReducerState
 */

export const INITIAL_STATE = {
  isLoading: true,
  isLoaded: false,
  categories: [],
  selectedCategoryId: undefined,
};

/**
 * The reducer for the state of a media list pagination.
 *
 * This is called by the reducers for the state nodes:
 * media/local, media/media3p/unsplash, media/media3p/coverr, etc.
 *
 * @param {CategoriesReducerState} state The state to reduce
 * @param {Object} obj An object with the type and payload
 * @param {string} obj.type A constant that identifies the reducer action
 * @param {Object} obj.payload The details of the action, specific to the action
 * @return {CategoriesReducerState} The new state
 */
function reducer(state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case types.FETCH_MEDIA_CATEGORIES_START: {
      return {
        ...state,
        isLoading: true,
        isLoaded: false,
      };
    }
    case types.FETCH_MEDIA_CATEGORIES_SUCCESS: {
      const { categories } = payload;
      return {
        ...state,
        categories,
        isLoading: false,
        isLoaded: true,
      };
    }
    case types.FETCH_MEDIA_CATEGORIES_ERROR: {
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
      };
    }
    case types.SELECT_CATEGORY: {
      const { categoryId } = payload;
      return {
        ...state,
        selectedCategoryId: categoryId,
      };
    }
    case types.DESELECT_CATEGORY: {
      return {
        ...state,
        selectedCategoryId: undefined,
      };
    }
    case media3pTypes.MEDIA3P_SET_SEARCH_TERM: {
      return {
        ...state,
        selectedCategoryId: undefined,
      };
    }
    default:
      return state;
  }
}

export default reducer;
