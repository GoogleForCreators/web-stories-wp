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
  slug: 'one-day-city-itinerary',
  creationDate: '2021-08-25T00:00:00.000Z',
  title: _x('One Day City Itinerary', 'template name', 'web-stories'),
  tags: [
    _x('Travel', 'template keyword', 'web-stories'),
    _x('Brochure', 'template keyword', 'web-stories'),
    _x('Guide', 'template keyword', 'web-stories'),
    _x('Aesthetic', 'template keyword', 'web-stories'),
    _x('White', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Berry Red', 'color', 'web-stories'),
      color: '#e0193e',
      family: _x('Red', 'color', 'web-stories'),
    },
    {
      label: _x('Havana White', 'color', 'web-stories'),
      color: '#f7ece3',
      family: _x('White', 'color', 'web-stories'),
    },
    {
      label: _x('White', 'color', 'web-stories'),
      color: '#fff',
      family: _x('White', 'color', 'web-stories'),
    },
  ],
  description: __(
    'With its combination of 3 beautiful fonts, curved sections and bright colors, this template is equipped with the liveliness of an elegant travel magazine. Create one-day itineraries, sight-seeing guides and other stories for urban travel. Change the colors to suit your style.',
    'web-stories'
  ),
  vertical: _x('Travel', 'template vertical', 'web-stories'),
};
