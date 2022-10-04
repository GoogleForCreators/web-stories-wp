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
import { __, _x } from '@googleforcreators/i18n';

export default {
  slug: 'kitchen-makeover',
  creationDate: '2021-07-29T00:00:00.000Z',
  title: _x('Kitchen Makeover', 'template name', 'web-stories'),
  tags: [
    _x('Home & Garden', 'template keyword', 'web-stories'),
    _x('Interior Design', 'template keyword', 'web-stories'),
    _x('Interior Decoration', 'template keyword', 'web-stories'),
    _x('Modern', 'template keyword', 'web-stories'),
    _x('Brown', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Crater Brown', 'color', 'web-stories'),
      color: '#44272b',
      family: _x('Brown', 'color', 'web-stories'),
    },
    {
      label: _x('Flour White', 'color', 'web-stories'),
      color: '#f3f3f1',
      family: _x('White', 'color', 'web-stories'),
    },
    {
      label: _x('Frost Gray', 'color', 'web-stories'),
      color: '#eeece5',
      family: _x('Gray', 'color', 'web-stories'),
    },
    {
      label: _x('Quill Gray', 'color', 'web-stories'),
      color: '#d7d6d2',
      family: _x('Gray', 'color', 'web-stories'),
    },
    {
      label: _x('White', 'color', 'web-stories'),
      color: '#ffffff',
      family: _x('White', 'color', 'web-stories'),
    },
  ],
  description: __(
    'This template’s gray color palette is the perfect neutral that goes well with everything. Use photos and videos to create contemporary as well as old-school interior design and home inspiration stories.',
    'web-stories'
  ),
  vertical: _x('Home & Garden', 'template vertical', 'web-stories'),
};
