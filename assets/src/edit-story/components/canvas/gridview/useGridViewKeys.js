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
 * Internal dependencies
 */
/**
 * External dependencies
 */
import { useMemo } from 'react';
import { useState } from 'react';
import { useKeyDownEffect } from '../../keyboard';
import { useStory } from '../../../app';

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

function useGridViewKeys(ref, gridRef, pageRefs, isRTL) {
  const { currentPageId, pages } = useStory(
    ({ state: { pages, currentPageId } }) => ({
      currentPageId,
      pages,
    })
  );

  const [focusedPageId, setFocusedPageId] = useState(currentPageId);

  const pageIds = useMemo(() => pages.map(({ id }) => id), [pages]);

  // Navigate focus left, right, up, down
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

          const index = pageIds.indexOf(focusedPageId);
          const nextIndex = index + dir;

          if (nextIndex < 0 || nextIndex === pageIds.length) {
            return;
          }

          const pageId = pageIds[nextIndex];

          setFocusedPageId(pageId);

          const thumbnail = pageRefs.current && pageRefs.current[pageId];
          // @todo: provide a cleaner `focusFirst()` API and takes into account
          // `tabIndex`, `disabled`, links, buttons, inputs, etc.
          const button = thumbnail?.querySelector('button');
          if (button) {
            button.focus();
          }

          break;
        }
        case 'ArrowUp':
        case 'ArrowDown': {
          const {
            rows: numRows,
            columns: numColumns,
          } = getGridColumnAndRowCount(gridRef);
          const currentIndex = pageIds.indexOf(focusedPageId);
          const dir = key === 'ArrowDown' ? 1 : -1;

          const currentRow = getRow(currentIndex, numColumns);
          const currentColumn = getColumn(currentIndex, numColumns);

          const nextIndex = getIndex(
            currentRow + dir,
            currentColumn,
            numRows,
            numColumns,
            pageIds.length
          );

          if (nextIndex < 0) {
            return;
          }

          const pageId = pageIds[nextIndex];

          setFocusedPageId(pageId);

          const thumbnail = pageRefs.current && pageRefs.current[pageId];
          // @todo: provide a cleaner `focusFirst()` API and takes into account
          // `tabIndex`, `disabled`, links, buttons, inputs, etc.
          const button = thumbnail?.querySelector('button');
          if (button) {
            button.focus();
          }

          break;
        }
        default:
          return;
      }
    },
    [focusedPageId, isRTL, pageIds, pageRefs, gridRef, currentPageId]
  );
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

function getGridColumnAndRowCount(gridRef) {
  const { gridTemplateColumns, gridTemplateRows } = getComputedStyle(
    gridRef.current
  );
  return {
    rows: gridTemplateRows.trim().split(' ').length,
    columns: gridTemplateColumns.trim().split(' ').length,
  };
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
function getIndex(row, column, numRows, numColumns, numItems) {
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
