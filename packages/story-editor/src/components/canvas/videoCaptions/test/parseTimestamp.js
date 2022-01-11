/*
 * Copyright 2021 Google LLC
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
import parseTimestamp from '../parseTimestamp';

describe('parseTimestamp', () => {
  it.each([
    ['00:00:14.330', 14.33],
    ['00:10:53.220', 653.22],
  ])(
    'should parse valid timestamp %s and return %d',
    (timeStampString, expected) => {
      expect(parseTimestamp(timeStampString)).toBeCloseTo(expected, 2);
    }
  );

  it('should reject invalid timestamp', () => {
    expect(parseTimestamp('')).toBeNull();
  });
});
