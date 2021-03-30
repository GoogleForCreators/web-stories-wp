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
import { updateElementWithUpdater } from './utils';

/**
 * Update elements by the given Resource id with the given properties.
 *
 * Elements will be updated through all pages with correct id.
 *
 * If an empty id or a no matches with id, state is unchanged.
 *
 * If given set of properties is empty, state is unchanged.
 *
 * Current selection and page is unchanged.
 *
 * @param {Object} state Current state
 * @param {Object} payload Action payload
 * @param {string|null} payload.id id Update all elements with this resource id
 * @param {Object|function(Object):Object} payload.properties Properties to set on all the given elements or
 * a function to calculate new values based on the current properties.
 * @return {Object} New state
 */
function updateElementsByResourceId(
  state,
  { id, properties: propertiesOrUpdater }
) {
  if (id === null) {
    return state;
  }
  const updatedPages = state.pages.map((page, pageIndex) => {
    const updatedElements = page.elements.map((element) => {
      if (element.resource?.id === id) {
        return updateElementWithUpdater(
          element,
          propertiesOrUpdater,
          pageIndex
        );
      }
      return element;
    });
    return {
      ...page,
      elements: updatedElements,
    };
  });

  return {
    ...state,
    pages: updatedPages,
  };
}

export default updateElementsByResourceId;
