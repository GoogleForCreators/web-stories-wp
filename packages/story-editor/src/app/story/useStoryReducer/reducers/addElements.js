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
import { ELEMENT_TYPES } from '@googleforcreators/elements';
/**
 * Internal dependencies
 */
import { MAX_PRODUCTS_PER_PAGE } from '../../../../constants';
import { exclusion } from './utils';

/**
 * Add elements to current page.
 *
 * Elements are expected to a be list of element objects with at least an id property.
 * If any element id already exists on the page, element is skipped (not even updated).
 * If multiple elements in the new list have the same id, only the latter is used.
 *
 * If elements aren't a list or an empty list (after duplicates have been filtered), nothing happens.
 *
 * Elements will be added to the front (end) of the list of elements on the current page.
 *
 * Selection is set to be exactly the new elements.
 *
 * @param {Object} state Current state
 * @param {Object} payload Action payload
 * @param {Array.<Object>} payload.elements Elements to insert on the given page.
 * @return {Object} New state
 */
function addElements(state, { elements }) {
  if (!Array.isArray(elements)) {
    return state;
  }

  const pageIndex = state.pages.findIndex(({ id }) => id === state.current);
  const oldPage = state.pages[pageIndex];
  const newElements = exclusion(oldPage.elements, elements);

  if (newElements.length === 0) {
    return state;
  }

  const currentPageProductIds = oldPage?.elements
    ?.filter(({ type }) => type === ELEMENT_TYPES.PRODUCT)
    .map(({ product }) => product?.productId);

  const newElementDuplicateID = newElements
    .filter(
      ({ type, product }) =>
        type === ELEMENT_TYPES.PRODUCT &&
        currentPageProductIds.includes(product?.productId)
    )
    .map(({ id }) => id);

  const newElementNoDuplicateProducts = newElements.filter(
    ({ id }) => newElementDuplicateID && !newElementDuplicateID.includes(id)
  );

  const newElementProducts = newElementNoDuplicateProducts.filter(
    ({ type }) => type === ELEMENT_TYPES.PRODUCT
  );

  const newElementProductsFiltered =
    currentPageProductIds.length + newElementProducts.length <=
    MAX_PRODUCTS_PER_PAGE
      ? newElementProducts
      : [];

  const newElementNoProducts = newElementNoDuplicateProducts.filter(
    ({ type }) => type !== ELEMENT_TYPES.PRODUCT
  );

  const newPageElements = [
    ...newElementNoProducts,
    ...newElementProductsFiltered,
  ];

  if (newPageElements.length === 0) {
    return state;
  }

  const newPage = {
    ...oldPage,
    elements: [...oldPage.elements, ...newPageElements],
  };

  const newPages = [
    ...state.pages.slice(0, pageIndex),
    newPage,
    ...state.pages.slice(pageIndex + 1),
  ];

  const newSelection = newPageElements.map(({ id }) => id);

  return {
    ...state,
    pages: newPages,
    selection: newSelection,
  };
}

export default addElements;
