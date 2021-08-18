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
import { default as creationDate } from './creationDate';

export default {
  slug: 'a-day-in-the-life',
  creationDate,
  title: _x('A Day in the Life', 'template name', 'web-stories'),
  tags: [
    _x('Entertainment', 'template keyword', 'web-stories'),
    _x('Routine', 'template keyword', 'web-stories'),
    _x('Video', 'template keyword', 'web-stories'),
    _x('Minimal', 'template keyword', 'web-stories'),
    _x('Blue', 'template keyword', 'web-stories'),
  ],
  colors: [
    { label: _x('Waterworld Blue', 'color', 'web-stories'), color: '#061b38' },
    { label: _x('Arctic White', 'color', 'web-stories'), color: '#fcfcfc' },
    { label: _x('Honey Pot Yellow', 'color', 'web-stories'), color: '#ffc864' },
  ],
  description: __(
    'This simple and minimalist template will let you create long format video stories that are highly engaging. Create day-in-the-life videos, workout routines, makeup tutorials and much more.',
    'web-stories'
  ),
  ...template,
  vertical: _x('Entertainment', 'template vertical', 'web-stories'),
};
