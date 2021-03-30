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

describe('useColor({ action:"setToGradient" })', () => {
  it('should correctly set to gradient when initialized as solid', () => {
    const { load, setToGradient } = arrangeUseColor();

    const pattern = { color: { r: 255, g: 0, b: 0, a: 1 } };

    // Initially load as radial gradient
    load(pattern);

    const result = setToGradient('radial');

    expect(result).toMatchObject({
      currentColor: { r: 255, g: 0, b: 0, a: 1 },
      stops: [
        { color: { r: 255, g: 0, b: 0, a: 1 }, position: 0 },
        { color: { r: 255, g: 0, b: 0, a: 1 }, position: 1 },
      ],
      type: 'radial',
    });
  });

  it('should correctly set to new gradient when initialized as another gradient', () => {
    const { load, setToGradient, selectStop } = arrangeUseColor();

    const pattern = {
      type: 'radial',
      stops: [
        { color: { r: 255, g: 0, b: 0, a: 1 }, position: 0 },
        { color: { r: 0, g: 0, b: 255, a: 1 }, position: 1 },
      ],
    };

    // Initially load as linear gradient as select stop 1
    load(pattern);
    selectStop(1);

    const result = setToGradient('linear');

    expect(result).toMatchObject({
      currentColor: { r: 0, g: 0, b: 255, a: 1 },
      currentStopIndex: 1,
      stops: [
        { color: { r: 255, g: 0, b: 0, a: 1 }, position: 0 },
        { color: { r: 0, g: 0, b: 255, a: 1 }, position: 1 },
      ],
      type: 'linear',
    });
  });
});
