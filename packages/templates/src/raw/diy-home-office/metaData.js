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
  slug: 'diy-home-office',
  creationDate: '2021-07-29T00:00:00.000Z',
  title: _x('DIY Home Office', 'template name', 'web-stories'),
  tags: [
    _x('Arts & Craft', 'template keyword', 'web-stories'),
    _x('Home Office', 'template keyword', 'web-stories'),
    _x('Interior', 'template keyword', 'web-stories'),
    _x('Vintage', 'template keyword', 'web-stories'),
    _x('White', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Black Pepper', 'color', 'web-stories'),
      color: '#3d3730',
      family: _x('Black', 'color', 'web-stories'),
    },
    {
      label: _x('Cannon Black', 'color', 'web-stories'),
      color: '#373737',
      family: _x('Black', 'color', 'web-stories'),
    },
    {
      label: _x('Pastel Orange', 'color', 'web-stories'),
      color: '#ffb555',
      family: _x('Orange', 'color', 'web-stories'),
    },
    {
      label: _x('White Linen', 'color', 'web-stories'),
      color: '#f6f2ed',
      family: _x('White', 'color', 'web-stories'),
    },
    {
      label: _x('Gray Beige', 'color', 'web-stories'),
      color: '#c7bbaf',
      family: _x('Gray', 'color', 'web-stories'),
    },
  ],
  description: __(
    'This template’s balanced layout and warm, pastel color palette will let you create stories about home decor, arts and crafts, and other DIY guides that are detailed and inspiring.',
    'web-stories'
  ),
  vertical: _x('Arts & Crafts', 'template vertical', 'web-stories'),
};
