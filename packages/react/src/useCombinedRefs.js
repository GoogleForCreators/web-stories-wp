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
import { useCallback, useRef } from './react';

/**
 * Synchronize multiple refs to a single ref
 *
 * This is used when receiving a forwarded ref, but also needing an internal one.
 *
 * @param {Array} refs  List of refs to synchronize
 * @return {(node:HTMLElement) => void} A callback to be used as `ref` for element.
 */
function useCombinedRefs(...refs) {
  const refsRef = useRef(refs);
  refsRef.current = refs;
  return useCallback((node) => {
    refsRef.current.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
        return;
      }

      if (ref) {
        ref.current = node;
        return;
      }
    });
  }, []);
}

export default useCombinedRefs;
