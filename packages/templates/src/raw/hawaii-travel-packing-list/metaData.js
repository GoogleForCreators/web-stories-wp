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
  slug: 'hawaii-travel-packing-list',
  creationDate: '2021-08-03T00:00:00.000Z',
  title: _x('Hawaii Travel Packing List', 'template name', 'web-stories'),
  tags: [
    _x('Travel', 'template keyword', 'web-stories'),
    _x('Island', 'template keyword', 'web-stories'),
    _x('List', 'template keyword', 'web-stories'),
    _x('Nature', 'template keyword', 'web-stories'),
    _x('Teal', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Cool Teal', 'color', 'web-stories'),
      color: '#EFFAF6',
      family: _x('Blue', 'color', 'web-stories'),
    },
    {
      label: _x('Black', 'color', 'web-stories'),
      color: '#000',
      family: _x('Black', 'color', 'web-stories'),
    },
  ],
  description: __(
    'This template’s beautiful blue-green palette will let you create helpful travel and backpacking stories such as tourist guides, packing lists, and more, with the ability to add product links.',
    'web-stories'
  ),
  vertical: _x('Travel', 'template vertical', 'web-stories'),
};
