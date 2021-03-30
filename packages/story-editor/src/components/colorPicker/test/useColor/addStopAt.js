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
import insertStop from '../../insertStop';
import arrangeUseColor from './_utils';

jest.mock('../../insertStop', () => jest.fn());

describe('useColor({ action:"addStopAt" })', () => {
  it('should correctly ignore stop already present', () => {
    const { load, addStopAt } = arrangeUseColor();

    const pattern = {
      type: 'radial',
      stops: [
        { color: { r: 255, g: 0, b: 0, a: 1 }, position: 0 },
        { color: { r: 0, g: 0, b: 255, a: 1 }, position: 1 },
      ],
    };

    const initial = load(pattern);
    const result = addStopAt(0);

    expect(result).toStrictEqual(initial);
  });

  it('should insert stop using helper function and select it', () => {
    const { load, addStopAt } = arrangeUseColor();

    const pattern = {
      type: 'radial',
      stops: [
        { color: { r: 255, g: 0, b: 0, a: 1 }, position: 0 },
        { color: { r: 0, g: 0, b: 255, a: 1 }, position: 1 },
      ],
    };

    load(pattern);
    insertStop.mockImplementation(() => ({
      color: { r: 0, g: 255, b: 0, a: 1 },
      index: 1,
    }));
    const result = addStopAt(0.2);

    expect(result).toMatchObject({
      currentStopIndex: 1,
      stops: [
        { color: { r: 255, g: 0, b: 0, a: 1 }, position: 0 },
        { color: { r: 0, g: 255, b: 0, a: 1 }, position: 0.2 },
        { color: { r: 0, g: 0, b: 255, a: 1 }, position: 1 },
      ],
    });

    expect(insertStop).toHaveBeenCalledWith(
      [
        { color: { a: 1, b: 0, g: 0, r: 255 }, position: 0 },
        { color: { a: 1, b: 255, g: 0, r: 0 }, position: 1 },
      ],
      0.2
    );
  });
});
