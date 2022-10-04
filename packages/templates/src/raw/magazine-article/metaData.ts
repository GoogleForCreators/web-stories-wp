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
  slug: 'magazine-article',
  creationDate: '2021-08-09T00:00:00.000Z',
  title: _x('Magazine Article', 'template name', 'web-stories'),
  tags: [
    _x('Technology', 'template keyword', 'web-stories'),
    _x('Future', 'template keyword', 'web-stories'),
    _x('Presentation', 'template keyword', 'web-stories'),
    _x('Magazine', 'template keyword', 'web-stories'),
    _x('Gray', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('School Bus Yellow', 'color', 'web-stories'),
      color: '#ffdb00',
      family: _x('Yellow', 'color', 'web-stories'),
    },
    {
      label: _x('Gentle Gray', 'color', 'web-stories'),
      color: '#c4c4c4',
      family: _x('Gray', 'color', 'web-stories'),
    },
    {
      label: _x('Black', 'color', 'web-stories'),
      color: '#000',
      family: _x('Black', 'color', 'web-stories'),
    },
    {
      label: _x('White', 'color', 'web-stories'),
      color: '#fff',
      family: _x('White', 'color', 'web-stories'),
    },
  ],
  description: __(
    'With its rounded font, boxy images and yellow accents, this template is just like your good old tech magazine, but in a visual story format. Share the latest news, write opinionated pieces, explainers, product reviews and much more.',
    'web-stories'
  ),
  vertical: _x('Technology', 'template vertical', 'web-stories'),
};
