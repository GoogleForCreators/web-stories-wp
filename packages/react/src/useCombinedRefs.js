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

/**
 * Synchronize multiple refs to a single ref
 *
 * This is used when receiving a forwarded ref, but also needing an internal one.
 *
 * @param {Array} refs  List of refs to synchronize
 * @return {Function} A callback to be used as `ref` for element.
 */
function useCombinedRefs(...refs) {
  const setRef = useCallback(
    (node) => {
      refs.forEach((ref) => {
        if (!ref) {
          // Ignore non-existing refs
          return;
        }

        // Set ref value correctly
        if (typeof ref === 'function') {
          ref(node);
        } else {
          ref.current = node;
        }
      });
    },
    [refs]
  );

  return setRef;
}

export default useCombinedRefs;
