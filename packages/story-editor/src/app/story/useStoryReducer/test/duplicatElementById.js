/*
 * Copyright 2021 Google LLC
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

describe('duplicateElementById', () => {
  it('duplicates an element at index after specified element', () => {
    const { restore, duplicateElementById } = setupReducer();

    // Set an initial state with a current page.
    const initialState = restore({
      pages: [
        {
          id: '111',
          animations: [],
          elements: [
            { id: '123', isBackground: true, type: 'shape' },
            { id: '456', x: 0, y: 0, type: 'shape' },
            { id: '789', x: 0, y: 0, type: 'shape' },
          ],
        },
      ],
      current: '111',
      selection: ['789', '456'],
    });

    const result = duplicateElementById({ elementId: '456' });

    expect(result).toStrictEqual({
      ...initialState,
      pages: [
        {
          id: '111',
          animations: [],
          elements: [
            expect.objectContaining({
              id: '123',
              isBackground: true,
              type: 'shape',
            }),
            expect.objectContaining({ id: '456', x: 0, y: 0, type: 'shape' }),
            expect.objectContaining({
              id: expect.any(String),
              x: expect.any(Number),
              y: expect.any(Number),
              type: 'shape',
            }),
            expect.objectContaining({ id: '789', x: 0, y: 0, type: 'shape' }),
          ],
        },
      ],
    });
  });

  it('doesnt duplicate background elements', () => {
    const { restore, duplicateElementById } = setupReducer();

    // Set an initial state with a current page.
    const initialState = restore({
      pages: [
        {
          id: '111',
          animations: [],
          elements: [
            { id: '123', isBackground: true, type: 'shape' },
            { id: '456', x: 0, y: 0, type: 'shape' },
            { id: '789', x: 0, y: 0, type: 'shape' },
          ],
        },
      ],
      current: '111',
      selection: ['789', '456'],
    });

    const result = duplicateElementById({ elementId: '123' });
    expect(result).toStrictEqual(initialState);
  });

  it('duplicates an elements animations', () => {
    const { restore, duplicateElementById } = setupReducer();

    // Set an initial state with a current page.
    const initialState = restore({
      pages: [
        {
          id: '111',
          animations: [
            { id: '1', targets: ['456'], type: 'wild_wacky_animation' },
          ],
          elements: [
            { id: '123', isBackground: true, type: 'shape' },
            { id: '456', x: 0, y: 0, type: 'shape' },
            { id: '789', x: 0, y: 0, type: 'shape' },
          ],
        },
      ],
      current: '111',
      selection: ['789', '456'],
    });

    const result = duplicateElementById({ elementId: '456' });
    const newElement = result.pages[0].elements.find(
      (el) => !initialState.pages[0].elements.includes(el)
    );
    expect(result).toStrictEqual({
      ...initialState,
      pages: [
        {
          id: '111',
          animations: [
            { id: '1', targets: ['456'], type: 'wild_wacky_animation' },
            {
              id: expect.any(String),
              targets: [newElement.id],
              type: 'wild_wacky_animation',
            },
          ],
          elements: [
            expect.objectContaining({
              id: '123',
              isBackground: true,
              type: 'shape',
            }),
            expect.objectContaining({ id: '456', x: 0, y: 0, type: 'shape' }),
            expect.objectContaining({
              id: expect.any(String),
              x: expect.any(Number),
              y: expect.any(Number),
              type: 'shape',
            }),
            expect.objectContaining({ id: '789', x: 0, y: 0, type: 'shape' }),
          ],
        },
      ],
    });
  });

  it('places duplicated element in a new location', () => {
    const { restore, duplicateElementById } = setupReducer();

    // Set an initial state with a current page.
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', isBackground: true, type: 'shape' },
            { id: '456', x: 0, y: 0, type: 'shape' },
            { id: '789', x: 0, y: 0, type: 'shape' },
          ],
        },
      ],
      current: '111',
      selection: ['789', '456'],
    });

    const result = duplicateElementById({ elementId: '456' });
    const initalElement = initialState.pages[0].elements.find(
      (el) => el.id === '456'
    );
    const newElement = result.pages[0].elements.find(
      (el) => !initialState.pages[0].elements.includes(el)
    );
    expect(result.pages[0].elements).toHaveLength(4);
    expect(initalElement.x).not.toBe(newElement.x);
    expect(initalElement.y).not.toBe(newElement.y);
  });
});
