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
  slug: 'rock-music-festival',
  creationDate: '2021-08-03T00:00:00.000Z',
  title: _x('Rock Music Festival', 'template name', 'web-stories'),
  tags: [
    _x('Entertainment', 'template keyword', 'web-stories'),
    _x('Concert', 'template keyword', 'web-stories'),
    _x('Music', 'template keyword', 'web-stories'),
    _x('Festival', 'template keyword', 'web-stories'),
    _x('Black', 'template keyword', 'web-stories'),
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
      label: _x('Mercury Gray', 'color', 'web-stories'),
      color: '#e3e3e3',
      family: _x('Gray', 'color', 'web-stories'),
    },
    {
      label: _x('Festive Orange', 'color', 'web-stories'),
      color: '#f8754c',
      family: _x('Orange', 'color', 'web-stories'),
    },
  ],
  description: __(
    'With its powerful headlines and tantalizing visuals, this template is great for creating energetic stories about rock concerts, music festivals, concert tours and more.',
    'web-stories'
  ),
  vertical: _x('Entertainment', 'template vertical', 'web-stories'),
};
