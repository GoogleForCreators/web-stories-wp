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
  slug: 'tv-show-recap',
  creationDate: '2021-07-29T00:00:00.000Z',
  title: _x('TV Show Recap', 'template name', 'web-stories'),
  tags: [
    _x('Entertainment', 'template keyword', 'web-stories'),
    _x('TV Show', 'template keyword', 'web-stories'),
    _x('Explanation', 'template keyword', 'web-stories'),
    _x('Minimal', 'template keyword', 'web-stories'),
    _x('Black', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Black Walnut', 'color', 'web-stories'),
      color: '#2f2f2b',
      family: _x('Black', 'color', 'web-stories'),
    },
    {
      label: _x('White', 'color', 'web-stories'),
      color: '#fff',
      family: _x('White', 'color', 'web-stories'),
    },
    {
      label: _x('Mimosa Yellow', 'color', 'web-stories'),
      color: '#fff172',
      family: _x('Yellow', 'color', 'web-stories'),
    },
    {
      label: _x('Clear Sky Blue', 'color', 'web-stories'),
      color: '#72aaff',
      family: _x('Blue', 'color', 'web-stories'),
    },
  ],
  description: __(
    'With its clean design and minimal visual elements, this template puts the focus on what you have to say. Create film and TV reviews, summaries, analyses, visual essays and more.',
    'web-stories'
  ),
  vertical: _x('Entertainment', 'template vertical', 'web-stories'),
};
