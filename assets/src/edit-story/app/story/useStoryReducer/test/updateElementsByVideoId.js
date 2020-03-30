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

describe('updateElementsByVideoId', () => {
  it('should update the elements with videoId', () => {
    const { restore, updateElementsByVideoId } = setupReducer();

    // Set an initial state with a current page and some elements selected.
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', resource: { videoId: '10' } },
            { id: '456', resource: { videoId: '10' } },
            { id: '789' },
          ],
        },
      ],
      current: '111',
      selection: ['123', '789'],
    });

    const result = updateElementsByVideoId({
      videoId: '10',
      properties: { a: 1 },
    });

    expect(result).toStrictEqual({
      ...initialState,
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', a: 1, resource: { videoId: '10' } },
            { id: '456', a: 1, resource: { videoId: '10' } },
            { id: '789' },
          ],
        },
      ],
      selection: ['123', '789'],
    });
  });

  it('should do nothing if no elements with correct videoId', () => {
    const { restore, updateElementsByVideoId } = setupReducer();

    // Set an initial state with a current page and some elements, none selected.
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', resource: { videoId: '12' } },
            { id: '456' },
            { id: '789', resource: { videoId: '15' } },
          ],
        },
      ],
      current: '111',
      selection: [],
    });

    const result = updateElementsByVideoId({
      videoId: '10',
      properties: { a: 1 },
    });

    expect(result).toStrictEqual(initialState);
  });

  it('should update the elements with the correct videoId with a function, none related with selected elements', () => {
    const { restore, updateElementsByVideoId } = setupReducer();

    // Set an initial state with a current page and some elements selected.
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', a: 1, resource: { videoId: '10' } },
            { id: '456', a: 2 },
            { id: '789', a: 0, resource: { videoId: '10' } },
          ],
        },
      ],
      current: '111',
      selection: ['123', '456'],
    });

    const result = updateElementsByVideoId({
      videoId: '10',
      properties: ({ a, ...rest }) => ({ a: a + 1, ...rest }),
    });

    expect(result).toStrictEqual({
      ...initialState,
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', a: 2, resource: { videoId: '10' } },
            { id: '456', a: 2 },
            { id: '789', a: 1, resource: { videoId: '10' } },
          ],
        },
      ],
      selection: ['123', '456'],
    });
  });
});
