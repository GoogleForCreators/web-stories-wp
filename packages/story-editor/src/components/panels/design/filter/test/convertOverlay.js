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
import { OverlayType } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import convertOverlay from '../convertOverlay';

describe('convertOverlay', () => {
  it('should return null if converting any overlay to none', () => {
    expect(convertOverlay(null, OverlayType.NONE, OverlayType.NONE)).toBeNull();
    expect(convertOverlay({}, OverlayType.SOLID, OverlayType.NONE)).toBeNull();
    expect(convertOverlay({}, OverlayType.RADIAL, OverlayType.NONE)).toBeNull();
    expect(convertOverlay({}, OverlayType.LINEAR, OverlayType.NONE)).toBeNull();
  });

  describe('when converting from no overlay', () => {
    it('should return default 50% black when converting to solid overlay', () => {
      const result = convertOverlay(null, OverlayType.NONE, OverlayType.SOLID);
      // expect 50% black
      const expected = { color: { r: 0, g: 0, b: 0, a: 0.5 } };
      expect(result).toStrictEqual(expected);
    });

    it('should return default transparent-to-black when converting to linear overlay', () => {
      const result = convertOverlay(null, OverlayType.NONE, OverlayType.LINEAR);
      // expect 0-70% transparent-to-black (top-to-bottom) linear gradient as specified
      const expected = {
        type: 'linear',
        rotation: 0,
        stops: [
          { color: { r: 0, g: 0, b: 0, a: 0 }, position: 0 },
          { color: { r: 0, g: 0, b: 0, a: 1 }, position: 1 },
        ],
        alpha: 0.7,
      };
      expect(result).toStrictEqual(expected);
    });

    it('should return default black vignette when converting to radial overlay', () => {
      const result = convertOverlay(null, OverlayType.NONE, OverlayType.RADIAL);
      const expected = {
        type: 'radial',
        size: { w: 0.67, h: 0.67 },
        stops: [
          { color: { r: 0, g: 0, b: 0, a: 0 }, position: 0 },
          { color: { r: 0, g: 0, b: 0, a: 1 }, position: 1 },
        ],
        alpha: 0.7,
      };
      expect(result).toStrictEqual(expected);
    });
  });

  describe('when converting from solid 20% red overlay', () => {
    const red = { color: { r: 255, g: 0, b: 0, a: 0.2 } };

    it('should return exact same overlay when "converting" to solid overlay', () => {
      const result = convertOverlay(red, OverlayType.SOLID, OverlayType.SOLID);
      expect(result).toStrictEqual(red);
    });

    it('should return default transparent-to-black when converting to linear overlay', () => {
      const result = convertOverlay(red, OverlayType.SOLID, OverlayType.LINEAR);
      // expect 20% transparent-to-red (top-to-bottom) linear gradient
      const expected = {
        type: 'linear',
        rotation: 0,
        stops: [
          { color: { r: 255, g: 0, b: 0, a: 0 }, position: 0.4 },
          { color: { r: 255, g: 0, b: 0, a: 1 }, position: 1 },
        ],
        alpha: 0.2,
      };
      expect(result).toStrictEqual(expected);
    });

    it('should return default black vignette when converting to radial overlay', () => {
      const result = convertOverlay(red, OverlayType.SOLID, OverlayType.RADIAL);
      // expect 20% red vignette
      const expected = {
        type: 'radial',
        size: { w: 0.67, h: 0.67 },
        stops: [
          { color: { r: 255, g: 0, b: 0, a: 0 }, position: 0 },
          { color: { r: 255, g: 0, b: 0, a: 1 }, position: 1 },
        ],
        alpha: 0.2,
      };
      expect(result).toStrictEqual(expected);
    });
  });

  describe('when converting from green-to-blue linear overlay', () => {
    const gb = {
      type: 'linear',
      rotation: 0,
      stops: [
        { color: { r: 0, g: 255, b: 0, a: 0.4 }, position: 0 },
        { color: { r: 0, g: 0, b: 255, a: 0.7 }, position: 1 },
      ],
      alpha: 0.8,
    };

    it('should return most opaque color stop (blue) at 50% opacity', () => {
      const result = convertOverlay(gb, OverlayType.LINEAR, OverlayType.SOLID);
      // expect 30% blue
      const expected = { color: { r: 0, g: 0, b: 255, a: 0.5 } };
      expect(result).toStrictEqual(expected);
    });

    it('should return the same when "converting" to linear', () => {
      const result = convertOverlay(gb, OverlayType.LINEAR, OverlayType.LINEAR);
      expect(result).toStrictEqual(gb);
    });

    it('should return vignette with exact same stops and alpha', () => {
      const result = convertOverlay(gb, OverlayType.LINEAR, OverlayType.RADIAL);
      const expected = {
        type: 'radial',
        size: { w: 0.67, h: 0.67 },
        stops: gb.stops,
        alpha: gb.alpha,
      };
      expect(result).toStrictEqual(expected);
    });
  });

  describe('when converting from pink vignette (radial) overlay', () => {
    const p = {
      type: 'radial',
      size: { w: 0.8, h: 0.5 },
      stops: [
        { color: { r: 0, g: 0, b: 0, a: 0 }, position: 0 },
        { color: { r: 255, g: 192, b: 203, a: 1 }, position: 1 },
      ],
      alpha: 0.8,
    };

    it('should return most opaque color stop (pink) at 30% opacity', () => {
      const result = convertOverlay(p, OverlayType.RADIAL, OverlayType.SOLID);
      // expect 50% pink
      const expected = { color: { r: 255, g: 192, b: 203, a: 0.5 } };
      expect(result).toStrictEqual(expected);
    });

    it('should return linear gradient with exact same stops and alpha', () => {
      const result = convertOverlay(p, OverlayType.RADIAL, OverlayType.LINEAR);
      const expected = {
        type: 'linear',
        rotation: 0,
        stops: p.stops,
        alpha: p.alpha,
      };
      expect(result).toStrictEqual(expected);
    });

    it('should return the same when "converting" to radial', () => {
      const result = convertOverlay(p, OverlayType.RADIAL, OverlayType.RADIAL);
      expect(result).toStrictEqual(p);
    });
  });
});
