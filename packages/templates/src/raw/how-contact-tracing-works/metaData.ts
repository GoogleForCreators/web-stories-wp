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
  slug: 'how-contact-tracing-works',
  creationDate: '2021-08-03T00:00:00.000Z',
  title: _x('How Contact Tracing Works', 'template name', 'web-stories'),
  tags: [
    _x('Technology', 'template keyword', 'web-stories'),
    _x('Network', 'template keyword', 'web-stories'),
    _x('Insights', 'template keyword', 'web-stories'),
    _x('Steps', 'template keyword', 'web-stories'),
    _x('Blue', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Blazing Red', 'color', 'web-stories'),
      color: '#fe0002',
      family: _x('Red', 'color', 'web-stories'),
    },
    {
      label: _x('White', 'color', 'web-stories'),
      color: '#fff',
      family: _x('White', 'color', 'web-stories'),
    },
    {
      label: _x('Tropical Blue', 'color', 'web-stories'),
      color: '#94e1de',
      family: _x('Blue', 'color', 'web-stories'),
    },
    {
      label: _x('Gunmetal Blue', 'color', 'web-stories'),
      color: '#252a3a',
      family: _x('Blue', 'color', 'web-stories'),
    },
  ],
  description: __(
    'With its readability-focused design, this template is great for breaking down concepts and easily explaining technical topics with the help of photos, videos, and text.',
    'web-stories'
  ),
  vertical: _x('Technology', 'template vertical', 'web-stories'),
};
