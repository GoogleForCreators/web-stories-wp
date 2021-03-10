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
import generatePatternStyles from '../generatePatternStyles';

describe('generatePatternStyles', () => {
  describe('given null', () => {
    it('should return transparent', () => {
      expect(generatePatternStyles(null)).toStrictEqual({
        background: 'transparent',
      });
    });
  });

  describe('given an unknown type', () => {
    it('should throw error', () => {
      expect(() => generatePatternStyles({ type: 'comic' })).toThrow(
        /unknown pattern type/i
      );
    });
  });

  describe('given a color', () => {
    it('should return shortest form if possible', () => {
      expect(
        generatePatternStyles({ color: { r: 255, g: 0, b: 0 } })
      ).toStrictEqual({ backgroundColor: '#f00' });
    });

    it('should return short form', () => {
      expect(
        generatePatternStyles({ color: { r: 254, g: 0, b: 0, a: 1 } })
      ).toStrictEqual({ backgroundColor: '#fe0000' });
    });

    it('should return rgba if transparent', () => {
      expect(
        generatePatternStyles({ color: { r: 255, g: 0, b: 0, a: 0.7 } })
      ).toStrictEqual({ backgroundColor: 'rgba(255,0,0,0.7)' });
    });

    it('should be able to render non-background properties', () => {
      expect(
        generatePatternStyles({ color: { r: 255, g: 0, b: 0 } }, 'fill')
      ).toStrictEqual({ fill: '#f00' });
    });
  });

  describe('given any gradient', () => {
    it('should not be able to render non-background properties', () => {
      expect(() =>
        generatePatternStyles(
          {
            type: 'linear',
            stops: [
              { color: { r: 255, g: 0, b: 0 }, position: 0 },
              { color: { r: 0, g: 0, b: 255 }, position: 1 },
            ],
          },
          'fill'
        )
      ).toThrow(/only generate solid/i);
    });
  });

  describe('given a linear gradient', () => {
    it('should be able to render a two-stop gradient at default rotation', () => {
      expect(
        generatePatternStyles({
          type: 'linear',
          stops: [
            { color: { r: 255, g: 0, b: 0 }, position: 0 },
            { color: { r: 0, g: 0, b: 255 }, position: 1 },
          ],
        })
      ).toStrictEqual({
        backgroundImage: 'linear-gradient(0.5turn, #f00 0%, #00f 100%)',
      });
    });

    it('should be able to render a multi-stop gradient with transparencies at an angle', () => {
      expect(
        generatePatternStyles({
          type: 'linear',
          stops: [
            { color: { r: 255, g: 0, b: 0, a: 0 }, position: 0 },
            { color: { r: 255, g: 0, b: 0 }, position: 0.6 },
            { color: { r: 0, g: 0, b: 255 }, position: 1 },
          ],
          rotation: 0.25,
        })
      ).toStrictEqual({
        backgroundImage:
          'linear-gradient(0.75turn, rgba(255,0,0,0) 0%, #f00 60%, #00f 100%)',
      });
    });

    it('should be able to multiply a global alpha to stops', () => {
      expect(
        generatePatternStyles({
          type: 'linear',
          stops: [
            { color: { r: 255, g: 0, b: 0, a: 0.5 }, position: 0 },
            { color: { r: 255, g: 0, b: 0 }, position: 0.6 },
            { color: { r: 0, g: 0, b: 255, a: 0 }, position: 1 },
          ],
          alpha: 0.7,
        })
      ).toStrictEqual({
        backgroundImage:
          'linear-gradient(0.5turn, rgba(255,0,0,0.35) 0%, rgba(255,0,0,0.7) 60%, rgba(0,0,255,0) 100%)',
      });
    });
  });

  describe('given a radial gradient', () => {
    it('should be able to render a two-stop gradient', () => {
      expect(
        generatePatternStyles({
          type: 'radial',
          stops: [
            { color: { r: 255, g: 0, b: 0 }, position: 0 },
            { color: { r: 0, g: 0, b: 255 }, position: 1 },
          ],
        })
      ).toStrictEqual({
        backgroundImage: 'radial-gradient(#f00 0%, #00f 100%)',
      });
    });

    it('should be able to render a multi-stop gradient', () => {
      expect(
        generatePatternStyles({
          type: 'radial',
          stops: [
            { color: { r: 255, g: 0, b: 0, a: 0 }, position: 0 },
            { color: { r: 255, g: 0, b: 0 }, position: 0.6 },
            { color: { r: 0, g: 0, b: 255 }, position: 1 },
          ],
        })
      ).toStrictEqual({
        backgroundImage:
          'radial-gradient(rgba(255,0,0,0) 0%, #f00 60%, #00f 100%)',
      });
    });

    it('should be able to render different size', () => {
      expect(
        generatePatternStyles({
          type: 'radial',
          stops: [
            { color: { r: 255, g: 0, b: 0 }, position: 0 },
            { color: { r: 0, g: 0, b: 255 }, position: 1 },
          ],
          size: { w: 0.2, h: 0.45678 },
        })
      ).toStrictEqual({
        backgroundImage:
          'radial-gradient(ellipse 20% 45.68%, #f00 0%, #00f 100%)',
      });
    });

    it('should be able to render off-center', () => {
      expect(
        generatePatternStyles({
          type: 'radial',
          stops: [
            { color: { r: 255, g: 0, b: 0 }, position: 0 },
            { color: { r: 0, g: 0, b: 255 }, position: 1 },
          ],
          center: { x: 0.4, y: 0.6 },
        })
      ).toStrictEqual({
        backgroundImage: 'radial-gradient(at 40% 60%, #f00 0%, #00f 100%)',
      });
    });

    it('should be able to different size *and* off-center', () => {
      expect(
        generatePatternStyles({
          type: 'radial',
          stops: [
            { color: { r: 255, g: 0, b: 0 }, position: 0 },
            { color: { r: 0, g: 0, b: 255 }, position: 1 },
          ],
          size: { w: 0.2, h: 0.45678 },
          center: { x: 0.4, y: 0.6 },
        })
      ).toStrictEqual({
        backgroundImage:
          'radial-gradient(ellipse 20% 45.68% at 40% 60%, #f00 0%, #00f 100%)',
      });
    });

    it('should be able to multiply a global alpha to stops', () => {
      expect(
        generatePatternStyles({
          type: 'radial',
          stops: [
            { color: { r: 255, g: 0, b: 0, a: 0.5 }, position: 0 },
            { color: { r: 255, g: 0, b: 0 }, position: 0.6 },
            { color: { r: 0, g: 0, b: 255, a: 0 }, position: 1 },
          ],
          alpha: 0.7,
        })
      ).toStrictEqual({
        backgroundImage:
          'radial-gradient(rgba(255,0,0,0.35) 0%, rgba(255,0,0,0.7) 60%, rgba(0,0,255,0) 100%)',
      });
    });
  });
});
