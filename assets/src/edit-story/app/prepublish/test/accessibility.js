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
import * as accessibilityChecks from '../accessibility';

describe('Pre-publish checklist - accessibility issues (warnings)', () => {
  describe('textElementFontLowContrast', () => {
    it('should return a warning if text element is low contrast', () => {
      const element = {
        id: 'elementid',
        type: 'text',
        fontSize: 19,
        backgroundTextMode: 'FILL',
        backgroundColor: {
          color: {
            r: 200,
            g: 200,
            b: 200,
          },
        },
        content: '<span style="color: #fff">HOT GOSSIP ARTICLE</span>',
      };
      expect(
        accessibilityChecks.textElementFontLowContrast(element)
      ).toStrictEqual({
        message: 'Low contrast between font and background color',
        elementId: element.id,
        type: 'warning',
      });
    });

    it('should return undefined if text element is high enough contrast', () => {
      const element = {
        id: 'elementid',
        type: 'text',
        fontSize: 19,
        backgroundTextMode: 'FILL',
        backgroundColor: {
          color: {
            r: 255,
            g: 0,
            b: 153,
          },
        },
        content: '<span style="color: #fff">HOT GOSSIP ARTICLE</span>',
      };
      expect(
        accessibilityChecks.textElementFontLowContrast(element)
      ).toBeUndefined();
    });

    it('should return undefined if content has no spans', () => {
      const element = {
        id: 'elementid',
        type: 'text',
        fontSize: 19,
        backgroundTextMode: 'FILL',
        backgroundColor: {
          color: {
            r: 255,
            g: 0,
            b: 153,
          },
        },
        content: 'HOT GOSSIP ARTICLE',
      };
      expect(
        accessibilityChecks.textElementFontLowContrast(element)
      ).toBeUndefined();
    });

    it('should return undefined if element has no background fill', () => {
      const element = {
        id: 'elementid',
        type: 'text',
        fontSize: 19,
        backgroundTextMode: 'NONE',
        content: '<span style="color: #fff">HOT GOSSIP ARTICLE</span>',
      };
      expect(
        accessibilityChecks.textElementFontLowContrast(element)
      ).toBeUndefined();
    });

    it('should return undefined if not a text element', () => {
      const element = {
        id: 'elementid',
        type: 'image',
      };
      expect(
        accessibilityChecks.textElementFontLowContrast(element)
      ).toBeUndefined();
    });
  });

  describe('textElementFontSizeTooSmall', () => {
    it('should return a warning if text element font size is too small', () => {
      const element = {
        id: 'elementid',
        type: 'text',
        fontSize: 11,
      };
      expect(
        accessibilityChecks.textElementFontSizeTooSmall(element)
      ).toStrictEqual({
        message: 'Font size too small',
        elementId: element.id,
        type: 'warning',
      });
    });

    it('should return undefined if text element font size is large enough', () => {
      const element = {
        id: 'elementid',
        type: 'text',
        fontSize: 12,
      };
      expect(
        accessibilityChecks.textElementFontSizeTooSmall(element)
      ).toBeUndefined();
    });

    it('should return undefined if not a text element', () => {
      const element = {
        id: 'elementid',
        type: 'image',
      };
      expect(
        accessibilityChecks.textElementFontSizeTooSmall(element)
      ).toBeUndefined();
    });
  });

  describe('imageElementLowImageResolution', () => {
    it.todo('should return a warning if image element is low pixel density');
    it.todo(
      'should return undefined if image element has high enough pixel density'
    );
    it.todo('should return undefined if not an image element');
  });

  describe('videoElementMissingTitle', () => {
    it.todo('should return a warning if video element missing title');
    it.todo('should return undefined if video element has title');
    it.todo('should return undefined if not an video element');
  });

  describe('videoElementMissingSubtitle', () => {
    it.todo('should return a warning if video element missing subtitle');
    it.todo('should return undefined if video element has subtitle');
    it.todo('should return undefined if not an video element');
  });

  describe('videoElementMissingCaptions', () => {
    it.todo('should return a warning if video element missing captions');
    it.todo('should return undefined if video element has captions');
    it.todo('should return undefined if not an video element');
  });

  describe('pageTooManyLinks', () => {
    it.todo('should return a warning if page has too many links');
    it.todo('should return undefined if page has a reasonable number of links');
  });

  describe('textElementTappableRegionTooSmall', () => {
    it.todo(
      'should return a warning if text element tappable region is too small'
    );
    it.todo(
      'should return undefined if text element has large enough tappable region'
    );
    it.todo('should return undefined if not an text element');
  });

  describe('imageElementMissingAltText', () => {
    it.todo('should return a warning if image element is missing alt text');
    it.todo('should return undefined if image element has alt text');
    it.todo('should return undefined if not an image element');
  });
});
