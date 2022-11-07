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
import { populateElementFontData } from '../populateElementFontData';

describe('populateElementFontData', () => {
  it('adds font properties to elements', () => {
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
        elements: [
          { type: 'text', font: { family: 'Oswald' } },
          { type: 'shape' },
        ],
      },
      {
        elements: [
          { type: 'shape' },
          { type: 'text', font: { family: 'Roboto' } },
        ],
      },
    ];

    const newPages = populateElementFontData(pages, fonts);
    expect(newPages[0].elements[0]).toStrictEqual({
      type: 'text',
      font: { ...fonts['Oswald'] },
    });
    expect(newPages[1].elements[1]).toStrictEqual({
      type: 'text',
      font: { ...fonts['Roboto'] },
    });
  });
});
