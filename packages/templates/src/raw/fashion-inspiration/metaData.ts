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
  slug: 'fashion-inspiration',
  creationDate: '2021-08-09T00:00:00.000Z',
  title: _x('Fashion Inspiration', 'template name', 'web-stories'),
  tags: [
    _x('Fashion', 'template keyword', 'web-stories'),
    _x('Inspiration', 'template keyword', 'web-stories'),
    _x('Clothes', 'template keyword', 'web-stories'),
    _x('Classy', 'template keyword', 'web-stories'),
    _x('White', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Black', 'color', 'web-stories'),
      color: '#000',
      family: _x('Black', 'color', 'web-stories'),
    },
    {
      label: _x('Faded Rose Red', 'color', 'web-stories'),
      color: '#c16351',
      family: _x('Red', 'color', 'web-stories'),
    },
    {
      label: _x('Winter Mist White', 'color', 'web-stories'),
      color: '#f2f2f2',
      family: _x('White', 'color', 'web-stories'),
    },
    {
      label: _x('Prairie Gold', 'color', 'web-stories'),
      color: '#b18c54',
      family: _x('Yellow', 'color', 'web-stories'),
    },
  ],
  description: __(
    'With its clean, classy look and full-screen photos, this template will let you effectively present fashion and outfit ideas. You can use large-scale close up shots to showcase products, along with individual purchase pages and a short description.',
    'web-stories'
  ),
  vertical: _x('Fashion & Beauty', 'template vertical', 'web-stories'),
};
