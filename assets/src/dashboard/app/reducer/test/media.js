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
import mediaReducer, { ACTION_TYPES } from '../media';

describe('mediaReducer', () => {
  const initialState = {
    error: {},
    isLoading: false,
    uploadedMediaIds: [],
    publisherLogos: {},
  };

  const MOCK_ERROR_ID = Date.now();

  beforeAll(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => MOCK_ERROR_ID);
  });

  it(`should update media state of isLoading and reset uploadedMediaIds to an empty array when ${ACTION_TYPES.LOADING_MEDIA} is called`, () => {
    const result = mediaReducer(
      { ...initialState, uploadedMediaIds: [9, 8] },
      {
        type: ACTION_TYPES.LOADING_MEDIA,
      }
    );

    expect(result).toMatchObject({
      error: {},
      isLoading: true,
      uploadedMediaIds: [],
      publisherLogos: {},
    });
  });

  it(`should update media state of error when ${ACTION_TYPES.FETCH_MEDIA_FAILURE} is called`, () => {
    const result = mediaReducer(initialState, {
      type: ACTION_TYPES.FETCH_MEDIA_FAILURE,
      payload: {
        message: {
          body: 'The response is not a valid JSON response.',
          title: 'Unable to fetch media',
        },
        code: 'my_error_code',
      },
    });

    expect(result).toMatchObject({
      error: {
        message: {
          body: 'The response is not a valid JSON response.',
          title: 'Unable to fetch media',
        },
        id: MOCK_ERROR_ID,
        code: 'my_error_code',
      },
      isLoading: false,
      uploadedMediaIds: [],
      publisherLogos: {},
    });
  });

  it(`should update media state of error when ${ACTION_TYPES.ADD_MEDIA_FAILURE} is called`, () => {
    const result = mediaReducer(initialState, {
      type: ACTION_TYPES.ADD_MEDIA_FAILURE,
      payload: {
        message: {
          body: 'The response is not a valid JSON response.',
          title: 'Unable to add media',
        },
        code: 'my_error_code',
      },
    });

    expect(result).toMatchObject({
      error: {
        message: {
          body: 'The response is not a valid JSON response.',
          title: 'Unable to add media',
        },
        id: MOCK_ERROR_ID,
        code: 'my_error_code',
      },
      isLoading: false,
      uploadedMediaIds: [],
      publisherLogos: {},
    });
  });

  it(`should update media state of uploadedMediaIds and publisherLogos when ${ACTION_TYPES.ADD_MEDIA_SUCCESS} is called`, () => {
    const result = mediaReducer(initialState, {
      type: ACTION_TYPES.ADD_MEDIA_SUCCESS,
      payload: [
        {
          id: 1,
          source_url: 'fakeimgsource',
          title: { rendered: 'image 1 title' },
        },
        {
          id: 2,
          source_url: 'fakeimgsource',
          title: { rendered: 'image 2 title' },
        },
      ],
    });

    expect(result).toMatchObject({
      error: {},
      isLoading: false,
      uploadedMediaIds: [1, 2],
      publisherLogos: {
        1: { id: 1, src: 'fakeimgsource', title: 'image 1 title' },
        2: { id: 2, src: 'fakeimgsource', title: 'image 2 title' },
      },
    });
  });

  it(`should update media state of publisherLogos when ${ACTION_TYPES.FETCH_MEDIA_SUCCESS} is called`, () => {
    const result = mediaReducer(
      {
        ...initialState,
        publisherLogos: {
          7: { id: 7, src: 'fakeimgsource', title: 'image 7 title' },
          4: { id: 4, src: 'fakeimgsource', title: 'image 4 title' },
        },
      },
      {
        type: ACTION_TYPES.FETCH_MEDIA_SUCCESS,
        payload: [
          {
            id: 1,
            source_url: 'fakeimgsource',
            title: { rendered: 'image 1 title' },
          },
          {
            id: 2,
            source_url: 'fakeimgsource',
            title: { rendered: 'image 2 title' },
          },
        ],
      }
    );

    expect(result).toMatchObject({
      error: {},
      isLoading: false,
      uploadedMediaIds: [],
      publisherLogos: {
        1: { id: 1, src: 'fakeimgsource', title: 'image 1 title' },
        2: { id: 2, src: 'fakeimgsource', title: 'image 2 title' },
        7: { id: 7, src: 'fakeimgsource', title: 'image 7 title' },
        4: { id: 4, src: 'fakeimgsource', title: 'image 4 title' },
      },
    });
  });
});
