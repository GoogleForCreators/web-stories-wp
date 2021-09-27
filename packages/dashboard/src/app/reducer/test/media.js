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
import { ERRORS } from '../../textContent';
import mediaReducer, { ACTION_TYPES } from '../media';

describe('mediaReducer', () => {
  const initialState = {
    error: {},
    isLoading: false,
    newlyCreatedMediaIds: [],
  };

  const MOCK_ERROR_ID = Date.now();

  beforeAll(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => MOCK_ERROR_ID);
  });

  it(`should update media state of isLoading and reset newlyCreatedMediaIds to an empty array when ${ACTION_TYPES.LOADING_MEDIA} is called`, () => {
    const result = mediaReducer(
      { ...initialState, newlyCreatedMediaIds: [9, 8] },
      {
        type: ACTION_TYPES.LOADING_MEDIA,
      }
    );

    expect(result).toMatchObject({
      error: {},
      isLoading: true,
      newlyCreatedMediaIds: [],
    });
  });

  it(`should update media state of error when ${ACTION_TYPES.ADD_MEDIA_FAILURE} is called`, () => {
    const result = mediaReducer(initialState, {
      type: ACTION_TYPES.ADD_MEDIA_FAILURE,
      payload: {
        message: ERRORS.UPLOAD_PUBLISHER_LOGO.MESSAGE,
        code: 'my_error_code',
      },
    });

    expect(result).toMatchObject({
      error: {
        message: ERRORS.UPLOAD_PUBLISHER_LOGO.MESSAGE,
        id: MOCK_ERROR_ID,
        code: 'my_error_code',
      },
      isLoading: false,
      newlyCreatedMediaIds: [],
    });
  });

  it(`should update media state of newlyCreatedMediaIds and mediaById when ${ACTION_TYPES.ADD_MEDIA_SUCCESS} is called`, () => {
    const result = mediaReducer(initialState, {
      type: ACTION_TYPES.ADD_MEDIA_SUCCESS,
      payload: {
        newlyCreatedMediaIds: [1, 2],
      },
    });

    expect(result).toMatchObject({
      error: {},
      isLoading: false,
      newlyCreatedMediaIds: [1, 2],
    });
  });
});
