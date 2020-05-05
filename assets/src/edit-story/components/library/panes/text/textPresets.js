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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { dataFontEm } from '../../../../units';

const DEFAULT_FONT = {
  id: 'default-text',
  content: __('Fill in some text', 'web-stories'),
  fontSize: dataFontEm(1.1),
  fontWeight: 400,
  font: {
    family: 'Roboto',
    service: 'fonts.google.com',
  },
};

const PRESETS = [
  {
    id: 'heading',
    title: __('Heading', 'web-stories'),
    content: __('Heading', 'web-stories'),
    fontSize: dataFontEm(2),
    fontWeight: 700,
    font: {
      family: 'Open Sans',
      service: 'fonts.google.com',
    },
  },
  {
    id: 'subheading',
    title: __('Subheading', 'web-stories'),
    content: __('Subheading', 'web-stories'),
    fontSize: dataFontEm(1.5),
    fontWeight: 600,
    font: {
      family: 'Open Sans',
      service: 'fonts.google.com',
    },
  },
  {
    id: 'body-text',
    title: __('Body text', 'web-stories'),
    content: __(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'web-stories'
    ),
    fontSize: dataFontEm(1.1),
    fontWeight: 400,
    font: {
      family: 'Roboto',
      service: 'fonts.google.com',
    },
  },
];

export { DEFAULT_FONT, PRESETS };
