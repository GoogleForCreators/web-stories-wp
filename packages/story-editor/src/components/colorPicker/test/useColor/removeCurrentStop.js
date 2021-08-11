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
  it('should not be able to have less than 2 stops', () => {
    const { load, selectStop, removeCurrentStop } = arrangeUseColor();

    const pattern = {
      type: 'radial',
      stops: [
        { color: { r: 255, g: 0, b: 0, a: 1 }, position: 0 },
        { color: { r: 0, g: 0, b: 255, a: 1 }, position: 1 },
      ],
    };

    load(pattern);
    const initial = selectStop(0);
    const result = removeCurrentStop();

    expect(result).toStrictEqual(initial);
  });

  it('should delete a stop and select the next one as current', () => {
    const { load, selectStop, removeCurrentStop } = arrangeUseColor();

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
    const result = removeCurrentStop();

    expect(result).toMatchObject({
      currentStopIndex: 1,
      stops: [
        { color: { r: 255, g: 0, b: 0, a: 1 }, position: 0 },
        { color: { r: 0, g: 0, b: 255, a: 1 }, position: 1 },
      ],
    });
  });

  it('should delete the last stop and penultimate', () => {
    const { load, selectStop, removeCurrentStop } = arrangeUseColor();

    const pattern = {
      type: 'radial',
      stops: [
        { color: { r: 255, g: 0, b: 0, a: 1 }, position: 0 },
        { color: { r: 0, g: 255, b: 0, a: 1 }, position: 0.4 },
        { color: { r: 0, g: 0, b: 255, a: 1 }, position: 1 },
      ],
    };

    load(pattern);
    selectStop(2);
    const result = removeCurrentStop();

    expect(result).toMatchObject({
      currentStopIndex: 1,
      stops: [
        { color: { r: 255, g: 0, b: 0, a: 1 }, position: 0 },
        { color: { r: 0, g: 255, b: 0, a: 1 }, position: 0.4 },
      ],
    });
  });
});
