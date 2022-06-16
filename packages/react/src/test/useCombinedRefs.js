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
 * External dependencies
 */
import { renderHook } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { useRef } from '..';
import useCombinedRefs from '../useCombinedRefs';

describe('useCombinedRefs', () => {
  it('composes all refs into one callback ref', () => {
    const testNode = 'value';
    const testCallbackRef = jest.fn();

    // handling all the refs in one hook just so everything
    // can be accessed in one result.current scope
    const useTestRefs = () => {
      const ref1 = useRef();
      const ref2 = useRef();
      const ref3 = testCallbackRef;
      const composedCallbackRef = useCombinedRefs(ref1, ref2, ref3);
      return {
        ref1,
        ref2,
        ref3,
        composedCallbackRef,
      };
    };

    const { result } = renderHook(() => useTestRefs());
    // simulating how react would call this if there was a new
    // node for something like <div ref={composedCallbackRef} />
    result.current.composedCallbackRef(testNode);

    // see that all refs were set or called depending
    // on if they're callback refs or traditional refs
    const { ref1, ref2, ref3 } = result.current;
    expect(ref1.current).toBe(testNode);
    expect(ref2.current).toBe(testNode);
    expect(ref3).toHaveBeenCalledWith(testNode);
  });
});
