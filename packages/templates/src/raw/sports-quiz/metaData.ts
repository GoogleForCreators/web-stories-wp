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
  slug: 'sports-quiz',
  creationDate: '2021-08-25T00:00:00.000Z',
  title: _x('Sports Quiz', 'template name', 'web-stories'),
  tags: [
    _x('Health & Wellness', 'template keyword', 'web-stories'),
    _x('Quiz', 'template keyword', 'web-stories'),
    _x('Sports', 'template keyword', 'web-stories'),
    _x('Bold', 'template keyword', 'web-stories'),
    _x('Violet', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Amethyst Violet', 'color', 'web-stories'),
      color: '#442383',
      family: _x('Purple', 'color', 'web-stories'),
    },
    {
      label: _x('White', 'color', 'web-stories'),
      color: '#fff',
      family: _x('White', 'color', 'web-stories'),
    },
    {
      label: _x('Mango', 'color', 'web-stories'),
      color: '#ffcd48',
      family: _x('Yellow', 'color', 'web-stories'),
    },
  ],
  description: __(
    'Create interactive quizzes for sports and a variety of other topics with this bold and energetic template. Just change the photos and colors to suit your style.',
    'web-stories'
  ),
  vertical: _x('Health & Wellness', 'template vertical', 'web-stories'),
};
