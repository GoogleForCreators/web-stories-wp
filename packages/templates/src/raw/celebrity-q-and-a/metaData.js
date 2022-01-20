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
  slug: 'celebrity-q-and-a',
  creationDate: '2021-08-03T00:00:00.000Z',
  title: _x('Celebrity Q & A', 'template name', 'web-stories'),
  tags: [
    _x('Entertainment', 'template keyword', 'web-stories'),
    _x('Interview', 'template keyword', 'web-stories'),
    _x('Questions', 'template keyword', 'web-stories'),
    _x('Modern', 'template keyword', 'web-stories'),
    _x('Black', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Black Bean', 'color', 'web-stories'),
      color: '#131313',
      family: _x('Black', 'color', 'web-stories'),
    },
    {
      label: _x('White', 'color', 'web-stories'),
      color: '#fff',
      family: _x('White', 'color', 'web-stories'),
    },
    {
      label: _x('Bright Coral Red', 'color', 'web-stories'),
      color: '#fe3131',
      family: _x('Red', 'color', 'web-stories'),
    },
  ],
  description: __(
    'This template’s magazine look and stylish modern design will let you present video interviews and Q&A’s in a way that is fun, engaging, and entertaining.',
    'web-stories'
  ),
  vertical: _x('Entertainment', 'template vertical', 'web-stories'),
};
