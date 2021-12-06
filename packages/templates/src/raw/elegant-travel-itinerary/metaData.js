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
  slug: 'elegant-travel-itinerary',
  creationDate: '2021-08-09T00:00:00.000Z',
  title: _x('Elegant Travel Itinerary', 'template name', 'web-stories'),
  tags: [
    _x('Travel', 'template keyword', 'web-stories'),
    _x('Trip', 'template keyword', 'web-stories'),
    _x('Heritage', 'template keyword', 'web-stories'),
    _x('Frame', 'template keyword', 'web-stories'),
    _x('Blue', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Night Blue', 'color', 'web-stories'),
      color: '#151c23',
      family: _x('Blue', 'color', 'web-stories'),
    },
    {
      label: _x('Porcelain White', 'color', 'web-stories'),
      color: '#eef0f2',
      family: _x('White', 'color', 'web-stories'),
    },
    {
      label: _x('Aztec Gold', 'color', 'web-stories'),
      color: '#c89d4f',
      family: _x('Yellow', 'color', 'web-stories'),
    },
    {
      label: _x('Bright Sky Blue', 'color', 'web-stories'),
      color: '#61a0ff',
      family: _x('Blue', 'color', 'web-stories'),
    },
  ],
  description: __(
    'This template’s ornate shapes and design elements inspired by olden architecture will let you travel stories that are beautiful and elegant. Create reviews, tour guides and itineraries for cultural and heritage tourism, luxury travel and more.',
    'web-stories'
  ),
  vertical: _x('Travel', 'template vertical', 'web-stories'),
};
