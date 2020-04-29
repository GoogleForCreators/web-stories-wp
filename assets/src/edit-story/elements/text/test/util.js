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
 * Internal dependencies
 */
import { draftMarkupToContent, generateFontFamily } from '../util';

describe('Text/util', () => {
  describe('Text/util/generateFontFamily', () => {
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

  describe('Text/util/draftMarkupToContent', () => {
    it('should return valid HTML for content', () => {
      const input = '<em>Hello World!';
      expect(draftMarkupToContent(input, false)).toStrictEqual(
        '<em>Hello World!</em>'
      );

      const nestedInput = '<em>Hello <strong>World, again!';
      expect(draftMarkupToContent(nestedInput, false)).toStrictEqual(
        '<em>Hello <strong>World, again!</strong></em>'
      );

      const invalidInput = '<em>Hello</strong> world<u font="> not';
      expect(draftMarkupToContent(invalidInput, false)).toStrictEqual(
        '<em>Hello world</em>'
      );
    });

    it('should add <strong> wrapper when bold', () => {
      const input = 'Hello World!';
      expect(draftMarkupToContent(input, true)).toStrictEqual(
        '<strong>Hello World!</strong>'
      );
    });
  });
});
