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
import { setupReducer } from './_utils';

describe('updateElementsByFontFamily', () => {
  it('should update all the elements with given font family through all pages', () => {
    const { restore, updateElementsByFontFamily } = setupReducer();

    // Set an initial state.
    restore({
      pages: [
        {
          id: '111',
          elements: [
            {
              id: '123',
              type: 'text',
              font: {
                name: 'font 1',
                value: 'font 1',
                family: 'font 1',
                service: 'custom',
              },
            },
            {
              id: '456',
              type: 'text',
              font: {
                name: 'font 2',
                value: 'font 2',
                family: 'font 2',
                service: 'custom',
              },
            },
            { id: '789', resource: { type: 'image', id: '3' } },
          ],
        },
        {
          id: '222',
          elements: [
            {
              id: '987',
              type: 'text',
              font: {
                name: 'font 1',
                value: 'font 1',
                family: 'font 1',
                service: 'custom',
              },
            },
          ],
        },
      ],
    });

    const result = updateElementsByFontFamily({
      family: 'font 1',
      properties: {
        font: {
          name: 'replaced font',
          value: 'replaced font',
          family: 'replaced font',
          service: 'custom',
        },
      },
    });

    expect(result.pages).toStrictEqual([
      {
        id: '111',
        elements: [
          {
            id: '123',
            type: 'text',
            font: {
              name: 'replaced font',
              value: 'replaced font',
              family: 'replaced font',
              service: 'custom',
            },
          },
          {
            id: '456',
            type: 'text',
            font: {
              name: 'font 2',
              value: 'font 2',
              family: 'font 2',
              service: 'custom',
            },
          },
          { id: '789', resource: { type: 'image', id: '3' } },
        ],
      },
      {
        id: '222',
        elements: [
          {
            id: '987',
            type: 'text',
            font: {
              name: 'replaced font',
              value: 'replaced font',
              family: 'replaced font',
              service: 'custom',
            },
          },
        ],
      },
    ]);
  });

  it('should do nothing if family not given', () => {
    const { restore, updateElementsByFontFamily } = setupReducer();

    // Set an initial state.
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            {
              id: '123',
              type: 'text',
              font: {
                name: 'font 1',
                value: 'font 1',
                family: 'font 1',
                service: 'custom',
              },
            },
          ],
        },
      ],
    });

    const result = updateElementsByFontFamily({
      family: undefined,
      properties: {
        font: {
          name: 'replaced font',
          value: 'replaced font',
          family: 'replaced font',
          service: 'custom',
        },
      },
    });

    expect(result).toBe(initialState);
  });

  it('should do nothing if no elements with given family', () => {
    const { restore, updateElementsByFontFamily } = setupReducer();

    // Set an initial state.
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            {
              id: '123',
              type: 'text',
              font: {
                name: 'font 1',
                value: 'font 1',
                family: 'font 1',
                service: 'custom',
              },
            },
          ],
        },
      ],
    });

    const result = updateElementsByFontFamily({
      family: 'font 2',
      properties: {
        font: {
          name: 'replaced font',
          value: 'replaced font',
          family: 'replaced font',
          service: 'custom',
        },
      },
    });

    expect(result).toBe(initialState);
  });

  //
  it('should update all font properties with given font family', () => {
    const { restore, updateElementsByFontFamily } = setupReducer();

    // Set an initial state.
    restore({
      pages: [
        {
          id: '111',
          elements: [
            {
              id: '123',
              type: 'text',
              font: {
                name: 'font 1',
                value: 'font 1',
                family: 'font 1',
                service: 'custom',
                weights: [100, 300, 400, 500, 700, 900, 1000],
                fallbacks: ['Helvetica Neue', 'Helvetica', 'sans-serif'],
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
            },
          ],
        },
      ],
    });

    const result = updateElementsByFontFamily({
      family: 'font 1',
      properties: {
        font: {
          name: 'replaced font',
          value: 'replaced font',
          family: 'replaced font',
          service: 'custom',
          fallbacks: ['Helvetica', 'sans-serif'], // <- remove Helvetica Neue + change obj position
          weights: [100, 300, 400, 500, 700, 900], // <- remove weight 1000
          metrics: {
            upm: 2048,
            asc: 1920, // <- update metric
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
      },
    });

    expect(result.pages).toStrictEqual([
      {
        id: '111',
        elements: [
          {
            id: '123',
            type: 'text',
            font: {
              name: 'replaced font',
              value: 'replaced font',
              family: 'replaced font',
              service: 'custom',
              fallbacks: ['Helvetica', 'sans-serif'],
              weights: [100, 300, 400, 500, 700, 900],
              metrics: {
                upm: 2048,
                asc: 1920,
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
          },
        ],
      },
    ]);
  });
});
