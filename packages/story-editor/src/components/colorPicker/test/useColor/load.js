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
import arrangeUseColor from './_utils';

describe('useColor({ action:"load" })', () => {
  it('should correctly load a default solid pattern', () => {
    const { load } = arrangeUseColor();

    const pattern = {
      color: { r: 0, g: 0, b: 0 },
    };

    const result = load(pattern);

    expect(result).toStrictEqual({
      alpha: 1,
      center: { x: 0.5, y: 0.5 },
      currentColor: { b: 0, g: 0, r: 0 },
      currentStopIndex: 0,
      generatedColor: null,
      regenerate: false,
      rotation: 0.5,
      size: { h: 1, w: 1 },
      stops: [],
      type: 'solid',
    });
  });

  it('should correctly load an explicit solid pattern', () => {
    const { load } = arrangeUseColor();

    const pattern = {
      type: 'solid',
      color: { r: 0, g: 0, b: 0, a: 0 },
    };

    const result = load(pattern);

    expect(result).toStrictEqual({
      alpha: 1,
      center: { x: 0.5, y: 0.5 },
      currentColor: { b: 0, g: 0, r: 0, a: 0 },
      currentStopIndex: 0,
      generatedColor: null,
      regenerate: false,
      rotation: 0.5,
      size: { h: 1, w: 1 },
      stops: [],
      type: 'solid',
    });
  });

  it('should correctly load a linear gradient with default properties', () => {
    const { load } = arrangeUseColor();

    const pattern = {
      type: 'linear',
      stops: [
        { color: { r: 255, g: 0, b: 0, a: 1 }, position: 0 },
        { color: { r: 0, g: 0, b: 255, a: 1 }, position: 1 },
      ],
    };

    const result = load(pattern);

    expect(result).toStrictEqual({
      alpha: 1,
      center: { x: 0.5, y: 0.5 },
      currentColor: { r: 255, g: 0, b: 0, a: 1 },
      currentStopIndex: 0,
      generatedColor: null,
      regenerate: false,
      rotation: 0,
      size: { h: 1, w: 1 },
      stops: [
        { color: { r: 255, g: 0, b: 0, a: 1 }, position: 0 },
        { color: { r: 0, g: 0, b: 255, a: 1 }, position: 1 },
      ],
      type: 'linear',
    });
  });

  it('should correctly load a linear gradient with explicit properties', () => {
    const { load } = arrangeUseColor();

    const pattern = {
      type: 'linear',
      stops: [
        { color: { r: 255, g: 0, b: 0, a: 1 }, position: 0 },
        { color: { r: 0, g: 0, b: 255, a: 1 }, position: 1 },
      ],
      alpha: 0.7,
      rotation: 0.25,
    };

    const result = load(pattern);

    expect(result).toStrictEqual({
      alpha: 0.7,
      center: { x: 0.5, y: 0.5 },
      currentColor: { r: 255, g: 0, b: 0, a: 1 },
      currentStopIndex: 0,
      generatedColor: null,
      regenerate: false,
      rotation: 0.25,
      size: { h: 1, w: 1 },
      stops: [
        { color: { r: 255, g: 0, b: 0, a: 1 }, position: 0 },
        { color: { r: 0, g: 0, b: 255, a: 1 }, position: 1 },
      ],
      type: 'linear',
    });
  });

  it('should correctly load a radial gradient with default properties', () => {
    const { load } = arrangeUseColor();

    const pattern = {
      type: 'radial',
      stops: [
        { color: { r: 255, g: 0, b: 0, a: 1 }, position: 0 },
        { color: { r: 0, g: 0, b: 255, a: 1 }, position: 1 },
      ],
    };

    const result = load(pattern);

    expect(result).toStrictEqual({
      alpha: 1,
      center: { x: 0.5, y: 0.5 },
      currentColor: { r: 255, g: 0, b: 0, a: 1 },
      currentStopIndex: 0,
      generatedColor: null,
      regenerate: false,
      rotation: 0.5,
      size: { h: 1, w: 1 },
      stops: [
        { color: { r: 255, g: 0, b: 0, a: 1 }, position: 0 },
        { color: { r: 0, g: 0, b: 255, a: 1 }, position: 1 },
      ],
      type: 'radial',
    });
  });

  it('should correctly load a radial gradien with explicit properties', () => {
    const { load } = arrangeUseColor();

    const pattern = {
      type: 'radial',
      stops: [
        { color: { r: 255, g: 0, b: 0, a: 1 }, position: 0 },
        { color: { r: 0, g: 0, b: 255, a: 1 }, position: 1 },
      ],
      alpha: 0.2,
      size: { h: 0.5, w: 0.5 },
      center: { x: 0, y: 0 },
    };

    const result = load(pattern);

    expect(result).toStrictEqual({
      alpha: 0.2,
      center: { x: 0, y: 0 },
      currentColor: { r: 255, g: 0, b: 0, a: 1 },
      currentStopIndex: 0,
      generatedColor: null,
      regenerate: false,
      rotation: 0.5,
      size: { h: 0.5, w: 0.5 },
      stops: [
        { color: { r: 255, g: 0, b: 0, a: 1 }, position: 0 },
        { color: { r: 0, g: 0, b: 255, a: 1 }, position: 1 },
      ],
      type: 'radial',
    });
  });
});
