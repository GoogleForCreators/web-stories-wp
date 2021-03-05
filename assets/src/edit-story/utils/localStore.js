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
import { trackError } from '@web-stories-wp/tracking';

export const LOCAL_STORAGE_PREFIX = {
  PANEL: 'web_stories_ui_panel_settings',
  TEXT_SET_SETTINGS: 'web_stores_text_set_settings',
  TERMS_MEDIA3P: 'web_stories_media3p_terms_agreement',
  VIDEO_OPTIMIZATION_DIALOG_DISMISSED:
    'web_stories_video_optimization_dialog_dismissed',
  HELP_CENTER: 'web_stories_help_center',
};

function getItemByKey(key) {
  let parsed = null;
  try {
    const stored = localStorage.getItem(key);
    parsed = JSON.parse(stored);
  } catch (e) {
    trackError('local_storage_read', e.message);
  }
  return parsed;
}

function setItemByKey(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    trackError('local_storage_write', e.message);
  }
}

export default {
  getItemByKey,
  setItemByKey,
};
