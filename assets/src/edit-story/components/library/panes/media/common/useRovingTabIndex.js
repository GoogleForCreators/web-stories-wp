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
 * @return {string} Either `previousSibling` or `nextSibling`.
 */
function getSiblingSelector(isRTL, key) {
  return !isRTL && (key === 'ArrowLeft' || key === 'ArrowUp')
    ? ['previousSibling']
    : 'nextSibling';
}

/**
 * Given an element and a sibling selector, returns that media element's sibling.
 * Media elements are nested 1 level deep.
 *
 * @param {Element} e The element.
 * @param {string} siblingSelector The sibling selector (previousSibling or nextSibling).
 * @return {Element} The sibling.
 */
function getNextSibling(e, siblingSelector) {
  return (
    e.parentNode[siblingSelector] && e.parentNode[siblingSelector].firstChild
  );
}

/**
 * Given an element, returns the closest following (or previous) sibling in 2D
 * space that is in a different row.
 *
 * @param {Element} element The element.
 * @param {string} siblingSelector The sibling selector.
 * @return {?Element} The closest sibling in the following (or previous) row.
 */
function getClosestValidSibling(element, siblingSelector) {
  const elementCenter = getCenter(element);
  // Iterate for the next siblings and get the closest one in a different row.
  let closestValidSibling = null;
  let closestValidSiblingCenter = null;
  let closestValidSiblingDistanceSq = null;
  for (
    let sibling = getNextSibling(element, siblingSelector);
    sibling;
    sibling = getNextSibling(sibling, siblingSelector)
  ) {
    const siblingCenter = getCenter(sibling);
    if (Math.floor(siblingCenter.y) === Math.floor(elementCenter.y)) {
      // Same row, not useful. Keep looking.
      continue;
    }
    if (
      closestValidSibling &&
      Math.floor(siblingCenter.y) > Math.floor(closestValidSiblingCenter.y)
    ) {
      // We're past the next row, stop.
      break;
    }
    const distanceSq = getDistanceSq(elementCenter, siblingCenter);
    if (
      !closestValidSiblingDistanceSq ||
      distanceSq < closestValidSiblingDistanceSq
    ) {
      closestValidSiblingDistanceSq = distanceSq;
      closestValidSiblingCenter = siblingCenter;
      closestValidSibling = sibling;
    }
  }
  return closestValidSibling;
}

/**
 * Returns a callback for the keydown event raised by a MediaElement.
 *
 * @param {Object} obj Parameters object
 * @param {boolean} obj.isRTL Whether the document is RTL.
 * @return {function({event: Event, target: Object})} The onKeyDown handler wrapper.
 */
function onKeyDown({ isRTL }) {
  return (eventDetails) => {
    const element = eventDetails.target.current;
    const switchFocusToElement = (e) => {
      element.tabIndex = -1;
      e.tabIndex = 0;
      e.focus();
    };
    const key = eventDetails.event.key;
    const siblingSelector = getSiblingSelector(isRTL, key);
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      const sibling = getNextSibling(element, siblingSelector);
      if (sibling) {
        switchFocusToElement(sibling);
      }
    } else if (key === 'ArrowUp' || key === 'ArrowDown') {
      const closestValidSibling = getClosestValidSibling(
        element,
        siblingSelector
      );
      if (closestValidSibling) {
        element.tabIndex = -1;
        closestValidSibling.tabIndex = 0;
        closestValidSibling.focus();
      } else if (key === 'ArrowUp') {
        // First sibling.
        const target = element.parentNode.parentNode.firstChild.firstChild;
        switchFocusToElement(target);
      } else {
        // Last sibling.
        const target = element.parentNode.parentNode.lastChild.firstChild;
        switchFocusToElement(target);
      }
    } else if (key === 'Home') {
      // First sibling.
      const target = element.parentNode.parentNode.firstChild.firstChild;
      switchFocusToElement(target);
    } else if (key === 'End') {
      // Last sibling.
      const target = element.parentNode.parentNode.lastChild.firstChild;
      switchFocusToElement(target);
    }
  };
}

export default function useRovingTabIndex(isRTL) {
  return {
    onKeyDown: onKeyDown(isRTL),
  };
}
