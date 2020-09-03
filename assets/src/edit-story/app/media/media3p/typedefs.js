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
 * @typedef {import('../typedefs').Media} Media
 */

/**
 * media3p/[provider] typedefs =================================================
 */

/**
 * @typedef FetchMediaSuccessPayload
 * @property {string} provider media provider name
 * @property {Array.<Media>} media the media that is fetched
 * @property {string} nextPageToken token representing the next page
 * @property {number} totalPages total number of pages
 * @property {string} pageToken the current page token
 */

/**
 * @typedef UpdateMediaElementPayload
 * @property {string} provider media provider name
 * @property {string} id id of the media to update
 * @property {string} posterId poster id
 * @property {string} poster poster
 * @property {number} height height in pixels
 * @property {number} width width in pixels
 * @property {string} alt alt string that describes the media
 */

/**
 * 'media3p/[provider]' action typedefs not specific to any provider.
 *
 * @typedef {(payload: {provider: string, id: string}) => undefined} DeleteMediaElementFn
 * @typedef {(payload: {provider: string}) => undefined} FetchMediaErrorFn
 * @typedef {(payload: {provider: string, pageToken: string}) => undefined} FetchMediaStartFn
 * @typedef {(payload: FetchMediaSuccessPayload) => undefined} FetchMediaSuccessFn
 * @typedef {(payload: {provider: string}) => undefined} SetNextPageFn
 * @typedef {(payload: UpdateMediaElementPayload) => undefined} UpdateMediaElementFn
 */

/**
 * 'media3p/[provider]' actions exposed through context providers
 *
 * @typedef {Object} Media3pProviderContextActions
 * @property {SetNextPageFn} setNextPage action to set next page
 * @property {import('./categories/typedefs').SelectCategoryFn} selectCategory
 * action to select category
 * @property {import('./categories/typedefs').DeselectCategoryFn} deselectCategory
 * action to deselect current category
 */

/**
 * 'media3p/[provider]' state object used by each provider, exposed to the rest
 * of application through context providers.
 *
 * @typedef {Object} Media3pProviderContextState
 * @property {import('./categories/typedefs').CategoriesContextState} categories
 * Category state object
 * @property {boolean} hasMore has more media
 * @property {boolean} isMediaLoaded is media loaded
 * @property {boolean} isMediaLoading is media loading
 * @property {Array.<Media>} media array of media
 * @property {string} pageToken page token for current page
 * @property {string} nextPageToken the page token for the next page
 * @property {number} totalPages total pages
 */

/**
 * 'media3p/[provider]' state object used by each provider internally by the
 * reducer.
 *
 * @typedef {Object} Media3pProviderReducerState
 * @property {import('./categories/typedefs').CategoriesContextState} categories
 * Category state object
 * @property {boolean} hasMore has more media
 * @property {boolean} isMediaLoaded is media loaded
 * @property {boolean} isMediaLoading is media loading
 * @property {Array.<Media>} media array of media
 * @property {string} pageToken page token for current page
 * @property {string} nextPageToken the page token for the next page
 * @property {number} totalPages total pages
 */

/**
 *
 * @typedef {Object} Media3pProviderContext
 * @property {Media3pProviderContextState} state state of a single provider
 * @property {Media3pProviderContextActions} actions actions for the provider
 */

/**
 * media3p/ typedefs ===========================================================
 */

/**
 * 'media3p' root action typedefs.
 *
 * @typedef {(payload: {searchTerm: string}) => undefined} SetSearchTermFn
 * @typedef {(payload: {provider: string}) => undefined} SetSelectedProviderFn
 */

/**
 * 'media3p' root actions in the Media3pContext object.
 *
 * @typedef {Object} Media3pContextActions
 * @property {SetSearchTermFn} setSearchTerm Sets current search term
 * @property {SetSelectedProviderFn} setSelectedProvider Sets provider
 */

/**
 * 'media3p' root state in the Media3pContext object.
 *
 * @typedef {Object} Media3pContextState
 * @property {string} searchTerm search term for media3p
 * @property {string} selectedProvider current selected provider
 * @property {Media3pProviderContextState} unsplash state for Unsplash tab
 * @property {Media3pProviderContextState} coverr state for Coverr tab
 */

/**
 * Context object representing all of media3p's state and actions.
 *
 * @typedef {Object} Media3pContext
 * @property {Media3pContextState} state Non-provider-specific state
 * @property {Media3pContextActions} actions Non-provider-specific actions
 * @property {Media3pProviderContext} unsplash Unsplash state and actions
 * @property {Media3pProviderContext} coverr Coverr state and actions
 */

/**
 * The 'media3p' fragment of the state returned from `useMediaReducer`.
 *
 * @typedef {Object} Media3pReducerState
 * @property {string} searchTerm current search term
 * @property {string} selectedProvider selected provider
 * @property {Media3pProviderReducerState} unsplash state for Unsplash tab
 * @property {Media3pProviderReducerState} coverr state for Coverr tab
 */

/**
 * The 'media3p/[provider]' fragment of the actions returned from
 * `useMediaReducer`.
 *
 * @typedef {Object} Media3pReducerActions
 * @property {DeleteMediaElementFn} deleteMediaElement Action dispatched when
 * media element is deleted
 * @property {import('./categories/typedefs').DeselectCategoryFn} deselectCategory
 * Action dispatched when current category is deselected
 * @property {import('./categories/typedefs').FetchCategoriesStartFn}
 * fetchCategoriesStart Action dispatched when fetching categories starts
 * @property {import('./categories/typedefs').FetchCategoriesErrorFn}
 * fetchCategoriesError Action dispatched when fetching categories returns an
 * error
 * @property {import('./categories/typedefs').FetchCategoriesSuccessFn}
 * fetchCategoriesSuccess Action dispatched when categories fetching is
 * successful
 * @property {FetchMediaErrorFn} fetchMediaError Action dispatched when media
 * fetching returns an error
 * @property {FetchMediaStartFn} fetchMediaStart Action dispatched when media
 * fetching starts
 * @property {FetchMediaSuccessFn} fetchMediaSuccess Action dispatched when
 * media succesfully fetched
 * @property {import('./categories/typedefs').SelectCategoryFn} selectCategory
 * Selects current category
 * @property {SetNextPageFn} setNextPage Sets next page token
 * @property {SetSearchTermFn} setSearchTerm Sets search term
 * @property {SetSelectedProviderFn} setSelectedProvider Sets current provider
 * @property {UpdateMediaElementFn} updateMediaElement Updates a media element
 */

// This is required so that the IDE doesn't ignore this file.
// Without it the types don't show up when you use {import('./typedefs)}.
export default {};
