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
  slug: 'modernist-travel-guide',
  creationDate: '2021-08-09T00:00:00.000Z',
  title: _x('Modernist Travel Guide', 'template name', 'web-stories'),
  tags: [
    _x('Travel', 'template keyword', 'web-stories'),
    _x('Tips', 'template keyword', 'web-stories'),
    _x('Rounded', 'template keyword', 'web-stories'),
    _x('Minimal', 'template keyword', 'web-stories'),
    _x('White', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Tomato Sauce Red', 'color', 'web-stories'),
      color: '#B51006',
      family: _x('Red', 'color', 'web-stories'),
    },
    {
      label: _x('White Smoke', 'color', 'web-stories'),
      color: '#f1f1f1',
      family: _x('White', 'color', 'web-stories'),
    },
    {
      label: _x('Graphite Gray', 'color', 'web-stories'),
      color: '#2e2e2e',
      family: _x('Gray', 'color', 'web-stories'),
    },
    {
      label: _x('White', 'color', 'web-stories'),
      color: '#fff',
      family: _x('White', 'color', 'web-stories'),
    },
  ],
  description: __(
    'Inspired by the clean and minimalistic look of modern architecture, this template is great for creating stories about urban and city tourism. Create sightseeing guides, give out information about local buildings and attractions and more.',
    'web-stories'
  ),
  vertical: _x('Travel', 'template vertical', 'web-stories'),
};
