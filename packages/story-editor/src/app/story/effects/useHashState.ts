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
import { useEffect, useState } from '@googleforcreators/react';
import type { Dispatch, SetStateAction } from 'react';

export function hashToParams(hash: string) {
  return new URLSearchParams(hash.startsWith('#') ? hash.substr(1) : hash);
}

/**
 * Functions like a normal `useState()` but reads initial value of of url
 * hash key and uses `fallback` if no value found. Also updates hash key on
 * every state update so is persistent between mounts.
 *
 * Values held in here must be serializable.
 *
 * Can be used as many times as needed, but may exceed url char limit
 * if over used.
 */
function useHashState(
  key: string,
  fallback: string | null
): [string | null, Dispatch<SetStateAction<string | null>>] {
  const [value, setValue] = useState<string | null>(() => {
    const params = hashToParams(window.location.hash);
    let _value = fallback;
    try {
      if (params.has(key)) {
        const paramValue = params.get(key);
        if (null === paramValue) {
          return paramValue;
        }
        _value = JSON.parse(decodeURI(paramValue)) as string;
      }
    } catch (e) {
      // @TODO Add some error handling
    }
    return _value;
  });

  // update url param when value updates
  useEffect(() => {
    const params = hashToParams(window.location.hash);
    if (!value) {
      params.delete(key);
    } else {
      params.set(key, encodeURI(JSON.stringify(value)));
    }

    if (!window.location.hash && !params.toString()) {
      return;
    }

    history.replaceState(history.state, '', `#${params.toString()}`);
  }, [key, value]);

  return [value, setValue];
}

export default useHashState;
