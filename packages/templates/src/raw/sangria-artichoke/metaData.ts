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
  slug: 'sangria-artichoke',
  creationDate: '2021-06-28T00:00:00.000Z',
  title: _x('Trendy Winter Veggie', 'template name', 'web-stories'),
  tags: [
    _x('Food', 'template keyword', 'web-stories'),
    _x('Healthy', 'template keyword', 'web-stories'),
    _x('Recipe', 'template keyword', 'web-stories'),
    _x('How-To', 'template keyword', 'web-stories'),
    _x('Earthy', 'template keyword', 'web-stories'),
    _x('Vegan', 'template keyword', 'web-stories'),
    _x('Green', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Jewel Green', 'color', 'web-stories'),
      color: '#0e662a',
      family: _x('Green', 'color', 'web-stories'),
    },
    {
      label: _x('Tabasco Red', 'color', 'web-stories'),
      color: '#9f240f',
      family: _x('Red', 'color', 'web-stories'),
    },
    {
      label: _x('Yukon Sky Gray', 'color', 'web-stories'),
      color: '#dfe3e4',
      family: _x('Gray', 'color', 'web-stories'),
    },
    {
      label: _x('White', 'color', 'web-stories'),
      color: '#fff',
      family: _x('White', 'color', 'web-stories'),
    },
  ],
  description: __(
    'From veggies, with love. This template’s natural green color palette and lively typography will inspire your audience to cook a healthy meal today.',
    'web-stories'
  ),
  vertical: _x('Cooking', 'template vertical', 'web-stories'),
} as MetaData;
