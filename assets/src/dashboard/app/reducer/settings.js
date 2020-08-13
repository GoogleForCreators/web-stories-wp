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

export const ACTION_TYPES = {
  UPDATE_SETTINGS_SUCCESS: 'update_settings_success',
  UPDATE_SETTINGS_FAILURE: 'update_settings_failure',
  FETCH_SETTINGS_SUCCESS: 'fetch_settings_success',
  FETCH_SETTINGS_FAILURE: 'fetch_settings_failure',
};

export const defaultSettingsState = {
  activePublisherLogoId: null,
  error: {},
  googleAnalyticsId: '',
  publisherLogoIds: [],
};

function settingsReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_SETTINGS_FAILURE:
    case ACTION_TYPES.FETCH_SETTINGS_FAILURE: {
      return {
        ...state,
        error: { ...action.payload, id: Date.now() },
      };
    }

    case ACTION_TYPES.UPDATE_SETTINGS_SUCCESS:
    case ACTION_TYPES.FETCH_SETTINGS_SUCCESS: {
      console.log('action payload ', action.payload);
      return {
        ...state,
        activePublisherLogoId: action.payload.web_stories_active_publisher_logo,
        error: {},
        googleAnalyticsId: action.payload.web_stories_ga_tracking_id,
        publisherLogoIds: [
          action.payload.web_stories_active_publisher_logo,
          ...state.publisherLogoIds,
          ...action.payload.web_stories_publisher_logos,
        ],
      };
    }

    default:
      return state;
  }
}

export default settingsReducer;
