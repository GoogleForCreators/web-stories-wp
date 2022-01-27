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
 * External dependencies
 */
import { STORY_ANIMATION_STATE } from '@googleforcreators/animation';

/**
 * Internal dependencies
 */
import { setupReducer } from './_utils';

describe('updateAnimationState', () => {
  it('should update animation state', () => {
    const { restore, updateAnimationState } = setupReducer();

    // Set an initial state with a current page and some elements selected.
    const initialState = restore({
      pages: [
        { id: '111', elements: [{ id: '123' }, { id: '456' }, { id: '789' }] },
      ],
      current: '111',
      selection: ['123', '456'],
      animationState: STORY_ANIMATION_STATE.RESET,
    });

    const result = updateAnimationState({
      animationState: STORY_ANIMATION_STATE.PLAYING,
    });

    expect(result).toStrictEqual({
      ...initialState,
      animationState: STORY_ANIMATION_STATE.PLAYING,
    });
  });

  it('should do nothing if state is the same', () => {
    const { restore, updateAnimationState } = setupReducer();

    // Set an initial state with a current page and some elements, none selected.
    const initialState = restore({
      pages: [
        { id: '111', elements: [{ id: '123' }, { id: '456' }, { id: '789' }] },
      ],
      current: '111',
      selection: [],
      animationState: STORY_ANIMATION_STATE.RESET,
    });

    const result = updateAnimationState({
      animationState: STORY_ANIMATION_STATE.RESET,
    });

    expect(result).toStrictEqual({
      ...initialState,
      animationState: STORY_ANIMATION_STATE.RESET,
    });

    expect(result).toBe(initialState);
  });
});
