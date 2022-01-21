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
  slug: 'indoor-garden-oasis',
  creationDate: '2021-07-12T00:00:00.000Z',
  title: _x('Indoor Garden Oasis DIY', 'template name', 'web-stories'),
  tags: [
    _x('Home', 'template keyword', 'web-stories'),
    _x('Garden', 'template keyword', 'web-stories'),
    _x('How To', 'template keyword', 'web-stories'),
    _x('Plant', 'template keyword', 'web-stories'),
    _x('Green', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Everglades Green', 'color', 'web-stories'),
      color: '#235524',
      family: _x('Green', 'color', 'web-stories'),
    },
    {
      label: _x('Mint Green', 'color', 'web-stories'),
      color: '#c2e3c3',
      family: _x('Green', 'color', 'web-stories'),
    },
    {
      label: _x('Banana Cream Yellow', 'color', 'web-stories'),
      color: '#fcefab',
      family: _x('Yellow', 'color', 'web-stories'),
    },
    {
      label: _x('White', 'color', 'web-stories'),
      color: '#fff',
      family: _x('White', 'color', 'web-stories'),
    },
    {
      label: _x('Mineral Green', 'color', 'web-stories'),
      color: '#65a867',
      family: _x('Green', 'color', 'web-stories'),
    },
  ],
  description: __(
    'This template has a perfect balance of green, earthly colors and simple but playful typography. Create stories about gardening, nature crafts, cooking recipes, and more.',
    'web-stories'
  ),
  vertical: _x('Home & Garden', 'template vertical', 'web-stories'),
};
