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
import { dataFontEm, PAGE_HEIGHT } from '@web-stories-wp/units';

/**
 * Internal dependencies
 */
import { FONT_WEIGHT, BACKGROUND_TEXT_MODE } from '../../../../constants';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../../app/font/defaultFonts';

// Measured in editor. As small as you can make
// width with preset font before line wraps
const DEFAULT_WIDTH = {
  DEFAULT: 165,
  HEADING_1: 186,
  HEADING_2: 145,
  HEADING_3: 120,
  PARAGRAPH: 200,
  CAPTION: 70,
  LABEL: 56,
};

// @todo Once none of the elements are placed randomly, default x can be moved to text/index.js
const DEFAULT_LEFT_MARGIN = 40;

const DEFAULT_TEXT_BORDER_RADIUS = {
  locked: true,
  topLeft: 2,
  topRight: 2,
  bottomRight: 2,
  bottomLeft: 2,
};

const DEFAULT_TEXT_PADDING = {
  locked: true,
  hasHiddenPadding: false,
};

const DEFAULT_PRESET = {
  content: __('Fill in some text', 'web-stories'),
  fontWeight: FONT_WEIGHT.NORMAL,
  fontSize: dataFontEm(1.2),
  lineHeight: 1.5,
  x: DEFAULT_LEFT_MARGIN,
  y: (PAGE_HEIGHT - dataFontEm(1.5)) / 2,
  font: TEXT_ELEMENT_DEFAULT_FONT,
  width: DEFAULT_WIDTH.DEFAULT,
  textAlign: 'center',
  borderRadius: DEFAULT_TEXT_BORDER_RADIUS,
  padding: DEFAULT_TEXT_PADDING,
};

const PRESETS = [
  {
    title: _x('Title 1', 'text preset title', 'web-stories'),
    element: {
      content: `<span style="font-weight: ${FONT_WEIGHT.BOLD}">${_x(
        'Title 1',
        'text preset content',
        'web-stories'
      )}</span>`,
      fontWeight: FONT_WEIGHT.BOLD,
      fontSize: dataFontEm(2.667),
      lineHeight: 1.19,
      x: DEFAULT_LEFT_MARGIN,
      y: (PAGE_HEIGHT - dataFontEm(2.667)) / 2,
      font: TEXT_ELEMENT_DEFAULT_FONT,
      width: DEFAULT_WIDTH.HEADING_1,
      borderRadius: DEFAULT_TEXT_BORDER_RADIUS,
      backgroundTextMode: BACKGROUND_TEXT_MODE.NONE,
      padding: DEFAULT_TEXT_PADDING,
    },
  },
  {
    title: _x('Title 2', 'text preset title', 'web-stories'),
    element: {
      content: `<span style="font-weight: ${FONT_WEIGHT.BOLD}">${_x(
        'Title 2',
        'text preset content',
        'web-stories'
      )}</span>`,
      fontWeight: FONT_WEIGHT.BOLD,
      fontSize: dataFontEm(2),
      lineHeight: 1.2,
      x: DEFAULT_LEFT_MARGIN,
      y: (PAGE_HEIGHT - dataFontEm(2)) / 2,
      font: TEXT_ELEMENT_DEFAULT_FONT,
      width: DEFAULT_WIDTH.HEADING_2,
      borderRadius: DEFAULT_TEXT_BORDER_RADIUS,
      backgroundTextMode: BACKGROUND_TEXT_MODE.NONE,
      padding: DEFAULT_TEXT_PADDING,
    },
  },
  {
    title: _x('Title 3', 'text preset title', 'web-stories'),
    element: {
      content: `<span style="font-weight: ${FONT_WEIGHT.BOLD}">${_x(
        'Title 3',
        'text preset content',
        'web-stories'
      )}</span>`,
      fontWeight: FONT_WEIGHT.BOLD,
      fontSize: dataFontEm(1.6),
      lineHeight: 1.2,
      x: DEFAULT_LEFT_MARGIN,
      y: (PAGE_HEIGHT - dataFontEm(1.6)) / 2,
      font: TEXT_ELEMENT_DEFAULT_FONT,
      width: DEFAULT_WIDTH.HEADING_3,
      borderRadius: DEFAULT_TEXT_BORDER_RADIUS,
      backgroundTextMode: BACKGROUND_TEXT_MODE.NONE,
      padding: DEFAULT_TEXT_PADDING,
    },
  },
  {
    title: _x('Paragraph', 'text preset title', 'web-stories'),
    element: {
      content: _x(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'text preset content',
        'web-stories'
      ),
      fontWeight: FONT_WEIGHT.NORMAL,
      fontSize: dataFontEm(1.33),
      lineHeight: 1.2,
      x: DEFAULT_LEFT_MARGIN,
      y: (PAGE_HEIGHT - dataFontEm(1.33)) / 2,
      font: TEXT_ELEMENT_DEFAULT_FONT,
      width: DEFAULT_WIDTH.PARAGRAPH,
      borderRadius: DEFAULT_TEXT_BORDER_RADIUS,
      backgroundTextMode: BACKGROUND_TEXT_MODE.NONE,
      padding: DEFAULT_TEXT_PADDING,
    },
  },
  {
    title: _x('Caption', 'text preset title', 'web-stories'),
    element: {
      content: `<span style="font-weight: ${FONT_WEIGHT.NORMAL}">${_x(
        'Caption',
        'text preset content',
        'web-stories'
      )}</span>`,
      fontWeight: FONT_WEIGHT.NORMAL,
      fontSize: dataFontEm(1),
      lineHeight: 1.2,
      x: DEFAULT_LEFT_MARGIN,
      y: (PAGE_HEIGHT - dataFontEm(1)) / 2,
      font: TEXT_ELEMENT_DEFAULT_FONT,
      width: DEFAULT_WIDTH.CAPTION,
      borderRadius: DEFAULT_TEXT_BORDER_RADIUS,
      backgroundTextMode: BACKGROUND_TEXT_MODE.NONE,
      padding: DEFAULT_TEXT_PADDING,
    },
  },
  {
    title: _x('Label', 'text preset title', 'web-stories').toUpperCase(),
    element: {
      content: _x('Label', 'text preset content', 'web-stories').toUpperCase(),
      fontWeight: FONT_WEIGHT.NORMAL,
      fontSize: dataFontEm(0.888),
      lineHeight: 1.2,
      x: DEFAULT_LEFT_MARGIN,
      y: (PAGE_HEIGHT - dataFontEm(0.888)) / 2,
      font: TEXT_ELEMENT_DEFAULT_FONT,
      width: DEFAULT_WIDTH.LABEL,
      borderRadius: DEFAULT_TEXT_BORDER_RADIUS,
      backgroundTextMode: BACKGROUND_TEXT_MODE.NONE,
      padding: DEFAULT_TEXT_PADDING,
    },
  },
];

export { DEFAULT_PRESET, PRESETS };
