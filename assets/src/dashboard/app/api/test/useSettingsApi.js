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
 * External dependencies
 */
import { act, renderHook } from '@testing-library/react-hooks';
/**
 * Internal dependencies
 */
import { ERRORS } from '../../textContent';
import useSettingsApi from '../useSettingsApi';
import wpAdapter from '../wpAdapter';

describe('useSettingsApi', () => {
  it('should return an error when fetching settings API request fails', async () => {
    const { result } = renderHook(() =>
      useSettingsApi(wpAdapter, { globalStoriesSettingsApi: 'wordpress' })
    );

    await act(async () => {
      await result.current.api.fetchSettings();
    });

    expect(result.current.settings.error.message).toStrictEqual(
      ERRORS.LOAD_SETTINGS.MESSAGE
    );
  });

  it('should return an error when updating settings API request fails', async () => {
    const { result } = renderHook(() =>
      useSettingsApi(wpAdapter, { globalStoriesSettingsApi: 'wordpress' })
    );

    await act(async () => {
      await result.current.api.updateSettings('2738237892739');
    });

    expect(result.current.settings.error.message).toStrictEqual(
      ERRORS.UPDATE_EDITOR_SETTINGS.MESSAGE
    );
  });
});
