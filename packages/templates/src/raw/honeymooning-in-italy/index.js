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
  title: _x('Honeymooning in Italy', 'template name', 'web-stories'),
  tags: [
    _x('Entertainment', 'template keyword', 'web-stories'),
    _x('Music', 'template keyword', 'web-stories'),
    _x('Album', 'template keyword', 'web-stories'),
    _x('Trending', 'template keyword', 'web-stories'),
    _x('Blue', 'template keyword', 'web-stories'),
  ],
  colors: [
    { label: _x('Night Green', 'color', 'web-stories'), color: '#232c27' },
    {
      label: _x('Light Brownish Pink', 'color', 'web-stories'),
      color: '#f2e5d6',
    },
    { label: _x('Parchment White', 'color', 'web-stories'), color: '#fef6df' },
  ],
  description: __(
    'With its elegant typography, charming colors and exquisite floral design pattern, this template will let you create lush travel guides, itineraries, bucket lists, travelogues and more.',
    'web-stories'
  ),
  ...template,
  vertical: _x('Travel', 'template vertical', 'web-stories'),
};
