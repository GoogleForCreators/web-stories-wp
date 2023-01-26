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
import { useEffect, useMemo, useState } from '@googleforcreators/react';
import type { RefObject } from 'react';

/**
 * Internal dependencies
 */
import { useKeyDownEffect } from '..';
import {
  focusOnPage,
  getArrowDir,
  getGridColumnAndRowCount,
  getRow,
  getColumn,
  getIndex,
} from './utils';

interface UseGridViewKeysProps {
  currentItemId: string;
  items: { id: string }[];
  containerRef: RefObject<HTMLElement>;
  gridRef: RefObject<HTMLElement>;
  itemRefs: RefObject<Record<string, HTMLElement>>;
  isRTL: boolean;
  arrangeItem?: (id: string, newPosition: number) => void;
}

/**
 * Allows keyboard arrow navigation through grids
 */
function useGridViewKeys({
  currentItemId,
  items,
  containerRef,
  gridRef,
  itemRefs,
  isRTL,
  arrangeItem,
}: UseGridViewKeysProps) {
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);
  const itemIds = useMemo(() => items.map(({ id }) => id), [items]);
  // Navigate focus left, right, up, down
  useEffect(() => {
    setFocusedItemId(currentItemId);
  }, [currentItemId]);

  useKeyDownEffect(
    containerRef,
    { key: ['up', 'down', 'left', 'right'] },
    ({ key, ctrlKey }: KeyboardEvent) => {
      if (ctrlKey) {
        return;
      }
      switch (key) {
        case 'ArrowLeft':
        case 'ArrowRight': {
          const dir = getArrowDir(key, 'ArrowRight', 'ArrowLeft', isRTL);

          if (dir === 0) {
            return;
          }

          const index =
            focusedItemId !== null ? itemIds.indexOf(focusedItemId) : -1;
          const nextIndex = index + dir;
          if (nextIndex < 0 || nextIndex === itemIds.length) {
            return;
          }

          const itemId = itemIds[nextIndex];

          setFocusedItemId(itemId);
          const item = itemRefs?.current?.[itemId];
          focusOnPage(item);
          break;
        }
        case 'ArrowUp':
        case 'ArrowDown': {
          if (!gridRef.current) {
            return;
          }
          const { rows: numRows, columns: numColumns } =
            getGridColumnAndRowCount(gridRef.current, itemIds.length);
          const currentIndex =
            focusedItemId !== null ? itemIds.indexOf(focusedItemId) : -1;
          const dir = key === 'ArrowDown' ? 1 : -1;

          const currentRow = getRow(currentIndex, numColumns);
          const currentColumn = getColumn(currentIndex, numColumns);

          const nextIndex = getIndex({
            row: currentRow + dir,
            column: currentColumn,
            numRows,
            numColumns,
            numItems: itemIds.length,
          });
          if (nextIndex < 0) {
            return;
          }
          const itemId = itemIds[nextIndex];
          setFocusedItemId(itemId);
          const item = itemRefs?.current?.[itemId];
          focusOnPage(item);
          break;
        }
        default:
          break;
      }
    },
    [focusedItemId, isRTL, itemIds, itemRefs, gridRef, currentItemId]
  );

  // jump to beginning or end of row and set active state. do this after normal keydown is good to go
  // Rearrange pages
  useKeyDownEffect(
    containerRef,
    { key: ['mod+up', 'mod+down', 'mod+left', 'mod+right'], shift: true },
    (e) => {
      const { key, shiftKey } = e;
      let canArrange = false,
        nextIndex;
      // Cancel the default behavior of the event: it's very jarring to run
      // into mod+left/right triggering the browser's back/forward navigation.
      e.preventDefault();

      switch (key) {
        case 'ArrowLeft':
        case 'ArrowRight': {
          const dir = getArrowDir(key, 'ArrowRight', 'ArrowLeft', isRTL);

          if (dir === 0) {
            return;
          }

          const currentIndex =
            focusedItemId !== null ? itemIds.indexOf(focusedItemId) : -1;
          nextIndex = currentIndex;

          // If the user is pressing shift, jump to the beginning/end
          if (shiftKey) {
            nextIndex = dir < 0 ? 0 : itemIds.length - 1;
          } else {
            nextIndex += dir;
          }

          canArrange =
            nextIndex !== currentIndex &&
            nextIndex >= 0 &&
            nextIndex <= itemIds.length - 1;

          break;
        }
        case 'ArrowUp':
        case 'ArrowDown': {
          if (!gridRef.current) {
            return;
          }
          const { rows: numRows, columns: numColumns } =
            getGridColumnAndRowCount(gridRef.current, itemIds.length);
          const currentIndex =
            focusedItemId !== null ? itemIds.indexOf(focusedItemId) : -1;
          const dir = key === 'ArrowDown' ? 1 : -1;

          const currentRow = getRow(currentIndex, numColumns);
          const currentColumn = getColumn(currentIndex, numColumns);

          nextIndex = getIndex({
            row: currentRow + dir,
            column: currentColumn,
            numRows,
            numColumns,
            numItems: itemIds.length,
          });

          if (nextIndex < 0) {
            return;
          }

          break;
        }

        default:
          break;
      }

      if (canArrange && nextIndex) {
        if (arrangeItem && focusedItemId) {
          arrangeItem(focusedItemId, nextIndex);
        }

        // Focus on DOM element where this page is moving to
        const item = itemRefs?.current?.[itemIds[nextIndex]];
        focusOnPage(item);
      }
    },
    [
      currentItemId,
      itemIds,
      isRTL,
      gridRef,
      itemRefs,
      focusedItemId,
      arrangeItem,
    ]
  );
}

export default useGridViewKeys;
