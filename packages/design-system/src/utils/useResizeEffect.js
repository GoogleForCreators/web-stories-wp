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
import ResizeObserver from 'resize-observer-polyfill';

/**
 * External dependencies
 */
import { useEffect } from 'react';

/**
 * @param {Object<{current: ?Element}>} ref Target node ref.
 * @param {function( {width: number, height: number} )} handler The resize handler.
 * @param {Array} [deps] The effect's dependencies.
 */
function useResizeEffect(ref, handler, deps = undefined) {
  useEffect(
    () => {
      const node = ref?.current;
      if (!node) {
        return undefined;
      }

      const observer = new ResizeObserver((entries) => {
        const last = entries.length > 0 ? entries[entries.length - 1] : null;
        if (last) {
          const { width, height } = last.contentRect;
          handler({ width, height });
        }
      });

      observer.observe(node);

      return () => observer.disconnect();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps || []
  );
}

export default useResizeEffect;
