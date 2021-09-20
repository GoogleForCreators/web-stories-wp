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
import settingsReducer, {
  ACTION_TYPES,
  defaultSettingsState as initialState,
} from '../settings';

describe('settingsReducer', () => {
  const MOCK_ERROR_ID = Date.now();

  beforeAll(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => MOCK_ERROR_ID);
  });

  it(`should update settings state when ${ACTION_TYPES.FETCH_SETTINGS_SUCCESS} is called`, () => {
    const result = settingsReducer(initialState, {
      type: ACTION_TYPES.FETCH_SETTINGS_SUCCESS,
      payload: {
        googleAnalyticsId: 'fakeId12345',
        usingLegacyAnalytics: false,
        activePublisherLogoId: 5,
        publisherLogoIds: [6, 7, 8],
      },
    });
    expect(result).toMatchObject({
      error: {},
      googleAnalyticsId: 'fakeId12345',
      usingLegacyAnalytics: false,
      activePublisherLogoId: 5,
      publisherLogoIds: [5, 6, 7, 8],
    });
  });

  it(`should update settings state when ${ACTION_TYPES.FETCH_SETTINGS_FAILURE} is called`, () => {
    const result = settingsReducer(initialState, {
      type: ACTION_TYPES.FETCH_SETTINGS_FAILURE,
      payload: {
        message: ERRORS.LOAD_SETTINGS.MESSAGE,
        code: 'my_error_code',
      },
    });
    expect(result).toMatchObject({
      googleAnalyticsId: '',
      usingLegacyAnalytics: false,
      error: {
        message: ERRORS.LOAD_SETTINGS.MESSAGE,
        id: MOCK_ERROR_ID,
        code: 'my_error_code',
      },
    });
  });

  it(`should update settings state when ${ACTION_TYPES.UPDATE_SETTINGS_FAILURE} is called`, () => {
    const result = settingsReducer(initialState, {
      type: ACTION_TYPES.UPDATE_SETTINGS_FAILURE,
      payload: {
        message: ERRORS.UPDATE_EDITOR_SETTINGS.MESSAGE,
        code: 'my_error_code',
      },
    });
    expect(result).toMatchObject({
      googleAnalyticsId: '',
      usingLegacyAnalytics: false,
      error: {
        message: ERRORS.UPDATE_EDITOR_SETTINGS.MESSAGE,
        id: MOCK_ERROR_ID,
        code: 'my_error_code',
      },
    });
  });

  it(`should update settings state when ${ACTION_TYPES.UPDATE_SETTINGS_SUCCESS} is called`, () => {
    const result = settingsReducer(initialState, {
      type: ACTION_TYPES.UPDATE_SETTINGS_SUCCESS,
      payload: {
        googleAnalyticsId: 'fakeId12345NEW',
        usingLegacyAnalytics: false,
        activePublisherLogoId: 5,
        publisherLogoIds: [6, 7, 8],
      },
    });
    expect(result).toMatchObject({
      error: {},
      googleAnalyticsId: 'fakeId12345NEW',
      usingLegacyAnalytics: false,
      activePublisherLogoId: 5,
      publisherLogoIds: [5, 6, 7, 8],
    });
  });

  it(`should update settingSaved boolean when ${ACTION_TYPES.SETTING_SAVED} is called`, () => {
    const result = settingsReducer(initialState, {
      type: ACTION_TYPES.SETTING_SAVED,
      payload: true,
    });
    expect(result).toMatchObject({
      settingSaved: true,
    });
  });
});
