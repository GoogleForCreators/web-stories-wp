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
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { OverlayType } from '../../../../utils/backgroundOverlay';
import { PAGE_HEIGHT, PAGE_WIDTH } from '../../../../constants';
import { isInsideRange } from './utils';

/**
 * Insert page at the given position.
 *
 * If position is outside bounds or no position given, new page will be inserted after current page.
 *
 * Current page will be updated to point to the newly inserted page.
 *
 * Selection is cleared.
 *
 * @param {Object} state Current state
 * @param {Object} payload Action payload
 * @param {Object} payload.page Object with properties of new page
 * @param {Object} payload.position Position at which to insert the new page. If null, insert after current
 * @return {Object} New state
 */
function addPage(state, { page, position }) {
  const isWithinBounds =
    position !== null && isInsideRange(position, 0, state.pages.length - 1);
  const currentPageIndex = state.pages.findIndex(
    ({ id }) => id === state.current
  );
  const insertionPoint = isWithinBounds ? position : currentPageIndex + 1;

  const { id } = page;

  const backgroundId = uuidv4();
  // Ensure new page has elements array and background element.
  const newPage = {
    backgroundElementId: backgroundId,
    backgroundOverlay: OverlayType.NONE,
    elements: [
      {
        type: 'shape',
        x: PAGE_WIDTH / 4,
        y: PAGE_HEIGHT / 4,
        width: PAGE_WIDTH / 3,
        height: PAGE_HEIGHT / 3,
        rotationAngle: 0,
        mask: {
          type: 'rectangle',
        },
        flip: {
          vertical: false,
          horizontal: false,
        },
        isBackground: true,
        backgroundColor: {
          color: { r: 255, g: 255, b: 255, a: 1 },
        },
        id: backgroundId,
      },
    ],
    ...page,
  };

  return {
    ...state,
    pages: [
      ...state.pages.slice(0, insertionPoint),
      newPage,
      ...state.pages.slice(insertionPoint),
    ],
    current: id,
    selection: [],
  };
}

export default addPage;
