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
  title: _x('Pizzas in NYC', 'template name', 'web-stories'),
  tags: [
    _x('Travel', 'template keyword', 'web-stories'),
    _x('Food', 'template keyword', 'web-stories'),
    _x('Restaurant', 'template keyword', 'web-stories'),
    _x('Pizza', 'template keyword', 'web-stories'),
    _x('Orange', 'template keyword', 'web-stories'),
  ],
  colors: [
    { label: _x('Canyon Orange', 'color', 'web-stories'), color: '#a36431' },
    { label: _x('Warm Yellow', 'color', 'web-stories'), color: '#f8bc63' },
    { label: _x('Raisin Black', 'color', 'web-stories'), color: '#262626' },
    { label: _x('Magnolia White', 'color', 'web-stories'), color: '#fef9f1' },
  ],
  description: __(
    'Use the neutral typography, layout, and brush strokes of this template to your advantage and turn it into your own beautiful travel story, tutorial, or even a cooking recipe. Mix, match and reuse the pages, and change the colors to fit your style.',
    'web-stories'
  ),
  ...template,
  vertical: _x('Travel', 'template vertical', 'web-stories'),
};
