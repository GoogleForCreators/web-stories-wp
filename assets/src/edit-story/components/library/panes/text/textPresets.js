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
import {
  PAGE_HEIGHT,
  FONT_WEIGHT,
  BACKGROUND_TEXT_MODE,
  HIDDEN_PADDING,
} from '../../../../constants';
import { dataFontEm } from '../../../../units';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../../app/font/defaultFonts';

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
  hasHiddenPadding: true,
  ...HIDDEN_PADDING,
};

const DEFAULT_PRESET = {
  content: __('Fill in some text', 'web-stories'),
  fontWeight: FONT_WEIGHT.NORMAL,
  fontSize: dataFontEm(1.2),
  lineHeight: 1.5,
  x: DEFAULT_LEFT_MARGIN,
  y: (PAGE_HEIGHT - dataFontEm(1.5)) / 2,
  font: TEXT_ELEMENT_DEFAULT_FONT,
  width: 160,
  textAlign: 'center',
  borderRadius: DEFAULT_TEXT_BORDER_RADIUS,
};

const PRESETS = [
  {
    title: __('Heading 1', 'web-stories'),
    element: {
      content: `<span style="font-weight: ${FONT_WEIGHT.BOLD}">${__(
        'Heading 1',
        'web-stories'
      )}</span>`,
      fontWeight: FONT_WEIGHT.BOLD,
      fontSize: dataFontEm(2.667),
      lineHeight: 1.19,
      x: DEFAULT_LEFT_MARGIN,
      y: (PAGE_HEIGHT - dataFontEm(2.667)) / 2,
      font: TEXT_ELEMENT_DEFAULT_FONT,
      // Measured in editor. As small as you can make it before line wraps
      width: 181,
      borderRadius: DEFAULT_TEXT_BORDER_RADIUS,
      backgroundTextMode: BACKGROUND_TEXT_MODE.FILL,
      padding: DEFAULT_TEXT_PADDING,
    },
  },
  {
    title: __('Heading 2', 'web-stories'),
    element: {
      content: `<span style="font-weight: ${FONT_WEIGHT.MEDIUM}">${__(
        'Heading 2',
        'web-stories'
      )}</span>`,
      fontWeight: FONT_WEIGHT.MEDIUM,
      fontSize: dataFontEm(2),
      lineHeight: 1.2,
      x: DEFAULT_LEFT_MARGIN,
      y: (PAGE_HEIGHT - dataFontEm(2)) / 2,
      font: TEXT_ELEMENT_DEFAULT_FONT,
      // Measured in editor. As small as you can make it before line wraps
      width: 139,
      borderRadius: DEFAULT_TEXT_BORDER_RADIUS,
      backgroundTextMode: BACKGROUND_TEXT_MODE.FILL,
      padding: DEFAULT_TEXT_PADDING,
    },
  },
  {
    title: __('Heading 3', 'web-stories'),
    element: {
      content: `<span style="font-weight: ${FONT_WEIGHT.NORMAL}">${__(
        'Heading 3',
        'web-stories'
      )}</span>`,
      fontWeight: FONT_WEIGHT.NORMAL,
      fontSize: dataFontEm(1.6),
      lineHeight: 1.2,
      x: DEFAULT_LEFT_MARGIN,
      y: (PAGE_HEIGHT - dataFontEm(1.6)) / 2,
      font: TEXT_ELEMENT_DEFAULT_FONT,
      // Measured in editor. As small as you can make it before line wraps
      width: 114,
      borderRadius: DEFAULT_TEXT_BORDER_RADIUS,
      backgroundTextMode: BACKGROUND_TEXT_MODE.FILL,
      padding: DEFAULT_TEXT_PADDING,
    },
  },
  {
    title: __('Paragraph', 'web-stories'),
    element: {
      content: __(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'web-stories'
      ),
      fontWeight: FONT_WEIGHT.NORMAL,
      fontSize: dataFontEm(1.33),
      lineHeight: 1.2,
      x: DEFAULT_LEFT_MARGIN,
      y: (PAGE_HEIGHT - dataFontEm(1.33)) / 2,
      font: TEXT_ELEMENT_DEFAULT_FONT,
      // Measured in editor. As small as you can make it before line wraps
      width: 188,
      borderRadius: DEFAULT_TEXT_BORDER_RADIUS,
      backgroundTextMode: BACKGROUND_TEXT_MODE.HIGHLIGHT,
      padding: DEFAULT_TEXT_PADDING,
    },
  },
  {
    title: __('Caption', 'web-stories'),
    element: {
      content: `<span style="font-weight: ${FONT_WEIGHT.BOLD}">${__(
        'Caption',
        'web-stories'
      )}</span>`,
      fontWeight: FONT_WEIGHT.BOLD,
      fontSize: dataFontEm(1),
      lineHeight: 1.2,
      x: DEFAULT_LEFT_MARGIN,
      y: (PAGE_HEIGHT - dataFontEm(1)) / 2,
      font: TEXT_ELEMENT_DEFAULT_FONT,
      // Measured in editor. As small as you can make it before line wraps
      width: 64,
      borderRadius: DEFAULT_TEXT_BORDER_RADIUS,
      backgroundTextMode: BACKGROUND_TEXT_MODE.FILL,
      padding: DEFAULT_TEXT_PADDING,
    },
  },
  {
    title: __('LABEL', 'web-stories'),
    element: {
      content: __('LABEL', 'web-stories'),
      fontWeight: FONT_WEIGHT.NORMAL,
      fontSize: dataFontEm(0.888),
      lineHeight: 1.2,
      x: DEFAULT_LEFT_MARGIN,
      y: (PAGE_HEIGHT - dataFontEm(0.888)) / 2,
      font: TEXT_ELEMENT_DEFAULT_FONT,
      // Measured in editor. As small as you can make it before line wraps
      width: 52,
      borderRadius: DEFAULT_TEXT_BORDER_RADIUS,
      backgroundTextMode: BACKGROUND_TEXT_MODE.FILL,
      padding: DEFAULT_TEXT_PADDING,
    },
  },
];

export { DEFAULT_PRESET, PRESETS };
