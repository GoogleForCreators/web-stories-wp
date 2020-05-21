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
import regenerateColor from '../regenerateColor';

describe('regenerateColor', () => {
  it('should return null if regenerate is not true', () => {
    const state = {
      regenerate: false,
      type: 'solid',
      currentColor: { r: 255, g: 0, b: 0, a: 1 },
    };

    const result = regenerateColor(state);

    expect(result).toBeNull();
  });
  it('should correctly generate color for solid state with full opacity', () => {
    const state = {
      regenerate: true,
      type: 'solid',
      currentColor: { r: 255, g: 0, b: 0, a: 1 },
      alpha: 0.8,
      center: { x: 1, y: 0 },
    };

    const result = regenerateColor(state);

    expect(result).toStrictEqual({
      color: { r: 255, g: 0, b: 0 },
    });
  });

  it('should correctly generate color for solid state with less than full opacity', () => {
    const state = {
      regenerate: true,
      type: 'solid',
      currentColor: { r: 0, g: 255, b: 0, a: 0.1 },
      rotation: 0.6,
      size: { w: 0.5, h: 0.5 },
      stops: [],
    };

    const result = regenerateColor(state);

    expect(result).toStrictEqual({
      color: { r: 0, g: 255, b: 0, a: 0.1 },
    });
  });

  it('should correctly generate color for linear gradient with default alpha and rotation', () => {
    const state = {
      regenerate: true,
      type: 'linear',
      currentColor: { r: 0, g: 255, b: 0, a: 0.1 },
      stops: [
        { color: { r: 255, g: 0, b: 0, a: 1 }, position: 0 },
        { color: { r: 0, g: 0, b: 255, a: 1 }, position: 1 },
      ],
      rotation: 0,
      alpha: 1,
    };

    const result = regenerateColor(state);

    expect(result).toStrictEqual({
      type: 'linear',
      stops: [
        { color: { r: 255, g: 0, b: 0 }, position: 0 },
        { color: { r: 0, g: 0, b: 255 }, position: 1 },
      ],
    });
  });

  it('should correctly generate color for linear gradient with non-default alpha and rotation', () => {
    const state = {
      regenerate: true,
      type: 'linear',
      currentColor: { r: 0, g: 255, b: 0, a: 0.1 },
      stops: [
        { color: { r: 255, g: 0, b: 0, a: 1 }, position: 0 },
        { color: { r: 0, g: 0, b: 255, a: 1 }, position: 1 },
      ],
      rotation: 0.5,
      alpha: 0.1,
    };

    const result = regenerateColor(state);

    expect(result).toStrictEqual({
      type: 'linear',
      rotation: 0.5,
      alpha: 0.1,
      stops: [
        { color: { r: 255, g: 0, b: 0 }, position: 0 },
        { color: { r: 0, g: 0, b: 255 }, position: 1 },
      ],
    });
  });

  it('should correctly generate color for radial gradient with default properties', () => {
    const state = {
      regenerate: true,
      type: 'radial',
      currentColor: { r: 0, g: 255, b: 0, a: 0.1 },
      stops: [
        { color: { r: 255, g: 0, b: 0, a: 1 }, position: 0 },
        { color: { r: 0, g: 0, b: 255, a: 1 }, position: 1 },
      ],
      rotation: 0.5,
      alpha: 1,
      center: { x: 0.5, y: 0.5 },
      size: { w: 1, h: 1 },
    };

    const result = regenerateColor(state);

    expect(result).toStrictEqual({
      type: 'radial',
      stops: [
        { color: { r: 255, g: 0, b: 0 }, position: 0 },
        { color: { r: 0, g: 0, b: 255 }, position: 1 },
      ],
    });
  });

  it('should correctly generate color for radial gradient with non-default center only', () => {
    const state = {
      regenerate: true,
      type: 'radial',
      currentColor: { r: 0, g: 255, b: 0, a: 0.1 },
      stops: [
        { color: { r: 255, g: 0, b: 0, a: 1 }, position: 0 },
        { color: { r: 0, g: 0, b: 255, a: 1 }, position: 1 },
      ],
      rotation: 0.5,
      alpha: undefined,
      center: { x: 1, y: 0 },
      size: { w: 1, h: 1 },
    };

    const result = regenerateColor(state);

    expect(result).toStrictEqual({
      type: 'radial',
      stops: [
        { color: { r: 255, g: 0, b: 0 }, position: 0 },
        { color: { r: 0, g: 0, b: 255 }, position: 1 },
      ],
      center: { x: 1, y: 0 },
    });
  });

  it('should correctly generate color for radial gradient with non-default alpha and size', () => {
    const state = {
      regenerate: true,
      type: 'radial',
      currentColor: { r: 0, g: 255, b: 0, a: 0.1 },
      stops: [
        { color: { r: 255, g: 0, b: 0, a: 1 }, position: 0 },
        { color: { r: 0, g: 0, b: 255, a: 1 }, position: 1 },
      ],
      rotation: 0.5,
      alpha: 0.5,
      center: { x: 0.5, y: 0.5 },
      size: { w: 0, h: 1 },
    };

    const result = regenerateColor(state);

    expect(result).toStrictEqual({
      type: 'radial',
      stops: [
        { color: { r: 255, g: 0, b: 0 }, position: 0 },
        { color: { r: 0, g: 0, b: 255 }, position: 1 },
      ],
      alpha: 0.5,
      size: { w: 0, h: 1 },
    });
  });
});
