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

describe('deleteElementsById', () => {
  it('should remove the deleted elements', () => {
    const { restore, deleteElementsById } = setupReducer();

    // Set an initial state with a current page and some elements
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', isBackground: true },
            { id: '456' },
            { id: '789' },
          ],
        },
      ],
      current: '111',
      selection: [],
    });

    const result = deleteElementsById({ elementIds: ['789', '456'] });

    expect(result).toStrictEqual({
      ...initialState,
      pages: [{ id: '111', elements: [{ id: '123', isBackground: true }] }],
    });
  });

  it('should skip unknown elements', () => {
    const { restore, deleteElementsById } = setupReducer();

    // Set an initial state with a current page and some elements
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', isBackground: true },
            { id: '456' },
            { id: '789' },
          ],
        },
      ],
      current: '111',
      selection: [],
    });

    const result = deleteElementsById({ elementIds: ['456', '000'] });

    expect(result).toStrictEqual({
      ...initialState,
      pages: [
        {
          id: '111',
          elements: [{ id: '123', isBackground: true }, { id: '789' }],
        },
      ],
    });
  });

  it('should do nothing if no elements', () => {
    const { restore, deleteElementsById } = setupReducer();

    // Set an initial state with a current page and some elements
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', isBackground: true },
            { id: '456' },
            { id: '789' },
          ],
        },
      ],
      current: '111',
      selection: [],
    });

    const result = deleteElementsById({ elementIds: [] });

    expect(result).toStrictEqual(initialState);
  });

  it('should do nothing if only unknown elements', () => {
    const { restore, deleteElementsById } = setupReducer();

    // Set an initial state with a current page and some elements
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', isBackground: true },
            { id: '456' },
            { id: '789' },
          ],
        },
      ],
      current: '111',
      selection: [],
    });

    const result = deleteElementsById({ elementIds: ['000', '999'] });

    expect(result).toStrictEqual(initialState);
  });

  it('should remove any deleted elements from selection too', () => {
    const { restore, deleteElementsById } = setupReducer();

    // Set an initial state with a current page and some elements
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', isBackground: true },
            { id: '234' },
            { id: '456' },
            { id: '789' },
          ],
        },
      ],
      current: '111',
      selection: ['234', '789'],
    });

    // 789 is selected, 456 is not
    const result = deleteElementsById({ elementIds: ['789', '456'] });

    expect(result).toStrictEqual({
      ...initialState,
      pages: [
        {
          id: '111',
          elements: [{ id: '123', isBackground: true }, { id: '234' }],
        },
      ],
      selection: ['234'],
    });
  });

  it('should skip default background element if included', () => {
    const { restore, deleteElementsById } = setupReducer();

    // Set an initial state with a current page and some elements
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', isBackground: true, isDefaultBackground: true },
            { id: '234' },
            { id: '456' },
            { id: '789' },
          ],
        },
      ],
      current: '111',
      selection: [],
    });

    // 123 is the default background element
    const result = deleteElementsById({ elementIds: ['123', '789', '456'] });

    expect(result).toStrictEqual({
      ...initialState,
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', isBackground: true, isDefaultBackground: true },
            { id: '234' },
          ],
        },
      ],
      selection: [],
    });
  });
});
