/*
 * Copyright 2020 Google LLC
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
import { __, _x } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { default as weeklyEntertainment } from './template';

export default {
  title: _x('Entertainment', 'template name', 'web-stories'),
  tags: [
    _x('Funny', 'template keyword', 'web-stories'),
    _x('Action', 'template keyword', 'web-stories'),
    _x('Hip', 'template keyword', 'web-stories'),
  ],
  colors: [
    { label: _x('Black', 'color', 'web-stories'), color: '#000' },
    { label: _x('White', 'color', 'web-stories'), color: '#fff' },
    { label: _x('Pink', 'color', 'web-stories'), color: '#ff00d6' },
    { label: _x('Grey', 'color', 'web-stories'), color: '#525252' },
  ],
  description: __(
    'Cover the world of entertainment with this template that comes with an edgy, interesting look. Works well as foundation for celebrity, movie, TV and music coverage, insights and inspiration.',
    'web-stories'
  ),
  pages: weeklyEntertainment.pages,
  version: weeklyEntertainment.version,
};
