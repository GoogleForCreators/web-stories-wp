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
import { __, _x } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { default as template } from './template';

export default {
  title: _x('Belly Fat Workout', 'template name', 'web-stories'),
  tags: [
    _x('Health', 'template keyword', 'web-stories'),
    _x('Workout', 'template keyword', 'web-stories'),
    _x('Tutorial', 'template keyword', 'web-stories'),
    _x('Simple', 'template keyword', 'web-stories'),
    _x('Black', 'template keyword', 'web-stories'),
  ],
  colors: [
    { label: _x('Lime Green', 'color', 'web-stories'), color: '#e0ff8c' },
    { label: _x('Slime Green', 'color', 'web-stories'), color: '#d6fd56' },
    { label: _x('Black', 'color', 'web-stories'), color: '#000000' },
    { label: _x('White', 'color', 'web-stories'), color: '#f9f9f9' },
  ],
  description: __(
    'Flat design, bright colors, and bold typography. This template will let you keep text to a minimum and clearly demonstrate your workout routine with videos.',
    'web-stories'
  ),
  ...template,
  vertical: _x('Health & Wellness', 'template vertical', 'web-stories'),
};
