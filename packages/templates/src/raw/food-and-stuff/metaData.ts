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
  slug: 'food-and-stuff',
  creationDate: '2021-05-29T00:00:00.000Z',
  title: _x('Food & Stuff', 'template name', 'web-stories'),
  tags: [
    _x('Delicious', 'template keyword', 'web-stories'),
    _x('Baker', 'template keyword', 'web-stories'),
    _x('Cooking', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Yellow', 'color', 'web-stories'),
      color: '#fff933',
      family: _x('Yellow', 'color', 'web-stories'),
    },
    {
      label: _x('Orange', 'color', 'web-stories'),
      color: '#ff922e',
      family: _x('Orange', 'color', 'web-stories'),
    },
    {
      label: _x('Gray', 'color', 'web-stories'),
      color: '#676461',
      family: _x('Gray', 'color', 'web-stories'),
    },
    {
      label: _x('Blue', 'color', 'web-stories'),
      color: '#3a566e',
      family: _x('Blue', 'color', 'web-stories'),
    },
    {
      label: _x('Cream', 'color', 'web-stories'),
      color: '#fff9ee',
      family: _x('White', 'color', 'web-stories'),
    },
  ],
  description: __(
    'Make your audience salivate by using the Cooking template to create web stories about ingredients, food recipes, how-to’s, restaurant guides and kitchen inspiration.',
    'web-stories'
  ),
  vertical: _x('Cooking', 'template vertical', 'web-stories'),
};
