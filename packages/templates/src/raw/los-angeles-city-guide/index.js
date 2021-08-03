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
  title: _x('Los Angeles City Guide', 'template name', 'web-stories'),
  tags: [
    _x('Travel', 'template keyword', 'web-stories'),
    _x('City', 'template keyword', 'web-stories'),
    _x('Visit', 'template keyword', 'web-stories'),
    _x('Dark', 'template keyword', 'web-stories'),
    _x('Black', 'template keyword', 'web-stories'),
  ],
  colors: [
    { label: _x('Dusk Black', 'color', 'web-stories'), color: '#212426' },
    { label: _x('Alpine Green', 'color', 'web-stories'), color: '#c2cda3' },
  ],
  description: __(
    'With its serene black-and-green color palette, this template will let you create city guides, travelogues and other travel stories that are moody and atmospheric.',
    'web-stories'
  ),
  ...template,
  vertical: _x('Travel', 'template vertical', 'web-stories'),
};
