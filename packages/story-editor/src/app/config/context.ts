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
import { createContext } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import type { ConfigState } from '../../types/configProvider';

export default createContext<ConfigState>({
  autoSaveInterval: null,
  localAutoSaveInterval: 15,
  autoSaveLink: '',
  isRTL: false,
  allowedMimeTypes: {},
  storyId: null,
  dashboardLink: '',
  dashboardSettingsLink: '',
  generalSettingsLink: '',
  cdnURL: '',
  maxUpload: 0,
  capabilities: {},
  metaData: {},
  canViewDefaultTemplates: false,
  showMedia3p: false,
  encodeMarkup: false,
  ffmpegCoreUrl: '',
  apiCallbacks: {},
  styleConstants: { topOffset: 0, leftOffset: 0 },
  version: '',
  shoppingProvider: '',
  mediainfoUrl: '',
  flags: {},
  additionalTips: {},
});
