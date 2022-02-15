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
import { useEffect } from '@googleforcreators/react';

/**
 * @callback IntersectionHandler
 * @param {IntersectionObserverEntry} entry
 */

/**
 * @param {Object<{current: ?Element}>} ref Target node ref.
 * @param {?Object} options The IntersectionObserver options, root is a ref not node.
 * @param {IntersectionHandler} handler The intersection handler.
 * @param {Array} [deps] The effect's dependencies.
 */
function useIntersectionEffect(ref, options = {}, handler, deps = undefined) {
  useEffect(
    () => {
      const node = ref.current;
      const usingRoot = 'root' in options;
      if (usingRoot) {
        options.root = options.root.current;
      }
      if (!node || (usingRoot && !options.root)) {
        return () => {};
      }

      const observer = new window.IntersectionObserver((entries) => {
        const last = entries.length > 0 ? entries[entries.length - 1] : null;
        if (last) {
          handler(last);
        }
      }, options);

      observer.observe(node);

      return () => observer.disconnect();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Pass through the provided deps.
    deps || []
  );
}

export default useIntersectionEffect;
