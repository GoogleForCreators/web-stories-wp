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
  slug: 'almodos-films',
  creationDate: '2021-07-12T00:00:00.000Z',
  title: _x('Almodo’s Films', 'template name', 'web-stories'),
  tags: [
    _x('Entertainment', 'template keyword', 'web-stories'),
    _x('Films', 'template keyword', 'web-stories'),
    _x('Women', 'template keyword', 'web-stories'),
    _x('Elegant', 'template keyword', 'web-stories'),
    _x('Black', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Black', 'color', 'web-stories'),
      color: '#000',
      family: _x('Black', 'color', 'web-stories'),
    },
    {
      label: _x('Paris Daisy Yellow', 'color', 'web-stories'),
      color: '#fbeb50',
      family: _x('Yellow', 'color', 'web-stories'),
    },
    {
      label: _x('Piedmont Green', 'color', 'web-stories'),
      color: '#263524',
      family: _x('Green', 'color', 'web-stories'),
    },
    {
      label: _x('White', 'color', 'web-stories'),
      color: '#fff',
      family: _x('White', 'color', 'web-stories'),
    },
  ],
  description: __(
    'Soft curved shapes, elegant antique typography and cool colors with green undertones. This template is perfect for when you want your story to feel calm and tranquil but also look bold and vibrant.',
    'web-stories'
  ),
  vertical: _x('Entertainment', 'template vertical', 'web-stories'),
};
