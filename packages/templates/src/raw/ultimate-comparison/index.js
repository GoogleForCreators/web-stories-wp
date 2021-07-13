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
  title: _x('Ultimate Comparison', 'template name', 'web-stories'),
  tags: [
    _x('Technology', 'template keyword', 'web-stories'),
    _x('Products', 'template keyword', 'web-stories'),
    _x('Comparison', 'template keyword', 'web-stories'),
    _x('Minimal', 'template keyword', 'web-stories'),
    _x('White', 'template keyword', 'web-stories'),
  ],
  colors: [
    { label: _x('Rose White', 'color', 'web-stories'), color: '#fff8f2' },
    { label: _x('Coal Black', 'color', 'web-stories'), color: '#060607' },
    { label: _x('Ember Orange', 'color', 'web-stories'), color: '#de7032' },
  ],
  description: __(
    'With its ultra-modern typography, minimalistic layout and fresh, contrasty color palette, this template will let you create product guides that are clear, attractive and effective.',
    'web-stories'
  ),
  ...template,
  vertical: _x('Technology', 'template vertical', 'web-stories'),
};
