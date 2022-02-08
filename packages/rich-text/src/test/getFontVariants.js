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
import getFontVariants from '../getFontVariants';

describe('getfontVariants', () => {
  it('should produce correct variants', () => {
    const htmlContent =
      '<span style="font-weight: 700">F</span>ill in some text';
    const expected = [
      [0, 700],
      [0, 400],
    ];
    const actual = getFontVariants(htmlContent);

    expect(actual).toStrictEqual(expected);
  });
});
