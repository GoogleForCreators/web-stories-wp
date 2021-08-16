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
  creationDate: new Date(2021, 7, 9),
  title: _x('Vintage Chair Buying Guide', 'template name', 'web-stories'),
  tags: [
    _x('Home', 'template keyword', 'web-stories'),
    _x('Decor', 'template keyword', 'web-stories'),
    _x('Guide', 'template keyword', 'web-stories'),
    _x('Modern', 'template keyword', 'web-stories'),
    _x('Green', 'template keyword', 'web-stories'),
  ],
  colors: [
    { label: _x('Snowfall White', 'color', 'web-stories'), color: '#f3f2f0' },
    { label: _x('Dark Metal Green', 'color', 'web-stories'), color: '#313831' },
    { label: _x('Platinum Blue', 'color', 'web-stories'), color: '#dbe2e7' },
  ],
  description: __(
    'Present fresh and innovative ideas about home decor and renovation with this clean and modern-looking template. Create furniture buying guides, stories about interior design, garden inspiration and more.',
    'web-stories'
  ),
  ...template,
  vertical: _x('Home & Garden', 'template vertical', 'web-stories'),
};
