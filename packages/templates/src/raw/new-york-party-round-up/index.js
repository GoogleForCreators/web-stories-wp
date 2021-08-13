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
  creationDate: new Date(2021, 7, 1),
  title: _x('New York Party Round-up', 'template name', 'web-stories'),
  tags: [
    _x('Entertainment', 'template keyword', 'web-stories'),
    _x('Club', 'template keyword', 'web-stories'),
    _x('Event', 'template keyword', 'web-stories'),
    _x('Banner', 'template keyword', 'web-stories'),
    _x('Black', 'template keyword', 'web-stories'),
  ],
  colors: [
    { label: _x('Black', 'color', 'web-stories'), color: '#000' },
    { label: _x('White', 'color', 'web-stories'), color: '#fff' },
  ],
  description: __(
    'This template’s large black and white banners and full-screen visuals will let you create simple yet attractive stories in the entertainment niche. Create buzzy listicles, announce events and show times, give out info about music festivals and more. Use the social share buttons to reach a wider audience.',
    'web-stories'
  ),
  ...template,
  vertical: _x('Entertainment', 'template vertical', 'web-stories'),
};
