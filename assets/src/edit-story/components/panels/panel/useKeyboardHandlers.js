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
import { useCallback, useLayoutEffect } from 'react';

const KEY_UP = ['Up', 'ArrowUp'];
const KEY_DOWN = ['Down', 'ArrowDown'];
const DELTA_CHANGE = 20; // change in pixels when pressing arrow keys

function useKeyboardHandlers(handle, handleHeightChange) {
  // Handle up/down keypresses to move separator.
  // TODO Should be rewritten to use MouseTrap when added to .
  const handleKeyPress = useCallback(
    (evt) => {
      const isUp = KEY_UP.includes(evt.key);
      const isDown = KEY_DOWN.includes(evt.key);
      if (isUp || isDown) {
        const direction = isUp ? 1 : -1;
        handleHeightChange(direction * DELTA_CHANGE);
        evt.stopPropagation();
        evt.preventDefault();
      }
    },
    [handleHeightChange]
  );

  // On initial render assign keyboard listener to handle up/down arrow presses.
  useLayoutEffect(() => {
    const element = handle.current;
    element.addEventListener('keydown', handleKeyPress);

    return () => element.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress, handle]);
}

export default useKeyboardHandlers;
