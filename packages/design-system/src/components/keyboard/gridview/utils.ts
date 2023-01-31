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

// @todo: provide a cleaner `focusFirst()` API and takes into account
// `tabIndex`, `disabled`, links, buttons, inputs, etc.
export function focusOnPage(page: Element | undefined) {
  // grab the first focusable element available.
  // currently can be a button or an anchor.
  const button = page?.querySelector('button, a') as
    | HTMLButtonElement
    | HTMLAnchorElement;
  if (button) {
    button.focus();
  }
}

export function getArrowDir(
  key: string,
  pos: string,
  neg: string,
  isRTL: boolean
) {
  const rtlDir = isRTL ? -1 : 1;
  if (key === pos) {
    return rtlDir;
  }
  if (key === neg) {
    return -1 * rtlDir;
  }
  return 0;
}

export function getGridColumnAndRowCount(grid: HTMLElement, pageCount: number) {
  let columns = 0;
  let prevX;
  for (const el of grid.children) {
    const { x } = el.getBoundingClientRect();
    if (typeof prevX !== 'undefined' && x < prevX) {
      break;
    }
    prevX = x;
    columns++;
  }

  const rows = Math.ceil(pageCount / columns);

  return { rows, columns };
}

// will return a 1 based index
export function getRow(index: number, numColumns: number) {
  return Math.ceil((index + 1) / numColumns);
}

// will return a 1 based index
export function getColumn(index: number, numColumns: number) {
  return (index % numColumns) + 1;
}

// will return a 0 based index
export function getIndex({
  row,
  column,
  numRows,
  numColumns,
  numItems,
}: {
  row: number;
  column: number;
  numRows: number;
  numColumns: number;
  numItems: number;
}) {
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
