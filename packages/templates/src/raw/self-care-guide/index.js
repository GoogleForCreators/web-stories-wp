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
  title: _x('Self-care Guide', 'template name', 'web-stories'),
  tags: [
    _x('Health & Wellness', 'template keyword', 'web-stories'),
    _x('Health', 'template keyword', 'web-stories'),
    _x('Self Care', 'template keyword', 'web-stories'),
    _x('Informative', 'template keyword', 'web-stories'),
    _x('White', 'template keyword', 'web-stories'),
  ],
  colors: [
    { label: _x('Studio White', 'color', 'web-stories'), color: '#f5f4ee' },
    {
      label: _x('Cavernous Gray', 'color', 'web-stories'),
      color: '#535353',
    },
    { label: _x('Gold Ochre', 'color', 'web-stories'), color: '#b17417' },
    { label: _x('Cove Blue', 'color', 'web-stories'), color: '#7a87a8' },
    { label: _x('Velvet Green', 'color', 'web-stories'), color: '#588061' },
    {
      label: _x('Olive Garden Green', 'color', 'web-stories'),
      color: '#878c52',
    },
    { label: _x('White', 'color', 'web-stories'), color: '#ffffff' },
  ],
  description: __(
    'With its natural color palette, this template will let you create uplifting and informative stories about self-care, health and nutrition, meditation, and more.',
    'web-stories'
  ),
  ...template,
  vertical: _x('Health & Wellness', 'template vertical', 'web-stories'),
};
