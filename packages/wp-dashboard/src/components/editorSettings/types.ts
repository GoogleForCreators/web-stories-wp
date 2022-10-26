/*
 * Copyright 2022 Google LLC
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
import type { MediaState } from '../../api/reducers/media';
import type { SettingsState } from '../../api/reducers/settings';
import type { PublisherLogosState } from '../../api/reducers/publisherLogos';
import type { User } from '../../api/user';
import type { WordPressFont } from '../../types';

export interface State {
  state: {
    media: MediaState;
    settings: SettingsState;
    currentUser: {
      data: User | null;
      isUpdating: boolean;
    };
    customFonts: WordPressFont[];
    publisherLogos: PublisherLogosState;
  };
  actions: {
    fontsApi: {
      addCustomFont: unknown;
      deleteCustomFont: unknown;
      fetchCustomFonts: unknown;
    };
    settingsApi: {
      fetchSettings: unknown;
      updateSettings: unknown;
    };
    pagesApi: {
      searchPages: unknown;
      getPageById: unknown;
    };
    mediaApi: {
      uploadMedia: unknown;
    };
    publisherLogosApi: {
      fetchPublisherLogos: unknown;
      addPublisherLogo: unknown;
      removePublisherLogo: unknown;
      setPublisherLogoAsDefault: unknown;
    };
  };
}
