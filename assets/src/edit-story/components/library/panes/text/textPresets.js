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
  fontSize: dataFontEm(1.2),
  lineHeight: 1.5,
  x: DEFAULT_LEFT_MARGIN,
  y: (PAGE_HEIGHT - dataFontEm(1.5)) / 2,
  font: TEXT_ELEMENT_DEFAULT_FONT,
  width: 160,
  textAlign: 'center',
};

const PRESETS = [
  {
    title: __('Heading 1', 'web-stories'),
    element: {
      content: `<span style="font-weight: 700">${__(
        'Heading 1',
        'web-stories'
      )}</span>`,
      fontSize: dataFontEm(2.7),
      lineHeight: 1.1,
      x: DEFAULT_LEFT_MARGIN,
      y: (PAGE_HEIGHT - dataFontEm(2.7)) / 2,
      font: TEXT_ELEMENT_DEFAULT_FONT,
      width: DEFAULT_ELEMENT_WIDTH,
    },
  },
  {
    title: __('Heading 2', 'web-stories'),
    element: {
      content: `<span style="font-weight: 700">${__(
        'Heading 2',
        'web-stories'
      )}</span>`,
      fontSize: dataFontEm(2),
      lineHeight: 1.2,
      x: DEFAULT_LEFT_MARGIN,
      y: (PAGE_HEIGHT - dataFontEm(2)) / 2,
      font: TEXT_ELEMENT_DEFAULT_FONT,
      width: DEFAULT_ELEMENT_WIDTH,
    },
  },
  {
    title: __('Heading 3', 'web-stories'),
    element: {
      content: `<span style="font-weight: 700">${__(
        'Heading 3',
        'web-stories'
      )}</span>`,
      fontSize: dataFontEm(1.6),
      lineHeight: 1.3,
      x: DEFAULT_LEFT_MARGIN,
      y: (PAGE_HEIGHT - dataFontEm(1.6)) / 2,
      font: TEXT_ELEMENT_DEFAULT_FONT,
      width: DEFAULT_ELEMENT_WIDTH,
    },
  },
  {
    title: __('Paragraph', 'web-stories'),
    element: {
      content: __(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'web-stories'
      ),
      fontSize: dataFontEm(1.3),
      lineHeight: 1.5,
      x: DEFAULT_LEFT_MARGIN,
      y: (PAGE_HEIGHT - dataFontEm(1.3)) / 2,
      font: TEXT_ELEMENT_DEFAULT_FONT,
      width: DEFAULT_ELEMENT_WIDTH,
    },
  },
  {
    title: __('Caption', 'web-stories'),
    element: {
      content: __('Caption', 'web-stories'),
      fontSize: dataFontEm(1),
      lineHeight: 1.5,
      x: DEFAULT_LEFT_MARGIN,
      y: (PAGE_HEIGHT - dataFontEm(1)) / 2,
      font: TEXT_ELEMENT_DEFAULT_FONT,
      width: DEFAULT_ELEMENT_WIDTH,
    },
  },
  {
    title: __('OVERLINE', 'web-stories'),
    element: {
      content: __('OVERLINE', 'web-stories'),
      fontSize: dataFontEm(0.9),
      lineHeight: 1.5,
      x: DEFAULT_LEFT_MARGIN,
      y: (PAGE_HEIGHT - dataFontEm(0.9)) / 2,
      font: TEXT_ELEMENT_DEFAULT_FONT,
      width: DEFAULT_ELEMENT_WIDTH,
    },
  },
];

export { DEFAULT_PRESET, PRESETS };
