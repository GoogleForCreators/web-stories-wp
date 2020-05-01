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
import deleteElements from './deleteElements';
import updateElements from './updateElements';

/**
 * Combine elements by taking properties from a first item and
 * adding them to the given second item
 *
 * @param {Object} state Current state
 * @param {Object} payload Action payload
 * @param {string} payload.firstId Element to take properties from
 * @param {string} payload.secondId Element to add properties to
 * @return {Object} New state
 */
function combineElements(state, { firstId, secondId }) {
  if (!firstId || !secondId) {
    return state;
  }

  const page = state.pages.find(({ id }) => id === state.current);
  const element = page.elements.find(({ id }) => id === firstId);

  if (!element || !element.resource) {
    return state;
  }

  const {
    resource,
    scale = 100,
    focalX = 50,
    focalY = 50,
    isFill = false,
  } = element;

  const updatedState = updateElements(state, {
    elementIds: [secondId],
    properties: {
      resource,
      type: resource.type,
      scale,
      focalX,
      focalY,
      isFill,
    },
  });
  return deleteElements(updatedState, { elementIds: [firstId] });
}

export default combineElements;
