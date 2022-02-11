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
import { useCallback } from '@googleforcreators/react';
import { useKeyDownEffect } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useConfig } from '../../../../../app';

const SELECTOR = '[tabIndex="-1"]:not(:disabled)';

// @todo Combine this with `useRovingTabIndex` so that if depth is set, this file is used, otherwise the default one is used.
// @todo Move common helpers into a shared file between the two.

/**
 * A point in 2D space.
 *
 * @typedef {Object} Point2D A point in 2D space.
 * @property {number} x The X coordinate.
 * @property {number} y The Y coordinate.
 */

/**
 * Returns the center of a given element.
 *
 * @param {Element} e The element
 * @return {Point2D} The coordinates of the center as defined by
 * getBoundingClientRect's `top` and `left` fields.
 */
function getCenter(e) {
  const rect = e.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

/**
 * Calculates the square of the distance between 2 points.
 *
 * @param {Point2D} p1 The first point.
 * @param {Point2D} p2 The second point.
 * @return {number} The square of the distance between the 2 points.
 */
function getDistanceSq(p1, p2) {
  return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
}

/**
 * Returns either `previousSibling` or `nextSibling` depending on whether the
 * document is RTL and the user pressed the left or right key.
 *
 * @param {boolean} isRTL Whether the document is RTL.
 * @param {string} key The key pressed.
 * @return {string} Either `prev` or `next`.
 */
export function getFocusableElementDirection(isRTL, key) {
  const isPreviousDirection = isRTL
    ? key === 'ArrowRight' || key === 'ArrowUp' || key === 'PageUp'
    : key === 'ArrowLeft' || key === 'ArrowUp' || key === 'PageUp';
  return isPreviousDirection ? 'previousSibling' : 'nextSibling';
}

/**
 * Gets the parent element of the active element based on given depth.
 *
 * @param e
 * @param depth
 * @returns {*}
 */
function getParentByDepth(e, depth) {
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

/**
 * Given an element, nesting depth and a direction, returns that element's next enabled active element.
 *
 * @param {Element} e The element.
 * @param {string} direction The sibling direction (previousSibling or nextSibling).
 * @param {number} depth Nesting depth.
 * @return {Element} The sibling.
 */
function getNextEnabledElement(e, direction, depth) {
  const parentElement = getParentByDepth(e, depth);
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

/**
 * Given an element, returns the closest following (or previous) element to focus in 2D
 * space that is in a different row.
 *
 * @param {Element} element The element.
 * @param {string} direction The next element direction.
 * @return {?Element} The closest sibling in the following (or previous) row.
 */
function getClosestValidElement(element, direction, depth) {
  const elementCenter = getCenter(element);
  // Iterate for the next elements and get the closest one in a different row.
  let closestValidElement = null;
  let closestValidElementCenter = null;
  let closestValidElementDistanceSq = null;
  for (
    let nextElement = getNextEnabledElement(element, direction, depth);
    nextElement;
    nextElement = getNextEnabledElement(nextElement, direction, depth)
  ) {
    const nextElementCenter = getCenter(nextElement);
    if (Math.floor(nextElementCenter.y) === Math.floor(elementCenter.y)) {
      // Same row, not useful. Keep looking.
      continue;
    }
    if (
      closestValidElement &&
      Math.floor(nextElementCenter.y) > Math.floor(closestValidElementCenter.y)
    ) {
      // We're past the next row, stop.
      break;
    }
    const distanceSq = getDistanceSq(elementCenter, nextElementCenter);
    if (
      !closestValidElementDistanceSq ||
      distanceSq < closestValidElementDistanceSq
    ) {
      closestValidElementDistanceSq = distanceSq;
      closestValidElementCenter = nextElementCenter;
      closestValidElement = nextElement;
    }
  }
  return closestValidElement;
}

export default function useNestedRovingTabIndex(
  { ref },
  keyEventDeps = [],
  depth = 1
) {
  const { isRTL } = useConfig();
  /**
   * Returns a callback for the keydown event raised by a focused element.
   *
   * @param {Event} event Keydown event.
   */
  const onKeyDown = useCallback(
    ({ key, target }) => {
      const element = target;
      const elementDirection = getFocusableElementDirection(isRTL, key);
      const switchFocusToElement = (e) => {
        if (e) {
          element.tabIndex = -1;
          e.tabIndex = 0;
          e.focus();
          e.scrollIntoView(
            /* alignToTop= */ elementDirection === 'previousSibling'
          );
        }
      };
      if (key === 'ArrowLeft' || key === 'ArrowRight') {
        const nextElement = getNextEnabledElement(
          element,
          elementDirection,
          depth
        );
        if (nextElement) {
          switchFocusToElement(nextElement);
        }
      } else if (key === 'ArrowUp' || key === 'ArrowDown') {
        const closestValidElement = getClosestValidElement(
          element,
          elementDirection,
          depth
        );
        if (closestValidElement) {
          element.tabIndex = -1;
          closestValidElement.tabIndex = 0;
          closestValidElement.focus();
        } else if (key === 'ArrowUp') {
          // First element.
          const parentElement = getParentByDepth(element, depth);
          const firstElementParent = parentElement.parentNode.firstChild;
          // First non-disabled child with tabIndex -1.
          switchFocusToElement(firstElementParent.querySelector(SELECTOR));
        } else {
          // Last element.
          const parentElement = getParentByDepth(element, depth);
          const lastElementParent = parentElement.parentNode.lastChild;
          // First non-disabled child with tabIndex -1.
          switchFocusToElement(lastElementParent.querySelector(SELECTOR));
        }
      } else if (key === 'Home') {
        // First element.
        const parentElement = getParentByDepth(element, depth);
        const firstElementParent = parentElement.parentNode.firstChild;
        // First non-disabled child with tabIndex -1.
        switchFocusToElement(firstElementParent.querySelector(SELECTOR));
      } else if (key === 'End') {
        // Last element.
        const parentElement = getParentByDepth(element, depth);
        const lastElementParent = parentElement.parentNode.lastChild;
        // First non-disabled child with tabIndex -1.
        switchFocusToElement(lastElementParent.querySelector(SELECTOR));
      } else if (key === 'PageDown' || key === 'PageUp') {
        let nextElement = element;
        for (
          let i = 0;
          getNextEnabledElement(element, elementDirection, depth) && i < 5;
          nextElement = getNextEnabledElement(
            nextElement,
            elementDirection,
            depth
          )
        ) {
          i++;
        }
        switchFocusToElement(nextElement);
      }
    },
    [isRTL, depth]
  );

  useKeyDownEffect(
    ref,
    {
      key: ['up', 'down', 'left', 'right', 'pageup', 'pagedown', 'home', 'end'],
    },
    onKeyDown,
    [ref, onKeyDown, ...keyEventDeps]
  );
}
