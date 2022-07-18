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
 * @typedef FetchMediaSuccessPayload
 * @property {Array.<Media>} media the media that is fetched
 * @property {string} nextPageToken token representing the next page
 * @property {number} totalPages total number of pages
 * @property {string} pageToken the current page token
 */

/**
 * @typedef UpdateMediaElementPayload
 * @property {string} id id of the media to update
 * @property {Object} data Updated data.
 * @property {string} data.posterId poster id
 * @property {string} data.poster poster
 * @property {number} data.height height in pixels
 * @property {number} data.width width in pixels
 * @property {string} data.alt alt string that describes the media
 */

/**
 * 'local media' action typedefs from {@link ./actions}.
 *
 * @typedef {(payload: {id: string}) => undefined} DeleteMediaElementFn
 * @typedef {() => undefined} ResetFiltersFn
 * @typedef {(payload: {mediaType: string}) => undefined} SetMediaTypeFn
 * @typedef {() => undefined} SetNextPageFn
 * @typedef {(payload: {searchTerm: string}) => undefined} SetSearchTermFn
 * @typedef {(payload: UpdateMediaElementPayload) => undefined} UpdateMediaElementFn
 * @typedef {(files:[], payload: { onLocalFile, onUploadFile, onUploadFailure }) => undefined} UploadMediaFn
 * @typedef {(id: string, src: string) => undefined} UploadVideoPosterFn
 * @typedef {() => undefined} FetchMediaErrorFn
 * @typedef {(payload: {pageToken: string}) => undefined} FetchMediaStartFn
 * @typedef {(payload: FetchMediaSuccessPayload) => undefined} FetchMediaSuccessFn
 */

/**
 * 'local media' actions exposed through context providers
 *
 * @typedef {Object} LocalMediaContextActions
 * @property {DeleteMediaElementFn} deleteMediaElement action to delete a media
 * @property {ResetFiltersFn} resetFilters action to reset filters
 * and then refetches the media from the server
 * @property {SetMediaTypeFn} setMediaType action to set media type
 * @property {SetNextPageFn} setNextPage action to set next page
 * @property {SetSearchTermFn} setSearchTerm action to set search term
 * @property {UpdateMediaElementFn} updateMediaElement action update media
 * @property {UploadMediaFn} uploadMedia action to upload media
 * @property {UploadVideoPosterFn} uploadVideoPoster action upload video poster
 */

/**
 * 'local media' state object exposed to the rest of application through context
 * providers.
 *
 * @typedef {Object} LocalMediaContextState
 * @property {boolean} hasMore is there more media
 * @property {boolean} isMediaLoaded is media loaded
 * @property {boolean} isMediaLoading is media loading
 * @property {boolean} isUploading is media uploading
 * @property {Array.<Media>} media array of media
 * @property {string} mediaType current media type filter selected
 * @property {string} nextPageToken the page token for the next page
 * @property {string} pageToken page token
 * @property {Array.<number>} audioProcessing Videos that have been processed for audio track detection.
 * @property {Array.<number>} audioProcessed Videos that haven't yet been processed for audio track detection.
 * @property {Array.<number>} posterProcessing Videos that have been processed for poster generation.
 * @property {Array.<number>} posterProcessed Videos that haven't yet been processed for poster generation.
 * @property {string} searchTerm search term
 * @property {number} totalPages total pages
 */

/**
 * 'local media' context exposed to application through context providers containing
 * state and action.
 *
 * @typedef {Object} LocalMediaContext
 * @property {LocalMediaContextState} state state of locally uploaded media
 * @property {LocalMediaContextActions} actions actions for local media
 */

/**
 * 'local media' state object used internally by the reducer.
 *
 * @typedef {Object} LocalMediaReducerState
 * @property {boolean} hasMore is there more media
 * @property {boolean} isMediaLoaded is media loaded
 * @property {boolean} isMediaLoading is media loading
 * @property {Array.<Media>} media array of media
 * @property {string} mediaType current media type filter selected
 * @property {string} nextPageToken the page token for the next page
 * @property {string} pageToken page token
 * @property {Array.<number>} audioProcessed IDs of videos that have been processed for audio track detection.
 * @property {Array.<number>} audioProcessing IDs of videos that haven't yet been processed for audio track detection.
 * @property {Array.<number>} posterProcessed IDs of videos that have been processed for poster generation.
 * @property {Array.<number>} posterProcessing IDs of videos that haven't yet been processed for poster generation.
 * @property {string} searchTerm search term
 * @property {number} totalPages total pages
 */

/**
 * 'local media' actions used internally by the reducer.
 *
 * @typedef {Object} LocalMediaContextActions
 * @property {DeleteMediaElementFn} deleteMediaElement action to delete a media
 * @property {FetchMediaErrorFn} fetchMediaError action when fetching media has
 * error
 * @property {FetchMediaStartFn} fetchMediaStart action when fetching media
 * starts
 * @property {FetchMediaSuccessFn} fetchMediaSucccess action when fetching media
 * is successful
 * @property {ResetFiltersFn} resetFilters action to reset filters
 * and then refetches the media from the server
 * @property {SetMediaTypeFn} setMediaType action to set media type
 * @property {SetNextPageFn} setNextPage action to set next page
 * @property {SetSearchTermFn} setSearchTerm action to set search term
 * @property {UpdateMediaElementFn} updateMediaElement action update media
 * @property {UploadMediaFn} uploadMedia action to upload media
 * @property {UploadVideoPosterFn} uploadVideoPoster action upload video poster
 */

// This is required so that the IDE doesn't ignore this file.
// Without it the types don't show up when you use {import('./typedefs)}.
export default {};
