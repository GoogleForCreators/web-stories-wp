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
import {
  dataToEditorX,
  dataToEditorY,
  dataToFontSizeY as dataToFontSize,
} from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import {
  generateFontFamily,
  getHighlightLineheight,
  generateParagraphTextStyle,
} from '../util';

const TEXT_ELEMENT = {
  opacity: 100,
  flip: {
    vertical: false,
    horizontal: false,
  },
  rotationAngle: 0,
  lockAspectRatio: true,
  backgroundTextMode: 'NONE',
  font: {
    family: 'Roboto',
    weights: [100, 300, 400, 500, 700, 900],
    styles: ['italic', 'regular'],
    variants: [
      [0, 100],
      [1, 100],
      [0, 300],
      [1, 300],
      [0, 400],
      [1, 400],
      [0, 500],
      [1, 500],
      [0, 700],
      [1, 700],
      [0, 900],
      [1, 900],
    ],
    fallbacks: ['Helvetica Neue', 'Helvetica', 'sans-serif'],
    service: 'fonts.google.com',
    metrics: {
      upm: 2048,
      asc: 1900,
      des: -500,
      tAsc: 1536,
      tDes: -512,
      tLGap: 102,
      wAsc: 1946,
      wDes: 512,
      xH: 1082,
      capH: 1456,
      yMin: -555,
      yMax: 2163,
      hAsc: 1900,
      hDes: -500,
      lGap: 0,
    },
  },
  fontSize: 18,
  backgroundColor: {
    color: {
      r: 196,
      g: 196,
      b: 196,
    },
  },
  lineHeight: 1.5,
  textAlign: 'initial',
  padding: {
    vertical: 0,
    horizontal: 0,
    locked: true,
  },
  type: 'text',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  x: 40,
  y: 300,
  width: 206,
  height: 75,
  scale: 100,
  focalX: 50,
  focalY: 50,
  id: '8d110168-e765-4c76-b63a-74ec23d54f27',
};

