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
 * Categories action typedef
 *
 * @typedef {(payload: {provider: string}) => undefined} DeselectCategoryFn
 * @typedef {(payload: {provider: string}) => undefined} FetchCategoriesStartFn
 * @typedef {(payload: {provider: string}) => undefined} FetchCategoriesErrorFn
 * @typedef {(payload: {provider: string, categories: Array.<Category>}) =>
 * undefined} FetchCategoriesSuccessFn
 * @typedef {(payload: {provider: string, categoryId: string}) => undefined}
 * SelectCategoryFn
 */

/**
 * @typedef {Object} Category
 * @property {string} id category id
 * @property {string} label the name of the category
 */

/**
 * The categories state returned by the context value.
 *
 * @typedef {Object} CategoriesContextState
 * @property {Array.<Category>} categories array of category objects
 * @property {boolean} isLoading are categories loading
 * @property {boolean} isLoaded are categories loaded
 * @property {string} selectedCategoryId current selected category id
 */

/**
 * The categories used internally by the reducers (i.e. reducerState).
 *
 * @typedef {Object} CategoriesReducerState
 * @property {Array.<Category>} categories array of category objects
 * @property {boolean} isLoading are categories loading
 * @property {boolean} isLoaded are categories loaded
 * @property {string} selectedCategoryId current selected category id
 */

// This is required so that the IDE doesn't ignore this file.
// Without it the types don't show up when you use {import('./typedefs)}.
export default {};
