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
  title: _x('Experience Thailand', 'template name', 'web-stories'),
  tags: [
    _x('Explore', 'template keyword', 'web-stories'),
    _x('Adventure', 'template keyword', 'web-stories'),
    _x('Taste', 'template keyword', 'web-stories'),
  ],
  colors: [
    { label: _x('Green', 'color', 'web-stories'), color: '#094228' },
    { label: _x('White', 'color', 'web-stories'), color: '#fff' },
    { label: _x('Yellow', 'color', 'web-stories'), color: '#fec85a' },
    { label: _x('Blue', 'color', 'web-stories'), color: '#0648ad' },
  ],
  description: __(
    'Designed to instil a sense of wanderlust & wonder, the Travel template can be a great foundation for travel inspiration, travel itineraries, restaurant hopping guides, Best-of attraction listicles and other types of travel content.',
    'web-stories'
  ),
  pages: template.pages,
  version: template.version,
  vertical: _x('Travel', 'template vertical', 'web-stories'),
};
