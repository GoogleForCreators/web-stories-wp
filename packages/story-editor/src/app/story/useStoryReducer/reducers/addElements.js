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
import { produce } from 'immer';

/**
 * Internal dependencies
 */
import { MAX_PRODUCTS_PER_PAGE } from '../../../../constants';
import { exclusion } from './utils';

const isProduct = ({ type }) => type === ELEMENT_TYPES.PRODUCT;
const isNotProduct = ({ type }) => type !== ELEMENT_TYPES.PRODUCT;

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
 * @param {Object} draft Current state
 * @param {Object} payload Action payload
 * @param {Array.<Object>} payload.elements Elements to insert on the given page.
 */
export const addElements = (draft, { elements }) => {
  if (!Array.isArray(elements)) {
    return;
  }

  const page = draft.pages.find(({ id }) => id === draft.current);
  const newElements = exclusion(page.elements, elements);

  if (newElements.length === 0) {
    return;
  }

  // If an element is added, the id is added to this array
  const addedIds = [];

  // Always add non-products if any
  const nonProducts = newElements.filter(isNotProduct);
  if (nonProducts.length) {
    page.elements = page.elements.concat(nonProducts);
    addedIds.push(...nonProducts.map(({ id }) => id));
  }

  // For products, first filter out products that already exist on the page
  const newProducts = newElements.filter(isProduct);
  if (newProducts.length) {
    const currentProducts = page.elements
      .filter(isProduct)
      .map(({ product }) => product?.productId);

    const uniqueProducts = newProducts.filter(
      ({ product }) => !currentProducts.includes(product?.productId)
    );

    // Then, if the number of products after adding these would still be within
    // the limit, add them all, otherwise add none
    if (
      currentProducts.length + uniqueProducts.length <=
      MAX_PRODUCTS_PER_PAGE
    ) {
      page.elements = page.elements.concat(uniqueProducts);
      addedIds.push(...uniqueProducts.map(({ id }) => id));
    }
  }

  // If any elements were added, update selection to match the ids of those
  if (addedIds.length > 0) {
    draft.selection = addedIds;
  }
};

export default produce(addElements);
