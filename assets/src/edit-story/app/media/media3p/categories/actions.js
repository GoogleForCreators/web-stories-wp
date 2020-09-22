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
import * as types from './types';

export const fetchCategoriesStart = (dispatch) => ({ provider }) => {
  dispatch({
    type: types.FETCH_MEDIA_CATEGORIES_START,
    payload: {
      provider: provider,
    },
  });
};

export const fetchCategoriesSuccess = (dispatch) => ({
  provider,
  categories,
}) => {
  dispatch({
    type: types.FETCH_MEDIA_CATEGORIES_SUCCESS,
    payload: {
      provider,
      categories,
    },
  });
};

export const fetchCategoriesError = (dispatch) => ({ provider }) => {
  dispatch({
    type: types.FETCH_MEDIA_CATEGORIES_ERROR,
    payload: { provider: provider },
  });
};

export const selectCategory = (dispatch) => ({ provider, categoryId }) => {
  dispatch({
    type: types.SELECT_CATEGORY,
    payload: { provider, categoryId },
  });
};

export const deselectCategory = (dispatch) => ({ provider }) => {
  dispatch({
    type: types.DESELECT_CATEGORY,
    payload: { provider },
  });
};
