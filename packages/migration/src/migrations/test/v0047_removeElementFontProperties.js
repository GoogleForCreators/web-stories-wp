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
import removeElementFontProperties from '../v0047_removeElementFontProperties';

describe('removeElementFontProperties', () => {
  it('should remove font properties from elements and add fonts at story level', () => {
    const fonts = {
      Oswald: {
        family: 'Oswald',
        service: 'fonts.google.com',
        metrics: { upm: 1000, asc: 1050, des: -350 },
      },
      Roboto: {
        family: 'Roboto',
        service: 'fonts.google.com',
        metrics: { upm: 1000, asc: 1048, des: -271 },
      },
    };

    const pages = [
      {
        elements: [{ type: 'text', font: fonts['Oswald'] }],
      },
      {
        elements: [{ type: 'text', font: fonts['Roboto'] }],
      },
    ];

    const result = removeElementFontProperties({ pages });

    expect(result.pages[0].elements[0].font).toStrictEqual({
      family: 'Oswald',
    });

    expect(result.pages[1].elements[0].font).toStrictEqual({
      family: 'Roboto',
    });

    expect(result.fonts).toStrictEqual({
      Oswald: { ...fonts['Oswald'] },
      Roboto: { ...fonts['Roboto'] },
    });
  });
});
