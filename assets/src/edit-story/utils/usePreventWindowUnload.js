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

/**
 * This control the listener register flow.
 * It should be declared outside of the hook to avoid recreate different references of the registered handler in order to make posible remove it later from multiple contexts.
 *
 * @param {Event} event beforeunload Event object
 */

export const beforeUnloadListener = (event) => {
  event.preventDefault();
  event.returnValue = '';
};

/**
 * Prevents window unloads without a confirmation prompt.
 *
 * @param {boolean} condition A condition that will control when register/unregister the listener to prevent window unload
 */
function usePreventWindowUnload(condition = false) {
  useEffect(() => {
    if (condition) {
      window.addEventListener('beforeunload', beforeUnloadListener);
    } else {
      window.removeEventListener('beforeunload', beforeUnloadListener);
    }

    return () => {
      window.removeEventListener('beforeunload', beforeUnloadListener);
    };
  }, [condition]);
}

export default usePreventWindowUnload;
