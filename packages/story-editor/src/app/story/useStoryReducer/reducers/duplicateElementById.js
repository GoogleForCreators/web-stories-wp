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
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { getPastedCoordinates } from '../../../../utils/copyPaste';

function duplicateElementById(state, { elementId }) {
  const pageIndex = state.pages.findIndex(({ id }) => id === state.current);
  const oldPage = state.pages[pageIndex];

  const elementIndex = oldPage.elements.findIndex(({ id }) => id === elementId);

  if (elementIndex < 0) {
    return state;
  }

  const elementToDuplicate = oldPage.elements[elementIndex];

  if (elementToDuplicate.isBackground) {
    return state;
  }

  const duplicatedElement = {
    ...elementToDuplicate,
    ...getPastedCoordinates(elementToDuplicate.x, elementToDuplicate.y),
    id: uuidv4(),
  };

  const duplicatedAnimations = (state.animations || [])
    .filter((animation) => animation.targets.includes(elementToDuplicate.id))
    .map((animation) => ({
      ...animation,
      targets: [duplicatedElement.id],
      id: uuidv4(),
    }));

  const newPage = {
    ...oldPage,
    animations: [...(oldPage.animations || []), ...duplicatedAnimations],
    elements: [
      ...oldPage.elements.slice(0, elementIndex),
      elementToDuplicate,
      duplicatedElement,
      ...oldPage.elements.slice(elementIndex + 1),
    ],
  };

  const newPages = [
    ...state.pages.slice(0, pageIndex),
    newPage,
    ...state.pages.slice(pageIndex + 1),
  ];

  return {
    ...state,
    pages: newPages,
  };
}

export default duplicateElementById;
