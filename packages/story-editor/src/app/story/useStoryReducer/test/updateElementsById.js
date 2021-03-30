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
import { setupReducer } from './_utils';

describe('updateElementsById', () => {
  it('should update the given elements', () => {
    const { restore, updateElementsById } = setupReducer();

    // Set an initial state.
    restore({
      pages: [{ id: '111', elements: [{ id: '123' }, { id: '456' }] }],
      current: '111',
    });

    const result = updateElementsById({
      elementIds: ['123', '456'],
      properties: { a: 1 },
    });

    expect(result.pages).toStrictEqual([
      {
        id: '111',
        elements: [
          { id: '123', a: 1 },
          { id: '456', a: 1 },
        ],
      },
    ]);
  });

  it('should skip unknown elements', () => {
    const { restore, updateElementsById } = setupReducer();

    // Set an initial state.
    restore({
      pages: [{ id: '111', elements: [{ id: '123' }, { id: '456' }] }],
      current: '111',
    });

    const result = updateElementsById({
      elementIds: ['123', '789'],
      properties: { a: 1 },
    });

    expect(result.pages).toStrictEqual([
      { id: '111', elements: [{ id: '123', a: 1 }, { id: '456' }] },
    ]);
  });

  it('should update the given elements with a function', () => {
    const { restore, updateElementsById } = setupReducer();

    // Set an initial state.
    restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', a: 1 },
            { id: '456', a: 2 },
          ],
        },
      ],
      current: '111',
    });

    const result = updateElementsById({
      elementIds: ['123', '456'],
      properties: ({ a, ...rest }) => ({ a: a + 1, ...rest }),
    });

    expect(result.pages).toStrictEqual([
      {
        id: '111',
        elements: [
          { id: '123', a: 2 },
          { id: '456', a: 3 },
        ],
      },
    ]);
  });

  it('should do nothing if no elements given', () => {
    const { restore, updateElementsById } = setupReducer();

    // Set an initial state.
    restore({
      pages: [{ id: '111', elements: [{ id: '123' }, { id: '456' }] }],
      current: '111',
    });

    const result = updateElementsById({ elementIds: [], properties: { a: 1 } });

    expect(result.pages).toStrictEqual([
      { id: '111', elements: [{ id: '123' }, { id: '456' }] },
    ]);
  });

  it('should do nothing if only unknown elements given', () => {
    const { restore, updateElementsById } = setupReducer();

    // Set an initial state.
    restore({
      pages: [{ id: '111', elements: [{ id: '123' }, { id: '456' }] }],
      current: '111',
    });

    const result = updateElementsById({
      elementIds: ['789'],
      properties: { a: 1 },
    });

    expect(result.pages).toStrictEqual([
      { id: '111', elements: [{ id: '123' }, { id: '456' }] },
    ]);
  });
});
