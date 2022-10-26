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

import type { LocaleData } from '@googleforcreators/i18n';

import type { WPDashboardConfig } from '../types';

declare global {
  let __webpack_public_path__: string;

  interface Window {
    webStories: {
      localeData: LocaleData;
      publicPath: string;
      initializeStoryDashboard: (id: string, config: WPDashboardConfig) => void;
    };
  }
}
