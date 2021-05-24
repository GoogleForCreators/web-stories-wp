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
import { default as template } from './template';

export default {
  title: _x('No Days Off', 'template name', 'web-stories'),
  tags: [
    _x('Exercise', 'template keyword', 'web-stories'),
    _x('Fitness', 'template keyword', 'web-stories'),
    _x('Health', 'template keyword', 'web-stories'),
    _x('Workout', 'template keyword', 'web-stories'),
    _x('Bold', 'template keyword', 'web-stories'),
  ],
  colors: [
    { label: _x('Black', 'color', 'web-stories'), color: '#1a1a1a' },
    { label: _x('Red', 'color', 'web-stories'), color: '#cf1323' },
    { label: _x('White', 'color', 'web-stories'), color: '#fff' },
  ],
  description: __(
    'This modern, bold theme lends itself well for workout routines, fitness gear shopping lists, but also tech, internet and gadget news, reviews, recommendations and coverage, due to its timeless, simple look.',
    'web-stories'
  ),
  ...template,
  vertical: _x('Fitness', 'template vertical', 'web-stories'),
};
