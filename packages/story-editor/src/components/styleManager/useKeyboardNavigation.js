/*
 * Copyright 2021 Google LLC
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
import { useKeyDownEffect } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
const PRESETS_PER_ROW = 2;

function useKeyboardNavigation({ activeIndex, setActiveIndex, groupRef }) {
  const getIndexDiff = (key, rowLength) => {
    switch (key) {
      case 'ArrowUp':
        return -rowLength;
      case 'ArrowDown':
        return rowLength;
      case 'ArrowLeft':
        return -1;
      case 'ArrowRight':
        return 1;
      default:
        return 0;
    }
  };

  useKeyDownEffect(
    groupRef,
    { key: ['up', 'down', 'left', 'right'] },
    ({ key }) => {
      // When the user navigates in the colors using the arrow keys,
      // Let's change the active index accordingly, to indicate which preset should be focused
      if (groupRef.current) {
        const diff = getIndexDiff(key, PRESETS_PER_ROW);
        const buttons = groupRef.current.querySelectorAll(
          'button:not([disabled])'
        );
        const maxIndex = buttons.length - 1;
        const val = (activeIndex ?? 0) + diff;
        const newIndex = Math.max(0, Math.min(maxIndex, val));
        setActiveIndex(newIndex);
        if (buttons[newIndex]) {
          buttons[newIndex].focus();
        }
      }
    },
    [activeIndex, setActiveIndex, groupRef]
  );
}

export default useKeyboardNavigation;
