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
  title: _x('Street Style On The Go', 'template name', 'web-stories'),
  tags: [
    _x('Fashion', 'template keyword', 'web-stories'),
    _x('Lifestyle', 'template keyword', 'web-stories'),
    _x('Trend', 'template keyword', 'web-stories'),
    _x('Stylish', 'template keyword', 'web-stories'),
    _x('Green', 'template keyword', 'web-stories'),
  ],
  colors: [
    { label: _x('Voguish Green', 'color', 'web-stories'), color: '#74e3a3' },
    { label: _x('Black', 'color', 'web-stories'), color: '#000000' },
    { label: _x('White', 'color', 'web-stories'), color: '#ffffff' },
  ],
  description: __(
    'Beautiful bright colors, full-scale photos, and an elegant font. Street Style On The Go will let you create stories that look chic and stylish.',
    'web-stories'
  ),
  ...template,
  vertical: _x('Fashion & Beauty', 'template vertical', 'web-stories'),
};
