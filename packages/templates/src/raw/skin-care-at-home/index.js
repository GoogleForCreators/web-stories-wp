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
  slug: 'skin-care-at-home',
  creationDate: new Date(2021, 7, 1),
  title: _x('Skin Care at Home', 'template name', 'web-stories'),
  tags: [
    _x('Beauty', 'template keyword', 'web-stories'),
    _x('Care', 'template keyword', 'web-stories'),
    _x('Tips', 'template keyword', 'web-stories'),
    _x('Pastel', 'template keyword', 'web-stories'),
    _x('Pink', 'template keyword', 'web-stories'),
  ],
  colors: [
    { label: _x('Playful Purple', 'color', 'web-stories'), color: '#380e63' },
    { label: _x('Rose Pink', 'color', 'web-stories'), color: '#f3cce5' },
    {
      label: _x('Lavender Potpourri', 'color', 'web-stories'),
      color: '#cdccf3',
    },
    { label: _x('Light Blue Denim', 'color', 'web-stories'), color: '#cce0f3' },
    { label: _x('Light Green Teal', 'color', 'web-stories'), color: '#ccf3df' },
    {
      label: _x('Cream Fizz Yellow', 'color', 'web-stories'),
      color: '#f3e5cc',
    },
  ],
  description: __(
    'With its light background colors, pink shades and structured format, this template will let you create beautiful and informative makeup and skincare tutorials.',
    'web-stories'
  ),
  ...template,
  vertical: _x('Fashion & Beauty', 'template vertical', 'web-stories'),
};
