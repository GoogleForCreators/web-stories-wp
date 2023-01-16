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
 * External dependencies
 */
import { ELEMENT_TYPES } from '@googleforcreators/elements';
/**
 * Internal dependencies
 */
import { getStoryFontsFromPages } from '../getStoryFontsFromPages';

describe('getStoryFontsFromPages', () => {
  it('clean font properties from elements', () => {
    const elementfonts = {
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
          { type: ELEMENT_TYPES.SHAPE },
          { type: ELEMENT_TYPES.TEXT, font: elementfonts['Oswald'] },
        ],
      },
      {
        elements: [
          { type: ELEMENT_TYPES.SHAPE },
          { type: ELEMENT_TYPES.TEXT, font: elementfonts['Roboto'] },
        ],
      },
    ];

    const fonts = getStoryFontsFromPages(pages);
    expect(fonts).toStrictEqual(elementfonts);
  });
});
