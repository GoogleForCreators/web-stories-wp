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
import { useCallback } from 'react';
/**
 * Internal dependencies
 */
import { useKeyDownEffect } from '../../../../design-system';

function useRadioNavigation(ref) {
  const changeCurrent = useCallback(
    (direction) => {
      const radioGroup = ref.current;
      if (!radioGroup) {
        return;
      }
      const list = Array.from(
        radioGroup.querySelectorAll('input[type="radio"]')
      );

      // Find index of currently focused input
      const currentIndex = list.indexOf(document.activeElement);
      if (currentIndex === -1) {
        return;
      }

      // Find new index, if outside range = ignore it
      const newIndex = currentIndex + direction;
      if (newIndex < 0 || newIndex >= list.length) {
        return;
      }

      // Now focus this one
      list[newIndex].focus();
    },
    [ref]
  );
  const handlePrevious = useCallback(() => changeCurrent(-1), [changeCurrent]);
  useKeyDownEffect(ref, ['up', 'left'], handlePrevious, [handlePrevious]);
  const handleNext = useCallback(() => changeCurrent(1), [changeCurrent]);
  useKeyDownEffect(ref, ['down', 'right'], handleNext, [handleNext]);
}

export default useRadioNavigation;
