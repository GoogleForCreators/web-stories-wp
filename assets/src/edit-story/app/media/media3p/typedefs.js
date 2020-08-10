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
 * @typedef {Object} CategoriesState
 * @property {Array} categories array of category objects
 * @property {boolean} isLoading are categories loading
 * @property {boolean} isLoaded are categories loaded
 * @property {string} selectedCategoryId current selected category id
 */

/**
 * State object used by each media provider.
 *
 * @typedef {Object} ProviderState
 * @property {CategoriesState} categories Category state object
 * @property {boolean} hasMore has more media
 * @property {boolean} isMediaLoaded is media loaded
 * @property {boolean} isMediaLoading is media loading
 * @property {Array} media array of media
 * @property {string} pageToken page token for current page
 * @property {string} nextPageToken the page token for the next page
 * @property {number} totalPages total pages
 */

/**
 * The 'media3p/[provider]' fragment of the state returned from
 * `useMediaReducer`
 *
 * @typedef {Object} MediaReducerState
 * @property {string} searchTerm current search term
 * @property {string} selectedProvider selected provider
 * @property {ProviderState} unsplash state for unsplash
 * @property {ProviderState} coverr state for coverr
 */

/**
 * Actions
 *
 * updateMediaElement: ({ provider, id, ...properties }) => {…}
 *
 */

/**
 * 'media3p/[provider]' action typedef
 *
 * @typedef {(payload: {provider: string, id: string}) => *} DeleteMediaElement
 * @typedef {(payload: {provider: string}) => *} DeselectCategory
 * @typedef {(payload: {provider: string}) => *} FetchCategoriesStart
 * @typedef {(payload: {provider: string}) => *} FetchCategoriesError
 * @typedef {(payload: {provider: string, categories: *}) => *} FetchCategoriesSuccess
 * @typedef {(payload: {provider: string}) => *} FetchMediaError
 * @typedef {(payload: {provider: string, pageToken: string}) => *} FetchMediaStart
 * @typedef {(payload: {provider, media, nextPageToken, totalPages}) => *} FetchMediaSuccess
 * @typedef {(payload: {provider: string, categoryId: string}) => *} SelectCategory
 * @typedef {(payload: {provider: string}) => *} SetNextPage
 * @typedef {(payload: {searchTerm: string}) => *} SetSearchTerm
 * @typedef {(payload: {provider: string}) => *} SetSelectedProvider
 * @typedef {(payload:{ provider, id }) => *} UpdateMediaElement
 */

/**
 * The 'media3p/[provider]' fragment of the actions returned from
 * `useMediaReducer`
 *
 * @typedef {Object} MediaReducerActions
 * @property {DeleteMediaElement} deleteMediaElement Action dispatched when
 * media element is deleted
 * @property {DeselectCategory} deselectCategory Action dispatched when current
 * category is deselected
 * @property {FetchCategoriesError} fetchCategoriesError Action dispatched when
 * fetching categories returns an error
 * @property {FetchCategoriesSuccess} fetchCategoriesSuccess Action dispatched
 * when categories fetching is successful
 * @property {FetchMediaError} fetchMediaError Action dispatched when media
 * fetching returns an error
 * @property {FetchMediaStart} fetchMediaStart Action dispatched when media
 * fetching starts
 * @property {FetchMediaSuccess} fetchMediaSuccess Action dispatched when media
 * succesfully fetched
 * @property {SelectCategory} selectCategory Selects current category
 * @property {SetNextPage} setNextPage Sets next page token
 * @property {SetSearchTerm} setSearchTerm Sets search term
 * @property {SetSelectedProvider} setSelectedProvider Sets current provider
 * @property {UpdateMediaElement} updateMediaElement Updates a media element
 */

/**
 *
 * @typedef {Object} MediaProviderContextActions
 * @property {SetNextPage} setNextPage action to set next page
 * @property {SelectCategory} selectCategory action to select category
 * @property {DeselectCategory} deselectCategory action to deselect current
 * category
 */

/**
 *
 * @typedef {Object} Media3pSingleProviderContext
 * @property {ProviderState} state state of a single provider
 * @property {MediaProviderContextActions} actions actions for the provider
 */

/**
 * @typedef {Object} RootMedia3pState
 * @property {string} searchTerm search term for media3p
 * @property {string} selectedProvider current selected provider
 */

/**
 * @typedef {Object} RootMedia3pActions
 * @property {SetSearchTerm} setSearchTerm Sets current search term
 * @property {SetSelectedProvider} setSelectedProvider Sets provider
 */

/**
 *
 * @typedef {Object} Media3pContext
 * @property {RootMedia3pState} state Non-provider-specific state
 * @property {RootMedia3pActions} actions Non-provider-specific actions
 * @property {Media3pSingleProviderContext} unsplash Unsplash state and actions
 * @property {Media3pSingleProviderContext} coverr Coverr state and actions
 */

// This is required so that the IDE doesn't ignore this file.
// Without it the types don't show up when you use {import('./typedefs)}.
export default {};
