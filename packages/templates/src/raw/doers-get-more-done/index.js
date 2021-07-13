/*
 * Copyright 2020 Google LLC
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
  title: _x('Doers Get More Done', 'template name', 'web-stories'),
  tags: [
    _x('Doers', 'template keyword', 'web-stories'),
    _x('Expand', 'template keyword', 'web-stories'),
    _x('Start', 'template keyword', 'web-stories'),
  ],
  colors: [
    { label: _x('Black', 'color', 'web-stories'), color: '#211f1e' },
    { label: _x('Orange', 'color', 'web-stories'), color: '#ff630b' },
    { label: _x('Cream', 'color', 'web-stories'), color: '#faf4ea' },
    { label: _x('Light Grey', 'color', 'web-stories'), color: '#858280' },
    { label: _x('White', 'color', 'web-stories'), color: '#fff' },
  ],
  description: __(
    'Motivate your audience to get out there and make something with the bold DIY template. Use it for DIY, crafting, 3D printing, woodworking or any other content targeting makers.',
    'web-stories'
  ),
  ...template,
  vertical: _x('DIY', 'template vertical', 'web-stories'),
};
