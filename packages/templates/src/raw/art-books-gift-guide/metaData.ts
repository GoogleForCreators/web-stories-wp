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
  slug: 'art-books-gift-guide',
  creationDate: '2021-08-09T00:00:00.000Z',
  title: _x('Art Books Gift Guide', 'template name', 'web-stories'),
  tags: [
    _x('Art', 'template keyword', 'web-stories'),
    _x('Gift', 'template keyword', 'web-stories'),
    _x('Recommendation', 'template keyword', 'web-stories'),
    _x('Books', 'template keyword', 'web-stories'),
    _x('Pink', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Petal Pink', 'color', 'web-stories'),
      color: '#da9bb2',
      family: _x('Pink', 'color', 'web-stories'),
    },
    {
      label: _x('Milano Red', 'color', 'web-stories'),
      color: '#c01e00',
      family: _x('Red', 'color', 'web-stories'),
    },
    {
      label: _x('White', 'color', 'web-stories'),
      color: '#fff',
      family: _x('White', 'color', 'web-stories'),
    },
    {
      label: _x('Voodoo Purple', 'color', 'web-stories'),
      color: '#412c47',
      family: _x('Purple', 'color', 'web-stories'),
    },
  ],
  description: __(
    'With its serene, comforting colors and beautiful illustrations, this template is great for creating stories about books and literature. Review books, talk about the newest releases in fiction, create reading lists and more.',
    'web-stories'
  ),
  vertical: _x('Arts & Crafts', 'template vertical', 'web-stories'),
};
