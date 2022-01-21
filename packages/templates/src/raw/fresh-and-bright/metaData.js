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
  slug: 'fresh-and-bright',
  creationDate: '2021-05-29T00:00:00.000Z',
  title: _x('Fresh & Bright', 'template name', 'web-stories'),
  tags: [
    _x('Health', 'template keyword', 'web-stories'),
    _x('Bold', 'template keyword', 'web-stories'),
    _x('Joy', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Pink', 'color', 'web-stories'),
      color: '#f3d9e1',
      family: _x('Pink', 'color', 'web-stories'),
    },
    {
      label: _x('Green', 'color', 'web-stories'),
      color: '#d8ddcc',
      family: _x('Green', 'color', 'web-stories'),
    },
    {
      label: _x('Black', 'color', 'web-stories'),
      color: '#28292b',
      family: _x('Black', 'color', 'web-stories'),
    },
    {
      label: _x('White', 'color', 'web-stories'),
      color: '#fff',
      family: _x('White', 'color', 'web-stories'),
    },
    {
      label: _x('Brown', 'color', 'web-stories'),
      color: '#eadfd6',
      family: _x('Brown', 'color', 'web-stories'),
    },
  ],
  description: __(
    'The modern and bright Beauty template lends itself well as a foundation for stories covering makeup, beauty products, shopping guides, instructions & tutorials and more.',
    'web-stories'
  ),
  vertical: _x('Beauty', 'template vertical', 'web-stories'),
};
