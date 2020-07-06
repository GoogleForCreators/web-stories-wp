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
import * as types from '../types';

export const fetchMediaStart = (dispatch) => ({ pageToken }) => {
  dispatch({ type: types.FETCH_MEDIA_START, payload: { pageToken } });
};

export const fetchMediaSuccess = (dispatch) => ({
  media,
  mediaType,
  searchTerm,
  nextPageToken,
  totalPages,
}) => {
  dispatch({
    type: types.FETCH_MEDIA_SUCCESS,
    payload: { media, mediaType, searchTerm, nextPageToken, totalPages },
  });
};

export const fetchMediaError = (dispatch) => () => {
  dispatch({ type: types.FETCH_MEDIA_ERROR });
};

export const setNextPage = (dispatch) => () => {
  dispatch({ type: types.SET_NEXT_PAGE });
};

export const updateMediaElement = (dispatch) => ({ id, ...properties }) => {
  dispatch({
    type: types.UPDATE_MEDIA_ELEMENT,
    payload: {
      id,
      ...properties,
    },
  });
};

export const deleteMediaElement = (dispatch) => ({ id }) => {
  dispatch({ type: types.DELETE_MEDIA_ELEMENT, payload: { id } });
};
