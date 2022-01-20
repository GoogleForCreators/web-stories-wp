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
  slug: 'summer-adventure-guide',
  creationDate: '2021-08-25T00:00:00.000Z',
  title: _x('Summer Adventure Guide', 'template name', 'web-stories'),
  tags: [
    _x('Travel', 'template keyword', 'web-stories'),
    _x('Adventure', 'template keyword', 'web-stories'),
    _x('Trip', 'template keyword', 'web-stories'),
    _x('Tips', 'template keyword', 'web-stories'),
    _x('Green', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Golden Yellow', 'color', 'web-stories'),
      color: '#fec85a',
      family: _x('Yellow', 'color', 'web-stories'),
    },
    {
      label: _x('Dark Olive Green', 'color', 'web-stories'),
      color: '#556C28',
      family: _x('Green', 'color', 'web-stories'),
    },
    {
      label: _x('White', 'color', 'web-stories'),
      color: '#fff',
      family: _x('White', 'color', 'web-stories'),
    },
  ],
  description: __(
    'This template’s green-yellow color palette and map-like stickers will let you create fun and exciting stories for adventure travel, ecotourism, hiking, camping, wildlife and more.',
    'web-stories'
  ),
  vertical: _x('Travel', 'template vertical', 'web-stories'),
};
