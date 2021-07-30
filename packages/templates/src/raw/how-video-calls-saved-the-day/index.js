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
import { __, _x } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { default as template } from './template';

export default {
  title: _x('How Video Calls Saved the Day', 'template name', 'web-stories'),
  tags: [
    _x('Technology', 'template keyword', 'web-stories'),
    _x('Remote', 'template keyword', 'web-stories'),
    _x('Video', 'template keyword', 'web-stories'),
    _x('Bright', 'template keyword', 'web-stories'),
    _x('Yellow', 'template keyword', 'web-stories'),
  ],
  colors: [
    { label: _x('Eclipse Black', 'color', 'web-stories'), color: '#3a3a3a' },
    { label: _x('White', 'color', 'web-stories'), color: '#fff' },
    { label: _x('Amber Yellow', 'color', 'web-stories'), color: '#ffbf0b' },
  ],
  description: __(
    'This template has a quirky font and a lively color palette that will let you create cool tech stories and turn boring content into narratives that are fun and entertaining.',
    'web-stories'
  ),
  ...template,
  vertical: _x('Technology', 'template vertical', 'web-stories'),
};
