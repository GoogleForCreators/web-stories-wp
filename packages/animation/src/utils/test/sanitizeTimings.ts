/*
 * Copyright 2022 Google LLC
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
import sanitizeTimings from '../sanitizeTimings';

describe('sanitizeTimings', () => {
  it('should return 0 for values of `duration` and `delay` animation properties that are less than 0', () => {
    [-1, -0, 0].forEach((value) => {
      const { duration, delay } = sanitizeTimings({
        duration: value,
        delay: value,
      });
      expect(duration).toBe(0);
      expect(delay).toBe(0);
    });
    [1, 0, 12, 51, 500, 2000].forEach((value) => {
      const { duration, delay } = sanitizeTimings({
        duration: value,
        delay: value,
      });
      expect(duration).toBe(value);
      expect(delay).toBe(value);
    });
  });
});
