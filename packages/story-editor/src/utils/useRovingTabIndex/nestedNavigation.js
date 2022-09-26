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

const SELECTOR = '[tabIndex="-1"]:not(:disabled)';

/**
 * Gets the ancestor element of the active element based on given depth.
 *
 * @param {Object} e Original element to get the parent of.
 * @param {number} depth Nesting depth of the element to see how far up we have to look for the ancestor.
 * @return {Object} Found element.
 */
export function getAncestorByDepth(e, depth) {
  let parentElement,
    counter = depth;

  while (counter > 0) {
    if (!parentElement) {
      parentElement = e.parentElement;
    } else {
      parentElement = parentElement?.parentElement;
    }
    counter--;
  }
  return parentElement;
}

export function getFocusableChild(element, depth, childToGet = 'firstChild') {
  const parentElement = getAncestorByDepth(element, depth);
  const firstElementParent = parentElement.parentNode[childToGet];
  // First non-disabled child with tabIndex -1.
  return firstElementParent.querySelector(SELECTOR);
}

/**
 * Given an element, nesting depth and a direction, returns that element's next enabled active element.
 *
 * @param {Element} e The element.
 * @param {string} direction The sibling direction (previousSibling or nextSibling).
 * @param {number} depth Nesting depth.
 * @return {Element} The sibling.
 */
export function getNextEnabledElement(e, direction, depth) {
  const parentElement = getAncestorByDepth(e, depth);
  if (parentElement) {
    const nextElementParent = parentElement[direction];
    if (!nextElementParent) {
      return null;
    }
    // Get the first child that is not disabled and has tabindex -1.
    return nextElementParent.querySelector(SELECTOR);
  }
  return null;
}
