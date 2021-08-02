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
  title: _x('Ace Hotel Kyoto Review', 'template name', 'web-stories'),
  tags: [
    _x('Travel', 'template keyword', 'web-stories'),
    _x('Reviews', 'template keyword', 'web-stories'),
    _x('Hotel', 'template keyword', 'web-stories'),
    _x('Minimal', 'template keyword', 'web-stories'),
    _x('Green', 'template keyword', 'web-stories'),
  ],
  colors: [
    { label: _x('Plankton Green', 'color', 'web-stories'), color: '#19584d' },
    { label: _x('Black', 'color', 'web-stories'), color: '#000' },
    { label: _x('Rhino Gray-Blue', 'color', 'web-stories'), color: '#374456' },
    { label: _x('White', 'color', 'web-stories'), color: '#fff' },
    { label: _x('Dawn Gray', 'color', 'web-stories'), color: '#b7bfc9' },
    { label: _x('Blueberry Gray', 'color', 'web-stories'), color: '#6f7f94' },
  ],
  description: __(
    'With its plain font and boxy design, this template has an industrial and authoritative look. Use photos and videos to create compelling hotel reviews that inspire trust and confidence.',
    'web-stories'
  ),
  ...template,
  vertical: _x('Travel', 'template vertical', 'web-stories'),
};
