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
  slug: 'beauty-quiz',
  creationDate: '2021-06-28T00:00:00.000Z',
  title: _x('Beauty Quiz', 'template name', 'web-stories'),
  tags: [
    _x('Fashion & Beauty', 'template keyword', 'web-stories'),
    _x('Skin Care', 'template keyword', 'web-stories'),
    _x('Personal Care', 'template keyword', 'web-stories'),
    _x('Shapes', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Courtyard Green', 'color', 'web-stories'),
      color: '#397165',
      family: _x('Green', 'color', 'web-stories'),
    },
    {
      label: _x('White', 'color', 'web-stories'),
      color: '#fff',
      family: _x('White', 'color', 'web-stories'),
    },
    {
      label: _x('Pink Wash', 'color', 'web-stories'),
      color: '#f8dfdc',
      family: _x('Pink', 'color', 'web-stories'),
    },
    {
      label: _x('Aquatic Green', 'color', 'web-stories'),
      color: '#aec2bf',
      family: _x('Green', 'color', 'web-stories'),
    },
  ],
  description: __(
    'With its soft pink shade, lightweight typography and rounded shapes, this template is just right for creating stories in the beauty and personal care niche. Create questonnaires, skincare routines, product promotions and more that look pretty and feel pleasant.',
    'web-stories'
  ),
  vertical: _x('Fashion & Beauty', 'template vertical', 'web-stories'),
};
