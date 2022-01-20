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
  slug: 'summer-fashion-collection',
  creationDate: '2021-08-03T00:00:00.000Z',
  title: _x('Summer Fashion Collection', 'template name', 'web-stories'),
  tags: [
    _x('Fashion', 'template keyword', 'web-stories'),
    _x('Clothing', 'template keyword', 'web-stories'),
    _x('Summer', 'template keyword', 'web-stories'),
    _x('Trendy', 'template keyword', 'web-stories'),
    _x('Pink', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Sunset Pink', 'color', 'web-stories'),
      color: '#FFC6DA',
      family: _x('Pink', 'color', 'web-stories'),
    },
    {
      label: _x('Sunset Blue', 'color', 'web-stories'),
      color: '#9BB0F0',
      family: _x('Blue', 'color', 'web-stories'),
    },
    {
      label: _x('Pearl Yellow', 'color', 'web-stories'),
      color: '#FFF7CE',
      family: _x('Yellow', 'color', 'web-stories'),
    },
    {
      label: _x('Rubber Ducky Yellow', 'color', 'web-stories'),
      color: '#FFE55C',
      family: _x('Yellow', 'color', 'web-stories'),
    },
    {
      label: _x('Black', 'color', 'web-stories'),
      color: '#000',
      family: _x('Black', 'color', 'web-stories'),
    },
  ],
  description: __(
    'Show the latest styles and outfits with this template’s social media-inspired layout. The vibrant colors and popping font will let you create cool and trendy fashion stories, and you can add purchase links to showcased products.',
    'web-stories'
  ),
  vertical: _x('Fashion & Beauty', 'template vertical', 'web-stories'),
};
