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
import {
  ElementType,
  FontData,
  FontService,
  type Page,
  type TextElement,
} from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { populateElementFontData } from '../populateElementFontData';

describe('populateElementFontData', () => {
  it('adds font properties to elements', () => {
    const fonts: Record<string, FontData> = {
      Oswald: {
        family: 'Oswald',
        service: FontService.GoogleFonts,
        metrics: {
          upm: 1000,
          asc: 1193,
          des: -289,
          tAsc: 1193,
          tDes: -289,
          tLGap: 0,
          wAsc: 1325,
          wDes: 377,
          xH: 578,
          capH: 810,
          yMin: -287,
          yMax: 1297,
          hAsc: 1193,
          hDes: -289,
          lGap: 0,
        },
      },
      Roboto: {
        family: 'Roboto',
        service: FontService.GoogleFonts,
        metrics: {
          upm: 2048,
          asc: 1900,
          des: -500,
          tAsc: 1536,
          tDes: -512,
          tLGap: 102,
          wAsc: 1946,
          wDes: 512,
          xH: 1082,
          capH: 1456,
          yMin: -555,
          yMax: 2163,
          hAsc: 1900,
          hDes: -500,
          lGap: 0,
        },
      },
    };

    const pages: Page[] = [
      {
        id: 'abc',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        elements: [
          {
            id: 'a',
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            rotationAngle: 0,
            type: ElementType.Text,
            font: { family: 'Oswald' },
          } as TextElement,
          {
            id: 'b',
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            rotationAngle: 0,
            type: ElementType.Shape,
          },
        ],
      },
      {
        id: 'def',
        backgroundColor: { color: { r: 255, g: 255, b: 255 } },
        elements: [
          {
            id: 'c',
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            rotationAngle: 0,
            type: ElementType.Shape,
          },
          {
            id: 'd',
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            rotationAngle: 0,
            type: ElementType.Text,
            font: { family: 'Roboto' },
          } as TextElement,
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
