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
jest.mock('flagged');
import { renderHook } from '@testing-library/react-hooks';
import { useFeature } from 'flagged';

/**
 * Internal dependencies
 */
import { StoryAnimation, useStoryAnimationContext } from '..';

describe('useStoryAnimationContext()', () => {
  useFeature.mockImplementation(() => true);

  it('should throw an error if used oustide StroyAnimation.Provider', () => {
    expect(() => {
      const {
        // eslint-disable-next-line no-unused-vars
        result: { current },
      } = renderHook(() => useStoryAnimationContext());
    }).toThrow(
      Error(
        'Must use `useStoryAnimationContext()` within <StoryAnimation.Provider />'
      )
    );
  });

  it('should not throw an error if used inside StoryAnimation.Provider', () => {
    const { result } = renderHook(() => useStoryAnimationContext(), {
      wrapper: StoryAnimation.Provider,
    });
    expect(result.current.error).toBeUndefined();
  });
});
