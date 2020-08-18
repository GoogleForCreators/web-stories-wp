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
import * as common from '../pagination/actions';
import * as types from './types';

export const fetchMediaStart = (dispatch) => (properties) =>
  common.fetchMediaStart(dispatch)({
    ...properties,
    provider: 'local',
  });
export const fetchMediaSuccess = (dispatch) => (properties) =>
  common.fetchMediaSuccess(dispatch)({
    ...properties,
    provider: 'local',
  });
export const fetchMediaError = (dispatch) => (properties) =>
  common.fetchMediaError(dispatch)({
    ...properties,
    provider: 'local',
  });
export const setNextPage = (dispatch) => (properties) =>
  common.setNextPage(dispatch)({ ...properties, provider: 'local' });
export const updateMediaElement = (dispatch) => (properties) =>
  common.updateMediaElement(dispatch)({
    ...properties,
    provider: 'local',
  });
export const deleteMediaElement = (dispatch) => (properties) =>
  common.deleteMediaElement(dispatch)({
    ...properties,
    provider: 'local',
  });

export const resetFilters = (dispatch) => () => {
  dispatch({ type: types.LOCAL_MEDIA_RESET_FILTERS });
};

export const setSearchTerm = (dispatch) => ({ searchTerm }) => {
  dispatch({
    type: types.LOCAL_MEDIA_SET_SEARCH_TERM,
    payload: { searchTerm },
  });
};

export const setMediaType = (dispatch) => ({ mediaType }) => {
  dispatch({ type: types.LOCAL_MEDIA_SET_MEDIA_TYPE, payload: { mediaType } });
};

export const setProcessing = (dispatch) => ({ id }) => {
  dispatch({ type: types.LOCAL_MEDIA_ADD_PROCESSING, payload: { id } });
};

export const removeProcessing = (dispatch) => ({ id }) => {
  dispatch({ type: types.LOCAL_MEDIA_REMOVE_PROCESSING, payload: { id } });
};

export const setMedia = (dispatch) => ({ media }) => {
  dispatch({
    type: types.LOCAL_MEDIA_SET_MEDIA,
    payload: { media },
  });
};
