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
  slug: 'sustainability-tips',
  creationDate: '2021-08-25T00:00:00.000Z',
  title: _x('Sustainability Tips', 'template name', 'web-stories'),
  tags: [
    _x('Health & Wellness', 'template keyword', 'web-stories'),
    _x('Sustainability', 'template keyword', 'web-stories'),
    _x('Environment', 'template keyword', 'web-stories'),
    _x('Tips', 'template keyword', 'web-stories'),
    _x('Green', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Eco Green', 'color', 'web-stories'),
      color: '#134f3c',
      family: _x('Green', 'color', 'web-stories'),
    },
    {
      label: _x('Acorn Orange', 'color', 'web-stories'),
      color: '#bb7c48',
      family: _x('Orange', 'color', 'web-stories'),
    },
    {
      label: _x('Light Dutch White', 'color', 'web-stories'),
      color: '#fdf0d6',
      family: _x('White', 'color', 'web-stories'),
    },
  ],
  description: __(
    'This template’s soft earthly colors and readable font will let you create beautiful and calming stories for nature topics. Add your own illustrations and create infographics, how-to guides and more.',
    'web-stories'
  ),
  vertical: _x('Health & Wellness', 'template vertical', 'web-stories'),
};
