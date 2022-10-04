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
  slug: 'no-days-off',
  creationDate: '2021-05-29T00:00:00.000Z',
  title: _x('No Days Off', 'template name', 'web-stories'),
  tags: [
    _x('Exercise', 'template keyword', 'web-stories'),
    _x('Fitness', 'template keyword', 'web-stories'),
    _x('Health', 'template keyword', 'web-stories'),
    _x('Workout', 'template keyword', 'web-stories'),
    _x('Bold', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Black', 'color', 'web-stories'),
      color: '#1a1a1a',
      family: _x('Black', 'color', 'web-stories'),
    },
    {
      label: _x('Red', 'color', 'web-stories'),
      color: '#cf1323',
      family: _x('Red', 'color', 'web-stories'),
    },
    {
      label: _x('White', 'color', 'web-stories'),
      color: '#fff',
      family: _x('White', 'color', 'web-stories'),
    },
  ],
  description: __(
    'This modern, bold theme lends itself well for workout routines, fitness gear shopping lists, but also tech, internet and gadget news, reviews, recommendations and coverage, due to its timeless, simple look.',
    'web-stories'
  ),
  vertical: _x('Fitness', 'template vertical', 'web-stories'),
};
