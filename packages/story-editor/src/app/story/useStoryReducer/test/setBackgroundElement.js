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

describe('setBackgroundElement', () => {
  it('should set the given background opacity to 100', () => {
    const { restore, setBackgroundElement } = setupReducer();

    restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '000', isBackground: true },
            { id: '123', opacity: 20 },
          ],
        },
      ],
      current: '111',
      selection: [],
    });

    const result = setBackgroundElement({ elementId: '123' });

    expect(result.pages[0].elements).toStrictEqual([
      { id: '123', isBackground: true, opacity: 100 },
    ]);
  });
  it('should not set opacity for new backgroud elements if none was present', () => {
    const { restore, setBackgroundElement } = setupReducer();

    restore({
      pages: [
        {
          id: '111',
          elements: [{ id: '000', isBackground: true }, { id: '123' }],
        },
      ],
      current: '111',
      selection: [],
    });

    const result = setBackgroundElement({ elementId: '123' });

    expect(result.pages[0].elements).toStrictEqual([
      { id: '123', isBackground: true },
    ]);
  });

  it('should set the given background element and move it back', () => {
    const { restore, setBackgroundElement } = setupReducer();

    // Set an initial state with a current page and some elements.
    restore({
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

    // 456 is to be bg - move it back and set it as background
    const result = setBackgroundElement({ elementId: '456' });

    expect(result.pages[0].elements).toStrictEqual([
      { id: '456', isBackground: true },
      { id: '789' },
    ]);
  });

  it('should remove the new background element from selection if there is more than it there', () => {
    const { restore, setBackgroundElement } = setupReducer();

    // Set an initial state with a current page and some elements selected.
    restore({
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
      selection: ['456', '789'],
    });

    // 456 is to be bg
    const result = setBackgroundElement({ elementId: '456' });

    expect(result.selection).toStrictEqual(['789']);
  });

  it('should do nothing if already background', () => {
    const { restore, setBackgroundElement } = setupReducer();

    // Set an initial state with a current page and some elements.
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', isBackground: true, opacity: 100 },
            { id: '456' },
            { id: '789' },
          ],
        },
      ],
      current: '111',
      selection: [],
    });

    // 123 is already bg
    const result = setBackgroundElement({ elementId: '123' });

    expect(result).toStrictEqual(initialState);
  });

  it('should do nothing if given unknown element', () => {
    const { restore, setBackgroundElement } = setupReducer();

    // Set an initial state with a current page and some elements.
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', isBackground: true, opacity: 100 },
            { id: '456' },
            { id: '789' },
          ],
        },
      ],
      current: '111',
      selection: [],
    });

    // 000 doesn't exist - nothing happens
    const result = setBackgroundElement({ elementId: '000' });

    expect(result).toStrictEqual(initialState);
  });

  it('should save default background element for later', () => {
    const { restore, setBackgroundElement } = setupReducer();

    // Set an initial state with a current page and no selection.
    restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', isBackground: true, isDefaultBackground: true },
            { id: '456' },
            { id: '789' },
          ],
        },
      ],
      current: '111',
      selection: [],
    });

    // 789 becomes background, 123 is deleted
    const result = setBackgroundElement({ elementId: '789' });

    expect(result.pages[0]).toStrictEqual(
      expect.objectContaining({
        defaultBackgroundElement: {
          id: '123',
          isBackground: true,
          isDefaultBackground: true,
        },
        elements: [{ id: '789', isBackground: true }, { id: '456' }],
      })
    );
  });

  it('should delete existing background element if not default', () => {
    const { restore, setBackgroundElement } = setupReducer();

    // Set an initial state with a current page and no selection.
    restore({
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

    // 789 becomes background, 123 is deleted
    const result = setBackgroundElement({ elementId: '789' });

    expect(result.pages[0].elements).toStrictEqual([
      { id: '789', isBackground: true },
      { id: '456' },
    ]);
  });

  it('should also delete non-default background element from selection', () => {
    const { restore, setBackgroundElement } = setupReducer();

    // Set an initial state with a current page and background element selected.
    restore({
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
      selection: ['123'],
    });

    // 789 becomes background, 123 is deleted (also from selection)
    const result = setBackgroundElement({ elementId: '789' });

    expect(result.pages[0].elements).toStrictEqual([
      { id: '789', isBackground: true },
      { id: '456' },
    ]);
    expect(result.selection).toStrictEqual([]);
  });
});
