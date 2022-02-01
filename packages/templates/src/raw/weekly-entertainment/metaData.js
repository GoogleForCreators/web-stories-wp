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
  slug: 'weekly-entertainment',
  creationDate: '2021-05-29T00:00:00.000Z',
  title: _x('Weekly Entertainment', 'template name', 'web-stories'),
  tags: [
    _x('Funny', 'template keyword', 'web-stories'),
    _x('Action', 'template keyword', 'web-stories'),
    _x('Hip', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Black', 'color', 'web-stories'),
      color: '#000',
      family: _x('Black', 'color', 'web-stories'),
    },
    {
      label: _x('White', 'color', 'web-stories'),
      color: '#fff',
      family: _x('White', 'color', 'web-stories'),
    },
    {
      label: _x('Pink', 'color', 'web-stories'),
      color: '#ff00d6',
      family: _x('Pink', 'color', 'web-stories'),
    },
    {
      label: _x('Gray', 'color', 'web-stories'),
      color: '#525252',
      family: _x('Gray', 'color', 'web-stories'),
    },
  ],
  description: __(
    'Cover the world of entertainment with this template that comes with an edgy, interesting look. Works well as foundation for celebrity, movie, TV and music coverage, insights and inspiration.',
    'web-stories'
  ),
  vertical: _x('Entertainment', 'template vertical', 'web-stories'),
};
