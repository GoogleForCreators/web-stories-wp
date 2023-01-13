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
  AdNetworkType,
  ArchiveType,
  Settings,
  ShoppingProviderType,
} from '../../types';

export enum ActionType {
  UpdateSettingsSuccess = 'update_settings_success',
  UpdateSettingsFailure = 'update_settings_failure',
  SettingSaved = 'setting_saved',
  FetchSettingsSuccess = 'fetch_settings_success',
  FetchSettingsFailure = 'fetch_settings_failure',
}

export const defaultSettingsState: SettingsState = {
  error: {},
  googleAnalyticsId: '',
  usingLegacyAnalytics: false,
  adSensePublisherId: '',
  adSenseSlotId: '',
  adManagerSlotId: '',
  adNetwork: AdNetworkType.None,
  archive: ArchiveType.Default,
  archivePageId: 0,
  videoCache: false,
  dataRemoval: false,
  settingSaved: false,
  shoppingProvider: ShoppingProviderType.None,
  shopifyHost: '',
  shopifyAccessToken: '',
  autoAdvance: true,
  defaultPageDuration: 7,
};

interface SettingsBaseAction {
  type: ActionType;
}

interface SuccessAction extends SettingsBaseAction {
  type: ActionType.FetchSettingsSuccess | ActionType.UpdateSettingsSuccess;
  payload: Settings;
}

interface SavedAction {
  type: ActionType.SettingSaved;
  payload: boolean;
}

interface FailureAction {
  type: ActionType.FetchSettingsFailure | ActionType.UpdateSettingsFailure;
  payload: {
    message: string;
    [key: string]: unknown;
  };
}

type SettingsAction = SuccessAction | SavedAction | FailureAction;

export interface SettingsState {
  error: {
    id?: number | string;
    message?: string;
  };
  googleAnalyticsId: string;
  usingLegacyAnalytics: boolean;
  adSensePublisherId: string;
  adSenseSlotId: string;
  adManagerSlotId: string;
  adNetwork: AdNetworkType;
  archive: ArchiveType;
  archivePageId: number;
  videoCache: boolean;
  dataRemoval: boolean;
  settingSaved: boolean;
  shoppingProvider: ShoppingProviderType;
  shopifyHost: string;
  shopifyAccessToken: string;
}

function settingsReducer(
  state: SettingsState,
  action: SettingsAction
): SettingsState {
  switch (action.type) {
    case ActionType.SettingSaved: {
      return {
        ...state,
        settingSaved: action.payload,
      };
    }

    case ActionType.UpdateSettingsFailure:
    case ActionType.FetchSettingsFailure: {
      return {
        ...state,
        error: { ...action.payload, id: Date.now() },
      };
    }

    case ActionType.FetchSettingsSuccess:
    case ActionType.UpdateSettingsSuccess: {
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
        autoAdvance: action.payload.autoAdvance,
        defaultPageDuration: action.payload.defaultPageDuration,
      };
    }

    default:
      return state;
  }
}

export default settingsReducer;
