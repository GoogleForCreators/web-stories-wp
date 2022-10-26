/*
 * Copyright 2021 Google LLC
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
import { __ } from '@googleforcreators/i18n';

export const SUCCESS = {
  SETTINGS: {
    UPDATED: __('Setting saved.', 'web-stories'),
  },
};

export const ERRORS = {
  UPLOAD_PUBLISHER_LOGO: {
    MESSAGE: __('Unable to add publisher logo', 'web-stories'),
    MESSAGE_PLURAL: __('Unable to add publisher logos', 'web-stories'),
  },
  REMOVE_PUBLISHER_LOGO: {
    MESSAGE: __('Unable to remove publisher logo', 'web-stories'),
  },
  REMOVE_FONT: {
    MESSAGE: __('Unable to remove font', 'web-stories'),
  },
  UPDATE_PUBLISHER_LOGO: {
    MESSAGE: __('Unable to update publisher logo', 'web-stories'),
  },
  LOAD_PUBLISHER_LOGOS: {
    MESSAGE: __('Unable to load publisher logos', 'web-stories'),
  },
  LOAD_SETTINGS: {
    MESSAGE: __('Unable to load settings', 'web-stories'),
  },
  UPDATE_EDITOR_SETTINGS: {
    MESSAGE: __('Unable to update settings data', 'web-stories'),
  },
};
