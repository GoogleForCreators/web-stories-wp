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
import { renderHook, act } from '@testing-library/react';

/**
 * Internal dependencies
 */
import useStoryReducer from '../useStoryReducer';

export function setupReducer(partial) {
  const { result } = renderHook(() => useStoryReducer(partial));

  // convert each method to be wrapped in act and return the new state
  const wrapWithAct = (methods) =>
    Object.keys(methods).reduce((obj, methodName) => {
      const method = methods[methodName];
      const wrapped = (parms) => {
        act(() => method(parms));
        return result.current.state;
      };
      return {
        ...obj,
        [methodName]: wrapped,
      };
    }, {});

  return wrapWithAct({
    ...result.current.api,
    ...result.current.internal,
  });
}
