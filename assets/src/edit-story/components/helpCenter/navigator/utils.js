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

export function removeInnerElementFromLayoutFlow(innerEl, outerEl) {
  if (!innerEl || !outerEl) {
    return () => {};
  }

  // Explicitly set height of container, and disconnect
  // inner content from layout flow.
  const { height } = innerEl.getBoundingClientRect();
  outerEl.style.height = `${height}px`;
  innerEl.style.position = 'absolute';
  innerEl.style.bottom = 0;
  innerEl.style.content = 'contain';

  // Applying transition on separate frame as a
  // change to an animated property prevents any
  // content flash. Only way to guarentee the frame
  // after styles get applied is to do 2 frames from now.
  let id = requestAnimationFrame(() => {
    id = requestAnimationFrame(() => {
      outerEl.style.transition = `0.3s height ${BEZIER.default}`;
    });
  });
  return () => cancelAnimationFrame(id);
}

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
