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
import { useRef } from '@googleforcreators/react';
import type { RefObject } from 'react';

function useForwardedRef<T>(ref: React.ForwardedRef<T>) {
  const wrappedRef = useRef<{ current: T | null }>({ current: null });
  const referenceRef = useRef<T | null>(null);

  Object.defineProperty(wrappedRef.current, 'current', {
    get: () => referenceRef.current,
    set: (value: T | null) => {
      if (!Object.is(referenceRef.current, value)) {
        referenceRef.current = value;
        if (!ref) {
          return;
        }
        if (typeof ref === 'function') {
          ref(referenceRef.current);
        } else {
          ref.current = referenceRef.current;
        }
      }
    },
  });

  return wrappedRef.current as RefObject<T>;
}

export default useForwardedRef;
