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

describe('addElement', () => {
  it('should add an element to the current page and select it', () => {
    const { restore, addElement } = setupReducer();

    // Set an initial state with a current page and no elements.
    restore({
      pages: [{ id: '111', elements: [] }],
      current: '111',
    });

    const result = addElement({ element: { id: '123' } });

    expect(result.pages[0]).toStrictEqual({
      id: '111',
      elements: [{ id: '123' }],
    });
    expect(result.selection).toStrictEqual(['123']);
  });

  it('should add an element to the end of the list on the current page and replace selection', () => {
    const { restore, addElement } = setupReducer();

    // Set an initial state with a current page and one element.
    restore({
      pages: [{ id: '111', elements: [{ id: '321' }] }],
      current: '111',
      selection: ['321'],
    });

    const result = addElement({ element: { id: '123' } });

    expect(result.pages[0]).toStrictEqual({
      id: '111',
      elements: [{ id: '321' }, { id: '123' }],
    });
    expect(result.selection).toStrictEqual(['123']);
  });

  it('should not add an element with an id that already exists', () => {
    const { restore, addElement } = setupReducer();

    // Set an initial state with a current page and one element.
    restore({
      pages: [{ id: '111', elements: [{ id: '321' }] }],
      current: '111',
      selection: ['321'],
    });

    const result = addElement({ element: { id: '321' } });

    expect(result.pages[0]).toStrictEqual({
      id: '111',
      elements: [{ id: '321' }],
    });
    expect(result.selection).toStrictEqual(['321']);
  });
});
