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
  title: _x('Celebrity Q & A', 'template name', 'web-stories'),
  tags: [
    _x('Entertainment', 'template keyword', 'web-stories'),
    _x('Interview', 'template keyword', 'web-stories'),
    _x('Questions', 'template keyword', 'web-stories'),
    _x('Modern', 'template keyword', 'web-stories'),
    _x('Black', 'template keyword', 'web-stories'),
  ],
  colors: [
    { label: _x('Black Bean', 'color', 'web-stories'), color: '#131313' },
    { label: _x('White', 'color', 'web-stories'), color: '#fff' },
    { label: _x('Bright Coral Red', 'color', 'web-stories'), color: '#fe3131' },
  ],
  description: __(
    'This template’s magazine look and stylish modern design will let you present video interviews and Q&A’s in a way that is fun, engaging, and entertaining.',
    'web-stories'
  ),
  ...template,
  vertical: _x('Entertainment', 'template vertical', 'web-stories'),
};
