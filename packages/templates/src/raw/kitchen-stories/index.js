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
  title: _x('Kitchen Stories', 'template name', 'web-stories'),
  tags: [
    _x('cooking', 'template keyword', 'web-stories'),
    _x('DIY', 'template keyword', 'web-stories'),
    _x('protein', 'template keyword', 'web-stories'),
    _x('homemade', 'template keyword', 'web-stories'),
    _x('blue', 'template keyword', 'web-stories'),
  ],
  colors: [
    { label: _x('Swamp Green', 'color', 'web-stories'), color: '#a7b27e' },
    { label: _x('Saffron Yellow', 'color', 'web-stories'), color: '#f5b435' },
    { label: _x('Dark Moss Green', 'color', 'web-stories'), color: '#51611c' },
    { label: _x('Rose Bud Pink', 'color', 'web-stories'), color: '#ffa797' },
    { label: _x('Dark Coral', 'color', 'web-stories'), color: '#a35445' },
  ],
  description: __(
    'The Kitchen Stories template puts the spotlight on you by keeping the text minimal and letting you tell your story through video. Increase your audience by linking your social profile and website at the end.',
    'web-stories'
  ),
  ...template,
  vertical: _x('Cooking', 'template vertical', 'web-stories'),
};
