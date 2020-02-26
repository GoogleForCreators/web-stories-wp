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
import hexToRGBA from '../hexToRGBA';

describe('hexToRGBA', () => {
  it('should return correct rgba value with alpha', () => {
    expect(hexToRGBA('#000000', 25)).toBe('rgba(0,0,0,0.25)');
    expect(hexToRGBA('#ffffff', 10)).toBe('rgba(255,255,255,0.1)');
  });

  it('should return correct rgba value without alpha', () => {
    expect(hexToRGBA('#000000')).toBe('rgba(0,0,0,1)');
    expect(hexToRGBA('#ffffff')).toBe('rgba(255,255,255,1)');
  });

  it('should return null for incorrect formats', () => {
    expect(hexToRGBA('#000', 25)).toBeNull();
    expect(hexToRGBA('black', 10)).toBeNull();
    expect(hexToRGBA('1234567', 10)).toBeNull();
  });
});
