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

describe('updateElementById', () => {
  it('should update the given element', () => {
    const { restore, updateElementById } = setupReducer();

    // Set an initial state with a current page with an element.
    restore({
      pages: [{ id: '111', elements: [{ id: '123' }, { id: '456' }] }],
      current: '111',
    });

    const result = updateElementById({
      elementId: '123',
      properties: { a: 1 },
    });

    expect(result.pages).toStrictEqual([
      { id: '111', elements: [{ id: '123', a: 1 }, { id: '456' }] },
    ]);
  });

  it('should update the given element via an update function', () => {
    const { restore, updateElementById } = setupReducer();

    // Set an initial state with a current page with an element.
    restore({
      pages: [{ id: '111', elements: [{ id: '123' }, { id: '456' }] }],
      current: '111',
    });

    const result = updateElementById({
      elementId: '123',
      properties: () => ({ a: 1 }),
    });

    expect(result.pages).toStrictEqual([
      { id: '111', elements: [{ id: '123', a: 1 }, { id: '456' }] },
    ]);
  });

  it('should skip reserved properties when updating by function', () => {
    const { restore, updateElementById } = setupReducer();

    // Set an initial state with a current page with an element.
    restore({
      pages: [{ id: '111', elements: [{ id: '123' }, { id: '456' }] }],
      current: '111',
    });

    const result = updateElementById({
      elementId: '123',
      properties: () => ({ a: 1, id: '321' }),
    });

    expect(result.pages).toStrictEqual([
      { id: '111', elements: [{ id: '123', a: 1 }, { id: '456' }] },
    ]);
  });

  it('should do nothing if update by function only attempts reserved attributes', () => {
    const { restore, updateElementById } = setupReducer();

    // Set an initial state with a current page with an element.
    const initial = restore({
      pages: [{ id: '111', elements: [{ id: '123' }, { id: '456' }] }],
      current: '111',
    });

    const result = updateElementById({
      elementId: '123',
      properties: () => ({ id: '321' }),
    });

    expect(result).toStrictEqual(initial);
  });

  it('should not allow updating reserved properties', () => {
    const { restore, updateElementById } = setupReducer();

    // Set an initial state with a current page with an element.
    restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', isBackground: true, isDefaultBackground: true, x: 1 },
            { id: '456' },
          ],
        },
      ],
      current: '111',
    });

    // only x=2 is allowed to be changed here
    const result = updateElementById({
      elementId: '123',
      properties: {
        x: 2,
        id: '000',
        isBackground: false,
        isDefaultBackground: false,
      },
    });

    expect(result.pages).toStrictEqual([
      {
        id: '111',
        elements: [
          { id: '123', isBackground: true, isDefaultBackground: true, x: 2 },
          { id: '456' },
        ],
      },
    ]);
  });

  it('should ignore an unknown element (on the current page)', () => {
    const { restore, updateElementById } = setupReducer();

    // Set an initial state with multiple pages with elements.
    restore({
      pages: [
        { id: '111', elements: [{ id: '123' }] },
        { id: '222', elements: [{ id: '456' }] },
      ],
      current: '111',
    });

    // 456 does not exist on current page, so nothing happens
    const result = updateElementById({
      elementId: '456',
      properties: { a: 1 },
    });

    expect(result.pages).toStrictEqual([
      { id: '111', elements: [{ id: '123' }] },
      { id: '222', elements: [{ id: '456' }] },
    ]);
  });
});
