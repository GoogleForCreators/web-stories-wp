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
import { STORY_ANIMATION_STATE } from '../../../../../animation';
import { setupReducer } from './_utils';

describe('updateSelectedElements', () => {
  it('should update the selected elements', () => {
    const { restore, updateSelectedElements } = setupReducer();

    // Set an initial state with a current page and some elements selected.
    const initialState = restore({
      pages: [
        { id: '111', elements: [{ id: '123' }, { id: '456' }, { id: '789' }] },
      ],
      current: '111',
      selection: ['123', '456'],
    });

    const result = updateSelectedElements({ properties: { a: 1 } });

    expect(result).toStrictEqual({
      ...initialState,
      pages: [
        {
          id: '111',
          elements: [{ id: '123', a: 1 }, { id: '456', a: 1 }, { id: '789' }],
        },
      ],
      selection: ['123', '456'],
    });
  });

  it('should do nothing if no elements selected', () => {
    const { restore, updateSelectedElements } = setupReducer();

    // Set an initial state with a current page and some elements, none selected.
    const initialState = restore({
      pages: [
        { id: '111', elements: [{ id: '123' }, { id: '456' }, { id: '789' }] },
      ],
      current: '111',
      selection: [],
    });

    const result = updateSelectedElements({ properties: { a: 1 } });

    expect(result).toStrictEqual(initialState);
  });

  it('should do nothing if elements selected and animation playing or scrubbing', () => {
    const {
      restore,
      updateSelectedElements,
      updateAnimationState,
    } = setupReducer();

    const initialState = restore({
      pages: [
        { id: '111', elements: [{ id: '123' }, { id: '456' }, { id: '789' }] },
      ],
      current: '111',
      selection: ['123', '456'],
    });

    updateAnimationState({ animationState: STORY_ANIMATION_STATE.PLAYING });
    const playingResult = updateSelectedElements({ properties: { a: 1 } });

    updateAnimationState({ animationState: STORY_ANIMATION_STATE.SCRUBBING });
    const scrubbingResult = updateSelectedElements({ properties: { a: 1 } });

    expect(playingResult).toStrictEqual({
      ...initialState,
      animationState: STORY_ANIMATION_STATE.PLAYING,
    });
    expect(scrubbingResult).toStrictEqual({
      ...initialState,
      animationState: STORY_ANIMATION_STATE.SCRUBBING,
    });
  });

  it('should update the selected elements with a function', () => {
    const { restore, updateSelectedElements } = setupReducer();

    // Set an initial state with a current page and some elements selected.
    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', a: 1 },
            { id: '456', a: 2 },
            { id: '789', a: 0 },
          ],
        },
      ],
      current: '111',
      selection: ['123', '456'],
    });

    const result = updateSelectedElements({
      properties: ({ a, ...rest }) => ({ a: a + 1, ...rest }),
    });

    expect(result).toStrictEqual({
      ...initialState,
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', a: 2 },
            { id: '456', a: 3 },
            { id: '789', a: 0 },
          ],
        },
      ],
      selection: ['123', '456'],
    });
  });
});
