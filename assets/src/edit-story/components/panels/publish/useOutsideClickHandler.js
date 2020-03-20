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
import { useLayoutEffect } from 'react';

/**
 * @param {Array} refs Array of node refs.
 * @param {Function} handler Handler for outside click.
 * @param {!Array=} deps The effect's dependencies.
 */
function useOutSideClickHandler(refs, handler, deps = undefined) {
  const handleClick = (e) => {
    let insideClick = false;
    // Loop through refs, if click was any of these, return.
    refs.forEach(({ current }) => {
      if (current && current.contains(e.target)) {
        insideClick = true;
      }
    });
    // Don't trigger handler if the click was inside.
    if (insideClick) {
      return;
    }
    handler();
  };

  useLayoutEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps || []);
}

export default useOutSideClickHandler;
