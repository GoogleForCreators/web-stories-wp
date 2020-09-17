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

function useHandleRowVisibility({
  innerContainerRef,
  selectedItem,
  isExpanded,
  setFocusedRowOffset,
  itemRefs,
}) {
  // Handles setting which row will be seen, by manipulating translateY.
  useLayoutEffect(() => {
    if (!innerContainerRef.current) {
      return;
    }
    const selectedItemOffsetTop = selectedItem.current?.offsetTop || 0;

    if (!isExpanded && selectedItem) {
      setFocusedRowOffset(selectedItemOffsetTop);
    }
  }, [innerContainerRef, isExpanded, selectedItem, setFocusedRowOffset]);

  // Handles fading rows in and out depending on the selected item.
  useLayoutEffect(() => {
    if (!innerContainerRef.current) {
      return;
    }
    const selectedItemOffsetTop = selectedItem.current?.offsetTop || 0;

    for (let pill of itemRefs.current) {
      const isSameRow =
        selectedItem && pill.offsetTop === selectedItemOffsetTop;
      if (selectedItem && !isSameRow && !isExpanded) {
        pill.classList.add('invisible');
      } else {
        pill.classList.remove('invisible');
      }
    }
  }, [innerContainerRef, isExpanded, selectedItem, itemRefs]);
}

export default useHandleRowVisibility;
