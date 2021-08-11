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

describe('useColor({ action:"selectStop" })', () => {
  it('should be able to select stops inside the list and update the current color', () => {
    const { load, selectStop } = arrangeUseColor();

    const pattern = {
      type: 'radial',
      stops: [
        { color: { r: 255, g: 0, b: 0, a: 1 }, position: 0 },
        { color: { r: 0, g: 255, b: 0, a: 1 }, position: 0.4 },
        { color: { r: 0, g: 0, b: 255, a: 1 }, position: 1 },
      ],
      rotation: 0.5,
    };

    load(pattern);

    const firstStopSelected = selectStop(0);
    expect(firstStopSelected).toMatchObject({
      currentStopIndex: 0,
      currentColor: { r: 255, g: 0, b: 0, a: 1 },
    });

    const firstFailedAttempt = selectStop(-1);
    expect(firstFailedAttempt).toStrictEqual(firstStopSelected);

    const lastStopSelected = selectStop(2);
    expect(lastStopSelected).toMatchObject({
      currentStopIndex: 2,
      currentColor: { r: 0, g: 0, b: 255, a: 1 },
    });

    const secondFailedAttempt = selectStop(3);
    expect(secondFailedAttempt).toStrictEqual(lastStopSelected);
  });
});
