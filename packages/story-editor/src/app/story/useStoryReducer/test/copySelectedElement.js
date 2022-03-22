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

describe('copySelectedElement', () => {
  it("copies an element's styles and animations", () => {
    const { restore, copySelectedElement } = setupReducer();

    // Set an initial state with a current page.
    const initialState = restore({
      pages: [
        {
          id: '111',
          animations: [{ id: '1234', targets: ['456'], effect: 'bounce' }],
          elements: [
            { id: '123', isBackground: true, type: 'shape' },
            {
              id: '456',
              x: 0,
              y: 0,
              type: 'shape',
              background: 'blue',
              backgroundColor: 'red',
              backgroundTextMode: null,
              textAlign: 'middle',
            },
            { id: '789', x: 0, y: 0, type: 'shape' },
          ],
        },
      ],
      current: '111',
      selection: ['456'],
    });

    const result = copySelectedElement();

    expect(result).toStrictEqual({
      ...initialState,
      copiedElementState: {
        animations: [
          {
            effect: 'bounce',
            id: '1234',
            targets: ['456'],
          },
        ],
        styles: {
          background: 'blue',
          backgroundColor: 'red',
          backgroundTextMode: null,
          textAlign: 'middle',
        },
        type: 'shape',
      },
    });
  });

  it('should not update state if multiple elements selected', () => {
    const { restore, copySelectedElement } = setupReducer();

    // Set an initial state with a current page.
    const initialState = restore({
      pages: [
        {
          id: '111',
          animations: [],
          elements: [
            { id: '123', isBackground: true, type: 'shape' },
            { id: '456', x: 0, y: 0, type: 'shape' },
            { id: '789', x: 0, y: 0, type: 'shape' },
          ],
        },
      ],
      current: '111',
      selection: ['789', '456'],
    });

    const result = copySelectedElement();

    expect(result).toStrictEqual(initialState);
  });
});
