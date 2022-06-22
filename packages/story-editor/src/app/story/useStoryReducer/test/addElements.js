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

describe('addElements', () => {
  it('should ignore non-list arguments', () => {
    const { restore, addElements } = setupReducer();

    // Set an initial state with a current page and other elements.
    const initialState = restore({
      pages: [{ id: '111', elements: [{ id: '000' }] }],
      current: '111',
    });

    const result = addElements({ elements: false });

    expect(result).toStrictEqual(initialState);
  });

  it('should ignore an empty list', () => {
    const { restore, addElements } = setupReducer();

    // Set an initial state with a current page and other elements.
    const initialState = restore({
      pages: [{ id: '111', elements: [{ id: '000' }] }],
      current: '111',
    });

    const result = addElements({ elements: [] });

    expect(result).toStrictEqual(initialState);
  });

  it('should add all elements to the current page and select them', () => {
    const { restore, addElements } = setupReducer();

    // Set an initial state with a current page and other elements.
    restore({
      pages: [{ id: '111', elements: [{ id: '000' }] }],
      current: '111',
    });

    const result = addElements({ elements: [{ id: '123' }, { id: '234' }] });

    expect(result.pages[0]).toStrictEqual({
      id: '111',
      elements: [{ id: '000' }, { id: '123' }, { id: '234' }],
    });
    expect(result.selection).toStrictEqual(['123', '234']);
  });

  it('should skip elements matching existing ids', () => {
    const { restore, addElements } = setupReducer();

    // Set an initial state with a current page and other elements.
    restore({
      pages: [{ id: '111', elements: [{ id: '000', a: 1 }] }],
      current: '111',
    });

    const result = addElements({
      elements: [{ id: '123' }, { id: '000', a: 2 }],
    });

    expect(result.pages[0]).toStrictEqual({
      id: '111',
      elements: [{ id: '000', a: 1 }, { id: '123' }],
    });
    expect(result.selection).toStrictEqual(['123']);
  });

  it('should only add elements with unique ids (using the latter)', () => {
    const { restore, addElements } = setupReducer();

    // Set an initial state with a current page and other elements.
    restore({
      pages: [{ id: '111', elements: [{ id: '000' }] }],
      current: '111',
    });

    const result = addElements({
      elements: [
        { id: '123', a: 1 },
        { id: '123', a: 2 },
      ],
    });

    expect(result.pages[0]).toStrictEqual({
      id: '111',
      elements: [{ id: '000' }, { id: '123', a: 2 }],
    });
    expect(result.selection).toStrictEqual(['123']);
  });

  it('should only add a product once', () => {
    const { restore, addElements } = setupReducer();

    // Set an initial state with a current page and other elements.
    restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '000' },
            { id: '123', product: { productId: 1 }, type: 'product' },
          ],
        },
      ],
      current: '111',
    });

    const result = addElements({
      elements: [
        { id: '123', product: { productId: 1 }, type: 'product' },
        { id: '124', product: { productId: 2 }, type: 'product' },
      ],
    });

    expect(result.pages[0]).toStrictEqual({
      id: '111',
      elements: [
        { id: '000' },
        { id: '123', product: { productId: 1 }, type: 'product' },
        { id: '124', product: { productId: 2 }, type: 'product' },
      ],
    });
    expect(result.selection).toStrictEqual(['124']);
  });

  it('should allow adding 6 products', () => {
    const { restore, addElements } = setupReducer();

    // Set an initial state with a current page and other elements.
    restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '000' },
            { id: '122', product: { productId: 0 }, type: 'product' },
          ],
        },
      ],
      current: '111',
    });

    const result = addElements({
      elements: [
        { id: '123', product: { productId: 1 }, type: 'product' },
        { id: '124', product: { productId: 2 }, type: 'product' },
        { id: '125', product: { productId: 3 }, type: 'product' },
        { id: '126', product: { productId: 4 }, type: 'product' },
        { id: '127', product: { productId: 5 }, type: 'product' },
        { id: '130', type: 'image' },
      ],
    });

    expect(result.pages[0]).toStrictEqual({
      id: '111',
      elements: [
        { id: '000' },
        { id: '122', product: { productId: 0 }, type: 'product' },
        { id: '130', type: 'image' },
        { id: '123', product: { productId: 1 }, type: 'product' },
        { id: '124', product: { productId: 2 }, type: 'product' },
        { id: '125', product: { productId: 3 }, type: 'product' },
        { id: '126', product: { productId: 4 }, type: 'product' },
        { id: '127', product: { productId: 5 }, type: 'product' },
      ],
    });
    expect(result.selection).toStrictEqual([
      '130',
      '123',
      '124',
      '125',
      '126',
      '127',
    ]);
  });

  it('should not allow adding more than 6 products', () => {
    const { restore, addElements } = setupReducer();

    // Set an initial state with a current page and other elements.
    restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '000' },
            { id: '122', product: { productId: 0 }, type: 'product' },
          ],
        },
      ],
      current: '111',
    });

    const result = addElements({
      elements: [
        { id: '123', product: { productId: 1 }, type: 'product' },
        { id: '124', product: { productId: 2 }, type: 'product' },
        { id: '125', product: { productId: 3 }, type: 'product' },
        { id: '126', product: { productId: 4 }, type: 'product' },
        { id: '127', product: { productId: 5 }, type: 'product' },
        { id: '128', product: { productId: 6 }, type: 'product' },
        { id: '129', product: { productId: 7 }, type: 'product' },
        { id: '130', type: 'image' },
      ],
    });

    expect(result.pages[0]).toStrictEqual({
      id: '111',
      elements: [
        { id: '000' },
        { id: '122', product: { productId: 0 }, type: 'product' },
        { id: '130', type: 'image' },
      ],
    });
    expect(result.selection).toStrictEqual(['130']);
  });

  it('should only allow 6 products with duplicates', () => {
    const { restore, addElements } = setupReducer();

    // Set an initial state with a current page and other elements.
    restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '000' },
            { id: '123', product: { productId: 1 }, type: 'product' },
            { id: '124', product: { productId: 2 }, type: 'product' },
          ],
        },
      ],
      current: '111',
    });

    const result = addElements({
      elements: [
        { id: '123', product: { productId: 1 }, type: 'product' },
        { id: '124', product: { productId: 2 }, type: 'product' },
        { id: '125', product: { productId: 3 }, type: 'product' },
        { id: '126', product: { productId: 4 }, type: 'product' },
        { id: '127', product: { productId: 5 }, type: 'product' },
        { id: '128', product: { productId: 6 }, type: 'product' },
        { id: '130', type: 'image' },
      ],
    });

    expect(result.pages[0]).toStrictEqual({
      id: '111',
      elements: [
        { id: '000' },
        { id: '123', product: { productId: 1 }, type: 'product' },
        { id: '124', product: { productId: 2 }, type: 'product' },
        { id: '130', type: 'image' },
        { id: '125', product: { productId: 3 }, type: 'product' },
        { id: '126', product: { productId: 4 }, type: 'product' },
        { id: '127', product: { productId: 5 }, type: 'product' },
        { id: '128', product: { productId: 6 }, type: 'product' },
      ],
    });
    expect(result.selection).toStrictEqual(['130', '125', '126', '127', '128']);
  });
});
