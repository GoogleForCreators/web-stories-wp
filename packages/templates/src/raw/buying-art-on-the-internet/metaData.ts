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
  slug: 'buying-art-on-the-internet',
  creationDate: '2021-08-03T00:00:00.000Z',
  title: _x('Buying Art on the Internet', 'template name', 'web-stories'),
  tags: [
    _x('Arts & Craft', 'template keyword', 'web-stories'),
    _x('Paint', 'template keyword', 'web-stories'),
    _x('Tips', 'template keyword', 'web-stories'),
    _x('Clean', 'template keyword', 'web-stories'),
    _x('White', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('International Klein Blue', 'color', 'web-stories'),
      color: '#002fa7',
      family: _x('Blue', 'color', 'web-stories'),
    },
    {
      label: _x('Inkwell Blue', 'color', 'web-stories'),
      color: '#252a3a',
      family: _x('Blue', 'color', 'web-stories'),
    },
    {
      label: _x('White', 'color', 'web-stories'),
      color: '#fff',
      family: _x('White', 'color', 'web-stories'),
    },
  ],
  description: __(
    'This template will let you create informative stories and guides that look clean, classy and artsy. Use photos as well as videos and add links to online stores, websites and other resources.',
    'web-stories'
  ),
  vertical: _x('Arts & Crafts', 'template vertical', 'web-stories'),
};
