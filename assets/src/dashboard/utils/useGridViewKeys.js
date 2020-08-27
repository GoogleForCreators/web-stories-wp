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
import { useEffect, useMemo, useState } from 'react';

/**
 * Internal dependencies
 */
import { useKeyDownEffect } from './'; // using from edit-story

function useGridViewKeys({
  currentItemId, // currently selected/active item, only updated on 'enter' or 'click' (not relevant here)
  items, // an array of the items in the grid, mostly needed for their ids i think
  ref, // container of grid
  gridRef, // the grid
  itemRefs, // object of refs, one per each grid item, key is the item id
  isRTL,
}) {
  const [focusedItemId, setFocusedItemId] = useState();
  const itemIds = useMemo(() => items.map(({ id }) => id), [items]);
  // Navigate focus left, right, up, down
  useEffect(() => {
    setFocusedItemId(currentItemId);
  }, [currentItemId]);

  useKeyDownEffect(
    ref,
    { key: ['up', 'down', 'left', 'right'] },
    ({ key }) => {
      switch (key) {
        case 'ArrowLeft':
        case 'ArrowRight': {
          const dir = getArrowDir(key, 'ArrowRight', 'ArrowLeft', isRTL);

          if (dir === 0) {
            return;
          }

          const index = itemIds.indexOf(focusedItemId);
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
          const {
            rows: numRows,
            columns: numColumns,
          } = getGridColumnAndRowCount(gridRef?.current, itemIds.length);
          const currentIndex = itemIds.indexOf(focusedItemId);
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
    ref,
    { key: ['mod+up', 'mod+down', 'mod+left', 'mod+right'], shift: true },
    (e) => {
      const { key, shiftKey } = e;
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

          const currentIndex = itemIds.indexOf(focusedItemId);
          let nextIndex = currentIndex;

          // If the user is pressing shift, jump to the beginning/end
          if (shiftKey) {
            nextIndex = dir < 0 ? 0 : itemIds.length - 1;
          } else {
            nextIndex += dir;
          }

          const canArrange =
            nextIndex !== currentIndex &&
            nextIndex >= 0 &&
            nextIndex <= itemIds.length - 1;

          if (canArrange) {
            // Focus on DOM element where this page is moving to
            const item = itemRefs?.current?.[itemIds[nextIndex]];

            focusOnPage(item);
          }

          break;
        }
        case 'ArrowUp':
        case 'ArrowDown': {
          const {
            rows: numRows,
            columns: numColumns,
          } = getGridColumnAndRowCount(gridRef.current, itemIds.length);
          const currentIndex = itemIds.indexOf(focusedItemId);
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

          const canArrange =
            nextIndex !== currentIndex &&
            nextIndex >= 0 &&
            nextIndex <= itemIds.length - 1;
          if (canArrange) {
            // Focus on DOM element where this page is moving to
            const page = itemRefs?.current?.[itemIds[nextIndex]];
            focusOnPage(page);
          }

          break;
        }

        default:
          break;
      }
    },
    [currentItemId, itemIds, isRTL, gridRef, itemRefs, focusedItemId]
  );
}

// @todo: provide a cleaner `focusFirst()` API and takes into account
// `tabIndex`, `disabled`, links, buttons, inputs, etc.
function focusOnPage(item) {
  const button = item?.querySelector('button');
  if (button) {
    button.focus();
  }
}

function getArrowDir(key, pos, neg, isRTL) {
  const rtlDir = isRTL ? -1 : 1;
  if (key === pos) {
    return rtlDir;
  }
  if (key === neg) {
    return -1 * rtlDir;
  }
  return 0;
}

function getGridColumnAndRowCount(grid, itemCount) {
  let columns = 0;
  let prevX;
  for (const el of grid.children) {
    const { x } = el.getBoundingClientRect();
    if (prevX != null && x < prevX) {
      break;
    }
    prevX = x;
    columns++;
  }

  const rows = Math.ceil(itemCount / columns);

  return { rows, columns };
}

// will return a 1 based index
function getRow(index, numColumns) {
  return Math.ceil((index + 1) / numColumns);
}

// will return a 1 based index
function getColumn(index, numColumns) {
  return (index % numColumns) + 1;
}

// will return a 0 based index
function getIndex({ row, column, numRows, numColumns, numItems }) {
  const isOutOfBounds =
    row > numRows || row <= 0 || column > numColumns || column <= 0;

  if (isOutOfBounds) {
    return -1;
  }

  const index = numColumns * (row - 1) + (column - 1);

  // If the index is greater than or equal to numItems default to the last index.
  // This handles the case when we press ArrowDown and there is another row, but
  // the column below is empty. It will default to the last item in the list.
  return index >= numItems ? numItems - 1 : index;
}

export default useGridViewKeys;
