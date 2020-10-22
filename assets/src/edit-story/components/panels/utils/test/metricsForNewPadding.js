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
import { metricsForNewPadding } from '../metricsForNewPadding';

describe('metricsForNewPadding()', function () {
  it('should calculate metrics for new padding with no existing padding.', function () {
    expect(
      metricsForNewPadding({
        newPadding: { horizontal: 10, vertical: 8 },
        currentPadding: { horizontal: 0, vertical: 0 },
        width: 100,
        height: 100,
        y: 30,
        x: 20,
      })
    ).toStrictEqual({
      height: 116,
      width: 120,
      x: 10,
      y: 22,
    });
  });

  it('should calculate metrics for shrinking (new padding is smaller than current).', function () {
    expect(
      metricsForNewPadding({
        newPadding: { horizontal: 10, vertical: 8 },
        currentPadding: { horizontal: 32, vertical: 14 },
        width: 100,
        height: 100,
        y: 30,
        x: 20,
      })
    ).toStrictEqual({
      height: 88,
      width: 56,
      x: 42,
      y: 36,
    });
  });

  it('should calculate metrics for growing (new padding is smaller than current).', function () {
    expect(
      metricsForNewPadding({
        newPadding: { horizontal: 64, vertical: 28 },
        currentPadding: { horizontal: 32, vertical: 14 },
        width: 100,
        height: 100,
        y: 30,
        x: 40,
      })
    ).toStrictEqual({
      height: 128,
      width: 164,
      x: 8,
      y: 16,
    });
  });
});
