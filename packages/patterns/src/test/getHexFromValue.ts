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
import getHexFromValue from '../getHexFromValue';

describe('getHexFromValue', () => {
  describe('when value is valid', () => {
    it('should accept valid 1 character hex values', () => {
      // Include # at start of string
      expect(getHexFromValue('#A')).toBe('AAAAAA');

      // Missing # at start of string
      expect(getHexFromValue('B')).toBe('BBBBBB');

      // Has extra space in string
      expect(getHexFromValue('  F ')).toBe('FFFFFF');
    });

    it('should accept valid 2 character hex values', () => {
      // Include # at start of string
      expect(getHexFromValue('#EF')).toBe('EFEFEF');

      // Missing # at start of string
      expect(getHexFromValue('EF')).toBe('EFEFEF');

      // Has extra space in string
      expect(getHexFromValue('  EF ')).toBe('EFEFEF');
    });

    it('should accept valid 3 character shorthand hex values', () => {
      // Include # at start of string
      expect(getHexFromValue('#F60')).toBe('FF6600');

      // Missing # at start of string
      expect(getHexFromValue('4AF')).toBe('44AAFF');

      // Has extra space in string
      expect(getHexFromValue('  AF1  ')).toBe('AAFF11');
    });

    it('should accept valid 4 character hex values', () => {
      // Include # at start of string
      expect(getHexFromValue('#1122')).toBe('111122');

      // Missing # at start of string
      expect(getHexFromValue('1122')).toBe('111122');

      // Has extra space in string
      expect(getHexFromValue('  1122 ')).toBe('111122');
    });

    it('should accept valid 6 character hex values', () => {
      // Include # at start of string
      expect(getHexFromValue('#45FFAA')).toBe('45FFAA');

      // Missing # at start of string
      expect(getHexFromValue('BB88AA')).toBe('BB88AA');

      // Has extra space in string
      expect(getHexFromValue('  22FFAA ')).toBe('22FFAA');
    });

    it('should accept uppercase or lowercase strings', () => {
      expect(getHexFromValue('#11a3cf')).toBe('11A3CF');
      expect(getHexFromValue('a6f')).toBe('AA66FF');
    });
  });

  describe('when value is invalid', () => {
    it('should return null if invalid 6 character hex', () => {
      // invalid character(s) in string
      expect(getHexFromValue('#45ZFAA')).toBeNull();
      expect(getHexFromValue('asdlfa')).toBeNull();
      expect(getHexFromValue('11111x')).toBeNull();
    });

    it('should return null if invalid 3 character shorthand hex', () => {
      // invalid character(s) in string
      expect(getHexFromValue('#ZA1')).toBeNull();
      expect(getHexFromValue('MM8')).toBeNull();
      expect(getHexFromValue('..$')).toBeNull();
    });

    it('should return null if value length is too short or too long', () => {
      expect(getHexFromValue('#')).toBeNull();
      expect(getHexFromValue('f2a4A')).toBeNull();
      expect(getHexFromValue('f2a4Af3214')).toBeNull();
      expect(getHexFromValue('jsdhf78384')).toBeNull();
      expect(getHexFromValue('')).toBeNull();
    });
  });
});
