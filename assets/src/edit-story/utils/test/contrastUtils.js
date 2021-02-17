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
import * as contrastUtils from '../contrastUtils';

describe('contrastUtils', () => {
  describe('calculateLuminanceFromRGB', () => {
    it('calculate from RGB object', () => {
      const rgb = {
        r: 255,
        g: 255,
        b: 255,
      };
      expect(contrastUtils.calculateLuminanceFromRGB(rgb)).toStrictEqual(1);
    });
    it('calculate from RGBA object', () => {
      const rgb = {
        r: 255,
        g: 255,
        b: 255,
        a: 1.0,
      };
      expect(contrastUtils.calculateLuminanceFromRGB(rgb)).toStrictEqual(1);
    });
  });

  describe('calculateLuminanceFromStyleColor', () => {
    it('calculate from element rgb style.color string', () => {
      const color = 'rgb(255, 255, 255)';
      expect(
        contrastUtils.calculateLuminanceFromStyleColor(color)
      ).toStrictEqual(1);
    });
    it('calculate from element rgba style.color string', () => {
      const color = 'rgb(255, 255, 255, 1)';
      expect(
        contrastUtils.calculateLuminanceFromStyleColor(color)
      ).toStrictEqual(1);
    });
  });

  describe('checkContrastFromLuminances', () => {
    it('calculate successful contrast check from differing luminances', () => {
      const luminanceA = 0;
      const luminanceB = 1;
      expect(
        contrastUtils.checkContrastFromLuminances(luminanceA, luminanceB)
          .WCAG_AA
      ).toStrictEqual(true);
    });

    it('calculate failed contrast check from similar luminances', () => {
      const luminanceA = 0.3;
      const luminanceB = 1;
      expect(
        contrastUtils.checkContrastFromLuminances(luminanceA, luminanceB)
          .WCAG_AA
      ).toStrictEqual(false);
    });

    it('calculate successful contrast check from large font size', () => {
      const luminanceA = 1;
      const luminanceB = 0.3;
      expect(
        contrastUtils.checkContrastFromLuminances(luminanceA, luminanceB, 24)
          .WCAG_AA
      ).toStrictEqual(true);
    });
    it('calculate failed contrast check from small font size', () => {
      const luminanceA = 1;
      const luminanceB = 0.3;
      expect(
        contrastUtils.checkContrastFromLuminances(luminanceA, luminanceB, 12)
          .WCAG_AA
      ).toStrictEqual(false);
    });
  });
});
