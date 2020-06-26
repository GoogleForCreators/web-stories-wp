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
import { PAGE_HEIGHT, PAGE_WIDTH } from '../../../../constants';
import { dataFontEm } from '../../../../units';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../../app/font/defaultFonts';

// By default, the element should be 50% of the page.
const DEFAULT_ELEMENT_WIDTH = PAGE_WIDTH / 2;
// @todo Once none of the elements are placed randomly, default x can be moved to text/index.js
const DEFAULT_LEFT_MARGIN = 40;

const DEFAULT_PRESET = {
  content: __('Fill in some text', 'web-stories'),
  fontSize: dataFontEm(1),
  x: DEFAULT_LEFT_MARGIN,
  y: (PAGE_HEIGHT - dataFontEm(1)) / 2,
  font: TEXT_ELEMENT_DEFAULT_FONT,
  width: 160,
  textAlign: 'center',
};

const PRESETS = [
  {
    title: __('Heading', 'web-stories'),
    element: {
      content: `<span style="font-weight: 700">${__(
        'Heading',
        'web-stories'
      )}</span>`,
      fontSize: dataFontEm(2),
      x: DEFAULT_LEFT_MARGIN,
      y: (PAGE_HEIGHT - dataFontEm(2)) / 2,
      font: TEXT_ELEMENT_DEFAULT_FONT,
      width: DEFAULT_ELEMENT_WIDTH,
    },
  },
  {
    title: __('Subheading', 'web-stories'),
    element: {
      content: `<span style="font-weight: 600">${__(
        'Subheading',
        'web-stories'
      )}</span>`,
      fontSize: dataFontEm(1.5),
      x: DEFAULT_LEFT_MARGIN,
      y: (PAGE_HEIGHT - dataFontEm(1.5)) / 2,
      font: TEXT_ELEMENT_DEFAULT_FONT,
      width: DEFAULT_ELEMENT_WIDTH,
    },
  },
  {
    title: __('Body text', 'web-stories'),
    element: {
      content: __(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'web-stories'
      ),
      fontSize: dataFontEm(1.1),
      x: DEFAULT_LEFT_MARGIN,
      y: (PAGE_HEIGHT - dataFontEm(1.1)) / 2,
      font: TEXT_ELEMENT_DEFAULT_FONT,
      width: DEFAULT_ELEMENT_WIDTH,
    },
  },
];

export { DEFAULT_PRESET, PRESETS };
