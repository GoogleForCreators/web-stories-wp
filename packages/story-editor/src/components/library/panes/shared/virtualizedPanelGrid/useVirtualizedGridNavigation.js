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
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useFocusOut,
} from '@googleforcreators/react';
import { useKeyDownEffect } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import useRovingTabIndex from '../../../../../utils/useRovingTabIndex';
import useFocusCanvas from '../../../../canvas/useFocusCanvas';

/**
 * This is a shared custom hook to enable keyboard arrow navigation on panels
 * that use `useVirtual` to virtualize the contents. It takes over control of
 * focus when keyboard is in play.
 * Use the returned `handleGridFocus` as `onFocus` of the element that `containerRef` belongs.
 * Use the returned `activeGridItemId` as a check in your map of gridItems against the id of
 * each grid item to identify which grid item should get focus styles/behavior.
 * Use the returned `handleGridItemFocus` as the gridItem `onFocus`, pass it the grid item's id as a param.
 * Use the returned `isGridFocused` as a boolean to show focus styles or not.
 *
 * @param {Object} props                All props.
 * @param {Object} props.containerRef   ref of virtualized grid's container (nearest parent in DOM).
 * @param {Object} props.gridItemRefs   ref containing array as .current holding each virtualized item DOM.
 * @param {Array} props.gridItemIds     array of available grid item ids. it's important that ids don't update when the DOM does.
 * @param {Object} props.rowVirtualizer instance of outermost `useVirtual` for this grid.
 * @return {Object}                     memoized keys { handleGridFocus, handleGridItemFocus, activeGridItemId, isGridFocused }
 */
export default function useVirtualizedGridNavigation({
  containerRef,
  gridItemRefs,
  gridItemIds,
  rowVirtualizer,
}) {
  const [activeGridItemId, setActiveGridItemId] = useState();

  const [isGridFocused, setIsGridFocused] = useState(false);
  const currentAvailableRows = useMemo(
    () => rowVirtualizer.virtualItems,
    [rowVirtualizer]
  );
  const currentAvailableRowsRef = useRef();

  /**
   * useVirtual and useRovingTabIndex do not play well together but we need both!
   * The below useEffect is key to maintaining the proper focus for keyboard users.
   * What happens is on "scroll" of the virtualized container useVirtual is grabbing more rows
   * and these rows are fed through the rendered map to create grid that is visible to users.
   * While it doesn't look like the DOM is updating, it is in fact updating.
   * So the old refs get lost and the list gets new ones! By manually forcing focus and maintaining an object
   * of gridItemRefs that are organized by gridItem id (those don't update) we can make sure the focus stays where it's supposed to be.
   * Checking for a difference in currentAvailableRows and assigning the matching ref to any change is just so that the effect hook will run when the virtualized list
   * updates and reattach focus to the new instance of an already selected layout.
   */
  useEffect(() => {
    if (currentAvailableRows !== currentAvailableRowsRef?.current) {
      currentAvailableRowsRef.current = currentAvailableRows;
    }

    if (activeGridItemId && isGridFocused) {
      gridItemRefs.current?.[activeGridItemId]?.focus();
    }
  }, [activeGridItemId, currentAvailableRows, isGridFocused, gridItemRefs]);

  useRovingTabIndex({ ref: containerRef });

  const handleGridFocus = useCallback(() => {
    if (!isGridFocused) {
      const newGridItemId = gridItemRefs.current?.[activeGridItemId]
        ? activeGridItemId
        : gridItemIds?.[0];

      setActiveGridItemId(newGridItemId);
      setIsGridFocused(true);
      gridItemRefs.current?.[newGridItemId]?.focus();
    }
  }, [activeGridItemId, isGridFocused, gridItemIds, gridItemRefs]);

  const handleGridItemFocus = useCallback(
    (itemId) => {
      if (activeGridItemId !== itemId) {
        setActiveGridItemId(itemId);
      }
    },
    [activeGridItemId]
  );

  // Exit grid
  const focusCanvas = useFocusCanvas();

  const onTabKeyDown = useCallback(() => {
    focusCanvas();
    setIsGridFocused(false);
  }, [focusCanvas]);

  useKeyDownEffect(containerRef, 'tab', onTabKeyDown, [onTabKeyDown]);

  useFocusOut(
    containerRef,
    () => {
      setIsGridFocused(false);
    },
    []
  );

  return useMemo(
    () => ({
      handleGridFocus,
      handleGridItemFocus,
      activeGridItemId,
      isGridFocused,
    }),
    [activeGridItemId, isGridFocused, handleGridFocus, handleGridItemFocus]
  );
}
