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
import { useConfig } from '../../app/config';
import {
  getAncestorByDepth,
  getFocusableChild,
  getNextEnabledElement,
} from './nestedNavigation';
import { getNextEnabledSibling } from './flatNavigation';

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

function getNextElement(e, direction, depth) {
  if (depth > 0) {
    return getNextEnabledElement(e, direction, depth);
  }
  return getNextEnabledSibling(e, direction);
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
 * @return {string} Either `previousSibling` or `nextSibling`.
 */
export function getFocusableElementDirection(isRTL, key) {
  const isPreviousDirection = isRTL
    ? key === 'ArrowRight' || key === 'ArrowUp' || key === 'PageUp'
    : key === 'ArrowLeft' || key === 'ArrowUp' || key === 'PageUp';
  return isPreviousDirection ? 'previousSibling' : 'nextSibling';
}

/**
 * Given an element, returns the closest following (or previous) sibling in 2D
 * space that is in a different row.
 *
 * @param {Element} element The element.
 * @param {string} direction The next element direction.
 * @param {number} depth The nesting depth of the focusable element.
 * @return {?Element} The closest sibling in the following (or previous) row.
 */
function getClosestValidElement(element, direction, depth) {
  const elementCenter = getCenter(element);
  // Iterate for the next elements and get the closest one in a different row.
  let closestValidElement = null;
  let closestValidElementCenter = null;
  let closestValidElementDistanceSq = null;
  for (
    let nextElement = getNextElement(element, direction, depth);
    nextElement;
    nextElement = getNextElement(nextElement, direction, depth)
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

/**
 * Keyboard navigation for focusable elements.
 *
 * @param {Object} ref Ref object.
 * @param {Object} ref.ref Ref object or node.
 * @param {Array} keyEventDeps Array of dependencies.
 * @param {number} depth The nesting depth of the focusable element. By default (0) the focusable elements are siblings.
 */
export default function useRovingTabIndex(
  { ref },
  keyEventDeps = [],
  depth = 0
) {
  const { isRTL } = useConfig();

  /**
   * Returns a callback for the keydown event raised by a MediaElement.
   *
   * @param {Event} event Keydown event.
   */
  const onKeyDown = useCallback(
    ({ key, target }) => {
      const element = target;
      const elementDirection = getFocusableElementDirection(isRTL, key);
      const switchFocusToElement = (e) => {
        if (e) {
          const elToScroll = depth > 0 ? getAncestorByDepth(e, depth) : e;
          element.tabIndex = -1;
          e.tabIndex = 0;
          e.focus();
          elToScroll.scrollIntoView(
            /* alignToTop= */ elementDirection === 'previousSibling'
          );
        }
      };
      if (key === 'ArrowLeft' || key === 'ArrowRight') {
        const nextElement = getNextElement(element, elementDirection, depth);
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
          const elToFocus =
            depth > 0
              ? getFocusableChild(element, depth)
              : element.parentNode.firstChild;
          switchFocusToElement(elToFocus);
        } else {
          // Last element.
          const elToFocus =
            depth > 0
              ? getFocusableChild(element, depth, 'lastChild')
              : element.parentNode.lastChild;
          switchFocusToElement(elToFocus);
        }
      } else if (key === 'Home') {
        // First element.
        const elToFocus =
          depth > 0
            ? getFocusableChild(element, depth)
            : element.parentNode.firstChild;
        switchFocusToElement(elToFocus);
      } else if (key === 'End') {
        // Last element.
        const elToFocus =
          depth > 0
            ? getFocusableChild(element, depth, 'lastChild')
            : element.parentNode.lastChild;
        switchFocusToElement(elToFocus);
      } else if (key === 'PageDown' || key === 'PageUp') {
        let sibling = element;
        for (
          let i = 0;
          getNextElement(sibling, elementDirection, depth) && i < 5;
          sibling = getNextElement(sibling, elementDirection, depth)
        ) {
          i++;
        }
        switchFocusToElement(sibling);
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
