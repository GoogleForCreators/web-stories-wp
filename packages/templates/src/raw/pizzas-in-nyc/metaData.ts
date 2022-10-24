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

/**
 * Internal dependencies
 */
import type { MetaData } from '../../types';

export default {
  slug: 'pizzas-in-nyc',
  creationDate: '2021-07-12T00:00:00.000Z',
  title: _x('Pizzas in NYC', 'template name', 'web-stories'),
  tags: [
    _x('Travel', 'template keyword', 'web-stories'),
    _x('Food', 'template keyword', 'web-stories'),
    _x('Restaurant', 'template keyword', 'web-stories'),
    _x('Pizza', 'template keyword', 'web-stories'),
    _x('Orange', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Canyon Orange', 'color', 'web-stories'),
      color: '#a36431',
      family: _x('Orange', 'color', 'web-stories'),
    },
    {
      label: _x('Warm Yellow', 'color', 'web-stories'),
      color: '#f8bc63',
      family: _x('Yellow', 'color', 'web-stories'),
    },
    {
      label: _x('Raisin Black', 'color', 'web-stories'),
      color: '#262626',
      family: _x('Black', 'color', 'web-stories'),
    },
    {
      label: _x('Magnolia White', 'color', 'web-stories'),
      color: '#fef9f1',
      family: _x('White', 'color', 'web-stories'),
    },
  ],
  description: __(
    'Use the neutral typography, layout, and brush strokes of this template to your advantage and turn it into your own beautiful travel story, tutorial, or even a cooking recipe. Mix, match and reuse the pages, and change the colors to fit your style.',
    'web-stories'
  ),
  vertical: _x('Travel', 'template vertical', 'web-stories'),
} as MetaData;
