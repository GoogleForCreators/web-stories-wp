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
  slug: 'an-artists-legacy',
  creationDate: '2021-08-25T00:00:00.000Z',
  title: _x('An Artist’s Legacy', 'template name', 'web-stories'),
  tags: [
    _x('Arts & Crafts', 'template keyword', 'web-stories'),
    _x('Paint', 'template keyword', 'web-stories'),
    _x('Artist', 'template keyword', 'web-stories'),
    _x('Story', 'template keyword', 'web-stories'),
    _x('Gray', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Lavender Gray', 'color', 'web-stories'),
      color: '#eaeef4',
      family: _x('Gray', 'color', 'web-stories'),
    },
    {
      label: _x('Baby Beluga Gray', 'color', 'web-stories'),
      color: '#4d4c48',
      family: _x('Gray', 'color', 'web-stories'),
    },
    {
      label: _x('Pale Orange', 'color', 'web-stories'),
      color: '#ffdcc0',
      family: _x('Orange', 'color', 'web-stories'),
    },
    {
      label: _x('Meringue White', 'color', 'web-stories'),
      color: '#fbf5f1',
      family: _x('White', 'color', 'web-stories'),
    },
  ],
  description: __(
    'With its artistic brush strokes, white background, and art gallery-like arrangement of photos, this template will let you create beautiful stories around painting, sculpting and other arts and crafts.',
    'web-stories'
  ),
  vertical: _x('Arts & Crafts', 'template vertical', 'web-stories'),
};
