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
import { ELEMENT_RESERVED_PROPERTIES } from '../types';
import { LinkType } from '../../../../components/link';
import { intersect, objectWithout } from './utils';

/**
 * Update elements by the given list of ids with the given properties.
 * If given list of ids is `null`, update all currently selected elements.
 *
 * Elements will be updated only on the current page.
 *
 * If an element id does not correspond do an element on the current page, id is ignored.
 *
 * If an empty list or a list of only unknown ids is given, state is unchanged.
 *
 * If given set of properties is empty, state is unchanged.
 *
 * Current selection and page is unchanged.
 *
 * @param {Object} state Current state
 * @param {Object} payload Action payload
 * @param {Array.<string>} payload.elementIds List of elements to update
 * @param {Object|function(Object):Object} payload.properties Properties to set on all the given elements or
 * a function to calculate new values based on the current properties.
 * @return {Object} New state
 */
function updateElements(
  state,
  { elementIds, properties: propertiesOrUpdater }
) {
  const idsToUpdate = elementIds === null ? state.selection : elementIds;

  if (idsToUpdate.length === 0) {
    return state;
  }

  const pageIndex = state.pages.findIndex(({ id }) => id === state.current);

  const oldPage = state.pages[pageIndex];
  const pageElementIds = oldPage.elements.map(({ id }) => id);

  // Nothing to update?
  const hasAnythingToUpdate = intersect(pageElementIds, idsToUpdate).length > 0;
  if (!hasAnythingToUpdate) {
    return state;
  }

  const updatedElements = oldPage.elements.map((element) => {
    if (!idsToUpdate.includes(element.id)) {
      return element;
    }
    const properties =
      typeof propertiesOrUpdater === 'function'
        ? propertiesOrUpdater(element)
        : propertiesOrUpdater;
    const allowedProperties = objectWithout(
      properties,
      ELEMENT_RESERVED_PROPERTIES
    );
    if (Object.keys(allowedProperties).length === 0) {
      return element;
    }
    // One-tap links aren't allowed on the cover page
    if (allowedProperties?.link?.type === LinkType.ONE_TAP && pageIndex === 0) {
      allowedProperties.link.type = LinkType.TWO_TAP;
    }
    return { ...element, ...allowedProperties };
  });

  const newPage = {
    ...oldPage,
    elements: updatedElements,
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

export default updateElements;
