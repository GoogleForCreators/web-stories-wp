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

describe('deleteSelectedElements', () => {
  it('should remove the selected elements and clear selection', () => {
    const { restore, deleteSelectedElements } = setupReducer();

    // Set an initial state with a current page and some elements selected.
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
      selection: ['789', '456'],
    });

    const result = deleteSelectedElements();

    expect(result).toStrictEqual({
      ...initialState,
      pages: [{ id: '111', elements: [{ id: '123', isBackground: true }] }],
      selection: [],
    });
  });

  it('should do nothing if no elements selected', () => {
    const { restore, deleteSelectedElements } = setupReducer();

    // Set an initial state with a current page and some elements, none selected.
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

    const result = deleteSelectedElements();

    expect(result).toBe(initialState);
  });
});
