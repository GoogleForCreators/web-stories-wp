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
import { useCallback, useMemo, useReducer } from 'react';
import queryString from 'query-string';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

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
        payload: {
          googleAnalyticsId: response.web_stories_ga_tracking_id,
          activePublisherLogoId: response.web_stories_active_publisher_logo,
          publisherLogoIds: response.web_stories_publisher_logos,
        },
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
    async ({
      googleAnalyticsId,
      publisherLogoIds,
      publisherLogoIdToRemove,
    }) => {
      try {
        const query = {};
        if (googleAnalyticsId !== undefined) {
          query.web_stories_ga_tracking_id = googleAnalyticsId;
        }

        if (publisherLogoIds) {
          query.web_stories_publisher_logos = [
            ...new Set([...state.publisherLogoIds, ...publisherLogoIds]),
          ];
        }

        if (publisherLogoIdToRemove) {
          query.web_stories_publisher_logos = state.publisherLogoIds.filter(
            (logoId) => logoId !== publisherLogoIdToRemove
          );
        }

        const response = await dataAdapter.post(
          queryString.stringifyUrl({
            url: globalStoriesSettingsApi,
            query,
          })
        );

        dispatch({
          type: SETTINGS_ACTION_TYPES.UPDATE_SETTINGS_SUCCESS,
          payload: {
            googleAnalyticsId: response.web_stories_ga_tracking_id,
            activePublisherLogoId: response.web_stories_active_publisher_logo,
            publisherLogoIds: response.web_stories_publisher_logos,
          },
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
    [dataAdapter, globalStoriesSettingsApi, state.publisherLogoIds]
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