describe('Text/util', () => {
  describe('generateFontFamily', () => {
    it('should return correct string value for font family', () => {
      const fallbackArray = [];
      const expected = '"Baloo Bhaina 2"';
      expect(
        generateFontFamily({
          family: 'Baloo Bhaina 2',
          fallbacks: fallbackArray,
        })
      ).toStrictEqual(expected);
      expect(generateFontFamily({ family: 'Baloo Bhaina 2' })).toStrictEqual(
        expected
      );
    });

    it('should return correct string value for font family with fallbacks', () => {
      const fallbackArray = ['foo', 'bar', 'sans-serif'];
      const expected = '"Baloo Bhaina 2","foo","bar",sans-serif';
      expect(
        generateFontFamily({
          family: 'Baloo Bhaina 2',
          fallbacks: fallbackArray,
        })
      ).toStrictEqual(expected);
    });
  });

  describe('getHighlightLineheight', () => {
    it('should return correct value when just line-height', () => {
      const actual = getHighlightLineheight(3);
      const expected = '3em';
      expect(actual).toStrictEqual(expected);
    });

    it('should return correct value with positive padding', () => {
      const actual = getHighlightLineheight(3, 10);
      const expected = 'calc(3em + 20px)';
      expect(actual).toStrictEqual(expected);
    });

    it('should return correct value with negative padding', () => {
      const actual = getHighlightLineheight(3, -6);
      const expected = 'calc(3em - 12px)';
      expect(actual).toStrictEqual(expected);
    });

    it('should return correct value with given units', () => {
      const actual = getHighlightLineheight(3, 2, '%');
      const expected = 'calc(3em + 4%)';
      expect(actual).toStrictEqual(expected);
    });
  });

  describe('generateParagraphTextStyle', () => {
    it('should return valid styles', () => {
      const element = TEXT_ELEMENT;
      const { width } = element;
      const { font, lineHeight, textAlign } = element;

      // Usage as in <TextOutput>
      const dataToStyleX = (x) => `${dataToEditorX(x, 100)}%`;
      const dataToStyleY = (y) => `${dataToEditorY(y, 100)}%`;
      const dataToFontSizeY = (y) => `${dataToFontSize(y, 100)}em`;
      const dataToPaddingY = (y) => `${(y / width) * 100}%`;
      const actual = generateParagraphTextStyle(
        element,
        dataToStyleX,
        dataToStyleY,
        dataToFontSizeY,
        element,
        dataToPaddingY
      );
      const expected = {
        dataToEditorY: dataToStyleY,
        whiteSpace: 'pre-wrap',
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
        margin: '-1.4335558252427185% 0',
        fontFamily: '"Roboto","Helvetica Neue","Helvetica",sans-serif',
        fontSize: '0.291262em',
        font,
        lineHeight,
        textAlign,
        padding: 0,
      };
      expect(actual).toStrictEqual(expected);
    });

    it('should return valid styles for element with padding', () => {
      const element = {
        ...TEXT_ELEMENT,
        padding: {
          vertical: 10,
          horizontal: 10,
          locked: true,
        },
      };
      const { width } = element;
      const { font, lineHeight, textAlign } = element;

      // Usage as in <TextOutput>
      const dataToStyleX = (x) => `${dataToEditorX(x, 100)}%`;
      const dataToStyleY = (y) => `${dataToEditorY(y, 100)}%`;
      const dataToFontSizeY = (y) => `${dataToFontSize(y, 100)}em`;
      const dataToPaddingY = (y) => `${(y / width) * 100}%`;
      const actual = generateParagraphTextStyle(
        element,
        dataToStyleX,
        dataToStyleY,
        dataToFontSizeY,
        element,
        dataToPaddingY
      );
      const expected = {
        dataToEditorY: dataToStyleY,
        whiteSpace: 'pre-wrap',
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
        margin: '-1.4335558252427185% 0',
        fontFamily: '"Roboto","Helvetica Neue","Helvetica",sans-serif',
        fontSize: '0.291262em',
        font,
        lineHeight,
        textAlign,
        padding: '1.61812% 2.42718%',
      };
      expect(actual).toStrictEqual(expected);
    });

    it('should return valid styles for element with one-sided padding', () => {
      const element = {
        ...TEXT_ELEMENT,
        padding: {
          vertical: 10,
          horizontal: 0,
          locked: true,
        },
      };
      const { width } = element;
      const { font, lineHeight, textAlign } = element;

      // Usage as in <TextOutput>
      const dataToStyleX = (x) => `${dataToEditorX(x, 100)}%`;
      const dataToStyleY = (y) => `${dataToEditorY(y, 100)}%`;
      const dataToFontSizeY = (y) => `${dataToFontSize(y, 100)}em`;
      const dataToPaddingY = (y) => `${(y / width) * 100}%`;
      const actual = generateParagraphTextStyle(
        element,
        dataToStyleX,
        dataToStyleY,
        dataToFontSizeY,
        element,
        dataToPaddingY
      );
      const expected = {
        dataToEditorY: dataToStyleY,
        whiteSpace: 'pre-wrap',
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
        margin: '-1.4335558252427185% 0',
        fontFamily: '"Roboto","Helvetica Neue","Helvetica",sans-serif',
        fontSize: '0.291262em',
        font,
        lineHeight,
        textAlign,
        padding: '1.61812% 0%',
      };
      expect(actual).toStrictEqual(expected);
    });

    it('should allow using pixels as padding units', () => {
      const element = {
        ...TEXT_ELEMENT,
        padding: {
          vertical: 10,
          horizontal: 0,
          locked: true,
        },
      };

      // Usage with pixels
      const dataToStyleX = (x) => `${dataToEditorX(x, 100)}px`;
      const dataToStyleY = (y) => `${dataToEditorY(y, 100)}px`;
      const { padding } = generateParagraphTextStyle(
        element,
        dataToStyleX,
        dataToStyleY,
        undefined,
        element
      );
      expect(padding).toBe('1.61812px 0px');
    });
  });
});
