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
  slug: 'sleep',
  creationDate: '2021-05-29T00:00:00.000Z',
  title: _x('Sleep', 'template name', 'web-stories'),
  tags: [
    _x('Health', 'template keyword', 'web-stories'),
    _x('Happiness', 'template keyword', 'web-stories'),
    _x('Joy', 'template keyword', 'web-stories'),
    _x('Mindfulness', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Blue', 'color', 'web-stories'),
      color: '#1f2a2e',
      family: _x('Blue', 'color', 'web-stories'),
    },
    {
      label: _x('Green', 'color', 'web-stories'),
      color: '#4b5c54',
      family: _x('Green', 'color', 'web-stories'),
    },
    {
      label: _x('Yellow', 'color', 'web-stories'),
      color: '#FDF5DC',
      family: _x('Yellow', 'color', 'web-stories'),
    },
    {
      label: _x('Gray', 'color', 'web-stories'),
      color: '#858280',
      family: _x('Gray', 'color', 'web-stories'),
    },
    {
      label: _x('Light Gray', 'color', 'web-stories'),
      color: '#d8d8d8',
      family: _x('Gray', 'color', 'web-stories'),
    },
    {
      label: _x('White', 'color', 'web-stories'),
      color: '#fff',
      family: _x('White', 'color', 'web-stories'),
    },
  ],
  description: __(
    'With a warm color palette and soothing shapes, the Wellbeing template works best for web stories covering mindfulness, lifestyle health and related exercise and activities like Yoga, Spa treatments and the like.',
    'web-stories'
  ),
  vertical: _x('Wellbeing', 'template vertical', 'web-stories'),
};
