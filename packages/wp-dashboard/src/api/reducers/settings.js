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
import {
  AD_NETWORK_TYPE,
  ARCHIVE_TYPE,
  SHOPPING_PROVIDER_TYPE,
} from '../../constants';

export const ACTION_TYPES = {
  UPDATE_SETTINGS_SUCCESS: 'update_settings_success',
  UPDATE_SETTINGS_FAILURE: 'update_settings_failure',
  SETTING_SAVED: 'setting_saved',
  FETCH_SETTINGS_SUCCESS: 'fetch_settings_success',
  FETCH_SETTINGS_FAILURE: 'fetch_settings_failure',
};

export const defaultSettingsState = {
  error: {},
  googleAnalyticsId: '',
  usingLegacyAnalytics: false,
  adSensePublisherId: '',
  adSenseSlotId: '',
  adManagerSlotId: '',
  adNetwork: AD_NETWORK_TYPE.NONE,
  archive: ARCHIVE_TYPE.DEFAULT,
  archivePageId: 0,
  videoCache: false,
  dataRemoval: false,
  settingSaved: false,
  shoppingProvider: SHOPPING_PROVIDER_TYPE.NONE,
  shopifyHost: '',
  shopifyAccessToken: '',
};

function settingsReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.SETTING_SAVED: {
      return {
        ...state,
        settingSaved: action.payload,
      };
    }

    case ACTION_TYPES.UPDATE_SETTINGS_FAILURE:
    case ACTION_TYPES.FETCH_SETTINGS_FAILURE: {
      return {
        ...state,
        error: { ...action.payload, id: Date.now() },
      };
    }

    case ACTION_TYPES.FETCH_SETTINGS_SUCCESS:
    case ACTION_TYPES.UPDATE_SETTINGS_SUCCESS: {
      return {
        ...state,
        error: {},
        googleAnalyticsId: action.payload.googleAnalyticsId,
        usingLegacyAnalytics: action.payload.usingLegacyAnalytics,
        adSensePublisherId: action.payload.adSensePublisherId,
        adSenseSlotId: action.payload.adSenseSlotId,
        adManagerSlotId: action.payload.adManagerSlotId,
        adNetwork: action.payload.adNetwork,
        videoCache: action.payload.videoCache,
        dataRemoval: action.payload.dataRemoval,
        archive: action.payload.archive,
        archivePageId: action.payload.archivePageId,
        shoppingProvider: action.payload.shoppingProvider,
        shopifyHost: action.payload.shopifyHost,
        shopifyAccessToken: action.payload.shopifyAccessToken,
      };
    }

    default:
      return state;
  }
}

export default settingsReducer;
