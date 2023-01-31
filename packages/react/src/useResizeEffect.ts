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
import { useEffect } from 'react';
import type { DependencyList, MutableRefObject } from 'react';

interface ResizeHandler {
  (dimensions: { width: number; height: number }): void;
}

/**
 * @param ref Target node ref.
 * @param handler The resize handler.
 * @param [deps] The effect's dependencies.
 */
function useResizeEffect(
  ref: MutableRefObject<Element>,
  handler: ResizeHandler,
  deps: DependencyList | undefined = undefined
) {
  useEffect(
    () => {
      if (!ref?.current || !ResizeObserver) {
        return undefined;
      }

      const observer = new ResizeObserver((entries) => {
        // requestAnimationFrame prevents the 'ResizeObserver loop limit exceeded' error
        // https://stackoverflow.com/a/58701523/13078978
        window.requestAnimationFrame(() => {
          if (!ref?.current) {
            return;
          }

          const last =
            entries?.length !== undefined && entries?.length > 0
              ? entries[entries.length - 1]
              : null;

          if (last) {
            const { width, height } = last.contentRect;
            handler({ width, height });
          }
        });
      });

      observer.observe(ref?.current);

      return () => {
        observer.disconnect();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Pass through provided deps.
    deps || []
  );
}

export default useResizeEffect;
