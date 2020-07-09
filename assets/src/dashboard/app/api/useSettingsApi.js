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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { useCallback, useMemo, useReducer } from 'react';
import queryString from 'query-string';

/**
 * Internal dependencies
 */
import settingsReducer, {
  defaultSettingsState,
  ACTION_TYPES as SETTINGS_ACTION_TYPES,
} from '../reducer/settings';

export default function useSettingsApi(
  dataAdapter,
  { globalStoriesSettingsApi }
) {
  const [state, dispatch] = useReducer(settingsReducer, defaultSettingsState);

  const fetchSettings = useCallback(async () => {
    if (!globalStoriesSettingsApi) {
      dispatch({
        type: SETTINGS_ACTION_TYPES.FETCH_SETTINGS_FAILURE,
        payload: {
          message: {
            body: __('Cannot connect to data source', 'web-stories'),
            title: __('Unable to find settings data', 'web-stories'),
          },
        },
      });
    }
    try {
      const response = await dataAdapter.get(
        queryString.stringifyUrl({
          url: globalStoriesSettingsApi,
        })
      );

      dispatch({
        type: SETTINGS_ACTION_TYPES.FETCH_SETTINGS_SUCCESS,
        payload: response,
      });
    } catch (err) {
      dispatch({
        type: SETTINGS_ACTION_TYPES.FETCH_SETTINGS_FAILURE,
        payload: {
          message: {
            body: err.message,
            title: __('Unable to find settings data', 'web-stories'),
          },
        },
      });
    }
  }, [dataAdapter, globalStoriesSettingsApi]);

  const updateSettings = useCallback(
    async (settings = {}) => {
      try {
        const response = await dataAdapter.post(
          queryString.stringifyUrl({
            url: globalStoriesSettingsApi,
            query: settings,
          })
        );

        dispatch({
          type: SETTINGS_ACTION_TYPES.UPDATE_SETTINGS_SUCCESS,
          payload: response.googleAnalyticsId,
        });
      } catch (err) {
        dispatch({
          type: SETTINGS_ACTION_TYPES.UPDATE_SETTINGS_FAILURE,
          payload: {
            message: {
              body: err.message,
              title: __('Unable to update settings data', 'web-stories'),
            },
          },
        });
      }
    },
    [dataAdapter, globalStoriesSettingsApi]
  );

  const api = useMemo(
    () => ({
      fetchSettings,
      updateSettings,
    }),
    [fetchSettings, updateSettings]
  );

  return { settings: state, api };
}
