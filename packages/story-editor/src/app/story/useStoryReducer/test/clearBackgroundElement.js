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

describe('clearBackgroundElement', () => {
  it('should clear the background element', () => {
    const { restore, clearBackgroundElement } = setupReducer();

    // Set an initial state with a current page, some elements and a default background element
    restore({
      pages: [
        {
          id: '111',
          defaultBackgroundElement: {
            id: '123',
            isDefaultBackground: true,
            isBackground: true,
          },
          elements: [{ id: '456', isBackground: true }, { id: '789' }],
        },
      ],
      current: '111',
      selection: [],
    });

    const result = clearBackgroundElement();

    expect(result.pages[0].elements).toStrictEqual([
      {
        id: '123',
        isDefaultBackground: true,
        isBackground: true,
      },
      { id: '456' },
      { id: '789' },
    ]);
  });

  it('should do nothing if background is default', () => {
    const { restore, clearBackgroundElement } = setupReducer();

    // Set an initial state with a current page and some elements.
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', isDefaultBackground: true, isBackground: true },
            { id: '456' },
            { id: '789' },
          ],
        },
      ],
      current: '111',
      selection: [],
    });

    const result = clearBackgroundElement();

    expect(result).toStrictEqual(initialState);
  });

  it('should unset overlay if present', () => {
    const { restore, clearBackgroundElement } = setupReducer();

    // Set an initial state with a current page, some elements and a default background element
    restore({
      pages: [
        {
          id: '111',
          defaultBackgroundElement: {
            id: '123',
            isDefaultBackground: true,
            isBackground: true,
          },
          elements: [
            { id: '456', isBackground: true, backgroundOverlay: {} },
            { id: '789' },
          ],
        },
      ],
      current: '111',
      selection: [],
    });

    const result = clearBackgroundElement();

    expect(result.pages[0].elements).toStrictEqual([
      {
        id: '123',
        isDefaultBackground: true,
        isBackground: true,
      },
      { id: '456' },
      { id: '789' },
    ]);
  });
});
