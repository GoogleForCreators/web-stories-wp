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
 * @typedef {CategoriesState} CategoriesState
 * @property {Array} categories
 * @property {boolean} isLoading
 * @property {boolean} isLoaded
 */

/**
 * State object used by each media provider.
 *
 * @typedef {Object} ProviderState
 * @property {CategoriesState} categories
 * @property {boolean} hasMore
 * @property {boolean} isMediaLoaded
 * @property {boolean} isMediaLoading
 * @property {Array} media
 * @property {string} nextPageToken
 * @property {number} totalPages
 */

/**
 * The 'media3p/[provider]' fragment of the state returned from
 * `useMediaReducer`
 *
 * @typedef {Object} MediaReducerState
 * @property {string} searchTerm
 * @property {string} selectedProvider
 * @property {ProviderState} unsplash
 * @property {ProviderState} coverr
 */

/**
 * The 'media3p/[provider]' fragment of the actions returned from
 * `useMediaReducer`
 *
 * @typedef {Object} MediaReducerActions
 * @property {Function} deleteMediaElement
 * @property {Function} deselectCategory
 * @property {Function} fetchCategoriesError
 * @property {Function} fetchCategoriesSuccess
 * @property {Function} fetchMediaError
 * @property {Function} fetchMediaStart
 * @property {Function} fetchMediaSuccess
 * @property {Function} selectCategory
 * @property {Function} setNextPage
 * @property {Function} setSearchTerm
 * @property {Function} setSelectedProvider
 * @property {Function} updateMediaElement
 */

/**
 *
 * @typedef {Object} MediaProviderContextActions
 * @property {Function} setNextPage
 * @property {Function} selectCategory
 * @property {Function} actions
 */

/**
 *
 * @typedef {Object} Media3pProviderContext
 * @property {ProviderState} state
 * @property {MediaProviderContextActions} actions
 */

/**
 * @typedef {Object} RootMedia3pState
 * @property {string} searchTerm
 * @property {string} selectedProvider
 */

/**
 * @typedef {Object} RootMedia3pActions
 * @property {Function} setSearchTerm ({ searchTerm }) => {…}
 * @property {Function} setSelectedProvider ({ provider }) => {…}
 */

/**
 *
 * @typedef {Object} Media3pContext
 * @property {RootMedia3pState} state non-provider-specific state
 * @property {RootMedia3pActions} actions non-provider-specific state
 * @property {Media3pProviderContext} unsplash
 * @property {Media3pProviderContext} coverr
 */
