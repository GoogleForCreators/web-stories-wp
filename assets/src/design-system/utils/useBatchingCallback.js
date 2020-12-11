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
import { useCallback } from 'react';
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom';

/**
 * The same as `useCallback` except that it ensures the updates
 * are batched. Use anywhere where the native DOM events are handled
 * or for microtasks.
 * See https://blog.logrocket.com/simplifying-state-management-in-react-apps-with-batched-updates/.
 *
 * @param {function()} callback The callback to be batched and memoized.
 * @param {Array} [deps] The optional callback dependencies.
 * @return {function()} The memoized batching function.
 */
function useBatchingCallback(callback, deps = undefined) {
  return useCallback(
    (...args) => batchedUpdates(() => callback(...args)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );
}

export default useBatchingCallback;
