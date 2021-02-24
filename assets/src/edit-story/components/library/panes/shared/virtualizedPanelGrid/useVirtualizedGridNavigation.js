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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Internal dependencies
 */
import { useFocusOut, useKeyDownEffect } from '../../../../../../design-system';
import useRovingTabIndex from '../../../../../utils/useRovingTabIndex';
import useFocusCanvas from '../../../../canvas/useFocusCanvas';

// todo add notes
/**
 * useVirtual and useRovingTabIndex do not play well together but we need both!
 * The below useEffect is key to maintaining the proper focus for keyboard users.
 * What happens is on "scroll" of the virtualized container useVirtual is grabbing more rows
 * and these rows are fed through the rendered map to create page layouts that are visible to users.
 * While it doesn't look like the DOM is updating, it is in fact updating.
 * So the old refs get lost and the list gets new ones! By manually forcing focus and maintaining an object
 * of pageRefs that are organized by page id (those don't update) we can make sure the focus stays where it's supposed to be.
 * Checking for a difference in currentAvailableRows and assigning the matching ref to any change is just so that the effect hook will run when the virtualized list
 * updates and reattach focus to the new instance of an already selected layout.
 */

export default function useVirtualizedGridNavigation({
  containerRef,
  pageRefs,
  pageIds,
  rowVirtualizer,
}) {
  const [activePageId, setActivePageId] = useState();

  const [isPageLayoutsFocused, setIsPageLayoutsFocused] = useState(false);
  const currentAvailableRows = useMemo(() => rowVirtualizer.virtualItems, [
    rowVirtualizer,
  ]);
  const currentAvailableRowsRef = useRef();

  useEffect(() => {
    if (currentAvailableRows !== currentAvailableRowsRef?.current) {
      currentAvailableRowsRef.current = currentAvailableRows;
    }

    if (activePageId && isPageLayoutsFocused) {
      pageRefs.current?.[activePageId]?.focus();
    }
  }, [activePageId, currentAvailableRows, isPageLayoutsFocused, pageRefs]);

  useRovingTabIndex({ ref: containerRef });

  const handlePageLayoutFocus = useCallback(() => {
    if (!isPageLayoutsFocused) {
      const newPageId = pageRefs.current?.[activePageId]
        ? activePageId
        : pageIds[0];

      setActivePageId(newPageId);
      setIsPageLayoutsFocused(true);
      pageRefs.current?.[newPageId]?.focus();
    }
  }, [activePageId, isPageLayoutsFocused, pageIds, pageRefs]);

  const handlePageFocus = useCallback(
    (pageId) => {
      if (activePageId !== pageId) {
        setActivePageId(pageId);
      }
    },
    [activePageId]
  );

  // Exit page layouts
  const focusCanvas = useFocusCanvas();

  const onTabKeyDown = useCallback(() => {
    focusCanvas();
    setIsPageLayoutsFocused(false);
  }, [focusCanvas]);

  useKeyDownEffect(containerRef, 'tab', onTabKeyDown, [onTabKeyDown]);

  useFocusOut(
    containerRef,
    () => {
      setIsPageLayoutsFocused(false);
    },
    []
  );

  return useMemo(
    () => ({
      handlePageLayoutFocus,
      handlePageFocus,
      activePageId,
      isPageLayoutsFocused,
    }),
    [activePageId, isPageLayoutsFocused, handlePageLayoutFocus, handlePageFocus]
  );
}
