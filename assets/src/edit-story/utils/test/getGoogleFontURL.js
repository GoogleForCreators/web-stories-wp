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
import getGoogleFontURL from '../getGoogleFontURL';

describe('getGoogleFontURL', () => {
  it('should produce valid URLs', () => {
    const roboto_400 = { family: 'Roboto', variants: [[0, 400]] };
    const roboto_400_400i = {
      family: 'Roboto',
      variants: [
        [0, 400],
        [1, 400],
      ],
    };
    const roboto_100_400 = {
      family: 'Roboto',
      variants: [
        [0, 100],
        [0, 400],
      ],
    };

    const roboto_400_700 = {
      family: 'Roboto',
      variants: [
        [0, 400],
        [0, 700],
      ],
    };

    const lato_300i_900i = {
      family: 'Lato',
      variants: [
        [1, 300],
        [1, 900],
      ],
    };
    const lato_900i_300i = {
      family: 'Lato',
      variants: [
        [1, 900],
        [1, 300],
      ],
    };
    const architects_daughter = {
      family: 'Architects Daughter',
    };
    const roboto_condensed_all = {
      family: 'Roboto Condensed',
      variants: [
        [0, 300],
        [1, 300],
        [0, 400],
        [1, 400],
        [0, 700],
        [1, 700],
      ],
    };

    expect(getGoogleFontURL([roboto_400])).toStrictEqual(
      'https://fonts.googleapis.com/css2?display=swap&family=Roboto'
    );
    expect(getGoogleFontURL([roboto_400_400i])).toStrictEqual(
      'https://fonts.googleapis.com/css2?display=swap&family=Roboto%3Aital%400%3B1'
    );
    expect(getGoogleFontURL([roboto_400_700])).toStrictEqual(
      'https://fonts.googleapis.com/css2?display=swap&family=Roboto%3Awght%40400%3B700'
    );
    expect(getGoogleFontURL([roboto_100_400])).toStrictEqual(
      'https://fonts.googleapis.com/css2?display=swap&family=Roboto%3Awght%40100%3B400'
    );
    expect(getGoogleFontURL([lato_300i_900i])).toStrictEqual(
      'https://fonts.googleapis.com/css2?display=swap&family=Lato%3Aital%2Cwght%401%2C300%3B1%2C900'
    );
    expect(getGoogleFontURL([lato_900i_300i])).toStrictEqual(
      'https://fonts.googleapis.com/css2?display=swap&family=Lato%3Aital%2Cwght%401%2C300%3B1%2C900'
    );
    expect(getGoogleFontURL([roboto_100_400, lato_300i_900i])).toStrictEqual(
      'https://fonts.googleapis.com/css2?display=swap&family=Roboto%3Awght%40100%3B400&family=Lato%3Aital%2Cwght%401%2C300%3B1%2C900'
    );
    expect(getGoogleFontURL([architects_daughter])).toStrictEqual(
      'https://fonts.googleapis.com/css2?display=swap&family=Architects+Daughter'
    );
    expect(getGoogleFontURL([roboto_condensed_all])).toStrictEqual(
      'https://fonts.googleapis.com/css2?display=swap&family=Roboto+Condensed%3Aital%2Cwght%400%2C300%3B0%2C400%3B0%2C700%3B1%2C300%3B1%2C400%3B1%2C700'
    );
  });

  it('should use provided font-display parameter', () => {
    const roboto_400 = { family: 'Roboto', variants: [[0, 400]] };
    expect(getGoogleFontURL([roboto_400])).toStrictEqual(
      'https://fonts.googleapis.com/css2?display=swap&family=Roboto'
    );
    expect(getGoogleFontURL([roboto_400], 'auto')).toStrictEqual(
      'https://fonts.googleapis.com/css2?display=auto&family=Roboto'
    );
  });
});
