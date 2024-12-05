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
import getTextColors from '../getTextColors';

describe('getTextColors', () => {
  it('should return a list of text colors', () => {
    const htmlContent =
      'Fill in <span style="color: #eb0404">some</span> <span style="color: #026111">text</span>';
    const expected = ['#000000', '#eb0404', '#026111'];

    const actual = getTextColors(htmlContent);

    expect(actual).toStrictEqual(expected);
  });
});
