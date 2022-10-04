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
  slug: 'series-best-of',
  creationDate: '2021-08-25T00:00:00.000Z',
  title: _x('Series - Best Of', 'template name', 'web-stories'),
  tags: [
    _x('Entertainment', 'template keyword', 'web-stories'),
    _x('Roundup', 'template keyword', 'web-stories'),
    _x('Banners', 'template keyword', 'web-stories'),
    _x('Classic', 'template keyword', 'web-stories'),
    _x('Yellow', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Zinc Yellow', 'color', 'web-stories'),
      color: '#ffe145',
      family: _x('Yellow', 'color', 'web-stories'),
    },
    {
      label: _x('Black', 'color', 'web-stories'),
      color: '#000',
      family: _x('Black', 'color', 'web-stories'),
    },
    {
      label: _x('Mercury Gray', 'color', 'web-stories'),
      color: '#e3e3e3',
      family: _x('Gray', 'color', 'web-stories'),
    },
  ],
  description: __(
    'This template’s simple banners and classic font make it great for creating bite-sized informational stories. Easily change the colors and use it to create stories for a variety of different topics like technology, entertainment, arts and crafts and more.',
    'web-stories'
  ),
  vertical: _x('Entertainment', 'template vertical', 'web-stories'),
};
