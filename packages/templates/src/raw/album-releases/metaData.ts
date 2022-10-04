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
  slug: 'album-releases',
  creationDate: '2021-06-28T00:00:00.000Z',
  title: _x('Album Releases', 'template name', 'web-stories'),
  tags: [
    _x('Entertainment', 'template keyword', 'web-stories'),
    _x('Music', 'template keyword', 'web-stories'),
    _x('Album', 'template keyword', 'web-stories'),
    _x('Trending', 'template keyword', 'web-stories'),
    _x('Blue', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Hot Orange', 'color', 'web-stories'),
      color: '#f7722f',
      family: _x('Orange', 'color', 'web-stories'),
    },
    {
      label: _x('Peach Bisque', 'color', 'web-stories'),
      color: '#fee2c6',
      family: _x('Orange', 'color', 'web-stories'),
    },
    {
      label: _x('Champagne Yellow', 'color', 'web-stories'),
      color: '#f4e6b0',
      family: _x('Yellow', 'color', 'web-stories'),
    },
    {
      label: _x('Cola Brown', 'color', 'web-stories'),
      color: '#3d3225',
      family: _x('Brown', 'color', 'web-stories'),
    },
  ],
  description: __(
    'With its raw typography and mesmerizing visual elements, the Album Releases template will let you create listicles that engage. Switch the colors and make it your own.',
    'web-stories'
  ),
  vertical: _x('Music', 'template vertical', 'web-stories'),
};
