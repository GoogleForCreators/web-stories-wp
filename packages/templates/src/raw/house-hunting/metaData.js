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
  slug: 'house-hunting',
  creationDate: '2021-08-03T00:00:00.000Z',
  title: _x('House Hunting', 'template name', 'web-stories'),
  tags: [
    _x('Home', 'template keyword', 'web-stories'),
    _x('Tips', 'template keyword', 'web-stories'),
    _x('Decor', 'template keyword', 'web-stories'),
    _x('Budget', 'template keyword', 'web-stories'),
    _x('White', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Pastel Toffee Pink', 'color', 'web-stories'),
      color: '#eec2bc',
      family: _x('Pink', 'color', 'web-stories'),
    },
    {
      label: _x('Black Violet', 'color', 'web-stories'),
      color: '#2d2a35',
      family: _x('Purple', 'color', 'web-stories'),
    },
    {
      label: _x('Marshmallow Yellow', 'color', 'web-stories'),
      color: '#fff0d8',
      family: _x('Yellow', 'color', 'web-stories'),
    },
    {
      label: _x('Grape Purple', 'color', 'web-stories'),
      color: '#464152',
      family: _x('Purple', 'color', 'web-stories'),
    },
  ],
  description: __(
    'With its earthly colors and charming typography, this template will let you create guides and tutorials with a pinch of old-fashioned elegence. Present fresh new ideas for topics like home renovation, interior, architecture, gardening and more.',
    'web-stories'
  ),
  vertical: _x('Home & Garden', 'template vertical', 'web-stories'),
};
