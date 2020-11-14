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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export const ERRORS = {
  LOAD_STORIES: {
    TITLE: __('Unable to Load Stories', 'web-stories'),
    DEFAULT_MESSAGE: __('Cannot connect to data source', 'web-stories'),
  },
  UPDATE_STORY: {
    TITLE: __('Unable to Update Story', 'web-stories'),
  },
  DELETE_STORY: {
    TITLE: __('Unable to Delete Story', 'web-stories'),
  },
  CREATE_STORY_FROM_TEMPLATE: {
    TITLE: __('Unable to Create Story From Template', 'web-stories'),
  },
  DUPLICATE_STORY: {
    TITLE: __('Unable to Duplicate Story', 'web-stories'),
  },
  LOAD_TEMPLATES: {
    TITLE: __('Unable to Load Templates', 'web-stories'),
    DEFAULT_MESSAGE: __('Cannot connect to data source', 'web-stories'),
  },
  CREATE_TEMPLATE_FROM_STORY: {
    TITLE: __('Unable to Create Template from Story', 'web-stories'),
  },
  UPLOAD_PUBLISHER_LOGO: {
    TITLE: __('Unable to Add Media', 'web-stories'),
  },
  LOAD_MEDIA: {
    TITLE: __('Unable to Load Media', 'web-stories'),
  },
  LOAD_SETTINGS: {
    TITLE: __('Unable to Load Settings', 'web-stories'),
    DEFAULT_MESSAGE: __('Cannot connect to data source', 'web-stories'),
  },
  UPDATE_EDITOR_SETTINGS: {
    TITLE: __('Unable to Update Settings Data', 'web-stories'),
  },
  RENDER_PREVIEW: {
    TITLE: __('Unable to Render Preview', 'web-stories'),
  },
  LOAD_TEMPLATE: {
    DEFAULT_MESSAGE: 'Could not load the template',
  },
};
