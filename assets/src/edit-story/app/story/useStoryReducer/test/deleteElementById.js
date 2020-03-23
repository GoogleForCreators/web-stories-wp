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
import { OverlayType } from '../../../../utils/backgroundOverlay';
import { setupReducer } from './_utils';

describe('deleteElementById', () => {
  it('should delete the given element', () => {
    const { restore, deleteElementById } = setupReducer();

    // Set an initial state with a current page with an element.
    restore({
      pages: [{ id: '111', elements: [{ id: '123' }, { id: '456' }] }],
      current: '111',
      selection: [],
    });

    const result = deleteElementById({ elementId: '123' });

    expect(result.pages).toStrictEqual([
      { id: '111', elements: [{ id: '456' }] },
    ]);
  });

  it('should ignore an unknown element (on the current page)', () => {
    const { restore, deleteElementById } = setupReducer();

    // Set an initial state with multiple pages with elements.
    restore({
      pages: [
        { id: '111', elements: [{ id: '123' }] },
        { id: '222', elements: [{ id: '456' }] },
      ],
      current: '111',
    });

    // 456 does not exist on current page, so nothing happens
    const result = deleteElementById({ elementId: '456' });

    expect(result.pages).toStrictEqual([
      { id: '111', elements: [{ id: '123' }] },
      { id: '222', elements: [{ id: '456' }] },
    ]);
  });

  it('should remove the deleted element from selection if exists', () => {
    const { restore, deleteElementById } = setupReducer();

    // Set an initial state with a current page and a selected element.
    const initialState = restore({
      pages: [{ id: '111', elements: [{ id: '123' }, { id: '456' }] }],
      current: '111',
      selection: ['123', '456'],
    });

    const result = deleteElementById({ elementId: '123' });

    expect(result).toStrictEqual({
      ...initialState,
      pages: [{ id: '111', elements: [{ id: '456' }] }],
      selection: ['456'],
    });
  });

  it('should unset background element id if background element is deleted', () => {
    const { restore, deleteElementById } = setupReducer();

    // Set an initial state with a current page and a selected element.
    const initialState = restore({
      pages: [
        {
          backgroundElementId: '123',
          backgroundOverlay: OverlayType.NONE,
          id: '111',
          elements: [{ id: '123' }, { id: '456' }],
        },
      ],
      current: '111',
      selection: ['123', '456'],
    });

    const result = deleteElementById({ elementId: '123' });

    expect(result).toStrictEqual({
      ...initialState,
      pages: [
        {
          backgroundElementId: null,
          backgroundOverlay: OverlayType.NONE,
          id: '111',
          elements: [{ id: '456' }],
        },
      ],
      selection: ['456'],
    });
  });
});
