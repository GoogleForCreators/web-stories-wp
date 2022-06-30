/*
 * Copyright 2022 Google LLC
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
import arrangeElement from './arrangeElement';

/**
 * Remove element from group.
 *
 * @param {Object} state Current state
 * @param {Object} payload Action payload
 * @param {number} payload.elementId Selected element id
 * @param {number} payload.groupId Selected element group id
 * @return {Object} New state
 */
function removeElementFromGroup(state, { elementId, groupId }) {
  let count = 0;
  let currentPosition = 0;

  const pageIndex = state.pages.findIndex(({ id }) => id === state.current);
  const page = state.pages[pageIndex];
  const elements = page.elements || [];

  for (const [index] of Object.entries(elements).reverse()) {
    if (elements[index].id === elementId) {
      currentPosition = Number(index);
    }

    if (
      elements[index].groupId === groupId &&
      elements[index].id != elementId &&
      currentPosition === 0
    ) {
      count++;
    }
  }

  const finalState = arrangeElement(state, {
    elementId,
    position: currentPosition + count,
  });

  return finalState;
}

export default removeElementFromGroup;
