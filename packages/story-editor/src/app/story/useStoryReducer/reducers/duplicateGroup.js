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
import { duplicateElement } from '@googleforcreators/elements';
/**
 * Internal dependencies
 */
import addGroup from './addGroup';
import arrangeElement from './arrangeElement';

/**
 * Duplicate group with all elements on the current page.
 * Set selected elements to be the newly created group.
 *
 * @param {Object} state Current state
 * @param {Object} payload Action payload
 * @param {string} payload.oldGroupId Id of a group to duplicate.
 * @param {string} payload.groupId New group id.
 * @param {string} payload.name New group name.
 * @param {string} payload.isLocked Is group locked.
 * @return {Object} New state
 */
function duplicateGroup(state, { oldGroupId, groupId, name, isLocked }) {
  // Add group.
  const stateWithGroup = addGroup(state, { groupId, name, isLocked });
  const pageIndex = stateWithGroup.pages.findIndex(
    ({ id }) => id === stateWithGroup.current
  );
  const oldPage = stateWithGroup.pages[pageIndex];
  const newSelection = [];
  const newPage = { ...oldPage };
  const elementIds = newPage.elements
    .filter((el) => el.groupId === oldGroupId)
    .map((el) => el.id);

  elementIds.forEach((elementId) => {
    const elementIndex = newPage.elements.findIndex(
      ({ id }) => id === elementId
    );

    if (elementIndex < 0) {
      return;
    }

    const elementToDuplicate = newPage.elements[elementIndex];

    if (elementToDuplicate.isBackground) {
      return;
    }

    const { element, elementAnimations } = duplicateElement({
      element: elementToDuplicate,
      animations: oldPage.animations,
      existingElements: oldPage.elements,
    });

    element.groupId = groupId;
    newSelection.push(element.id);

    newPage.animations = [...(newPage.animations || []), ...elementAnimations];
    newPage.elements = [
      ...newPage.elements.slice(0, elementIndex),
      elementToDuplicate,
      element,
      ...newPage.elements.slice(elementIndex + 1),
    ];

    return;
  });

  // Do nothing if no new elements
  if (!newSelection.length) {
    return state;
  }

  const newPages = [
    ...state.pages.slice(0, pageIndex),
    newPage,
    ...state.pages.slice(pageIndex + 1),
  ];

  let finalState = {
    ...state,
    pages: newPages,
    selection: newSelection,
  };

  // Fix the order
  const newGroupElements = newPage.elements.filter(
    (el) => el.groupId === groupId
  );
  const elementFromGroupWithHighestPosition = Math.max(
    ...newGroupElements.map((el) =>
      newPage.elements.findIndex(({ id }) => id === el?.id)
    )
  );
  for (const [index, element] of newGroupElements.reverse().entries()) {
    const position = newPage.elements.findIndex(({ id }) => id === element?.id);
    if (position !== elementFromGroupWithHighestPosition) {
      const newPosition = elementFromGroupWithHighestPosition - index;
      finalState = arrangeElement(finalState, {
        elementId: element.id,
        position: newPosition,
      });
    }
  }

  return finalState;
}

export default duplicateGroup;
