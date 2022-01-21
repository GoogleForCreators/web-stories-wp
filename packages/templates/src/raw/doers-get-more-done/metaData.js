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
  slug: 'doers-get-more-done',
  creationDate: '2021-05-29T00:00:00.000Z',
  title: _x('Doers Get More Done', 'template name', 'web-stories'),
  tags: [
    _x('Doers', 'template keyword', 'web-stories'),
    _x('Expand', 'template keyword', 'web-stories'),
    _x('Start', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Black', 'color', 'web-stories'),
      color: '#211f1e',
      family: _x('Black', 'color', 'web-stories'),
    },
    {
      label: _x('Orange', 'color', 'web-stories'),
      color: '#ff630b',
      family: _x('Orange', 'color', 'web-stories'),
    },
    {
      label: _x('Cream', 'color', 'web-stories'),
      color: '#faf4ea',
      family: _x('White', 'color', 'web-stories'),
    },
    {
      label: _x('Light Gray', 'color', 'web-stories'),
      color: '#858280',
      family: _x('Gray', 'color', 'web-stories'),
    },
    {
      label: _x('White', 'color', 'web-stories'),
      color: '#fff',
      family: _x('White', 'color', 'web-stories'),
    },
  ],
  description: __(
    'Motivate your audience to get out there and make something with the bold DIY template. Use it for DIY, crafting, 3D printing, woodworking or any other content targeting makers.',
    'web-stories'
  ),
  vertical: _x('DIY', 'template vertical', 'web-stories'),
};
