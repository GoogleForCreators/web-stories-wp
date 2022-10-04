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
  slug: 'technology-advice',
  creationDate: '2021-08-25T00:00:00.000Z',
  title: _x('Technology Advice', 'template name', 'web-stories'),
  tags: [
    _x('Technology', 'template keyword', 'web-stories'),
    _x('Studio', 'template keyword', 'web-stories'),
    _x('Tips', 'template keyword', 'web-stories'),
    _x('Modern', 'template keyword', 'web-stories'),
    _x('White', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('White', 'color', 'web-stories'),
      color: '#fff',
      family: _x('White', 'color', 'web-stories'),
    },
    {
      label: _x('Cod Black', 'color', 'web-stories'),
      color: '#444849',
      family: _x('Black', 'color', 'web-stories'),
    },
    {
      label: _x('Cosmonaut Gray', 'color', 'web-stories'),
      color: '#dedede',
      family: _x('Gray', 'color', 'web-stories'),
    },
  ],
  description: __(
    'With its smooth gray shades and corner frame accents, this template is like your very own professional tech review studio. Use photos and videos and create informative, sleek-looking product reviews, comparisons and buying guides for your audience.',
    'web-stories'
  ),
  vertical: _x('Technology', 'template vertical', 'web-stories'),
};
