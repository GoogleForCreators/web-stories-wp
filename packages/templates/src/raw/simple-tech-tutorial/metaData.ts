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
  slug: 'simple-tech-tutorial',
  creationDate: '2021-08-09T00:00:00.000Z',
  title: _x('Simple Tech Tutorial', 'template name', 'web-stories'),
  tags: [
    _x('Technology', 'template keyword', 'web-stories'),
    _x('Network', 'template keyword', 'web-stories'),
    _x('How-To', 'template keyword', 'web-stories'),
    _x('Minimal', 'template keyword', 'web-stories'),
    _x('Blue', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('White', 'color', 'web-stories'),
      color: '#fff',
      family: _x('White', 'color', 'web-stories'),
    },
    {
      label: _x('Boston Blue', 'color', 'web-stories'),
      color: '#4899bf',
      family: _x('Blue', 'color', 'web-stories'),
    },
    {
      label: _x('Liquid Blue', 'color', 'web-stories'),
      color: '#c1ddeb',
      family: _x('Blue', 'color', 'web-stories'),
    },
    {
      label: _x('Dark Teal', 'color', 'web-stories'),
      color: '#264156',
      family: _x('Blue', 'color', 'web-stories'),
    },
  ],
  description: __(
    'This clean and simple template will let you create structured and easy to understand tech tutorials and how-to guides. Just add your own screenshots, text, and illustrations.',
    'web-stories'
  ),
  vertical: _x('Technology', 'template vertical', 'web-stories'),
};
