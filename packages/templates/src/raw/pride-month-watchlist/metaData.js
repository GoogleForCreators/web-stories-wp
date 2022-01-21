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
  slug: 'pride-month-watchlist',
  creationDate: '2021-07-29T00:00:00.000Z',
  title: _x('Pride Month Watchlist', 'template name', 'web-stories'),
  tags: [
    _x('Entertainment', 'template keyword', 'web-stories'),
    _x('Watchlist', 'template keyword', 'web-stories'),
    _x('Favourite', 'template keyword', 'web-stories'),
    _x('Colourful', 'template keyword', 'web-stories'),
    _x('Green', 'template keyword', 'web-stories'),
  ],
  colors: [
    {
      label: _x('Emerald Green', 'color', 'web-stories'),
      color: '#006110',
      family: _x('Green', 'color', 'web-stories'),
    },
    {
      label: _x('Venice Red', 'color', 'web-stories'),
      color: '#b50021',
      family: _x('Red', 'color', 'web-stories'),
    },
    {
      label: _x('Dark Raspberry Pink', 'color', 'web-stories'),
      color: '#9e005f',
      family: _x('Pink', 'color', 'web-stories'),
    },
    {
      label: _x('Black', 'color', 'web-stories'),
      color: '#000',
      family: _x('Black', 'color', 'web-stories'),
    },
    {
      label: _x('Daring Violet', 'color', 'web-stories'),
      color: '#5c0094',
      family: _x('Purple', 'color', 'web-stories'),
    },
    {
      label: _x('White', 'color', 'web-stories'),
      color: '#fff',
      family: _x('White', 'color', 'web-stories'),
    },
  ],
  description: __(
    'Sassy and bold with no distractions, this template will let you create watchlists, summaries, synopses and more with personality and character.',
    'web-stories'
  ),
  vertical: _x('Entertainment', 'template vertical', 'web-stories'),
};
