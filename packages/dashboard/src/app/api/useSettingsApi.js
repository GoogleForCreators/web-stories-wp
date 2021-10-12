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
import { useCallback, useReducer } from '@web-stories-wp/react';

/**
 * Internal dependencies
 */
import settingsReducer, {
  defaultSettingsState,
  ACTION_TYPES as SETTINGS_ACTION_TYPES,
} from '../reducer/settings';
import { ERRORS } from '../textContent';
import { useConfig } from '../config';

export default function useSettingsApi() {
  const [state, dispatch] = useReducer(settingsReducer, defaultSettingsState);
  const {
    apiCallbacks: {
      fetchSettings: fetchSettingsCallback,
      updateSettings: updateSettingsCallback,
    },
  } = useConfig();

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetchSettingsCallback();

      dispatch({
        type: SETTINGS_ACTION_TYPES.FETCH_SETTINGS_SUCCESS,
        payload: response,
      });
    } catch (err) {
      dispatch({
        type: SETTINGS_ACTION_TYPES.FETCH_SETTINGS_FAILURE,
        payload: {
          message: ERRORS.LOAD_SETTINGS.MESSAGE,
        },
      });
    }
  }, [fetchSettingsCallback]);

  const updateSettings = useCallback(
    async (queryParams) => {
      dispatch({ type: SETTINGS_ACTION_TYPES.SETTING_SAVED });
      try {
        const response = await updateSettingsCallback(queryParams);

        dispatch({
          type: SETTINGS_ACTION_TYPES.UPDATE_SETTINGS_SUCCESS,
          payload: response,
        });
        dispatch({ type: SETTINGS_ACTION_TYPES.SETTING_SAVED, payload: true });
      } catch (err) {
        dispatch({
          type: SETTINGS_ACTION_TYPES.UPDATE_SETTINGS_FAILURE,
          payload: {
            message: ERRORS.UPDATE_EDITOR_SETTINGS.MESSAGE,
          },
        });
      }
    },
    [updateSettingsCallback]
  );

  return {
    settings: state,
    api: {
      fetchSettings,
      updateSettings,
    },
  };
}
