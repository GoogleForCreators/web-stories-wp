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
 * Internal dependencies
 */
import settingsReducer, {
  defaultSettingsState,
  ACTION_TYPES as SETTINGS_ACTION_TYPES,
} from '../reducer/settings';
import { ERRORS } from '../textContent';

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
          message: ERRORS.LOAD_SETTINGS.DEFAULT_MESSAGE,
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
          adSensePublisherId: response.web_stories_adsense_publisher_id,
          adSenseSlotId: response.web_stories_adsense_slot_id,
          adManagerSlotId: response.web_stories_ad_manager_slot_id,
          adNetwork: response.web_stories_ad_network,
          activePublisherLogoId: response.web_stories_active_publisher_logo,
          publisherLogoIds: response.web_stories_publisher_logos,
        },
      });
    } catch (err) {
      dispatch({
        type: SETTINGS_ACTION_TYPES.FETCH_SETTINGS_FAILURE,
        payload: {
          message: ERRORS.LOAD_SETTINGS.MESSAGE,
        },
      });
    }
  }, [dataAdapter, globalStoriesSettingsApi]);

  const updateSettings = useCallback(
    async ({
      googleAnalyticsId,
      adSensePublisherId,
      adSenseSlotId,
      adManagerSlotId,
      adNetwork,
      publisherLogoIds,
      publisherLogoIdToRemove,
      publisherLogoToMakeDefault,
    }) => {
      try {
        const query = {};
        if (googleAnalyticsId !== undefined) {
          query.web_stories_ga_tracking_id = googleAnalyticsId;
        }

        if (adSensePublisherId !== undefined) {
          query.web_stories_adsense_publisher_id = adSensePublisherId;
        }

        if (adSenseSlotId !== undefined) {
          query.web_stories_adsense_slot_id = adSenseSlotId;
        }

        if (adManagerSlotId !== undefined) {
          query.web_stories_ad_manager_slot_id = adManagerSlotId;
        }

        if (adNetwork !== undefined) {
          query.web_stories_ad_network = adNetwork;
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

        if (publisherLogoToMakeDefault) {
          query.web_stories_active_publisher_logo = publisherLogoToMakeDefault;
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
            adSensePublisherId: response.web_stories_adsense_publisher_id,
            adSenseSlotId: response.web_stories_adsense_slot_id,
            adManagerSlotId: response.web_stories_ad_manager_slot_id,
            adNetwork: response.web_stories_ad_network,
            activePublisherLogoId: response.web_stories_active_publisher_logo,
            publisherLogoIds: response.web_stories_publisher_logos,
          },
        });
      } catch (err) {
        dispatch({
          type: SETTINGS_ACTION_TYPES.UPDATE_SETTINGS_FAILURE,
          payload: {
            message: ERRORS.UPDATE_EDITOR_SETTINGS.MESSAGE,
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
