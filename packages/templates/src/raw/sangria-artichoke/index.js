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
  title: _x('Trendy Winter Veggie', 'template name', 'web-stories'),
  tags: [
    _x('food', 'template keyword', 'web-stories'),
    _x('healthy', 'template keyword', 'web-stories'),
    _x('recipe', 'template keyword', 'web-stories'),
    _x('how-to', 'template keyword', 'web-stories'),
    _x('earthy', 'template keyword', 'web-stories'),
    _x('vegan', 'template keyword', 'web-stories'),
    _x('green', 'template keyword', 'web-stories'),
  ],
  colors: [
    { label: _x('Jewel Green', 'color', 'web-stories'), color: '#0e662a' },
    { label: _x('Tabasco Red', 'color', 'web-stories'), color: '#9f240f' },
    { label: _x('Yukon Sky Gray', 'color', 'web-stories'), color: '#dfe3e4' },
    { label: _x('White', 'color', 'web-stories'), color: '#fff' },
  ],
  description: __(
    'From veggies, with love. This template’s natural green color palette and lively typography will inspire your audience to cook a healthy meal today.',
    'web-stories'
  ),
  ...template,
  vertical: _x('Cooking', 'template vertical', 'web-stories'),
};
