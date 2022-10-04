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
  slug: 'laptop-buying-guide',
  creationDate: '2021-07-29T00:00:00.000Z',
  title: _x('Laptop Buying Guide', 'template name', 'web-stories'),
  tags: [
    _x('Technology', 'template keyword', 'web-stories'),
    _x('Products', 'template keyword', 'web-stories'),
    _x('Laptop', 'template keyword', 'web-stories'),
    _x('Simple', 'template keyword', 'web-stories'),
    _x('Blue', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Brilliant Blue', 'color', 'web-stories'),
      color: '#0057ff',
      family: _x('Blue', 'color', 'web-stories'),
    },
    {
      label: _x('White', 'color', 'web-stories'),
      color: '#fff',
      family: _x('White', 'color', 'web-stories'),
    },
    {
      label: _x('Gentle Gray', 'color', 'web-stories'),
      color: '#c4c4c4',
      family: _x('Gray', 'color', 'web-stories'),
    },
    {
      label: _x('Mineshaft Black', 'color', 'web-stories'),
      color: '#3d3d3d',
      family: _x('Black', 'color', 'web-stories'),
    },
  ],
  description: __(
    'This template’s clean design and structure will let you create uncomplicated long-form product reviews, comparisons and more. Adapt it to your style by changing the colors.',
    'web-stories'
  ),
  vertical: _x('Technology', 'template vertical', 'web-stories'),
};
