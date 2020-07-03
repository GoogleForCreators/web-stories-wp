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
  UPDATE_GOOGLE_ANALYTICS_SUCCESS: 'update_google_analytics_success',
  UPDATE_GOOGLE_ANALYTICS_FAILURE: 'update_google_analytics_failure',
  FETCH_GOOGLE_ANALYTICS_SUCCESS: 'fetch_google_analytics_success',
  FETCH_GOOGLE_ANALYTICS_FAILURE: 'fetch_google_analytics_failure',
};

export const defaultSettingsState = {
  error: {},
  googleAnalyticsId: null,
};

function settingsReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_GOOGLE_ANALYTICS_FAILURE:
    case ACTION_TYPES.FETCH_GOOGLE_ANALYTICS_FAILURE: {
      return {
        ...state,
        error: { ...action.payload, id: Date.now() },
      };
    }

    case ACTION_TYPES.UPDATE_GOOGLE_ANALYTICS_SUCCESS:
    case ACTION_TYPES.FETCH_GOOGLE_ANALYTICS_SUCCESS: {
      return {
        ...state,
        error: {},
        googleAnalyticsId: action.payload,
      };
    }

    default:
      return state;
  }
}

export default settingsReducer;
