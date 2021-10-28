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
import { ERRORS } from '../../../constants';
import publisherLogoReducer, { ACTION_TYPES } from '../publisherLogos';

describe('publisherLogoReducer', () => {
  const initialState = {
    error: {},
    isLoading: false,
    publisherLogos: [],
    settingSaved: false,
  };

  const MOCK_ERROR_ID = Date.now();

  beforeAll(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => MOCK_ERROR_ID);
  });

  it(`should update isLoading state when ${ACTION_TYPES.LOADING} is called`, () => {
    const result = publisherLogoReducer(
      { ...initialState },
      {
        type: ACTION_TYPES.LOADING,
      }
    );

    expect(result).toMatchObject({
      error: {},
      isLoading: true,
    });
  });

  it(`should update error state when ${ACTION_TYPES.ADD_FAILURE} is called`, () => {
    const result = publisherLogoReducer(initialState, {
      type: ACTION_TYPES.ADD_FAILURE,
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
    });
  });

  it(`should update publisherLogos state when ${ACTION_TYPES.FETCH_SUCCESS} is called`, () => {
    const result = publisherLogoReducer(initialState, {
      type: ACTION_TYPES.FETCH_SUCCESS,
      payload: {
        publisherLogos: [
          {
            id: 123,
            url: 'https://example.com',
            title: 'Logo A',
            active: true,
          },
          {
            id: 456,
            url: 'https://example.com',
            title: 'Logo A',
            active: false,
          },
        ],
      },
    });

    expect(result).toMatchObject({
      error: {},
      isLoading: false,
      publisherLogos: [
        {
          id: 123,
          url: 'https://example.com',
          title: 'Logo A',
          active: true,
        },
        {
          id: 456,
          url: 'https://example.com',
          title: 'Logo A',
          active: false,
        },
      ],
    });
  });

  it(`should update publisherLogos state when ${ACTION_TYPES.ADD_SUCCESS} is called`, () => {
    const result = publisherLogoReducer(
      {
        ...initialState,
        publisherLogos: [
          {
            id: 123,
            url: 'https://example.com',
            title: 'Logo A',
            active: true,
          },
        ],
      },
      {
        type: ACTION_TYPES.ADD_SUCCESS,
        payload: {
          publisherLogo: {
            id: 456,
            url: 'https://example.com',
            title: 'Logo A',
            active: false,
          },
        },
      }
    );

    expect(result).toMatchObject({
      error: {},
      isLoading: false,
      publisherLogos: [
        {
          id: 123,
          url: 'https://example.com',
          title: 'Logo A',
          active: true,
        },
        {
          id: 456,
          url: 'https://example.com',
          title: 'Logo A',
          active: false,
        },
      ],
    });
  });

  it(`should update publisherLogos state when ${ACTION_TYPES.UPDATE_SUCCESS} is called`, () => {
    const result = publisherLogoReducer(
      {
        ...initialState,
        publisherLogos: [
          {
            id: 123,
            url: 'https://example.com',
            title: 'Logo A',
            active: true,
          },
          {
            id: 456,
            url: 'https://example.com',
            title: 'Logo A',
            active: false,
          },
        ],
      },
      {
        type: ACTION_TYPES.UPDATE_SUCCESS,
        payload: {
          publisherLogo: {
            id: 456,
            url: 'https://example.com',
            title: 'Logo A',
            active: true,
          },
        },
      }
    );

    expect(result).toMatchObject({
      error: {},
      isLoading: false,
      publisherLogos: [
        {
          id: 123,
          url: 'https://example.com',
          title: 'Logo A',
          active: false,
        },
        {
          id: 456,
          url: 'https://example.com',
          title: 'Logo A',
          active: true,
        },
      ],
    });
  });

  it(`should update publisherLogos state when ${ACTION_TYPES.REMOVE_SUCCESS} is called`, () => {
    const result = publisherLogoReducer(
      {
        ...initialState,
        publisherLogos: [
          {
            id: 123,
            url: 'https://example.com',
            title: 'Logo A',
            active: true,
          },
          {
            id: 456,
            url: 'https://example.com',
            title: 'Logo A',
            active: false,
          },
        ],
      },
      {
        type: ACTION_TYPES.REMOVE_SUCCESS,
        payload: {
          id: 456,
        },
      }
    );

    expect(result).toMatchObject({
      error: {},
      isLoading: false,
      publisherLogos: [
        {
          id: 123,
          url: 'https://example.com',
          title: 'Logo A',
          active: true,
        },
      ],
    });
  });
});
