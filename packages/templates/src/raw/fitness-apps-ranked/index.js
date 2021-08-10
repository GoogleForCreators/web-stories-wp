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
  title: _x('Fitness Apps Ranked', 'template name', 'web-stories'),
  tags: [
    _x('Technology', 'template keyword', 'web-stories'),
    _x('Fitness', 'template keyword', 'web-stories'),
    _x('App', 'template keyword', 'web-stories'),
    _x('Reviews', 'template keyword', 'web-stories'),
    _x('Yellow', 'template keyword', 'web-stories'),
  ],
  colors: [
    { label: _x('Space Blue', 'color', 'web-stories'), color: '#222b49' },
    {
      label: _x('Watermelon Yellow', 'color', 'web-stories'),
      color: '#f1ff51',
    },
    { label: _x('White', 'color', 'web-stories'), color: '#fff' },
    { label: _x('Pastel Blue', 'color', 'web-stories'), color: '#e0edf8' },
  ],
  description: __(
    'With its bright neon colors and modern design, this template is perfect for talking about what’s hot. Create vivid and energetic tech reviews, DIY tutorials, fitness guides and more.',
    'web-stories'
  ),
  ...template,
  vertical: _x('Technology', 'template vertical', 'web-stories'),
};
