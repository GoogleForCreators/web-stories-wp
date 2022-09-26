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

describe('toggleLayer', () => {
  it('adds an element to selection if meta key is pressed', () => {
    const { restore, toggleLayer } = setupReducer();

    // Set an initial state with a current page and some elements selected.
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '1', isBackground: true },
            { id: '2' },
            { id: '3' },
            { id: '4' },
            { id: '5' },
            { id: '6' },
          ],
        },
      ],
      current: '111',
      selection: ['2', '5', '4', '6'],
    });

    const result = toggleLayer({ elementId: '3', metaKey: true });

    expect(result).toStrictEqual({
      ...initialState,
      selection: ['2', '5', '4', '6', '3'],
    });
  });

  it('removes an element from selection if meta key is pressed', () => {
    const { restore, toggleLayer } = setupReducer();

    // Set an initial state with a current page and some elements selected.
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '1', isBackground: true },
            { id: '2' },
            { id: '3' },
            { id: '4' },
            { id: '5' },
            { id: '6' },
          ],
        },
      ],
      current: '111',
      selection: ['2', '5', '4', '6'],
    });

    const result = toggleLayer({ elementId: '4', metaKey: true });

    expect(result).toStrictEqual({
      ...initialState,
      selection: ['2', '5', '6'],
    });
  });

  it('replaces selection if meta key is pressed but new layer is locked', () => {
    const { restore, toggleLayer } = setupReducer();

    // Set an initial state with a current page and some elements selected.
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '1', isBackground: true },
            { id: '2' },
            { id: '3', isLocked: true },
            { id: '4' },
            { id: '5' },
            { id: '6' },
          ],
        },
      ],
      current: '111',
      selection: ['2', '5', '4', '6'],
    });

    const result = toggleLayer({ elementId: '3', metaKey: true });

    expect(result).toStrictEqual({
      ...initialState,
      selection: ['3'],
    });
  });

  it('replaces selection if meta key is pressed but old selection is locked', () => {
    const { restore, toggleLayer } = setupReducer();

    // Set an initial state with a current page and some elements selected.
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '1', isBackground: true },
            { id: '2' },
            { id: '3', isLocked: true },
            { id: '4' },
            { id: '5' },
            { id: '6' },
          ],
        },
      ],
      current: '111',
      selection: ['3'],
    });

    const result = toggleLayer({ elementId: '4', metaKey: true });

    expect(result).toStrictEqual({
      ...initialState,
      selection: ['4'],
    });
  });

  it('selects a single element if no special keys are pressed', () => {
    const { restore, toggleLayer } = setupReducer();

    // Set an initial state with a current page and some elements selected.
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '1', isBackground: true },
            { id: '2' },
            { id: '3' },
            { id: '4' },
            { id: '5' },
            { id: '6' },
          ],
        },
      ],
      current: '111',
      selection: ['2', '5', '4', '6'],
    });

    const result = toggleLayer({ elementId: '3' });

    expect(result).toStrictEqual({
      ...initialState,
      selection: ['3'],
    });
  });

  it('selects everything between the element and the first element in the current selection', () => {
    const { restore, toggleLayer } = setupReducer();

    // Set an initial state with a current page and some elements selected.
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '1', isBackground: true },
            { id: '2' },
            { id: '3' },
            { id: '4' },
            { id: '5' },
            { id: '6' },
          ],
        },
      ],
      current: '111',
      selection: ['3', '5'],
    });

    const result = toggleLayer({ elementId: '6', shiftKey: true });

    expect(result).toStrictEqual({
      ...initialState,
      selection: ['3', '4', '5', '6'],
    });
  });

  it('filters out locked elements when selecting a list of elements', () => {
    const { restore, toggleLayer } = setupReducer();

    // Set an initial state with a current page and some elements selected.
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '1', isBackground: true },
            { id: '2' },
            { id: '3', isLocked: true },
            { id: '4' },
            { id: '5', isLocked: true },
            { id: '6' },
            { id: '7' },
          ],
        },
      ],
      current: '111',
      selection: ['2', '6'],
    });

    const result = toggleLayer({ elementId: '7', shiftKey: true });

    expect(result).toStrictEqual({
      ...initialState,
      selection: ['2', '4', '6', '7'],
    });
  });

  it('reverses selection if the new element is before the first one', () => {
    const { restore, toggleLayer } = setupReducer();

    // Set an initial state with a current page and some elements selected.
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '1', isBackground: true },
            { id: '2' },
            { id: '3' },
            { id: '4' },
            { id: '5' },
            { id: '6' },
          ],
        },
      ],
      current: '111',
      selection: ['4', '6'],
    });

    const result = toggleLayer({ elementId: '2', shiftKey: true });

    expect(result).toStrictEqual({
      ...initialState,
      selection: ['4', '3', '2'],
    });
  });
});
