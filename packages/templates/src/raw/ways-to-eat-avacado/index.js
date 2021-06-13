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
  title: _x('Ways to Eat Avocado', 'template name', 'web-stories'),
  tags: [
    _x('Nutrition', 'template keyword', 'web-stories'),
    _x('Health', 'template keyword', 'web-stories'),
    _x('Fitness', 'template keyword', 'web-stories'),
    _x('Organic', 'template keyword', 'web-stories'),
    _x('Diet', 'template keyword', 'web-stories'),
    _x('Green', 'template keyword', 'web-stories'),
  ],
  colors: [
    { label: _x('Swamp Green', 'color', 'web-stories'), color: '#a7b27e' },
    { label: _x('Saffron Yellow', 'color', 'web-stories'), color: '#f5b435' },
    { label: _x('Dark Moss Green', 'color', 'web-stories'), color: '#51611c' },
    { label: _x('Rose Bud Pink', 'color', 'web-stories'), color: '#ffa797' },
    { label: _x('Dark Coral', 'color', 'web-stories'), color: '#a35445' },
  ],
  description: __(
    'This template is on a diet. With its to-the-point structure and neutral typography, it will let you keep things simple and focus on getting your recipe to your followers.',
    'web-stories'
  ),
  ...template,
  vertical: _x('Health & Wellness', 'template vertical', 'web-stories'),
};
