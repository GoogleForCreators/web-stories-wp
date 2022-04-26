/*
 * Copyright 2022 Google LLC
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
import { useCallback, useRef } from 'react';

/**
 * Takes a callback and returns an up to date version of the supplied
 * callback, but maintains a stable reference.
 *
 * i.e.
 * ```js
 * const stableCallback = useStableCallback(callback);
 * ```
 *
 * @param {Function} callback a callback composed in your components scope
 * @return {Function} callback with a stable reference
 */
function useStableCallback(callback) {
  const ref = useRef();
  ref.current = callback;
  return useCallback((...args) => ref.current(...args), []);
}

export default useStableCallback;
