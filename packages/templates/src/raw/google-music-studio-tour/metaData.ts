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
  slug: 'google-music-studio-tour',
  creationDate: '2021-08-03T00:00:00.000Z',
  title: _x('Google Music Studio Tour', 'template name', 'web-stories'),
  tags: [
    _x('Technology', 'template keyword', 'web-stories'),
    _x('Interior', 'template keyword', 'web-stories'),
    _x('Office', 'template keyword', 'web-stories'),
    _x('Informational', 'template keyword', 'web-stories'),
    _x('Black', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Black Timber', 'color', 'web-stories'),
      color: '#2f2f37',
      family: _x('Black', 'color', 'web-stories'),
    },
    {
      label: _x('White', 'color', 'web-stories'),
      color: '#fff',
      family: _x('White', 'color', 'web-stories'),
    },
    {
      label: _x('Whole Wheat Brown', 'color', 'web-stories'),
      color: '#ddc69e',
      family: _x('Brown', 'color', 'web-stories'),
    },
  ],
  description: __(
    'This template’s formal yet friendly appearance will let you create stories that are informational but also fun to watch. Present office and studio tours, showcase desk setups, inspire your audience with interior ideas, or do something else entirely. The possiblities are endless.',
    'web-stories'
  ),
  vertical: _x('Technology', 'template vertical', 'web-stories'),
};
