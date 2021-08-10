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
import { __ } from '@web-stories-wp/i18n';

export const SUCCESS = {
  SETTINGS: {
    UPDATED: __('Setting saved.', 'web-stories'),
  },
};
export const ERRORS = {
  LOAD_STORIES: {
    DEFAULT_MESSAGE: __('Cannot connect to data source', 'web-stories'),
    INCOMPLETE_DATA_MESSAGE: __(
      'Unable to load all stories because of incomplete data',
      'web-stories'
    ),
    MESSAGE: __('Unable to load stories', 'web-stories'),
  },
  UPDATE_STORY: {
    MESSAGE: __('Unable to update story', 'web-stories'),
  },
  DELETE_STORY: {
    MESSAGE: __('Unable to delete story', 'web-stories'),
  },
  CREATE_STORY_FROM_TEMPLATE: {
    MESSAGE: __('Unable to create story from template', 'web-stories'),
  },
  DUPLICATE_STORY: {
    MESSAGE: __('Unable to duplicate story', 'web-stories'),
  },
  LOAD_TEMPLATES: {
    DEFAULT_MESSAGE: __('Cannot connect to data source', 'web-stories'),
    MESSAGE: __('Unable to load templates', 'web-stories'),
  },
  CREATE_TEMPLATE_FROM_STORY: {
    MESSAGE: __('Unable to create template from story', 'web-stories'),
  },
  UPLOAD_PUBLISHER_LOGO: {
    MESSAGE: __('Unable to add publisher logo', 'web-stories'),
    MESSAGE_PLURAL: __('Unable to add publisher logos', 'web-stories'),
  },
  LOAD_MEDIA: {
    MESSAGE: __('Unable to load publisher logos', 'web-stories'),
  },
  LOAD_SETTINGS: {
    DEFAULT_MESSAGE: __('Cannot connect to data source', 'web-stories'),
    MESSAGE: __('Unable to load settings', 'web-stories'),
  },
  UPDATE_EDITOR_SETTINGS: {
    MESSAGE: __('Unable to update settings data', 'web-stories'),
  },
  RENDER_PREVIEW: {
    MESSAGE: __('Unable to render preview', 'web-stories'),
  },
  LOAD_TEMPLATE: {
    DEFAULT_MESSAGE: __('Could not load the template', 'web-stories'),
  },
};
