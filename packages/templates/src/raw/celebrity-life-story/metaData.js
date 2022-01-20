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
  slug: 'celebrity-life-story',
  creationDate: '2021-08-25T00:00:00.000Z',
  title: _x('Celebrity Life Story', 'template name', 'web-stories'),
  tags: [
    _x('Entertainment', 'template keyword', 'web-stories'),
    _x('Celebrity', 'template keyword', 'web-stories'),
    _x('Pop', 'template keyword', 'web-stories'),
    _x('Bright', 'template keyword', 'web-stories'),
    _x('Black', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Phantom Black', 'color', 'web-stories'),
      color: '#020202',
      family: _x('Black', 'color', 'web-stories'),
    },
    {
      label: _x('Gecko Green', 'color', 'web-stories'),
      color: '#80FF44',
      family: _x('Green', 'color', 'web-stories'),
    },
  ],
  description: __(
    'With an upbeat neon green color and a powerful headings font, this template is great for creating stories around pop culture, music and the show business.',
    'web-stories'
  ),
  vertical: _x('Entertainment', 'template vertical', 'web-stories'),
};
