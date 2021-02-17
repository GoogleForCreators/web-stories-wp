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
import ResizeObserver from 'resize-observer-polyfill';

/**
 * Internal dependencies
 */
import { BEZIER } from '../../../../animation';
import { TRANSITION_DURATION } from '../constants';

/**
 * Removes inner Element from the layout flow without disrupting
 * visual layout. Adds transition for height of outer Element
 * So it animates if it changes.
 *
 * @param {HTMLElement} innerEl - element we're removing from layout flow
 * @param {HTMLElement} outerEl - element we're applying height to
 * @return {Function} cleanup method
 */
export function removeInnerElementFromLayoutFlow(innerEl, outerEl) {
  if (!innerEl || !outerEl) {
    return () => {};
  }

  // Explicitly set height of outer container to not
  // disrupt current visual layout.
  const { height } = innerEl.getBoundingClientRect();
  outerEl.style.height = `${height}px`;

  // Remove inner element from layout flow
  innerEl.style.position = 'absolute';
  innerEl.style.bottom = 0;
  innerEl.style.content = 'contain';

  // Applying transition on separate frame as a
  // change to the animated property. This prevents any
  // content flash.
  //
  // Only way to guarentee the frame after styles
  // get applied is to do 2 frames from now.
  let id = requestAnimationFrame(() => {
    id = requestAnimationFrame(() => {
      outerEl.style.transition = `height ${TRANSITION_DURATION}ms ${BEZIER.default}`;
    });
  });
  return () => cancelAnimationFrame(id);
}

/**
 * Adds a resize observer and observes the inner element. Applies all
 * changes of height from the inner element to the outer element.
 *
 * @param {HTMLElement} innerEl - element we're reading changes of height from
 * @param {HTMLElement} outerEl - element we're applying height to
 * @return {Function} cleanup method
 */
export function syncOuterHeightWithInner(innerEl, outerEl) {
  if (!innerEl) {
    return () => {};
  }
  const observer = new ResizeObserver((entries) => {
    const measureEl = entries?.[0];
    if (!measureEl || !outerEl) {
      return;
    }
    outerEl.style.height = `${measureEl.contentRect.height}px`;
  });
  observer.observe(innerEl);
  return () => observer.unobserve(innerEl);
}
