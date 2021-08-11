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

describe('useColor({ action:"removeCurrentStop" })', () => {
  it('should update the current color of a solid', () => {
    const { load, updateCurrentColor } = arrangeUseColor();

    const pattern = { color: { r: 255, g: 0, b: 0, a: 1 } };

    load(pattern);
    const result = updateCurrentColor({ rgb: { r: 0, g: 255, b: 0, a: 0 } });

    expect(result).toMatchObject({
      regenerate: true,
      currentColor: { r: 0, g: 255, b: 0, a: 0 },
    });
  });

  it('should also update the current stop of a gradient', () => {
    const { load, selectStop, updateCurrentColor } = arrangeUseColor();

    const pattern = {
      type: 'radial',
      stops: [
        { color: { r: 255, g: 0, b: 0, a: 1 }, position: 0 },
        { color: { r: 0, g: 255, b: 0, a: 1 }, position: 0.4 },
        { color: { r: 0, g: 0, b: 255, a: 1 }, position: 1 },
      ],
    };

    load(pattern);
    selectStop(1);
    const result = updateCurrentColor({ rgb: { r: 0, g: 255, b: 0, a: 0 } });

    expect(result).toMatchObject({
      regenerate: true,
      currentColor: { r: 0, g: 255, b: 0, a: 0 },
      stops: [
        { color: { r: 255, g: 0, b: 0, a: 1 }, position: 0 },
        { color: { r: 0, g: 255, b: 0, a: 0 }, position: 0.4 },
        { color: { r: 0, g: 0, b: 255, a: 1 }, position: 1 },
      ],
    });
  });
});
