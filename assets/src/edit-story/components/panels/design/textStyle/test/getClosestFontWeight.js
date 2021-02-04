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
import getClosestFontWeight from '../getClosestFontWeight';

describe('getClosestFontWeight', () => {
  it('should return existing font weight when no availableWeights are present', () => {
    const result = getClosestFontWeight(300);
    expect(result).toBe(300);
  });

  it('should return default 400 font weight when no existingWeight or availableWeights are present', () => {
    const result = getClosestFontWeight();
    expect(result).toBe(400);
  });

  it('should return 600 when availableWeight of 600 is present and existingWeight is 600', () => {
    const result = getClosestFontWeight(600, [100, 300, 600, 700]);
    expect(result).toBe(600);
  });

  it('should return 600 when availableWeight of 600 is present even when weights are not listed in ascending order and existingWeight is 600', () => {
    const result = getClosestFontWeight(600, [700, 300, 600, 100]);
    expect(result).toBe(600);
  });

  it('should return 400 when availableWeights are [100, 300, 400, 600] and existingWeight is 500', () => {
    const result = getClosestFontWeight(500, [100, 300, 400, 600]);
    expect(result).toBe(400);
  });

  it('should return 400 when availableWeights are [600, 300, 400, 100] even when not listed in ascending order and existingWeight is 500', () => {
    const result = getClosestFontWeight(500, [600, 300, 400, 400]);
    expect(result).toBe(400);
  });

  it('should return 800 when availableWeights are [400, 800] and existingWeight is 700', () => {
    const result = getClosestFontWeight(700, [400, 800]);
    expect(result).toBe(800);
  });
});
