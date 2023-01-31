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
import { useContextSelector as useContextSelectorOrig } from 'use-context-selector';
import { useRef } from 'react';
import type { MutableRefObject, Context } from 'react';

/**
 * Internal dependencies
 */
import shallowEqual from './shallowEqual';

interface EqualityFn {
  (a: unknown, b: unknown): boolean;
}

/**
 * This hook returns a part of the context value by selector.
 * It will trigger a re-render only if the selected value has changed.
 *
 * By default, a shallow equals of the selected context value is used to
 * determine if a re-render is needed.
 *
 * @param context Context.
 * @param selector Returns a fragment of the context
 * that the consumer is interested in.
 * @param equalityFn Used to compare the
 * selected context value. If the context fragment has not changed, a re-render
 * will not be triggered. This is {shallowEqual} by default.
 * @return The selected context value fragment.
 */
function useContextSelector<T, S>(
  context: Context<T>,
  selector: (value: T) => S,
  equalityFn: EqualityFn = shallowEqual
) {
  const ref: MutableRefObject<S | undefined> = useRef();

  const equalityFnCallback = (state: T) => {
    const selected = selector(state);
    if (ref.current && equalityFn(ref.current, selected)) {
      return ref.current;
    }
    ref.current = selected;
    return selected;
  };

  // Update the selector fn to memoize the selected value by [equalityFn].
  return useContextSelectorOrig(context, equalityFnCallback);
}

export default useContextSelector;
