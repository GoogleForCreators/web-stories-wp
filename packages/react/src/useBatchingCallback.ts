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
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom';
import { useCallback } from 'react';
import type { DependencyList } from 'react';

/**
 * The same as `useCallback` except that it ensures the updates
 * are batched. Use anywhere where the native DOM events are handled
 * or for microtasks.
 * See https://blog.logrocket.com/simplifying-state-management-in-react-apps-with-batched-updates/.
 *
 * @param callback The callback to be batched and memoized.
 * @param [deps] The optional callback dependencies.
 * @return The memoized batching function.
 */
function useBatchingCallback<
  T extends (...args: [event: KeyboardEvent]) => void
>(callback: T, deps: DependencyList): (...args: [event: KeyboardEvent]) => void;
function useBatchingCallback<T extends (...args: unknown[]) => void>(
  callback: T,
  deps: DependencyList
) {
  return useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- Just passing through
    (...args) => batchedUpdates(() => callback(...args)),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Pass through provided deps.
    deps
  );
}

export default useBatchingCallback;
