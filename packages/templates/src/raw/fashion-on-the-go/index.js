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
import { __, _x } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { default as template } from './template';

export default {
  title: _x('Fashion On The Go', 'template name', 'web-stories'),
  tags: [
    _x('Clothing', 'template keyword', 'web-stories'),
    _x('Sparkle', 'template keyword', 'web-stories'),
  ],
  colors: [
    { label: _x('Cream', 'color', 'web-stories'), color: '#ffece3' },
    { label: _x('Orange', 'color', 'web-stories'), color: '#ff3000' },
    { label: _x('Black', 'color', 'web-stories'), color: '#212121' },
    { label: _x('Grey', 'color', 'web-stories'), color: '#858280' },
    { label: _x('White', 'color', 'web-stories'), color: '#fff' },
  ],
  description: __(
    'The elegant serif Fashion template works well for New York Fashion Week highlights, high fashion shopping guides and accessory trends.',
    'web-stories'
  ),
  pages: template.pages,
  version: template.version,
  vertical: _x('Fashion', 'template vertical', 'web-stories'),
};
