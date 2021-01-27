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
import { useEffect } from 'react';

/**
 * Internal dependencies
 */
import { useKeyDownEffect } from '../../../../../design-system/components/keyboard';
import { COLOR_PRESETS_PER_ROW } from '../../../../constants';

function useKeyboardNavigation({
  activeIndex,
  setActiveIndex,
  groupRef,
  styles,
}) {
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
        const diff = getIndexDiff(key, COLOR_PRESETS_PER_ROW);
        const maxIndex = styles.length - 1;
        const val = (activeIndex ?? 0) + diff;
        const newIndex = Math.max(0, Math.min(maxIndex, val));
        setActiveIndex(newIndex);
        const buttons = groupRef.current.querySelectorAll('button');
        if (buttons[newIndex]) {
          buttons[newIndex].focus();
        }
      }
    },
    [activeIndex, styles.length, setActiveIndex, groupRef]
  );

  // Make sure index stays within the length (user can delete last element)
  useEffect(() => {
    if (activeIndex >= styles.length) {
      setActiveIndex(styles.length - 1);
    }
  }, [activeIndex, styles.length, setActiveIndex]);
}

export default useKeyboardNavigation;
