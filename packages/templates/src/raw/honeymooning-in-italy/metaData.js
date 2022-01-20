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
  slug: 'honeymooning-in-italy',
  creationDate: '2021-07-29T00:00:00.000Z',
  title: _x('Honeymooning in Italy', 'template name', 'web-stories'),
  tags: [
    _x('Travel', 'template keyword', 'web-stories'),
    _x('Outdoor', 'template keyword', 'web-stories'),
    _x('Floral', 'template keyword', 'web-stories'),
    _x('Collage', 'template keyword', 'web-stories'),
    _x('Brown', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Night Green', 'color', 'web-stories'),
      color: '#232c27',
      family: _x('Green', 'color', 'web-stories'),
    },
    {
      label: _x('Light Brownish Pink', 'color', 'web-stories'),
      color: '#f2e5d6',
      family: _x('Pink', 'color', 'web-stories'),
    },
    {
      label: _x('Parchment White', 'color', 'web-stories'),
      color: '#fef6df',
      family: _x('White', 'color', 'web-stories'),
    },
  ],
  description: __(
    'With its elegant typography, charming colors and exquisite floral design pattern, this template will let you create lush travel guides, itineraries, bucket lists, travelogues and more.',
    'web-stories'
  ),
  vertical: _x('Travel', 'template vertical', 'web-stories'),
};
