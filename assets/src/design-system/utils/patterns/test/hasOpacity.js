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
import hasOpacity from '../hasOpacity';

describe('hasOpacity', () => {
  it('should return false for opaque solid', () => {
    expect(hasOpacity({ color: { r: 1, g: 1, b: 1 } })).toBeFalse();
  });

  it('should return true for semi-transparent solid', () => {
    expect(hasOpacity({ color: { r: 1, g: 1, b: 1, a: 0.5 } })).toBeTrue();
  });

  it('should return true for gradient with semitransparent stops', () => {
    const pattern = {
      type: 'linear',
      stops: [
        { color: { r: 1, g: 1, b: 1 } },
        { color: { r: 1, g: 1, b: 1, a: 0.5 } },
      ],
    };
    expect(hasOpacity(pattern)).toBeTrue();
  });

  it('should return true for gradient with opaque stops but overall opacity', () => {
    const pattern = {
      type: 'linear',
      stops: [{ color: { r: 1, g: 1, b: 1 } }, { color: { r: 1, g: 1, b: 1 } }],
      opacity: 0.5,
    };
    expect(hasOpacity(pattern)).toBeTrue();
  });
});
