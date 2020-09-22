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

export const fetchMediaStart = (dispatch) => ({ provider, pageToken }) => {
  dispatch({
    type: types.FETCH_MEDIA_START,
    payload: {
      provider,
      pageToken,
    },
  });
};

export const fetchMediaSuccess = (dispatch) => ({
  provider,
  media,
  nextPageToken,
  totalPages,
  ...otherProperties
}) => {
  dispatch({
    type: types.FETCH_MEDIA_SUCCESS,
    payload: {
      provider,
      media,
      nextPageToken,
      totalPages,
      ...otherProperties,
    },
  });
};

export const fetchMediaError = (dispatch) => ({ provider }) => {
  dispatch({
    type: types.FETCH_MEDIA_ERROR,
    payload: { provider },
  });
};

export const setNextPage = (dispatch) => ({ provider }) => {
  dispatch({
    type: types.SET_NEXT_PAGE,
    payload: { provider },
  });
};

export const updateMediaElement = (dispatch) => ({
  provider,
  id,
  ...properties
}) => {
  dispatch({
    type: types.UPDATE_MEDIA_ELEMENT,
    payload: {
      provider,
      id,
      ...properties,
    },
  });
};

export const deleteMediaElement = (dispatch) => ({ provider, id }) => {
  dispatch({
    type: types.DELETE_MEDIA_ELEMENT,
    payload: {
      provider,
      id,
    },
  });
};
