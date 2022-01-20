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
  slug: '12-hours-in-barcelona',
  creationDate: '2021-07-12T00:00:00.000Z',
  title: _x('12 Hours in Barcelona', 'template name', 'web-stories'),
  tags: [
    _x('Travel', 'template keyword', 'web-stories'),
    _x('Magazine', 'template keyword', 'web-stories'),
    _x('Destination', 'template keyword', 'web-stories'),
    _x('Outdoor', 'template keyword', 'web-stories'),
    _x('Blue', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Winter Blue', 'color', 'web-stories'),
      color: '#a4deff',
      family: _x('Blue', 'color', 'web-stories'),
    },
    {
      label: _x('Blackcurrant Blue', 'color', 'web-stories'),
      color: '#160236',
      family: _x('Blue', 'color', 'web-stories'),
    },
    {
      label: _x('Sunset Yellow', 'color', 'web-stories'),
      color: '#ffc700',
      family: _x('Yellow', 'color', 'web-stories'),
    },
    {
      label: _x('White', 'color', 'web-stories'),
      color: '#fff',
      family: _x('White', 'color', 'web-stories'),
    },
  ],
  description: __(
    '12 Hours in Barcelona’s classic magazine aesthetic will let you create engaging travel itineraries, bucket lists, and visual articles that will enthuse and motivate your audience.',
    'web-stories'
  ),
  vertical: _x('Travel', 'template vertical', 'web-stories'),
};
