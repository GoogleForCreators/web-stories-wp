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
  slug: 'all-about-cars',
  creationDate: '2021-09-01T00:00:00.000Z',
  title: _x('All About Cars', 'template name', 'web-stories'),
  tags: [
    _x('Technology', 'template keyword', 'web-stories'),
    _x('Cars', 'template keyword', 'web-stories'),
    _x('Features', 'template keyword', 'web-stories'),
    _x('Futuristic', 'template keyword', 'web-stories'),
    _x('White', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Neon Aqua Blue', 'color', 'web-stories'),
      color: '#00f0ff',
      family: _x('Blue', 'color', 'web-stories'),
    },
    {
      label: _x('Catalina Blue', 'color', 'web-stories'),
      color: '#002e73',
      family: _x('Blue', 'color', 'web-stories'),
    },
    {
      label: _x('Light Aqua Blue', 'color', 'web-stories'),
      color: '#a2f6fc',
      family: _x('Blue', 'color', 'web-stories'),
    },
    {
      label: _x('White', 'color', 'web-stories'),
      color: '#fff',
      family: _x('White', 'color', 'web-stories'),
    },
    {
      label: _x('Celestial Blue', 'color', 'web-stories'),
      color: '#152132',
      family: _x('Blue', 'color', 'web-stories'),
    },
  ],
  description: __(
    'Explain technical topics and talk about the latest in science and technology with this clean and futuristic template. Use the blue stickers to draw attention to objects of importance and clearly illustrate your point.',
    'web-stories'
  ),
  vertical: _x('Technology', 'template vertical', 'web-stories'),
};
