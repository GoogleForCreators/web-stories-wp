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
import generateLookupMap from '../generateLookupMap';

describe('generateLookupMap', () => {
  it('should generate a correct mapping from array', () => {
    const values = [3, 45, 6, 89, 90];
    const result = generateLookupMap(values);

    expect(result).toStrictEqual({
      3: [45, 6, 89, 90],
      45: [3, 6, 89, 90],
      6: [3, 45, 89, 90],
      89: [3, 45, 6, 90],
      90: [3, 45, 6, 89],
    });
  });
});
