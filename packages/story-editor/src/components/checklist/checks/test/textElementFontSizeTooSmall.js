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
import { textElementFontSizeTooSmall } from '../textElementFontSizeTooSmall';

describe('textElementFontSizeTooSmall', () => {
  it('should return true if text element font size is too small', () => {
    const element = {
      id: 'elementid',
      type: 'text',
      fontSize: 11,
    };
    expect(textElementFontSizeTooSmall(element)).toBeTrue();
  });

  it('should return false if text element font size is large enough', () => {
    const element = {
      id: 'elementid',
      type: 'text',
      fontSize: 12,
    };
    expect(textElementFontSizeTooSmall(element)).toBeFalse();
  });
});
